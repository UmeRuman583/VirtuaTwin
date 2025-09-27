import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { Save, Upload, Activity, Heart, Brain, Zap, TrendingUp, TrendingDown, AlertTriangle, CheckCircle, User, Calendar, Target, Award, Coffee, Cigarette, Wine, Gamepad2, Moon, Droplets } from 'lucide-react';

const HealthDashboard = ({ profileData }) => {
  // Initialize with enhanced profile data
  const [profile, setProfile] = useState({
    name: '',
    age: 25,
    gender: 'prefer-not-to-say',
    weight: 70,
    height: 170,
    exerciseHours: 3,
    exerciseType: 'mixed',
    sleepHours: 7,
    sleepQuality: 7,
    stressLevel: 3,
    dietQuality: 7,
    waterIntake: 6,
    screenTime: 4,
    smokingStatus: false,
    smokingFrequency: 0,
    drinkingStatus: false,
    drinkingFrequency: 1,
    junkFoodHabit: false,
    junkFoodFrequency: 2,
    sugarCravings: false,
    caffeineIntake: 1,
    lateNightSnacking: false,
    fastFoodFrequency: 1,
    sodaConsumption: 0,
    gamingHours: 2,
    socialMediaHours: 2,
    medicalConditions: [],
    medications: '',
    allergies: '',
    mentalHealthSupport: false,
    workStressLevel: 5,
    relationshipStress: 3,
    financialStress: 3,
    bmi: 24.2,
    healthRiskScore: 35,
    ...profileData
  });

  const [currentView, setCurrentView] = useState('overview');
  const [timeRange, setTimeRange] = useState('6months');

  // Enhanced health score calculation
  const calculateHealthScore = (profileData) => {
    let score = 50;
    
    // Exercise factor (0-20 points)
    score += Math.min(profileData.exerciseHours * 2.5, 20);
    
    // Sleep factor (0-15 points)
    const sleepOptimal = Math.abs(profileData.sleepHours - 8);
    score += Math.max(15 - sleepOptimal * 2, 0);
    score += profileData.sleepQuality;
    
    // Diet quality (0-15 points)
    score += profileData.dietQuality * 1.5;
    
    // Water intake (0-8 points)
    score += Math.min(profileData.waterIntake, 8);
    
    // Stress penalties
    score -= profileData.stressLevel * 1.5;
    score -= profileData.workStressLevel * 0.8;
    score -= profileData.relationshipStress * 0.5;
    score -= profileData.financialStress * 0.5;
    
    // Bad habits penalties
    if (profileData.smokingStatus) score -= 25;
    if (profileData.drinkingStatus && profileData.drinkingFrequency > 3) score -= 15;
    if (profileData.junkFoodHabit) score -= profileData.junkFoodFrequency;
    if (profileData.screenTime > 8) score -= (profileData.screenTime - 8) * 2;
    score -= profileData.fastFoodFrequency * 1.5;
    score -= profileData.sodaConsumption * 2;
    if (profileData.caffeineIntake > 4) score -= 5;
    
    // BMI factor
    const bmi = profileData.bmi || (profileData.weight / ((profileData.height / 100) ** 2));
    if (bmi < 18.5 || bmi > 30) score -= 15;
    else if (bmi > 25) score -= 8;
    
    // Medical conditions penalty
    score -= profileData.medicalConditions.length * 5;
    
    // Mental health support bonus
    if (profileData.mentalHealthSupport && profileData.stressLevel > 5) score += 5;
    
    return Math.max(Math.min(Math.round(score), 100), 0);
  };

  const [healthScore, setHealthScore] = useState(calculateHealthScore(profile));

  // Enhanced risk factors calculation
  const calculateRiskFactors = (profileData) => {
    const bmi = profileData.bmi || (profileData.weight / ((profileData.height / 100) ** 2));
    
    return {
      cardiovascular: Math.min(
        (profileData.smokingStatus ? 30 : 0) + 
        (profileData.stressLevel * 2.5) + 
        (bmi > 25 ? 15 : 0) + 
        (profileData.exerciseHours < 2 ? 15 : 0) +
        (profileData.drinkingStatus && profileData.drinkingFrequency > 4 ? 10 : 0), 100
      ),
      diabetes: Math.min(
        (bmi > 25 ? 25 : 0) + 
        (profileData.dietQuality < 5 ? 20 : 0) + 
        (profileData.exerciseHours < 2 ? 15 : 0) +
        (profileData.sugarCravings ? 10 : 0) +
        (profileData.sodaConsumption * 3), 100
      ),
      mentalHealth: Math.min(
        profileData.stressLevel * 6 + 
        profileData.workStressLevel * 3 +
        profileData.relationshipStress * 2 +
        profileData.financialStress * 2 +
        (profileData.sleepHours < 6 ? 15 : 0) + 
        (profileData.screenTime > 8 ? 10 : 0) +
        (!profileData.mentalHealthSupport && profileData.stressLevel > 6 ? 15 : 0), 100
      ),
      obesity: Math.min(
        (bmi > 25 ? (bmi - 25) * 8 : 0) + 
        (profileData.exerciseHours < 2 ? 20 : 0) + 
        (profileData.dietQuality < 5 ? 15 : 0) +
        (profileData.fastFoodFrequency * 2) +
        (profileData.junkFoodHabit ? 10 : 0), 100
      ),
      addiction: Math.min(
        (profileData.smokingStatus ? profileData.smokingFrequency * 2 : 0) +
        (profileData.drinkingStatus && profileData.drinkingFrequency > 5 ? 20 : 0) +
        (profileData.screenTime > 10 ? 15 : 0) +
        (profileData.gamingHours > 6 ? 15 : 0) +
        (profileData.socialMediaHours > 4 ? 10 : 0), 100
      )
    };
  };

  const [riskFactors, setRiskFactors] = useState(calculateRiskFactors(profile));

  // Generate timeline data
  const [timelineData, setTimelineData] = useState(() => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    return months.map((month, index) => ({
      month,
      healthScore: Math.max(40, healthScore - (6 - index) * 2 + Math.random() * 5),
      weight: profile.weight + (Math.random() - 0.5) * 2,
      sleepHours: profile.sleepHours + (Math.random() - 0.5) * 1,
      exerciseHours: Math.max(0, profile.exerciseHours + (Math.random() - 0.5) * 2),
      stressLevel: Math.min(10, Math.max(1, profile.stressLevel + (Math.random() - 0.5) * 2))
    }));
  });

  // Radar chart data for lifestyle factors
  const radarData = [
    { factor: 'Exercise', value: Math.min(100, profile.exerciseHours * 5), fullMark: 100 },
    { factor: 'Sleep Quality', value: profile.sleepQuality * 10, fullMark: 100 },
    { factor: 'Diet Quality', value: profile.dietQuality * 10, fullMark: 100 },
    { factor: 'Hydration', value: Math.min(100, profile.waterIntake * 8.33), fullMark: 100 },
    { factor: 'Stress Management', value: (11 - profile.stressLevel) * 10, fullMark: 100 },
    { factor: 'Mental Health', value: profile.mentalHealthSupport ? 80 : (11 - profile.stressLevel) * 8, fullMark: 100 }
  ];

  // Habit analysis data
  const habitData = [
    { name: 'Screen Time', hours: profile.screenTime, recommended: 6, category: 'digital' },
    { name: 'Gaming', hours: profile.gamingHours, recommended: 2, category: 'digital' },
    { name: 'Social Media', hours: profile.socialMediaHours, recommended: 2, category: 'digital' },
    { name: 'Exercise', hours: profile.exerciseHours / 7, recommended: 1, category: 'health' },
    { name: 'Sleep', hours: profile.sleepHours, recommended: 8, category: 'health' }
  ];

  // Bad habits pie chart data
  const badHabitsData = [
    { name: 'Smoking', value: profile.smokingStatus ? profile.smokingFrequency : 0, color: '#EF4444' },
    { name: 'Drinking', value: profile.drinkingStatus ? profile.drinkingFrequency * 2 : 0, color: '#F59E0B' },
    { name: 'Junk Food', value: profile.junkFoodHabit ? profile.junkFoodFrequency : 0, color: '#F97316' },
    { name: 'Fast Food', value: profile.fastFoodFrequency, color: '#DC2626' },
    { name: 'Soda', value: profile.sodaConsumption * 2, color: '#EA580C' }
  ].filter(item => item.value > 0);

  const generateAdvice = () => {
    const suggestions = [];
    
    if (profile.exerciseHours < 3) {
      suggestions.push({
        type: 'exercise',
        priority: 'high',
        text: 'Increase physical activity to at least 150 minutes per week',
        impact: 'Could improve your health score by 10-15 points'
      });
    }
    
    if (profile.sleepHours < 7) {
      suggestions.push({
        type: 'sleep',
        priority: 'high',
        text: 'Aim for 7-9 hours of quality sleep per night',
        impact: 'Better sleep could reduce stress and improve focus'
      });
    }
    
    if (profile.stressLevel > 6) {
      suggestions.push({
        type: 'stress',
        priority: 'high',
        text: 'Consider stress management techniques or professional support',
        impact: 'Reducing stress could significantly improve overall wellbeing'
      });
    }
    
    if (profile.smokingStatus) {
      suggestions.push({
        type: 'smoking',
        priority: 'critical',
        text: 'Quitting smoking would have the biggest positive impact on your health',
        impact: 'Could improve health score by 25+ points and reduce disease risk'
      });
    }
    
    if (profile.waterIntake < 6) {
      suggestions.push({
        type: 'hydration',
        priority: 'medium',
        text: 'Increase water intake to 8-10 glasses per day',
        impact: 'Better hydration supports all bodily functions'
      });
    }
    
    if (profile.screenTime > 8) {
      suggestions.push({
        type: 'digital',
        priority: 'medium',
        text: 'Reduce screen time, especially before bedtime',
        impact: 'Less screen time may improve sleep quality and reduce eye strain'
      });
    }
    
    return suggestions.slice(0, 4); // Return top 4 suggestions
  };

  const [advice] = useState(generateAdvice());

  // Update calculations when profile changes
  useEffect(() => {
    const newScore = calculateHealthScore(profile);
    const newRisks = calculateRiskFactors(profile);
    
    setHealthScore(newScore);
    setRiskFactors(newRisks);
  }, [profile]);

  // Avatar based on health score
  const getAvatarEmoji = () => {
    if (healthScore >= 80) return '😊';
    if (healthScore >= 60) return '😐';
    if (healthScore >= 40) return '😕';
    return '😟';
  };

  const getAvatarColor = () => {
    if (healthScore >= 80) return 'text-green-500';
    if (healthScore >= 60) return 'text-yellow-500';
    if (healthScore >= 40) return 'text-orange-500';
    return 'text-red-500';
  };

  // Health Score Gauge Component
  const HealthGauge = ({ score, size = 'large' }) => {
    const radius = size === 'large' ? 80 : 60;
    const strokeWidth = size === 'large' ? 12 : 8;
    const normalizedRadius = radius - strokeWidth * 2;
    const circumference = normalizedRadius * 2 * Math.PI;
    const strokeDasharray = `${circumference} ${circumference}`;
    const strokeDashoffset = circumference - (score / 100) * circumference;
    
    const getScoreColor = (score) => {
      if (score >= 80) return '#10B981';
      if (score >= 60) return '#F59E0B';
      if (score >= 40) return '#F97316';
      return '#EF4444';
    };

    return (
      <div className="flex flex-col items-center">
        <div className="relative">
          <svg height={radius * 2} width={radius * 2} className="transform -rotate-90">
            <circle
              stroke="#E5E7EB"
              fill="transparent"
              strokeWidth={strokeWidth}
              r={normalizedRadius}
              cx={radius}
              cy={radius}
            />
            <circle
              stroke={getScoreColor(score)}
              fill="transparent"
              strokeWidth={strokeWidth}
              strokeDasharray={strokeDasharray}
              style={{ strokeDashoffset }}
              r={normalizedRadius}
              cx={radius}
              cy={radius}
              className="transition-all duration-1000 ease-out"
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className={`${size === 'large' ? 'text-3xl' : 'text-xl'} font-bold`} style={{ color: getScoreColor(score) }}>
              {score}
            </span>
            {size === 'large' && <span className="text-xs text-gray-500">Health Score</span>}
          </div>
        </div>
      </div>
    );
  };

  // Risk Factor Component
  const RiskBar = ({ label, value, icon: Icon, description }) => {
    const getBarColor = (value) => {
      if (value >= 70) return 'bg-red-500';
      if (value >= 40) return 'bg-yellow-500';
      if (value >= 20) return 'bg-orange-500';
      return 'bg-green-500';
    };

    const getRiskLevel = (value) => {
      if (value >= 70) return 'High Risk';
      if (value >= 40) return 'Moderate Risk';
      if (value >= 20) return 'Low-Moderate Risk';
      return 'Low Risk';
    };

    return (
        
      <div className="mb-4 p-3 bg-gray-50 rounded-lg">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center">
            <Icon className="w-5 h-5 mr-2 text-gray-600" />
            <span className="text-sm font-medium text-gray-700">{label}</span>
          </div>
          <div className="text-right">
            <span className="text-sm font-bold text-gray-800">{value}%</span>
            <div className="text-xs text-gray-500">{getRiskLevel(value)}</div>
          </div>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
          <div
            className={`h-3 rounded-full transition-all duration-500 ${getBarColor(value)}`}
            style={{ width: `${value}%` }}
          ></div>
        </div>
        {description && <p className="text-xs text-gray-600">{description}</p>}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F0E3E3] via-white to-[#748B9C] ">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Activity className="h-8 w-8 text-blue-600 mr-3" />
              <h1 className="text-xl font-semibold text-gray-900">Health Dashboard</h1>
              {profile.name && <span className="ml-4 text-gray-600">- {profile.name}</span>}
            </div>
            <div className="flex items-center space-x-4">
              {['overview', 'analysis', 'trends', 'recommendations'].map((view) => (
                <button
                  key={view}
                  onClick={() => setCurrentView(view)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors capitalize ${
                    currentView === view
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {view}
                </button>
              ))}
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 ">
        {currentView === 'overview' && (
          <div className="space-y-6 ">
            {/* Header Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white rounded-lg shadow-sm p-6 text-center">
                <div className={`text-4xl mb-2 ${getAvatarColor()}`}>
                  {getAvatarEmoji()}
                </div>
                <HealthGauge score={healthScore} size="small" />
              </div>
              
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">BMI Status</p>
                    <p className="text-2xl font-bold text-gray-900">{profile.bmi}</p>
                    <p className="text-xs text-gray-500">
                      {profile.bmi < 18.5 ? 'Underweight' : 
                       profile.bmi < 25 ? 'Normal' : 
                       profile.bmi < 30 ? 'Overweight' : 'Obese'}
                    </p>
                  </div>
                  <Heart className="h-8 w-8 text-red-400" />
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Risk Level</p>
                    <p className="text-2xl font-bold text-gray-900">{profile.healthRiskScore}%</p>
                    <p className="text-xs text-gray-500">
                      {profile.healthRiskScore > 50 ? 'High' : 
                       profile.healthRiskScore > 30 ? 'Moderate' : 'Low'}
                    </p>
                  </div>
                  <AlertTriangle className={`h-8 w-8 ${profile.healthRiskScore > 50 ? 'text-red-400' : 'text-yellow-400'}`} />
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Active Goals</p>
                    <p className="text-2xl font-bold text-gray-900">{advice.length}</p>
                    <p className="text-xs text-gray-500">recommendations</p>
                  </div>
                  <Target className="h-8 w-8 text-blue-400" />
                </div>
              </div>
            </div>

            {/* Main Dashboard Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Risk Factors */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <Brain className="w-5 h-5 mr-2 text-blue-600" />
                  Health Risk Assessment
                </h3>
                <RiskBar 
                  label="Cardiovascular Risk" 
                  value={riskFactors.cardiovascular} 
                  icon={Heart}
                  description="Based on smoking, stress, BMI, and exercise habits"
                />
                <RiskBar 
                  label="Diabetes Risk" 
                  value={riskFactors.diabetes} 
                  icon={Activity}
                  description="Influenced by diet, weight, and physical activity"
                />
                <RiskBar 
                  label="Mental Health Risk" 
                  value={riskFactors.mentalHealth} 
                  icon={Brain}
                  description="Stress levels and sleep quality indicators"
                />
                <RiskBar 
                  label="Addiction Risk" 
                  value={riskFactors.addiction} 
                  icon={Zap}
                  description="Substance use and digital dependency patterns"
                />
              </div>

              {/* Lifestyle Radar */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Lifestyle Balance</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <RadarChart data={radarData}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="factor" tick={{ fontSize: 10 }} />
                    <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fontSize: 8 }} />
                    <Radar
                      name="Current"
                      dataKey="value"
                      stroke="#3B82F6"
                      fill="#3B82F6"
                      fillOpacity={0.3}
                      strokeWidth={2}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
              <div className="bg-white rounded-lg shadow-sm p-4 text-center">
                <Activity className="w-6 h-6 mx-auto mb-2 text-green-600" />
                <div className="text-lg font-bold text-gray-900">{profile.exerciseHours}</div>
                <p className="text-xs text-gray-600">hrs/week exercise</p>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm p-4 text-center">
                <Moon className="w-6 h-6 mx-auto mb-2 text-indigo-600" />
                <div className="text-lg font-bold text-gray-900">{profile.sleepHours}</div>
                <p className="text-xs text-gray-600">hrs sleep/night</p>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm p-4 text-center">
                <Droplets className="w-6 h-6 mx-auto mb-2 text-blue-600" />
                <div className="text-lg font-bold text-gray-900">{profile.waterIntake}</div>
                <p className="text-xs text-gray-600">glasses/day</p>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-4 text-center">
                <Coffee className="w-6 h-6 mx-auto mb-2 text-amber-600" />
                <div className="text-lg font-bold text-gray-900">{profile.caffeineIntake}</div>
                <p className="text-xs text-gray-600">cups/day</p>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-4 text-center">
                <Gamepad2 className="w-6 h-6 mx-auto mb-2 text-purple-600" />
                <div className="text-lg font-bold text-gray-900">{profile.screenTime}</div>
                <p className="text-xs text-gray-600">hrs screen time</p>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-4 text-center">
                <Brain className="w-6 h-6 mx-auto mb-2 text-red-600" />
                <div className="text-lg font-bold text-gray-900">{profile.stressLevel}/10</div>
                <p className="text-xs text-gray-600">stress level</p>
              </div>
            </div>
          </div>
        )}

        {currentView === 'analysis' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Daily Habits Analysis */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Daily Habits Analysis</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={habitData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" angle={-45} textAnchor="end" height={60} tick={{ fontSize: 10 }} />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="hours" fill="#3B82F6" name="Current" />
                    <Bar dataKey="recommended" fill="#10B981" name="Recommended" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Bad Habits Distribution */}
              {badHabitsData.length > 0 && (
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Risk Habits Impact</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={badHabitsData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {badHabitsData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>

            {/* Detailed Health Metrics */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Comprehensive Health Analysis</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-3">
                  <h4 className="font-medium text-gray-700">Physical Health</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>BMI Classification:</span>
                      <span className={profile.bmi > 25 ? 'text-orange-600' : 'text-green-600'}>
                        {profile.bmi < 18.5 ? 'Underweight' : 
                         profile.bmi < 25 ? 'Normal' : 
                         profile.bmi < 30 ? 'Overweight' : 'Obese'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Exercise Level:</span>
                      <span className={profile.exerciseHours >= 5 ? 'text-green-600' : profile.exerciseHours >= 3 ? 'text-yellow-600' : 'text-red-600'}>
                        {profile.exerciseHours >= 5 ? 'Excellent' : profile.exerciseHours >= 3 ? 'Good' : 'Poor'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Sleep Quality:</span>
                      <span className={profile.sleepQuality >= 7 ? 'text-green-600' : profile.sleepQuality >= 5 ? 'text-yellow-600' : 'text-red-600'}>
                        {profile.sleepQuality >= 7 ? 'Good' : profile.sleepQuality >= 5 ? 'Fair' : 'Poor'}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <h4 className="font-medium text-gray-700">Mental Health</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Overall Stress:</span>
                      <span className={profile.stressLevel <= 3 ? 'text-green-600' : profile.stressLevel <= 6 ? 'text-yellow-600' : 'text-red-600'}>
                        {profile.stressLevel <= 3 ? 'Low' : profile.stressLevel <= 6 ? 'Moderate' : 'High'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Work Stress:</span>
                      <span className={profile.workStressLevel <= 4 ? 'text-green-600' : profile.workStressLevel <= 7 ? 'text-yellow-600' : 'text-red-600'}>
                        {profile.workStressLevel}/10
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Support System:</span>
                      <span className={profile.mentalHealthSupport ? 'text-green-600' : 'text-orange-600'}>
                        {profile.mentalHealthSupport ? 'Active' : 'None Reported'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-medium text-gray-700">Lifestyle Factors</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Digital Wellness:</span>
                      <span className={profile.screenTime <= 6 ? 'text-green-600' : profile.screenTime <= 10 ? 'text-yellow-600' : 'text-red-600'}>
                        {profile.screenTime <= 6 ? 'Balanced' : profile.screenTime <= 10 ? 'Moderate' : 'Excessive'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Substance Use:</span>
                      <span className={!profile.smokingStatus && (!profile.drinkingStatus || profile.drinkingFrequency <= 2) ? 'text-green-600' : 'text-red-600'}>
                        {!profile.smokingStatus && (!profile.drinkingStatus || profile.drinkingFrequency <= 2) ? 'Low Risk' : 'High Risk'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Diet Quality:</span>
                      <span className={profile.dietQuality >= 7 ? 'text-green-600' : profile.dietQuality >= 5 ? 'text-yellow-600' : 'text-red-600'}>
                        {profile.dietQuality >= 7 ? 'Good' : profile.dietQuality >= 5 ? 'Fair' : 'Poor'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Medical Information */}
            {(profile.medicalConditions.length > 0 || profile.medications || profile.allergies) && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <Heart className="w-5 h-5 mr-2 text-red-600" />
                  Medical Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {profile.medicalConditions.length > 0 && (
                    <div>
                      <h4 className="font-medium text-gray-700 mb-2">Medical Conditions</h4>
                      <div className="space-y-1">
                        {profile.medicalConditions.map((condition) => (
                          <span key={condition} className="inline-block px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full mr-2 mb-1">
                            {condition}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {profile.medications && (
                    <div>
                      <h4 className="font-medium text-gray-700 mb-2">Current Medications</h4>
                      <p className="text-sm text-gray-600">{profile.medications}</p>
                    </div>
                  )}
                  
                  {profile.allergies && (
                    <div>
                      <h4 className="font-medium text-gray-700 mb-2">Allergies</h4>
                      <p className="text-sm text-gray-600">{profile.allergies}</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {currentView === 'trends' && (
          <div className="space-y-6">
            {/* Time Range Selector */}
            <div className="bg-white rounded-lg shadow-sm p-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-800">Health Trends</h3>
                <select
                  value={timeRange}
                  onChange={(e) => setTimeRange(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="3months">Last 3 Months</option>
                  <option value="6months">Last 6 Months</option>
                  <option value="1year">Last Year</option>
                </select>
              </div>
            </div>

            {/* Trend Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2 text-green-600" />
                  Health Score Progress
                </h4>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={timelineData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis domain={[0, 100]} />
                    <Tooltip />
                    <Line 
                      type="monotone" 
                      dataKey="healthScore" 
                      stroke="#3B82F6" 
                      strokeWidth={3}
                      name="Health Score"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6">
                <h4 className="text-lg font-semibold text-gray-800 mb-4">Multiple Metrics</h4>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={timelineData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="weight" stroke="#10B981" name="Weight (kg)" />
                    <Line type="monotone" dataKey="sleepHours" stroke="#8B5CF6" name="Sleep Hours" />
                    <Line type="monotone" dataKey="exerciseHours" stroke="#F59E0B" name="Exercise Hours" />
                    <Line type="monotone" dataKey="stressLevel" stroke="#EF4444" name="Stress Level" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Progress Indicators */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h4 className="text-lg font-semibold text-gray-800 mb-4">Progress Summary</h4>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <TrendingUp className="w-8 h-8 mx-auto mb-2 text-green-600" />
                  <div className="text-2xl font-bold text-green-600">+{Math.floor(Math.random() * 10) + 3}</div>
                  <div className="text-sm text-gray-600">Health Score Improvement</div>
                </div>
                
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <Activity className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                  <div className="text-2xl font-bold text-blue-600">{profile.exerciseHours}h</div>
                  <div className="text-sm text-gray-600">Weekly Exercise</div>
                </div>
                
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <Moon className="w-8 h-8 mx-auto mb-2 text-purple-600" />
                  <div className="text-2xl font-bold text-purple-600">{profile.sleepHours}h</div>
                  <div className="text-sm text-gray-600">Average Sleep</div>
                </div>
                
                <div className="text-center p-4 bg-red-50 rounded-lg">
                  <Brain className="w-8 h-8 mx-auto mb-2 text-red-600" />
                  <div className="text-2xl font-bold text-red-600">{profile.stressLevel}/10</div>
                  <div className="text-sm text-gray-600">Stress Level</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {currentView === 'recommendations' && (
          <div className="space-y-6">
            {/* Priority Recommendations */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <Target className="w-5 h-5 mr-2 text-blue-600" />
                Personalized Health Recommendations
              </h3>
              
              <div className="space-y-4">
                {advice.map((item, index) => (
                  <div 
                    key={index} 
                    className={`p-4 rounded-lg border-l-4 ${
                      item.priority === 'critical' ? 'border-red-500 bg-red-50' :
                      item.priority === 'high' ? 'border-orange-500 bg-orange-50' :
                      item.priority === 'medium' ? 'border-yellow-500 bg-yellow-50' :
                      'border-green-500 bg-green-50'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center mb-2">
                          <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full mr-2 ${
                            item.priority === 'critical' ? 'bg-red-100 text-red-800' :
                            item.priority === 'high' ? 'bg-orange-100 text-orange-800' :
                            item.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-green-100 text-green-800'
                          }`}>
                            {item.priority.toUpperCase()}
                          </span>
                          <span className="text-sm font-medium text-gray-700 capitalize">{item.type}</span>
                        </div>
                        <p className="text-gray-800 mb-2">{item.text}</p>
                        <p className="text-sm text-gray-600">{item.impact}</p>
                      </div>
                      <div className="ml-4">
                        {item.priority === 'critical' ? <AlertTriangle className="w-6 h-6 text-red-500" /> :
                         item.priority === 'high' ? <TrendingUp className="w-6 h-6 text-orange-500" /> :
                         <CheckCircle className="w-6 h-6 text-green-500" />}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Goals and Targets */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h4 className="text-lg font-semibold text-gray-800 mb-4">Health Goals</h4>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm font-medium">Exercise Weekly Target</span>
                    <span className="text-sm text-blue-600">5+ hours</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm font-medium">Sleep Quality Goal</span>
                    <span className="text-sm text-blue-600">7-9 hours</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm font-medium">Stress Management</span>
                    <span className="text-sm text-blue-600">≤ 4/10</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm font-medium">Water Intake Target</span>
                    <span className="text-sm text-blue-600">8+ glasses</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6">
                <h4 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h4>
                <div className="space-y-3">
                  <button className="w-full text-left p-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors">
                    <div className="flex items-center">
                      <Activity className="w-5 h-5 mr-3 text-blue-600" />
                      <div>
                        <div className="font-medium text-gray-800">Schedule Exercise</div>
                        <div className="text-sm text-gray-600">Plan your weekly workouts</div>
                      </div>
                    </div>
                  </button>
                  
                  <button className="w-full text-left p-3 bg-green-50 hover:bg-green-100 rounded-lg transition-colors">
                    <div className="flex items-center">
                      <Heart className="w-5 h-5 mr-3 text-green-600" />
                      <div>
                        <div className="font-medium text-gray-800">Book Health Checkup</div>
                        <div className="text-sm text-gray-600">Schedule routine screening</div>
                      </div>
                    </div>
                  </button>
                  
                  <button className="w-full text-left p-3 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors">
                    <div className="flex items-center">
                      <Brain className="w-5 h-5 mr-3 text-purple-600" />
                      <div>
                        <div className="font-medium text-gray-800">Stress Management</div>
                        <div className="text-sm text-gray-600">Explore relaxation techniques</div>
                      </div>
                    </div>
                  </button>
                  
                  <button className="w-full text-left p-3 bg-yellow-50 hover:bg-yellow-100 rounded-lg transition-colors">
                    <div className="flex items-center">
                      <Award className="w-5 h-5 mr-3 text-yellow-600" />
                      <div>
                        <div className="font-medium text-gray-800">Set Health Goals</div>
                        <div className="text-sm text-gray-600">Create achievable targets</div>
                      </div>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HealthDashboard;