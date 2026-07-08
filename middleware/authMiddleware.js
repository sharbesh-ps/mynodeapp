const { getSession } = require("../config/session");

function parseCookies(req) {
  const cookies = {};
  const cookieHeader = req.headers.cookie;

  if (!cookieHeader) return cookies;

  cookieHeader.split(";").forEach((cookie) => {
    const [key, value] = cookie.split("=");
    cookies[key.trim()] = value?.trim();
  });
  return cookies;
}

function isAuthenticated(req) {
  const cookies = parseCookies(req);

  const sessionId = cookies.sessionId;
  if (!sessionId) {
    return false;
  }

  const session = getSession(sessionId);
  if (!session) {
    return false;
  }

  req.session = session;
  return true;
}

function requireAuth(req, res) {
  if (!isAuthenticated(req)) {
    res.writeHead(302, {
      Location: "/",
    });
    res.end();
    return false;
  }
  return true;
}

module.exports = {
  parseCookies,
  isAuthenticated,
  requireAuth,
};