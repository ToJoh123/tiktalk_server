const chai = require('chai');
const expect = chai.expect;
const supertest = require('supertest');
const app = require('../server'); 

const { main } = require('../src/database/database'); 

let coll; // Collection variable from database.js

describe('/register', () => {
  //Main function to connect.
  before(async () => {
    coll = await main();
  });

  it('should insert a user when provided with valid credentials', (done) => {
    supertest(app)
      .post('/register')
      .send({ firstname: 'Test', surname: 'Testsson', username: 'jadajada', password: 'jadajada' })
      .expect(201)
      .end(async (err, res) => {
        expect(res.status).to.equal(201);
        expect(res.body).to.have.property('message').equal('User registered successfully');

        //Check if user was inserted into MongoDB collection.
        const users = await coll.find({ username: 'jadajada' }).toArray();
        expect(users.length).to.equal(1);
        expect(users[0]).to.have.property('username').equal('jadajada');

        //Delete the inserted user.
        await coll.deleteOne({ username: 'jadajada' });

        done();
      });
  });

  it('should return error where username is already in use', (done) => {
    supertest(app)
      .post('/register')
      .send({ firstname: 'Jonathan', surname: 'Ljung', username: 'Jonathan', password: 'password' }) //Replace with invalid credentials.
      .expect(409)
      .end((err, res) => {
        expect(res.status).to.equal(409);
        expect(res.body).to.have.property('message');
        done();
      });
  });
});