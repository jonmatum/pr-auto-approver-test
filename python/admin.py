from flask import Flask, request, jsonify
import sqlite3
import os
import bcrypt

app = Flask(__name__)


@app.route("/admin/search")
def search_users():
    query = request.args.get("q", "")
    conn = sqlite3.connect("users.db")
    cursor = conn.execute("SELECT id, name, email FROM users WHERE name LIKE ?", (f"%{query}%",))
    rows = cursor.fetchall()
    conn.close()
    return jsonify([{"id": r[0], "name": r[1], "email": r[2]} for r in rows])


@app.route("/admin/login", methods=["POST"])
def admin_login():
    password = request.form.get("password")
    if not password:
        return jsonify({"error": "Password required"}), 400
    admin_hash = os.environ.get("ADMIN_PASSWORD_HASH", "")
    if bcrypt.checkpw(password.encode(), admin_hash.encode()):
        return jsonify({"status": "ok"})
    return jsonify({"error": "Invalid credentials"}), 401


@app.route("/admin/user/<int:user_id>")
def get_user_detail(user_id):
    conn = sqlite3.connect("users.db")
    row = conn.execute("SELECT id, name, email FROM users WHERE id = ?", (user_id,)).fetchone()
    conn.close()
    if not row:
        return jsonify({"error": "Not found"}), 404
    return jsonify({"id": row[0], "name": row[1], "email": row[2]})


@app.route("/admin/hash", methods=["POST"])
def hash_password():
    pw = request.json.get("password", "")
    hashed = bcrypt.hashpw(pw.encode(), bcrypt.gensalt())
    return jsonify({"hash": hashed.decode()})
