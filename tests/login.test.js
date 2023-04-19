const chai = require('chai');
const expect = chai.expect;
const supertest = require('supertest');
const app = require('../server'); // Replace with the path to your Express app
const dotenv = require('dotenv');
dotenv.config();

describe('/login endpoint', () => {
  it('should return a token when provided with correct credentials', (done) => {
    supertest(app)
      .post('/login')
      .send({ username: process.env.LOGIN_TEST_USR, password: process.env.LOGIN_TEST_PW }) // Add the username and password within the .env file. 
      .expect(200)
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body).to.have.property('token');
        done();
      });
  });

  it('should return an error when provided with incorrect credentials', (done) => {
    supertest(app)
      .post('/login')
      .send({ username: 'Lucas', password: 'wrongpassword' }) // Replace with invalid credentials
      .expect(401)
      .end((err, res) => {
        expect(res.status).to.equal(401);
        expect(res.body).to.have.property('message');
        done();
      });
  });
});