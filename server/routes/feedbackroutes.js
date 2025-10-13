import { Router } from 'express';
const router = Router();
import { submitFeedback } from '../controllers/feedbackcontroller.js';

// Submit feedback
router.post('/', submitFeedback);

export default router;
