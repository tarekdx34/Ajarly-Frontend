// src/components/dashboard/admin/analytics/AnalyticsTab.tsx
import { TrendingUp } from "lucide-react";
import { Card } from "../../../ui/card";
import { AnalyticsOverview } from "./AnalyticsOverview";
import { TopLocationsTable } from "./TopLocationsTable";
import { PlatformPerformance } from "./PlatformPerformance";
import { Language, translations } from "../../../../lib/translations";
import type { PlatformAnalyticsResponse } from "../../../../../api";

interface AnalyticsTabProps {
  analytics: PlatformAnalyticsResponse | null;
  formatCurrency: (amount: number) => string;
  formatDate: (date: string) => string;
  language: Language;
}

export function AnalyticsTab({
  analytics,
  formatCurrency,
  formatDate,
  language,
}: AnalyticsTabProps) {
  const t = translations[language];

  return (
    <div className="space-y-6" dir={language === "ar" ? "rtl" : "ltr"}>
      <h2
        className={`text-2xl font-semibold text-[#2B2B2B] ${
          language === "ar" ? "text-right" : ""
        }`}
      >
        {t.admin?.platformAnalytics || "Analytics & Insights"}
      </h2>

      {analytics ? (
        <>
          <AnalyticsOverview
            analytics={analytics}
            formatCurrency={formatCurrency}
            language={language}
          />
          <TopLocationsTable
            locations={analytics.topLocations}
            formatCurrency={formatCurrency}
            language={language}
          />
          <PlatformPerformance
            analytics={analytics}
            formatCurrency={formatCurrency}
            formatDate={formatDate}
            language={language}
          />
        </>
      ) : (
        <Card className="p-12 text-center">
          <TrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-[#2B2B2B] mb-2">
            {language === "ar" ? "لا توجد بيانات تحليلية" : "No Analytics Data"}
          </h3>
          <p className="text-gray-600">
            {language === "ar"
              ? "بيانات التحليلات غير متوفرة"
              : "Analytics data is not available"}
          </p>
        </Card>
      )}
    </div>
  );
}
