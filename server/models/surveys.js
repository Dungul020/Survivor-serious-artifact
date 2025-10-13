import { Schema, model } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

// Survey Schema with detailed validation
const surveySchema = new Schema({
 userId: {
  type: String,
  unique: true,
  index: true,
   default: () => `user${Math.floor(1000 + Math.random() * 9000)}`
},


  // Demographics Section
  demographics: {
    age: {
      type: Number,
      required: true,
      min: 18,
      max: 100,
      validate: {
        validator: function(v) {
          return v >= 18 && v <= 100;
        },
        message: 'Age must be between 18 and 100'
      }
    },
    gender: {
      type: String,
      required: true,
      enum: ['Male', 'Female', 'Non-binary', 'Prefer not to say']
    },
    location: {
      type: String,
      required: true,
      maxlength: 100
    },
    education: {
      type: String,
      enum: ['High School', 'Some College', 'College Graduate', 'Graduate Degree', 'Other']
    },
    employment: {
      type: String,
      enum: ['Employed', 'Unemployed', 'Student', 'Retired', 'Disabled', 'Other']
    }
  },

  // Drug History Section
  drugHistory: {
    primaryDrug: {
      type: String,
      required: false,
      enum: [
        'Alcohol', 'Cocaine', 'Heroin', 'Methamphetamine', 'Prescription opioids',
        'Cannabis', 'MDMA/Ecstasy', 'LSD', 'Benzodiazepines', 'Amphetamines',
        'Fentanyl', 'Other stimulants', 'Other depressants', 'Other hallucinogens', 'Other'
      ]
    },
   
    yearsOfUse: {
      type: Number,
      required: true,
      min: 0,
      max: 50
    },
    ageStarted: {
      type: Number,
      required: true,
      min: 10,
      max: 65
    },
    frequencyOfUse: {
      type: String,
      enum: ['Daily', 'Weekly', 'Monthly', 'Occasionally', 'Binge episodes']
    },
    // routeOfAdministration: {
    //   type: String,
    //   enum: ['Oral', 'Smoking', 'Snorting', 'Injection', 'Other', 'Multiple routes']
    // }
  }, // ✅ This closing brace was missing

  // Recovery Journey Section
  recoveryJourney: {
    timeClean: {
      type: Number,
      required: false,
      min: 0,
      validate: {
        validator: function(v) {
          return v >= 0;
        },
        message: 'Time clean cannot be negative'
      }
    },
    quitAttempts: {
      type: Number,
      required: true,
      min: 1,
      max: 50
    },
    motivations: [{
      type: String,
      enum: [
        'Family', 'Children', 'Health concerns', 'Legal issues', 'Financial problems',
        'Career/Employment', 'Personal growth', 'Relationships', 'Spiritual reasons',
        'Near-death experience', 'Loss of loved one', 'Rock bottom moment',
        'Pregnancy', 'Court order', 'Other'
      ]
    }],
    biggestChallenges: [{
      type: String,
      enum: [
        'Cravings', 'Withdrawal symptoms', 'Depression/Anxiety', 'Social pressure', 'Boredom',
        'Stress management', 'Relationship problems', 'Financial stress', 'Legal issues',
        'Housing instability', 'Employment issues', 'Trauma memories', 'Physical pain',
        'Sleep problems', 'Other'
      ]
    }],
    successFactors: [{
      type: String,
      enum: [
        'Professional therapy', 'Support groups (AA/NA)', 'Family support',
        'Medication-assisted treatment', 'Inpatient treatment', 'Outpatient treatment',
        'Sober living', 'Exercise/fitness', 'New hobbies', 'Career focus', 'Education',
        'Spirituality/religion', 'Peer support', 'Medication for mental health',
        'Cognitive behavioral therapy', 'Group therapy', 'Individual counseling', 'Other'
      ]
    }]
  },

  // Mental Health Section
  mentalHealth: {
    hadTherapy: {
      type: Boolean,
      required: true
    },
    hadMedication: {
      type: Boolean,
      required: true
    }
  },

  status: {
  type: String,
  enum: ['draft', 'completed', 'verified', 'flagged'],
  default: 'completed'
},




  // Advice and Insights Section
  advice: {
    adviceForOthers: {
      type: String,
      required: false,
      maxlength: 1000
    }
  },

  // Quality of Life Metrics
  qualityOfLife: {
    overallSatisfaction: { type: Number },
    physicalHealth: { type: Number },
    mentalHealth: { type: Number },
    workSatisfaction: { type: Number }
  },

  // Privacy and Consent
  consentToShare: {
    type: Boolean,
    default: false
  },

  // Timestamps
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Pre-save middleware to update updatedAt
surveySchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});


// User feedback/rating schema
const feedbackSchema = new Schema({
  surveyId: {
    type: Schema.Types.ObjectId,
    ref: 'Survey',
    required: true
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    required: true
  },
  comment: {
    type: String,
    maxlength: 500
  },
  helpful: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Analytics tracking schema
const analyticsSchema = new Schema({
  event: {
    type: String,
    required: true,
    enum: [
      'survey_started',
      'survey_completed',
      'survey_abandoned',
      'dashboard_viewed',
      'data_exported'
    ]
  },
  userId: String,
  sessionId: String,
  timestamp: {
    type: Date,
    default: Date.now
  },
  metadata: {
    type: Schema.Types.Mixed
  }
});

// Create indexes for better performance
surveySchema.index({ 'demographics.age': 1 });
surveySchema.index({ 'drugHistory.primaryDrug': 1 });
surveySchema.index({ 'recoveryJourney.timeClean': 1 });
surveySchema.index({ createdAt: -1 });
surveySchema.index({ status: 1 });

analyticsSchema.index({ event: 1, timestamp: -1 });
analyticsSchema.index({ userId: 1 });

// Create models
const Survey = model('Survey', surveySchema);
const Feedback = model('Feedback', feedbackSchema);
const Analytics = model('Analytics', analyticsSchema);

export default {
  Survey,
  Feedback,
  Analytics
};
