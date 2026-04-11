const { createUser, login, getUser } = require("./userService");

exports.handler = async (event) => {
  const path = event.path;

  try {
    const body = event.body ? JSON.parse(event.body) : {};

    if (path === "/register" && event.httpMethod === "POST") {
      if (!body.email || !body.password) {
        return { statusCode: 400, body: JSON.stringify({ error: "Email and password required" }) };
      }
      const result = await createUser(body.email, body.password);
      return { statusCode: 201, body: JSON.stringify(result) };
    }

    if (path === "/login" && event.httpMethod === "POST") {
      if (!body.email || !body.password) {
        return { statusCode: 400, body: JSON.stringify({ error: "Email and password required" }) };
      }
      const result = await login(body.email, body.password);
      if (result.error) {
        return { statusCode: 401, body: JSON.stringify(result) };
      }
      return { statusCode: 200, body: JSON.stringify(result) };
    }

    if (path === "/me" && event.httpMethod === "GET") {
      const token = (event.headers.Authorization || "").replace("Bearer ", "");
      if (!token) {
        return { statusCode: 401, body: JSON.stringify({ error: "Authorization required" }) };
      }
      const result = await getUser(token);
      return { statusCode: 200, body: JSON.stringify(result) };
    }

    return { statusCode: 404, body: JSON.stringify({ error: "Not found" }) };
  } catch (err) {
    console.error(err);
    return { statusCode: 500, body: JSON.stringify({ error: "Internal server error" }) };
  }
};
