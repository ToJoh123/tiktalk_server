const chai = require("chai");
const expect = chai.expect;
const supertest = require("supertest");
const app = require("../../../server"); // Replace with the path to your Express app
const dotenv = require("dotenv");
dotenv.config();
const cookie = require("cookie");

describe("/getComments endpoint", () => {
  let token;

  it("should return a jwt cookie to be used for other tests", (done) => {
    supertest(app)
      .post("/login")
      .send({
        username: process.env.LOGIN_TEST_USR,
        password: process.env.LOGIN_TEST_PW,
      }) // Add the username and password within the .env file.
      .expect(200)
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body).to.have.property("token");
        jwtCookie = cookie.serialize("jwt", res.body.token, { httpOnly: true });
        done();
      });
  });

  it("should return comments with correct data format", (done) => {
    supertest(app)
      .get("/comments")
      .set("Cookie", jwtCookie)
      .expect(200)
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body).to.have.property("data");
        expect(res.body.data).to.be.an("array").that.is.not.empty;
        res.body.data.forEach((comment) => {
          expect(comment).to.have.property("_id").that.is.a("string");
          console.log(comment.parentId);
          expect(comment).to.have.property("parentId");
          // .that.is.oneOf([null, "string"]);
          /**
           * why cant it be either?
           * @metinpleasehelpme
           */
          expect(comment).to.have.property("text").that.is.a("string");
          expect(comment).to.have.property("createdAt").that.is.a("string");
          expect(comment).to.have.property("userId").that.is.a("string");
          expect(comment).to.have.property("username").that.is.a("string");
        });
        done();
      });
  });
});
