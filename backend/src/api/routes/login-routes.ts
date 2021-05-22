import KoaRouter from 'koa-router';

import { auth } from '../../middleware/auth-middleware';
import loginController from '../controllers/login-controllers';


const router = new KoaRouter();
const prefix = '/api/login';


router.prefix(prefix);


router.post('/signin', loginController.signinUser);
router.post('/signup', loginController.signupUser);
router.post('/signout', loginController.signoutUser);
router.get('/authenticated', auth, loginController.authenticateUser);

export default { router, route: prefix };
