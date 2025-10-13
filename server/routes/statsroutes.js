import { Router } from 'express';
const router = Router();
import { getStats } from '../controllers/statscontroller.js';

// Get survey statistics
router.get('/', getStats);

export default router;
