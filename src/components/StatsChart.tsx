
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Activity } from '@/pages/Index';
import { Clock, Moon, Milk } from 'lucide-react';

interface StatsChartProps {
  activities: Activity[];
}

const StatsChart: React.FC<StatsChartProps> = ({ activities }) => {
  // Process data for today's timeline
  const getTodaysData = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const todaysActivities = activities.filter(activity => 
      activity.startTime >= today && activity.startTime < tomorrow && activity.duration
    );

    const hourlyData = Array.from({ length: 24 }, (_, hour) => ({
      hour: `${hour.toString().padStart(2, '0')}:00`,
      sleep: 0,
      feeding: 0,
    }));

    todaysActivities.forEach(activity => {
      const startHour = activity.startTime.getHours();
      const duration = activity.duration || 0;
      const durationMinutes = Math.round(duration / 60);

      if (activity.type === 'sleep') {
        hourlyData[startHour].sleep += durationMinutes;
      } else {
        hourlyData[startHour].feeding += durationMinutes;
      }
    });

    return hourlyData.filter(data => data.sleep > 0 || data.feeding > 0);
  };

  // Process data for weekly summary
  const getWeeklyData = () => {
    const sleepTotal = activities
      .filter(a => a.type === 'sleep' && a.duration)
      .reduce((sum, a) => sum + (a.duration || 0), 0);
    
    const feedingTotal = activities
      .filter(a => a.type === 'feeding' && a.duration)
      .reduce((sum, a) => sum + (a.duration || 0), 0);

    return [
      { name: 'Sleep', value: Math.round(sleepTotal / 3600), color: '#A855F7' },
      { name: 'Feeding', value: Math.round(feedingTotal / 3600), color: '#EC4899' },
    ];
  };

  // Get statistics counts
  const getStatsOverview = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const todaysActivities = activities.filter(activity => 
      activity.startTime >= today && activity.startTime < tomorrow
    );

    const totalSleepSessions = activities.filter(a => a.type === 'sleep' && a.duration).length;
    const totalFeedingSessions = activities.filter(a => a.type === 'feeding' && a.duration).length;
    const todaySleepSessions = todaysActivities.filter(a => a.type === 'sleep' && a.duration).length;
    const todayFeedingSessions = todaysActivities.filter(a => a.type === 'feeding' && a.duration).length;

    const avgSleepDuration = totalSleepSessions > 0 
      ? activities.filter(a => a.type === 'sleep' && a.duration)
          .reduce((sum, a) => sum + (a.duration || 0), 0) / totalSleepSessions / 60
      : 0;

    const avgFeedingDuration = totalFeedingSessions > 0
      ? activities.filter(a => a.type === 'feeding' && a.duration)
          .reduce((sum, a) => sum + (a.duration || 0), 0) / totalFeedingSessions / 60
      : 0;

    return {
      totalSleepSessions,
      totalFeedingSessions,
      todaySleepSessions,
      todayFeedingSessions,
      avgSleepDuration: Math.round(avgSleepDuration),
      avgFeedingDuration: Math.round(avgFeedingDuration)
    };
  };

  const todaysData = getTodaysData();
  const weeklyData = getWeeklyData();
  const stats = getStatsOverview();

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="p-4 bg-white/80 backdrop-blur-sm">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
              <Moon className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Сон сегодня</p>
              <p className="font-bold text-lg text-gray-800">{stats.todaySleepSessions}</p>
              <p className="text-xs text-gray-500">Всего: {stats.totalSleepSessions}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-white/80 backdrop-blur-sm">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-pink-100 flex items-center justify-center">
              <Milk className="w-5 h-5 text-pink-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Кормление сегодня</p>
              <p className="font-bold text-lg text-gray-800">{stats.todayFeedingSessions}</p>
              <p className="text-xs text-gray-500">Всего: {stats.totalFeedingSessions}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Average durations */}
      <Card className="p-4 bg-white/80 backdrop-blur-sm">
        <div className="flex items-center space-x-2 mb-3">
          <Clock className="w-4 h-4 text-gray-600" />
          <h4 className="font-medium text-gray-800">Средняя продолжительность</h4>
        </div>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-purple-600 font-medium">Сон:</span>
            <span className="ml-2 text-gray-700">{stats.avgSleepDuration} мин</span>
          </div>
          <div>
            <span className="text-pink-600 font-medium">Кормление:</span>
            <span className="ml-2 text-gray-700">{stats.avgFeedingDuration} мин</span>
          </div>
        </div>
      </Card>

      <Tabs defaultValue="today" className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-white/70 backdrop-blur-sm">
          <TabsTrigger value="today" className="data-[state=active]:bg-white">
            Сегодня
          </TabsTrigger>
          <TabsTrigger value="week" className="data-[state=active]:bg-white">
            Неделя
          </TabsTrigger>
        </TabsList>

        <TabsContent value="today">
          <Card className="p-6 bg-white/80 backdrop-blur-sm">
            <h3 className="font-semibold text-gray-800 mb-4">Активность сегодня</h3>
            {todaysData.length > 0 ? (
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={todaysData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis 
                      dataKey="hour" 
                      tick={{ fontSize: 12 }}
                      stroke="#6b7280"
                    />
                    <YAxis 
                      tick={{ fontSize: 12 }}
                      stroke="#6b7280"
                      label={{ value: 'Минуты', angle: -90, position: 'insideLeft' }}
                    />
                    <Bar dataKey="sleep" fill="#A855F7" radius={[2, 2, 0, 0]} />
                    <Bar dataKey="feeding" fill="#EC4899" radius={[2, 2, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-64 flex items-center justify-center text-gray-500">
                <div className="text-center">
                  <p className="text-sm">Активность сегодня не записана</p>
                  <p className="text-xs mt-1">Начните отслеживание!</p>
                </div>
              </div>
            )}
          </Card>
        </TabsContent>

        <TabsContent value="week">
          <Card className="p-6 bg-white/80 backdrop-blur-sm">
            <h3 className="font-semibold text-gray-800 mb-4">Недельная сводка</h3>
            {weeklyData.some(d => d.value > 0) ? (
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={weeklyData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {weeklyData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex justify-center space-x-6 mt-4">
                  {weeklyData.map((entry) => (
                    <div key={entry.name} className="flex items-center space-x-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: entry.color }}
                      />
                      <span className="text-sm text-gray-700">
                        {entry.name === 'Sleep' ? 'Сон' : 'Кормление'}: {entry.value}ч
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="h-64 flex items-center justify-center text-gray-500">
                <div className="text-center">
                  <p className="text-sm">Недельных данных пока нет</p>
                  <p className="text-xs mt-1">Продолжайте отслеживание!</p>
                </div>
              </div>
            )}
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default StatsChart;
