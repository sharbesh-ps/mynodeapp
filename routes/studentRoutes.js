const studentController = require("../controllers/studentController");

async function handle(req, res) {
  const pathname = new URL(
    req.url,
    `http://${req.headers.host}`
  ).pathname;

  // =====================================
  // Student Dashboard
  // GET /student/home
  // =====================================
  if (pathname === "/student/home" && req.method === "GET") {
    studentController.homePage(req, res);
    return true;
  }

  // =====================================
  // Student Profile Page
  // GET /student/profile
  // =====================================
  if (pathname === "/student/profile" && req.method === "GET") {
    studentController.profilePage(req, res);
    return true;
  }

  // =====================================
  // Get Logged-in Student Details
  // GET /student/details
  // =====================================
  if (pathname === "/student/details" && req.method === "GET") {
    await studentController.getStudentProfile(req, res);
    return true;
  }

  return false;
}

module.exports = {
  handle,
};