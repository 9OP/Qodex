/* eslint-disable @typescript-eslint/camelcase */
import Koa from 'koa';
import usersService from '../services/user-services';


export default {
  async getUser(ctx: Koa.Context): Promise<void> {
    const user_id = ctx.user.id;
    const user = await usersService.getUser(user_id);
    ctx.response.body = { user };
    ctx.response.status = 200;
    ctx.response.message = 'Sucessfully get user';
  },
};
