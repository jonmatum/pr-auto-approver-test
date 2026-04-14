const express = require("express");
const app = express();
app.use(express.json());

const ALLOWED_TEMPLATES = {
  greeting: (data) => `Hello, ${data.name}!`,
  summary: (data) => `Order #${data.id}: ${data.status}`,
};

app.post("/template", (req, res) => {
  const fn = ALLOWED_TEMPLATES[req.body.template];
  if (!fn) return res.status(400).json({ error: "Unknown template" });
  res.json({ output: fn(req.body.data || {}) });
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
