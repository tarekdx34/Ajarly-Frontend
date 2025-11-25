// src/components/dashboard/owner/RespondToReviewModal.tsx - ✅ COMPACT VERSION
import React, { useState, useEffect } from 'react';
import { X, Star, User, AlertCircle } from 'lucide-react';

// ============================================
// TYPES
// ============================================

interface Review {
  reviewId: number;
  propertyId: number;
  propertyTitle: string;
  reviewerName: string;
  reviewerPhoto?: string;
  rating: number;
  reviewText: string;
  reviewDate: string;
  propertyImage?: string;
}

interface RespondToReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  review: Review;
  onSubmit: (response: string) => Promise<void>;
  language?: "en" | "ar";
}

// ============================================
// MAIN COMPONENT
// ============================================

export function RespondToReviewModal({
  isOpen,
  onClose,
  review,
  onSubmit,
  language = "en"
}: RespondToReviewModalProps) {
  const [response, setResponse] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ✅ Reset form when modal opens
  useEffect(() => {
    if (isOpen && review) {
      setResponse("");
      setError(null);
      setIsSubmitting(false);
    }
  }, [isOpen, review?.reviewId]);

  // ============================================
  // 📤 HANDLE SUBMIT
  // ============================================
  const handleSubmit = async () => {
    setError(null);
    const trimmedResponse = response.trim();

    if (!trimmedResponse) {
      setError("Please write a response");
      return;
    }

    if (trimmedResponse.length < 10) {
      setError("Response too short (min 10 characters)");
      return;
    }

    if (trimmedResponse.length > 500) {
      setError("Response too long (max 500 characters)");
      return;
    }

    setIsSubmitting(true);

    try {
      await onSubmit(trimmedResponse);
      setResponse("");
      setError(null);
    } catch (err: any) {
      if (err.status === 401 || err.status === 403) {
        setError("Authentication failed. Please login again.");
      } else if (err.status === 404) {
        setError("Review not found.");
      } else if (err.status === 400) {
        setError(err.message || "Invalid data.");
      } else if (err.status === 500) {
        setError("Server error. Try again later.");
      } else {
        setError(err.message || "An error occurred.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // ============================================
  // 🔒 HANDLE CANCEL
  // ============================================
  const handleCancel = () => {
    if (isSubmitting) return;
    setResponse("");
    setError(null);
    onClose();
  };

  // ============================================
  // ⭐ RENDER STARS
  // ============================================
  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-3.5 h-3.5 ${
              star <= rating
                ? "text-yellow-400 fill-yellow-400"
                : "text-gray-300"
            }`}
          />
        ))}
      </div>
    );
  };

  // ============================================
  // 🎨 RENDER
  // ============================================
  if (!isOpen || !review) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget && !isSubmitting) {
          handleCancel();
        }
      }}
    >
      <div 
        className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ============================================ */}
        {/* 📋 HEADER - COMPACT */}
        {/* ============================================ */}
        <div className="p-4 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Respond to Review
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">
                {review.propertyTitle}
              </p>
            </div>
            <button
              onClick={handleCancel}
              disabled={isSubmitting}
              className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg p-1.5 transition-all disabled:opacity-50"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* ============================================ */}
        {/* 📄 CONTENT - COMPACT */}
        {/* ============================================ */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          
          {/* Guest Review - COMPACT */}
          <div className="space-y-2">
            <div className="flex items-start justify-between gap-3 p-3 bg-blue-50 rounded-lg border border-blue-100">
              <div className="flex items-center gap-2">
                {review.reviewerPhoto ? (
                  <img
                    src={review.reviewerPhoto}
                    alt={review.reviewerName}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-[#00BFA6] flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                  </div>
                )}
                <div>
                  <h4 className="font-medium text-sm text-gray-900">
                    {review.reviewerName}
                  </h4>
                  <p className="text-xs text-gray-500">{review.reviewDate}</p>
                </div>
              </div>
              
              {/* Rating */}
              <div className="flex items-center gap-1.5">
                {renderStars(review.rating)}
                <span className="font-semibold text-sm text-gray-900">
                  {review.rating.toFixed(1)}
                </span>
              </div>
            </div>

            {/* Review Text - COMPACT */}
            <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
              <p className="text-gray-700 text-sm leading-relaxed line-clamp-4">
                {review.reviewText}
              </p>
            </div>
          </div>

          {/* Response Input - COMPACT */}
          <div className="space-y-2">
            <label className="block">
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-medium text-sm text-gray-900">
                  Your Response <span className="text-red-500">*</span>
                </span>
                <span className={`text-xs font-medium ${
                  response.length > 500 
                    ? 'text-red-500' 
                    : response.length > 400 
                    ? 'text-yellow-600' 
                    : 'text-gray-500'
                }`}>
                  {response.length}/500
                </span>
              </div>
              <textarea
                value={response}
                onChange={(e) => {
                  setResponse(e.target.value.slice(0, 500));
                  setError(null);
                }}
                placeholder="Write your response..."
                rows={4}
                disabled={isSubmitting}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#00BFA6] focus:border-transparent outline-none transition-all resize-none text-sm disabled:bg-gray-100 ${
                  error ? 'border-red-300' : 'border-gray-300'
                }`}
                autoFocus
              />
            </label>

            {/* Error Message - COMPACT */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-2 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-red-700 font-medium">{error}</p>
              </div>
            )}

            {/* Tip - COMPACT */}
            {!error && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-2 flex items-start gap-2">
                <span className="text-sm">💡</span>
                <p className="text-xs text-blue-700">
                  Be professional and address any concerns.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* ============================================ */}
        {/* 🎬 FOOTER ACTIONS - COMPACT */}
        {/* ============================================ */}
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center justify-end gap-2">
            <button
              onClick={handleCancel}
              disabled={isSubmitting}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 font-medium hover:bg-gray-100 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={!response.trim() || isSubmitting || response.trim().length < 10}
              className="px-4 py-2 bg-[#00BFA6] text-white rounded-lg text-sm font-medium hover:bg-[#00A890] transition-colors disabled:opacity-50 flex items-center gap-2 min-w-[120px] justify-center"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Submitting...
                </>
              ) : (
                <>✓ Submit</>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}