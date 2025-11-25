// src/components/dashboard/renter/payments/PaymentTable.tsx
import { Download } from "lucide-react";
import { Card } from "../../../ui/card";
import { Button } from "../../../ui/button";
import { Badge } from "../../../ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../ui/table";
import { TransactionResponse } from "../../../../../api";
import { openPaymentReceipt } from "../../../../utils/paymentReceiptGenerator";
import { toast } from "sonner";

interface PaymentTableProps {
  payments: TransactionResponse[];
  totalPayments: number;
  statusFilter: string;
  onStatusFilterChange: (status: string) => void;
}

export function PaymentTable({
  payments,
  totalPayments,
  statusFilter,
  onStatusFilterChange,
}: PaymentTableProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      completed: "bg-green-50 text-green-700 border-green-200",
      pending: "bg-yellow-50 text-yellow-700 border-yellow-200",
      failed: "bg-red-50 text-red-700 border-red-200",
      refunded: "bg-blue-50 text-blue-700 border-blue-200",
    };

    return (
      <Badge
        variant="outline"
        className={styles[status as keyof typeof styles] || ""}
      >
        {status}
      </Badge>
    );
  };

  const handleDownloadReceipt = (payment: TransactionResponse) => {
    try {
      openPaymentReceipt(payment);
      toast.success("Receipt opened in new tab!");
    } catch (error) {
      console.error("Failed to open receipt:", error);
      toast.error("Failed to open receipt. Please try again.");
    }
  };

  return (
    <>
      <div className="flex items-center gap-4 mb-4 flex-wrap">
        <span className="text-sm font-medium">Filter:</span>
        <div className="flex gap-2">
          {["all", "completed", "pending", "failed", "refunded"].map(
            (status) => (
              <Button
                key={status}
                variant={statusFilter === status ? "default" : "outline"}
                size="sm"
                onClick={() => onStatusFilterChange(status)}
                className={
                  statusFilter === status
                    ? "bg-[#00BFA6] hover:bg-[#00A890]"
                    : ""
                }
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </Button>
            )
          )}
        </div>
        <span className="text-sm text-gray-500 ml-auto">
          Showing {payments.length} of {totalPayments}
        </span>
      </div>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Property</TableHead>
              <TableHead>Reference</TableHead>
              <TableHead>Payment Method</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {payments.map((payment) => (
              <TableRow key={payment.transactionId}>
                <TableCell>{formatDate(payment.createdAt)}</TableCell>
                <TableCell className="font-medium max-w-xs truncate">
                  {payment.propertyTitle || "N/A"}
                </TableCell>
                <TableCell className="text-[#00BFA6] font-mono text-sm">
                  {payment.transactionReference}
                </TableCell>
                <TableCell className="capitalize">
                  {payment.paymentMethod.replace(/_/g, " ")}
                </TableCell>
                <TableCell className="font-semibold">
                  {payment.amount.toLocaleString()} {payment.currency}
                </TableCell>
                <TableCell>{getStatusBadge(payment.status)}</TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="gap-1 hover:bg-[#00BFA6]/10 hover:text-[#00BFA6]"
                    onClick={() => handleDownloadReceipt(payment)}
                  >
                    <Download className="w-4 h-4" />
                    Receipt
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </>
  );
}
