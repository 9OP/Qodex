import Koa from 'koa';
import loader from './loader/app-loader';


const app = loader(new Koa());
export default app;
