import Koa from 'koa';
import cors from '@koa/cors';
import logger from 'koa-logger';
import bodyParser from 'koa-bodyparser';
import json from 'koa-json';
import compression from 'koa-compress';
import helmet from 'koa-helmet';
import { errorHandler, errorListenner } from '../middleware/error-middleware';
import config from '../config';
import api from '../api';


export default (app: Koa): Koa => {
  // eslint-disable-next-line no-param-reassign
  app.keys = [`${config.app.APP_KEY}`];

  // Error middleware
  app.use(errorHandler);
  app.on('error', errorListenner);

  // CORS
  const corsOptions = {
    credentials: true,
  };
  app.use(cors(corsOptions));

  // Helmet HTTP header
  app.use(helmet());

  // Use prettier
  app.use(json());

  // Compression
  app.use(compression());

  // Body parser middleware
  app.use(bodyParser());

  // Logger Middleware
  if (process.env.NODE_ENV === 'development') {
    app.use(logger());
  }

  // Set proxy for secure cookie
  if (process.env.NODE_ENV === 'production') {
    // eslint-disable-next-line no-param-reassign
    app.proxy = true; // enable secure cookie
  }

  // Router Middleware
  api.router.forEach((_) => {
    app.use(_.routes()).use(_.allowedMethods());
  });

  // ...More middlewares

  return app;
};
