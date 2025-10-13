// analytics.js
// const {  Analytics } = require('../models/surveys');
import  Analytics  from "../models/surveys.js";
/**
 * Middleware to track an event
 * @param {string} eventName - The name of the event to track
 * @param {Object} metadata - Optional metadata to include
 */
const trackEvent = (eventName, metadata = {}) => {
  return async (req, res, next) => {
    try {
      await Analytics.create({
        event: eventName,
        userId: req.body.userId || req.ip,
        sessionId: req.sessionID || req.get('x-session-id'),
        timestamp: new Date(),
        metadata: {
          ...metadata,
          userAgent: req.get('User-Agent'),
          ip: req.ip
        }
      });
    } catch (error) {
      console.error('Analytics tracking failed:', error);
    }
    next();
  };
};

export default trackEvent;
