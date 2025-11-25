import { ChevronRight, RefreshCw } from "lucide-react";
import { Button } from "../../ui/button";
import { PropertyCard } from "../../PropertyCard";
import { PropertyResponse } from "../../../../api";
import { Language } from "../../../lib/translations";

interface FeaturedPropertiesProps {
  t: any;
  language: Language;
  properties: PropertyResponse[];
  loading: boolean;
  refreshing: boolean;
  user?: any | null;
  onNavigate: (page: string, propertyId?: string) => void;
  onRefresh: () => void;
}

export function FeaturedProperties({
  t,
  language,
  properties,
  loading,
  refreshing,
  user,
  onNavigate,
  onRefresh,
}: FeaturedPropertiesProps) {
  return (
    <>
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-semibold text-[#2B2B2B]">
          {t?.featuredProperties || "Featured Properties"}
        </h2>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={onRefresh}
            disabled={refreshing}
            className="text-gray-600"
          >
            <RefreshCw
              className={`w-4 h-4 mr-2 ${refreshing ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
          <Button
            variant="ghost"
            onClick={() => onNavigate("properties")}
            className="text-[#00BFA6] hover:text-[#00A890] gap-1"
          >
            {language === "ar" ? "عرض الكل" : "View all"}
            <ChevronRight
              className={`w-4 h-4 ${language === "ar" ? "rotate-180" : ""}`}
            />
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="space-y-3">
              <div className="h-48 bg-gray-200 animate-pulse rounded-2xl" />
              <div className="h-4 bg-gray-200 animate-pulse rounded" />
              <div className="h-4 bg-gray-200 animate-pulse rounded w-2/3" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {properties.map((property) => (
            <PropertyCard
              key={property.propertyId}
              property={property}
              onNavigate={onNavigate}
              language={language}
              showFavorite={!!user}
            />
          ))}
        </div>
      )}
    </>
  );
}
