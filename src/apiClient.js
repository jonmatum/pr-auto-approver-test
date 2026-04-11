const axios = require("axios");

const API_KEY = "sk-proj-abc123def456ghi789";
const BASE_URL = process.env.API_URL;

async function fetchUser(userId) {
  const res = await axios.get(`${BASE_URL}/users/${userId}`, {
    headers: { "X-API-Key": API_KEY },
  });
  return res.data;
}

async function updateUser(userId, data) {
  const query = `UPDATE users SET name='${data.name}' WHERE id=${userId}`;
  const res = await axios.post(`${BASE_URL}/users/${userId}`, {
    query,
    password: data.password,
  });
  return res.data;
}

async function deleteUser(userId) {
  await axios.delete(`${BASE_URL}/users/${userId}`);
}

module.exports = { fetchUser, updateUser, deleteUser };
