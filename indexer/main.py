import json
import os
import sys
import tempfile
from time import sleep
from datetime import datetime
import requests

# Where the validated snapshot is written. By default this is the file the
# front-end bundles at build time, so re-indexing + a release tag is all it
# takes to publish fresh data. Override with OUTPUT_PATH if needed.
OUTPUT_PATH = os.environ.get(
    "OUTPUT_PATH", os.path.join("..", "front-end", "src", "data", "creations.json")
)

# Transient upstream failures (rate limits, timeouts) are retried before giving
# up, so a flaky blockstream.info no longer silently drops an asset.
MAX_RETRIES = 5
RETRY_BASE_DELAY = 2  # seconds: 2, 4, 8, 16, 32

transfer_history = {}


class APIRequestError(Exception):
    pass


def main():
    with open("./constants/Creations.json", "r", encoding="utf-8") as f:
        creations = json.load(f)["creations"]

    expected_count = len(creations)
    updated_creations = []
    current_timestamp = datetime.now().isoformat()

    for index, creation in enumerate(creations, start=1):
        print(f"Processing creation {index}/{expected_count} ({creation['slug']})")
        try:
            transfer_history[creation["slug"]] = []
            owner = find_owner_by_tx_hash(creation["h"], creation["slug"])
            print(owner, "OWNER")
            updated_creations.append(
                {
                    "owner": owner,
                    "name": creation["name"],
                    "slug": creation["slug"],
                    "image": creation["image"],
                    "inscription": creation["h"],
                    "description": creation["description"],
                    "fileUrl": creation["fileUrl"],
                    "signatureDate": creation["signatureDate"],
                    "signatureUrl": creation["signatureUrl"],
                    "inscriptionDate": creation["inscriptionDate"],
                    "size": creation["size"],
                    "format": creation["format"],
                    "license": creation["license"],
                    "ownerContact": creation["ownerContact"],
                    "history": transfer_history[creation["slug"]],
                }
            )
        except APIRequestError as e:
            print(f"Error indexing {creation['slug']}: {e}")

    # Fail closed: only publish a COMPLETE set. A partial run (the root cause of
    # "half the assets show" / "asset not found") must never overwrite the last
    # known-good data. Better to keep serving stale-but-complete data and alert.
    if len(updated_creations) != expected_count:
        print(
            f"ABORT: indexed {len(updated_creations)}/{expected_count} creations. "
            f"Keeping previous good data, not writing {OUTPUT_PATH}."
        )
        sys.exit(1)

    output_dict = {"last_update": current_timestamp, "creations": updated_creations}
    write_atomic(OUTPUT_PATH, output_dict)
    print(f"OK: wrote {expected_count}/{expected_count} creations to {OUTPUT_PATH}")


def write_atomic(path, data):
    """Write JSON via a temp file + atomic rename so a reader never sees a
    half-written file (and a crash mid-write can't truncate the good data)."""
    directory = os.path.dirname(os.path.abspath(path))
    os.makedirs(directory, exist_ok=True)
    fd, tmp_path = tempfile.mkstemp(dir=directory, suffix=".tmp")
    try:
        with os.fdopen(fd, "w", encoding="utf-8") as f:
            json.dump(data, f, indent=2, ensure_ascii=False)
            f.write("\n")
        os.replace(tmp_path, path)
    except BaseException:
        if os.path.exists(tmp_path):
            os.remove(tmp_path)
        raise


def find_owner_by_tx_hash(tx_hash, creation_slug):
    tx = get_tx_by_hash(tx_hash)
    vout = tx["vout"]

    for v in vout:
        if v.get("value", 0) > 0:
            sender = tx["vin"][0]["prevout"]["scriptpubkey_address"]
            transfer_history[creation_slug].append(
                {
                    "blockTime": tx.get("status").get("block_time"),
                    "txid": tx.get("txid"),
                    "sender": sender,
                    "recipient": v.get("scriptpubkey_address"),
                }
            )
            return find_owner_by_address(v.get("scriptpubkey_address"), creation_slug)

    return vout[0]["scriptpubkey_address"]


def find_owner_by_address(tx_address, creation_slug):
    potential_owner_txs = get_address_transactions(tx_address)

    for tx in potential_owner_txs:
        for vout in tx["vout"]:
            if (
                vout.get("value", 0) > 0
                and vout.get("scriptpubkey_address") != tx_address
            ):
                transfer_history[creation_slug].append(
                    {
                        "blockTime": tx.get("status").get("block_time"),
                        "txid": tx.get("txid"),
                        "sender": tx_address,
                        "recipient": vout.get("scriptpubkey_address"),
                    }
                )
                return find_owner_by_address(
                    vout["scriptpubkey_address"], creation_slug
                )

    return tx_address


def get_tx_by_hash(tx_hash):
    return _get_json(f"https://blockstream.info/api/tx/{tx_hash}")


def get_address_transactions(address):
    return _get_json(f"https://blockstream.info/api/address/{address}/txs")


def _get_json(url):
    """GET with retry + exponential backoff. Raises APIRequestError only after
    all retries are exhausted, so a brief upstream hiccup self-heals."""
    last_error = None
    for attempt in range(MAX_RETRIES):
        sleep(0.4)  # be polite to the public API
        try:
            response = requests.get(url, timeout=10)
            if response.status_code == 200:
                return response.json()
            last_error = f"status {response.status_code}"
        except requests.RequestException as e:
            last_error = str(e)

        if attempt < MAX_RETRIES - 1:
            delay = RETRY_BASE_DELAY * (2**attempt)
            print(f"  retry {attempt + 1}/{MAX_RETRIES - 1} for {url} ({last_error}) in {delay}s")
            sleep(delay)

    raise APIRequestError(f"request to {url} failed after {MAX_RETRIES} tries: {last_error}")


if __name__ == "__main__":
    main()
