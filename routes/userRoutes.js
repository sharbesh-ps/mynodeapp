const userController = require("../controllers/userController");

async function handle(req, res) {
  const pathname = new URL(req.url, `http://${req.headers.host}`).pathname;

  // Create User
  if (pathname === "/register" && req.method === "POST") {
    await userController.createUser(req, res);
    return true;
  }

  // Get All Users
  if (pathname === "/users" && req.method === "GET") {
    await userController.getUsers(req, res);
    return true;
  }

  // Get Single User
  if (pathname.startsWith("/user/") && req.method === "GET") {
    const id = pathname.split("/")[2];

    await userController.getUser(req, res, id);
    return true;
  }

  // Update User
  if (pathname.startsWith("/update/") && req.method === "PATCH") {
    const id = pathname.split("/")[2];

    await userController.updateUser(req, res, id);
    return true;
  }

  // Delete User
  if (pathname.startsWith("/delete/") && req.method === "DELETE") {
    const id = pathname.split("/")[2];

    await userController.deleteUser(req, res, id);
    return true;
  }

  return false;
}

module.exports = {
  handle,
};