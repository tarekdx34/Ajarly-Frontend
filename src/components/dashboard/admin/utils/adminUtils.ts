// src/components/dashboard/admin/utils/adminUtils.ts

export const getStatusColor = (status: string | boolean): string => {
  if (typeof status === "boolean") {
    return status ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700";
  }
  switch (status.toLowerCase()) {
    case "active":
    case "approved":
    case "resolved":
      return "bg-green-100 text-green-700";
    case "suspended":
    case "banned":
    case "rejected":
      return "bg-red-100 text-red-700";
    case "pending":
    case "pending_approval":
      return "bg-yellow-100 text-yellow-700";
    case "investigating":
    case "in_progress":
      return "bg-orange-100 text-orange-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
};

export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("en-EG", {
    style: "currency",
    currency: "EGP",
    minimumFractionDigits: 0,
  }).format(amount);
};
