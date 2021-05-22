import Koa from 'koa';
import loginServices from '../services/login-services';
import validate from './validations/login-validation';


export default {
  async signinUser(ctx: Koa.Context): Promise<void> {
    // Check user credential and return JWT on success
    let CONFIG = {};
    if (process.env.NODE_ENV === 'production') {
      CONFIG = {
        domain: process.env.DOMAIN,
        signed: true,
        secure: true,
        httpOnly: true,
      };
    } else {
      CONFIG = {
        signed: true,
        httpOnly: true,
      };
    }

    try {
      const user = await validate.UserLogin(ctx.request.body.user);
      const { token, id } = await loginServices.signinUser(user);
      ctx.cookies.set('access-token', token, CONFIG);
      ctx.response.body = { id };
      ctx.response.status = 200;
      ctx.response.message = 'Succesfully login user';
    } catch (err) {
      ctx.response.status = 400;
      ctx.response.message = err.message;
    }
  },

  async signupUser(ctx: Koa.Context): Promise<void> {
    // Register new user
    try {
      const user = await validate.UserRegister(ctx.request.body.user);
      const { id } = await loginServices.signupUser(user);
      ctx.response.body = { id };
      ctx.response.status = 200;
      ctx.response.message = 'Succesfully register user';
    } catch (err) {
      ctx.response.status = 400;
      ctx.response.message = err.message;
    }
  },

  async authenticateUser(ctx: Koa.Context): Promise<void> {
    try {
      ctx.response.body = ctx.user;
      ctx.response.status = 200;
      ctx.response.message = 'Valid access token';
    } catch (err) {
      ctx.response.status = 400;
      ctx.response.message = err.message;
    }
  },

  async signoutUser(ctx: Koa.Context): Promise<void> {
    try {
      ctx.cookies.set('access-token', '');
      ctx.response.status = 200;
      ctx.response.message = 'Succesfully signout user';
    } catch (err) {
      ctx.response.status = 400;
      ctx.response.message = err.message;
    }
  },
};
