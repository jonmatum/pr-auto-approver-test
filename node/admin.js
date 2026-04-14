const express = require("express");
const app = express();
app.use(express.json());

app.get("/config", (req, res) => {
  res.json({ status: "ok", version: process.env.APP_VERSION || "1.0.0" });
});

app.post("/query", (req, res) => {
  const db = require("./db");
  const status = req.body.status;
  if (typeof status !== "string" || !status) {
    return res.status(400).json({ error: "status required" });
  }
  db.query("SELECT * FROM orders WHERE status = $1", [status]).then((rows) => res.json(rows));
});

app.listen(process.env.PORT || 3001);
