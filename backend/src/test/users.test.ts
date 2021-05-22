import request from 'supertest';
import faker from 'faker';
import API from '../api/routes/login-routes';
import app from '../app';
import * as DTO from '../types';
import setup from './setup';

// route = 'api/users'
const { route } = API;

const fakeUser = {
  name: faker.name.firstName(),
  email: faker.internet.email(),
  password: faker.internet.password(),
} as DTO.User;


describe('Users tests', () => {
  setup.DB('users');

  describe('Signup user', () => {
    it('Should signup user', async (done) => {
      const res = await request(app.callback()).post(`${route}/signup`).send({ user: fakeUser });
      expect(res.status).toBe(200);
      done();
    });

    it('Should not signup existing user', async (done) => {
      let res = await request(app.callback()).post(`${route}/signup`).send({ user: fakeUser });
      expect(res.status).toBe(200);

      res = await request(app.callback()).post(`${route}/signup`).send({ user: fakeUser });
      expect(res.status).toBe(400);
      done();
    });

    it('Should not signup user with invalid inputs', async (done) => {
      const fakeUserInvalid = {
        name: faker.name.firstName(),
        email: faker.name.firstName(), // not an email
        // password: faker.internet.password(), // password not provided
      } as DTO.User;

      const res = await request(app.callback()).post(`${route}/signup`).send({ user: fakeUserInvalid });
      expect(res.status).toBe(400);
      done();
    });
  });

  describe('Signin user', () => {
    it('Should signin user', async (done) => {
      let res = await request(app.callback()).post(`${route}/signup`).send({ user: fakeUser });
      expect(res.status).toBe(200);

      res = await request(app.callback()).post(`${route}/signin`).send({ user: fakeUser });
      expect(res.status).toBe(200);
      done();
    });

    it('Should not signin unsignuped user', async (done) => {
      const res = await request(app.callback()).post(`${route}/signin`).send({ user: fakeUser });
      expect(res.status).toBe(400);
      done();
    });

    it('Should not signin user with wrong password', async (done) => {
      let res = await request(app.callback()).post(`${route}/signup`).send({ user: fakeUser });
      expect(res.status).toBe(200);

      fakeUser.password = faker.internet.password();

      res = await request(app.callback()).post(`${route}/signin`).send({ user: fakeUser });
      expect(res.status).toBe(400);
      done();
    });

    it('Should not get ressource without token', async (done) => {
      const res = await request(app.callback()).get('/api/questions');
      expect(res.status).toBe(401);
      done();
    });

    it('Should not get ressource with invalid token', async (done) => {
      const res = await request(app.callback()).get('/api/questions');
      expect(res.status).toBe(401);
      done();
    });
  });

  describe('Signout user', () => {
    it('Should signout user', async (done) => {
      let res = await request(app.callback()).post(`${route}/signup`).send({ user: fakeUser });
      expect(res.status).toBe(200);

      res = await request(app.callback()).post(`${route}/signin`).send({ user: fakeUser });
      expect(res.status).toBe(200);

      res = await request(app.callback()).post(`${route}/signout`).send({ user: fakeUser });
      expect(res.status).toBe(200);

      res = await request(app.callback()).get('/api/questions');
      expect(res.status).toBe(401);

      done();
    });
  });
});
