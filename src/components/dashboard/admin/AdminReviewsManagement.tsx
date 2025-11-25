import { useState, useEffect } from "react";
import {
  CheckCircle,
  XCircle,
  Loader2,
  Eye,
  Clock,
  Trash2,
  RefreshCw,
  Star,
  MessageSquare,
  User,
  MapPin,
  Calendar,
} from "lucide-react";
import { Card } from "../../ui/card";
import { Button } from "../../ui/button";
import { Badge } from "../../ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../../ui/alert-dialog";
import { ImageWithFallback } from "../../figma/ImageWithFallback";
import { toast } from "sonner";
import api from "../../../../api";

// ✅ الحل: تغيير من default export لـ named export
export function AdminReviewsManagement() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "pending" | "approved">(
    "pending"
  );
  const [processingId, setProcessingId] = useState<number | null>(null);
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    reviewId: number;
    title: string;
  }>({ open: false, reviewId: 0, title: "" });
  const [selectedReview, setSelectedReview] = useState<any | null>(null);

  useEffect(() => {
    loadReviews();
  }, [filter]);

  const loadReviews = async () => {
    try {
      setLoading(true);
      const data = await api.getReviewsAdmin({
        page: 0,
        size: 50,
        status: filter === "all" ? undefined : filter,
      });
      setReviews(data.content);
    } catch (error: any) {
      toast.error("Failed to load reviews");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (reviewId: number, title: string) => {
    try {
      setProcessingId(reviewId);
      await api.approveReview(reviewId);
      toast.success(`✅ Review "${title}" approved successfully!`);
      loadReviews();
    } catch (error: any) {
      toast.error(error.message || "Failed to approve review");
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (reviewId: number, title: string) => {
    const reason = prompt("Enter rejection reason (optional):");
    if (reason === null) return;

    try {
      setProcessingId(reviewId);
      await api.rejectReview(reviewId, reason || "Does not meet guidelines");
      toast.success(`❌ Review "${title}" rejected`);
      loadReviews();
    } catch (error: any) {
      toast.error(error.message || "Failed to reject review");
    } finally {
      setProcessingId(null);
    }
  };

  const confirmDelete = async () => {
    try {
      await api.deleteReviewAdmin(deleteDialog.reviewId);
      toast.success("Review deleted successfully");
      loadReviews();
    } catch (error: any) {
      toast.error(error.message || "Failed to delete review");
    } finally {
      setDeleteDialog({ open: false, reviewId: 0, title: "" });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const pendingCount = reviews.filter((r) => !r.isApproved).length;
  const approvedCount = reviews.filter((r) => r.isApproved).length;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 text-[#00BFA6] animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header & Stats */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-[#2B2B2B]">
            Review Management
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Approve, reject, or delete user reviews
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={loadReviews}
          className="gap-2"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Reviews</p>
              <p className="text-2xl font-semibold">{reviews.length}</p>
            </div>
            <MessageSquare className="w-8 h-8 text-gray-400" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pending Approval</p>
              <p className="text-2xl font-semibold text-orange-600">
                {pendingCount}
              </p>
            </div>
            <Clock className="w-8 h-8 text-orange-500" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Approved</p>
              <p className="text-2xl font-semibold text-green-600">
                {approvedCount}
              </p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-500" />
          </div>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        <Button
          variant={filter === "pending" ? "default" : "outline"}
          onClick={() => setFilter("pending")}
          className={`gap-2 ${
            filter === "pending" ? "bg-orange-600 hover:bg-orange-700" : ""
          }`}
        >
          <Clock className="w-4 h-4" />
          Pending ({pendingCount})
        </Button>
        <Button
          variant={filter === "approved" ? "default" : "outline"}
          onClick={() => setFilter("approved")}
          className={`gap-2 ${
            filter === "approved" ? "bg-green-600 hover:bg-green-700" : ""
          }`}
        >
          <CheckCircle className="w-4 h-4" />
          Approved ({approvedCount})
        </Button>
        <Button
          variant={filter === "all" ? "default" : "outline"}
          onClick={() => setFilter("all")}
          className="gap-2"
        >
          <Eye className="w-4 h-4" />
          All ({reviews.length})
        </Button>
      </div>

      {/* Reviews List */}
      {reviews.length === 0 ? (
        <Card className="p-12 text-center">
          <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-[#2B2B2B] mb-2">
            No {filter} reviews found
          </h3>
          <p className="text-gray-600">
            {filter === "pending"
              ? "All reviews have been approved!"
              : "No reviews match this filter"}
          </p>
        </Card>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <Card key={review.reviewId} className="p-6">
              <div className="flex gap-4">
                {/* Property Image */}
                <div className="flex-shrink-0">
                  <ImageWithFallback
                    src={review.property?.coverImage || ""}
                    alt={review.property?.titleEn || "Property"}
                    className="w-24 h-24 rounded-lg object-cover"
                  />
                </div>

                {/* Review Content */}
                <div className="flex-1 space-y-3">
                  {/* Header */}
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-lg">
                          {review.reviewTitle}
                        </h3>
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span className="font-semibold">
                            {review.overallRating}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {review.property?.titleEn || "Unknown Property"}
                        </span>
                        <span>·</span>
                        <span className="flex items-center gap-1">
                          <User className="w-3 h-3" />
                          {review.reviewer?.firstName}{" "}
                          {review.reviewer?.lastName}
                        </span>
                        <span>·</span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {formatDate(review.createdAt)}
                        </span>
                      </div>
                    </div>
                    <Badge
                      variant="outline"
                      className={
                        review.isApproved
                          ? "bg-green-50 text-green-700 border-green-200"
                          : "bg-orange-50 text-orange-700 border-orange-200"
                      }
                    >
                      {review.isApproved ? "✅ Approved" : "⏳ Pending"}
                    </Badge>
                  </div>

                  {/* Detailed Ratings */}
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1">
                      <span className="text-gray-600">Cleanliness:</span>
                      <span className="font-medium">
                        {review.cleanlinessRating}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-gray-600">Communication:</span>
                      <span className="font-medium">
                        {review.communicationRating}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-gray-600">Accuracy:</span>
                      <span className="font-medium">
                        {review.accuracyRating}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-gray-600">Location:</span>
                      <span className="font-medium">
                        {review.locationRating}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-gray-600">Value:</span>
                      <span className="font-medium">{review.valueRating}</span>
                    </div>
                  </div>

                  {/* Review Text */}
                  <p className="text-gray-700 leading-relaxed">
                    {review.reviewText}
                  </p>

                  {/* Pros/Cons */}
                  {(review.pros || review.cons) && (
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      {review.pros && (
                        <div className="bg-green-50 p-3 rounded-lg">
                          <strong className="text-green-800">👍 Pros:</strong>
                          <p className="text-gray-700 mt-1">{review.pros}</p>
                        </div>
                      )}
                      {review.cons && (
                        <div className="bg-red-50 p-3 rounded-lg">
                          <strong className="text-red-800">👎 Cons:</strong>
                          <p className="text-gray-700 mt-1">{review.cons}</p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Owner Response */}
                  {review.ownerResponse && (
                    <div className="bg-blue-50 p-3 rounded-lg text-sm">
                      <strong className="text-blue-800">
                        💬 Owner Response:
                      </strong>
                      <p className="text-gray-700 mt-1">
                        {review.ownerResponse}
                      </p>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex gap-2 pt-2">
                    {!review.isApproved && (
                      <>
                        <Button
                          size="sm"
                          className="bg-green-600 hover:bg-green-700 gap-2"
                          onClick={() =>
                            handleApprove(review.reviewId, review.reviewTitle)
                          }
                          disabled={processingId === review.reviewId}
                        >
                          {processingId === review.reviewId ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <CheckCircle className="w-4 h-4" />
                          )}
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-red-600 hover:bg-red-50 gap-2"
                          onClick={() =>
                            handleReject(review.reviewId, review.reviewTitle)
                          }
                          disabled={processingId === review.reviewId}
                        >
                          <XCircle className="w-4 h-4" />
                          Reject
                        </Button>
                      </>
                    )}
                    <Button
                      size="sm"
                      variant="outline"
                      className="gap-2"
                      onClick={() => setSelectedReview(review)}
                    >
                      <Eye className="w-4 h-4" />
                      View Full
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-red-600 hover:bg-red-50 gap-2"
                      onClick={() =>
                        setDeleteDialog({
                          open: true,
                          reviewId: review.reviewId,
                          title: review.reviewTitle,
                        })
                      }
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={deleteDialog.open}
        onOpenChange={(open) => setDeleteDialog({ ...deleteDialog, open })}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <Trash2 className="w-5 h-5 text-red-600" />
              Delete Review
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete the review "{deleteDialog.title}"?
              This action cannot be undone and will permanently remove the
              review from the platform.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() =>
                setDeleteDialog({ open: false, reviewId: 0, title: "" })
              }
            />
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete Review
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Full Review Modal */}
      {selectedReview && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedReview(null)}
        >
          <Card
            className="max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6"
            onClick={(e: any) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold">Review Details</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedReview(null)}
              >
                ✕
              </Button>
            </div>
            <div className="space-y-4">
              <ImageWithFallback
                src={selectedReview.property?.coverImage || ""}
                alt={selectedReview.property?.titleEn || "Property"}
                className="w-full h-48 object-cover rounded-lg"
              />
              <h4 className="text-lg font-semibold">
                {selectedReview.reviewTitle}
              </h4>
              <p className="text-gray-700">{selectedReview.reviewText}</p>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
