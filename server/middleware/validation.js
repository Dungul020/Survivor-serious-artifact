import { body, validationResult } from "express-validator";

export const validateSurvey = [
  body("userId").isString().trim().isLength({ min: 1, max: 50 }),
  body("demographics.age").isInt({ min: 18, max: 100 }),
  body("demographics.gender").isIn([
    "Male",
    "Female",
    "Non-binary",
    "Prefer not to say",
  ]),
  body("demographics.location").isString().trim().isLength({ min: 1, max: 100 }),
  body("drugHistory.primaryDrug").isString().trim().isLength({ min: 1 }),
  body("drugHistory.yearsOfUse").isInt({ min: 0, max: 50 }),
  body("drugHistory.ageStarted").isInt({ min: 10, max: 65 }),
  body("recoveryJourney.timeClean").isInt({ min: 0 }),
  body("recoveryJourney.quitAttempts").isInt({ min: 1, max: 50 }),
  body("advice.adviceForOthers").isString().trim().isLength({ min: 10, max: 1000 }),
  body("mentalHealth.hadTherapy").isBoolean(),
  body("mentalHealth.hadMedication").isBoolean(),
];

export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: errors.array(),
    });
  }
  next();
};
