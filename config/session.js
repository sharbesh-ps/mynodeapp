const crypto = require("crypto");

const sessions = {};

function createSession(user) {
  const sessionId = crypto.randomUUID();
  sessions[sessionId] = {
    user,
    createdAt: Date.now(),
  };
  return sessionId;
}

function getSession(sessionId) {
  return sessions[sessionId];
}

function destroySession(sessionId) {
  delete sessions[sessionId];
}

module.exports = {
  createSession,
  getSession,
  destroySession,
};