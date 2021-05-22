/* eslint-disable @typescript-eslint/camelcase */
import Koa from 'koa';
import quodexServices from '../services/qodex-services';
import validate from './validations/qodex-validation';

export default {
  async getQodexes(ctx: Koa.Context): Promise<void> {
    const qodexes = await quodexServices.getQodexes();
    ctx.response.body = { qodexes };
    ctx.response.status = 200;
    ctx.response.message = 'Sucessfully get qodexes';
  },


  async getQodex(ctx: Koa.Context): Promise<void> {
    try {
      const { qodex, questions } = await quodexServices.getQodex(ctx.params.q_id);
      ctx.response.body = {
        qodex,
        questions,
      };
      ctx.response.status = 200;
      ctx.response.message = 'Successfully get qodex';
    } catch (err) {
      ctx.response.status = 404;
      ctx.response.message = err.message;
    }
  },


  async postQodex(ctx: Koa.Context): Promise<void> {
    try {
      const qodex = await validate.Qodex({
        ...ctx.request.body.qodex,
      });
      const id = await quodexServices.postQodex(qodex);
      ctx.response.body = { id };
      ctx.response.status = 200;
      ctx.response.message = 'Successfully post qodex';
    } catch (err) {
      ctx.response.status = err.name === 'ValidationError' ? 400 : 404;
      ctx.response.message = err.message;
    }
  },
};
