import json
from time import sleep
from datetime import datetime
import threading
import requests

lock = threading.Lock()

transfer_history = {}


class APIRequestError(Exception):
    pass


def main():
    with open("./constants/Creations.json", "r", encoding="utf-8") as f:
        creations_json = json.load(f)
        creations = creations_json["creations"]

        updated_creations = []
        current_timestamp = datetime.now().isoformat()
        updated_creation_index = 0

        for creation in creations:
            updated_creation_index += 1
            print(f"Processing creation {updated_creation_index}/{len(creations)}")

            try:
                transfer_history[creation["slug"]] = []
                owner = find_owner_by_tx_hash(creation["h"], creation["slug"])
                output_creation = {
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

                updated_creations.append(output_creation)

            except APIRequestError as e:
                print(f"Error: {e}")

        output_dict = {"last_update": current_timestamp, "creations": updated_creations}

        with lock:
            with open("./output.json", "w", encoding="utf-8") as f:
                json.dump(output_dict, f, indent=4)


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
    sleep(0.4)
    url = f"https://blockstream.info/api/tx/{tx_hash}"
    response = requests.get(url, timeout=10)
    if response.status_code == 200:
        return response.json()

    raise APIRequestError(f"API request failed with status code {response.status_code}")


def get_address_transactions(address):
    sleep(0.4)
    url = f"https://blockstream.info/api/address/{address}/txs"
    response = requests.get(url, timeout=10)
    if response.status_code == 200:
        return response.json()

    raise APIRequestError(f"API request failed with status code {response.status_code}")


main()
