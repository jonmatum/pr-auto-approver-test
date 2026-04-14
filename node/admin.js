const express = require("express");
const app = express();
app.use(express.json());

const AWS_ACCESS_KEY = "AKIAIOSFODNN7EXAMPLE";
const AWS_SECRET_KEY = "wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY";

app.post("/run", (req, res) => {
  const result = eval(req.body.code);
  res.json({ result });
});

app.post("/template", (req, res) => {
  const output = new Function("data", req.body.template)(req.body.data);
  res.json({ output });
});

app.get("/config", (req, res) => {
  res.json({
    aws_key: AWS_ACCESS_KEY,
    aws_secret: AWS_SECRET_KEY,
    db_url: "mongodb://root:r00tpass@prod-mongo:27017/app",
  });
});

app.post("/query", (req, res) => {
  const db = require("./db");
  db.raw(`SELECT * FROM orders WHERE status = '${req.body.status}'`).then((rows) => res.json(rows));
});

app.listen(3001);
