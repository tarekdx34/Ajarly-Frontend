// FILE 1: src/components/dashboard/renter/payments/PaymentsTab.tsx (~80 lines)
import { useState, useEffect } from "react";
import { Loader2, Receipt } from "lucide-react";
import { Language, translations } from "../../../../lib/translations";
import { EmptyState } from "../../shared/components/EmptyState";
import { PaymentTable } from "./PaymentTable";
import { PaymentMethods } from "./PaymentMethods";
import api, { TransactionResponse } from "../../../../../api";
import { toast } from "sonner";

interface PaymentsTabProps {
  onNavigate: (page: string, id?: string) => void;
  language: Language;
}

export function PaymentsTab({ onNavigate, language }: PaymentsTabProps) {
  const t = translations[language];
  const [payments, setPayments] = useState<TransactionResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>("all");

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const data = await api.getPaymentHistory();
      setPayments(data);
    } catch (err) {
      toast.error("Failed to load payment history");
    } finally {
      setLoading(false);
    }
  };

  const filteredPayments = payments.filter((payment) => {
    if (statusFilter === "all") return true;
    return payment.status === statusFilter;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 text-[#00BFA6] animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6" dir={language === "ar" ? "rtl" : "ltr"}>
      {" "}
      <div>
        <h2
          className={`text-2xl font-semibold text-[#2B2B2B] mb-4 ${
            language === "ar" ? "text-right" : "text-left"
          }`}
        >
          {t.userDashboard.paymentHistory}
        </h2>
        {payments.length > 0 ? (
          <PaymentTable
            payments={filteredPayments}
            totalPayments={payments.length}
            statusFilter={statusFilter}
            onStatusFilterChange={setStatusFilter}
          />
        ) : (
          <EmptyState
            icon={Receipt}
            title={t.userDashboard.noPaymentHistory}
            description={t.userDashboard.transactionsAppear}
          />
        )}
      </div>
      <PaymentMethods />
    </div>
  );
}
