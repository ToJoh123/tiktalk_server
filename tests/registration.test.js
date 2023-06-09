const chai = require("chai");
const expect = chai.expect;
const supertest = require("supertest");
const app = require("../server");
const { registerSchema } = require("../src/validation/registerschema");
const db = require("../src/database/db");

// const { main } = require('../src/database/database');

describe("/register", () => {
  //Main function to connect.
  before(async () => {
    await db.connect();
  });

  it("should insert a user when provided with valid credentials", (done) => {
    supertest(app)
      .post("/register")
      .send({
        firstname: "Test",
        surname: "Testsson",
        username: "jadajada",
        password: "jadajada",
      })
      .expect(201)
      .end(async (err, res) => {
        expect(res.status).to.equal(201);
        expect(res.body)
          .to.have.property("message")
          .equal("User registered successfully");

        //Check if user was inserted into MongoDB collection.
        const users = await db.users.find({ username: "jadajada" }).toArray();
        expect(users.length).to.equal(1);
        expect(users[0]).to.have.property("username").equal("jadajada");

        //Delete the inserted user.
        await db.users.deleteOne({ username: "jadajada" });

        done();
      });
  });

  it("should return error where username is already in use", (done) => {
    supertest(app)
      .post("/register")
      .send({
        firstname: "Jonathan",
        surname: "Ljung",
        username: "Jonathan",
        password: "password",
      }) //Replace with invalid credentials.
      .expect(409)
      .end((err, res) => {
        expect(res.status).to.equal(409);
        expect(res.body).to.have.property("message");
        done();
      });
  });

  describe("Joi Validation", () => {
    it("should validate a correct user object", () => {
      const user = {
        firstname: "test",
        surname: "testsson",
        username: "jadajada",
        password: "mypassword123", // Valid password (greater than 6 characters)
      };

      const { error } = registerSchema.validate(user);
      expect(error).to.be.undefined;
    });

    it("should return an error for an incorrect user object", () => {
      const user = {
        firstname: "test",
        surname: "testsson",
        username: "jadajada",
        password: "abc", // Invalid password (less than 6 characters)
      };

      const { error } = registerSchema.validate(user);
      expect(error).to.not.be.undefined;
      expect(error.details[0].message).to.equal(
        "Password must be alphanumeric and between 6 and 30 characters long"
      );
    });
  });
});
