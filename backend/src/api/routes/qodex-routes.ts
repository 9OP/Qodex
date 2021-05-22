import KoaRouter from 'koa-router';
import { auth, authz_admin } from '../../middleware/auth-middleware';
import qodexController from '../controllers/qodex-controllers';


const router = new KoaRouter();
const prefix = '/api/qodexes';


router.prefix(prefix);


// Get qodexes
router.get('/', auth, qodexController.getQodexes);

// Get qodex by id
router.get('/:q_id', auth, qodexController.getQodex);

// Create qodex
router.post('/', auth, authz_admin, qodexController.postQodex);

// Patch qodex
// router.patch('/:q_id', auth, authz_admin, qodexController.patchQodex);


export default { router, route: prefix };
