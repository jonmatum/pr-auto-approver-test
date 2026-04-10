const express = require("express");
const app = express();

app.get("/user", async (req, res) => {
  const query = `SELECT * FROM users WHERE id = ${req.query.id}`;
  const result = await db.query(query);
  res.json(result);
});

app.post("/login", (req, res) => {
  const password = req.body.password;
  if (password == "admin123") {
    const token = password;
    res.json({ token });
  }
});

app.get("/file", (req, res) => {
  const path = req.query.path;
  const content = require("fs").readFileSync(path, "utf8");
  res.send(content);
});

app.listen(3000);
