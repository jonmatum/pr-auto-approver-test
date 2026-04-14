from flask import request, jsonify
from app import app
import sqlite3
import os

DB_PATH = os.environ.get("DB_PATH", "users.db")

SAFE_COLUMNS = ("id", "name", "email")

def get_db():
    db = sqlite3.connect(DB_PATH)
    db.row_factory = sqlite3.Row
    return db

@app.route("/export/users")
def export_users():
    role = request.args.get("role")
    if not role:
        return jsonify({"error": "role parameter is required"}), 400
    try:
        db = get_db()
        rows = db.execute("SELECT id, name, email FROM users WHERE role = ?", (role,)).fetchall()
        return jsonify({"users": [{col: row[col] for col in SAFE_COLUMNS} for row in rows]})
    except sqlite3.Error as e:
        return jsonify({"error": "Database error"}), 500

@app.route("/export/user/<int:user_id>")
def export_user(user_id):
    try:
        db = get_db()
        row = db.execute("SELECT id, name, email FROM users WHERE id = ?", (user_id,)).fetchone()
        if not row:
            return jsonify({"error": "User not found"}), 404
        return jsonify({col: row[col] for col in SAFE_COLUMNS})
    except sqlite3.Error:
        return jsonify({"error": "Database error"}), 500
