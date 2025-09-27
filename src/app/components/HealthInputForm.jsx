import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { Save, User, Activity, Heart, Brain, Coffee, Cigarette, Wine, IceCream, Gamepad2, ArrowRight, CheckCircle, AlertTriangle, Info, Plus, Minus, Eye, EyeOff, Zap, TrendingUp, TrendingDown, Calendar, Target, Award, Moon, Droplets, Upload, ArrowLeft } from 'lucide-react';

// Health Input Form Component
const HealthInputForm = ({ onSaveProfile, onNavigateToDashboard }) => {
  const [profile, setProfile] = useState({
    name: '',
    age: 20,
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
    financialStress: 3
  });

  const [showSuccess, setShowSuccess] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [formValidation, setFormValidation] = useState({});

  const calculateBMI = () => {
    const heightInM = profile.height / 100;
    const bmi = profile.weight / (heightInM * heightInM);
    return bmi.toFixed(1);
  };

  const getBMICategory = (bmi) => {
    if (bmi < 18.5) return { category: 'Underweight', color: 'text-blue-600' };
    if (bmi < 25) return { category: 'Normal', color: 'text-green-600' };
    if (bmi < 30) return { category: 'Overweight', color: 'text-yellow-600' };
    return { category: 'Obese', color: 'text-red-600' };
  };

  const validateForm = () => {
    const errors = {};
    if (!profile.name.trim()) errors.name = 'Name is required';
    if (profile.age < 18 || profile.age > 100) errors.age = 'Age must be between 18-100';
    if (profile.sleepHours < 4) errors.sleep = 'Sleep hours seem too low for health';
    if (profile.screenTime > 12) errors.screen = 'Screen time over 12 hours may indicate dependency';
    
    setFormValidation(errors);
    return Object.keys(errors).length === 0;
  };

  const calculateHealthRiskScore = () => {
    let riskScore = 0;
    
    if (profile.exerciseHours >= 5) riskScore -= 10;
    else if (profile.exerciseHours >= 3) riskScore -= 5;
    
    if (profile.sleepHours >= 7 && profile.sleepHours <= 9) riskScore -= 10;
    if (profile.dietQuality >= 8) riskScore -= 10;
    if (profile.waterIntake >= 8) riskScore -= 5;
    if (profile.stressLevel <= 3) riskScore -= 5;
    
    if (profile.smokingStatus) riskScore += profile.smokingFrequency * 2;
    if (profile.drinkingStatus && profile.drinkingFrequency > 3) riskScore += 15;
    if (profile.junkFoodHabit) riskScore += profile.junkFoodFrequency * 2;
    if (profile.screenTime > 8) riskScore += 10;
    if (profile.stressLevel > 7) riskScore += 15;
    if (profile.caffeineIntake > 4) riskScore += 10;
    if (profile.fastFoodFrequency > 3) riskScore += 10;
    if (profile.sodaConsumption > 2) riskScore += 8;
    
    const bmi = parseFloat(calculateBMI());
    if (bmi < 18.5 || bmi > 30) riskScore += 15;
    else if (bmi > 25) riskScore += 8;
    
    return Math.max(0, Math.min(100, riskScore + 30));
  };

  const handleInputChange = (field, value) => {
    setProfile(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const addMedicalCondition = (condition) => {
    if (condition && !profile.medicalConditions.includes(condition)) {
      handleInputChange('medicalConditions', [...profile.medicalConditions, condition]);
    }
  };

  const removeMedicalCondition = (condition) => {
    handleInputChange('medicalConditions', profile.medicalConditions.filter(c => c !== condition));
  };

  const saveProfile = () => {
    if (!validateForm()) {
      alert('Please fix the validation errors before saving');
      return;
    }
    
    const profileWithMetrics = {
      ...profile,
      bmi: parseFloat(calculateBMI()),
      healthRiskScore: calculateHealthRiskScore(),
      savedAt: new Date().toISOString()
    };
    
    setShowSuccess(true);
    
    // Call the parent function to save profile
    if (onSaveProfile) {
      onSaveProfile(profileWithMetrics);
    }
    
    // Navigate to dashboard after a brief delay
    setTimeout(() => {
      setShowSuccess(false);
      if (onNavigateToDashboard) {
        onNavigateToDashboard();
      }
    }, 2000);
  };

  const commonConditions = [
    'Diabetes', 'Hypertension', 'Asthma', 'Depression', 'Anxiety', 
    'Arthritis', 'Heart Disease', 'High Cholesterol', 'Insomnia', 'ADHD'
  ];

  const bmi = calculateBMI();
  const bmiInfo = getBMICategory(parseFloat(bmi));
  const riskScore = calculateHealthRiskScore();

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F0E3E3] via-white to-[#748B9C]">
      {showSuccess && (
        <div className="fixed top-4 right-4 z-50 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center animate-pulse">
          <CheckCircle className="w-5 h-5 mr-2" />
          Profile saved! Redirecting to dashboard...
        </div>
      )}

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
            <User className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">VirtuaTwin Profile Setup</h1>
          <p className="text-xl text-gray-600">Tell us about your lifestyle to get personalized health insights</p>
          
          <div className="flex justify-center items-center space-x-6 mt-4 p-4 bg-white/80 rounded-lg shadow-sm">
            <div className="text-center">
              <div className={`text-2xl font-bold ${bmiInfo.color}`}>{bmi}</div>
              <div className="text-sm text-gray-600">BMI ({bmiInfo.category})</div>
            </div>
            <div className="text-center">
              <div className={`text-2xl font-bold ${riskScore > 50 ? 'text-red-600' : riskScore > 30 ? 'text-yellow-600' : 'text-green-600'}`}>
                {riskScore}%
              </div>
              <div className="text-sm text-gray-600">Risk Score</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Basic Information */}
            <div className="space-y-6">
              <div className="flex items-center mb-4">
                <User className="w-6 h-6 text-blue-600 mr-2" />
                <h3 className="text-xl font-semibold text-gray-800">Basic Information</h3>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                    {formValidation.name && (
                      <span className="text-red-500 text-xs ml-2">{formValidation.name}</span>
                    )}
                  </label>
                  <input
                    type="text"
                    value={profile.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2  text-gray-900 focus:ring-blue-500 focus:border-transparent transition-all ${
                      formValidation.name ? 'border-red-300' : 'border-gray-200'
                    }`}
                    placeholder="Enter your full name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
                  <select
                    value={profile.gender}
                    onChange={(e) => handleInputChange('gender', e.target.value)}
                    className="w-full px-4 py-3 border text-gray-900 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="prefer-not-to-say">Prefer not to say</option>
                  </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Age: <span className="text-blue-600 font-semibold">{profile.age} years</span>
                    </label>
                    <input
                      type="range"
                      min="18"
                      max="80"
                      value={profile.age}
                      onChange={(e) => handleInputChange('age', parseInt(e.target.value))}
                      className="w-full h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Weight: <span className="text-green-600 font-semibold">{profile.weight} kg</span>
                    </label>
                    <input
                      type="range"
                      min="40"
                      max="150"
                      value={profile.weight}
                      onChange={(e) => handleInputChange('weight', parseInt(e.target.value))}
                      className="w-full h-2 bg-green-200 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Height: <span className="text-purple-600 font-semibold">{profile.height} cm</span>
                    </label>
                    <input
                      type="range"
                      min="140"
                      max="220"
                      value={profile.height}
                      onChange={(e) => handleInputChange('height', parseInt(e.target.value))}
                      className="w-full h-2 bg-purple-200 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                </div>
              </div>

              {/* Lifestyle Factors */}
              <div className="space-y-4 mt-8">
                <div className="flex items-center mb-4">
                  <Activity className="w-6 h-6 text-green-600 mr-2" />
                  <h3 className="text-xl font-semibold text-gray-800">Healthy Habits</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Exercise: <span className="text-green-600 font-semibold">{profile.exerciseHours} hrs/week</span>
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="20"
                      value={profile.exerciseHours}
                      onChange={(e) => handleInputChange('exerciseHours', parseInt(e.target.value))}
                      className="w-full h-2 bg-green-200 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Sleep: <span className="text-indigo-600 font-semibold">{profile.sleepHours} hrs/night</span>
                    </label>
                    <input
                      type="range"
                      min="4"
                      max="12"
                      value={profile.sleepHours}
                      onChange={(e) => handleInputChange('sleepHours', parseInt(e.target.value))}
                      className="w-full h-2 bg-indigo-200 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Diet Quality: <span className="text-green-600 font-semibold">{profile.dietQuality}/10</span>
                    </label>
                    <input
                      type="range"
                      min="1"
                      max="10"
                      value={profile.dietQuality}
                      onChange={(e) => handleInputChange('dietQuality', parseInt(e.target.value))}
                      className="w-full h-2 bg-green-200 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Water Intake: <span className="text-blue-600 font-semibold">{profile.waterIntake} glasses/day</span>
                    </label>
                    <input
                      type="range"
                      min="1"
                      max="12"
                      value={profile.waterIntake}
                      onChange={(e) => handleInputChange('waterIntake', parseInt(e.target.value))}
                      className="w-full h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Stress Level: <span className="text-red-600 font-semibold">{profile.stressLevel}/10</span>
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={profile.stressLevel}
                    onChange={(e) => handleInputChange('stressLevel', parseInt(e.target.value))}
                    className="w-full h-2 bg-red-200 rounded-lg appearance-none cursor-pointer"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Screen Time: <span className="text-red-600 font-semibold">{profile.screenTime} hrs/day</span>
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="16"
                    value={profile.screenTime}
                    onChange={(e) => handleInputChange('screenTime', parseInt(e.target.value))}
                    className="w-full h-2 bg-red-200 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
              </div>
            </div>

            {/* Bad Habits Section */}
            <div className="space-y-6">
              <div className="flex items-center mb-4">
                <Brain className="w-6 h-6 text-red-600 mr-2" />
                <h3 className="text-xl font-semibold text-gray-800">Lifestyle Risk Factors</h3>
              </div>

              {/* Smoking */}
              <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center">
                    <Cigarette className="w-5 h-5 text-red-600 mr-2" />
                    <label className="text-sm font-medium text-gray-700">Do you smoke?</label>
                  </div>
                  <button
                    onClick={() => handleInputChange('smokingStatus', !profile.smokingStatus)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      profile.smokingStatus ? 'bg-red-600' : 'bg-gray-300'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        profile.smokingStatus ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
                {profile.smokingStatus && (
                  <div>
                    <label className="block text-sm text-gray-600 mb-2">
                      Cigarettes per day: <span className="font-semibold">{profile.smokingFrequency}</span>
                    </label>
                    <input
                      type="range"
                      min="1"
                      max="40"
                      value={profile.smokingFrequency}
                      onChange={(e) => handleInputChange('smokingFrequency', parseInt(e.target.value))}
                      className="w-full h-2 bg-red-200 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                )}
              </div>

              {/* Drinking */}
              <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center">
                    <Wine className="w-5 h-5 text-amber-600 mr-2" />
                    <label className="text-sm font-medium text-gray-700">Do you drink alcohol?</label>
                  </div>
                  <button
                    onClick={() => handleInputChange('drinkingStatus', !profile.drinkingStatus)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      profile.drinkingStatus ? 'bg-amber-600' : 'bg-gray-300'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        profile.drinkingStatus ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
                {profile.drinkingStatus && (
                  <div>
                    <label className="block text-sm text-gray-600 mb-2">
                      Days per week: <span className="font-semibold">{profile.drinkingFrequency}</span>
                    </label>
                    <input
                      type="range"
                      min="1"
                      max="7"
                      value={profile.drinkingFrequency}
                      onChange={(e) => handleInputChange('drinkingFrequency', parseInt(e.target.value))}
                      className="w-full h-2 bg-amber-200 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                )}
              </div>

              {/* Junk Food */}
              <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center">
                    <IceCream className="w-5 h-5 text-orange-600 mr-2" />
                    <label className="text-sm font-medium text-gray-700">Regular junk food consumption?</label>
                  </div>
                  <button
                    onClick={() => handleInputChange('junkFoodHabit', !profile.junkFoodHabit)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      profile.junkFoodHabit ? 'bg-orange-600' : 'bg-gray-300'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        profile.junkFoodHabit ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
                {profile.junkFoodHabit && (
                  <div>
                    <label className="block text-sm text-gray-600 mb-2">
                      Times per week: <span className="font-semibold">{profile.junkFoodFrequency}</span>
                    </label>
                    <input
                      type="range"
                      min="1"
                      max="14"
                      value={profile.junkFoodFrequency}
                      onChange={(e) => handleInputChange('junkFoodFrequency', parseInt(e.target.value))}
                      className="w-full h-2 bg-orange-200 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                )}
              </div>

              {/* Advanced Options Toggle */}
              <div className="mt-6">
                <button
                  onClick={() => setShowAdvanced(!showAdvanced)}
                  className="flex items-center text-blue-600 hover:text-blue-700 font-medium"
                >
                  {showAdvanced ? <EyeOff className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
                  {showAdvanced ? 'Hide' : 'Show'} Advanced Health Information
                </button>
              </div>

              {/* Advanced Health Information */}
              {showAdvanced && (
                <div className="space-y-4 mt-4 p-4 bg-gray-50 rounded-lg border">
                  <h4 className="font-semibold text-gray-800 flex items-center">
                    <Heart className="w-4 h-4 mr-2" />
                    Additional Health Information
                  </h4>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Medical Conditions</label>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {profile.medicalConditions.map((condition) => (
                        <span
                          key={condition}
                          className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800"
                        >
                          {condition}
                          <button
                            onClick={() => removeMedicalCondition(condition)}
                            className="ml-2 text-red-600 hover:text-red-800"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {commonConditions.map((condition) => (
                        !profile.medicalConditions.includes(condition) && (
                          <button
                            key={condition}
                            onClick={() => addMedicalCondition(condition)}
                            className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700 hover:bg-blue-100 hover:text-blue-700"
                          >
                            <Plus className="w-3 h-3 mr-1" />
                            {condition}
                          </button>
                        )
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-gray-700">Currently receiving mental health support?</label>
                    <button
                      onClick={() => handleInputChange('mentalHealthSupport', !profile.mentalHealthSupport)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        profile.mentalHealthSupport ? 'bg-green-600' : 'bg-gray-300'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          profile.mentalHealthSupport ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Health Insights Box */}
          {profile.name && (
            <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-green-50 rounded-lg border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                <Info className="w-5 h-5 mr-2 text-blue-600" />
                Health Insights for {profile.name}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-3 bg-white rounded-lg">
                  <div className={`text-2xl font-bold ${bmiInfo.color}`}>{bmi}</div>
                  <div className="text-sm text-gray-600">BMI</div>
                  <div className="text-xs text-gray-500">{bmiInfo.category}</div>
                </div>
                <div className="text-center p-3 bg-white rounded-lg">
                  <div className={`text-2xl font-bold ${riskScore > 50 ? 'text-red-600' : riskScore > 30 ? 'text-yellow-600' : 'text-green-600'}`}>
                    {riskScore}%
                  </div>
                  <div className="text-sm text-gray-600">Health Risk</div>
                  <div className="text-xs text-gray-500">
                    {riskScore > 50 ? 'High Risk' : riskScore > 30 ? 'Moderate Risk' : 'Low Risk'}
                  </div>
                </div>
                <div className="text-center p-3 bg-white rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">
                    {Math.max(0, 100 - riskScore)}
                  </div>
                  <div className="text-sm text-gray-600">Health Score</div>
                  <div className="text-xs text-gray-500">Estimated</div>
                </div>
              </div>
            </div>
          )}

          {/* Action Button */}
          <div className="mt-8 flex justify-center">
            <button
              onClick={saveProfile}
              disabled={!profile.name.trim() || showSuccess}
              className={`flex items-center px-8 py-4 rounded-lg transition-all transform hover:scale-105 shadow-lg text-lg font-semibold ${
                profile.name.trim() && !showSuccess
                  ? 'bg-gradient-to-r from-blue-600 to-green-600 text-white hover:from-blue-700 hover:to-green-700'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              <Save className="w-6 h-6 mr-3" />
              {showSuccess ? 'Saving Profile...' : 'Save & View Dashboard'}
              <ArrowRight className="w-6 h-6 ml-3" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Health Dashboard Component
const HealthDashboard = ({ profileData, onBackToForm }) => {
  const [profile] = useState({
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

  const calculateHealthScore = (profileData) => {
    let score = 50;
    score += Math.min(profileData.exerciseHours * 2.5, 20);
    const sleepOptimal = Math.abs(profileData.sleepHours - 8);
    score += Math.max(15 - sleepOptimal * 2, 0);
    score += profileData.sleepQuality;
    score += profileData.dietQuality * 1.5;
    score += Math.min(profileData.waterIntake, 8);
    score -= profileData.stressLevel * 1.5;
    score -= profileData.workStressLevel * 0.8;
    score -= profileData.relationshipStress * 0.5;
    score -= profileData.financialStress * 0.5;
    if (profileData.smokingStatus) score -= 25;
    if (profileData.drinkingStatus && profileData.drinkingFrequency > 3) score -= 15;
    if (profileData.junkFoodHabit) score -= profileData.junkFoodFrequency;
    if (profileData.screenTime > 8) score -= (profileData.screenTime - 8) * 2;
    score -= profileData.fastFoodFrequency * 1.5;
    score -= profileData.sodaConsumption * 2;
    if (profileData.caffeineIntake > 4) score -= 5;
    const bmi = profileData.bmi || (profileData.weight / ((profileData.height / 100) ** 2));
    if (bmi < 18.5 || bmi > 30) score -= 15;
    else if (bmi > 25) score -= 8;
    score -= profileData.medicalConditions.length * 5;
    if (profileData.mentalHealthSupport && profileData.stressLevel > 5) score += 5;
    return Math.max(Math.min(Math.round(score), 100), 0);
  };

  const healthScore = calculateHealthScore(profile);

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
      )
    };
  };

  const riskFactors = calculateRiskFactors(profile);

  const radarData = [
    { factor: 'Exercise', value: Math.min(100, profile.exerciseHours * 5), fullMark: 100 },
    { factor: 'Sleep Quality', value: profile.sleepQuality * 10, fullMark: 100 },
    { factor: 'Diet Quality', value: profile.dietQuality * 10, fullMark: 100 },
    { factor: 'Hydration', value: Math.min(100, profile.waterIntake * 8.33), fullMark: 100 },
    { factor: 'Stress Management', value: (11 - profile.stressLevel) * 10, fullMark: 100 },
    { factor: 'Mental Health', value: profile.mentalHealthSupport ? 80 : (11 - profile.stressLevel) * 8, fullMark: 100 }
  ];

  const timelineData = [
    { month: 'Jan', healthScore: Math.max(40, healthScore - 15 + Math.random() * 10) },
    { month: 'Feb', healthScore: Math.max(40, healthScore - 12 + Math.random() * 10) },
    { month: 'Mar', healthScore: Math.max(40, healthScore - 8 + Math.random() * 10) },
    { month: 'Apr', healthScore: Math.max(40, healthScore - 5 + Math.random() * 10) },
    { month: 'May', healthScore: Math.max(40, healthScore - 2 + Math.random() * 10) },
    { month: 'Jun', healthScore: healthScore }
  ];

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
    
    return suggestions.slice(0, 4);
  };

  const advice = generateAdvice();

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
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <button
                onClick={onBackToForm}
                className="flex items-center text-gray-600 hover:text-gray-900 mr-4"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back to Form
              </button>
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentView === 'overview' && (
          <div className="space-y-6">
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
                  label="Obesity Risk" 
                  value={riskFactors.obesity} 
                  icon={Zap}
                  description="Weight, diet, and exercise patterns"
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

        {currentView === 'trends' && (
          <div className="space-y-6">
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
          </div>
        )}

        {currentView === 'recommendations' && (
          <div className="space-y-6">
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
          </div>
        )}
      </div>
    </div>
  );
};

// Main App Component with Navigation
const HealthApp = () => {
  const [currentPage, setCurrentPage] = useState('form');
  const [savedProfile, setSavedProfile] = useState(null);

  const handleSaveProfile = (profileData) => {
    setSavedProfile(profileData);
    console.log('Profile saved:', profileData);
  };

  const handleNavigateToDashboard = () => {
    setCurrentPage('dashboard');
  };

  const handleBackToForm = () => {
    setCurrentPage('form');
  };

  return (
    <div>
      {currentPage === 'form' && (
        <HealthInputForm 
          onSaveProfile={handleSaveProfile}
          onNavigateToDashboard={handleNavigateToDashboard}
        />
      )}
      
      {currentPage === 'dashboard' && (
        <HealthDashboard 
          profileData={savedProfile}
          onBackToForm={handleBackToForm}
        />
      )}
    </div>
  );
};

export default HealthApp