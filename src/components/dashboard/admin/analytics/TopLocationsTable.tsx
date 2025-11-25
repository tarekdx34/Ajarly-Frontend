// src/components/dashboard/admin/analytics/TopLocationsTable.tsx
import { MapPin } from "lucide-react";
import { Card } from "../../../ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../ui/table";
import type { PlatformAnalyticsResponse } from "../../../../api";

interface TopLocationsTableProps {
  locations: PlatformAnalyticsResponse["topLocations"];
  formatCurrency: (amount: number) => string;
}

export function TopLocationsTable({
  locations,
  formatCurrency,
}: TopLocationsTableProps) {
  return (
    <Card className="p-6">
      <h3 className="font-semibold text-[#2B2B2B] mb-4">
        Top Performing Locations
      </h3>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Location</TableHead>
            <TableHead>Properties</TableHead>
            <TableHead>Bookings</TableHead>
            <TableHead>Revenue</TableHead>
            <TableHead>Avg Price</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {locations.map((location, index) => (
            <TableRow key={index}>
              <TableCell>
                <div className="flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-gray-400" />
                  <span className="font-medium">
                    {location.city}, {location.governorate}
                  </span>
                </div>
              </TableCell>
              <TableCell>{location.propertyCount}</TableCell>
              <TableCell>{location.bookingCount}</TableCell>
              <TableCell className="font-semibold">
                {formatCurrency(location.totalRevenue)}
              </TableCell>
              <TableCell>{formatCurrency(location.averagePrice)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
}
