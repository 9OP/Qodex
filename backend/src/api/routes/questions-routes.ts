import KoaRouter from 'koa-router';
import { auth } from '../../middleware/auth-middleware';
import questionsController from '../controllers/questions-controllers';


const router = new KoaRouter();
const prefix = '/api/questions';


router.prefix(prefix);

// Get questions
router.get('/', auth, questionsController.getQuestions);

// Post question
router.post('/', auth, questionsController.postQuestion);

// Get question (by id)
router.get('/:q_id', auth, questionsController.getQuestion);

// Post answer
router.post('/:q_id', auth, questionsController.postAnswer);

// Patch question
router.patch('/:q_id', auth, questionsController.patchQuestion);

// Add question to user's favorite questions
router.put('/:q_id/follow', auth, questionsController.followQuestion);

// Remove question from user's favorite questions
router.put('/:q_id/unfollow', auth, questionsController.unfollowQuestion);

// Patch answer
router.patch('/:q_id/:a_id', auth, questionsController.patchAnswer);

export default { router, route: prefix };
