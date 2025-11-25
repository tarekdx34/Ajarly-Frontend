// src/components/dashboard/admin/reports/ReportsTab.tsx
import { ReportsTable } from "./ReportsTable";
import { Language, translations } from "../../../../lib/translations";
import type { ReportResponse } from "../../../../../api";

interface ReportsTabProps {
  reports: ReportResponse[];
  formatDate: (date: string) => string;
  getStatusColor: (status: string | boolean) => string;
  language: Language;
}

export function ReportsTab({
  reports,
  formatDate,
  getStatusColor,
  language,
}: ReportsTabProps) {
  const t = translations[language];

  return (
    <div className="space-y-6" dir={language === "ar" ? "rtl" : "ltr"}>
      <h2
        className={`text-2xl font-semibold text-[#2B2B2B] ${
          language === "ar" ? "text-right" : ""
        }`}
      >
        {t.admin?.manageReports || "Reports & Suspicious Activity"} (
        {reports.length})
      </h2>
      <ReportsTable
        reports={reports}
        formatDate={formatDate}
        getStatusColor={getStatusColor}
        language={language}
      />
    </div>
  );
}
