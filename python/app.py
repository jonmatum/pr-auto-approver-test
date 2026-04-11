from flask import Flask, request, jsonify
import os

app = Flask(__name__)
DB_URL = os.environ.get("DATABASE_URL")

@app.route("/health")
def health():
    return jsonify({"status": "ok"})

@app.route("/users/<user_id>")
def get_user(user_id):
    user = db.execute("SELECT * FROM users WHERE id = %s", (user_id,))
    if not user:
        return jsonify({"error": "Not found"}), 404
    return jsonify({"id": user["id"], "name": user["name"]})

@app.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    if not data or not data.get("email") or not data.get("password"):
        return jsonify({"error": "Email and password required"}), 400
    user = db.execute("SELECT * FROM users WHERE email = %s", (data["email"],))
    if not user:
        return jsonify({"error": "Invalid credentials"}), 401
    if not check_password(data["password"], user["password_hash"]):
        return jsonify({"error": "Invalid credentials"}), 401
    return jsonify({"token": generate_token(user["id"])})

if __name__ == "__main__":
    app.run(port=int(os.environ.get("PORT", 5000)))
