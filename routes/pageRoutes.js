const pageController = require("../controllers/pageController");

function handle(req, res, pathname) {
  if (pathname === "/" && req.method === "GET") {
    pageController.loginPage(req, res);
    return true;
  }

  if (pathname === "/home" && req.method === "GET") {
    pageController.homePage(req, res);
    return true;
  }

  if (pathname === "/views" && req.method === "GET") {
    pageController.viewsPage(req, res);
    return true;
  }

  if (pathname === "/create" && req.method === "GET") {
    pageController.createPage(req, res);
    return true;
  }

  if (pathname.startsWith("/update/") && req.method === "GET") {
    pageController.updatePage(req, res);
    return true;
  }

  if (pathname.startsWith("/viewuser/") && req.method === "GET") {
    pageController.viewUserPage(req, res);
    return true;
  }

  return false;
}

module.exports = {
  handle,
};