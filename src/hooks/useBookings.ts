// src/hooks/useBookings.ts
import { useState, useEffect } from "react";
import api, { BookingResponse } from "../../api";
import { toast } from "sonner";

export function useBookings(status?: string) {
  const [bookings, setBookings] = useState<BookingResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchBookings();
  }, [status]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      setError(null);

      // Get bookings list
      const data = await api.getBookings(status);

      // ✅ Fetch full details for each booking
      const bookingsWithDetails = await Promise.all(
        data.map(async (booking) => {
          try {
            return await api.getBooking(booking.bookingId);
          } catch (err) {
            console.error(`Failed to load booking ${booking.bookingId}:`, err);
            return booking; // Return original if fails
          }
        })
      );

      setBookings(bookingsWithDetails);
    } catch (err: any) {
      const errorMessage = err.message || "Failed to load bookings";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const getUpcomingBookings = async () => {
    try {
      const data = await api.getUpcomingBookings();
      return data;
    } catch (err: any) {
      const errorMessage = err.message || "Failed to load upcoming bookings";
      toast.error(errorMessage);
      throw err;
    }
  };

  const cancelBooking = async (bookingId: number, reason: string) => {
    try {
      await api.cancelBooking(bookingId, reason);
      toast.success("Booking cancelled successfully");
      await fetchBookings(); // Refresh bookings
    } catch (err: any) {
      const errorMessage = err.message || "Failed to cancel booking";
      toast.error(errorMessage);
      throw err;
    }
  };

  const getBookingById = async (bookingId: number) => {
    try {
      const data = await api.getBooking(bookingId);
      return data;
    } catch (err: any) {
      const errorMessage = err.message || "Failed to load booking details";
      toast.error(errorMessage);
      throw err;
    }
  };

  // Filter bookings by status
  const upcomingBookings = bookings.filter((b) => {
    const checkInDate = new Date(b.checkInDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // ✅ Debug each booking
    console.log("🔍 Checking booking:", {
      id: b.bookingId,
      status: b.status,
      paymentStatus: b.paymentStatus,
      checkInDate: checkInDate.toISOString(),
      isAfterToday: checkInDate >= today,
      reference: b.bookingReference,
    });

    // ✅ FIXED: More lenient filter
    const isUpcoming = checkInDate >= today;
    const isNotCancelled =
      b.status !== "cancelled" &&
      b.status !== "rejected" &&
      b.status !== "cancelled_by_renter" && // ✅ ADD
      b.status !== "cancelled_by_owner"; // ✅ ADD
    const isPaymentDone =
      b.paymentStatus === "paid" || b.paymentStatus === "completed"; // ✅ FIXED

    const shouldShow = isUpcoming && isNotCancelled && isPaymentDone;

    if (shouldShow) {
      console.log("✅ Including in upcoming:", b.bookingReference);
    } else {
      console.log("❌ Excluding:", b.bookingReference, {
        isUpcoming,
        isNotCancelled,
        isPaymentDone,
      });
    }

    return shouldShow;
  });

  const pastBookings = bookings.filter((b) => {
    const checkOutDate = new Date(b.checkOutDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // ✅ FIXED: Accept 'paid' as well
    const isPaymentDone =
      b.paymentStatus === "paid" || b.paymentStatus === "completed";

    return b.status === "completed" || (checkOutDate < today && isPaymentDone);
  });

  const pendingBookings = bookings.filter((b) => b.status === "pending");

  const cancelledBookings = bookings.filter(
    (b) =>
      b.status === "cancelled" ||
      b.status === "rejected" ||
      b.status === "cancelled_by_renter" || // ✅ ADD
      b.status === "cancelled_by_owner" // ✅ ADD
  );

  return {
    bookings,
    upcomingBookings,
    pastBookings,
    pendingBookings,
    cancelledBookings,
    loading,
    error,
    fetchBookings,
    getUpcomingBookings,
    cancelBooking,
    getBookingById,
  };
}
