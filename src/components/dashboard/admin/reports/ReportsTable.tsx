// src/components/dashboard/admin/reports/ReportsTable.tsx
import { AlertTriangle, Eye } from "lucide-react";
import { Card } from "../../../ui/card";
import { Badge } from "../../../ui/badge";
import { Button } from "../../../ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../ui/table";
import { Language, translations } from "../../../../lib/translations";
import type { ReportResponse } from "../../../../../api";

interface ReportsTableProps {
  reports: ReportResponse[];
  formatDate: (date: string) => string;
  getStatusColor: (status: string | boolean) => string;
  language: Language;
}

export function ReportsTable({
  reports,
  formatDate,
  getStatusColor,
  language,
}: ReportsTableProps) {
  const t = translations[language];

  return (
    <Card>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className={language === "ar" ? "text-right" : ""}>
              {t.admin?.reportType || "Type"}
            </TableHead>
            <TableHead className={language === "ar" ? "text-right" : ""}>
              {t.admin?.reason || "Reason"}
            </TableHead>
            <TableHead className={language === "ar" ? "text-right" : ""}>
              {t.admin?.reporter || "Reporter"}
            </TableHead>
            <TableHead className={language === "ar" ? "text-right" : ""}>
              {language === "ar" ? "التاريخ" : "Date"}
            </TableHead>
            <TableHead className={language === "ar" ? "text-right" : ""}>
              {t.admin?.status || "Status"}
            </TableHead>
            <TableHead className={language === "ar" ? "text-right" : ""}>
              {t.admin?.actions || "Actions"}
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {reports.map((report) => (
            <TableRow key={report.reportId}>
              <TableCell>
                <div
                  className={`flex items-center gap-2 ${
                    language === "ar" ? "flex-row-reverse" : ""
                  }`}
                >
                  <AlertTriangle className="w-4 h-4 text-red-500" />
                  <span className="font-medium">{report.reportType}</span>
                </div>
              </TableCell>
              <TableCell>
                <Badge variant="outline">{report.reason}</Badge>
              </TableCell>
              <TableCell className={language === "ar" ? "text-right" : ""}>
                {language === "ar" ? "معرف المبلغ" : "Reporter ID"}:{" "}
                {report.reporterId}
              </TableCell>
              <TableCell className={language === "ar" ? "text-right" : ""}>
                {formatDate(report.createdAt)}
              </TableCell>
              <TableCell>
                <Badge className={getStatusColor(report.status)}>
                  {report.status}
                </Badge>
              </TableCell>
              <TableCell>
                <div
                  className={`flex gap-2 ${
                    language === "ar" ? "flex-row-reverse" : ""
                  }`}
                >
                  <Button variant="outline" size="sm">
                    <Eye
                      className={`w-3 h-3 ${
                        language === "ar" ? "ml-1" : "mr-1"
                      }`}
                    />
                    {language === "ar" ? "مراجعة" : "Review"}
                  </Button>
                  {report.status !== "resolved" && (
                    <Button
                      size="sm"
                      className="bg-green-600 hover:bg-green-700"
                    >
                      {language === "ar" ? "حل" : "Resolve"}
                    </Button>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
}
