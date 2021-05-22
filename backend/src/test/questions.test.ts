/* eslint-disable no-underscore-dangle */
/* eslint-disable @typescript-eslint/camelcase */
/* eslint-disable max-len */
import request from 'supertest';
import faker from 'faker';

import app from '../app';
import API from '../api/routes/questions-routes';
import authAPI from '../api/routes/login-routes';
import * as DTO from '../types';
import setup from './setup';


// route = 'api/questions'
const { route } = API;


const fakeQuestion = {
  qodex: { id: '123' },
  title: faker.lorem.sentence(),
  question: faker.lorem.sentence(),
} as DTO.Question;

const fakeAnswer = {
  answer: faker.lorem.sentence(),
} as DTO.Answer;


async function register(name?: string, email?: string, password?: string): Promise<string> {
  const fakeUser = {
    name: name || faker.name.firstName(),
    email: email || faker.internet.email(),
    password: password || faker.internet.password(),
  } as DTO.User;

  await request(app.callback()).post(`${authAPI.route}/signup`).send({ user: fakeUser });
  const res = await request(app.callback()).post(`${authAPI.route}/signin`).send({ user: fakeUser });
  return res.header['set-cookie'];
}
describe('Questions tests', () => {
  setup.DB('questions');

  describe('Forbidden methods', () => {
    it('Should not del /api/questions', async (done) => {
      const res = await request(app.callback()).del(route);
      expect(res.status).toBe(405);
      done();
    });
  });


  describe('Get questions', () => {
    it('Should get /api/questions route', async (done) => {
      const cookies = await register();
      const res = await request(app.callback()).get(route).set('Cookie', cookies);
      expect(res.status).toBe(200);
      done();
    });


    it('Should post & get question', async (done) => {
      const cookies = await register();
      let res = await request(app.callback()).post(route).set('Cookie', cookies).send({ question: fakeQuestion });
      expect(res.status).toBe(200);
      const { id } = res.body;

      res = await request(app.callback()).get(`${route}/${id}`).set('Cookie', cookies);
      expect(res.status).toBe(200);

      const { question } = res.body;
      expect(question).toMatchObject(fakeQuestion);
      done();
    });
  });

  describe('Post question', () => {
    it('Should post a question', async (done) => {
      const cookies = await register();
      const res = await request(app.callback()).post(route).set('Cookie', cookies).send({ question: fakeQuestion });
      expect(res.status).toBe(200);
      done();
    });

    it('Should not post a question (bad request)', async (done) => {
      const cookies = await register();

      // No data
      let res = await request(app.callback()).post(route).set('Cookie', cookies);
      expect(res.status).toBe(400);

      // Data empty or incomplete
      res = await request(app.callback()).post(route).set('Cookie', cookies).send({ question: {} as DTO.Question });
      expect(res.status).toBe(400);
      done();
    });
  });

  describe('Post answer', () => {
    it('Should post an answer', async (done) => {
      const cookies = await register();

      let res = await request(app.callback()).post(route).set('Cookie', cookies).send({ question: fakeQuestion });
      expect(res.status).toBe(200);
      const { id } = res.body;

      res = await request(app.callback()).post(`${route}/${id}`).set('Cookie', cookies).send({ answer: fakeAnswer });
      expect(res.status).toBe(200);

      res = await request(app.callback()).post(`${route}/${id}`).set('Cookie', cookies).send({ answer: fakeAnswer });
      expect(res.status).toBe(200);

      res = await request(app.callback()).get(`${route}/${id}`).set('Cookie', cookies);
      expect(res.status).toBe(200);
      const { answers } = res.body;
      expect(answers[0]).toMatchObject(fakeAnswer);
      done();
    });

    it('Should not post an answer (bad request)', async (done) => {
      const cookies = await register();

      let res = await request(app.callback()).post(route).set('Cookie', cookies).send({ question: fakeQuestion });
      expect(res.status).toBe(200);
      const { id } = res.body;

      // No data
      res = await request(app.callback()).post(`${route}/${id}`).set('Cookie', cookies);
      expect(res.status).toBe(400);

      // Data empty or incomplete
      res = await request(app.callback()).post(`${route}/${id}`).set('Cookie', cookies).send({ answer: {} as DTO.Answer });
      expect(res.status).toBe(400);
      done();
    });

    it('Should not post an answer (page not found)', async (done) => {
      const cookies = await register();
      const id = faker.random.alphaNumeric(12); // mongoose id = 12 char
      const res = await request(app.callback()).post(`${route}/${id}`).set('Cookie', cookies).send({ answer: fakeAnswer });
      expect(res.status).toBe(404);
      done();
    });
  });

  describe('Get question (thread)', () => {
    it('Should get question thread', async (done) => {
      const cookies = await register();
      let res = await request(app.callback()).post(route).set('Cookie', cookies).send({ question: fakeQuestion });
      expect(res.status).toBe(200);
      const { id } = res.body;

      res = await request(app.callback()).post(`${route}/${id}`).set('Cookie', cookies).send({ answer: fakeAnswer });
      expect(res.status).toBe(200);

      res = await request(app.callback()).get(`${route}/${id}`).set('Cookie', cookies);
      expect(res.status).toBe(200);

      const { question, answers } = res.body;
      expect(question).toMatchObject(fakeQuestion);
      expect(answers[0]).toMatchObject(fakeAnswer);
      done();
    });

    it('Should not get question thread (not found)', async (done) => {
      const cookies = await register();
      const id = faker.random.alphaNumeric(12); // mongoose id = 12 char
      const res = await request(app.callback()).get(`${route}/${id}`).set('Cookie', cookies);
      expect(res.status).toBe(404);
      done();
    });
  });

  describe('Patch question', () => {
    it('Should patch a question', async (done) => {
      const cookies = await register();
      let res = await request(app.callback()).post(route).set('Cookie', cookies).send({ question: fakeQuestion });
      expect(res.status).toBe(200);
      const { id } = res.body;

      const patch = {
        title: faker.lorem.sentence(),
        question: faker.lorem.sentence(),
        qodex: { id: '123' },
      } as DTO.Question;

      res = await request(app.callback()).patch(`${route}/${id}`).set('Cookie', cookies).send({ patch });
      expect(res.status).toBe(200);

      res = await request(app.callback()).get(route).set('Cookie', cookies);
      expect(res.status).toBe(200);
      const { questions } = res.body;
      expect(questions[0]).toMatchObject(patch);
      done();
    });

    it('Should not patch a question (validation error)', async (done) => {
      const cookies = await register();
      let res = await request(app.callback()).post(route).set('Cookie', cookies).send({ question: fakeQuestion });
      expect(res.status).toBe(200);
      const { id } = res.body;

      const patch = {
        NotAProperty: faker.lorem.sentence(),
      };

      res = await request(app.callback()).patch(`${route}/${id}`).set('Cookie', cookies).send({ patch });
      expect(res.status).toBe(400);
      done();
    });

    it('Should upvote & downvote a question', async (done) => {
      const cookies = await register();
      let res = await request(app.callback()).post(route).set('Cookie', cookies).send({ question: fakeQuestion });
      expect(res.status).toBe(200);
      const { id } = res.body;

      res = await request(app.callback()).patch(`${route}/${id}`).set('Cookie', cookies).send({ vote: 'upvote' });
      expect(res.status).toBe(200);

      res = await request(app.callback()).get(route).set('Cookie', cookies);
      expect(res.status).toBe(200);
      let { questions } = res.body;
      expect(questions[0].score).toBe(1);

      res = await request(app.callback()).patch(`${route}/${id}`).set('Cookie', cookies).send({ vote: 'upvote' });
      expect(res.status).toBe(200);
      res = await request(app.callback()).get(route).set('Cookie', cookies);
      expect(res.status).toBe(200);
      questions = res.body.questions;
      expect(questions[0].score).toBe(0);

      res = await request(app.callback()).patch(`${route}/${id}`).set('Cookie', cookies).send({ vote: 'upvote' });
      expect(res.status).toBe(200);

      res = await request(app.callback()).get(route).set('Cookie', cookies);
      expect(res.status).toBe(200);
      questions = res.body.questions;
      expect(questions[0].score).toBe(1);

      res = await request(app.callback()).patch(`${route}/${id}`).set('Cookie', cookies).send({ vote: 'downvote' });
      expect(res.status).toBe(200);

      res = await request(app.callback()).get(route).set('Cookie', cookies);
      expect(res.status).toBe(200);
      questions = res.body.questions;
      expect(questions[0].score).toBe(-1);

      res = await request(app.callback()).patch(`${route}/${id}`).set('Cookie', cookies).send({ vote: 'downvote' });
      expect(res.status).toBe(200);


      res = await request(app.callback()).get(route).set('Cookie', cookies);
      expect(res.status).toBe(200);
      questions = res.body.questions;
      expect(questions[0].score).toBe(0);
      done();
    });

    it('Should not patch a question (not found)', async (done) => {
      const cookies = await register();
      const id = faker.random.alphaNumeric(12);
      const res = await request(app.callback()).patch(`${route}/${id}`).set('Cookie', cookies).send({ patch: fakeQuestion });
      expect(res.status).toBe(404);
      done();
    });
  });


  describe('Patch answer', () => {
    it('Should patch an answer', async (done) => {
      const cookies = await register();
      let res = await request(app.callback()).post('/api/questions').set('Cookie', cookies).send({ question: fakeQuestion });
      expect(res.status).toBe(200);
      const q_id = res.body.id;

      res = await request(app.callback()).post(`${route}/${q_id}`).set('Cookie', cookies).send({ answer: fakeAnswer });
      expect(res.status).toBe(200);

      res = await request(app.callback()).get(`${route}/${q_id}`).set('Cookie', cookies);
      expect(res.status).toBe(200);
      const { answers } = res.body;

      expect(answers[0]).toMatchObject(fakeAnswer);
      const a_id = answers[0].id;

      const patch = {
        answer: faker.lorem.sentence(),
      } as DTO.Answer;

      res = await request(app.callback()).patch(`${route}/${q_id}/${a_id}`).set('Cookie', cookies).send({ patch });
      expect(res.status).toBe(200);
      done();
    });

    it('Should not patch an answer (validation error)', async (done) => {
      const cookies = await register();
      let res = await request(app.callback()).post('/api/questions').set('Cookie', cookies).send({ question: fakeQuestion });
      expect(res.status).toBe(200);
      const q_id = res.body.id;

      res = await request(app.callback()).post(`${route}/${q_id}`).set('Cookie', cookies).send({ answer: fakeAnswer });
      expect(res.status).toBe(200);

      res = await request(app.callback()).get(`${route}/${q_id}`).set('Cookie', cookies);
      expect(res.status).toBe(200);
      const { answers } = res.body;

      expect(answers[0]).toMatchObject(fakeAnswer);
      const a_id = answers[0].id;

      const patch = {
        NotAProperty: faker.lorem.sentence(),
      };

      res = await request(app.callback()).patch(`${route}/${q_id}/${a_id}`).set('Cookie', cookies).send({ patch });
      expect(res.status).toBe(400);
      done();
    });


    it('Should upvote & downvote an answer', async (done) => {
      const cookies = await register();
      let res = await request(app.callback()).post('/api/questions').set('Cookie', cookies).send({ question: fakeQuestion });
      expect(res.status).toBe(200);
      const q_id = res.body.id;

      res = await request(app.callback()).post(`${route}/${q_id}`).set('Cookie', cookies).send({ answer: fakeAnswer });
      expect(res.status).toBe(200);

      res = await request(app.callback()).get(`${route}/${q_id}`).set('Cookie', cookies);
      expect(res.status).toBe(200);
      let { answers } = res.body;

      expect(answers[0]).toMatchObject(fakeAnswer);
      expect(answers[0].score).toBe(0);
      const a_id = answers[0].id;

      res = await request(app.callback()).patch(`${route}/${q_id}/${a_id}`).set('Cookie', cookies).send({ vote: 'upvote' });
      expect(res.status).toBe(200);

      res = await request(app.callback()).get(`${route}/${q_id}`).set('Cookie', cookies);
      expect(res.status).toBe(200);
      answers = res.body.answers;

      expect(answers[0].score).toBe(1);
      done();
    });


    it('Should not patch an answer (not found)', async (done) => {
      const cookies = await register();
      let res = await request(app.callback()).post('/api/questions').set('Cookie', cookies).send({ question: fakeQuestion });
      expect(res.status).toBe(200);

      res = await request(app.callback()).get('/api/questions').set('Cookie', cookies);
      expect(res.status).toBe(200);
      const q_id = res.body.id;

      const a_id = faker.random.alphaNumeric(12);
      res = await request(app.callback()).patch(`${route}/${q_id}/${a_id}`).set('Cookie', cookies).send({ patch: fakeAnswer });
      expect(res.status).toBe(404);
      done();
    });
  });
});
