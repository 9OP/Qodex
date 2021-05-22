/* eslint-disable @typescript-eslint/camelcase */
import Koa from 'koa';
import statsServices from '../services/stats-services';


export default {
  async getStats(ctx: Koa.Context): Promise<void> {
    const user_id = ctx.user.id;
    const stats = await statsServices.getStats(user_id);
    ctx.response.body = { stats };
    ctx.response.status = 200;
    ctx.response.message = 'Sucessfully get stats';
  },
};
