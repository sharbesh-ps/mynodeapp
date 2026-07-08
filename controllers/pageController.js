const fs = require("fs");
const path = require("path");

// ======================
// Login Page
// ======================
function loginPage(req, res) {
  const filePath = path.join(__dirname, "../views/index.html");

  res.writeHead(200, {
    "Content-Type": "text/html",
  });

  res.end(fs.readFileSync(filePath));
}

// ======================
// Home Page
// ======================
function homePage(req, res) {
  const filePath = path.join(__dirname, "../views/homepage.html");

  res.writeHead(200, {
    "Content-Type": "text/html",
  });

  res.end(fs.readFileSync(filePath));
}

// ======================
// View All Users Page
// ======================
function viewsPage(req, res) {
  const filePath = path.join(__dirname, "../views/views.html");

  res.writeHead(200, {
    "Content-Type": "text/html",
  });

  res.end(fs.readFileSync(filePath));
}

// ======================
// Create User Page
// ======================
function createPage(req, res) {
  const filePath = path.join(__dirname, "../views/createForm.html");

  res.writeHead(200, {
    "Content-Type": "text/html",
  });

  res.end(fs.readFileSync(filePath));
}

// ======================
// Update User Page
// ======================
function updatePage(req, res) {
  const filePath = path.join(__dirname, "../views/updateForm.html");

  res.writeHead(200, {
    "Content-Type": "text/html",
  });

  res.end(fs.readFileSync(filePath));
}

// ======================
// View Single User Page
// ======================
function viewUserPage(req, res) {
  const filePath = path.join(__dirname, "../views/userviews.html");

  res.writeHead(200, {
    "Content-Type": "text/html",
  });

  res.end(fs.readFileSync(filePath));
}

module.exports = {
  loginPage,
  homePage,
  viewsPage,
  createPage,
  updatePage,
  viewUserPage,
};