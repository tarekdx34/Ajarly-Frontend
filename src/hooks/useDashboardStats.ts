// src/hooks/useDashboardStats.ts
import { useState, useEffect } from 'react';
import api, { BookingResponse, FavoriteResponse } from '../../api';

export interface DashboardStats {
  totalTrips: number;
  upcomingTrips: number;
  completedTrips: number;
  cancelledTrips: number;
  totalFavorites: number;
  totalSpent: number;
  reviewsGiven: number;
  pendingReviews: number;
}

export interface ActivityItem {
  id: string;
  type: 'booking' | 'review' | 'favorite';
  title: string;
  description: string;
  date: string;
  icon?: string;
}

export function useDashboardStats() {
  const [stats, setStats] = useState<DashboardStats>({
    totalTrips: 0,
    upcomingTrips: 0,
    completedTrips: 0,
    cancelledTrips: 0,
    totalFavorites: 0,
    totalSpent: 0,
    reviewsGiven: 0,
    pendingReviews: 0
  });
  const [recentActivity, setRecentActivity] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    calculateStats();
  }, []);

  const calculateStats = async () => {
    try {
      setLoading(true);

      // Fetch all necessary data
      const [bookings, favorites] = await Promise.all([
        api.getBookings(),
        api.getFavorites({ page: 0, size: 100 })
      ]);

      // Calculate booking stats
      const now = new Date();
      const upcoming = bookings?.filter(b => 
        b.status === 'confirmed' && new Date(b.checkInDate) > now
      ) || [];
      
      const completed = bookings?.filter(b => 
        b.status === 'completed' || 
        (b.status === 'confirmed' && new Date(b.checkOutDate) < now)
      ) || [];
      
      const cancelled = bookings?.filter(b => 
        b.status === 'cancelled' || b.status === 'rejected'
      ) || [];

      // Calculate total spent
      const totalSpent = completed.reduce((sum, b) => sum + (b.totalPrice || 0), 0);

      // Build recent activity
      const activity: ActivityItem[] = [];
      
      // Add recent bookings (safely check if bookings exists)
      if (bookings && bookings.length > 0) {
        bookings
          .sort((a, b) => new Date(b.requestedAt).getTime() - new Date(a.requestedAt).getTime())
          .slice(0, 5)
          .forEach(booking => {
            activity.push({
              id: `booking-${booking.bookingId}`,
              type: 'booking',
              title: booking.property?.titleEn || booking.property?.titleAr || 'Unknown Property',
              description: `Booked for ${booking.numberOfNights} nights`,
              date: booking.requestedAt,
            });
          });
      }

      // Add favorites (safely check if favorites content exists)
      if (favorites?.content && favorites.content.length > 0) {
        favorites.content.slice(0, 3).forEach(fav => {
          activity.push({
            id: `favorite-${fav.favoriteId}`,
            type: 'favorite',
            title: fav.property?.titleEn || fav.property?.titleAr || 'Unknown Property',
            description: 'Added to favorites',
            date: fav.createdAt,
          });
        });
      }

      // Sort by date
      activity.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

      setStats({
        totalTrips: bookings?.length || 0,
        upcomingTrips: upcoming.length,
        completedTrips: completed.length,
        cancelledTrips: cancelled.length,
        totalFavorites: favorites?.totalElements || 0,
        totalSpent,
        reviewsGiven: 0, // Will be updated when reviews API is called
        pendingReviews: completed.length // Assume all completed need reviews
      });

      setRecentActivity(activity.slice(0, 10));
    } catch (err) {
      console.error('Failed to calculate stats:', err);
      // Set default empty stats on error
      setStats({
        totalTrips: 0,
        upcomingTrips: 0,
        completedTrips: 0,
        cancelledTrips: 0,
        totalFavorites: 0,
        totalSpent: 0,
        reviewsGiven: 0,
        pendingReviews: 0
      });
      setRecentActivity([]);
    } finally {
      setLoading(false);
    }
  };

  return {
    stats,
    recentActivity,
    loading,
    refresh: calculateStats
  };
}