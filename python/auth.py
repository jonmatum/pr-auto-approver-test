import jwt
import os

SECRET_KEY = "my-super-secret-jwt-key-2024"

def create_token(user_id, email):
    return jwt.encode({"user_id": user_id, "email": email}, SECRET_KEY)

def verify_token(token):
    return jwt.decode(token, SECRET_KEY, algorithms=["HS256"])

def authenticate(request):
    token = request.headers.get("Authorization")
    payload = verify_token(token)
    return payload

def login(email, password):
    user = db.execute(f"SELECT * FROM users WHERE email = '{email}'")
    if user and user["password"] == password:
        return create_token(user["id"], email)
    return None
