import KoaRouter from 'koa-router';
import { auth } from '../../middleware/auth-middleware';
import statsController from '../controllers/stats-controllers';

const router = new KoaRouter();
const prefix = '/api/stats';


router.prefix(prefix);

// Get platform main stats
router.get('/', auth, statsController.getStats);


export default { router, route: prefix };
