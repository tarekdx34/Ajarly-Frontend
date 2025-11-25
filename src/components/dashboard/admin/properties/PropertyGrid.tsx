// src/components/dashboard/admin/properties/PropertyGrid.tsx
import { Home } from "lucide-react";
import { Card } from "../../../ui/card";
import { PropertyGridCard } from "./PropertyGridCard";
import { Language } from "../../../../lib/translations";
import type { PropertyResponse } from "../../../../../api";

interface PropertyGridProps {
  properties: PropertyResponse[];
  formatCurrency: (amount: number) => string;
  getStatusColor: (status: string | boolean) => string;
  onDelete: (type: string, id: number, name: string) => void;
  language: Language;
}

export function PropertyGrid({
  properties,
  formatCurrency,
  getStatusColor,
  onDelete,
  language,
}: PropertyGridProps) {
  if (properties.length === 0) {
    return (
      <Card className="p-12 text-center">
        <Home className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-[#2B2B2B] mb-2">
          {language === "ar"
            ? "لم يتم العثور على عقارات"
            : "No Properties Found"}
        </h3>
        <p className="text-gray-600">
          {language === "ar"
            ? "لا توجد عقارات متاحة في النظام"
            : "No properties available in the system"}
        </p>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {properties.map((property) => (
        <PropertyGridCard
          key={property.propertyId}
          property={property}
          formatCurrency={formatCurrency}
          getStatusColor={getStatusColor}
          onDelete={onDelete}
          language={language}
        />
      ))}
    </div>
  );
}
