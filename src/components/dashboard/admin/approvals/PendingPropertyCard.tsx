// src/components/dashboard/admin/approvals/PendingPropertyCard.tsx
import { CheckCircle, MapPin, Eye } from "lucide-react";
import { Card } from "../../../ui/card";
import { Badge } from "../../../ui/badge";
import { Button } from "../../../ui/button";
import { Language, translations } from "../../../../lib/translations";
import type { PendingPropertyResponse } from "../../../../../api";

interface PendingPropertyCardProps {
  listing: PendingPropertyResponse;
  formatCurrency: (amount: number) => string;
  formatDate: (date: string) => string;
  onApprove: (id: number, title: string) => void;
  onReject: (id: number, title: string) => void;
  language: Language;
}

export function PendingPropertyCard({
  listing,
  formatCurrency,
  formatDate,
  onApprove,
  onReject,
  language,
}: PendingPropertyCardProps) {
  const t = translations[language];

  return (
    <Card className="overflow-hidden">
      <div className="p-6" dir={language === "ar" ? "rtl" : "ltr"}>
        <div
          className={`flex items-start justify-between mb-3 ${
            language === "ar" ? "flex-row-reverse" : ""
          }`}
        >
          <div className={language === "ar" ? "text-right" : ""}>
            <h3 className="font-semibold text-[#2B2B2B] mb-1">
              {language === "ar" ? listing.titleAr : listing.titleEn}
            </h3>
            <p className="text-sm text-gray-600">
              {language === "ar" ? "بواسطة" : "by"} {listing.ownerName} (
              {listing.ownerEmail})
            </p>
          </div>
          <Badge variant="outline" className="bg-yellow-50">
            {language === "ar" ? "قيد الانتظار" : "Pending"}
          </Badge>
        </div>

        <div className="space-y-2 mb-4">
          <div
            className={`flex items-center gap-4 text-sm text-gray-600 ${
              language === "ar" ? "flex-row-reverse" : ""
            }`}
          >
            <span
              className={`flex items-center gap-1 ${
                language === "ar" ? "flex-row-reverse" : ""
              }`}
            >
              <MapPin className="w-3 h-3" />
              {listing.city}, {listing.governorate}
            </span>
            <span className="font-semibold">
              {formatCurrency(listing.pricePerNight)}/
              {language === "ar" ? "ليلة" : "night"}
            </span>
          </div>

          <div
            className={`flex gap-3 text-sm text-gray-600 ${
              language === "ar" ? "flex-row-reverse" : ""
            }`}
          >
            <span>
              {listing.bedrooms} {language === "ar" ? "سرير" : "beds"}
            </span>
            <span>
              {listing.bathrooms} {language === "ar" ? "حمام" : "baths"}
            </span>
            <span>{listing.propertyType}</span>
          </div>

          <p
            className={`text-sm text-gray-600 line-clamp-2 ${
              language === "ar" ? "text-right" : ""
            }`}
          >
            {language === "ar" ? listing.descriptionAr : listing.descriptionEn}
          </p>
        </div>

        <p
          className={`text-xs text-gray-500 mb-4 ${
            language === "ar" ? "text-right" : ""
          }`}
        >
          {language === "ar" ? "تم التقديم" : "Submitted"}{" "}
          {formatDate(listing.createdAt)}
        </p>

        <div
          className={`flex gap-2 ${
            language === "ar" ? "flex-row-reverse" : ""
          }`}
        >
          <Button
            size="sm"
            className="flex-1 bg-green-600 hover:bg-green-700"
            onClick={() => onApprove(listing.propertyId, listing.titleEn)}
          >
            <CheckCircle
              className={`w-4 h-4 ${language === "ar" ? "ml-1" : "mr-1"}`}
            />
            {t.admin?.approve || "Approve"}
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="flex-1 border-red-500 text-red-600 hover:bg-red-50"
            onClick={() => onReject(listing.propertyId, listing.titleEn)}
          >
            {t.admin?.reject || "Reject"}
          </Button>
          <Button variant="ghost" size="sm">
            <Eye className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
}
