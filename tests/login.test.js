const chai = require('chai');
const expect = chai.expect;
const supertest = require('supertest');
const app = require('../server'); // Replace with the path to your Express app

describe('/login endpoint', () => {
  it('should return a token when provided with correct credentials', (done) => {
    supertest(app)
      .post('/login')
      .send({ username: 'Lucas', password: 'Wivlar1234' }) // Replace with valid credentials
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
      .send({ username: 'john.doe', password: 'wrongpassword' }) // Replace with invalid credentials
      .expect(401)
      .end((err, res) => {
        expect(res.status).to.equal(401);
        expect(res.body).to.have.property('message');
        done();
      });
  });
});