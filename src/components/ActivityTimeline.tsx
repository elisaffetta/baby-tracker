
import React from 'react';
import { Moon, Milk, Clock } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Activity } from '@/pages/Index';

interface ActivityTimelineProps {
  activities: Activity[];
}

const ActivityTimeline: React.FC<ActivityTimelineProps> = ({ activities }) => {
  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    });
  };

  if (activities.length === 0) {
    return (
      <Card className="p-6 bg-white/80 backdrop-blur-sm">
        <div className="text-center text-gray-500">
          <Clock className="w-8 h-8 mx-auto mb-2 opacity-50" />
          <p className="text-sm">No activities recorded yet</p>
          <p className="text-xs mt-1">Start tracking your baby's routine!</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 bg-white/80 backdrop-blur-sm">
      <h3 className="font-semibold text-gray-800 mb-4">Recent Activities</h3>
      <div className="space-y-3">
        {activities.map((activity) => (
          <div 
            key={activity.id} 
            className="flex items-center space-x-3 p-3 rounded-lg bg-gray-50/80 hover:bg-gray-100/80 transition-colors"
          >
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
              activity.type === 'sleep' 
                ? 'bg-purple-100 text-purple-600' 
                : 'bg-pink-100 text-pink-600'
            }`}>
              {activity.type === 'sleep' ? (
                <Moon className="w-5 h-5" />
              ) : (
                <Milk className="w-5 h-5" />
              )}
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium capitalize text-gray-800">
                    {activity.type}
                  </p>
                  <p className="text-sm text-gray-600">
                    {formatTime(activity.startTime)}
                    {activity.endTime && ` - ${formatTime(activity.endTime)}`}
                  </p>
                </div>
                {activity.duration && (
                  <span className="text-sm font-medium text-gray-700 bg-white px-2 py-1 rounded">
                    {formatDuration(activity.duration)}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default ActivityTimeline;
