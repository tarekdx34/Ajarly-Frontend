// src/components/dashboard/admin/properties/PropertiesTab.tsx
import { useState, useMemo } from "react";
import { SearchBar } from "../shared/SearchBar";
import { PropertyGrid } from "./PropertyGrid";
import { Language, translations } from "../../../../lib/translations";
import type { PropertyResponse } from "../../../../../api";

interface PropertiesTabProps {
  properties: PropertyResponse[];
  formatCurrency: (amount: number) => string;
  getStatusColor: (status: string | boolean) => string;
  onDelete: (type: string, id: number, name: string) => void;
  language: Language;
}

export function PropertiesTab({
  properties,
  formatCurrency,
  getStatusColor,
  onDelete,
  language,
}: PropertiesTabProps) {
  const t = translations[language];
  const [searchQuery, setSearchQuery] = useState("");

  // Filter properties based on search query
  const filteredProperties = useMemo(() => {
    if (!searchQuery.trim()) {
      return properties;
    }

    const query = searchQuery.toLowerCase();

    return properties.filter((property) => {
      // Search in title (both English and Arabic)
      const titleMatch =
        property.titleEn?.toLowerCase().includes(query) ||
        property.titleAr?.toLowerCase().includes(query);

      // Search in location
      const locationMatch =
        property.city?.toLowerCase().includes(query) ||
        property.governorate?.toLowerCase().includes(query);

      // Search in property type
      const typeMatch = property.propertyType?.toLowerCase().includes(query);

      // Search in property ID
      const idMatch = property.propertyId.toString().includes(query);

      // Search in status
      const statusMatch = property.status?.toLowerCase().includes(query);

      return titleMatch || locationMatch || typeMatch || idMatch || statusMatch;
    });
  }, [properties, searchQuery]);

  return (
    <div className="space-y-6" dir={language === "ar" ? "rtl" : "ltr"}>
      <div
        className={`flex items-center justify-between mb-6 ${
          language === "ar" ? "flex-row-reverse" : ""
        }`}
      >
        <h2
          className={`text-2xl font-semibold text-[#2B2B2B] ${
            language === "ar" ? "text-right" : ""
          }`}
        >
          {t.admin?.manageProperties || "Manage Properties"} (
          {filteredProperties.length}
          {searchQuery && ` / ${properties.length}`})
        </h2>
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder={t.admin?.searchProperties || "Search properties..."}
        />
      </div>

      <PropertyGrid
        properties={filteredProperties}
        formatCurrency={formatCurrency}
        getStatusColor={getStatusColor}
        onDelete={onDelete}
        language={language}
      />
    </div>
  );
}
