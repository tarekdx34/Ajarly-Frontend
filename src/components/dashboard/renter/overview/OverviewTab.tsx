// FILE 1: src/components/dashboard/renter/overview/OverviewTab.tsx
// ========================================
import { useState, useEffect } from "react";
import { Loader2, Calendar } from "lucide-react";
import { Language, translations } from "../../../../lib/translations";
import { StatsCard } from "../../shared/components/StatsCard";
import { StatsCards } from "./StatsCards";
import { UpcomingBookings } from "./UpcomingBookings";
import { RecentActivity } from "./RecentActivity";
import { EmptyState } from "../../shared/components/EmptyState";
import { useFavorites } from "../../../../contexts/FavoritesContext";
import api from "../../../../../api";

interface OverviewTabProps {
  onNavigate: (page: string, id?: string) => void;
  language: Language;
}
interface DashboardStats {
  totalTrips: number;
  upcomingTrips: number;
  totalFavorites: number;
  reviewsGiven: number;
  completedTrips: number;
  cancelledTrips: number;
  totalSpent: number;
  pendingReviews: number;
}

export function OverviewTab({ onNavigate, language }: OverviewTabProps) {
  const t = translations[language];
  const { favorites, refreshFavorites } = useFavorites();

  const [stats, setStats] = useState<DashboardStats>({
    totalTrips: 0,
    upcomingTrips: 0,
    totalFavorites: 0,
    reviewsGiven: 0,
    completedTrips: 0,
    cancelledTrips: 0,
    totalSpent: 0,
    pendingReviews: 0,
  });

  const [upcomingBookings, setUpcomingBookings] = useState<any[]>([]);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  useEffect(() => {
    setStats((prev) => ({ ...prev, totalFavorites: favorites.length }));
    updateRecentActivity();
  }, [favorites.length]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      await refreshFavorites();

      const allBookings = await api.getBookings().catch(() => []);
      const upcomingData = await api.getUpcomingBookings().catch(() => []);

      const completedCount =
        allBookings?.filter((b: any) => b.status === "completed").length || 0;
      const cancelledCount =
        allBookings?.filter((b: any) => b.status === "cancelled").length || 0;
      const totalSpentAmount =
        allBookings?.reduce(
          (sum: number, b: any) => sum + (b.totalPrice || 0),
          0
        ) || 0;

      setStats({
        totalTrips: allBookings?.length || 0,
        upcomingTrips: upcomingData?.length || 0,
        totalFavorites: favorites.length,
        reviewsGiven: 0,
        completedTrips: completedCount,
        cancelledTrips: cancelledCount,
        totalSpent: totalSpentAmount,
        pendingReviews: 0,
      });

      setUpcomingBookings(upcomingData || []);
      updateRecentActivity(allBookings);
    } catch (error) {
      console.error("❌ Dashboard error:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateRecentActivity = (bookings?: any[]) => {
    const activities: any[] = [];

    if (bookings && bookings.length > 0) {
      bookings.slice(0, 3).forEach((booking: any) => {
        activities.push({
          id: booking.bookingId,
          type: "booking",
          title: booking.property?.titleEn || "Property",
          description: `Booked for ${booking.numberOfNights || 0} nights`,
          date: booking.createdAt || new Date().toISOString(),
        });
      });
    }

    if (favorites.length > 0) {
      favorites.slice(0, 2).forEach((fav: any) => {
        activities.push({
          id: fav.favoriteId,
          type: "favorite",
          title: fav.property?.titleEn || "Property",
          description: "Added to favorites",
          date: fav.createdAt || new Date().toISOString(),
        });
      });
    }

    setRecentActivity(activities.slice(0, 5));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 text-[#00BFA6] animate-spin" />
      </div>
    );
  }

  if (stats.totalTrips === 0 && stats.totalFavorites === 0) {
    return (
      <EmptyState
        icon={Calendar}
        title={t.userDashboard.welcomeToDashboard}
        description={t.userDashboard.startJourney}
        actionLabel={t.userDashboard.browseProperties}
        onAction={() => onNavigate("properties")}
      />
    );
  }

  return (
    <div className="space-y-6" dir={language === "ar" ? "rtl" : "ltr"}>
      <StatsCards stats={stats} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          {upcomingBookings.length > 0 ? (
            <UpcomingBookings
              bookings={upcomingBookings}
              onViewAll={() => onNavigate("user-dashboard?tab=trips")}
              onViewDetails={(id) => onNavigate("trip-details", String(id))}
            />
          ) : (
            <EmptyState
              icon={Calendar}
              title={t.userDashboard.noUpcomingTrips}
              description={t.userDashboard.timeToExplore}
              actionLabel={t.userDashboard.browseProperties}
              onAction={() => onNavigate("properties")}
            />
          )}
        </div>

        <div className="lg:col-span-1">
          <RecentActivity activities={recentActivity} />
        </div>
      </div>
    </div>
  );
}
