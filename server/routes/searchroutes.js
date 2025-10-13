import { Router } from 'express';
const router = Router();
import { advancedSearch } from '../controllers/searchcontroller.js';

// Advanced search
router.post('/', advancedSearch);

export default router;
