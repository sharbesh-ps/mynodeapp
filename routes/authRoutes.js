const authController = require("../controllers/authController");

async function handle(req, res, pathname) {
  if (pathname === "/login" && req.method === "POST") {
    authController.login(req, res);
    return true;
  }

  if (pathname === "/logout" && req.method === "GET") {
    authController.logout(req, res);
    return true;
  }

  return false;
}

module.exports = {
  handle,
};