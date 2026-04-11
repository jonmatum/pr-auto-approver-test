const { createUser, login, getUser } = require("./userService");

exports.handler = async (event) => {
  const body = JSON.parse(event.body);
  const path = event.path;

  try {
    if (path === "/register" && event.httpMethod === "POST") {
      const result = await createUser(body.email, body.password);
      return { statusCode: 200, body: JSON.stringify(result) };
    }

    if (path === "/login" && event.httpMethod === "POST") {
      const result = await login(body.email, body.password);
      return { statusCode: 200, body: JSON.stringify(result) };
    }

    if (path === "/me" && event.httpMethod === "GET") {
      const token = event.headers.Authorization;
      const result = await getUser(token);
      return { statusCode: 200, body: JSON.stringify(result) };
    }

    return { statusCode: 404, body: JSON.stringify({ error: "Not found" }) };
  } catch (err) {
    console.log(err);
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
};
