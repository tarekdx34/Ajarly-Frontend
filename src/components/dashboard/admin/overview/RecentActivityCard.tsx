// src/components/dashboard/admin/overview/RecentActivityCard.tsx
import { UserCheck, Home, Calendar } from "lucide-react";
import { Card } from "../../../ui/card";
import { Language } from "../../../../lib/translations";
import type { DashboardStatsResponse } from "../../../../../api";

interface RecentActivityCardProps {
  stats: DashboardStatsResponse | null;
  language: Language;
}

export function RecentActivityCard({
  stats,
  language,
}: RecentActivityCardProps) {
  const activities = [
    {
      icon: UserCheck,
      bgColor: "bg-green-100",
      iconColor: "text-green-600",
      text:
        language === "ar"
          ? `${
              stats?.recentActivity?.recentRegistrations || 0
            } مستخدم جديد مسجل`
          : `${
              stats?.recentActivity?.recentRegistrations || 0
            } new users registered`,
      subtext: language === "ar" ? "الفترة الأخيرة" : "Recent period",
    },
    {
      icon: Home,
      bgColor: "bg-blue-100",
      iconColor: "text-blue-600",
      text:
        language === "ar"
          ? `${
              stats?.recentActivity?.recentPropertyListings || 0
            } عقار جديد مدرج`
          : `${
              stats?.recentActivity?.recentPropertyListings || 0
            } new properties listed`,
      subtext: language === "ar" ? "الفترة الأخيرة" : "Recent period",
    },
    {
      icon: Calendar,
      bgColor: "bg-purple-100",
      iconColor: "text-purple-600",
      text:
        language === "ar"
          ? `${stats?.recentActivity?.recentBookings || 0} حجز مكتمل`
          : `${stats?.recentActivity?.recentBookings || 0} bookings completed`,
      subtext: language === "ar" ? "الفترة الأخيرة" : "Recent period",
    },
  ];

  return (
    <Card className="p-6">
      <h3
        className={`font-semibold text-[#2B2B2B] mb-4 ${
          language === "ar" ? "text-right" : ""
        }`}
      >
        {language === "ar" ? "النشاط الأخير" : "Recent Activity"}
      </h3>
      <div className="space-y-4">
        {stats?.recentActivity &&
          activities.map((activity, index) => (
            <div
              key={index}
              className={`flex items-start gap-3 ${
                index < activities.length - 1 ? "pb-3 border-b" : ""
              } ${language === "ar" ? "flex-row-reverse" : ""}`}
            >
              <div
                className={`w-8 h-8 rounded-full ${activity.bgColor} flex items-center justify-center flex-shrink-0`}
              >
                <activity.icon className={`w-4 h-4 ${activity.iconColor}`} />
              </div>
              <div
                className={`flex-1 ${language === "ar" ? "text-right" : ""}`}
              >
                <p className="text-sm">{activity.text}</p>
                <p className="text-xs text-gray-500">{activity.subtext}</p>
              </div>
            </div>
          ))}
      </div>
    </Card>
  );
}
