import React from 'react';
import { Target, AlertTriangle, TrendingUp, CheckCircle, Activity, Heart, Brain, Award, Clock } from 'lucide-react';

const Recommendations = ({ profile }) => {
  // Hardcoded or dynamic recommendations based on profile
  const advice = [
    {
      type: 'exercise',
      priority: 'high',
      text: 'Increase physical activity to at least 150 minutes per week',
      impact: 'Could improve your health score by 10-15 points',
    },
    {
      type: 'sleep',
      priority: 'high',
      text: 'Aim for 7-9 hours of quality sleep per night',
      impact: 'Better sleep could reduce stress and improve focus',
    },
    {
      type: 'stress',
      priority: 'high',
      text: 'Consider stress management techniques or professional support',
      impact: 'Reducing stress could significantly improve overall wellbeing',
    },
    {
      type: 'smoking',
      priority: 'critical',
      text: 'Quitting smoking would have the biggest positive impact on your health',
      impact: 'Could improve health score by 25+ points and reduce disease risk',
    },
  ];

  const iconMap = {
    critical: AlertTriangle,
    high: TrendingUp,
    medium: CheckCircle,
    low: CheckCircle,
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          <Target className="w-6 h-6 mr-2 text-blue-600" />
          Personalized Health Recommendations
        </h2>
        <div className="space-y-4">
          {advice.map(({ type, priority, text, impact }, index) => {
            const Icon = iconMap[priority] || CheckCircle;
            return (
              <div
                key={index}
                className={`p-4 rounded-lg border-l-4 ${
                  priority === 'critical'
                    ? 'border-red-500 bg-red-50'
                    : priority === 'high'
                    ? 'border-orange-500 bg-orange-50'
                    : priority === 'medium'
                    ? 'border-yellow-500 bg-yellow-50'
                    : 'border-green-500 bg-green-50'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-medium rounded-full mr-2 ${
                          priority === 'critical'
                            ? 'bg-red-100 text-red-800'
                            : priority === 'high'
                            ? 'bg-orange-100 text-orange-800'
                            : priority === 'medium'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-green-100 text-green-800'
                        }`}
                      >
                        {priority.toUpperCase()}
                      </span>
                      <span className="text-sm font-medium text-gray-700 capitalize">{type}</span>
                    </div>
                    <p className="text-base text-gray-800 mb-2">{text}</p>
                    <p className="text-sm text-gray-600">{impact}</p>
                  </div>
                  <div className="ml-4 flex-shrink-0">
                    <Icon
                      className={`w-6 h-6 ${
                        priority === 'critical'
                          ? 'text-red-500'
                          : priority === 'high'
                          ? 'text-orange-500'
                          : 'text-green-500'
                      }`}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Recommendations;