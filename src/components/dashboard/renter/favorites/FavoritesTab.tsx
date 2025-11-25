// src/components/dashboard/renter/favorites/FavoritesTab.tsx - النسخة النهائية
import { useState, useEffect } from "react";
import { Card } from "../../../ui/card";
import { Language, translations } from "../../../../lib/translations";
import { Button } from "../../../ui/button";
import { Badge } from "../../../ui/badge";
import { ImageWithFallback } from "../../../figma/ImageWithFallback";
import { EmptyState } from "../../shared/components/EmptyState";
import { useFavorites } from "../../../../contexts/FavoritesContext";
import { Heart, MapPin, Loader2, Star } from "lucide-react";
import api from "../../../../../api";

interface FavoritesTabProps {
  onNavigate: (page: string, id?: string) => void;
  language: Language;
}

interface PropertyImage {
  propertyId: number;
  imageUrl: string;
}

export function FavoritesTab({ onNavigate, language }: FavoritesTabProps) {
  const t = translations[language];
  const { favorites, loading, removeFromFavorites } = useFavorites();
  const [removingId, setRemovingId] = useState<number | null>(null);
  const [propertyImages, setPropertyImages] = useState<Map<number, string>>(
    new Map()
  );
  const [loadingImages, setLoadingImages] = useState<Set<number>>(new Set());

  // Fetch images for all favorite properties
  useEffect(() => {
    const fetchAllImages = async () => {
      if (!favorites || favorites.length === 0) return;

      const imageMap = new Map<number, string>();
      const loadingSet = new Set<number>();

      for (const favorite of favorites) {
        const propertyId = favorite.property.propertyId;
        loadingSet.add(propertyId);
        setLoadingImages(new Set(loadingSet));

        try {
          const imagesData = await api.getPropertyImages(propertyId);

          if (imagesData && imagesData.length > 0) {
            // Sort by imageOrder and get the first image
            const sortedImages = imagesData.sort(
              (a, b) => a.imageOrder - b.imageOrder
            );
            imageMap.set(propertyId, sortedImages[0].imageUrl);
          } else {
            // Fallback to default image
            imageMap.set(
              propertyId,
              `https://images.unsplash.com/photo-1729720281771-b790dfb6ec7f?w=400`
            );
          }
        } catch (error) {
          console.error(
            `Error fetching images for property ${propertyId}:`,
            error
          );
          // Use fallback image on error
          imageMap.set(
            propertyId,
            `https://images.unsplash.com/photo-1729720281771-b790dfb6ec7f?w=400`
          );
        } finally {
          loadingSet.delete(propertyId);
          setLoadingImages(new Set(loadingSet));
        }
      }

      setPropertyImages(imageMap);
    };

    fetchAllImages();
  }, [favorites]);

  const handleRemoveFavorite = async (propertyId: number) => {
    try {
      setRemovingId(propertyId);
      await removeFromFavorites(propertyId);
    } catch (err) {
      console.error("Error removing favorite:", err);
    } finally {
      setRemovingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 text-[#00BFA6] animate-spin" />
      </div>
    );
  }

  if (!favorites || favorites.length === 0) {
    return (
      <EmptyState
        icon={Heart}
        title={t.userDashboard.noFavorites}
        description={t.userDashboard.saveFavorites}
        actionLabel={t.userDashboard.browseProperties}
        onAction={() => onNavigate("properties")}
      />
    );
  }

  return (
    <div dir={language === "ar" ? "rtl" : "ltr"}>
      <h2
        className={`text-2xl font-semibold text-[#2B2B2B] mb-4 ${
          language === "ar" ? "text-right" : "text-left"
        }`}
      >
        {t.userDashboard.myFavorites} ({favorites.length})
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {favorites.map((favorite) => {
          const propertyId = favorite.property.propertyId;
          const imageUrl = propertyImages.get(propertyId);
          const isLoadingImage = loadingImages.has(propertyId);

          return (
            <Card
              key={favorite.favoriteId}
              className="overflow-hidden group cursor-pointer hover:shadow-lg transition-all"
            >
              <div
                className="relative aspect-[4/3] overflow-hidden bg-gray-200"
                onClick={() =>
                  onNavigate("property-details", String(propertyId))
                }
              >
                {isLoadingImage ? (
                  <div className="w-full h-full flex items-center justify-center">
                    <Loader2 className="w-8 h-8 text-gray-400 animate-spin" />
                  </div>
                ) : (
                  <ImageWithFallback
                    src={
                      imageUrl ||
                      `https://images.unsplash.com/photo-1729720281771-b790dfb6ec7f?w=400`
                    }
                    alt={
                      favorite.property.titleEn ||
                      favorite.property.titleAr ||
                      "Property"
                    }
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                )}

                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-2 bg-white/90 hover:bg-white z-10"
                  onClick={(e: React.MouseEvent) => {
                    e.stopPropagation();
                    handleRemoveFavorite(propertyId);
                  }}
                  disabled={removingId === propertyId}
                >
                  {removingId === propertyId ? (
                    <Loader2 className="w-5 h-5 animate-spin text-gray-600" />
                  ) : (
                    <Heart className="w-5 h-5 fill-red-500 text-red-500" />
                  )}
                </Button>

                {favorite.property.isFeatured && (
                  <Badge
                    className={`absolute top-2 ${
                      language === "ar" ? "right-2" : "left-2"
                    } bg-[#FFB74D] text-white`}
                  >
                    {t.userDashboard.featured}
                  </Badge>
                )}
              </div>

              <div className="p-4">
                <h3 className="font-semibold text-[#2B2B2B] mb-1 truncate">
                  {favorite.property.titleEn ||
                    favorite.property.titleAr ||
                    "Unknown Property"}
                </h3>

                <div className="flex items-center gap-1 text-sm text-gray-600 mb-2">
                  <MapPin className="w-3 h-3" />
                  <span className="truncate">
                    {favorite.property.city || "Unknown"},{" "}
                    {favorite.property.governorate || "Unknown"}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-semibold text-[#2B2B2B]">
                      {favorite.property.pricePerNight?.toLocaleString() || "0"}{" "}
                      EGP
                    </span>
                    <span className="text-sm text-gray-600">
                      {" "}
                      / {t.userDashboard.perNight}
                    </span>{" "}
                  </div>

                  {favorite.property.averageRating > 0 && (
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium">
                        {favorite.property.averageRating.toFixed(1)}
                      </span>
                      <span className="text-sm text-gray-600">
                        ({favorite.property.totalReviews || 0})
                      </span>
                    </div>
                  )}
                </div>

                {favorite.notes && (
                  <p className="text-xs text-gray-500 mt-2 italic truncate">
                    "{favorite.notes}"
                  </p>
                )}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
