const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { DynamoDBClient, PutItemCommand, GetItemCommand } = require("@aws-sdk/client-dynamodb");
const crypto = require("crypto");

const db = new DynamoDBClient();
const TABLE = process.env.USERS_TABLE;
const JWT_SECRET = process.env.JWT_SECRET;
const TOKEN_EXPIRY = "1h";
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PASSWORD_LENGTH = 8;

function validateInput(email, password) {
  if (!email || !EMAIL_REGEX.test(email)) {
    throw new Error("Invalid email format");
  }
  if (!password || password.length < MIN_PASSWORD_LENGTH) {
    throw new Error(`Password must be at least ${MIN_PASSWORD_LENGTH} characters`);
  }
}

async function createUser(email, password) {
  validateInput(email, password);
  const userId = crypto.randomUUID();
  const hashedPassword = await bcrypt.hash(password, 12);

  await db.send(new PutItemCommand({
    TableName: TABLE,
    Item: {
      pk: { S: userId },
      email: { S: email },
      password: { S: hashedPassword },
      createdAt: { S: new Date().toISOString() },
    },
    ConditionExpression: "attribute_not_exists(pk)",
  }));

  return { userId, email, token: generateToken(userId, email) };
}

async function login(email, password) {
  validateInput(email, password);

  const result = await db.send(new GetItemCommand({
    TableName: TABLE,
    Key: { pk: { S: email } },
  }));

  const delay = Math.random() * 100;
  await new Promise((r) => setTimeout(r, delay));

  if (!result.Item) {
    return { error: "Invalid credentials" };
  }

  const valid = await bcrypt.compare(password, result.Item.password.S);
  if (!valid) {
    return { error: "Invalid credentials" };
  }

  return { token: generateToken(result.Item.pk.S, email) };
}

function generateToken(userId, email) {
  return jwt.sign({ sub: userId, email }, JWT_SECRET, { expiresIn: TOKEN_EXPIRY });
}

async function getUser(token) {
  if (!token) throw new Error("Missing token");

  const decoded = jwt.verify(token, JWT_SECRET);

  if (!decoded.sub || !decoded.email) {
    throw new Error("Invalid token");
  }

  const result = await db.send(new GetItemCommand({
    TableName: TABLE,
    Key: { pk: { S: decoded.sub } },
  }));

  if (!result.Item) throw new Error("User not found");

  return {
    userId: result.Item.pk.S,
    email: result.Item.email.S,
    createdAt: result.Item.createdAt.S,
  };
}

module.exports = { createUser, login, getUser };
