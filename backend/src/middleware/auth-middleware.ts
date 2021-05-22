import Koa from 'koa';
import jwt from 'jsonwebtoken';
import config from '../config';


export async function auth(ctx: Koa.Context, next: Koa.Next): Promise<void> {
  // get the token from the header if present
  const token = ctx.cookies.get('access-token');

  // if no token found, return response (without going to the next middelware)
  if (!token) {
    ctx.response.status = 401;
    ctx.response.message = 'Access denied. No token provided.';
  } else {
    try {
      const decoded = jwt.verify(token, config.app.PRIVATE_KEY);
      ctx.user = decoded; // add decoded to context
      await next();
    } catch (err) {
      // if invalid token
      ctx.response.status = 400;
      ctx.response.message = 'Invalid token.';
    }
  }
}

export async function authz_admin(ctx: Koa.Context, next: Koa.Next): Promise<void> {
  const { is_admin } = ctx.user;

  if (!is_admin) {
    ctx.response.status = 401;
    ctx.response.message = 'Access denied. Admin account required.';
  } else {
    await next();
  }
}
