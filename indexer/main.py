import json
from time import sleep
from datetime import datetime
import requests
import threading

lock = threading.Lock()


def main():
    with open("constants/Creations.json", "r", encoding="utf-8") as f:
        creations_json = json.load(f)
        creations = creations_json["creations"]
        updated_creations = []
        current_timestamp = datetime.now().isoformat()
        updated_creation_index = 0

        for creation in creations:
            updated_creation_index += 1
            print(f"Processing creation {updated_creation_index}/{len(creations)}")
            owner = find_owner_by_tx_hash(creation["h"])
            output_creation = {"owner": owner, "name": creation["name"]}
            updated_creations.append(output_creation)

        output_dict = {"last_update": current_timestamp, "creations": updated_creations}

        with lock:
            with open("output.json", "w", encoding="utf-8") as f:
                json.dump(output_dict, f, indent=4)


def find_owner_by_tx_hash(tx_hash):
    owner, vout = get_owner_or_vout_hash(tx_hash)
    if owner:
        return owner
    return find_owner_by_tx_hash(vout)


def get_owner_or_vout_hash(tx_hash):
    tx = get_tx(tx_hash)
    if tx is None:
        return None, None

    vout = tx["vout"]
    spent_tx = None

    for v in vout:
        if v.get("spent"):
            spent_tx = v
            break

    if spent_tx:
        print(spent_tx, "spent_tx")
        return None, spent_tx["spentTxId"]

    print(vout[0], "vout[0]")
    return vout[0]["scriptpubkey_address"], None


def get_tx(tx_hash):
    sleep(0.4)
    url = f"https://blockstream.info/api/tx/{tx_hash}"
    response = requests.get(url, timeout=10)
    if response.status_code == 200:
        return response.json()
    else:
        print(f"Error: API request failed with status code {response.status_code}")
        return None


main()
