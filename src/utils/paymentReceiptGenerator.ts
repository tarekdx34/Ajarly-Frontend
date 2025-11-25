// src/utils/paymentReceiptGenerator.ts
import { TransactionResponse } from "../../api";

export function generatePaymentReceiptHTML(payment: TransactionResponse): string {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusColor = (status: string) => {
    const colors = {
      completed: "#10b981",
      pending: "#f59e0b",
      failed: "#ef4444",
      refunded: "#3b82f6",
    };
    return colors[status as keyof typeof colors] || "#6b7280";
  };

  const getStatusBgColor = (status: string) => {
    const colors = {
      completed: "#d1fae5",
      pending: "#fef3c7",
      failed: "#fee2e2",
      refunded: "#dbeafe",
    };
    return colors[status as keyof typeof colors] || "#f3f4f6";
  };

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Payment Receipt - ${payment.transactionReference}</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      color: #2B2B2B;
      background: #f9fafb;
      padding: 20px;
    }

    .receipt-container {
      max-width: 800px;
      margin: 0 auto;
      background: white;
      border-radius: 12px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      overflow: hidden;
    }

    .no-print {
      padding: 20px;
      background: #f9fafb;
      border-bottom: 1px solid #e5e7eb;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .print-button {
      background: #00BFA6;
      color: white;
      border: none;
      padding: 10px 20px;
      border-radius: 8px;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 8px;
      transition: background 0.2s;
    }

    .print-button:hover {
      background: #00A890;
    }

    .receipt-content {
      padding: 40px;
    }

    .header {
      border-bottom: 3px solid #00BFA6;
      padding-bottom: 30px;
      margin-bottom: 30px;
      display: flex;
      justify-content: space-between;
      align-items: start;
    }

    .logo-section h1 {
      font-size: 36px;
      font-weight: bold;
      color: #00BFA6;
      margin-bottom: 8px;
    }

    .logo-section p {
      font-size: 14px;
      color: #6b7280;
    }

    .receipt-info {
      text-align: right;
    }

    .receipt-info h2 {
      font-size: 28px;
      font-weight: bold;
      color: #2B2B2B;
      margin-bottom: 8px;
    }

    .receipt-info p {
      font-size: 13px;
      color: #6b7280;
      margin-bottom: 4px;
    }

    .info-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 30px;
      margin-bottom: 30px;
    }

    .info-section h3 {
      font-size: 12px;
      font-weight: 600;
      color: #6b7280;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 12px;
    }

    .info-section p {
      font-size: 14px;
      color: #2B2B2B;
      margin-bottom: 4px;
    }

    .info-section .label {
      color: #6b7280;
      font-size: 13px;
    }

    .info-section .value {
      font-weight: 600;
      color: #2B2B2B;
    }

    .payment-details {
      background: #f9fafb;
      border-radius: 12px;
      padding: 24px;
      margin-bottom: 30px;
    }

    .payment-details h3 {
      font-size: 12px;
      font-weight: 600;
      color: #6b7280;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 16px;
    }

    .detail-row {
      display: flex;
      justify-content: space-between;
      padding: 12px 0;
      font-size: 14px;
    }

    .detail-row:not(:last-child) {
      border-bottom: 1px solid #e5e7eb;
    }

    .detail-row .label {
      color: #6b7280;
    }

    .detail-row .value {
      font-weight: 600;
      color: #2B2B2B;
    }

    .total-row {
      border-top: 2px solid #d1d5db;
      padding-top: 16px;
      margin-top: 8px;
    }

    .total-row .label {
      font-size: 18px;
      font-weight: bold;
      color: #2B2B2B;
    }

    .total-row .value {
      font-size: 20px;
      font-weight: bold;
      color: #00BFA6;
    }

    .status-section {
      background: ${getStatusBgColor(payment.status)};
      border-radius: 12px;
      padding: 20px;
      margin-bottom: 30px;
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .status-indicator {
      width: 12px;
      height: 12px;
      background: ${getStatusColor(payment.status)};
      border-radius: 50%;
      flex-shrink: 0;
    }

    .status-text {
      font-size: 14px;
      font-weight: 600;
      color: #2B2B2B;
    }

    .status-value {
      color: ${getStatusColor(payment.status)};
      text-transform: uppercase;
      font-weight: bold;
    }

    .status-date {
      font-size: 12px;
      color: #6b7280;
      margin-top: 4px;
    }

    .footer {
      border-top: 2px solid #e5e7eb;
      padding-top: 24px;
      margin-top: 30px;
      text-align: center;
    }

    .footer p {
      font-size: 13px;
      color: #6b7280;
      margin-bottom: 8px;
    }

    .footer .support {
      color: #00BFA6;
      font-weight: 600;
      text-decoration: none;
    }

    .footer .support:hover {
      text-decoration: underline;
    }

    @media print {
      body {
        background: white;
        padding: 0;
      }

      .receipt-container {
        box-shadow: none;
        border-radius: 0;
      }

      .no-print {
        display: none !important;
      }

      .receipt-content {
        padding: 20px;
      }
    }

    @media (max-width: 640px) {
      .info-grid {
        grid-template-columns: 1fr;
        gap: 20px;
      }

      .header {
        flex-direction: column;
        gap: 20px;
      }

      .receipt-info {
        text-align: left;
      }
    }
  </style>
</head>
<body>
  <div class="receipt-container">
    <!-- Print Button (Hidden when printing) -->
    <div class="no-print">
      <div>
        <h3 style="font-size: 18px; font-weight: 600; color: #2B2B2B; margin-bottom: 4px;">
          Payment Receipt
        </h3>
        <p style="font-size: 14px; color: #6b7280;">
          Click the button to print or save as PDF
        </p>
      </div>
      <button class="print-button" onclick="window.print()">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="6 9 6 2 18 2 18 9"></polyline>
          <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path>
          <rect x="6" y="14" width="12" height="8"></rect>
        </svg>
        Print Receipt
      </button>
    </div>

    <!-- Receipt Content -->
    <div class="receipt-content">
      <!-- Header -->
      <div class="header">
        <div class="logo-section">
          <h1>AJARLY</h1>
          <p>Your Trusted Rental Platform</p>
          <p style="margin-top: 4px;">www.ajarly.com | support@ajarly.com</p>
        </div>
        <div class="receipt-info">
          <h2>RECEIPT</h2>
          <p><strong>Transaction ID:</strong> ${payment.transactionReference}</p>
          <p><strong>Date:</strong> ${formatDateTime(payment.createdAt)}</p>
        </div>
      </div>

      <!-- Transaction Information -->
      <div class="info-grid">
        <div class="info-section">
          <h3>Transaction Details</h3>
          <div style="margin-bottom: 8px;">
            <p class="label">Transaction Type</p>
            <p class="value" style="text-transform: capitalize;">${payment.transactionType.replace(/_/g, " ")}</p>
          </div>
          <div style="margin-bottom: 8px;">
            <p class="label">Payment Method</p>
            <p class="value" style="text-transform: capitalize;">${payment.paymentMethod.replace(/_/g, " ")}</p>
          </div>
          ${payment.bookingReference ? `
          <div style="margin-bottom: 8px;">
            <p class="label">Booking Reference</p>
            <p class="value">${payment.bookingReference}</p>
          </div>
          ` : ''}
        </div>

        <div class="info-section">
          <h3>Property Information</h3>
          <div style="margin-bottom: 8px;">
            <p class="label">Property</p>
            <p class="value">${payment.propertyTitle || "N/A"}</p>
          </div>
          ${payment.completedAt ? `
          <div style="margin-bottom: 8px;">
            <p class="label">Completed At</p>
            <p class="value">${formatDateTime(payment.completedAt)}</p>
          </div>
          ` : ''}
        </div>
      </div>

      <!-- Payment Details -->
      <div class="payment-details">
        <h3>Payment Summary</h3>
        <div class="detail-row">
          <span class="label">Amount</span>
          <span class="value">${payment.amount.toLocaleString()} ${payment.currency}</span>
        </div>
        ${payment.transactionType === 'refund' ? `
        <div class="detail-row">
          <span class="label">Refund Type</span>
          <span class="value" style="color: #3b82f6;">Full Refund</span>
        </div>
        ` : ''}
        <div class="detail-row total-row">
          <span class="label">${payment.transactionType === 'refund' ? 'Total Refunded' : 'Total Paid'}</span>
          <span class="value">${payment.amount.toLocaleString()} ${payment.currency}</span>
        </div>
      </div>

      <!-- Status Section -->
      <div class="status-section">
        <div class="status-indicator"></div>
        <div style="flex: 1;">
          <p class="status-text">
            Payment Status: <span class="status-value">${payment.status.toUpperCase()}</span>
          </p>
          ${payment.completedAt ? `
          <p class="status-date">Completed on: ${formatDateTime(payment.completedAt)}</p>
          ` : ''}
        </div>
      </div>

      <!-- Footer -->
      <div class="footer">
        <p>Thank you for using Ajarly!</p>
        <p>For any questions or concerns, please contact our support team:</p>
        <p>
          <a href="mailto:support@ajarly.com" class="support">support@ajarly.com</a>
          <span style="margin: 0 8px; color: #d1d5db;">|</span>
          <span style="color: #6b7280;">+20 123 456 7890</span>
        </p>
        <p style="margin-top: 16px; font-size: 12px; color: #9ca3af;">
          This is an automatically generated receipt. Please keep it for your records.
        </p>
      </div>
    </div>
  </div>
</body>
</html>
  `;
}

export function openPaymentReceipt(payment: TransactionResponse): void {
  const receiptHTML = generatePaymentReceiptHTML(payment);
  const receiptWindow = window.open("", "_blank");
  
  if (receiptWindow) {
    receiptWindow.document.write(receiptHTML);
    receiptWindow.document.close();
  } else {
    alert("Please allow pop-ups to view the receipt.");
  }
}