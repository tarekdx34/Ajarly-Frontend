// src/components/dashboard/admin/overview/StatsGrid.tsx
import {
  Users,
  Home,
  CheckCircle,
  Calendar,
  DollarSign,
  UserX,
} from "lucide-react";
import { Card } from "../../../ui/card";
import { Language, translations } from "../../../../lib/translations";
import type { DashboardStatsResponse } from "../../../../../api";

interface StatsGridProps {
  stats: DashboardStatsResponse | null;
  formatCurrency: (amount: number) => string;
  language: Language;
}

export function StatsGrid({ stats, formatCurrency, language }: StatsGridProps) {
  const t = translations[language];

  const statsCards = [
    {
      title: t.admin?.totalUsers || "Total Users",
      value: stats?.totalUsers.toLocaleString() || 0,
      subtitle: language === "ar" ? "المستخدمون المسجلون" : "Registered users",
      icon: Users,
      color: "text-[#00BFA6]",
    },
    {
      title: t.admin?.totalProperties || "Total Properties",
      value: stats?.totalProperties || 0,
      subtitle: `${stats?.activeProperties || 0} ${
        language === "ar" ? "نشط" : "active"
      }`,
      icon: Home,
      color: "text-[#00BFA6]",
    },
    {
      title: t.admin?.pendingApprovals || "Pending Approvals",
      value: stats?.pendingApprovalsCount || 0,
      subtitle: language === "ar" ? "يحتاج اهتمام" : "Needs attention",
      icon: CheckCircle,
      color: "text-yellow-500",
    },
    {
      title: t.admin?.totalBookings || "Total Bookings",
      value: stats?.totalBookings || 0,
      subtitle: language === "ar" ? "إجمالي الحجوزات" : "All time bookings",
      icon: Calendar,
      color: "text-[#00BFA6]",
    },
    {
      title: t.admin?.totalRevenue || "Total Revenue",
      value: formatCurrency(stats?.totalRevenue || 0),
      subtitle: language === "ar" ? "إيرادات المنصة" : "Platform revenue",
      icon: DollarSign,
      color: "text-[#00BFA6]",
    },
    {
      title: language === "ar" ? "المستخدمون المحظورون" : "Banned Users",
      value: stats?.bannedUsersCount || 0,
      subtitle: language === "ar" ? "حسابات موقوفة" : "Suspended accounts",
      icon: UserX,
      color: "text-red-500",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {statsCards.map((stat, index) => (
        <Card key={index} className="p-6">
          <div
            className={`flex items-center justify-between mb-2 ${
              language === "ar" ? "flex-row-reverse" : ""
            }`}
          >
            <h3
              className={`text-sm text-gray-600 ${
                language === "ar" ? "text-right" : ""
              }`}
            >
              {stat.title}
            </h3>
            <stat.icon className={`w-5 h-5 ${stat.color}`} />
          </div>
          <p
            className={`text-3xl font-semibold text-[#2B2B2B] ${
              language === "ar" ? "text-right" : ""
            }`}
          >
            {stat.value}
          </p>
          <p
            className={`text-sm text-gray-600 mt-1 ${
              language === "ar" ? "text-right" : ""
            }`}
          >
            {stat.subtitle}
          </p>
        </Card>
      ))}
    </div>
  );
}
