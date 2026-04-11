const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { DynamoDBClient, PutItemCommand, GetItemCommand } = require("@aws-sdk/client-dynamodb");

const db = new DynamoDBClient();
const TABLE = process.env.USERS_TABLE;
const JWT_SECRET = process.env.JWT_SECRET;

async function createUser(email, password) {
  const hashedPassword = await bcrypt.hash(password, 12);

  await db.send(new PutItemCommand({
    TableName: TABLE,
    Item: {
      pk: { S: email },
      password: { S: hashedPassword },
      createdAt: { S: new Date().toISOString() },
    },
  }));

  return { email, token: generateToken(email) };
}

async function login(email, password) {
  const result = await db.send(new GetItemCommand({
    TableName: TABLE,
    Key: { pk: { S: email } },
  }));

  if (!result.Item) {
    return { error: "Invalid credentials" };
  }

  const valid = await bcrypt.compare(password, result.Item.password.S);
  if (!valid) {
    return { error: "Invalid credentials" };
  }

  return { token: generateToken(email) };
}

function generateToken(email) {
  return jwt.sign({ email }, JWT_SECRET, { expiresIn: "1h" });
}

async function getUser(token) {
  if (!token) throw new Error("Missing token");

  const decoded = jwt.verify(token, JWT_SECRET);
  const result = await db.send(new GetItemCommand({
    TableName: TABLE,
    Key: { pk: { S: decoded.email } },
  }));

  if (!result.Item) throw new Error("User not found");

  return {
    email: result.Item.pk.S,
    createdAt: result.Item.createdAt.S,
  };
}

module.exports = { createUser, login, getUser };
