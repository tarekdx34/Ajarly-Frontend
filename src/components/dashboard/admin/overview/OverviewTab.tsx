// src/components/dashboard/admin/overview/OverviewTab.tsx
import { StatsGrid } from "./StatsGrid";
import { RecentActivityCard } from "./RecentActivityCard";
import { QuickActionsCard } from "./QuickActionsCard";
import { Language } from "../../../../lib/translations";
import type { DashboardStatsResponse } from "../../../../../api";

interface OverviewTabProps {
  stats: DashboardStatsResponse | null;
  formatCurrency: (amount: number) => string;
  onTabChange: (tab: string) => void;
  language: Language;
}

export function OverviewTab({
  stats,
  formatCurrency,
  onTabChange,
  language,
}: OverviewTabProps) {
  return (
    <div className="space-y-6" dir={language === "ar" ? "rtl" : "ltr"}>
      <StatsGrid
        stats={stats}
        formatCurrency={formatCurrency}
        language={language}
      />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentActivityCard stats={stats} language={language} />
        <QuickActionsCard onTabChange={onTabChange} language={language} />
      </div>
    </div>
  );
}
