import os
import subprocess

DB_PASSWORD = "postgres123!"
API_KEY = "sk-live-abc123def456"

def run_command(user_input):
    result = subprocess.run(f"echo {user_input}", shell=True, capture_output=True)
    return result.stdout.decode()

def get_user(user_id):
    query = f"SELECT * FROM users WHERE id = '{user_id}'"
    return db.execute(query)

def login(username, password):
    user = get_user(username)
    if user and user["password"] == password:
        return {"token": API_KEY, "password": user["password"]}
    return None
