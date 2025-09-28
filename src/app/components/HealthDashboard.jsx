import React, { useState, useEffect } from 'react';
import { Activity, TrendingUp, Target, Menu, X, BarChart3 } from 'lucide-react';
import Overview from './Overview';
import Trends from './Trends';
import Recommendations from './Recommendations';

const navItems = [
  { id: 'overview', label: 'Overview (Chart)', icon: Activity },
  { id: 'trends', label: 'Trends (Graph)', icon: TrendingUp },
  { id: 'recommendations', label: 'Recommendations', icon: Target },
];

const HealthDashboard = ({ profileData }) => {
  const [currentView, setCurrentView] = useState('overview');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const [profile] = useState({
    name: 'John Doe',
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
    bmi: 24.2,
    healthRiskScore: 35,
    ...profileData,
  });

  // Close mobile menu when view changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [currentView]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F0E3E3] via-white to-[#748B9C]">
      <nav className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between h-16 items-center">
          <div className="flex items-center space-x-3">
            <BarChart3 className="h-8 w-8 text-blue-600" />
            <div>
              <h1 className="text-xl font-semibold text-gray-900">Health Dashboard</h1>
              {profile.name && (
                <span className="hidden sm:block text-sm text-gray-600">
                  Welcome, {profile.name}
                </span>
              )}
            </div>
          </div>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center space-x-2">
            {navItems.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setCurrentView(id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-2 ${
                  currentView === id
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="hidden lg:block">{label}</span>
              </button>
            ))}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:ring-2 focus:ring-blue-500"
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile nav menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border-t">
            {navItems.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setCurrentView(id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 text-base font-medium transition-colors ${
                  currentView === id
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{label}</span>
              </button>
            ))}
          </div>
        )}
      </nav>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 min-h-[80vh]">
        {currentView === 'overview' && <Overview profile={profile} />}
        {currentView === 'trends' && <Trends profile={profile} />}
        {currentView === 'recommendations' && <Recommendations profile={profile} />}
      </main>
    </div>
  );
};

export default HealthDashboard;
