// src/components/dashboard/admin/overview/QuickActionsCard.tsx
import { CheckCircle, Users, Flag, TrendingUp } from "lucide-react";
import { Card } from "../../../ui/card";
import { Button } from "../../../ui/button";
import { Language } from "../../../../lib/translations";

interface QuickActionsCardProps {
  onTabChange: (tab: string) => void;
  language: Language;
}

export function QuickActionsCard({
  onTabChange,
  language,
}: QuickActionsCardProps) {
  const actions = [
    {
      icon: CheckCircle,
      label: language === "ar" ? "الموافقة على القوائم" : "Approve Listings",
      tab: "approvals",
    },
    {
      icon: Users,
      label: language === "ar" ? "إدارة المستخدمين" : "Manage Users",
      tab: "users",
    },
    {
      icon: Flag,
      label: language === "ar" ? "عرض التقارير" : "View Reports",
      tab: "reports",
    },
    {
      icon: TrendingUp,
      label: language === "ar" ? "التحليلات" : "Analytics",
      tab: "analytics",
    },
  ];

  return (
    <Card className="p-6">
      <h3
        className={`font-semibold text-[#2B2B2B] mb-4 ${
          language === "ar" ? "text-right" : ""
        }`}
      >
        {language === "ar" ? "إجراءات سريعة" : "Quick Actions"}
      </h3>
      <div className="grid grid-cols-2 gap-3">
        {actions.map((action, index) => (
          <Button
            key={index}
            variant="outline"
            className="h-20 flex-col gap-2"
            onClick={() => onTabChange(action.tab)}
          >
            <action.icon className="w-5 h-5" />
            <span className="text-sm text-center">{action.label}</span>
          </Button>
        ))}
      </div>
    </Card>
  );
}
