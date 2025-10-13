import { Router } from 'express';
const router = Router();
import  {getAnalytics } from '../controllers/analyticscontroller.js';

// Get analytics data
router.get('/', getAnalytics);

export default router;
