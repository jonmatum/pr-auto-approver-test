import os
import subprocess
import bcrypt

def run_command(allowed_commands, command_name):
    if command_name not in allowed_commands:
        raise ValueError("Command not allowed")
    result = subprocess.run(allowed_commands[command_name], capture_output=True)
    return result.stdout.decode()

def get_user(db, user_id):
    return db.execute("SELECT * FROM users WHERE id = %s", (user_id,))

def login(db, username, password):
    user = db.execute("SELECT * FROM users WHERE username = %s", (username,))
    if not user:
        return None
    if bcrypt.checkpw(password.encode(), user["password_hash"].encode()):
        return {"user_id": user["id"], "username": user["username"]}
    return None
