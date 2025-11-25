// src/components/dashboard/renter/trips/TripCard.tsx - FIXED NAVIGATION
import { useState, useEffect } from "react";
import { Card } from "../../../ui/card";
import { Button } from "../../../ui/button";
import { Badge } from "../../../ui/badge";
import { ImageWithFallback } from "../../../figma/ImageWithFallback";
import {
  Calendar,
  MapPin,
  Clock,
  Users,
  Star,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { BookingResponse } from "../../../../../api";
import api from "../../../../../api";

interface TripCardProps {
  booking: BookingResponse;
  type: "upcoming" | "past" | "cancelled";
  onNavigate: (page: string, id?: string) => void;
  onCancel?: (bookingId: number) => void;
  onWriteReview?: (booking: BookingResponse) => void;
  hasReview?: boolean;
  reviewsLoading?: boolean;
}

export function TripCard({
  booking,
  type,
  onNavigate,
  onCancel,
  onWriteReview,
  hasReview,
  reviewsLoading,
}: TripCardProps) {
  const [thumbnail, setThumbnail] = useState<string>("");
  const [loadingImage, setLoadingImage] = useState(true);

  const property = booking.property;

  if (!property || !property.propertyId) return null;

  const propertyTitle = property.titleEn || property.titleAr || "Property";
  const propertyLocation = `${property.city || ""}, ${
    property.governorate || ""
  }`.trim();

  // Fetch the first image from the property
  useEffect(() => {
    const fetchThumbnail = async () => {
      try {
        setLoadingImage(true);
        const imagesData = await api.getPropertyImages(property.propertyId);

        if (imagesData && imagesData.length > 0) {
          const sortedImages = imagesData.sort(
            (a, b) => a.imageOrder - b.imageOrder
          );
          setThumbnail(sortedImages[0].imageUrl);
        } else {
          setThumbnail(
            `https://images.unsplash.com/photo-1729720281771-b790dfb6ec7f?w=400`
          );
        }
      } catch (error) {
        console.error("Error fetching thumbnail:", error);
        setThumbnail(
          `https://images.unsplash.com/photo-1729720281771-b790dfb6ec7f?w=400`
        );
      } finally {
        setLoadingImage(false);
      }
    };

    fetchThumbnail();
  }, [property.propertyId]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getStatusBadge = () => {
    if (type === "upcoming") {
      const isConfirmed = booking.status === "confirmed";
      return (
        <Badge
          variant="outline"
          className={`gap-1 ${
            isConfirmed
              ? "bg-green-50 text-green-700 border-green-200"
              : "bg-yellow-50 text-yellow-700 border-yellow-200"
          }`}
        >
          <Clock className="w-3 h-3" />
          {isConfirmed ? "Confirmed" : "Pending"}
        </Badge>
      );
    }

    if (type === "cancelled") {
      const statusText =
        booking.status === "cancelled_by_renter"
          ? "Cancelled by You"
          : booking.status === "cancelled_by_owner"
          ? "Cancelled by Host"
          : "Cancelled";
      return (
        <Badge
          variant="outline"
          className="gap-1 bg-red-50 text-red-700 border-red-200"
        >
          <AlertCircle className="w-3 h-3" />
          {statusText}
        </Badge>
      );
    }

    return (
      <Badge variant="outline" className="gap-1 bg-gray-100">
        <Clock className="w-3 h-3" />
        Completed
      </Badge>
    );
  };

  // ✅ FIXED: Navigate to reviews tab with bookingId
  const handleViewReview = () => {
    // Navigate using the parent component's navigation handler
    // Pass the bookingId as a special parameter
    onNavigate("reviews", String(booking.bookingId));
  };

  return (
    <Card
      className={`overflow-hidden ${type === "cancelled" ? "opacity-75" : ""}`}
    >
      <div className="flex flex-col md:flex-row gap-4 p-6">
        <div
          className={`w-full md:w-48 h-48 flex-shrink-0 rounded-lg overflow-hidden bg-gray-200 ${
            type === "cancelled" ? "grayscale" : ""
          }`}
        >
          {loadingImage ? (
            <div className="w-full h-full flex items-center justify-center">
              <Loader2 className="w-8 h-8 text-gray-400 animate-spin" />
            </div>
          ) : (
            <ImageWithFallback
              src={thumbnail}
              alt={propertyTitle}
              className="w-full h-full object-cover"
            />
          )}
        </div>

        <div className="flex-1 space-y-3">
          <div>
            <h3 className="text-xl font-semibold text-[#2B2B2B] mb-1">
              {propertyTitle}
            </h3>
            <div className="flex items-center gap-1 text-gray-600">
              <MapPin className="w-4 h-4" />
              <span>{propertyLocation}</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-gray-600" />
              <span>
                {formatDate(booking.checkInDate)} -{" "}
                {formatDate(booking.checkOutDate)}
              </span>
            </div>
            {type === "upcoming" && (
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-gray-600" />
                <span>{booking.numberOfGuests} guests</span>
              </div>
            )}
            {getStatusBadge()}
          </div>

          <div className="text-sm text-gray-600">
            {type === "upcoming" && <p>{booking.numberOfNights} nights</p>}
            <p className="mt-1">
              {type === "cancelled" ? "Original Price: " : "Total: "}
              <span
                className={`font-semibold ${
                  type === "cancelled" ? "line-through" : "text-[#00BFA6]"
                }`}
              >
                {booking.totalPrice.toLocaleString()} EGP
              </span>
            </p>
            {type === "cancelled" && booking.refundAmount > 0 && (
              <p className="mt-1 text-green-600">
                Refunded:{" "}
                <span className="font-semibold">
                  {booking.refundAmount.toLocaleString()} EGP
                </span>
              </p>
            )}
            <p className="mt-1">Confirmation: {booking.bookingReference}</p>
          </div>

          <div className="flex gap-2 pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                onNavigate("property-details", String(property.propertyId))
              }
            >
              View Details
            </Button>

            {type === "upcoming" && (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    onNavigate(
                      "contact-host",
                      String(booking.owner?.userId || "")
                    )
                  }
                >
                  Contact Host
                </Button>
                {onCancel && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-red-600 hover:text-red-700"
                    onClick={() => onCancel(booking.bookingId)}
                  >
                    Cancel Booking
                  </Button>
                )}
              </>
            )}

            {type === "past" &&
              (reviewsLoading ? (
                <Button size="sm" variant="outline" disabled className="gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Checking...
                </Button>
              ) : !hasReview ? (
                <Button
                  size="sm"
                  className="bg-[#00BFA6] hover:bg-[#00A890] gap-2"
                  onClick={() => {
                    if (onWriteReview) {
                      onWriteReview(booking);
                    } else {
                      onNavigate("write-review", String(booking.bookingId));
                    }
                  }}
                >
                  <Star className="w-4 h-4" />
                  Write Review
                </Button>
              ) : (
                <Button
                  size="sm"
                  variant="outline"
                  className="gap-2 border-[#00BFA6] text-[#00BFA6] hover:bg-[#00BFA6] hover:text-white transition-colors"
                  onClick={handleViewReview}
                >
                  <Star className="w-4 h-4 fill-[#00BFA6]" />
                  View Your Review
                </Button>
              ))}

            {type === "cancelled" && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onNavigate("properties")}
              >
                Book Again
              </Button>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}
