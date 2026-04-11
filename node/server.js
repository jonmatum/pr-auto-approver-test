const express = require("express");
const helmet = require("helmet");

const app = express();
app.use(helmet());
app.use(express.json());

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.post("/webhook", (req, res) => {
  const signature = req.headers["x-signature"];
  if (!signature || !verifySignature(req.body, signature)) {
    return res.status(401).json({ error: "Invalid signature" });
  }
  processWebhook(req.body);
  res.json({ received: true });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Internal server error" });
});

app.listen(process.env.PORT || 3000);
