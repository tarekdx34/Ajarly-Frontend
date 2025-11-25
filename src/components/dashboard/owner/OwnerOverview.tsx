// src/components/dashboard/owner/OwnerOverview.tsx - ✅ FINAL FIXED VERSION
import { useState } from "react";
import { Card } from "../../ui/card";
import { RecentReviews } from "./RecentReviews";
import { RespondToReviewModal } from "./RespondToReviewModal";
import { DollarSign, TrendingUp, Calendar, Star } from "lucide-react";
import { Language, translations } from "../../../lib/translations";
import api from "../../../../api";
import { toast } from "sonner";

interface OwnerOverviewProps {
  dashboard: any;
  properties: any[];
  language: Language;
  onRefresh?: () => void;
}

export function OwnerOverview({
  dashboard,
  properties,
  language,
  onRefresh,
}: OwnerOverviewProps) {
  const t = translations[language];

  // ============================================
  // 🔄 STATE MANAGEMENT
  // ============================================
  const [selectedReview, setSelectedReview] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // ============================================
  // ⏳ LOADING STATE
  // ============================================
  if (!dashboard) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
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

  // ============================================
  // 📊 STATS DATA
  // ============================================
  const stats = [
    {
      icon: DollarSign,
      label: "Total Earnings",
      value: dashboard.overview?.totalRevenue || 0,
      subValue: dashboard.overview?.monthlyRevenue || 0,
      color: "#00BFA6",
      format: "currency",
    },
    {
      icon: Calendar,
      label: "Total Bookings",
      value: dashboard.overview?.totalBookings || 0,
      subValue: dashboard.overview?.pendingBookings || 0,
      color: "#4ECDC4",
      format: "bookings",
    },
    {
      icon: Star,
      label: "Average Rating",
      value: dashboard.overview?.averageRating || 0,
      subValue: dashboard.overview?.totalReviews || 0,
      color: "#FFD93D",
      format: "rating",
    },
    {
      icon: TrendingUp,
      label: "Active Properties",
      value: dashboard.overview?.activeProperties || 0,
      subValue: dashboard.overview?.totalProperties || properties.length,
      color: "#FF6B6B",
      format: "properties",
    },
  ];

  // ============================================
  // 🎨 FORMAT VALUES
  // ============================================
  const formatValue = (value: number, format: string) => {
    if (format === "currency") return `${value.toLocaleString()} EGP`;
    if (format === "rating") return value.toFixed(1);
    return value.toString();
  };

  const formatSubValue = (stat: (typeof stats)[0]) => {
    if (stat.format === "currency") {
      return `+${stat.subValue.toLocaleString()} this month`;
    }
    if (stat.format === "bookings" && stat.subValue > 0) {
      return `${stat.subValue} pending approval`;
    }
    if (stat.format === "rating" && stat.subValue > 0) {
      return `From ${stat.subValue} review${stat.subValue !== 1 ? "s" : ""}`;
    }
    if (stat.format === "properties") {
      return `${stat.subValue} total properties`;
    }
    return "";
  };

  // ============================================
  // 🎯 HANDLE RESPOND TO REVIEW
  // ============================================
  const handleRespondToReview = (reviewId: number) => {
    // Navigate to all reviews
    if (reviewId === 0) {
      window.location.href = "/dashboard/reviews";
      return;
    }

    // Find review in dashboard data
    const review = dashboard.recentReviews?.find(
      (r: any) => r.reviewId === reviewId
    );

    if (!review) {
      console.error("❌ Review not found:", reviewId);
      toast.error("Review not found. Please refresh the page.");
      return;
    }

    // Prepare review data for modal
    setSelectedReview({
      reviewId: review.reviewId,
      propertyId: review.propertyId,
      propertyTitle: review.propertyTitle || "Unknown Property",
      propertyImage:
        review.propertyImage ||
        "https://images.unsplash.com/photo-1729720281771-b790dfb6ec7f?w=800&q=80",
      reviewerName: review.reviewerName || "Anonymous",
      reviewerPhoto: review.reviewerPhoto,
      rating: review.rating || 0,
      reviewText: review.reviewText || "",
      reviewDate: review.reviewDate || new Date().toISOString(),
    });

    setIsModalOpen(true);
  };

  // ============================================
  // 📤 SUBMIT RESPONSE HANDLER
  // ============================================
  const handleSubmitResponse = async (responseText: string) => {
    if (!selectedReview) {
      throw new Error("No review selected");
    }

    try {
      // ✅ Call API
      const updatedReview = await api.respondToReview(
        selectedReview.reviewId,
        responseText
      );

      // ✅ Update local dashboard data
      if (dashboard.recentReviews) {
        const reviewIndex = dashboard.recentReviews.findIndex(
          (r: any) => r.reviewId === updatedReview.reviewId
        );

        if (reviewIndex !== -1) {
          dashboard.recentReviews[reviewIndex] = {
            ...dashboard.recentReviews[reviewIndex],
            hasResponse: true,
            ownerResponse: responseText,
          };
        }
      }

      // ✅ Show success message
      toast.success("Response submitted successfully!");

      // ✅ Trigger refresh after short delay
      if (onRefresh) {
        setTimeout(() => {
          onRefresh();
        }, 500);
      }

      // ✅ Dispatch custom event
      window.dispatchEvent(
        new CustomEvent("reviewUpdated", {
          detail: { reviewId: selectedReview.reviewId },
        })
      );

      // ✅ Close modal
      setIsModalOpen(false);
      setSelectedReview(null);
    } catch (error: any) {
      console.error("\n❌ ========================================");
      console.error("❌ RESPONSE SUBMISSION FAILED");
      console.error("❌ Error:", error);
      console.error("❌ Status:", error.status);
      console.error("❌ Message:", error.message);
      console.error("❌ ========================================\n");

      // ✅ Re-throw for modal to handle
      throw error;
    }
  };

  // ============================================
  // 🔒 CLOSE MODAL
  // ============================================
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedReview(null);
  };

  // ============================================
  // 🎨 RENDER
  // ============================================
  return (
    <div className="space-y-6">
      {/* ============================================ */}
      {/* 📊 STATS CARDS */}
      {/* ============================================ */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card
            key={index}
            className="p-6 hover:shadow-lg transition-all duration-200 border-l-4"
            style={{ borderLeftColor: stat.color }}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600 mb-2">
                  {stat.label}
                </p>
                <p className="text-3xl font-bold text-gray-900 mb-1">
                  {formatValue(stat.value, stat.format)}
                </p>
                {formatSubValue(stat) && (
                  <p className="text-xs text-gray-500">
                    {formatSubValue(stat)}
                  </p>
                )}
              </div>
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center transition-transform hover:scale-110"
                style={{ backgroundColor: `${stat.color}20` }}
              >
                <stat.icon className="w-6 h-6" style={{ color: stat.color }} />
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* ============================================ */}
      {/* 🏆 BEST PERFORMING PROPERTY */}
      {/* ============================================ */}
      {dashboard.bestPerformingProperty && (
        <Card className="overflow-hidden hover:shadow-lg transition-shadow">
          <div className="p-5 bg-gradient-to-r from-yellow-50 via-orange-50 to-transparent border-b border-gray-200">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-2xl">🏆</span>
              <h3 className="text-lg font-semibold text-gray-900">
                Best Performing Property
              </h3>
            </div>
            <p className="text-sm text-gray-600 ml-8">
              {dashboard.bestPerformingProperty.performanceReason ||
                "Highest Revenue"}
            </p>
          </div>

          <div className="p-6">
            <div className="flex items-start gap-6">
              {dashboard.bestPerformingProperty.propertyImage && (
                <div className="flex-shrink-0">
                  <img
                    src={dashboard.bestPerformingProperty.propertyImage}
                    alt={dashboard.bestPerformingProperty.propertyTitle}
                    className="w-32 h-32 rounded-lg object-cover ring-2 ring-yellow-200"
                  />
                </div>
              )}

              <div className="flex-1">
                <h4 className="font-semibold text-lg text-gray-900 mb-4">
                  {dashboard.bestPerformingProperty.propertyTitle}
                </h4>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                      Revenue
                    </p>
                    <p className="text-lg font-bold text-[#00BFA6]">
                      {dashboard.bestPerformingProperty.totalRevenue.toLocaleString()}{" "}
                      EGP
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                      Bookings
                    </p>
                    <p className="text-lg font-bold text-gray-900">
                      {dashboard.bestPerformingProperty.totalBookings}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                      Rating
                    </p>
                    <div className="flex items-center gap-1.5">
                      <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                      <p className="text-lg font-bold text-gray-900">
                        {dashboard.bestPerformingProperty.averageRating.toFixed(
                          1
                        )}
                      </p>
                    </div>
                  </div>

                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                      Views
                    </p>
                    <p className="text-lg font-bold text-gray-900">
                      {dashboard.bestPerformingProperty.totalViews.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* ============================================ */}
      {/* 💬 RECENT REVIEWS SECTION */}
      {/* ============================================ */}
      {dashboard.recentReviews && dashboard.recentReviews.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Recent Reviews
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                Latest feedback from your guests
              </p>
            </div>
          </div>

          <RecentReviews
            reviews={dashboard.recentReviews}
            loading={false}
            onRespond={handleRespondToReview}
            language={language}
          />
        </div>
      )}

      {/* ============================================ */}
      {/* 🏠 PROPERTIES SUMMARY */}
      {/* ============================================ */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-medium text-gray-600">
              Total Properties
            </h4>
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <span className="text-xl">🏠</span>
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-900">
            {dashboard.overview?.totalProperties || properties.length}
          </p>
        </Card>

        <Card className="p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-medium text-gray-600">
              Active Properties
            </h4>
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <span className="text-xl">✅</span>
            </div>
          </div>
          <p className="text-3xl font-bold text-[#00BFA6]">
            {dashboard.overview?.activeProperties || 0}
          </p>
        </Card>

        <Card className="p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-medium text-gray-600">
              Pending Approval
            </h4>
            <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
              <span className="text-xl">⏳</span>
            </div>
          </div>
          <p className="text-3xl font-bold text-yellow-600">
            {dashboard.overview?.pendingApprovalProperties || 0}
          </p>
        </Card>
      </div>

      {/* ============================================ */}
      {/* 📝 RESPOND TO REVIEW MODAL */}
      {/* ============================================ */}
      {selectedReview && (
        <RespondToReviewModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          review={selectedReview}
          onSubmit={handleSubmitResponse}
          language={language}
        />
      )}
    </div>
  );
}
