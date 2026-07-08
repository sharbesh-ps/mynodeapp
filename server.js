const http = require("http");
const path = require("path");
const fs = require("fs");

const { connectDB } = require("./config/db");

const pageRoutes = require("./routes/pageRoutes");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");

const { requireAuth } = require("./middleware/authMiddleware");

connectDB();

const server = http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url, `http://${req.headers.host}`);
    const pathname = url.pathname;

    if (pathname.startsWith("/js/")) {
      const filePath = path.join(__dirname, "public", pathname);

      if (fs.existsSync(filePath)) {
        res.writeHead(200, {
          "Content-Type": "application/javascript",
        });

        return res.end(fs.readFileSync(filePath));
      }
    }

    if (pathname.startsWith("/css/")) {
      const filePath = path.join(__dirname, "public", pathname);

      if (fs.existsSync(filePath)) {
        res.writeHead(200, {
          "Content-Type": "text/css",
        });

        return res.end(fs.readFileSync(filePath));
      }
    }

    // Protected pages
    const protectedRoutes = ["/home", "/views", "/create"];

    const isProtected =
      protectedRoutes.includes(pathname) ||
      pathname.startsWith("/update/") ||
      pathname.startsWith("/viewuser/");

    if (isProtected) {
      if (!requireAuth(req, res)) {
        return;
      }
    }

    const pageHandled = pageRoutes.handle(req, res, pathname);
    if (pageHandled) return;
    const authHandled = await authRoutes.handle(req, res, pathname);
    if (authHandled) return;
    const userHandled = await userRoutes.handle(req, res, pathname);
    if (userHandled) return;
    res.writeHead(404, {
      "Content-Type": "text/html",
    });
    res.end(`
        <h1 style="font-family:Arial;text-align:center;margin-top:50px">
            404 - Page Not Found
        </h1>
    `);
  } catch (err) {
    console.error(err);
    res.writeHead(500, {
      "Content-Type": "text/html",
    });
    res.end(`
        <h1 style="font-family:Arial;text-align:center;margin-top:50px">
            500 - Internal Server Error
        </h1>
    `);
  }
});
const PORT = 5000;
server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
