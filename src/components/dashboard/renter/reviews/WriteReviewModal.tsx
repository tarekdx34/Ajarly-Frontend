// src/components/dashboard/renter/reviews/WriteReviewModal.tsx - FINAL FIXED VERSION
import { useState, useEffect } from "react";
import { Loader2, AlertCircle, Calendar, MapPin, X } from "lucide-react";
import { Button } from "../../../ui/button";
import { Label } from "../../../ui/label";
import { Input } from "../../../ui/input";
import { Textarea } from "../../../ui/textarea";
import { StarRating } from "./StarRating";
import api from "../../../../../api";
import type {
  BookingResponse,
  ReviewResponse,
  ReviewCreateRequest,
} from "../../../../../api";

interface WriteReviewModalProps {
  booking: BookingResponse;
  existingReview?: ReviewResponse | null;
  onClose: () => void;
  onSuccess: () => void;
}

export function WriteReviewModal({
  booking,
  existingReview,
  onClose,
  onSuccess,
}: WriteReviewModalProps) {
  const [formData, setFormData] = useState<ReviewCreateRequest>({
    bookingId: booking.bookingId,
    overallRating: 0,
    cleanlinessRating: 0,
    accuracyRating: 0,
    communicationRating: 0,
    locationRating: 0,
    valueRating: 0,
    reviewTitle: "",
    reviewText: "",
    pros: "",
    cons: "",
  });

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [thumbnail, setThumbnail] = useState<string>("");
  const [loadingImage, setLoadingImage] = useState(true);

  // Fetch the first image from the property
  useEffect(() => {
    const fetchThumbnail = async () => {
      try {
        setLoadingImage(true);
        const imagesData = await api.getPropertyImages(
          booking.property.propertyId
        );

        if (imagesData && imagesData.length > 0) {
          // Sort by imageOrder and get the first image
          const sortedImages = imagesData.sort(
            (a, b) => a.imageOrder - b.imageOrder
          );
          setThumbnail(sortedImages[0].imageUrl);
        } else {
          // Fallback to default image if no photos
          setThumbnail(
            `https://images.unsplash.com/photo-1729720281771-b790dfb6ec7f?w=400`
          );
        }
      } catch (error) {
        console.error("Error fetching thumbnail:", error);
        // Use fallback image on error
        setThumbnail(
          `https://images.unsplash.com/photo-1729720281771-b790dfb6ec7f?w=400`
        );
      } finally {
        setLoadingImage(false);
      }
    };

    fetchThumbnail();
  }, [booking.property.propertyId]);

  // Pre-fill form if editing existing review
  useEffect(() => {
    if (existingReview) {
      setFormData({
        bookingId: existingReview.bookingId,
        overallRating: existingReview.overallRating,
        cleanlinessRating: existingReview.cleanlinessRating,
        accuracyRating: existingReview.accuracyRating,
        communicationRating: existingReview.communicationRating,
        locationRating: existingReview.locationRating,
        valueRating: existingReview.valueRating,
        reviewTitle: existingReview.reviewTitle,
        reviewText: existingReview.reviewText,
        pros: existingReview.pros || "",
        cons: existingReview.cons || "",
      });
    }
  }, [existingReview]);

  const handleSubmit = async () => {
    // Validation
    if (formData.overallRating === 0) {
      setError("Please provide an overall rating");
      return;
    }

    if (
      formData.cleanlinessRating === 0 ||
      formData.accuracyRating === 0 ||
      formData.communicationRating === 0 ||
      formData.locationRating === 0 ||
      formData.valueRating === 0
    ) {
      setError("Please rate all categories");
      return;
    }

    if (!formData.reviewTitle.trim()) {
      setError("Please provide a review title");
      return;
    }

    if (!formData.reviewText.trim() || formData.reviewText.length < 20) {
      setError("Please write a review (minimum 20 characters)");
      return;
    }

    try {
      setSubmitting(true);
      setError("");

      if (existingReview) {
        await api.updateReview(existingReview.reviewId, formData);
      } else {
        await api.createReview(formData);
      }

      onSuccess();
    } catch (err: any) {
      console.error("Failed to submit review:", err);
      setError(err.message || "Failed to submit review. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  // Calculate average of detailed ratings
  const detailedRatingsAvg = (
    (formData.cleanlinessRating +
      formData.accuracyRating +
      formData.communicationRating +
      formData.locationRating +
      formData.valueRating) /
    5
  ).toFixed(1);

  const propertyTitle = booking.property.titleEn || booking.property.titleAr;
  const propertyLocation = `${booking.property.city}, ${booking.property.governorate}`;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      {/* Modal Container with Flex Column - Smaller max height for better scrolling */}
      <div
        className="bg-white rounded-xl w-full max-w-2xl flex flex-col my-8"
        style={{ maxHeight: "calc(100vh - 4rem)" }}
      >
        {/* Fixed Header */}
        <div className="flex-shrink-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-xl sticky top-0 z-10">
          <div>
            <h2 className="text-2xl font-semibold text-[#2B2B2B]">
              {existingReview ? "Edit Review" : "Write a Review"}
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Help others by sharing your experience
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0"
            disabled={submitting}
            type="button"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
          {/* Property Info */}
          <div className="flex gap-4 p-4 bg-gray-50 rounded-lg">
            <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 bg-gray-200">
              {loadingImage ? (
                <div className="w-full h-full flex items-center justify-center">
                  <Loader2 className="w-5 h-5 text-gray-400 animate-spin" />
                </div>
              ) : (
                <img
                  src={thumbnail}
                  alt={propertyTitle}
                  className="w-full h-full object-cover"
                />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-[#2B2B2B] truncate">
                {propertyTitle}
              </h3>
              <p className="text-sm text-gray-600 flex items-center gap-1">
                <MapPin className="w-3 h-3 flex-shrink-0" />
                <span className="truncate">{propertyLocation}</span>
              </p>
              <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                <Calendar className="w-3 h-3 flex-shrink-0" />
                {new Date(booking.checkInDate).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })}{" "}
                -{" "}
                {new Date(booking.checkOutDate).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </p>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-start gap-2">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {/* Overall Rating */}
          <div>
            <Label className="text-base">Overall Rating *</Label>
            <p className="text-sm text-gray-600 mb-2">
              How was your overall experience?
            </p>
            <div className="flex items-center gap-3">
              <StarRating
                rating={formData.overallRating}
                onRatingChange={(rating) =>
                  setFormData({ ...formData, overallRating: rating })
                }
                size="lg"
              />
              <span className="text-2xl font-semibold text-gray-700">
                {formData.overallRating > 0
                  ? formData.overallRating.toFixed(1)
                  : "-"}
              </span>
            </div>
          </div>

          {/* Detailed Ratings */}
          <div className="space-y-3">
            <Label className="text-base">Rate Your Experience *</Label>
            <p className="text-sm text-gray-600 mb-2">
              Help others by rating specific aspects of your stay
            </p>

            {[
              {
                key: "cleanlinessRating" as const,
                label: "Cleanliness",
                description: "Was the property clean and well-maintained?",
              },
              {
                key: "accuracyRating" as const,
                label: "Accuracy",
                description: "Did the listing match the description?",
              },
              {
                key: "communicationRating" as const,
                label: "Communication",
                description: "How responsive was the host?",
              },
              {
                key: "locationRating" as const,
                label: "Location",
                description: "Was the location convenient?",
              },
              {
                key: "valueRating" as const,
                label: "Value for Money",
                description: "Was it worth the price?",
              },
            ].map(({ key, label, description }) => (
              <div
                key={key}
                className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0"
              >
                <div className="flex-1 pr-4">
                  <p className="text-sm font-medium text-gray-900">{label}</p>
                  <p className="text-xs text-gray-500">{description}</p>
                </div>
                <div className="flex-shrink-0">
                  <StarRating
                    rating={formData[key]}
                    onRatingChange={(rating) =>
                      setFormData({ ...formData, [key]: rating })
                    }
                  />
                </div>
              </div>
            ))}

            <div className="flex justify-between items-center pt-3 border-t border-gray-200">
              <span className="text-sm text-gray-600">Average Rating:</span>
              <span className="text-lg font-semibold text-[#00BFA6]">
                {detailedRatingsAvg}
              </span>
            </div>
          </div>

          {/* Review Title */}
          <div>
            <Label htmlFor="reviewTitle">Review Title *</Label>
            <p className="text-sm text-gray-600 mb-2">
              Summarize your experience in a few words
            </p>
            <Input
              id="reviewTitle"
              value={formData.reviewTitle}
              onChange={(e) =>
                setFormData({ ...formData, reviewTitle: e.target.value })
              }
              placeholder="e.g., Amazing stay with beautiful views!"
              maxLength={100}
              disabled={submitting}
            />
            <p className="text-xs text-gray-500 mt-1">
              {formData.reviewTitle.length}/100 characters
            </p>
          </div>

          {/* Review Text */}
          <div>
            <Label htmlFor="reviewText">Your Review *</Label>
            <p className="text-sm text-gray-600 mb-2">
              Share details about your stay to help future guests
            </p>
            <Textarea
              id="reviewText"
              value={formData.reviewText}
              onChange={(e) =>
                setFormData({ ...formData, reviewText: e.target.value })
              }
              placeholder="Tell us about your experience... What did you enjoy? What stood out?"
              rows={5}
              disabled={submitting}
              className="resize-none"
            />
            <p className="text-xs text-gray-500 mt-1">
              {formData.reviewText.length} characters (minimum 20)
            </p>
          </div>

          {/* Pros & Cons */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="pros">What You Liked (Optional)</Label>
              <p className="text-sm text-gray-600 mb-2">
                Highlight the positives
              </p>
              <Textarea
                id="pros"
                value={formData.pros}
                onChange={(e) =>
                  setFormData({ ...formData, pros: e.target.value })
                }
                placeholder="e.g., Great location, Clean, Friendly host..."
                rows={3}
                disabled={submitting}
                className="resize-none"
              />
            </div>
            <div>
              <Label htmlFor="cons">Areas for Improvement (Optional)</Label>
              <p className="text-sm text-gray-600 mb-2">
                Constructive feedback
              </p>
              <Textarea
                id="cons"
                value={formData.cons}
                onChange={(e) =>
                  setFormData({ ...formData, cons: e.target.value })
                }
                placeholder="e.g., WiFi could be faster, Check-in process..."
                rows={3}
                disabled={submitting}
                className="resize-none"
              />
            </div>
          </div>

          {/* Terms Note */}
          <p className="text-xs text-gray-500 text-center pt-2">
            By submitting a review, you agree to our{" "}
            <button type="button" className="text-[#00BFA6] hover:underline">
              Review Guidelines
            </button>
            . Reviews are subject to moderation.
          </p>
        </div>

        {/* Fixed Footer - Sticky at bottom */}
        <div className="flex-shrink-0 border-t border-gray-200 px-6 py-4 bg-gray-50 rounded-b-xl sticky bottom-0">
          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={submitting}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleSubmit}
              disabled={submitting}
              className="flex-1 bg-[#00BFA6] hover:bg-[#00A890]"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  {existingReview ? "Updating..." : "Submitting..."}
                </>
              ) : existingReview ? (
                "Update Review"
              ) : (
                "Submit Review"
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
