import { useState, useEffect } from "react";
import { ImageWithFallback } from "../../figma/ImageWithFallback";
import { PopularLocation } from "../../../../api";
import { Language } from "../../../lib/translations";
import api from "../../../../api";

interface PopularLocationsProps {
  t: any;
  language: Language;
  locations: PopularLocation[];
  loading: boolean;
  onNavigate: (page: string) => void;
}

interface LocationImage {
  governorate: string;
  city: string;
  imageUrl: string;
}

export function PopularLocations({
  t,
  language,
  locations,
  loading,
  onNavigate,
}: PopularLocationsProps) {
  const [locationImages, setLocationImages] = useState<LocationImage[]>([]);
  const [imagesLoading, setImagesLoading] = useState(true);

  useEffect(() => {
    const fetchLocationImages = async () => {
      if (!locations || locations.length === 0) {
        setImagesLoading(false);
        return;
      }

      try {
        const imagePromises = locations.map(async (location) => {
          try {
            // Search for properties in this specific location
            const response = await api.advancedSearch({
              governorate: location.governorate,
              city: location.city,
              page: 0,
              size: 1,
              sortBy: "averageRating",
              sortDirection: "DESC",
            });

            // Get the first property ID
            if (response?.properties?.[0]?.propertyId) {
              const propertyId = response.properties[0].propertyId;

              // Fetch property images using the separate images endpoint
              try {
                const imagesData = await api.getPropertyImages(propertyId);

                if (imagesData && imagesData.length > 0) {
                  // Sort by imageOrder and get the first image
                  const sortedImages = imagesData.sort(
                    (a, b) => a.imageOrder - b.imageOrder
                  );
                  const imageUrl = sortedImages[0].imageUrl;

                  return {
                    governorate: location.governorate,
                    city: location.city,
                    imageUrl: imageUrl,
                  };
                } else {
                  console.warn(`⚠️ No images found for ${location.city}`);
                }
              } catch (imgErr) {
                console.error(
                  `❌ Error fetching images for ${location.city}:`,
                  imgErr
                );
              }
            } else {
              console.warn(`⚠️ No properties found for ${location.city}`);
            }
          } catch (err) {
            console.error(`❌ Error fetching image for ${location.city}:`, err);
          }

          // Fallback to default image
          return {
            governorate: location.governorate,
            city: location.city,
            imageUrl:
              "https://images.unsplash.com/photo-1593663094448-9ea85c6e8456?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
          };
        });

        const images = await Promise.all(imagePromises);
        setLocationImages(images);
      } catch (err) {
        console.error("Error fetching location images:", err);
      } finally {
        setImagesLoading(false);
      }
    };

    fetchLocationImages();
  }, [locations]);

  if (loading || imagesLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-64 bg-gray-200 animate-pulse rounded-2xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {locations.map((location) => {
        const locationImage = locationImages.find(
          (img) =>
            img.governorate === location.governorate &&
            img.city === location.city
        );

        return (
          <button
            key={`${location.governorate}-${location.city}`}
            onClick={() => onNavigate("properties")}
            className="group relative overflow-hidden rounded-2xl h-64 hover:shadow-xl transition-shadow"
          >
            <ImageWithFallback
              src={
                locationImage?.imageUrl ||
                "https://images.unsplash.com/photo-1593663094448-9ea85c6e8456?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080"
              }
              alt={location.city}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div
              className={`absolute bottom-6 ${
                language === "ar" ? "right-6" : "left-6"
              } text-white`}
            >
              <h3 className="text-2xl font-semibold mb-1">{location.city}</h3>
              <p className="text-sm text-white/90">
                {location.propertyCount}{" "}
                {language === "ar" ? "عقار" : "properties"}
              </p>
              <p className="text-xs text-white/80 mt-1">
                {language === "ar" ? "من" : "From"} {location.minPrice} EGP
              </p>
            </div>
          </button>
        );
      })}
    </div>
  );
}
