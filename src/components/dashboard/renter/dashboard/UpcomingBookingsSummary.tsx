import { Card } from "../../../ui/card";
import { Button } from "../../../ui/button";
import { Badge } from "../../../ui/badge";
import { ImageWithFallback } from "../../../figma/ImageWithFallback";
import { BookingResponse } from "../../../../../api";
import { Calendar, MapPin, Clock, ArrowRight } from "lucide-react";

interface UpcomingBookingsSummaryProps {
  bookings: BookingResponse[];
  onViewAll: () => void;
  onViewDetails: (bookingId: number) => void;
}

export function UpcomingBookingsSummary({
  bookings,
  onViewAll,
  onViewDetails,
}: UpcomingBookingsSummaryProps) {
  // ✅ FIX: Filter out bookings without property data
  const validBookings = bookings.filter(
    (b) => b.property && b.property.propertyId
  );
  const upcomingBookings = validBookings.slice(0, 3);

  if (upcomingBookings.length === 0) {
    return null;
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-[#2B2B2B]">Upcoming Trips</h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={onViewAll}
          className="text-[#00BFA6] hover:text-[#00A890]"
        >
          View All <ArrowRight className="w-4 h-4 ml-1" />
        </Button>
      </div>

      <div className="space-y-4">
        {upcomingBookings.map((booking) => {
          // ✅ FIX: Safe property access with fallbacks
          const property = booking.property;
          const propertyTitle =
            property?.titleEn || property?.titleAr || "Property";
          const propertyLocation =
            property?.city && property?.governorate
              ? `${property.city}, ${property.governorate}`
              : "Location";
          // ✅ Use coverImageUrl from backend
          const propertyImage =
            property?.coverImageUrl ||
            "https://images.unsplash.com/photo-1729720281771-b790dfb6ec7f";

          return (
            <div
              key={booking.bookingId}
              className="flex gap-4 p-4 border rounded-lg hover:border-[#00BFA6] transition-colors"
            >
              <div
                className="flex gap-4 flex-1 cursor-pointer"
                onClick={() => onViewAll()} // ✅ Click card = trips tab
              >
                {/* ... existing image and content ... */}

                <div className="w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden">
                  <ImageWithFallback
                    src={propertyImage}
                    alt={propertyTitle}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-[#2B2B2B] mb-1 truncate">
                    {propertyTitle}
                  </h4>

                  <div className="flex items-center gap-1 text-sm text-gray-600 mb-2">
                    <MapPin className="w-3 h-3" />
                    <span className="truncate">{propertyLocation}</span>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 text-xs">
                    <div className="flex items-center gap-1 text-gray-600">
                      <Calendar className="w-3 h-3" />
                      <span>
                        {formatDate(booking.checkInDate)} -{" "}
                        {formatDate(booking.checkOutDate)}
                      </span>
                    </div>

                    <Badge
                      variant="outline"
                      className={`gap-1 ${
                        booking.status === "cancelled_by_renter" ||
                        booking.status === "cancelled_by_owner" ||
                        booking.status === "cancelled"
                          ? "bg-red-50 text-red-700 border-red-200" // ✅ Red for cancelled
                          : booking.status === "confirmed"
                          ? "bg-green-50 text-green-700 border-green-200" // ✅ Green for confirmed
                          : "" // Default for pending
                      }`}
                    >
                      <Clock className="w-3 h-3" />
                      {booking.status === "confirmed"
                        ? "Confirmed"
                        : booking.status === "cancelled_by_renter"
                        ? "Cancelled by You"
                        : booking.status === "cancelled_by_owner"
                        ? "Cancelled by Host"
                        : booking.status === "pending"
                        ? "Pending"
                        : booking.status}
                    </Badge>
                  </div>

                  <p className="text-sm font-semibold text-[#00BFA6] mt-2">
                    {booking.totalPrice.toLocaleString()} EGP
                  </p>
                </div>
              </div>
              {/* Add button for details */}
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onViewDetails(booking.bookingId);
                }}
              >
                Details
              </Button>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
