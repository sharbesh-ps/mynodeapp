const path = require("path");
const fs = require("fs");

const userModel = require("../models/userModel");

// ======================================
// Student Dashboard
// GET /student/home
// ======================================
function homePage(req, res) {
  const filePath = path.join(
    __dirname,
    "..",
    "views",
    "studentHome.html"
  );

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(500, {
        "Content-Type": "text/plain",
      });

      return res.end("Unable to load Student Home Page.");
    }

    res.writeHead(200, {
      "Content-Type": "text/html",
    });

    res.end(data);
  });
}

// ======================================
// Student Profile Page
// GET /student/profile
// ======================================
function profilePage(req, res) {
  const filePath = path.join(
    __dirname,
    "..",
    "views",
    "studentProfile.html"
  );

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(500, {
        "Content-Type": "text/plain",
      });

      return res.end("Unable to load Student Profile.");
    }

    res.writeHead(200, {
      "Content-Type": "text/html",
    });

    res.end(data);
  });
}

// ======================================
// Get Logged-in Student Details
// GET /student/details
// ======================================
async function getStudentProfile(req, res) {
  try {
    if (!req.session || !req.session.user) {
      res.writeHead(401, {
        "Content-Type": "application/json",
      });

      return res.end(
        JSON.stringify({
          status: "error",
          message: "Unauthorized",
        })
      );
    }

    const email = req.session.user.email;

    const students = await userModel.getUsers();

    const student = students.find(
      (item) => item.email === email
    );

    if (!student) {
      res.writeHead(404, {
        "Content-Type": "application/json",
      });

      return res.end(
        JSON.stringify({
          status: "error",
          message: "Student not found",
        })
      );
    }

    res.writeHead(200, {
      "Content-Type": "application/json",
    });

    res.end(
      JSON.stringify({
        status: "success",
        data: student,
      })
    );
  } catch (error) {
    console.error(error);

    res.writeHead(500, {
      "Content-Type": "application/json",
    });

    res.end(
      JSON.stringify({
        status: "error",
        message: "Server Error",
      })
    );
  }
}

module.exports = {
  homePage,
  profilePage,
  getStudentProfile,
};