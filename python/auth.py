import jwt
import bcrypt
import os

SECRET_KEY = os.environ.get("JWT_SECRET")

def create_token(user_id, email):
    return jwt.encode({"user_id": user_id, "email": email}, SECRET_KEY, algorithm="HS256")

def verify_token(token):
    return jwt.decode(token, SECRET_KEY, algorithms=["HS256"])

def authenticate(request):
    token = request.headers.get("Authorization")
    if not token:
        return None
    return verify_token(token)

def login(email, password):
    user = db.execute("SELECT * FROM users WHERE email = %s", (email,))
    if user and bcrypt.checkpw(password.encode(), user["password_hash"].encode()):
        return create_token(user["id"], email)
    return None
