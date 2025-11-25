// src/components/dashboard/renter/reviews/ReviewCard.tsx - WITH APPROVAL STATUS
import { Star, Edit, Trash2, CheckCircle, Clock, MessageSquare } from "lucide-react";
import { Card } from "../../../ui/card";
import { Button } from "../../../ui/button";
import { Badge } from "../../../ui/badge";
import type { ReviewResponse } from "../../../../../api";

interface ReviewCardProps {
  review: ReviewResponse;
  onEdit: (review: ReviewResponse) => void;
  onDelete: (reviewId: number) => void;
  isPending?: boolean;
}

export function ReviewCard({ review, onEdit, onDelete, isPending = false }: ReviewCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${
              star <= rating
                ? "fill-yellow-400 text-yellow-400"
                : "text-gray-300"
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <Card className={`p-6 ${isPending ? 'border-orange-200 bg-orange-50/30' : ''}`}>
      <div className="space-y-4">
        {/* Property Info & Status */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex gap-4 flex-1 min-w-0">
            <img
              src={review.property.coverImage}
              alt={review.propertyTitle}
              className="w-20 h-20 rounded-lg object-cover flex-shrink-0"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h4 className="font-semibold text-[#2B2B2B] truncate">
                  {review.propertyTitle}
                </h4>
                {isPending ? (
                  <Badge variant="outline" className="bg-orange-100 text-orange-700 border-orange-300 gap-1 flex-shrink-0">
                    <Clock className="w-3 h-3" />
                    Pending
                  </Badge>
                ) : (
                  <Badge variant="outline" className="bg-green-100 text-green-700 border-green-300 gap-1 flex-shrink-0">
                    <CheckCircle className="w-3 h-3" />
                    Published
                  </Badge>
                )}
              </div>
              <p className="text-sm text-gray-600">
                {review.property.city}, {review.property.governorate}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Reviewed on {formatDate(review.createdAt)}
              </p>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex gap-2 flex-shrink-0">
            {/* Only allow editing if pending */}
            {isPending && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onEdit(review)}
                className="gap-2"
              >
                <Edit className="w-4 h-4" />
                Edit
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={() => onDelete(review.reviewId)}
              className="text-red-600 hover:text-red-700 gap-2"
            >
              <Trash2 className="w-4 h-4" />
              Delete
            </Button>
          </div>
        </div>

        {/* Overall Rating */}
        <div className="flex items-center gap-3">
          {renderStars(review.overallRating)}
          <span className="text-lg font-semibold text-[#2B2B2B]">
            {review.overallRating.toFixed(1)}
          </span>
        </div>

        {/* Review Title & Text */}
        <div>
          <h5 className="font-semibold text-[#2B2B2B] mb-2">
            {review.reviewTitle}
          </h5>
          <p className="text-gray-700 leading-relaxed">
            {review.reviewText}
          </p>
        </div>

        {/* Detailed Ratings */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 pt-2 border-t">
          <div>
            <p className="text-xs text-gray-600 mb-1">Cleanliness</p>
            <div className="flex items-center gap-2">
              {renderStars(review.cleanlinessRating)}
              <span className="text-sm font-medium">{review.cleanlinessRating}</span>
            </div>
          </div>
          <div>
            <p className="text-xs text-gray-600 mb-1">Accuracy</p>
            <div className="flex items-center gap-2">
              {renderStars(review.accuracyRating)}
              <span className="text-sm font-medium">{review.accuracyRating}</span>
            </div>
          </div>
          <div>
            <p className="text-xs text-gray-600 mb-1">Communication</p>
            <div className="flex items-center gap-2">
              {renderStars(review.communicationRating)}
              <span className="text-sm font-medium">{review.communicationRating}</span>
            </div>
          </div>
          <div>
            <p className="text-xs text-gray-600 mb-1">Location</p>
            <div className="flex items-center gap-2">
              {renderStars(review.locationRating)}
              <span className="text-sm font-medium">{review.locationRating}</span>
            </div>
          </div>
          <div>
            <p className="text-xs text-gray-600 mb-1">Value</p>
            <div className="flex items-center gap-2">
              {renderStars(review.valueRating)}
              <span className="text-sm font-medium">{review.valueRating}</span>
            </div>
          </div>
        </div>

        {/* Pros & Cons */}
        {(review.pros || review.cons) && (
          <div className="grid md:grid-cols-2 gap-4 pt-2 border-t">
            {review.pros && (
              <div>
                <p className="text-sm font-semibold text-green-700 mb-2">✓ Pros</p>
                <p className="text-sm text-gray-700">{review.pros}</p>
              </div>
            )}
            {review.cons && (
              <div>
                <p className="text-sm font-semibold text-red-700 mb-2">✗ Cons</p>
                <p className="text-sm text-gray-700">{review.cons}</p>
              </div>
            )}
          </div>
        )}

        {/* Owner Response */}
        {review.ownerResponse && (
          <Card className="p-4 bg-blue-50 border-blue-200">
            <div className="flex items-start gap-3">
              <MessageSquare className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-semibold text-blue-900 mb-1">
                  Response from Host
                </p>
                <p className="text-sm text-blue-800">{review.ownerResponse}</p>
                {review.ownerResponseDate && (
                  <p className="text-xs text-blue-600 mt-2">
                    {formatDate(review.ownerResponseDate)}
                  </p>
                )}
              </div>
            </div>
          </Card>
        )}

        {/* Pending Notice */}
        {isPending && (
          <div className="flex items-start gap-2 p-3 bg-orange-50 border border-orange-200 rounded-lg">
            <Clock className="w-4 h-4 text-orange-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm text-orange-800">
                <strong>Under Review:</strong> This review is pending admin approval. 
                You can still edit or delete it while it's pending.
              </p>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}