const { MongoClient } = require("mongodb");

const url = "mongodb://127.0.0.1:27017";
const client = new MongoClient(url);

let db;

async function connectDB() {
  try {
    await client.connect();
    console.log("MongoDB Connected Successfully");

    db = client.db("admission"); // Change to your database name
    return db;
  } catch (error) {
    console.error(" MongoDB Connection Failed");
    console.error(error);
    process.exit(1);
  }
}

function getDB() {
  if (!db) {
    throw new Error("Database not initialized. Call connectDB() first.");
  }
  return db;
}

module.exports = {
  connectDB,
  getDB,
};