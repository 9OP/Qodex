/* eslint-disable @typescript-eslint/camelcase */
import Koa from 'koa';
import questionsService from '../services/questions-services';
import usersService from '../services/user-services';
import validate from './validations/questions-validation';


export default {
  async getQuestions(ctx: Koa.Context): Promise<void> {
    const { search, limit } = await validate.QuestionFilter({
      ...ctx.request.query,
    });
    const questions = await questionsService.getQuestions(search, limit);
    ctx.response.body = { questions };
    ctx.response.status = 200;
    ctx.response.message = 'Sucessfully get questions';
  },


  async getFavoriteQuestions(ctx: Koa.Context): Promise<void> {
    const user_id = ctx.user.id;
    const questions = await questionsService.getFavoriteQuestions(user_id);
    ctx.response.body = { questions };
    ctx.response.status = 200;
    ctx.response.message = 'Sucessfully get favorite questions';
  },


  async getUserQuestions(ctx: Koa.Context): Promise<void> {
    const user_id = ctx.user.id;
    const questions = await questionsService.getUserQuestions(user_id);
    ctx.response.body = { questions };
    ctx.response.status = 200;
    ctx.response.message = 'Sucessfully get user questions';
  },


  async postQuestion(ctx: Koa.Context): Promise<void> {
    try {
      const question = await validate.Question({
        ...ctx.request.body.question,
        author: { id: ctx.user.id },
      });
      const id = await questionsService.postQuestion(question);
      ctx.response.body = { id };
      ctx.response.status = 200;
      ctx.response.message = 'Successfully post question';
    } catch (err) {
      ctx.response.status = 400;
      ctx.response.message = err.message;
    }
  },


  async getQuestion(ctx: Koa.Context): Promise<void> {
    try {
      const { question, answers } = await questionsService.getQuestion(ctx.params.q_id);
      ctx.response.body = {
        question,
        answers,
      };
      ctx.response.status = 200;
      ctx.response.message = 'Successfully get question thread';
    } catch (err) {
      ctx.response.status = 404;
      ctx.response.message = err.message;
    }
  },


  async postAnswer(ctx: Koa.Context): Promise<void> {
    try {
      const answer = await validate.Answer({
        ...ctx.request.body.answer,
        author: { id: ctx.user.id },
      });
      const id = await questionsService.postAnswer(answer, ctx.params.q_id);
      ctx.response.body = { id };
      ctx.response.status = 200;
      ctx.response.message = 'Successfully post answer';
    } catch (err) {
      ctx.response.status = err.name === 'ValidationError' ? 400 : 404;
      ctx.response.message = err.message;
    }
  },


  async patchQuestion(ctx: Koa.Context): Promise<void> {
    try {
      const patch = await validate.patchQuestion({
        id: ctx.params.q_id,
        ...ctx.request.body.patch,
        author: { id: ctx.user.id },
      });
      const { vote } = ctx.request.body;
      await questionsService.patchQuestion(patch, vote);
      ctx.response.status = 200;
      ctx.response.message = 'Successfully patch question';
    } catch (err) {
      ctx.response.status = err.name === 'ValidationError' ? 400 : 404;
      ctx.response.message = err.message;
    }
  },


  async followQuestion(ctx: Koa.Context): Promise<void> {
    try {
      const question_id = ctx.params.q_id;
      const user_id = ctx.user.id;
      await usersService.followQuestion(question_id, user_id);
      ctx.response.status = 200;
      ctx.response.message = 'Successfully follow question';
    } catch (err) {
      ctx.response.status = 404;
      ctx.response.message = err.message;
    }
  },


  async unfollowQuestion(ctx: Koa.Context): Promise<void> {
    try {
      const question_id = ctx.params.q_id;
      const user_id = ctx.user.id;
      await usersService.unfollowQuestion(question_id, user_id);
      ctx.response.status = 200;
      ctx.response.message = 'Successfully unfollow question';
    } catch (err) {
      ctx.response.status = 404;
      ctx.response.message = err.message;
    }
  },


  async patchAnswer(ctx: Koa.Context): Promise<void> {
    try {
      const patch = await validate.patchAnswer({
        id: ctx.params.a_id,
        ...ctx.request.body.patch,
        author: { id: ctx.user.id },
      });
      const { vote } = ctx.request.body;
      await questionsService.patchAnswer(patch, vote);
      ctx.response.status = 200;
      ctx.response.message = 'Successfully patch answer';
    } catch (err) {
      ctx.response.status = err.name === 'ValidationError' ? 400 : 404;
      ctx.response.message = err.message;
    }
  },
};
