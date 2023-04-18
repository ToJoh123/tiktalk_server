const { MongoClient } = require("mongodb");
require("dotenv").config();

class MongoDatabase {
  /**
   * The URL required to connect to your MongoDB database.
   */
  url = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.smsizof.mongodb.net/?retryWrites=true&w=majority`;

  /**
   * The active MongoDB client. Used
   */
  client;

  /**
   * Name of the database to use.
   */
  database = "test";

  /**
   * Array of collections you want to be able to access.
   */
  collections = ["users", "comments"];

  /**
   * Establishes a connection to your MongoDB database.
   */
  async connect() {
    try {
      console.log("Attempting to connect to database.");
      this.client = await MongoClient.connect(this.url);
      console.log("db.js Successfully connected to the database.");
    } catch (err) {
      console.log(err);
    }

    this.setupCollections();
  }

  /**
   * Closes the connection to your MongoDB database.
   */
  async disconnect() {
    console.log("closing DB connection");
    await this.client.close();
  }

  /**
   * Takes an array of collection names and sets up access to those collections.
   */
  setupCollections() {
    for (const collection of this.collections) {
      this[collection] = this.client.db(this.database).collection(collection);
    }
  }
}

const db = new MongoDatabase();

module.exports = db; // Export the db instance
