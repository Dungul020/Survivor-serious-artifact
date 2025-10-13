import models from '../models/surveys.js';
const { Survey } = models;

import trackEvent from "../middleware/analytics.js";

// Get all surveys
export const getSurveys = async (req, res) => {
  try {
    await trackEvent("dashboard_viewed", req);

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const filter = { status: "completed" };
    if (req.query.ageMin || req.query.ageMax) {
      filter["demographics.age"] = {};
      if (req.query.ageMin) filter["demographics.age"].$gte = parseInt(req.query.ageMin);
      if (req.query.ageMax) filter["demographics.age"].$lte = parseInt(req.query.ageMax);
    }
    if (req.query.drug) filter["drugHistory.primaryDrug"] = req.query.drug;
    if (req.query.minCleanTime)
      filter["recoveryJourney.timeClean"] = { $gte: parseInt(req.query.minCleanTime) };
    if (req.query.gender) filter["demographics.gender"] = req.query.gender;
    if (req.query.startDate || req.query.endDate) {
      filter.createdAt = {};
      if (req.query.startDate) filter.createdAt.$gte = new Date(req.query.startDate);
      if (req.query.endDate) filter.createdAt.$lte = new Date(req.query.endDate);
    }

    const surveys = await Survey.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select("-ipAddress -userAgent");

    const total = await Survey.countDocuments(filter);

    res.json({
      success: true,
      data: surveys,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalRecords: total,
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1,
      },
    });
  } catch (error) {
    console.error("Error fetching surveys:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// Create new survey
export const createSurvey = async (req, res) => {
  try {
   
    await trackEvent("survey_started", req);

    const existingSurvey = await Survey.findOne({ userId: req.body.userId });
    if (existingSurvey)
      return res.status(409).json({
        success: false,
        message: "Survey already submitted for this user",
      });

    const surveyData = {
      ...req.body,
      ipAddress: req.ip,
      userAgent: req.get("User-Agent"),
      completionTime: req.body.completionTime || null,
    };

    const survey = new Survey(surveyData);
    const savedSurvey = await survey.save();

    await trackEvent("survey_completed", req, {
      surveyId: savedSurvey._id,
      primaryDrug: savedSurvey.drugHistory.primaryDrug,
      ageGroup:
        savedSurvey.demographics.age < 25
          ? "18-24"
          : savedSurvey.demographics.age < 35
          ? "25-34"
          : savedSurvey.demographics.age < 45
          ? "35-44"
          : savedSurvey.demographics.age < 55
          ? "45-54"
          : "55+",
    });

    res.status(201).json({
      success: true,
      message: "Survey submitted successfully",
      data: {
        id: savedSurvey._id,
        userId: savedSurvey.userId,
        createdAt: savedSurvey.createdAt,
      },
    });
  } catch (error) {
    console.error("Error creating survey:", error);
    if (error.name === "ValidationError")
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors: Object.values(error.errors).map((e) => e.message),
      });
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// Get survey by ID
export const getSurveyById = async (req, res) => {
  try {
    const survey = await Survey.findById(req.params.id).select(
      "-ipAddress -userAgent -userId"
    );
    if (!survey)
      return res.status(404).json({ success: false, message: "Survey not found" });

    res.json({ success: true, data: survey });
  } catch (error) {
    console.error("Error fetching survey:", error);
    res
      .status(500)
      .json({ success: false, message: "Error fetching survey" });
  }
};

// Update survey status
export const updateSurveyStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!["draft", "completed", "verified", "flagged"].includes(status))
      return res.status(400).json({ success: false, message: "Invalid status" });

    const survey = await Survey.findByIdAndUpdate(
      req.params.id,
      { status, updatedAt: new Date() },
      { new: true }
    );

    if (!survey)
      return res.status(404).json({ success: false, message: "Survey not found" });

    res.json({
      success: true,
      message: "Survey status updated",
      data: { id: survey._id, status: survey.status },
    });
  } catch (error) {
    console.error("Error updating survey status:", error);
    res
      .status(500)
      .json({ success: false, message: "Error updating survey status" });
  }
};
