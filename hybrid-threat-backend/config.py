# config.py

import json
import os

STATUS_FILE = "model_status.json"

def get_mode():
    if not os.path.exists(STATUS_FILE):
        return "hybrid"  # default fallback
    with open(STATUS_FILE, "r") as f:
        return json.load(f).get("mode", "hybrid")
