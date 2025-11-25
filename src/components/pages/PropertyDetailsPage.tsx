import { useState, useEffect } from "react";
import { useParams } from "react-router-dom"; // ✅ ADD THIS IMPORT
import { ImageWithFallback } from "../figma/ImageWithFallback";
import { Button } from "../ui/button";
import { Calendar } from "../ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "../ui/dialog";
import {
  Star,
  MapPin,
  Heart,
  Loader2,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Shield,
  Users,
  Check,
} from "lucide-react";
import { format } from "date-fns";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Separator } from "../ui/separator";
import { Alert, AlertDescription } from "../ui/alert";
import { Language, translations } from "../../lib/translations";
import api from "../../../api";
import type {
  PropertyResponse,
  PropertyImageResponse,
  ReviewResponse,
} from "../../../api";

// ✅ REMOVE propertyId from props
interface PropertyDetailsPageProps {
  onNavigate: (page: string, propertyId?: string) => void;
  language?: Language;
}

export function PropertyDetailsPage({
  onNavigate,
  language = "en",
}: PropertyDetailsPageProps) {
  // ✅ GET propertyId FROM URL PARAMS
  const { id: propertyId } = useParams<{ id: string }>();

  console.log("PropertyDetailsPage mounted with propertyId:", propertyId);

  const t = translations[language]?.propertyDetails ||
    translations.en.propertyDetails || {
      checkIn: language === "ar" ? "تسجيل الوصول" : "Check-in",
      checkOut: language === "ar" ? "تسجيل المغادرة" : "Check-out",
      addDate: language === "ar" ? "إضافة تاريخ" : "Add date",
      guestsLabel: language === "ar" ? "الضيوف" : "Guests",
      addGuests: language === "ar" ? "إضافة ضيوف" : "Add guests",
      reserve: language === "ar" ? "احجز الآن" : "Reserve",
      aboutPlace: language === "ar" ? "عن هذا العقار" : "About this place",
      reviews: language === "ar" ? "التقييمات" : "Reviews",
    };

  // State for property data
  const [property, setProperty] = useState<PropertyResponse | null>(null);
  const [images, setImages] = useState<PropertyImageResponse[]>([]);
  const [reviews, setReviews] = useState<ReviewResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);

  // Booking state
  const [checkIn, setCheckIn] = useState<Date | undefined>();
  const [checkOut, setCheckOut] = useState<Date | undefined>();
  const [guests, setGuests] = useState("");
  const [checkingAvailability, setCheckingAvailability] = useState(false);
  const [availabilityError, setAvailabilityError] = useState<string | null>(
    null
  );
  const [creatingBooking, setCreatingBooking] = useState(false);

  // Gallery state
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Load property data on mount
  useEffect(() => {
    if (propertyId) {
      loadPropertyData();
    } else {
      console.error("No property ID provided");
      setError("No property ID provided");
      setLoading(false);
    }
  }, [propertyId]);

  // Check availability when dates change
  useEffect(() => {
    if (property && checkIn && checkOut) {
      checkAvailability();
    } else {
      setAvailabilityError(null);
    }
  }, [checkIn, checkOut, property]);

  // Restore booking intent after login
  useEffect(() => {
    const bookingIntent = localStorage.getItem("bookingIntent");
    if (bookingIntent && property) {
      try {
        const intent = JSON.parse(bookingIntent);
        if (intent.propertyId === propertyId) {
          if (intent.checkIn) setCheckIn(new Date(intent.checkIn));
          if (intent.checkOut) setCheckOut(new Date(intent.checkOut));
          if (intent.guests) setGuests(intent.guests);

          setTimeout(() => {
            alert(
              language === "ar"
                ? "تم استعادة تفاصيل الحجز. يمكنك المتابعة الآن."
                : "Booking details restored. You can continue now."
            );
          }, 500);
        }
      } catch (err) {
        console.error("Error restoring booking intent:", err);
      }
    }
  }, [property, propertyId, language]);

  const loadPropertyData = async () => {
    try {
      setLoading(true);
      setError(null);

      const propertyIdNum = parseInt(propertyId || "0");

      // Load property details
      const propertyData = await api.getProperty(propertyIdNum);
      setProperty(propertyData);

      // Load property images
      try {
        const imagesData = await api.getPropertyImages(propertyIdNum);
        setImages(imagesData.sort((a, b) => a.imageOrder - b.imageOrder));
      } catch (imgError) {
        console.error("Error loading images:", imgError);
      }

      // Load reviews
      try {
        const reviewsResponse = await api.getPropertyReviews(propertyIdNum, {
          page: 0,
          size: 10,
        });
        if (reviewsResponse && Array.isArray(reviewsResponse.content)) {
          setReviews(reviewsResponse.content);
        } else if (Array.isArray(reviewsResponse)) {
          setReviews(reviewsResponse);
        } else {
          setReviews([]);
        }
      } catch (reviewError) {
        console.error("Error loading reviews:", reviewError);
        setReviews([]);
      }

      // Check if property is favorited
      try {
        const favoriteCheck = await api.checkFavorite(propertyIdNum);
        setIsFavorite(favoriteCheck.isFavorited);
      } catch (favError) {
        setIsFavorite(false);
      }
    } catch (err: any) {
      console.error("Error loading property:", err);
      setError(err.message || "Failed to load property details");
    } finally {
      setLoading(false);
    }
  };

  const checkAvailability = async () => {
    if (!property || !checkIn || !checkOut) return;

    try {
      setCheckingAvailability(true);
      setAvailabilityError(null);

      const response = await api.checkAvailability(
        property.propertyId,
        checkIn.toISOString().split("T")[0],
        checkOut.toISOString().split("T")[0]
      );

      if (!response.available) {
        setAvailabilityError(
          language === "ar"
            ? "العقار غير متاح في هذه التواريخ"
            : "Property not available for selected dates"
        );
      }
    } catch (err: any) {
      console.error("Error checking availability:", err);
      if (err.status === 403 || err.status === 401) {
      }
      setAvailabilityError(null);
    } finally {
      setCheckingAvailability(false);
    }
  };

  // handleReserve function

  const handleReserve = async () => {
    // ✅ FIX: Check authentication FIRST before any validation
    const token = localStorage.getItem("authToken");
    if (!token) {
      // Store booking intent to continue after login
      const bookingIntent = {
        propertyId: propertyId,
        checkIn: checkIn?.toISOString(),
        checkOut: checkOut?.toISOString(),
        guests: guests,
        returnTo: "property-details",
      };
      localStorage.setItem("bookingIntent", JSON.stringify(bookingIntent));

      alert(
        language === "ar"
          ? "يجب تسجيل الدخول أولاً للحجز. سيتم توجيهك لتسجيل الدخول."
          : "You need to login to make a booking. Redirecting to login..."
      );

      onNavigate("login");
      return;
    }

    // NOW validate dates and guests (after auth check)
    if (!checkIn || !checkOut || !guests) {
      alert(
        language === "ar"
          ? "يرجى تحديد تاريخ الوصول والمغادرة وعدد الضيوف"
          : "Please select check-in, check-out dates and number of guests"
      );
      return;
    }

    // Check if available
    if (availabilityError) {
      alert(availabilityError);
      return;
    }

    if (!property) return;

    try {
      setCreatingBooking(true);
      setError(null);

      const bookingData = {
        propertyId: property.propertyId,
        checkInDate: checkIn.toISOString().split("T")[0],
        checkOutDate: checkOut.toISOString().split("T")[0],
        numberOfGuests: parseInt(guests),
        numberOfAdults: parseInt(guests),
        numberOfChildren: 0,
      };

      const booking = await api.createBooking(bookingData);

      // Store booking ID for confirmation page
      localStorage.setItem("pendingBookingId", booking.bookingId.toString());

      // Clear booking intent after successful booking creation
      localStorage.removeItem("bookingIntent");

      // Navigate to confirmation page
      onNavigate("booking-confirmation");
    } catch (err: any) {
      console.error("Error creating booking:", err);

      // Handle specific error cases
      if (err.status === 401 || err.status === 403) {
        // Token might be expired
        localStorage.removeItem("authToken");

        // Store booking intent
        const bookingIntent = {
          propertyId: propertyId,
          checkIn: checkIn?.toISOString(),
          checkOut: checkOut?.toISOString(),
          guests: guests,
          returnTo: "property-details",
        };
        localStorage.setItem("bookingIntent", JSON.stringify(bookingIntent));

        alert(
          language === "ar"
            ? "انتهت صلاحية الجلسة. يرجى تسجيل الدخول مرة أخرى."
            : "Your session has expired. Please login again."
        );

        onNavigate("login");
        return;
      }

      // Show error message
      setError(
        err.message ||
          (language === "ar"
            ? "فشل إنشاء الحجز. يرجى المحاولة مرة أخرى."
            : "Failed to create booking. Please try again.")
      );

      alert(
        err.message ||
          (language === "ar"
            ? "فشل إنشاء الحجز. يرجى المحاولة مرة أخرى."
            : "Failed to create booking. Please try again.")
      );
    } finally {
      setCreatingBooking(false);
    }
  };

  const handleToggleFavorite = async () => {
    if (!property) return;

    // Check if user is logged in
    const token = localStorage.getItem("authToken");
    if (!token) {
      alert(
        language === "ar"
          ? "يرجى تسجيل الدخول أولاً لإضافة العقار للمفضلة"
          : "Please login first to add to favorites"
      );
      onNavigate("login");
      return;
    }

    try {
      if (isFavorite) {
        await api.removeFavorite(property.propertyId);
        setIsFavorite(false);
        alert(
          language === "ar"
            ? "تمت إزالة العقار من المفضلة"
            : "Removed from favorites"
        );
      } else {
        await api.addFavorite(property.propertyId);
        setIsFavorite(true);
        alert(
          language === "ar"
            ? "تمت إضافة العقار إلى المفضلة"
            : "Added to favorites"
        );
      }
    } catch (err: any) {
      console.error("Error toggling favorite:", err);
      if (err.status === 401 || err.status === 403) {
        alert(
          language === "ar" ? "يرجى تسجيل الدخول أولاً" : "Please login first"
        );
        onNavigate("login");
      } else {
        alert(
          language === "ar"
            ? "حدث خطأ. يرجى المحاولة مرة أخرى."
            : "An error occurred. Please try again."
        );
      }
    }
  };

  // Calculate booking details
  const nights =
    checkIn && checkOut
      ? Math.ceil(
          (checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24)
        )
      : 0;

  const pricePerNight = property?.pricePerNight || 0;
  const totalPrice = nights * pricePerNight;
  const serviceFee = Math.round(totalPrice * 0.1);
  const cleaningFee = property?.cleaningFee || 0;
  const finalTotal = totalPrice + serviceFee + cleaningFee;

  // Get property images with fallback
  const propertyImages =
    images.length > 0
      ? images.map((img) => img.imageUrl)
      : property?.coverImage
      ? [property.coverImage]
      : ["https://images.unsplash.com/photo-1729720281771-b790dfb6ec7f"];

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-[#00BFA6] mx-auto mb-4" />
          <p className="text-gray-600">
            {language === "ar" ? "جاري التحميل..." : "Loading..."}
          </p>
        </div>
      </div>
    );
  }

  // Error state
  if (error && !property) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <Alert variant="destructive" className="max-w-md">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {error ||
              (language === "ar"
                ? "لم يتم العثور على العقار"
                : "Property not found")}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!property) return null;

  const propertyTitle = language === "ar" ? property.titleAr : property.titleEn;
  const propertyDescription =
    language === "ar" ? property.descriptionAr : property.descriptionEn;

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Title Section */}
        <div className="mb-6">
          <div className="flex items-start justify-between gap-4">
            <h1 className="text-3xl font-semibold text-[#2B2B2B] mb-2">
              {propertyTitle}
            </h1>
            <Button
              variant="outline"
              size="icon"
              onClick={handleToggleFavorite}
              className="flex-shrink-0"
            >
              <Heart
                className={`w-5 h-5 ${
                  isFavorite ? "fill-[#FF6B6B] text-[#FF6B6B]" : ""
                }`}
              />
            </Button>
          </div>
          <div className="flex flex-wrap items-center gap-4 text-sm">
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 fill-[#2B2B2B] text-[#2B2B2B]" />
              <span className="font-semibold">
                {property.averageRating.toFixed(1)}
              </span>
              <span className="text-gray-600">
                ({property.totalReviews}{" "}
                {language === "ar" ? "تقييم" : "reviews"})
              </span>
            </div>
            <div className="flex items-center gap-1 text-gray-600">
              <MapPin className="w-4 h-4" />
              <span>
                {property.city}, {property.governorate}
              </span>
            </div>
          </div>
        </div>

        {/* Image Gallery */}
        <div className="grid grid-cols-4 gap-2 h-[500px] mb-8 rounded-2xl overflow-hidden">
          <div className="col-span-2 row-span-2">
            <ImageWithFallback
              src={propertyImages[0]}
              alt="Main"
              className="w-full h-full object-cover hover:brightness-95 transition-all cursor-pointer"
              onClick={() => {
                setIsGalleryOpen(true);
                setCurrentImageIndex(0);
              }}
            />
          </div>
          {propertyImages.slice(1, 5).map((img, idx) => (
            <div key={idx}>
              <ImageWithFallback
                src={img}
                alt={`Gallery ${idx + 2}`}
                className="w-full h-full object-cover hover:brightness-95 transition-all cursor-pointer"
                onClick={() => {
                  setIsGalleryOpen(true);
                  setCurrentImageIndex(idx + 1);
                }}
              />
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Property Info */}
            <div>
              <h2 className="text-xl font-semibold text-[#2B2B2B] mb-4">
                {property.propertyType.charAt(0).toUpperCase() +
                  property.propertyType.slice(1)}
              </h2>
              <div className="flex flex-wrap gap-3 text-gray-600">
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  <span>
                    {property.bedrooms}{" "}
                    {language === "ar" ? "غرف نوم" : "bedrooms"}
                  </span>
                </div>
                <span>•</span>
                <span>
                  {property.bathrooms}{" "}
                  {language === "ar" ? "حمامات" : "bathrooms"}
                </span>
                <span>•</span>
                <span>
                  {property.guestsCapacity}{" "}
                  {language === "ar" ? "ضيوف" : "guests"}
                </span>
                {property.areaSqm && (
                  <>
                    <span>•</span>
                    <span>
                      {property.areaSqm}{" "}
                      {language === "ar" ? "متر مربع" : "sqm"}
                    </span>
                  </>
                )}
              </div>
            </div>
            <Separator />
            {/* Description */}
            <div>
              <h3 className="text-xl font-semibold text-[#2B2B2B] mb-4">
                {t.aboutPlace}
              </h3>
              <p className="text-gray-700 leading-relaxed">
                {propertyDescription}
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {property.furnished && (
                  <span className="px-3 py-1 bg-gray-100 rounded-full text-sm flex items-center gap-1">
                    <Check className="w-3 h-3" />
                    {language === "ar" ? "مفروش" : "Furnished"}
                  </span>
                )}
                {property.petsAllowed && (
                  <span className="px-3 py-1 bg-gray-100 rounded-full text-sm flex items-center gap-1">
                    <Check className="w-3 h-3" />
                    {language === "ar"
                      ? "يسمح بالحيوانات الأليفة"
                      : "Pets Allowed"}
                  </span>
                )}
                {property.isVerified && (
                  <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm flex items-center gap-1">
                    <Shield className="w-3 h-3" />
                    {language === "ar" ? "موثق" : "Verified"}
                  </span>
                )}
              </div>
            </div>
            <Separator />
            {/* Reviews Section */}
            {reviews.length > 0 && (
              <div className="space-y-6">
                {/* Reviews Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Star className="w-6 h-6 fill-[#2B2B2B] text-[#2B2B2B]" />
                    <h3 className="text-2xl font-semibold text-[#2B2B2B]">
                      {property.averageRating.toFixed(1)} •{" "}
                      {property.totalReviews}{" "}
                      {language === "ar" ? "تقييم" : "review"}
                      {property.totalReviews !== 1 ? "s" : ""}
                    </h3>
                  </div>
                </div>

                {/* Rating Breakdown */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">
                        {language === "ar" ? "النظافة" : "Cleanliness"}
                      </span>
                      <div className="flex items-center gap-2">
                        <div className="flex gap-0.5">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`w-3 h-3 ${
                                star <=
                                Math.round(reviews[0]?.cleanlinessRating || 0)
                                  ? "fill-[#2B2B2B] text-[#2B2B2B]"
                                  : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-sm font-medium">
                          {reviews[0]?.cleanlinessRating?.toFixed(1) || "N/A"}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">
                        {language === "ar" ? "الدقة" : "Accuracy"}
                      </span>
                      <div className="flex items-center gap-2">
                        <div className="flex gap-0.5">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`w-3 h-3 ${
                                star <=
                                Math.round(reviews[0]?.accuracyRating || 0)
                                  ? "fill-[#2B2B2B] text-[#2B2B2B]"
                                  : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-sm font-medium">
                          {reviews[0]?.accuracyRating?.toFixed(1) || "N/A"}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">
                        {language === "ar" ? "التواصل" : "Communication"}
                      </span>
                      <div className="flex items-center gap-2">
                        <div className="flex gap-0.5">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`w-3 h-3 ${
                                star <=
                                Math.round(reviews[0]?.communicationRating || 0)
                                  ? "fill-[#2B2B2B] text-[#2B2B2B]"
                                  : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-sm font-medium">
                          {reviews[0]?.communicationRating?.toFixed(1) || "N/A"}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">
                        {language === "ar" ? "الموقع" : "Location"}
                      </span>
                      <div className="flex items-center gap-2">
                        <div className="flex gap-0.5">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`w-3 h-3 ${
                                star <=
                                Math.round(reviews[0]?.locationRating || 0)
                                  ? "fill-[#2B2B2B] text-[#2B2B2B]"
                                  : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-sm font-medium">
                          {reviews[0]?.locationRating?.toFixed(1) || "N/A"}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">
                        {language === "ar" ? "القيمة مقابل السعر" : "Value"}
                      </span>
                      <div className="flex items-center gap-2">
                        <div className="flex gap-0.5">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`w-3 h-3 ${
                                star <= Math.round(reviews[0]?.valueRating || 0)
                                  ? "fill-[#2B2B2B] text-[#2B2B2B]"
                                  : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-sm font-medium">
                          {reviews[0]?.valueRating?.toFixed(1) || "N/A"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Individual Reviews */}
                <div className="space-y-6">
                  {reviews.map((review) => (
                    <div
                      key={review.reviewId}
                      className="border-b border-gray-200 pb-6 last:border-0"
                    >
                      <div className="flex gap-4">
                        {/* Reviewer Avatar */}
                        <Avatar className="w-12 h-12">
                          {review.reviewer.profilePhoto ? (
                            <img
                              src={review.reviewer.profilePhoto}
                              alt={`${review.reviewer.firstName} ${review.reviewer.lastName}`}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <AvatarFallback className="bg-[#00BFA6] text-white text-lg font-semibold">
                              {review.reviewer.firstName[0]}
                              {review.reviewer.lastName[0]}
                            </AvatarFallback>
                          )}
                        </Avatar>

                        {/* Review Content */}
                        <div className="flex-1">
                          {/* Reviewer Info */}
                          <div className="flex items-center gap-2 mb-2">
                            <span className="font-semibold text-[#2B2B2B]">
                              {review.reviewer.firstName}{" "}
                              {review.reviewer.lastName}
                            </span>
                            {review.reviewer.verified && (
                              <Shield className="w-4 h-4 text-[#00BFA6]" />
                            )}
                            <span className="text-gray-400">•</span>
                            <span className="text-gray-600 text-sm">
                              {new Date(review.createdAt).toLocaleDateString(
                                language === "ar" ? "ar-EG" : "en-US",
                                {
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                }
                              )}
                            </span>
                          </div>

                          {/* Star Rating */}
                          <div className="flex gap-1 mb-3">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={`w-4 h-4 ${
                                  star <= review.overallRating
                                    ? "fill-[#2B2B2B] text-[#2B2B2B]"
                                    : "text-gray-300"
                                }`}
                              />
                            ))}
                          </div>

                          {/* Review Title */}
                          {review.reviewTitle && (
                            <h4 className="font-semibold text-[#2B2B2B] mb-2">
                              {review.reviewTitle}
                            </h4>
                          )}

                          {/* Review Text */}
                          <p className="text-gray-700 leading-relaxed mb-3">
                            {review.reviewText}
                          </p>

                          {/* Pros and Cons */}
                          {(review.pros || review.cons) && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                              {review.pros && (
                                <div className="bg-green-50 p-3 rounded-lg">
                                  <div className="flex items-center gap-2 mb-2">
                                    <Check className="w-4 h-4 text-green-600" />
                                    <span className="text-sm font-semibold text-green-700">
                                      {language === "ar"
                                        ? "الإيجابيات"
                                        : "Pros"}
                                    </span>
                                  </div>
                                  <p className="text-sm text-gray-700">
                                    {review.pros}
                                  </p>
                                </div>
                              )}
                              {review.cons && (
                                <div className="bg-red-50 p-3 rounded-lg">
                                  <div className="flex items-center gap-2 mb-2">
                                    <AlertCircle className="w-4 h-4 text-red-600" />
                                    <span className="text-sm font-semibold text-red-700">
                                      {language === "ar" ? "السلبيات" : "Cons"}
                                    </span>
                                  </div>
                                  <p className="text-sm text-gray-700">
                                    {review.cons}
                                  </p>
                                </div>
                              )}
                            </div>
                          )}

                          {/* Owner Response */}
                          {review.ownerResponse && (
                            <div className="mt-4 pl-4 border-l-2 border-[#00BFA6] bg-gray-50 p-3 rounded-r-lg">
                              <div className="flex items-center gap-2 mb-2">
                                <span className="text-sm font-semibold text-[#2B2B2B]">
                                  {language === "ar"
                                    ? "رد المالك"
                                    : "Owner's Response"}
                                </span>
                                {review.ownerResponseDate && (
                                  <>
                                    <span className="text-gray-400">•</span>
                                    <span className="text-gray-600 text-xs">
                                      {new Date(
                                        review.ownerResponseDate
                                      ).toLocaleDateString(
                                        language === "ar" ? "ar-EG" : "en-US",
                                        {
                                          year: "numeric",
                                          month: "long",
                                          day: "numeric",
                                        }
                                      )}
                                    </span>
                                  </>
                                )}
                              </div>
                              <p className="text-sm text-gray-700">
                                {review.ownerResponse}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Show More Reviews Button */}
                {property.totalReviews > 3 && reviews.length <= 3 && (
                  <Button
                    variant="outline"
                    className="w-full mt-4"
                    onClick={() => {
                      // You can implement pagination or navigate to a reviews page
                    }}
                  >
                    {language === "ar"
                      ? `عرض جميع التقييمات (${property.totalReviews})`
                      : `Show all ${property.totalReviews} reviews`}
                  </Button>
                )}
              </div>
            )}
            <Separator />
          </div>

          {/* Booking Card - Sticky */}
          <div className="lg:col-span-1">
            <div className="sticky top-28 border border-gray-200 rounded-2xl p-6 shadow-xl">
              <div className="mb-6">
                <div className="flex items-baseline gap-1 mb-1">
                  <span className="text-3xl font-semibold text-[#2B2B2B]">
                    {pricePerNight.toLocaleString()} EGP
                  </span>
                  <span className="text-gray-600">
                    / {language === "ar" ? "ليلة" : "night"}
                  </span>
                </div>
                <div className="flex items-center gap-1 text-sm">
                  <Star className="w-4 h-4 fill-[#2B2B2B] text-[#2B2B2B]" />
                  <span className="font-semibold">
                    {property.averageRating.toFixed(1)}
                  </span>
                  <span className="text-gray-600">
                    ({property.totalReviews}{" "}
                    {language === "ar" ? "تقييم" : "reviews"})
                  </span>
                </div>
              </div>

              {error && (
                <Alert variant="destructive" className="mb-4">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {availabilityError && (
                <Alert variant="destructive" className="mb-4">
                  <AlertDescription>{availabilityError}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-4 mb-6">
                <div className="grid grid-cols-2 gap-2">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="justify-start h-14">
                        <div className="text-left">
                          <div className="text-xs text-gray-500">
                            {t.checkIn}
                          </div>
                          <div className="text-sm">
                            {checkIn ? format(checkIn, "MMM dd") : t.addDate}
                          </div>
                        </div>
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={checkIn}
                        onSelect={setCheckIn}
                        disabled={(date) => date < new Date()}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>

                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="justify-start h-14">
                        <div className="text-left">
                          <div className="text-xs text-gray-500">
                            {t.checkOut}
                          </div>
                          <div className="text-sm">
                            {checkOut ? format(checkOut, "MMM dd") : t.addDate}
                          </div>
                        </div>
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={checkOut}
                        onSelect={setCheckOut}
                        disabled={(date) =>
                          checkIn ? date <= checkIn : date < new Date()
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <Select value={guests} onValueChange={setGuests}>
                  <SelectTrigger className="h-14">
                    <div className="text-left">
                      <div className="text-xs text-gray-500">
                        {t.guestsLabel}
                      </div>
                      <div className="text-sm">
                        <SelectValue placeholder={t.addGuests} />
                      </div>
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    {[...Array(property.guestsCapacity)].map((_, i) => (
                      <SelectItem key={i + 1} value={(i + 1).toString()}>
                        {i + 1} {language === "ar" ? "ضيف" : "Guest"}
                        {i > 0 && "s"}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button
                onClick={handleReserve}
                className="w-full h-12 bg-[#FF6B6B] hover:bg-[#FF5252] text-white"
                size="lg"
                disabled={
                  !checkIn ||
                  !checkOut ||
                  !guests ||
                  checkingAvailability ||
                  creatingBooking ||
                  !!availabilityError
                }
              >
                {/* Normal State */}
                {!creatingBooking && !checkingAvailability && "Reserve"}

                {/* Creating Booking */}
                {creatingBooking && (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    {language === "ar"
                      ? "جاري الحجز..."
                      : "Creating booking..."}
                  </>
                )}

                {/* Checking Availability */}
                {!creatingBooking && checkingAvailability && (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    {language === "ar" ? "جاري التحقق..." : "Checking..."}
                  </>
                )}
              </Button>

              {nights > 0 && (
                <>
                  <p className="text-center text-sm text-gray-600 mt-3">
                    {language === "ar"
                      ? "لن يتم الخصم بعد"
                      : "You won't be charged yet"}
                  </p>

                  <div className="mt-6 space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-700">
                        {pricePerNight.toLocaleString()} EGP × {nights}{" "}
                        {language === "ar" ? "ليالي" : "nights"}
                      </span>
                      <span>{totalPrice.toLocaleString()} EGP</span>
                    </div>
                    {cleaningFee > 0 && (
                      <div className="flex justify-between">
                        <span className="text-gray-700">
                          {language === "ar" ? "رسوم التنظيف" : "Cleaning fee"}
                        </span>
                        <span>{cleaningFee.toLocaleString()} EGP</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-gray-700">
                        {language === "ar" ? "رسوم الخدمة" : "Service fee"}
                      </span>
                      <span>{serviceFee.toLocaleString()} EGP</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-semibold">
                      <span>{language === "ar" ? "الإجمالي" : "Total"}</span>
                      <span>{finalTotal.toLocaleString()} EGP</span>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Image Gallery Dialog */}
      <Dialog open={isGalleryOpen} onOpenChange={setIsGalleryOpen}>
        <DialogContent className="max-w-none w-screen h-screen p-0 gap-0 bg-black border-0 rounded-none">
          <DialogTitle className="sr-only">Property Photo Gallery</DialogTitle>
          <DialogDescription className="sr-only">
            Browse through property photos. Use arrow buttons or thumbnails to
            navigate. Image {currentImageIndex + 1} of {propertyImages.length}.
          </DialogDescription>

          <div className="absolute top-4 left-4 z-10 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
            {currentImageIndex + 1} / {propertyImages.length}
          </div>

          {currentImageIndex > 0 && (
            <button
              onClick={() => setCurrentImageIndex(currentImageIndex - 1)}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white rounded-full p-3 shadow-lg transition-all"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-6 h-6 text-gray-900" />
            </button>
          )}

          {currentImageIndex < propertyImages.length - 1 && (
            <button
              onClick={() => setCurrentImageIndex(currentImageIndex + 1)}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white rounded-full p-3 shadow-lg transition-all"
              aria-label="Next image"
            >
              <ChevronRight className="w-6 h-6 text-gray-900" />
            </button>
          )}

          <div className="w-full h-full flex items-center justify-center p-8 pb-32">
            <ImageWithFallback
              src={propertyImages[currentImageIndex]}
              alt={`Gallery ${currentImageIndex + 1}`}
              className="max-w-full max-h-full object-contain"
            />
          </div>

          <div className="absolute bottom-0 left-0 right-0 bg-black/70 backdrop-blur-sm p-4">
            <div className="flex gap-2 overflow-x-auto max-w-7xl mx-auto">
              {propertyImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentImageIndex(idx)}
                  className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                    currentImageIndex === idx
                      ? "border-[#00BFA6] scale-105"
                      : "border-transparent opacity-60 hover:opacity-100"
                  }`}
                  aria-label={`View image ${idx + 1}`}
                >
                  <ImageWithFallback
                    src={img}
                    alt={`Thumbnail ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
