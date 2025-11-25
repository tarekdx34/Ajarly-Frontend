// src/components/dashboard/shared/components/StatsCard.tsx
import { LucideIcon } from "lucide-react";
import { Card } from "../../../ui/card";

interface StatsCardProps {
  icon: LucideIcon;
  label: string;
  value: number | string;
  color: string;
  subtitle?: string;
  format?: "number" | "currency" | "rating";
}

export function StatsCard({ 
  icon: Icon, 
  label, 
  value, 
  color,
  subtitle,
  format = "number"
}: StatsCardProps) {
  const formatValue = (val: number | string) => {
    if (typeof val === "string") return val;
    
    switch (format) {
      case "currency":
        return `${val.toLocaleString()} EGP`;
      case "rating":
        return val.toFixed(1);
      default:
        return val.toLocaleString();
    }
  };

  return (
    <Card className="p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm text-gray-600 mb-1">{label}</p>
          <p className="text-3xl font-bold text-[#2B2B2B]">
            {formatValue(value)}
          </p>
          {subtitle && (
            <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
          )}
        </div>
        <div
          className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: `${color}20` }}
        >
          <Icon className="w-6 h-6" style={{ color }} />
        </div>
      </div>
    </Card>
  );
}