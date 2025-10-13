import React, { useEffect, useState } from 'react';
import { ArrowRight, Users, BarChart3, MessageCircle, Shield, Heart, TrendingUp, Menu, X, ThumbsUp } from 'lucide-react';
import { Link,useNavigate } from 'react-router-dom';
import { api } from '../utils/api'; // adjust path if needed

const Dashboard = () => {
  const [surveyList, setSurveyList] = useState([]);
  const [stats, setStats] = useState(null);
  const [likedStories, setLikedStories] = useState([]);

const [currentView, setCurrentView] = useState('survey');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const goToSurvey = () => {
    setIsMenuOpen(false);
    setCurrentView('survey');
  };
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

const navigate = useNavigate();

  const handleShareStory = () => {
    navigate('/survey');
  };




  // Toggle like/unlike state
  const toggleLike = (id) => {
    setLikedStories((prev) =>
      prev.includes(id) ? prev.filter((sid) => sid !== id) : [...prev, id]
    );
  };

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
  const successRate = stats?.data?.overview?.successRate ?? 0;
  const avgTime = stats?.data?.overview?.averageRecoveryTime ?? 0;

  const StatCard = ({ title, value, icon: Icon, color = 'blue' }) => (
    <div className={`bg-white rounded-lg shadow-md p-6 border-l-4 border-${color}-500`}>
      <div className="flex items-center">
        <div className={`p-3 rounded-full bg-${color}-100 mr-4`}>
          <Icon className={`h-8 w-8 text-${color}-600`} />
        </div>
        <div>
          <p className="text-gray-500 text-sm">{title}</p>
          <p className="text-2xl font-bold text-gray-800">{value}</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto p-6 bg-gray-50 min-h-screen">



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
              <button  onClick={handleShareStory} className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-full hover:shadow-lg transform hover:scale-105 transition-all duration-200 font-medium">
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


















      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Recovery Dashboard</h1>
        <p className="text-gray-600">Insights from Survivor Serious surveys</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard title="Total Surveys" value={totalSurveys} icon={Users} color="blue" />
        <StatCard title="Success Rate" value={`${successRate}%`} icon={TrendingUp} color="green" />
        <StatCard title="Avg Recovery Time" value={`${avgTime} mo`} icon={BarChart3} color="purple" />
        <StatCard title="Hope Index" value="94%" icon={Heart} color="red" />
      </div>

      {/* Age & Drug Distribution */}
      {stats?.data?.demographics && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Age Distribution */}
          {stats.data.demographics.ageDistribution?.length > 0 && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-4">Age Distribution</h3>
              <div className="space-y-3">
                {stats.data.demographics.ageDistribution.map((age) => {
                  const percent = totalSurveys
                    ? (age.count / totalSurveys) * 100
                    : 0;
                  return (
                    <div
                      key={age._id}
                      className="flex items-center justify-between"
                    >
                      <span className="text-sm text-gray-600">{age._id}</span>
                      <div className="flex items-center">
                        <div className="w-24 bg-gray-200 rounded-full h-2 mr-3">
                          <div
                            className="bg-blue-600 h-2 rounded-full"
                            style={{ width: `${percent}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium">{age.count}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Drug Distribution */}
          {stats.data.demographics.drugDistribution?.length > 0 && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-4">Primary Substances</h3>
              <div className="space-y-3">
                {stats.data.demographics.drugDistribution.slice(0, 6).map((drug) => {
                  const percent = totalSurveys
                    ? (drug.count / totalSurveys) * 100
                    : 0;
                  return (
                    <div
                      key={drug._id}
                      className="flex items-center justify-between"
                    >
                      <span className="text-sm text-gray-600">{drug._id}</span>
                      <div className="flex items-center">
                        <div className="w-24 bg-gray-200 rounded-full h-2 mr-3">
                          <div
                            className="bg-red-500 h-2 rounded-full"
                            style={{ width: `${percent}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium">{drug.count}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Top Success Factors */}
      {stats?.data?.insights?.topSuccessFactors?.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h3 className="text-lg font-semibold mb-4">Top Success Factors</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {stats.data.insights.topSuccessFactors.map((factor) => (
              <div
                key={factor._id}
                className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-4 border border-green-200"
              >
                <h4 className="font-medium text-gray-800">{factor._id}</h4>
                <p className="text-2xl font-bold text-green-600">{factor.count}</p>
                <p className="text-xs text-gray-500">mentions</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Recovery Stories */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4">Recent Recovery Stories</h3>
        {surveyList.length === 0 ? (
          <p className="text-gray-500">No recovery stories available yet.</p>
        ) : (
          <div className="space-y-4">
            {surveyList.map((survey) => {
              const isLiked = likedStories.includes(survey._id);
              return (
                <div
                  key={survey._id}
                  className="border-l-4 border-blue-500 pl-4 py-2 flex items-start justify-between"
                >
                  <div className="pr-4">
                    <p className="text-sm text-gray-600 mb-1">
                      {survey.demographics?.age} years old,{' '}
                      {survey.recoveryJourney?.timeClean} months clean
                    </p>
                    <p className="text-gray-800 italic mb-2 whitespace-pre-wrap break-words">
                      "{survey.advice?.adviceForOthers}"
                    </p>
                  </div>
                  <ThumbsUp
                    className={`flex-shrink-0 h-6 w-6 rounded-full cursor-pointer transition-colors ${
                      isLiked
                        ? 'bg-blue-500 '
                        : 'text-gray-400 hover:text-gray-600'
                    }`}
                    onClick={() => toggleLike(survey._id)}
                  />
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
