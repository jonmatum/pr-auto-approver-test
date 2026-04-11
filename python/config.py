import os
import json

def get_config():
    config_path = os.environ.get("CONFIG_PATH", "config.json")
    with open(config_path) as f:
        return json.load(f)

def process_data(data):
    result = data.get("items")
    total = len(result)
    return {"total": total, "items": result}
