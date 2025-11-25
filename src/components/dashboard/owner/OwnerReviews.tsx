// src/components/dashboard/owner/OwnerOverview.tsx - UPDATED
import { Card } from "../../ui/card";
import { RecentReviews } from "./RecentReviews";
import { DollarSign, TrendingUp, Calendar, Star } from "lucide-react";
import { Language, translations } from "../../../lib/translations";
import { fromHalfFloat } from "three/src/extras/DataUtils.js";
import { Button } from "../../ui/button";

interface OwnerOverviewProps {
  dashboard: any;
  properties: any[];
  language: Language;
}

export function OwnerOverview({
  dashboard,
  properties,
  language,
}: OwnerOverviewProps) {
  const t = translations[language];

  // Handle loading state
  if (!dashboard) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="p-6 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-3"></div>
              <div className="h-8 bg-gray-300 rounded w-3/4"></div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  const stats = [
    {
      icon: DollarSign,
      label: "Total Earnings",
      value: dashboard.overview?.totalRevenue || 0,
      color: "#00BFA6",
      format: "currency",
    },
    {
      icon: TrendingUp,
      label: "This Month",
      value: dashboard.overview?.monthlyRevenue || 0,
      color: "#FF6B6B",
      format: "currency",
    },
    {
      icon: Calendar,
      label: "Total Bookings",
      value: dashboard.overview?.totalBookings || 0,
      color: "#4ECDC4",
      format: "number",
    },
    {
      icon: Star,
      label: "Average Rating",
      value: dashboard.overview?.averageRating || 0,
      color: "#FFD93D",
      format: "rating",
    },
  ];

  const formatValue = (value: number, format: string) => {
    if (format === "currency") {
      return `${value.toLocaleString()} EGP`;
    } else if (format === "rating") {
      return value.toFixed(1);
    }
    return value.toString();
  };

  const handleRespondToReview = (reviewId: number) => {
    // Navigate to reviews page or open modal
    if (reviewId === 0) {
      // View all reviews
      window.location.href = "/dashboard/reviews";
    } else {
      // Respond to specific review
      window.location.href = `/dashboard/reviews?respond=${reviewId}`;
    }
  };

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card
            key={index}
            className="p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                <p className="text-3xl font-bold text-[#2B2B2B]">
                  {formatValue(stat.value, stat.format)}
                </p>
                {stat.format === "rating" && dashboard.overview?.totalReviews && (
                  <p className="text-xs text-gray-500 mt-1">
                    From {dashboard.overview.totalReviews} reviews
                  </p>
                )}
              </div>
              <div
                className="w-12 h-12 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: `${stat.color}20` }}
              >
                <stat.icon className="w-6 h-6" style={{ color: stat.color }} />
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Recent Reviews Section */}
      {dashboard.recentReviews && dashboard.recentReviews.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900">
            Recent Reviews
          </h2>
          <RecentReviews
            reviews={dashboard.recentReviews}
            loading={false}
            onRespond={handleRespondToReview}
            language={language}
          />
        </div>
      )}

      {/* Best Performing Property */}
      {dashboard.bestPerformingProperty && (
        <Card className="overflow-hidden">
          <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-yellow-50 to-transparent">
            <h3 className="text-lg font-semibold text-gray-900">
              🏆 Best Performing Property
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              {dashboard.bestPerformingProperty.performanceReason}
            </p>
          </div>
          <div className="p-6">
            <div className="flex items-center gap-4">
              {dashboard.bestPerformingProperty.propertyImage && (
                <img
                  src={dashboard.bestPerformingProperty.propertyImage}
                  alt={dashboard.bestPerformingProperty.propertyTitle}
                  className="w-24 h-24 rounded-lg object-cover"
                />
              )}
              <div className="flex-1">
                <h4 className="font-semibold text-lg text-gray-900 mb-2">
                  {dashboard.bestPerformingProperty.propertyTitle}
                </h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Revenue</p>
                    <p className="font-semibold text-[#00BFA6]">
                      {dashboard.bestPerformingProperty.totalRevenue.toLocaleString()} EGP
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600">Bookings</p>
                    <p className="font-semibold">
                      {dashboard.bestPerformingProperty.totalBookings}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600">Rating</p>
                    <p className="font-semibold flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                      {dashboard.bestPerformingProperty.averageRating.toFixed(1)}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600">Views</p>
                    <p className="font-semibold">
                      {dashboard.bestPerformingProperty.totalViews.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Properties Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6">
          <h4 className="text-sm font-medium text-gray-600 mb-2">
            Total Properties
          </h4>
          <p className="text-3xl font-bold text-gray-900">
            {dashboard.overview?.totalProperties || properties.length}
          </p>
        </Card>
        <Card className="p-6">
          <h4 className="text-sm font-medium text-gray-600 mb-2">
            Active Properties
          </h4>
          <p className="text-3xl font-bold text-[#00BFA6]">
            {dashboard.overview?.activeProperties || 0}
          </p>
        </Card>
        <Card className="p-6">
          <h4 className="text-sm font-medium text-gray-600 mb-2">
            Pending Approval
          </h4>
          <p className="text-3xl font-bold text-yellow-600">
            {dashboard.overview?.pendingApprovalProperties || 0}
          </p>
        </Card>
      </div>
    </div>
  );
}