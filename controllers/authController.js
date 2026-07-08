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

      // Find user in MongoDB
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

      // Password check
      // ( replaced )
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

      // Check active status
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

      // Create Session
      const sessionId = createSession({
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
      });

      res.writeHead(302, {
        "Set-Cookie": `sessionId=${sessionId}; HttpOnly; Path=/`,
        Location: "/home",
      });

      res.end();
    } catch (error) {
      console.error(error);

      res.writeHead(500, {
        "Content-Type": "application/json",
      });

      res.end(
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
