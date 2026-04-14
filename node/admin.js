const express = require("express");
const app = express();
app.use(express.json());

const escapeHtml = (str) => String(str).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

const ALLOWED_TEMPLATES = {
  greeting: (data) => `Hello, ${escapeHtml(data.name || "")}!`,
  summary: (data) => `Order #${escapeHtml(data.id || "")}: ${escapeHtml(data.status || "")}`,
};

app.post("/template", (req, res) => {
  const templateName = req.body.template;
  if (typeof templateName !== "string" || !ALLOWED_TEMPLATES[templateName]) {
    return res.status(400).json({ error: "Unknown template" });
  }
  const data = req.body.data && typeof req.body.data === "object" ? req.body.data : {};
  res.json({ output: ALLOWED_TEMPLATES[templateName](data) });
});

app.get("/config", (req, res) => {
  res.json({ status: "ok", version: process.env.APP_VERSION || "1.0.0" });
});

app.post("/query", (req, res) => {
  const db = require("./db");
  const status = req.body.status;
  if (!status) return res.status(400).json({ error: "status required" });
  db.raw("SELECT * FROM orders WHERE status = ?", [status]).then((rows) => res.json(rows));
});

app.listen(process.env.PORT || 3001);
