import  Feedback  from '../models/surveys.js';

export async function submitFeedback(req, res) {
  try {
    const { surveyId, rating, comment, helpful } = req.body;

    const feedback = new Feedback({ surveyId, rating, comment, helpful });
    await feedback.save();

    res.status(201).json({ success: true, message: 'Feedback submitted successfully' });
  } catch (error) {
    console.error('Error submitting feedback:', error);
    res.status(500).json({ success: false, message: 'Error submitting feedback' });
  }
}
