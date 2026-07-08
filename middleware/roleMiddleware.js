function requireRole(role) {
  return (req, res) => {
    if (!req.session) {
      res.writeHead(302, {
        Location: "/",
      });

      res.end();
      return false;
    }

    if (req.session.user.role !== role) {
      res.writeHead(403, {
        "Content-Type": "text/html",
      });

      res.end(`
        <h2 style="text-align:center;margin-top:100px">
          403 - Access Denied
        </h2>
      `);

      return false;
    }

    return true;
  };
}

module.exports = {
  requireRole,
};