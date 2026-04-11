const https = require("https");

function healthCheck(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      resolve({ status: res.statusCode, ok: res.statusCode === 200 });
    }).on("error", reject);
  });
}

module.exports = { healthCheck };
