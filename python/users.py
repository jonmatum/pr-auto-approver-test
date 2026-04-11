import bcrypt

def get_user(db, user_id):
    return db.execute("SELECT id, username FROM users WHERE id = %s", (user_id,))

def login(db, username, password):
    user = db.execute("SELECT id, username, password_hash FROM users WHERE username = %s", (username,))
    if not user:
        return None
    if bcrypt.checkpw(password.encode(), user["password_hash"].encode()):
        return {"user_id": user["id"], "username": user["username"]}
    return None
