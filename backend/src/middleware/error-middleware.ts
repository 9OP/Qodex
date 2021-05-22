/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-unused-vars */
import * as Koa from 'koa';

export async function errorHandler(ctx: Koa.Context, next: Koa.Next): Promise<void> {
  try {
    await next();
    const { status } = ctx.response;
    if (status === 404) {
      ctx.throw(404);
    }
    if (status === 405) {
      ctx.throw(405);
    }
  } catch (err) {
    ctx.response.status = err.status;
    ctx.app.emit('error', err, ctx);
  }
}

export function errorListenner(ctx: Koa.Context, next: Koa.Next): void {
  // log here
}
