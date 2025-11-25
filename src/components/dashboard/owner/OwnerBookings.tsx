// src/components/dashboard/OwnerBookings.tsx - RESOLVED
import { useState } from "react";
import { Calendar, Check, X, Eye, XCircle } from "lucide-react";
import { Language, translations } from "../../../lib/translations";
import { toast } from "sonner";
import api, { BookingResponse } from "../../../../api";
import { Card } from "../../ui/card";
import { Button } from "../../ui/button";
import { Badge } from "../../ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../ui/table";
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
import { Textarea } from "../../ui/textarea";
import { Label } from "../../ui/label";

interface OwnerBookingsProps {
  bookings: BookingResponse[];
  onBookingUpdated: () => void;
  language: Language;
}

export function OwnerBookings({
  bookings,
  onBookingUpdated,
  language,
}: OwnerBookingsProps) {
  const t = translations[language];
  const [actionBookingId, setActionBookingId] = useState<number | null>(null);
  const [actionType, setActionType] = useState<
    "confirm" | "reject" | "details" | null
  >(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [confirmResponse, setConfirmResponse] = useState("");
  const [processing, setProcessing] = useState(false);
  const [selectedBooking, setSelectedBooking] =
    useState<BookingResponse | null>(null);

  const handleConfirmBooking = async () => {
    if (!actionBookingId) return;

    try {
      setProcessing(true);
      await api.confirmBooking(
        actionBookingId,
        confirmResponse ||
          "Thank you for booking! Looking forward to hosting you."
      );
      toast.success("Booking confirmed successfully");
      setActionBookingId(null);
      setActionType(null);
      setConfirmResponse("");
      onBookingUpdated();
    } catch (error: any) {
      toast.error(error.message || "Failed to confirm booking");
    } finally {
      setProcessing(false);
    }
  };

  const handleRejectBooking = async () => {
    if (!actionBookingId || !rejectionReason.trim()) {
      toast.error("Please provide a rejection reason");
      return;
    }

    try {
      setProcessing(true);
      await api.rejectBooking(actionBookingId, rejectionReason);
      toast.success("Booking rejected");
      setActionBookingId(null);
      setActionType(null);
      setRejectionReason("");
      onBookingUpdated();
    } catch (error: any) {
      toast.error(error.message || "Failed to reject booking");
    } finally {
      setProcessing(false);
    }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      confirmed: "bg-green-100 text-green-700 border-green-200",
      pending: "bg-yellow-100 text-yellow-700 border-yellow-200",
      completed: "bg-blue-100 text-blue-700 border-blue-200",
      cancelled: "bg-red-100 text-red-700 border-red-200",
      rejected: "bg-red-100 text-red-700 border-red-200",
    };
    return (
      colors[status.toLowerCase()] ||
      "bg-gray-100 text-gray-700 border-gray-200"
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // ✅ Helper to safely get property title
  const getPropertyTitle = (booking: BookingResponse) => {
    return (
      booking.property?.titleEn ||
      booking.property?.titleAr ||
      "Untitled Property"
    );
  };

  // ✅ Helper to safely get property location
  const getPropertyLocation = (booking: BookingResponse) => {
    const city = booking.property?.city || "Unknown";
    const governorate = booking.property?.governorate || "";
    return governorate ? `${city}, ${governorate}` : city;
  };

  // ✅ Helper to safely get guest name
  const getGuestName = (booking: BookingResponse) => {
    if (!booking.renter) return "Unknown Guest";
    const firstName = booking.renter.firstName || "";
    const lastName = booking.renter.lastName || "";
    return `${firstName} ${lastName}`.trim() || "Unknown Guest";
  };

  // ✅ Helper to safely get guest phone
  const getGuestPhone = (booking: BookingResponse) => {
    return booking.renter?.phoneNumber || "N/A";
  };

  // ✅ Handle view details
  const handleViewDetails = (booking: BookingResponse) => {
    console.log("📋 Opening booking details:", booking);
    setSelectedBooking(booking);
    setActionType("details");
  };

  // ✅ Format date with fallback
  const formatDateTime = (dateString?: string) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateString;
    }
  };

  if (!bookings || bookings.length === 0) {
    return (
      <div dir={language === "ar" ? "rtl" : "ltr"}>
        <h2
          className={`text-2xl font-semibold text-[#2B2B2B] mb-4 ${
            language === "ar" ? "text-right" : "text-left"
          }`}
        >
          {t.hostDashboard.bookingsManagement}
        </h2>
        <Card className="p-12 text-center">
          <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-[#2B2B2B] mb-2">
            {t.hostDashboard.noBookings}
          </h3>
          <p className="text-gray-600">{t.hostDashboard.bookingsAppear}</p>
        </Card>
      </div>
    );
  }

  return (
    <div dir={language === "ar" ? "rtl" : "ltr"}>
      <div
        className={`flex items-center justify-between mb-4 ${
          language === "ar" ? "flex-row-reverse" : ""
        }`}
      >
        <h2 className="text-2xl font-semibold text-[#2B2B2B]">
          {t.hostDashboard.bookingsManagement}
        </h2>
        <div
          className={`flex gap-2 text-sm ${
            language === "ar" ? "flex-row-reverse" : ""
          }`}
        >
          <Badge variant="outline" className="bg-yellow-50">
            {bookings.filter((b) => b.status === "pending").length}{" "}
            {t.hostDashboard.pending}
          </Badge>
          <Badge variant="outline" className="bg-green-50">
            {bookings.filter((b) => b.status === "confirmed").length}{" "}
            {t.admin.active}
          </Badge>
        </div>
      </div>

      <Card>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead
                  className={language === "ar" ? "text-right" : "text-left"}
                >
                  {t.hostDashboard.bookingRef}
                </TableHead>
                <TableHead
                  className={language === "ar" ? "text-right" : "text-left"}
                >
                  {t.hostDashboard.property}
                </TableHead>
                <TableHead
                  className={language === "ar" ? "text-right" : "text-left"}
                >
                  {t.hostDashboard.guest}
                </TableHead>
                <TableHead
                  className={language === "ar" ? "text-right" : "text-left"}
                >
                  {t.hostDashboard.checkIn}
                </TableHead>
                <TableHead
                  className={language === "ar" ? "text-right" : "text-left"}
                >
                  {t.hostDashboard.checkOut}
                </TableHead>
                <TableHead
                  className={language === "ar" ? "text-right" : "text-left"}
                >
                  {t.hostDashboard.nights}
                </TableHead>
                <TableHead
                  className={language === "ar" ? "text-right" : "text-left"}
                >
                  {t.userDashboard.amount}
                </TableHead>
                <TableHead
                  className={language === "ar" ? "text-right" : "text-left"}
                >
                  {t.userDashboard.status}
                </TableHead>
                <TableHead
                  className={language === "ar" ? "text-right" : "text-left"}
                >
                  {t.admin.actions}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bookings.map((booking) => (
                <TableRow key={booking.bookingId}>
                  <TableCell className="font-medium">
                    {booking.bookingReference || `#${booking.bookingId}`}
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium text-sm">
                        {booking.propertyTitle || "Untitled Property"}
                      </p>
                      <p className="text-xs text-gray-600">
                        {booking.propertyCity || "Unknown"}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="text-sm">
                        {booking.otherPartyName || "Unknown Guest"}
                      </p>
                      <p className="text-xs text-gray-600">
                        {booking.otherPartyPhone || "N/A"}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>{formatDate(booking.checkInDate)}</TableCell>
                  <TableCell>{formatDate(booking.checkOutDate)}</TableCell>
                  <TableCell>{booking.numberOfNights || 0}</TableCell>
                  <TableCell className="font-semibold">
                    {(booking.totalPrice || 0).toLocaleString()}{" "}
                    {booking.currency || "EGP"}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={getStatusColor(booking.status)}
                    >
                      {booking.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      {booking.status === "pending" && (
                        <>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-green-600 hover:text-green-700 hover:bg-green-50"
                            onClick={() => {
                              setActionBookingId(booking.bookingId);
                              setActionType("confirm");
                            }}
                          >
                            <Check className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            onClick={() => {
                              setActionBookingId(booking.bookingId);
                              setActionType("reject");
                            }}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleViewDetails(booking)}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>

      {/* Confirm Booking Dialog */}
      <AlertDialog
        open={actionType === "confirm" && !!actionBookingId}
        onOpenChange={() => {
          setActionBookingId(null);
          setActionType(null);
          setConfirmResponse("");
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {t.hostDashboard.confirmBooking}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {t.hostDashboard.areYouSureConfirm}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="my-4">
            <Label htmlFor="confirmResponse">
              {t.hostDashboard.messageToGuest}
            </Label>
            <Textarea
              id="confirmResponse"
              value={confirmResponse}
              onChange={(e) => setConfirmResponse(e.target.value)}
              placeholder={t.hostDashboard.thankYouMessage}
              rows={3}
              className="mt-1"
            />
          </div>
          <AlertDialogFooter
            className={language === "ar" ? "flex-row-reverse" : ""}
          >
            <AlertDialogCancel disabled={processing}>
              {t.hostDashboard.cancel}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmBooking}
              disabled={processing}
              className="bg-green-600 hover:bg-green-700"
            >
              {processing
                ? t.hostDashboard.confirming
                : t.hostDashboard.confirmBooking}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Reject Booking Dialog */}
      <AlertDialog
        open={actionType === "reject" && !!actionBookingId}
        onOpenChange={() => {
          setActionBookingId(null);
          setActionType(null);
          setRejectionReason("");
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t.hostDashboard.rejectBooking}</AlertDialogTitle>
            <AlertDialogDescription>
              {t.hostDashboard.provideReason}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="my-4">
            <Label htmlFor="rejectionReason">
              {t.hostDashboard.rejectionReason} *
            </Label>
            <Textarea
              id="rejectionReason"
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder={t.hostDashboard.rejectionPlaceholder}
              rows={3}
              className="mt-1"
              required
            />
          </div>
          <AlertDialogFooter
            className={language === "ar" ? "flex-row-reverse" : ""}
          >
            <AlertDialogCancel disabled={processing}>
              {t.hostDashboard.cancel}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleRejectBooking}
              disabled={processing || !rejectionReason.trim()}
              className="bg-red-600 hover:bg-red-700"
            >
              {processing
                ? t.hostDashboard.rejecting
                : t.hostDashboard.rejectBooking}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Booking Details Dialog */}
      <AlertDialog
        open={actionType === "details" && !!selectedBooking}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedBooking(null);
            setActionType(null);
          }
        }}
      >
        <AlertDialogContent className="max-w-xl w-full max-h-[75vh] overflow-hidden p-0">
          {/* Header with Close Button */}
          <div className="sticky top-0 bg-white border-b px-3 py-2 flex items-center justify-between z-10">
            <AlertDialogTitle className="text-base font-semibold">
              Booking Details
            </AlertDialogTitle>
            <button
              onClick={() => {
                setSelectedBooking(null);
                setActionType(null);
              }}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Scrollable Content */}
          <div className="overflow-y-auto max-h-[calc(75vh-60px)] px-3 py-2">
            {selectedBooking && (
              <div className="space-y-3">
                {/* Booking Reference */}
                <div className="flex items-center justify-between pb-2 border-b">
                  <div>
                    <p className="text-xs text-gray-600">Booking Reference</p>
                    <p className="text-sm font-semibold">
                      {selectedBooking.bookingReference ||
                        `#${selectedBooking.bookingId}`}
                    </p>
                  </div>
                  <Badge
                    variant="outline"
                    className={getStatusColor(selectedBooking.status)}
                  >
                    {selectedBooking.status}
                  </Badge>
                </div>

                {/* Property Details */}
                <div>
                  <h3 className="font-semibold text-sm text-[#2B2B2B] mb-2">
                    Property
                  </h3>
                  <div className="bg-gray-50 rounded-lg p-3 space-y-1">
                    <p className="font-medium text-sm">
                      {selectedBooking.propertyTitle || "N/A"}
                    </p>
                    <p className="text-xs text-gray-600">
                      📍 {selectedBooking.propertyCity || "Unknown"}
                    </p>
                    <p className="text-xs text-gray-600">
                      🏠 {selectedBooking.propertyType || "N/A"}
                    </p>
                  </div>
                </div>

                {/* Guest Information */}
                <div>
                  <h3 className="font-semibold text-sm text-[#2B2B2B] mb-2">
                    Guest Information
                  </h3>
                  <div className="bg-gray-50 rounded-lg p-3 space-y-1">
                    <p className="font-medium text-sm">
                      {selectedBooking.otherPartyName || "Unknown Guest"}
                    </p>
                    <p className="text-xs text-gray-600">
                      📞 {selectedBooking.otherPartyPhone || "N/A"}
                    </p>
                  </div>
                </div>

                {/* Booking Details */}
                <div>
                  <h3 className="font-semibold text-sm text-[#2B2B2B] mb-2">
                    Booking Information
                  </h3>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-gray-50 rounded-lg p-2">
                      <p className="text-xs text-gray-600 mb-0.5">Check-in</p>
                      <p className="font-medium text-sm">
                        {formatDate(selectedBooking.checkInDate)}
                      </p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-2">
                      <p className="text-xs text-gray-600 mb-0.5">Check-out</p>
                      <p className="font-medium text-sm">
                        {formatDate(selectedBooking.checkOutDate)}
                      </p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-2">
                      <p className="text-xs text-gray-600 mb-0.5">
                        Number of Nights
                      </p>
                      <p className="font-medium text-sm">
                        {selectedBooking.numberOfNights || 0}
                      </p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-2">
                      <p className="text-xs text-gray-600 mb-0.5">
                        Number of Guests
                      </p>
                      <p className="font-medium text-sm">
                        {selectedBooking.numberOfGuests || 0}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Payment Information */}
                <div>
                  <h3 className="font-semibold text-sm text-[#2B2B2B] mb-2">
                    Payment Details
                  </h3>
                  <div className="bg-gray-50 rounded-lg p-3 space-y-1.5">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Subtotal</span>
                      <span>
                        {(selectedBooking.totalPrice || 0).toLocaleString()}{" "}
                        {selectedBooking.currency || "EGP"}
                      </span>
                    </div>
                    <div className="flex justify-between pt-1.5 border-t font-semibold text-base">
                      <span>Total Amount</span>
                      <span className="text-[#00BFA6]">
                        {(selectedBooking.totalPrice || 0).toLocaleString()}{" "}
                        {selectedBooking.currency || "EGP"}
                      </span>
                    </div>
                    {selectedBooking.paymentStatus && (
                      <div className="flex justify-between pt-1.5">
                        <span className="text-gray-600 text-sm">
                          Payment Status
                        </span>
                        <Badge variant="outline" className="capitalize text-xs">
                          {selectedBooking.paymentStatus}
                        </Badge>
                      </div>
                    )}
                  </div>
                </div>

                {/* Special Requests */}
                {selectedBooking.specialRequests && (
                  <div>
                    <h3 className="font-semibold text-[#2B2B2B] mb-3">
                      Special Requests
                    </h3>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-sm text-gray-700">
                        {selectedBooking.specialRequests}
                      </p>
                    </div>
                  </div>
                )}

                {/* Owner Response (if confirmed) */}
                {selectedBooking.ownerResponse && (
                  <div>
                    <h3 className="font-semibold text-[#2B2B2B] mb-3">
                      Your Response
                    </h3>
                    <div className="bg-green-50 rounded-lg p-4">
                      <p className="text-sm text-gray-700">
                        {selectedBooking.ownerResponse}
                      </p>
                    </div>
                  </div>
                )}

                {/* Rejection Reason (if rejected) */}
                {selectedBooking.rejectionReason && (
                  <div>
                    <h3 className="font-semibold text-[#2B2B2B] mb-3">
                      Rejection Reason
                    </h3>
                    <div className="bg-red-50 rounded-lg p-4">
                      <p className="text-sm text-gray-700">
                        {selectedBooking.rejectionReason}
                      </p>
                    </div>
                  </div>
                )}

                {/* Timeline */}
                <div>
                  <h3 className="font-semibold text-sm text-[#2B2B2B] mb-2">
                    Timeline
                  </h3>
                  <div className="bg-gray-50 rounded-lg p-3 space-y-1.5">
                    {selectedBooking.requestedAt && (
                      <div className="flex items-center gap-2 text-xs">
                        <span className="w-1.5 h-1.5 rounded-full bg-gray-400"></span>
                        <span className="text-gray-600">
                          Requested:{" "}
                          {formatDateTime(selectedBooking.requestedAt)}
                        </span>
                      </div>
                    )}
                    {selectedBooking.confirmedAt && (
                      <div className="flex items-center gap-2 text-xs">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                        <span className="text-green-600">
                          Confirmed:{" "}
                          {formatDateTime(selectedBooking.confirmedAt)}
                        </span>
                      </div>
                    )}
                    {selectedBooking.cancelledAt && (
                      <div className="flex items-center gap-2 text-xs">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                        <span className="text-red-600">
                          Cancelled:{" "}
                          {formatDateTime(selectedBooking.cancelledAt)}
                        </span>
                      </div>
                    )}
                    {selectedBooking.expiresAt && (
                      <div className="flex items-center gap-2 text-xs">
                        <span className="w-1.5 h-1.5 rounded-full bg-orange-400"></span>
                        <span className="text-gray-600">
                          Expires: {formatDateTime(selectedBooking.expiresAt)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer with Actions */}
          {selectedBooking?.status === "pending" && (
            <div className="sticky bottom-0 bg-white border-t px-6 py-4 flex gap-3 justify-end">
              <Button
                variant="outline"
                onClick={() => {
                  setActionBookingId(selectedBooking.bookingId);
                  setActionType("reject");
                  setSelectedBooking(null);
                }}
                className="bg-red-50 text-red-700 hover:bg-red-100"
              >
                <X className="w-4 h-4 mr-2" />
                Reject
              </Button>
              <Button
                onClick={() => {
                  setActionBookingId(selectedBooking.bookingId);
                  setActionType("confirm");
                  setSelectedBooking(null);
                }}
                className="bg-green-600 hover:bg-green-700"
              >
                <Check className="w-4 h-4 mr-2" />
                Confirm
              </Button>
            </div>
          )}
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
