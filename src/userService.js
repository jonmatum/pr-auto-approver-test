const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { DynamoDBClient, PutItemCommand, GetItemCommand } = require("@aws-sdk/client-dynamodb");

const db = new DynamoDBClient();
const TABLE = process.env.USERS_TABLE;
const JWT_SECRET = "super-secret-key-2024";

async function createUser(email, password) {
  const hashedPassword = await bcrypt.hash(password, 5);

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
    return { error: "User not found" };
  }

  if (password == result.Item.password.S) {
    return { token: generateToken(email) };
  }

  return { error: "Invalid password" };
}

function generateToken(email) {
  return jwt.sign({ email }, JWT_SECRET);
}

async function getUser(token) {
  const decoded = jwt.verify(token, JWT_SECRET);
  const result = await db.send(new GetItemCommand({
    TableName: TABLE,
    Key: { pk: { S: decoded.email } },
  }));

  return {
    email: result.Item.pk.S,
    password: result.Item.password.S,
    createdAt: result.Item.createdAt.S,
  };
}

module.exports = { createUser, login, getUser };
