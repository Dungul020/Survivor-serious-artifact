import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight, Users, Clock, Bot, Shield, Heart, TrendingUp, Menu, X, ThumbsUp } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../utils/api'; 

const ChatbotSurvey = () => {
  const [messages, setMessages] = useState([]);
  const [currentInput, setCurrentInput] = useState('');
  const [currentStep, setCurrentStep] = useState(0);
  const [surveyData, setSurveyData] = useState({});
  const [isTyping, setIsTyping] = useState(false);
  const [currentOptions, setCurrentOptions] = useState([]);
  const [inputType, setInputType] = useState('text');
  const messagesEndRef = useRef(null);

   const [currentView, setCurrentView] = useState('survey');
    const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const navigate = useNavigate();
  
    const handleShareStory = () => {
      navigate('/survey');
    };
  const goToSurvey = () => {
    setIsMenuOpen(false);
    setCurrentView('survey');
  };
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };







  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const surveyFlow = [
    {
      id: 'welcome',
      botMessage: "Hello! I'm here to support you on your recovery journey. This survey will help us understand your experience and provide better resources. Everything you share is confidential and anonymous. Are you ready to begin?",
      inputType: 'options',
      options: ['Yes, let\'s start', 'I have questions first'],
      field: null
    },
    {
      id: 'username',
      botMessage: "Enter your username",
      inputType: 'text',
      field: 'userId',
      validation: (val) => val.length <= 100,
      errorMessage: 'Please keep username under 100 characters'
    },
    {
      id: 'age',
      botMessage: "Thank you for participating. Let's start with some basic information. How old are you?",
      inputType: 'number',
      field: 'demographics.age',
      validation: (val) => val >= 18 && val <= 100,
      errorMessage: 'Please enter an age between 18 and 100'
    },
    {
      id: 'gender',
      botMessage: "What is your gender identity?",
      inputType: 'options',
      options: ['Male', 'Female', 'Non-binary', 'Prefer not to say'],
      field: 'demographics.gender'
    },
    {
      id: 'location',
      botMessage: "What city or region are you from? (This helps us understand geographical trends)",
      inputType: 'text',
      field: 'demographics.location',
      validation: (val) => val.length <= 100,
      errorMessage: 'Please keep location under 100 characters'
    },
    {
      id: 'education',
      botMessage: "What's your highest level of education?",
      inputType: 'options',
      options: ['High School', 'Some College', 'College Graduate', 'Graduate Degree', 'Other'],
      field: 'demographics.education'
    },
    {
      id: 'employment',
      botMessage: "What's your current employment status?",
      inputType: 'options',
      options: ['Employed', 'Unemployed', 'Student', 'Retired', 'Disabled', 'Other'],
      field: 'demographics.employment'
    },
    {
      id: 'primary_drug',
      botMessage: "Now let's talk about your substance use history. What was your primary substance of concern? Remember, this is completely confidential.",
      inputType: 'options',
      options: ['Alcohol', 'Cocaine', 'Heroin', 'Methamphetamine', 'Prescription opioids', 'Cannabis', 'MDMA/Ecstasy', 'LSD', 'Benzodiazepines', 'Amphetamines', 'Fentanyl', 'Other stimulants', 'Other depressants', 'Other hallucinogens', 'Other'],
      field: 'drugHistory.primaryDrug'
    },
    
    {
      id: 'years_of_use',
      botMessage: "Approximately how many years did you use this substance?",
      inputType: 'number',
      field: 'drugHistory.yearsOfUse',
      validation: (val) => val >= 0 && val <= 50,
      errorMessage: 'Please enter a number between 0 and 50'
    },
    {
      id: 'age_started',
      botMessage: "At what age did you first start using?",
      inputType: 'number',
      field: 'drugHistory.ageStarted',
      validation: (val) => val >= 10 && val <= 65,
      errorMessage: 'Please enter an age between 10 and 65'
    },
    {
      id: 'frequency',
      botMessage: "How frequently were you using at your peak?",
      inputType: 'options',
      options: ['Daily', 'Weekly', 'Monthly', 'Occasionally', 'Binge episodes'],
      field: 'drugHistory.frequencyOfUse'
    },
    {
      id: 'quit_attempts',
      botMessage: "Recovery is often a journey with multiple attempts. How many times have you tried to quit or get clean?",
      inputType: 'number',
      field: 'recoveryJourney.quitAttempts',
      validation: (val) => val >= 1 && val <= 50,
      errorMessage: 'Please enter a number between 1 and 50'
    },
    {
      id: 'time_clean',
      botMessage: "How many days have you been clean/sober currently? (Enter 0 if you're just starting)",
      inputType: 'number',
      field: 'recoveryJourney.timeClean',
      validation: (val) => val >= 0,
      errorMessage: 'Please enter a number 0 or greater'
    },
    {
      id: 'motivations',
      botMessage: "What motivated you to seek recovery? You can select multiple options.",
      inputType: 'multiselect',
      options: ['Family', 'Children', 'Health concerns', 'Legal issues', 'Financial problems', 'Career/Employment', 'Personal growth', 'Relationships', 'Spiritual reasons', 'Near-death experience', 'Loss of loved one', 'Rock bottom moment', 'Pregnancy', 'Court order', 'Other'],
      field: 'recoveryJourney.motivations'
    },
    {
      id: 'biggest_challenges',
      botMessage: "What have been your biggest challenges in recovery? Select all that apply.",
      inputType: 'multiselect',
      options: ['Cravings', 'Withdrawal symptoms', 'Depression/Anxiety', 'Social pressure', 'Boredom', 'Stress management', 'Relationship problems', 'Financial stress', 'Legal issues', 'Housing instability', 'Employment issues', 'Trauma memories', 'Physical pain', 'Sleep problems', 'Other'],
      field: 'recoveryJourney.biggestChallenges'
    },
    {
      id: 'success_factors',
      botMessage: "What has helped you the most in your recovery journey? Select all that apply.",
      inputType: 'multiselect',
      options: ['Professional therapy', 'Support groups (AA/NA)', 'Family support', 'Medication-assisted treatment', 'Inpatient treatment', 'Outpatient treatment', 'Sober living', 'Exercise/fitness', 'New hobbies', 'Career focus', 'Education', 'Spirituality/religion', 'Peer support', 'Medication for mental health', 'Cognitive behavioral therapy', 'Group therapy', 'Individual counseling', 'Other'],
      field: 'recoveryJourney.successFactors'
    },
    {
      id: 'had_therapy',
      botMessage: "Have you ever received professional therapy or counseling for mental health issues?",
      inputType: 'options',
      options: ['Yes', 'No'],
      field: 'mentalHealth.hadTherapy'
    },

     {
      id: 'had_medication',
      botMessage: "Have you ever received professional therapy or counseling for mental health issues?",
      inputType: 'options',
      options: ['Yes', 'No'],
      field: 'mentalHealth.hadMedication'
    },
   
    {
      id: 'overall_satisfaction',
      botMessage: "On a scale of 1-10, how would you rate your overall life satisfaction today?",
      inputType: 'number',
      field: 'qualityOfLife.overallSatisfaction'
    },
    {
      id: 'physical_health',
      botMessage: "How would you rate your physical health today? (1-10)",
      inputType: 'number',
      field: 'qualityOfLife.physicalHealth'
    },
    {
      id: 'mental_health_rating',
      botMessage: "How would you rate your mental health today? (1-10)",
      inputType: 'number',
      field: 'qualityOfLife.mentalHealth'
    },
    {
      id: 'advice',
      botMessage: "What advice would you give to someone just starting their recovery journey? (Optional - feel free to skip)",
      inputType: 'textarea',
      field: 'advice.adviceForOthers',
      optional: true
    },
    {
      id: 'consent',
      botMessage: "Would you consent to having your anonymous responses used to help others in recovery?",
      inputType: 'options',
      options: ['Yes', 'No'],
      field: 'consentToShare'
    },
    {
      id: 'complete',
      botMessage: "Indicate if you are done ?",
      inputType: 'options',
      options: ['completed', 'draft'],
      field: 'status'
    },
     {
      id: 'submitted',
      botMessage: "Thank you so much for sharing your story. Your responses will help create better resources for people on their recovery journey. You're incredibly brave for taking this step. 💙\n\nRemember: Recovery is possible, you matter, and you're not alone.",
      
    }
  ];

  const setNestedValue = (obj, path, value) => {
    const keys = path.split('.');
    let current = obj;
    
    for (let i = 0; i < keys.length - 1; i++) {
      if (!(keys[i] in current)) {
        current[keys[i]] = {};
      }
      current = current[keys[i]];
    }
    
    current[keys[keys.length - 1]] = value;
  };

  const addBotMessage = (message, delay = 1000) => {
    setIsTyping(true);
    setTimeout(() => {
      setMessages(prev => [...prev, { type: 'bot', content: message, timestamp: new Date() }]);
      setIsTyping(false);
    }, delay);
  };

  const addUserMessage = (message) => {
    setMessages(prev => [...prev, { type: 'user', content: message, timestamp: new Date() }]);
  };

  const moveToNextStep = () => {
    if (currentStep < surveyFlow.length - 1) {
      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);
      const step = surveyFlow[nextStep];
      
      setTimeout(() => {
        addBotMessage(step.botMessage, 800);
        setInputType(step.inputType);
        setCurrentOptions(step.options || []);
      }, 500);
    }
  };

 const handleSubmit = async (value) => {
  const currentStepData = surveyFlow[currentStep];

  if (currentStepData.inputType === 'complete') return;

  // Validation
  if (currentStepData.validation && !currentStepData.validation(value)) {
    addBotMessage(currentStepData.errorMessage || 'Please check your input and try again.');
    return;
  }

  // Format display value
  let displayValue = value;
  if (Array.isArray(value)) {
    displayValue = value.join(', ');
  } else if (currentStepData.inputType === 'options' && (value === 'Yes' || value === 'No')) {
    displayValue = value;
  }

  addUserMessage(displayValue.toString());

  // Update survey data
  if (currentStepData.field) {
    const newData = { ...surveyData };
    let processedValue = value;

    // Convert Yes/No to boolean for therapy/medication fields
    if (currentStepData.field.includes('had')) {
      processedValue = value === 'Yes';
    }

    setNestedValue(newData, currentStepData.field, processedValue);
    setSurveyData(newData);
  }

  // Reset input
  setCurrentInput('');

  // Submit survey if this is the final actionable step
  if (currentStepData.id === 'consent') {
    try {
      console.log('Submitting surveyData:', surveyData);
      await api.surveys.addSurvey(surveyData);
      console.log('Survey submitted successfully');
    } catch (error) {
      console.error('Survey submission failed:', error);
      addBotMessage('Oops! Something went wrong while submitting your survey.');
    }
  }

  // Move to next step
  moveToNextStep();
};


  // Initialize chat
  useEffect(() => {
    if (messages.length === 0) {
      addBotMessage(surveyFlow[0].botMessage, 500);
      setInputType(surveyFlow[0].inputType);
      setCurrentOptions(surveyFlow[0].options || []);
    }
  }, []);

  const ScaleInput = ({ onSubmit }) => {
    const [selectedValue, setSelectedValue] = useState(null);
    
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-xs text-gray-500">Very Poor</span>
          <span className="text-xs text-gray-500">Excellent</span>
        </div>
        <div className="flex space-x-2">
          {[1,2,3,4,5,6,7,8,9,10].map(num => (
            <button
              key={num}
              onClick={() => {
                setSelectedValue(num);
                onSubmit(num);
              }}
              className={`w-8 h-8 rounded-full border-2 text-sm font-medium transition-all ${
                selectedValue === num 
                  ? 'bg-blue-500 text-white border-blue-500' 
                  : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50'
              }`}
            >
              {num}
            </button>
          ))}
        </div>
      </div>
    );
  };

  const MultiSelectInput = ({ options, onSubmit }) => {
    const [selected, setSelected] = useState([]);
    
    const toggleOption = (option) => {
      setSelected(prev => 
        prev.includes(option) 
          ? prev.filter(item => item !== option)
          : [...prev, option]
      );
    };
    
    return (
      <div className="space-y-3">
        <div className="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto">
          {options.map(option => (
            <button
              key={option}
              onClick={() => toggleOption(option)}
              className={`p-3 text-left rounded-lg border transition-all ${
                selected.includes(option)
                  ? 'bg-blue-100 border-blue-500 text-blue-700'
                  : 'bg-white border-gray-200 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center">
                <div className={`w-4 h-4 rounded border mr-3 ${
                  selected.includes(option) ? 'bg-blue-500 border-blue-500' : 'border-gray-300'
                }`}>
                  {selected.includes(option) && (
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                  )}
                </div>
                {option}
              </div>
            </button>
          ))}
        </div>
        <button
          onClick={() => onSubmit(selected)}
          disabled={selected.length === 0}
          className="w-full py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          Continue ({selected.length} selected)
        </button>
      </div>
    );
  };

  const renderInput = () => {
    const currentStepData = surveyFlow[currentStep];
    
    if (inputType === 'complete') {
      return (
        <div className="text-center p-6 bg-green-50 rounded-lg border border-green-200">
          <Heart className="mx-auto mb-4 text-green-500" size={48} />
          <p className="text-green-700 font-medium">Survey Complete</p>
          <p className="text-sm text-green-600 mt-2">Thank you for sharing your story</p>
        </div>
      );
    }
    
    if (inputType === 'options') {
      return (
        <div className="space-y-2">
          {currentOptions.map(option => (
            <button
              key={option}
              onClick={() => handleSubmit(option)}
              className="w-full p-3 text-left bg-white border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-all"
            >
              {option}
            </button>
          ))}
        </div>
      );
    }
    
    if (inputType === 'scale') {
      return <ScaleInput onSubmit={handleSubmit} />;
    }
    
    if (inputType === 'multiselect') {
      return <MultiSelectInput options={currentOptions} onSubmit={handleSubmit} />;
    }
    
    if (inputType === 'textarea') {
      return (
        <div className="space-y-3">
          <textarea
            value={currentInput}
            onChange={(e) => setCurrentInput(e.target.value)}
            placeholder="Share your thoughts... (optional)"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            rows="4"
          />
          <div className="flex space-x-2">
            <button
              onClick={() => handleSubmit(currentInput)}
              className="flex-1 py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Submit
            </button>
            {currentStepData.optional && (
              <button
                onClick={() => handleSubmit('')}
                className="py-2 px-4 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
              >
                Skip
              </button>
            )}
          </div>
        </div>
      );
    }
    
    // Default text/number input
    return (
      <div className="flex space-x-2">
        <input
          type={inputType}
          value={currentInput}
          onChange={(e) => setCurrentInput(e.target.value)}
          placeholder={inputType === 'number' ? 'Enter a number...' : 'Type your response...'}
          className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          onKeyPress={(e) => {
            if (e.key === 'Enter' && currentInput.trim()) {
              handleSubmit(inputType === 'number' ? Number(currentInput) : currentInput);
            }
          }}
        />
        <button
          onClick={() => handleSubmit(inputType === 'number' ? Number(currentInput) : currentInput)}
          disabled={!currentInput.trim()}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
        Submit
        </button>
      </div>
    );
  };

  return (
    <div className="max-w-2xl mx-auto h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col">



{/* Navigation */}
      <nav className="bg-white/90 backdrop-blur-md shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-gray-800">Survival Serious</span>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {/* <a href="#home" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">Home</a> */}

              <Link to="/" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">
  Home
</Link>
        
              
<Link to="/dashboard" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">
  Explore
</Link>



              <a href="#contact" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">Contact</a>
              
<button
      onClick={handleShareStory}
      className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-full hover:shadow-lg transform hover:scale-105 transition-all duration-200 font-medium"
    >
      Share story
    </button>


              
            </div>

            {/* Mobile Menu Button */}
            <button 
              onClick={toggleMenu}
              className="md:hidden p-2 rounded-lg text-gray-700 hover:bg-gray-100"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden py-4 border-t border-gray-200">
              <div className="flex flex-col space-y-3">
                <a href="#home" className="text-gray-700 hover:text-blue-600 transition-colors font-medium px-2 py-1">Home</a>
                <a href="#about" className="text-gray-700 hover:text-blue-600 transition-colors font-medium px-2 py-1">About</a>
                <a href="#features" className="text-gray-700 hover:text-blue-600 transition-colors font-medium px-2 py-1">Explore</a>
                <a href="#contact" className="text-gray-700 hover:text-blue-600 transition-colors font-medium px-2 py-1">Contact</a>
                <button  onClick={() => setCurrentView('survey')} className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-full font-medium mx-2 mt-2">
                 Share story
                </button>
              </div>
            </div>
          )}
        </div>
      </nav>





















      {/* Header */}
      <div className="bg-white shadow-sm border-b p-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
            <Heart className="text-white" size={20} />
          </div>
          <div>
            <h1 className="font-semibold text-gray-800">Recovery Support Assistant</h1>
            <p className="text-sm text-gray-600 flex items-center">
              <Shield size={12} className="mr-1" />
              Confidential & Anonymous
            </p>
          </div>
        </div>
        
        {/* Progress bar */}
        <div className="mt-4 bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-500 h-2 rounded-full transition-all duration-500"
            style={{ width: `${(currentStep / (surveyFlow.length - 1)) * 100}%` }}
          />
        </div>
        <p className="text-xs text-gray-500 mt-1">
          {currentStep}/{surveyFlow.length - 1} questions completed
        </p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] p-3 rounded-lg ${
                message.type === 'user'
                  ? 'bg-blue-500 text-white rounded-br-sm'
                  : 'bg-white text-gray-800 rounded-bl-sm shadow-sm'
              }`}
            >
              <div className="flex items-start space-x-2">
                {message.type === 'bot' && (
                  <Bot size={16} className="text-blue-500 mt-1 flex-shrink-0" />
                )}
                <div className="flex-1">
                  <p className="whitespace-pre-wrap">{message.content}</p>
                  <p className={`text-xs mt-1 ${message.type === 'user' ? 'text-blue-100' : 'text-gray-500'}`}>
                    <Clock size={10} className="inline mr-1" />
                    {message.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </p>
                </div>
                {message.type === 'user' && (
                  <Users size={16} className="text-blue-100 mt-1 flex-shrink-0" />
                )}
              </div>
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-white text-gray-800 rounded-lg rounded-bl-sm shadow-sm p-3 max-w-[80%]">
              <div className="flex items-center space-x-2">
                <Bot size={16} className="text-blue-500" />
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      {!isTyping && inputType !== 'complete' && (
        <div className="bg-white border-t p-4">
          {renderInput()}
        </div>
      )}
    </div>
  );
};

export default ChatbotSurvey;