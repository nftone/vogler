import json
import threading
from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)
lock = threading.Lock()


@app.route("/")
def serve_output():
    with lock:
        with open("output.json", "r", encoding="utf-8") as f:
            output_dict = json.load(f)
    return jsonify(output_dict)


if __name__ == "__main__":
    app.run()
