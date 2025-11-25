// src/components/dashboard/renter/dashboard/StatsCards.tsx
import { StatsCard } from "../../shared/components/StatsCard";
import { DashboardStats } from "../../../../hooks/useDashboardStats";
import { Calendar, MapPin, Heart, Star } from "lucide-react";

interface StatsCardsProps {
  stats: DashboardStats;
}

export function StatsCards({ stats }: StatsCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatsCard
        icon={Calendar}
        label="Total Trips"
        value={stats.totalTrips}
        color="#00BFA6"
      />
      
      <StatsCard
        icon={MapPin}
        label="Upcoming Trips"
        value={stats.upcomingTrips}
        color="#FF6B6B"
      />
      
      <StatsCard
        icon={Heart}
        label="Saved Favorites"
        value={stats.totalFavorites}
        color="#FFB74D"
      />
      
      <StatsCard
        icon={Star}
        label="Reviews Given"
        value={stats.reviewsGiven}
        color="#9C27B0"
      />
    </div>
  );
}