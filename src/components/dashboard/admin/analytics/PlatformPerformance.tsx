// src/components/dashboard/admin/analytics/PlatformPerformance.tsx
import { Star } from "lucide-react";
import { Card } from "../../../ui/card";
import type { PlatformAnalyticsResponse } from "../../../../api";

interface PlatformPerformanceProps {
  analytics: PlatformAnalyticsResponse;
  formatCurrency: (amount: number) => string;
  formatDate: (date: string) => string;
}

export function PlatformPerformance({
  analytics,
  formatCurrency,
  formatDate,
}: PlatformPerformanceProps) {
  return (
    <Card className="p-6">
      <h3 className="font-semibold text-[#2B2B2B] mb-4">
        Platform Performance
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <h4 className="text-sm text-gray-600 mb-2">Active Properties</h4>
          <p className="text-2xl font-semibold">
            {analytics.overview.activeProperties}
          </p>
          <p className="text-xs text-gray-500">
            {(
              (analytics.overview.activeProperties /
                analytics.overview.totalProperties) *
              100
            ).toFixed(1)}
            % of total
          </p>
        </div>
        <div>
          <h4 className="text-sm text-gray-600 mb-2">Avg Rating</h4>
          <div className="flex items-center gap-2">
            <p className="text-2xl font-semibold">
              {analytics.overview.averagePlatformRating.toFixed(1)}
            </p>
            <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
          </div>
          <p className="text-xs text-gray-500">
            {analytics.overview.totalReviews} reviews
          </p>
        </div>
        <div>
          <h4 className="text-sm text-gray-600 mb-2">Period</h4>
          <p className="text-sm">
            {formatDate(analytics.startDate)} - {formatDate(analytics.endDate)}
          </p>
        </div>
      </div>
    </Card>
  );
}
