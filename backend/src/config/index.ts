/* eslint-disable @typescript-eslint/no-non-null-assertion */
import dotenv from 'dotenv';
import path from 'path';

const PATH = path.resolve(process.cwd(), `${process.env.ENV_PATH}/.env`);
dotenv.config({ path: PATH });

if (process.env.APP_PRIVATE_KEY === undefined) {
  throw Error('PRIVATE KEY undefined!');
}

export default {
  mongodb: {
    username: process.env.DB_ADMIN_USERNAME,
    password: process.env.DB_ADMIN_PASSWORD,
    dev: process.env.DEV_DB,
    prod: process.env.PROD_DB,
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true,
    },
  },
  app: {
    PORT: process.env.PORT || 8000,
    PRIVATE_KEY: process.env.APP_PRIVATE_KEY,
    APP_KEY: process.env.APP_KEY,
    DOMAIN: process.env.DOMAIN,
  },
};
