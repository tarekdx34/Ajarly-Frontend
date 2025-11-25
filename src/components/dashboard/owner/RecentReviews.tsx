// src/components/dashboard/owner/RecentReviews.tsx
import { useState } from "react";
import { Star, MessageSquare, User, Calendar, ChevronDown, ChevronUp } from "lucide-react";
import { Card } from "../../ui/card";
import { Button } from "../../ui/button";
import { Badge } from "../../ui/badge";

interface Review {
  reviewId: number;
  propertyId: number;
  propertyTitle: string;
  reviewerName: string;
  reviewerPhoto?: string;
  rating: number;
  reviewText: string;
  reviewDate: string;
  hasResponse: boolean;
  ownerResponse?: string;
}

interface RecentReviewsProps {
  reviews: Review[];
  loading?: boolean;
  onRespond?: (reviewId: number) => void;
  language?: "en" | "ar";
}

export function RecentReviews({ 
  reviews, 
  loading = false,
  onRespond,
  language = "en"
}: RecentReviewsProps) {
  const [expandedReviews, setExpandedReviews] = useState<Set<number>>(new Set());

  const toggleExpand = (reviewId: number) => {
    setExpandedReviews(prev => {
      const newSet = new Set(prev);
      if (newSet.has(reviewId)) {
        newSet.delete(reviewId);
      } else {
        newSet.add(reviewId);
      }
      return newSet;
    });
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${
              star <= rating
                ? "text-yellow-400 fill-yellow-400"
                : "text-gray-300"
            }`}
          />
        ))}
      </div>
    );
  };

  // Loading State
  if (loading) {
    return (
      <Card className="overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="h-6 bg-gray-200 rounded w-1/3 animate-pulse mb-2"></div>
          <div className="h-4 bg-gray-100 rounded w-1/2 animate-pulse"></div>
        </div>
        <div className="divide-y divide-gray-200">
          {[1, 2, 3].map((i) => (
            <div key={i} className="p-6 space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-1/4 animate-pulse"></div>
                  <div className="h-3 bg-gray-100 rounded w-1/3 animate-pulse"></div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="h-3 bg-gray-100 rounded w-full animate-pulse"></div>
                <div className="h-3 bg-gray-100 rounded w-3/4 animate-pulse"></div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    );
  }

  // Empty State
  if (!reviews || reviews.length === 0) {
    return (
      <Card className="p-8 text-center">
        <div className="flex flex-col items-center justify-center space-y-3">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
            <MessageSquare className="w-8 h-8 text-gray-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              No Reviews Yet
            </h3>
            <p className="text-sm text-gray-500">
              Reviews from your guests will appear here
            </p>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-[#00BFA6]/5 to-transparent">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              Recent Reviews
            </h3>
            <p className="text-sm text-gray-500">
              Latest feedback from your guests
            </p>
          </div>
          <Badge variant="outline" className="bg-white">
            {reviews.length} {reviews.length === 1 ? "Review" : "Reviews"}
          </Badge>
        </div>
      </div>

      {/* Reviews List */}
      <div className="divide-y divide-gray-200">
        {reviews.map((review) => {
          const isExpanded = expandedReviews.has(review.reviewId);
          const truncateText = review.reviewText.length > 150;
          const displayText = isExpanded || !truncateText
            ? review.reviewText
            : review.reviewText.slice(0, 150) + "...";

          return (
            <div
              key={review.reviewId}
              className="p-6 hover:bg-gray-50 transition-colors"
            >
              {/* Review Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  {/* Reviewer Avatar */}
                  {review.reviewerPhoto ? (
                    <img
                      src={review.reviewerPhoto}
                      alt={review.reviewerName}
                      className="w-10 h-10 rounded-full object-cover ring-2 ring-gray-100"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#00BFA6] to-[#00A890] flex items-center justify-center">
                      <User className="w-5 h-5 text-white" />
                    </div>
                  )}

                  {/* Reviewer Info */}
                  <div>
                    <h4 className="font-medium text-gray-900">
                      {review.reviewerName}
                    </h4>
                    <div className="flex items-center gap-2 text-xs text-gray-500 mt-0.5">
                      <Calendar className="w-3 h-3" />
                      <span>{review.reviewDate}</span>
                    </div>
                  </div>
                </div>

                {/* Rating */}
                <div className="flex items-center gap-2">
                  {renderStars(review.rating)}
                  <span className="font-semibold text-gray-900">
                    {review.rating.toFixed(1)}
                  </span>
                </div>
              </div>

              {/* Property Title */}
              <div className="mb-3">
                <p className="text-sm font-medium text-gray-600">
                  📍 {review.propertyTitle}
                </p>
              </div>

              {/* Review Text */}
              <div className="mb-3">
                <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">
                  {displayText}
                </p>
                {truncateText && (
                  <button
                    onClick={() => toggleExpand(review.reviewId)}
                    className="text-[#00BFA6] hover:text-[#00A890] text-sm font-medium mt-2 flex items-center gap-1 transition-colors"
                  >
                    {isExpanded ? (
                      <>
                        Show Less <ChevronUp className="w-4 h-4" />
                      </>
                    ) : (
                      <>
                        Read More <ChevronDown className="w-4 h-4" />
                      </>
                    )}
                  </button>
                )}
              </div>

              {/* Owner Response Section */}
              {review.hasResponse && review.ownerResponse ? (
                <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-r-lg">
                  <div className="flex items-start gap-3">
                    <MessageSquare className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-blue-900 mb-1">
                        Your Response
                      </p>
                      <p className="text-sm text-blue-800 leading-relaxed">
                        {review.ownerResponse}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onRespond?.(review.reviewId)}
                  className="gap-2 text-[#00BFA6] border-[#00BFA6] hover:bg-[#00BFA6] hover:text-white transition-colors"
                >
                  <MessageSquare className="w-4 h-4" />
                  Respond to Review
                </Button>
              )}
            </div>
          );
        })}
      </div>

      {/* View All Footer */}
      {reviews.length >= 5 && (
        <div className="p-4 bg-gray-50 border-t border-gray-200 text-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onRespond?.(0)} // Navigate to reviews page
            className="text-[#00BFA6] hover:text-[#00A890] hover:bg-[#00BFA6]/10 font-medium"
          >
            View All Reviews →
          </Button>
        </div>
      )}
    </Card>
  );
}