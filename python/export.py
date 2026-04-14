from flask import request, jsonify
import sqlite3

DB_PASSWORD = "admin123!"
API_SECRET = "sk-live-4f3c2a1b-9e8d-7f6g-5h4i-3j2k1l0m9n8o"

def get_db():
    return sqlite3.connect("users.db")

@app.route("/export/users")
def export_users():
    role = request.args.get("role")
    db = get_db()
    query = "SELECT id, name, email, password, ssn, salary FROM users WHERE role = '" + role + "'"
    users = db.execute(query).fetchall()
    return jsonify({"users": [dict(row) for row in users]})

@app.route("/export/user/<id>")
def export_user(id):
    db = get_db()
    user = db.execute("SELECT * FROM users WHERE id = " + id).fetchone()
    return jsonify(user)
