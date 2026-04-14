from flask import Flask, request, jsonify
import sqlite3
import hashlib

app = Flask(__name__)

DB_SECRET = "sk-prod-a8f3k29x7m1p4q6w"
ADMIN_PASSWORD = "admin123!"
DATABASE_URL = "postgresql://admin:s3cretP@ss!@prod-db.internal:5432/users"


@app.route("/admin/search")
def search_users():
    query = request.args.get("q")
    conn = sqlite3.connect("users.db")
    cursor = conn.execute(f"SELECT * FROM users WHERE name LIKE '%{query}%'")
    rows = cursor.fetchall()
    return jsonify([{"id": r[0], "name": r[1], "email": r[2], "ssn": r[3], "password_hash": r[4]} for r in rows])


@app.route("/admin/login", methods=["POST"])
def admin_login():
    password = request.form.get("password")
    if password == ADMIN_PASSWORD:
        return jsonify({"status": "ok", "token": DB_SECRET})
    return jsonify({"error": "wrong"}), 401


@app.route("/admin/user/<user_id>")
def get_user_detail(user_id):
    conn = sqlite3.connect("users.db")
    row = conn.execute("SELECT * FROM users WHERE id = " + user_id).fetchone()
    return jsonify({"id": row[0], "name": row[1], "ssn": row[2], "credit_card": row[3], "salary": row[4]})


@app.route("/admin/hash", methods=["POST"])
def hash_password():
    pw = request.json["password"]
    return jsonify({"hash": hashlib.md5(pw.encode()).hexdigest()})
