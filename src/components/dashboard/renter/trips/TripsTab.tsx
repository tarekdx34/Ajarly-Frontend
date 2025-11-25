// FILE 1: src/components/dashboard/renter/trips/TripsTab.tsx (WITH VIEW REVIEW)
import { useState, useEffect, useCallback } from "react";
import { Loader2, Calendar } from "lucide-react";
import { Language, translations } from "../../../../lib/translations";
import { EmptyState } from "../../shared/components/EmptyState";
import { TripCard } from "./TripCard";
import { CancelDialog } from "./CancelDialog";
import { WriteReviewModal } from "../reviews/WriteReviewModal";
import { useBookings } from "../../../../hooks/useBookings";
import api from "../../../../../api";
import type { BookingResponse } from "../../../../../api";
import { toast } from "sonner";

interface TripsTabProps {
  onNavigate: (page: string, id?: string) => void;
  language: Language;
}

export function TripsTab({ onNavigate, language }: TripsTabProps) {
  const t = translations[language];
  const {
    upcomingBookings,
    pastBookings,
    cancelledBookings,
    loading,
    cancelBooking,
    fetchBookings,
  } = useBookings();

  const [cancelBookingId, setCancelBookingId] = useState<number | null>(null);
  const [existingReviews, setExistingReviews] = useState<Set<number>>(
    new Set()
  );
  const [reviewsLoading, setReviewsLoading] = useState(false);

  // Review modal state
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedBookingForReview, setSelectedBookingForReview] =
    useState<BookingResponse | null>(null);

  const checkExistingReviews = useCallback(async () => {
    try {
      setReviewsLoading(true);
      const myReviews = await api.getMyReviews({ page: 0, size: 100 });
      const reviewedBookingIds = new Set(
        myReviews.content
          .filter((review) => review.isApproved)
          .map((review) => review.bookingId)
      );
      setExistingReviews(reviewedBookingIds);
    } catch (error) {
    } finally {
      setReviewsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBookings();
    checkExistingReviews();
  }, []);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const handleFocus = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        checkExistingReviews();
      }, 1000);
    };

    window.addEventListener("focus", handleFocus);
    return () => {
      window.removeEventListener("focus", handleFocus);
      clearTimeout(timeoutId);
    };
  }, [checkExistingReviews]);

  const handleCancelBooking = async () => {
    if (cancelBookingId) {
      await cancelBooking(cancelBookingId, "Cancelled by user");
      setCancelBookingId(null);
      await fetchBookings();
    }
  };

  const handleOpenReviewModal = (booking: BookingResponse) => {
    setSelectedBookingForReview(booking);
    setShowReviewModal(true);
  };

  const handleReviewSuccess = () => {
    toast.success("Review submitted successfully!");
    setShowReviewModal(false);
    setSelectedBookingForReview(null);
    checkExistingReviews();
  };

  // ✅ NEW: Navigate to reviews tab and scroll to specific review
  const handleViewReview = (bookingId: number) => {
    e.log("👀 Viewing review for booking:", bookingId);
    // Navigate to reviews tab with bookingId as parameter
    onNavigate("reviews", String(bookingId));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 text-[#00BFA6] animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8" dir={language === "ar" ? "rtl" : "ltr"}>
      {/* Upcoming Trips */}
      <div>
        <h2
          className={`text-2xl font-semibold text-[#2B2B2B] mb-4 ${
            language === "ar" ? "text-right" : "text-left"
          }`}
        >
          {t.userDashboard.upcomingTrips}
        </h2>
        {upcomingBookings.length > 0 ? (
          <div className="grid grid-cols-1 gap-4">
            {upcomingBookings.map((booking) => (
              <TripCard
                key={booking.bookingId}
                booking={booking}
                type="upcoming"
                onNavigate={onNavigate}
                onCancel={setCancelBookingId}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={Calendar}
            title={t.userDashboard.noUpcomingTrips}
            description={t.userDashboard.timeToExplore}
            actionLabel={t.userDashboard.startExploring}
            onAction={() => onNavigate("properties")}
          />
        )}
      </div>

      {/* Past Trips */}
      <div>
        <h2
          className={`text-2xl font-semibold text-[#2B2B2B] mb-4 ${
            language === "ar" ? "text-right" : "text-left"
          }`}
        >
          {t.userDashboard.pastTrips}
        </h2>
        {pastBookings.length > 0 ? (
          <div className="grid grid-cols-1 gap-4">
            {pastBookings.map((booking) => (
              <TripCard
                key={booking.bookingId}
                booking={booking}
                type="past"
                onNavigate={onNavigate}
                onWriteReview={handleOpenReviewModal}
                onViewReview={handleViewReview} // ✅ NEW
                hasReview={existingReviews.has(booking.bookingId)}
                reviewsLoading={reviewsLoading}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-600">
            {t.userDashboard.noPastTrips}
          </div>
        )}
      </div>

      {/* Cancelled Trips */}
      <div>
        <h2
          className={`text-2xl font-semibold text-[#2B2B2B] mb-4 ${
            language === "ar" ? "text-right" : "text-left"
          }`}
        >
          {t.userDashboard.cancelledTrips}
        </h2>
        {cancelledBookings.length > 0 ? (
          <div className="grid grid-cols-1 gap-4">
            {cancelledBookings.map((booking) => (
              <TripCard
                key={booking.bookingId}
                booking={booking}
                type="cancelled"
                onNavigate={onNavigate}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-600">
            {t.userDashboard.noCancelledTrips}
          </div>
        )}
      </div>

      <CancelDialog
        open={cancelBookingId !== null}
        onClose={() => setCancelBookingId(null)}
        onConfirm={handleCancelBooking}
      />

      {showReviewModal && selectedBookingForReview && (
        <WriteReviewModal
          booking={selectedBookingForReview}
          existingReview={null}
          onClose={() => {
            setShowReviewModal(false);
            setSelectedBookingForReview(null);
          }}
          onSuccess={handleReviewSuccess}
        />
      )}
    </div>
  );
}
