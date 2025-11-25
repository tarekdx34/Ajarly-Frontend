// FILE 4: src/components/dashboard/renter/overview/RecentActivity.tsx
// ========================================
import { Card } from "../../../ui/card";
import { Calendar, Heart, MessageSquare, Clock, LucideIcon } from "lucide-react";

interface Activity {
  id: number;
  type: string;
  title: string;
  description: string;
  date: string;
}

interface RecentActivityProps {
  activities: Activity[];
}

export function RecentActivity({ activities }: RecentActivityProps) {
  if (activities.length === 0) return null;

  const getIcon = (type: string): LucideIcon => {
    const icons = {
      booking: Calendar,
      favorite: Heart,
      review: MessageSquare,
    };
    return icons[type as keyof typeof icons] || Clock;
  };

  const getColor = (type: string): string => {
    const colors = {
      booking: '#00BFA6',
      favorite: '#FF6B6B',
      review: '#FFB74D',
    };
    return colors[type as keyof typeof colors] || '#9E9E9E';
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInDays < 7) return `${diffInDays}d ago`;
    
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
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