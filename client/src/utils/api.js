const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// API utility functions
export const api = {
  // Survey endpoints
  surveys: {
  getAll: async () => {
    try {
      const response = await fetch(`${API_BASE}/surveys`);
      if (!response.ok) throw new Error('Failed to fetch surveys');
      const result = await response.json();
      return result.data || []; // ✅ Return just the survey array
    } catch (error) {
      console.error('Error fetching surveys:', error);
      return []; // ✅ Fail gracefully with an empty array
    }
  },


    addSurvey: async (surveyData) => {
      try {
        const response = await fetch(`${API_BASE}/surveys`, {
        
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(surveyData),
        });
        if (!response.ok) throw new Error('Failed to create survey');
        return await response.json();
      } catch (error) {
        console.error('Error creating survey:', error);
        throw error;
      }
    },

    getStats: async () => {
      try {
        const response = await fetch(`${API_BASE}/stats`);
        if (!response.ok) throw new Error('Failed to fetch stats');
        return await response.json();
      } catch (error) {
        console.error('Error fetching stats:', error);
        throw error;
      }
    }
  }
};

// Validation utilities
export const validation = {
  isValidAge: (age) => age >= 18 && age <= 100,
  isValidYears: (years) => years >= 0 && years <= 50,
  isValidTimeClean: (months) => months >= 0,
  isValidQuitAttempts: (attempts) => attempts >= 1,
  isNotEmpty: (value) => value && value.toString().trim().length > 0,
  isValidEmail: (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
};

// Data processing utilities
export const dataUtils = {
  calculatePercentage: (value, total) => {
    if (total === 0) return 0;
    return Math.round((value / total) * 100);
  },

  formatTimeClean: (months) => {
    if (months < 12) return `${months} month${months !== 1 ? 's' : ''}`;
    const years = Math.floor(months / 12);
    const remainingMonths = months % 12;
    if (remainingMonths === 0) return `${years} year${years !== 1 ? 's' : ''}`;
    return `${years}y ${remainingMonths}m`;
  },

  getAgeGroup: (age) => {
    if (age < 25) return '18-24';
    if (age < 35) return '25-34';
    if (age < 45) return '35-44';
    if (age < 55) return '45-54';
    return '55+';
  },

  getRecoveryTimeGroup: (months) => {
    if (months < 6) return '0-6 months';
    if (months < 12) return '6-12 months';
    if (months < 24) return '1-2 years';
    if (months < 60) return '2-5 years';
    return '5+ years';
  },

  // Generate synthetic data for testing
  generateTestData: () => {
    const drugs = ['Alcohol', 'Cocaine', 'Heroin', 'Prescription opioids', 'Methamphetamine'];
    const genders = ['Male', 'Female', 'Non-binary'];
    const locations = ['New York, NY', 'Los Angeles, CA', 'Chicago, IL', 'Houston, TX', 'Phoenix, AZ'];
    const motivations = ['Family', 'Health concerns', 'Legal issues', 'Financial problems', 'Career'];
    const successFactors = ['Professional therapy', 'Support groups (AA/NA)', 'Family support', 'Medication-assisted treatment'];
    
    return {
      userId: Date.now().toString(),
      demographics: {
        age: Math.floor(Math.random() * 50) + 18,
        gender: genders[Math.floor(Math.random() * genders.length)],
        location: locations[Math.floor(Math.random() * locations.length)]
      },
      drugHistory: {
        primaryDrug: drugs[Math.floor(Math.random() * drugs.length)],
        yearsOfUse: Math.floor(Math.random() * 15) + 1,
        ageStarted: Math.floor(Math.random() * 20) + 15
      },
      recoveryJourney: {
        timeClean: Math.floor(Math.random() * 60) + 1,
        quitAttempts: Math.floor(Math.random() * 5) + 1,
        motivations: motivations.slice(0, Math.floor(Math.random() * 3) + 1),
        successFactors: successFactors.slice(0, Math.floor(Math.random() * 3) + 1)
      },
      mentalHealth: {
        hadTherapy: Math.random() > 0.5,
        hadMedication: Math.random() > 0.6
      },
      advice: {
        adviceForOthers: "Take it one day at a time and don't be afraid to ask for help. Recovery is possible."
      },
      anonymous: true,
      createdAt: new Date()
    };
  }
};

// Local storage utilities (for offline functionality)
export const storage = {
  saveDraft: (surveyData) => {
    localStorage.setItem('surveyDraft', JSON.stringify(surveyData));
  },
  
  loadDraft: () => {
    const draft = localStorage.getItem('surveyDraft');
    return draft ? JSON.parse(draft) : null;
  },
  
  clearDraft: () => {
    localStorage.removeItem('surveyDraft');
  },
  
  savePreferences: (preferences) => {
    localStorage.setItem('userPreferences', JSON.stringify(preferences));
  },
  
  loadPreferences: () => {
    const prefs = localStorage.getItem('userPreferences');
    return prefs ? JSON.parse(prefs) : {
      theme: 'light',
      notifications: true,
      anonymousMode: true
    };
  }
};