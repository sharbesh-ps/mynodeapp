const querystring = require("node:querystring");

const { createSession, destroySession } = require("../config/session");

const { parseCookies } = require("../middleware/authMiddleware");

const authUserModel = require("../models/authUserModel");

const { comparePassword } = require("../utils/password");


// =========================
// Login
// =========================

async function login(req, res) {
  let body = "";

  req.on("data", (chunk) => {
    body += chunk.toString();
  });

  req.on("end", async () => {
    try {
      const data = querystring.parse(body);

      const email = data.email.trim();
      const password = data.password.trim();

      // Find user by email
      const user = await authUserModel.findUserByEmail(email);

      if (!user) {
        res.writeHead(401, {
          "Content-Type": "application/json",
        });

        return res.end(
          JSON.stringify({
            status: "error",
            message: "Invalid Email",
          }),
        );
      }

      // Compare password
      const isPasswordValid = await comparePassword(password, user.password);

      if (!isPasswordValid) {
        res.writeHead(401, {
          "Content-Type": "application/json",
        });

        return res.end(
          JSON.stringify({
            status: "error",
            message: "Invalid Password",
          }),
        );
      }

      // Check account status
      if (!user.isActive) {
        res.writeHead(403, {
          "Content-Type": "application/json",
        });

        return res.end(
          JSON.stringify({
            status: "error",
            message: "Account Disabled",
          }),
        );
      }

      // Create session
      const sessionId = createSession({
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
      });

      // Decide where to redirect
      let redirectUrl = "/";

      if (user.role === "ADMIN") {
        redirectUrl = "/home";
      } else if (user.role === "STUDENT") {
        redirectUrl = "/student/home";
      }

      // Redirect
      res.writeHead(302, {
        "Set-Cookie": `sessionId=${sessionId}; HttpOnly; Path=/`,
        Location: redirectUrl,
      });

      return res.end();
    } catch (error) {
      console.error(error);

      res.writeHead(500, {
        "Content-Type": "application/json",
      });

      return res.end(
        JSON.stringify({
          status: "error",
          message: "Server Error",
        }),
      );
    }
  });
}
// =========================
// Logout
// =========================
function logout(req, res) {
  const cookies = parseCookies(req);
  const sessionId = cookies.sessionId;
  if (sessionId) {
    destroySession(sessionId);
  }

  // Clear browser cookie
  res.writeHead(302, {
    "Set-Cookie": "sessionId=; HttpOnly; Path=/; Max-Age=0",
    Location: "/",
  });

  res.end();
}

module.exports = {
  login,
  logout,
};
