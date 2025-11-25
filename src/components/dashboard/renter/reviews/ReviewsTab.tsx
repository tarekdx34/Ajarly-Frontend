// src/components/dashboard/renter/reviews/ReviewsTab.tsx - WITH BEAUTIFUL HIGHLIGHT
import { useState, useEffect, useRef } from "react";
import { MessageSquare, Loader2, Star, Clock, CheckCircle } from "lucide-react";
import { Language, translations } from "../../../../lib/translations";
import { Card } from "../../../ui/card";
import { Button } from "../../../ui/button";
import { Badge } from "../../../ui/badge";
import { EmptyState } from "../../shared/components/EmptyState";
import { ReviewCard } from "./ReviewCard";
import { WriteReviewModal } from "./WriteReviewModal";
import api from "../../../../../api";
import type { ReviewResponse, BookingResponse } from "../../../../../api";
import { toast } from "sonner";

interface ReviewsTabProps {
  onNavigate: (page: string, id?: string) => void;
  language: Language;
  highlightBookingId?: number;
}

const TEST_MODE = false;

export function ReviewsTab({
  onNavigate,
  language,
  highlightBookingId,
}: ReviewsTabProps) {
  const t = translations[language];
  const [reviews, setReviews] = useState<ReviewResponse[]>([]);
  const [eligibleBookings, setEligibleBookings] = useState<BookingResponse[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [showWriteReview, setShowWriteReview] = useState(false);
  const [selectedBooking, setSelectedBooking] =
    useState<BookingResponse | null>(null);
  const [editingReview, setEditingReview] = useState<ReviewResponse | null>(
    null
  );

  // ✅ Refs for auto-scrolling
  const reviewRefs = useRef<Map<number, HTMLDivElement>>(new Map());

  useEffect(() => {
    loadData();
  }, []);

  // ✅ ENHANCED: Auto-scroll with beautiful animation
  // BEAUTIFUL HIGHLIGHT EFFECT
  useEffect(() => {
    if (highlightBookingId && reviewRefs.current.size > 0) {
      const element = reviewRefs.current.get(highlightBookingId);

      if (element) {
        // Scroll smoothly
        setTimeout(() => {
          element.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });

          setTimeout(() => {
            // Apply highlight
            element.classList.add("soft-highlight", "ring-2", "ring-[#00BFA6]");

            // Remove highlight after animation
            setTimeout(() => {
              element.classList.remove(
                "soft-highlight",
                "ring-2",
                "ring-[#00BFA6]"
              );
            }, 3200);
          }, 300);
        }, 300);
      }
    }
  }, [highlightBookingId, reviews]);

  const loadData = async () => {
    try {
      setLoading(true);

      const allBookings = await api.getBookings();

      let completedBookings: BookingResponse[];

      if (TEST_MODE) {
        completedBookings = allBookings.filter(
          (b) =>
            b.status === "completed" ||
            b.status === "confirmed" ||
            new Date(b.checkOutDate) < new Date()
        );
      } else {
        completedBookings = allBookings.filter(
          (b) =>
            b.status === "completed" && new Date(b.checkOutDate) < new Date()
        );
      }

      let userReviews: ReviewResponse[] = [];
      try {
        const reviewsData = await api.getMyReviews({ page: 0, size: 100 });
        userReviews = reviewsData.content || [];
      } catch (error: any) {
        if (error.status === 500) {
        } else if (error.status === 404) {
        } else {
          console.error("❌ Error fetching reviews:", error);
        }
      }

      setReviews(userReviews);

      const reviewedBookingIds = new Set(userReviews.map((r) => r.bookingId));

      const pendingReviews = completedBookings.filter(
        (booking) => !reviewedBookingIds.has(booking.bookingId)
      );

      setEligibleBookings(pendingReviews);
    } catch (error: any) {
      console.error("❌ Failed to load reviews data:", error);
      toast.error("Failed to load reviews. Please refresh the page.");
    } finally {
      setLoading(false);
    }
  };

  const handleWriteReview = (booking: BookingResponse) => {
    setSelectedBooking(booking);
    setEditingReview(null);
    setShowWriteReview(true);
  };

  const handleEditReview = (review: ReviewResponse) => {
    if (review.isApproved) {
      toast.error("Cannot edit approved reviews. Please contact support.");
      return;
    }

    let booking = eligibleBookings.find(
      (b) => b.bookingId === review.bookingId
    );

    if (!booking) {
      booking = {
        bookingId: review.bookingId,
        bookingReference: `REV-${review.reviewId}`,
        property: review.property,
        checkInDate: new Date().toISOString(),
        checkOutDate: new Date().toISOString(),
        numberOfGuests: 1,
        numberOfNights: 1,
        totalPrice: 0,
        status: "completed",
      } as BookingResponse;
    }

    setSelectedBooking(booking);
    setEditingReview(review);
    setShowWriteReview(true);
  };

  const handleDeleteReview = async (reviewId: number) => {
    if (
      !confirm(
        "Are you sure you want to delete this review? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      await api.deleteReview(reviewId);
      toast.success("Review deleted successfully");
      loadData();
    } catch (error: any) {
      console.error("Failed to delete review:", error);
      toast.error(error.message || "Failed to delete review");
    }
  };

  const handleReviewSuccess = () => {
    if (selectedBooking) {
      setEligibleBookings((prev) =>
        prev.filter((b) => b.bookingId !== selectedBooking.bookingId)
      );
    }

    toast.success(
      editingReview
        ? "Review updated successfully. Awaiting admin approval."
        : "Review submitted successfully! It will appear after admin approval."
    );

    setShowWriteReview(false);
    setSelectedBooking(null);
    setEditingReview(null);

    loadData();
  };

  const approvedReviews = reviews.filter((r) => r.isApproved);
  const pendingReviews = reviews.filter((r) => !r.isApproved);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 text-[#00BFA6] animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6" dir={language === "ar" ? "rtl" : "ltr"}>
      {/* Add CSS for pulse animation */}
      <style>{`
  @keyframes softHighlight {
    0% {
      transform: scale(1);
      box-shadow: 0 0 0px rgba(0, 191, 166, 0);
    }
    50% {
      transform: scale(1.02);
      box-shadow: 0 0 18px rgba(0, 191, 166, 0.45);
    }
    100% {
      transform: scale(1);
      box-shadow: 0 0 0px rgba(0, 191, 166, 0);
    }
  }

  .soft-highlight {
    animation: softHighlight 1.8s ease-in-out 2;
    transition: all 0.4s ease;
    border-radius: 16px;
    position: relative;
    z-index: 5;
  }
`}</style>

      {/* Eligible Bookings Section */}
      {eligibleBookings.length > 0 && (
        <div className="space-y-3">
          <h3
            className={`text-lg font-semibold text-[#2B2B2B] ${
              language === "ar" ? "text-right" : "text-left"
            }`}
          >
            {t.userDashboard.writeAReview}
          </h3>
          <p
            className={`text-sm text-gray-600 ${
              language === "ar" ? "text-right" : "text-left"
            }`}
          >
            {t.userDashboard.helpOthers}
          </p>
          <div className="space-y-3">
            {eligibleBookings.map((booking) => (
              <Card key={booking.bookingId} className="p-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  <img
                    src={booking.property.coverImage}
                    alt={booking.property.titleEn}
                    className="w-20 h-20 rounded-lg object-cover flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold text-[#2B2B2B] truncate">
                        {booking.property.titleEn}
                      </h4>
                      {TEST_MODE && booking.status === "confirmed" && (
                        <Badge
                          variant="outline"
                          className="text-xs bg-purple-50 text-purple-700 border-purple-200"
                        >
                          Test
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-600">
                      {booking.property.city}, {booking.property.governorate}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(booking.checkInDate).toLocaleDateString(
                        "en-US",
                        { month: "short", day: "numeric" }
                      )}{" "}
                      -{" "}
                      {new Date(booking.checkOutDate).toLocaleDateString(
                        "en-US",
                        { month: "short", day: "numeric", year: "numeric" }
                      )}
                    </p>
                  </div>
                  <Button
                    onClick={() => handleWriteReview(booking)}
                    className="bg-[#00BFA6] hover:bg-[#00A890] gap-2 flex-shrink-0"
                  >
                    <Star className="w-4 h-4" />
                    {t.userDashboard.writeReview}
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Pending Reviews Section */}
      {pendingReviews.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-orange-600" />
            <h3
              className={`text-lg font-semibold text-[#2B2B2B] ${
                language === "ar" ? "text-right" : "text-left"
              }`}
            >
              Pending Approval ({pendingReviews.length})
            </h3>
          </div>
          <p className="text-sm text-gray-600">
            These reviews are waiting for admin approval before being published.
          </p>
          <div className="space-y-4">
            {pendingReviews.map((review) => (
              <div
                key={review.reviewId}
                ref={(el) => {
                  if (el) reviewRefs.current.set(review.reviewId, el);
                }}
                className="transition-all duration-500 rounded-lg"
              >
                <ReviewCard
                  review={review}
                  onEdit={handleEditReview}
                  onDelete={handleDeleteReview}
                  isPending={true}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Approved Reviews Section */}
      {approvedReviews.length > 0 ? (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <h3
              className={`text-lg font-semibold text-[#2B2B2B] ${
                language === "ar" ? "text-right" : "text-left"
              }`}
            >
              {t.userDashboard.publishedReviews} ({approvedReviews.length})
            </h3>
          </div>
          <div className="space-y-4">
            {approvedReviews.map((review) => (
              <div
                key={review.reviewId}
                ref={(el) => {
                  if (el) reviewRefs.current.set(review.reviewId, el);
                }}
                className="transition-all duration-500 rounded-lg"
              >
                <ReviewCard
                  review={review}
                  onEdit={handleEditReview}
                  onDelete={handleDeleteReview}
                  isPending={false}
                />
              </div>
            ))}
          </div>
        </div>
      ) : !eligibleBookings.length && !pendingReviews.length ? (
        <EmptyState
          icon={MessageSquare}
          title={t.userDashboard.noReviews}
          description={t.userDashboard.shareExperiences}
          actionLabel={t.userDashboard.viewTrips}
          onAction={() => onNavigate("trips")}
        />
      ) : null}

      {showWriteReview && selectedBooking && (
        <WriteReviewModal
          booking={selectedBooking}
          existingReview={editingReview}
          onClose={() => {
            setShowWriteReview(false);
            setSelectedBooking(null);
            setEditingReview(null);
          }}
          onSuccess={handleReviewSuccess}
        />
      )}
    </div>
  );
}
