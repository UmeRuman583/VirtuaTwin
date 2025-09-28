import React, { useState } from 'react';
import { TrendingUp } from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const Trends = ({ profile }) => {
  const [timeRange, setTimeRange] = useState('6months');

  // Generate timelineData same as before or receive as prop. Using dummy data here:
  const timelineData = [
    { month: 'Jan', healthScore: 65, weight: 70, sleepHours: 7, exerciseHours: 3, stressLevel: 3 },
    { month: 'Feb', healthScore: 68, weight: 70, sleepHours: 7.5, exerciseHours: 4, stressLevel: 2 },
    { month: 'Mar', healthScore: 70, weight: 69, sleepHours: 8, exerciseHours: 4, stressLevel: 2 },
    { month: 'Apr', healthScore: 72, weight: 69, sleepHours: 7, exerciseHours: 4, stressLevel: 1 },
    { month: 'May', healthScore: 75, weight: 68, sleepHours: 7.5, exerciseHours: 5, stressLevel: 2 },
    { month: 'Jun', healthScore: 78, weight: 67, sleepHours: 8, exerciseHours: 5, stressLevel: 1 },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6 flex flex-col sm:flex-row sm:items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Health Trends</h2>
        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm mt-3 sm:mt-0"
        >
          <option value="3months">Last 3 Months</option>
          <option value="6months">Last 6 Months</option>
          <option value="1year">Last Year</option>
        </select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <TrendingUp className="w-5 h-5 mr-2 text-green-600" />
            Health Score Progress
          </h3>
          <div style={{ height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={timelineData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" tick={{ fontSize: 10 }} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 10 }} />
                <Tooltip />
                <Line type="monotone" dataKey="healthScore" stroke="#3B82F6" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Multiple Metrics</h3>
          <div style={{ height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={timelineData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip />
                <Line type="monotone" dataKey="weight" stroke="#10B981" name="Weight (kg)" strokeWidth={2} />
                <Line type="monotone" dataKey="sleepHours" stroke="#8B5CF6" name="Sleep Hours" strokeWidth={2} />
                <Line type="monotone" dataKey="exerciseHours" stroke="#F59E0B" name="Exercise Hours" strokeWidth={2} />
                <Line type="monotone" dataKey="stressLevel" stroke="#EF4444" name="Stress Level" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Trends;