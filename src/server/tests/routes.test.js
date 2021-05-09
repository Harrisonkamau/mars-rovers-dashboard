const request = require('supertest');
const createApp = require('../createApp');
const { expect } = require('./setup');

let server;

describe('Public routes', () => {
  beforeEach(async () => {
    const app = await createApp();
    server = await app.listen();
  });

  afterEach(async () => {
    await server.close();
  });

  describe('GET /', () => {
    it('Returns a status of 200', async () => {
      const res = await request(server)
        .get('/');

      expect(res.status).to.eq(200);
      expect(res.body).to.deep.equal({
        message: 'Welcome to Mars Rover Dashboard server',
      });
    });
  });
});
