// src/components/PropertyCard.tsx - النسخة النهائية
import { Heart, Star } from "lucide-react";
import { useState, useEffect } from "react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { useFavorites } from "../contexts/FavoritesContext";
import { PropertyResponse } from "../../api";
import { toast } from "sonner";
import api from "../../api";

interface PropertyCardProps {
  property: PropertyResponse;
  onNavigate: (page: string, id?: string) => void;
  language?: string;
  showFavorite?: boolean;
}

export function PropertyCard({
  property,
  onNavigate,
  language = "en",
  showFavorite = false,
}: PropertyCardProps) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const [isToggling, setIsToggling] = useState(false);
  const [thumbnail, setThumbnail] = useState<string>("");
  const [loadingImage, setLoadingImage] = useState(true);

  // Extract data from property object
  const displayTitle = language === "ar" ? property.titleAr : property.titleEn;
  const displayLocation = `${property.city}, ${property.governorate}`;
  const displayRating = property.averageRating || 0;
  const displayReviews = property.totalReviews || 0;
  const displayPrice = property.pricePerNight || 0;
  const isPropertyFavorite = isFavorite(property.propertyId);

  // Fetch the first image from the property
  useEffect(() => {
    const fetchThumbnail = async () => {
      try {
        setLoadingImage(true);
        const imagesData = await api.getPropertyImages(property.propertyId);

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
  }, [property.propertyId]);

  const handleFavoriteClick = async (e: React.MouseEvent) => {
    e.stopPropagation();

    // ✅ Prevent multiple clicks
    if (isToggling) {
      return;
    }

    if (!showFavorite) {
      toast.error(
        language === "ar"
          ? "يجب تسجيل الدخول أولاً"
          : "Please login to save favorites"
      );
      return;
    }

    try {
      setIsToggling(true);
      await toggleFavorite(property);
    } catch (error) {
      console.error("Error toggling favorite:", error);
    } finally {
      setIsToggling(false);
    }
  };

  return (
    <div
      className="group cursor-pointer"
      onClick={() =>
        onNavigate("property-details", String(property.propertyId))
      }
    >
      <div className="relative overflow-hidden rounded-2xl aspect-[4/3] mb-3 bg-gray-200">
        {loadingImage ? (
          <div className="w-full h-full flex items-center justify-center">
            <div className="animate-pulse text-gray-400">Loading...</div>
          </div>
        ) : (
          <ImageWithFallback
            src={thumbnail}
            alt={displayTitle}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
          />
        )}
        {showFavorite && (
          <button
            onClick={handleFavoriteClick}
            disabled={isToggling}
            className={`absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-sm rounded-full transition-all z-10 ${
              isToggling
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-white hover:scale-110"
            }`}
          >
            <Heart
              className={`w-5 h-5 transition-all ${
                isPropertyFavorite
                  ? "fill-[#FF6B6B] text-[#FF6B6B]"
                  : "text-gray-700 hover:text-[#FF6B6B]"
              } ${isToggling ? "animate-pulse" : ""}`}
            />
          </button>
        )}
      </div>

      <div className="space-y-1">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-[#2B2B2B] line-clamp-1">
            {displayTitle}
          </h3>
          {displayRating > 0 && (
            <div className="flex items-center gap-1 flex-shrink-0">
              <Star className="w-4 h-4 fill-[#2B2B2B] text-[#2B2B2B]" />
              <span className="text-sm">{displayRating.toFixed(1)}</span>
            </div>
          )}
        </div>
        <p className="text-sm text-gray-600">{displayLocation}</p>
        {displayReviews > 0 && (
          <p className="text-sm text-gray-500">
            {displayReviews} {displayReviews === 1 ? "review" : "reviews"}
          </p>
        )}
        <div className="pt-1">
          <span className="font-semibold text-[#2B2B2B]">
            {displayPrice.toLocaleString("en-US", { maximumFractionDigits: 0 })}{" "}
            EGP
          </span>
          <span className="text-gray-600"> / night</span>
        </div>
      </div>
    </div>
  );
}
