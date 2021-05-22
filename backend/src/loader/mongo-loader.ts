/* eslint-disable no-console */
import mongoose from 'mongoose';
import config from '../config';

const { mongodb } = config;
let DB;
if (process.env.NODE_ENV === 'production') {
  DB = mongodb.prod;
} else {
  DB = mongodb.dev;
}

mongoose.connect(`mongodb+srv://${mongodb.username}:${mongodb.password}${DB}`, mongodb.options);
mongoose.connection.on('error', console.error.bind(console, 'connection error:'));
export default mongoose;
