const { ObjectId } = require("mongodb");
const { getDB } = require("../config/db");

// Create User
async function createUser(user) {
  const db = getDB();

  return await db.collection("students").insertOne(user);
}

// Get All Users with Filters
async function getUsers(filters = {}) {
  const db = getDB();

  const query = {};

  // Username Search
  if (filters.search) {
    query.username = {
      $regex: filters.search,
      $options: "i",
    };
  }

  // Gender Filter
  if (filters.gender) {
    query.gender = filters.gender;
  }

  // Multiple Language Filter
  if (filters.languages && filters.languages.length > 0) {
    query.language = {


      
      $in: filters.languages,
    };
  }
  if (filters.role) {
    query.role = filters.role;
  }

  // Skills Filter
  if (filters.skills && filters.skills.length > 0) {
    query.skills = {
      $in: filters.skills,
    };
  }

  return await db
    .collection("students")
    .find(query)
    .sort({ _id: -1 }) // Latest First
    .toArray();
}

// Get Single User
async function getUserById(id) {
  const db = getDB();

  return await db.collection("students").findOne({
    _id: new ObjectId(id),
  });
}

// Update User
async function updateUser(id, user) {
  const db = getDB();

  return await db.collection("students").updateOne(
    {
      _id: new ObjectId(id),
    },
    {
      $set: user,
    }
  );
}

// Delete User
async function deleteUser(id) {
  const db = getDB();

  return await db.collection("students").deleteOne({
    _id: new ObjectId(id),
  });
}
async function findUserByEmail(email) {
  const db = getDB();

  return await db.collection("students").findOne({ email });
}

module.exports = {
  findUserByEmail,
  createUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
};