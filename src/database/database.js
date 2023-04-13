const { MongoClient } = require("mongodb");
//get dotenv
require("dotenv").config();

async function main() {
  const url = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.smsizof.mongodb.net/?retryWrites=true&w=majority`;

  const connection = await MongoClient.connect(url);

  const database = connection.db("test");

  const coll = database.collection("users");

  const documents = await coll.find({}).toArray();
  console.log(documents);
}
// Export the main() function
module.exports = { main };
