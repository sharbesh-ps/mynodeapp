const http = require("http");
const path = require("path");
const fs = require("fs");

const { connectDB } = require("./config/db");

const pageRoutes = require("./routes/pageRoutes");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const studentRoutes = require("./routes/studentRoutes");

const {
  parseCookies,
  requireAuth,
} = require("./middleware/authMiddleware");

const { requireRole } = require("./middleware/roleMiddleware");

const { getSession } = require("./config/session");

// ===============================
// Connect Database
// ===============================
connectDB();

const server = http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url, `http://${req.headers.host}`);
    const pathname = url.pathname;

    // ==========================================
    // Load Session
    // ==========================================
    const cookies = parseCookies(req);

    if (cookies.sessionId) {
      const session = getSession(cookies.sessionId);

      if (session) {
        req.session = session;
      }
    }

    // ==========================================
    // Static JS
    // ==========================================
    if (pathname.startsWith("/js/")) {
      const filePath = path.join(__dirname, "public", pathname);

      if (fs.existsSync(filePath)) {
        res.writeHead(200, {
          "Content-Type": "application/javascript",
        });

        return res.end(fs.readFileSync(filePath));
      }
    }



    // ==========================================
    // ADMIN Protected Routes
    // ==========================================
    const adminRoutes = [
      "/home",
      "/views",
      "/create",
      "/register",
    ];

    const isAdminRoute =
      adminRoutes.includes(pathname) ||
      pathname.startsWith("/update/") ||
      pathname.startsWith("/delete/") ||
      pathname.startsWith("/viewuser/");

    if (isAdminRoute) {
      if (!requireAuth(req, res)) {
        return;
      }

      const checkAdmin = requireRole("ADMIN");

      if (!checkAdmin(req, res)) {
        return;
      }
    }

    // ==========================================
    // STUDENT Protected Routes
    // ==========================================
    const studentRoutesList = [
      "/student/home",
      "/student/profile",
      "/student/details",
    ];

    if (studentRoutesList.includes(pathname)) {
      if (!requireAuth(req, res)) {
        return;
      }

      const checkStudent = requireRole("STUDENT");

      if (!checkStudent(req, res)) {
        return;
      }
    }

    // ==========================================
    // Page Routes
    // ==========================================
    const pageHandled = pageRoutes.handle(req, res, pathname);

    if (pageHandled) return;

    // ==========================================
    // Authentication Routes
    // ==========================================
    const authHandled = await authRoutes.handle(req, res, pathname);

    if (authHandled) return;

    // ==========================================
    // User Routes
    // ==========================================
    const userHandled = await userRoutes.handle(req, res);

    if (userHandled) return;

    // ==========================================
    // Student Routes
    // ==========================================
    const studentHandled = await studentRoutes.handle(req, res);

    if (studentHandled) return;

    // ==========================================
    // 404
    // ==========================================
    res.writeHead(404, {
      "Content-Type": "text/html",
    });

    res.end(`
      <h1 style="font-family:Arial;text-align:center;margin-top:100px">
        404 - Page Not Found
      </h1>
    `);

  } catch (error) {
    console.error(error);

    res.writeHead(500, {
      "Content-Type": "text/html",
    });

    res.end(`
      <h1 style="font-family:Arial;text-align:center;margin-top:100px">
        500 - Internal Server Error
      </h1>
    `);
  }
});

// ==========================================
// Start Server
// ==========================================
const PORT = 5000;

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});