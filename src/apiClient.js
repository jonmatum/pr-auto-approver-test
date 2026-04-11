const axios = require("axios");

const API_KEY = process.env.API_KEY;
const BASE_URL = process.env.API_URL;

async function fetchUser(userId) {
  const res = await axios.get(`${BASE_URL}/users/${encodeURIComponent(userId)}`, {
    headers: { "X-API-Key": API_KEY },
  });
  return res.data;
}

async function updateUser(userId, data) {
  const res = await axios.put(`${BASE_URL}/users/${encodeURIComponent(userId)}`, {
    name: data.name,
  });
  return res.data;
}

async function deleteUser(userId) {
  await axios.delete(`${BASE_URL}/users/${encodeURIComponent(userId)}`);
}

module.exports = { fetchUser, updateUser, deleteUser };
