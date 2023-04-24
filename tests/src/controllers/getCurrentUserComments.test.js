const chai = require("chai");
const expect = chai.expect;
const supertest = require("supertest");
const app = require("../../../server"); // Replace with the path to your Express app
const dotenv = require("dotenv");
dotenv.config();
const cookie = require("cookie");

describe("/comments/user endpoint. GET getCurrentUserComments", () => {
  let jwtCookie;

  before((done) => {
    supertest(app)
      .post("/login")
      .send({
        username: process.env.LOGIN_TEST_USR,
        password: process.env.LOGIN_TEST_PW,
      })
      .expect(200)
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body).to.have.property("token");
        jwtCookie = cookie.serialize("jwt", res.body.token, { httpOnly: true });
        done();
      });
  });

  it("should GET all comments belonging to the current user", (done) => {
    supertest(app)
      .get("/comments/user")
      .set("Cookie", jwtCookie)
      .expect(200)
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body).to.have.property("message");
        expect(res.body.message).to.equal(
          "this is getCurrentUserComments function at /comments/user"
        );
        expect(res.body).to.have.property("data");
        expect(res.body.data).to.be.an("array").that.is.not.empty;
        res.body.data.forEach((comment) => {
          expect(comment).to.have.property("_id").that.is.a("string");
          expect(comment).to.have.property("parentId");
          expect(comment).to.have.property("text").that.is.a("string");
          expect(comment).to.have.property("createdAt").that.is.a("string");
          expect(comment).to.have.property("userId").that.is.a("string");
          expect(comment).to.have.property("username").that.is.a("string");
        });
        done();
      });
  });
});
