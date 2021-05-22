import KoaRouter from 'koa-router';
import { auth } from '../../middleware/auth-middleware';
import questionsController from '../controllers/questions-controllers';
import userController from '../controllers/users-controller';

const router = new KoaRouter();
const prefix = '/api/user';


router.prefix(prefix);

// Get user's info (password is shadowed)
router.get('/', auth, userController.getUser);

// Get user's favorite questions (fetch from questions collection)
router.get('/favorites', auth, questionsController.getFavoriteQuestions);

// Get user's questions
router.get('/questions', auth, questionsController.getUserQuestions);


export default { router, route: prefix };
