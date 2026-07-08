const { getDB } = require("../config/db");
const { ObjectId } = require("mongodb");

const COLLECTION = "users";

// ==============================
// Create User
// ==============================
async function createUser(user) {
  const db = getDB();
  return await db.collection(COLLECTION).insertOne(user);
}

// ==============================
// Find User By Email
// ==============================
async function findUserByEmail(email) {
  const db = getDB();
  return await db.collection(COLLECTION).findOne({ email });
}

// ==============================
// Find User By Id
// ==============================
async function findUserById(id) {
  const db = getDB();
  return await db
    .collection(COLLECTION)
    .findOne({ _id: new ObjectId(id) });
}

// ==============================
// Get All Users
// ==============================
async function getUsers() {
  const db = getDB();
  return await db
    .collection(COLLECTION)
    .find()
    .sort({ _id: -1 })
    .toArray();
}

// ==============================
// Update User
// ==============================
async function updateUser(id, data) {
  const db = getDB();
  return await db
    .collection(COLLECTION)
    .updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          ...data,
          updatedAt: new Date(),
        },
      }
    );
}

// ==============================
// Delete User
// ==============================
async function deleteUser(id) {
  const db = getDB();
  return await db
    .collection(COLLECTION)
    .deleteOne({ _id: new ObjectId(id) });
}

module.exports = {
  createUser,
  findUserByEmail,
  findUserById,
  getUsers,
  updateUser,
  deleteUser,
};