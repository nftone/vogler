from flask import Flask, jsonify
import json
import threading

app = Flask(__name__)
lock = threading.Lock()


@app.route("/output")
def serve_output():
    with lock:
        with open("output.json", "r", encoding="utf-8") as f:
            output_dict = json.load(f)
    return jsonify(output_dict)


if __name__ == "__main__":
    app.run()
