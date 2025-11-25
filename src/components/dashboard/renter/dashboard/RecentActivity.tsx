// src/components/dashboard/renter/dashboard/RecentActivity.tsx
import { Card } from "../../../ui/card";
import { ActivityItem } from "../../../../hooks/useDashboardStats";
import { Calendar, Heart, MessageSquare, Clock } from "lucide-react";

interface RecentActivityProps {
  activities: ActivityItem[];
}

export function RecentActivity({ activities }: RecentActivityProps) {
  if (activities.length === 0) {
    return null;
  }

  const getIcon = (type: string) => {
    switch (type) {
      case 'booking':
        return Calendar;
      case 'favorite':
        return Heart;
      case 'review':
        return MessageSquare;
      default:
        return Clock;
    }
  };

  const getColor = (type: string) => {
    switch (type) {
      case 'booking':
        return '#00BFA6';
      case 'favorite':
        return '#FF6B6B';
      case 'review':
        return '#FFB74D';
      default:
        return '#9E9E9E';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else if (diffInDays < 7) {
      return `${diffInDays}d ago`;
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  };

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold text-[#2B2B2B] mb-4">Recent Activity</h3>
      
      <div className="space-y-4">
        {activities.map((activity) => {
          const Icon = getIcon(activity.type);
          const color = getColor(activity.type);

          return (
            <div key={activity.id} className="flex items-start gap-3">
              <div 
                className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: `${color}20` }}
              >
                <Icon className="w-5 h-5" style={{ color }} />
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-[#2B2B2B] truncate">
                  {activity.title}
                </p>
                <p className="text-xs text-gray-600 truncate">
                  {activity.description}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {formatDate(activity.date)}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}