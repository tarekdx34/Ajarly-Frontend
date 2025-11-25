// src/components/dashboard/admin/analytics/AnalyticsOverview.tsx
import { Card } from "../../../ui/card";
import type { PlatformAnalyticsResponse } from "../../../../api";

interface AnalyticsOverviewProps {
  analytics: PlatformAnalyticsResponse;
  formatCurrency: (amount: number) => string;
}

export function AnalyticsOverview({
  analytics,
  formatCurrency,
}: AnalyticsOverviewProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card className="p-4">
        <h4 className="text-sm text-gray-600 mb-1">New Users</h4>
        <p className="text-2xl font-semibold">
          {analytics.overview.newUsersInPeriod}
        </p>
        <p className="text-xs text-gray-500">
          Total: {analytics.overview.totalUsers}
        </p>
      </Card>
      <Card className="p-4">
        <h4 className="text-sm text-gray-600 mb-1">New Properties</h4>
        <p className="text-2xl font-semibold">
          {analytics.overview.newPropertiesInPeriod}
        </p>
        <p className="text-xs text-gray-500">
          Total: {analytics.overview.totalProperties}
        </p>
      </Card>
      <Card className="p-4">
        <h4 className="text-sm text-gray-600 mb-1">New Bookings</h4>
        <p className="text-2xl font-semibold">
          {analytics.overview.newBookingsInPeriod}
        </p>
        <p className="text-xs text-gray-500">
          Total: {analytics.overview.totalBookings}
        </p>
      </Card>
      <Card className="p-4">
        <h4 className="text-sm text-gray-600 mb-1">Revenue</h4>
        <p className="text-2xl font-semibold">
          {formatCurrency(analytics.overview.revenueInPeriod)}
        </p>
        <p className="text-xs text-gray-500">
          Total: {formatCurrency(analytics.overview.totalRevenue)}
        </p>
      </Card>
    </div>
  );
}
