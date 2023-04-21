const chai = require("chai");
const expect = chai.expect;
const supertest = require("supertest");
const app = require("../../../server"); // Replace with the path to your Express app
const dotenv = require("dotenv");
dotenv.config();
const cookie = require("cookie");

describe("/comment endpoint.  different methods(get,post,del)", () => {
  let commentId;

  it("should .login and return a jwt cookie to be used for other tests", (done) => {
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

  /**
   * how the return data should look
   * {
    "message": "success in postComment function at /comments",
    "result": {
        "acknowledged": true,
        "insertedId": "6441ff0546d4177be149908c"
    }
}
   */

  it("should .post a comment and save the commentId to be used for other tests", (done) => {
    supertest(app)
      .post("/comments")
      .set("Cookie", jwtCookie)
      .send({
        text: "test comment",
        parentId: null,
      })
      .expect(200)
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body).to.have.property("message");
        expect(res.body).to.have.property("result");
        expect(res.body.result).to.have.property("acknowledged").that.is.true;
        expect(res.body.result).to.have.property("insertedId");
        commentId = res.body.result.insertedId;
        done();
      });
  });
  // Post a child comment (reply)
  it("should .post a child comment (reply) and save the childCommentId to be used for other tests", (done) => {
    supertest(app)
      .post("/comments")
      .set("Cookie", jwtCookie)
      .send({
        text: "test child comment",
        parentId: commentId,
      })
      .expect(200)
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body).to.have.property("message");
        expect(res.body).to.have.property("result");
        expect(res.body.result).to.have.property("acknowledged").that.is.true;
        expect(res.body.result).to.have.property("insertedId");
        childCommentId = res.body.result.insertedId;
        done();
      });
  });

  // Delete parent comment and check if both parent and child comments are deleted
  it("should .delete the inserted parent comment along with its replies", (done) => {
    supertest(app)
      .delete(`/comments`)
      .set("Cookie", jwtCookie)
      .send({ _id: commentId })
      .expect(200)
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body).to.have.property("message");
        expect(res.body).to.have.property("result");
        expect(res.body.result).to.have.property("acknowledged").that.is.true;
        expect(res.body.result)
          .to.have.property("deletedCount")
          .that.is.equal(1);
        expect(res.body).to.have.property("deletedReplies");
        expect(res.body.deletedReplies).to.have.property("acknowledged").that.is
          .true;
        expect(res.body.deletedReplies)
          .to.have.property("deletedCount")
          .that.is.at.least(1);
        done();
      });
  });

  it("should .get comments with correct data format", (done) => {
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
          //console.log(comment.parentId); //denna logg visar att vi får error när parentId är en string(i databasen så står det string)
          expect(comment).to.have.property("parentId");
          /**
           * why cant it be either?
           * .that.is.oneOf([null, "string"]);
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
