import React, { useState, useEffect } from 'react';
import { ArrowRight, Users, BarChart3, MessageCircle, Shield, Heart, TrendingUp, Menu, X } from 'lucide-react';
import ChatbotSurvey from "../components/Chatbotsurveys";
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../utils/api';

export default function SurvivalSeriousHomepage() {
  const [currentView, setCurrentView] = useState('survey');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
const [surveyList, setSurveyList] = useState([]);
  const [stats, setStats] = useState(null);



 useEffect(() => {
    const fetchData = async () => {
      try {
        const surveys = await api.surveys.getAll(1, 20);
        const statsData = await api.surveys.getStats();
        setSurveyList(surveys);
        setStats(statsData);
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      }
    };
    fetchData();
  }, []);








const totalSurveys = stats?.data?.overview?.totalSurveys ?? 0;

const navigate = useNavigate();

  const handleShareStory = () => {
    navigate('/survey');
  };

  const handleExplorestories = () => {
    navigate('/dashboard');
  };




  const goToSurvey = () => {
    setIsMenuOpen(false);
    setCurrentView('survey');
  };
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
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
              <a href="#home" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">Home</a>
        
              
<Link to="/dashboard" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">
  Explore
</Link>


<Link to="/contact" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">
  Contact
</Link>
              
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

      {/* Hero Section */}
      <section id="home" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <div className="inline-flex items-center space-x-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium mb-8">
              <Heart className="w-4 h-4" />
              <span>Supporting Recovery Through Shared Stories</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
              Share Your Journey,<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                Inspire Recovery
              </span>
            </h1>
            
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              Survival Serious connects people in recovery by collecting and sharing real experiences about overcoming substance abuse. Your story could be the inspiration someone needs to take their next step.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button onClick={handleShareStory} className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center space-x-2">
                <span>Share Your Story</span>
                <ArrowRight className="w-5 h-5" />
              </button>
              <button onClick={handleExplorestories} className="bg-white text-gray-700 px-8 py-4 rounded-full text-lg font-semibold border-2 border-gray-300 hover:border-blue-500 hover:text-blue-600 transition-all duration-300">
                Explore Stories
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              How We Help Your Recovery Journey
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our platform provides multiple ways to share, learn, and find support through the power of community experiences.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-8 rounded-2xl hover:shadow-lg transform hover:-translate-y-2 transition-all duration-300">
              <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mb-6">
                <MessageCircle className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Interactive Chat Surveys</h3>
              <p className="text-gray-600 leading-relaxed">
                Share your recovery story through our intelligent chatbot that guides you through meaningful questions about your journey and what helped you succeed.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-8 rounded-2xl hover:shadow-lg transform hover:-translate-y-2 transition-all duration-300">
              <div className="w-16 h-16 bg-purple-600 rounded-2xl flex items-center justify-center mb-6">
                <BarChart3 className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Visual Insights</h3>
              <p className="text-gray-600 leading-relaxed">
                Explore recovery patterns and success strategies through beautiful dashboards and graphs that reveal what works for different people.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-gradient-to-br from-green-50 to-green-100 p-8 rounded-2xl hover:shadow-lg transform hover:-translate-y-2 transition-all duration-300">
              <div className="w-16 h-16 bg-green-600 rounded-2xl flex items-center justify-center mb-6">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Community Support</h3>
              <p className="text-gray-600 leading-relaxed">
                Connect with others who understand your journey. Find hope, encouragement, and practical advice from people who've walked this path.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              Making a Real Impact
            </h2>
            <p className="text-xl text-blue-100">
              Together, we're building a community of hope and recovery
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-white mb-2">1,247</div>
              <div className="text-blue-200">Stories Shared</div>
            </div>
            <div className="text-center">
              <div  className="text-4xl font-bold text-white mb-2">{totalSurveys}</div>
              <div className="text-blue-200">People Helped</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-white mb-2">94%</div>
              <div className="text-blue-200">Positive Feedback</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-white mb-2">24/7</div>
              <div className="text-blue-200">Support Available</div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Your Story Matters
              </h2>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                Every recovery journey is unique, but sharing experiences creates powerful connections. Survival Serious provides a safe, anonymous platform where your story can inspire others and contribute to a growing database of recovery wisdom.
              </p>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                Through our interactive surveys and data visualization, we're creating the most comprehensive collection of real recovery experiences ever assembled.
              </p>
              <div className="flex items-center space-x-4">
                <TrendingUp className="w-12 h-12 text-blue-600" />
                <div>
                  <div className="text-2xl font-bold text-gray-900">Growing Impact</div>
                  <div className="text-gray-600">More stories mean more hope</div>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-blue-100 to-purple-100 p-8 rounded-3xl">
              <div className="bg-white p-6 rounded-2xl shadow-lg">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Quick Survey Preview</h3>
                <div className="space-y-3">
                  <div className="bg-gray-50 p-3 rounded-lg text-sm text-gray-600">
                    💬 "What was your turning point?"
                  </div>
                  
                  
                </div>
                <div className="mt-4 text-xs text-gray-500">
                  Anonymous • Secure • Confidential
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-900">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Make a Difference?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Your recovery story could be exactly what someone needs to hear today. Join our community and help others find their path to recovery.
          </p>
          <button  onClick={handleShareStory} className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-10 py-4 rounded-full text-xl font-semibold hover:shadow-xl transform hover:scale-105 transition-all duration-300">
            Start Sharing Now
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-800">Survival Serious</span>
            </div>
            <p className="text-gray-600 mb-4">
              Supporting recovery through shared experiences and community connection.
            </p>
            <div className="flex justify-center space-x-6 text-sm text-gray-500">
              <a href="#" className="hover:text-blue-600">Privacy Policy</a>
              <a href="#" className="hover:text-blue-600">Terms of Service</a>
              <a href="#" className="hover:text-blue-600">Support</a>
              <a href="#" className="hover:text-blue-600">Contact</a>
            </div>
            <div className="mt-6 text-sm text-gray-500">
              © 2025 Survival Serious. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}