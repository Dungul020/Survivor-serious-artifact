import { Router } from 'express';
const router = Router();
import { validateSurvey, handleValidationErrors } from '../middleware/validation.js';
import { getSurveys, createSurvey, getSurveyById, updateSurveyStatus } from '../controllers/surveycontroller.js';


// Get all surveys (with pagination & filters)
router.get('/', getSurveys);

// Create new survey
router.post('/', validateSurvey, handleValidationErrors, createSurvey);

// Get survey by ID
router.get('/:id', getSurveyById);

// Update survey status (admin only)
router.patch('/:id/status', updateSurveyStatus);

export default router;
