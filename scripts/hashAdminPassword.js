const bcrypt = require("bcrypt");
const { MongoClient } = require("mongodb");

const URI = "mongodb://localhost:27017"; 
const DATABASE = "admission";
const COLLECTION = "authusers";

async function hashAdminPassword() {
  const client = new MongoClient(URI);

  try {
    await client.connect();

    console.log("Connected to MongoDB");

    const db = client.db(DATABASE);

    const password = "12345";

    const hashedPassword = await bcrypt.hash(password, 10);

    await db.collection(COLLECTION).updateOne(
      { email: "admin@gmail.com" },
      {
        $set: {
          password: hashedPassword,
          updatedAt: new Date(),
        },
      }
    );

    console.log("Admin password updated successfully.");


  } catch (error) {
    console.error(error);
  } finally {
    await client.close();
  }
}

hashAdminPassword();