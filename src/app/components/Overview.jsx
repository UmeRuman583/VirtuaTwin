import React from 'react';
import { Heart, Brain, AlertTriangle, Target, Activity, Moon, Droplets, Coffee, Gamepad2, Brain as BrainIcon } from 'lucide-react';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer } from 'recharts';

const Overview = ({ profile }) => {
  // Prepare radar data
  const radarData = [
    { factor: 'Exercise', value: Math.min(100, profile.exerciseHours * 5), fullMark: 100 },
    { factor: 'Sleep Quality', value: profile.sleepQuality * 10, fullMark: 100 },
    { factor: 'Diet Quality', value: profile.dietQuality * 10, fullMark: 100 },
    { factor: 'Hydration', value: Math.min(100, profile.waterIntake * 8.33), fullMark: 100 },
    { factor: 'Stress Management', value: (11 - profile.stressLevel) * 10, fullMark: 100 },
    { factor: 'Mental Health', value: profile.mentalHealthSupport ? 80 : (11 - profile.stressLevel) * 8, fullMark: 100 },
  ];

  const getAvatarEmoji = () => {
    if (profile.healthRiskScore >= 80) return '😊';
    if (profile.healthRiskScore >= 60) return '😐';
    if (profile.healthRiskScore >= 40) return '😕';
    return '😟';
  };

  const getAvatarColor = () => {
    if (profile.healthRiskScore >= 80) return 'text-green-500';
    if (profile.healthRiskScore >= 60) return 'text-yellow-500';
    if (profile.healthRiskScore >= 40) return 'text-orange-500';
    return 'text-red-500';
  };

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-4 text-center">
          <div className={`text-4xl mb-2 ${getAvatarColor()}`}>{getAvatarEmoji()}</div>
          <div className="font-semibold text-lg text-gray-900">Health Score</div>
          <div className="text-sm text-gray-600">{profile.healthRiskScore}</div>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">BMI</p>
              <p className="text-2xl font-bold text-gray-900">{profile.bmi.toFixed(1)}</p>
              <p className="text-xs text-gray-500">
                {profile.bmi < 18.5
                  ? 'Underweight'
                  : profile.bmi < 25
                  ? 'Normal'
                  : profile.bmi < 30
                  ? 'Overweight'
                  : 'Obese'}
              </p>
            </div>
            <Heart className="h-8 w-8 text-red-400" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Risk Level</p>
              <p className="text-2xl font-bold text-gray-900">{profile.healthRiskScore}%</p>
              <p className="text-xs text-gray-500">
                {profile.healthRiskScore > 50 ? 'High' : profile.healthRiskScore > 30 ? 'Moderate' : 'Low'}
              </p>
            </div>
            <AlertTriangle
              className={`h-8 w-8 ${
                profile.healthRiskScore > 50 ? 'text-red-400' : 'text-yellow-400'
              }`}
            />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Goals</p>
              <p className="text-2xl font-bold text-gray-900">{profile.healthRiskScore > 0 ? 4 : 0}</p>
              <p className="text-xs text-gray-500">recommendations</p>
            </div>
            <Target className="h-8 w-8 text-blue-400" />
          </div>
        </div>
      </div>

      {/* Lifestyle Radar */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Lifestyle Balance</h2>
        <div style={{ height: 300 }}>
          <ResponsiveContainer width="100%" height="100%">
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
    </div>
  );
};


export default Overview;