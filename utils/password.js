const bcrypt = require("bcrypt");

const SALT_ROUNDS = 10;

// ===============================
// Hash Password
// ===============================
async function hashPassword(password) {
  return await bcrypt.hash(password, SALT_ROUNDS);
}

// ===============================
// Compare Password
// ===============================
async function comparePassword(password, hash) {
  return await bcrypt.compare(password, hash);
}

module.exports = {
  hashPassword,
  comparePassword,
};