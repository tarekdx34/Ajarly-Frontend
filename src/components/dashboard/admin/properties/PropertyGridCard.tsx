// src/components/dashboard/admin/properties/PropertyGridCard.tsx
import { MapPin, Star, Eye, MoreVertical, Trash2, Loader2 } from "lucide-react";
import { Card } from "../../../ui/card";
import { Badge } from "../../../ui/badge";
import { Button } from "../../../ui/button";
import { ImageWithFallback } from "../../../figma/ImageWithFallback";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../../ui/dropdown-menu";
import type { PropertyResponse } from "../../../../../api";
import { useState, useEffect } from "react";
import api from "../../../../../api";

interface PropertyGridCardProps {
  property: PropertyResponse;
  formatCurrency: (amount: number) => string;
  getStatusColor: (status: string | boolean) => string;
  onDelete: (type: string, id: number, name: string) => void;
}

export function PropertyGridCard({
  property,
  formatCurrency,
  getStatusColor,
  onDelete,
}: PropertyGridCardProps) {
  const [thumbnail, setThumbnail] = useState<string>("");
  const [loadingImage, setLoadingImage] = useState(true);

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

  const propertyTitle =
    property.titleEn || property.titleAr || "Untitled Property";

  return (
    <Card className="overflow-hidden">
      <div className="relative h-48 bg-gray-200">
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
        <Badge
          className={`absolute top-3 right-3 ${getStatusColor(
            property.status || "active"
          )}`}
        >
          {property.status || "Active"}
        </Badge>
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1">
            <h3 className="font-semibold text-[#2B2B2B] mb-1 line-clamp-1">
              {propertyTitle}
            </h3>
            <p className="text-sm text-gray-600 flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              {property.city || "N/A"}, {property.governorate || "N/A"}
            </p>
          </div>
          {property.averageRating > 0 && (
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm font-medium">
                {property.averageRating.toFixed(1)}
              </span>
            </div>
          )}
        </div>

        <div className="flex gap-3 text-sm text-gray-600 mb-3">
          <span>{property.bedrooms || 0} beds</span>
          <span>{property.bathrooms || 0} baths</span>
          <span>{property.propertyType || "N/A"}</span>
        </div>

        <div className="flex items-center justify-between mb-4">
          <div>
            <span className="text-lg font-semibold text-[#2B2B2B]">
              {formatCurrency(
                property.pricePerNight || property.pricePerMonth || 0
              )}
            </span>
            <span className="text-sm text-gray-600">
              /{property.pricePerNight ? "night" : "month"}
            </span>
          </div>
          {property.isFeatured && (
            <Badge className="bg-purple-100 text-purple-700">Featured</Badge>
          )}
        </div>

        <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
          <span>{property.totalReviews || 0} reviews</span>
          <span>ID: {property.propertyId}</span>
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={(e) => {
              e.stopPropagation();
              window.open(`/properties/${property.propertyId}`, "_blank");
            }}
          >
            <Eye className="w-3 h-3 mr-1" />
            View
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                className="text-red-600 focus:text-red-600"
                onClick={() =>
                  onDelete("Property", property.propertyId, propertyTitle)
                }
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </Card>
  );
}
