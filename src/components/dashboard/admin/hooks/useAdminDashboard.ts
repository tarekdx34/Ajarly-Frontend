// src/components/dashboard/admin/hooks/useAdminDashboard.ts
import { useState, useEffect } from "react";
import { toast } from "sonner";
import api from "../../../../../api";
import type {
  DashboardStatsResponse,
  UserProfile,
  PropertyResponse,
  PendingPropertyResponse,
  ReportResponse,
  PlatformAnalyticsResponse,
} from "../../../../../api";

export function useAdminDashboard() {
  const [stats, setStats] = useState<DashboardStatsResponse | null>(null);
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [properties, setProperties] = useState<PropertyResponse[]>([]);
  const [pendingListings, setPendingListings] = useState<
    PendingPropertyResponse[]
  >([]);
  const [reports, setReports] = useState<ReportResponse[]>([]);
  const [analytics, setAnalytics] = useState<PlatformAnalyticsResponse | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    checkAuthAndLoadData();
  }, []);

  const checkAuthAndLoadData = async () => {
    try {
      const profile = await api.getProfile();
      if (profile.userType !== "admin") {
        setError("Access Denied: Admin privileges required");
        setLoading(false);
        toast.error("You must be logged in as an admin to access this page");
        return;
      }
      loadDashboardData();
    } catch (err) {
      setError("Authentication failed. Please login as admin.");
      setLoading(false);
      toast.error("Please login as admin");
    }
  };

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Load all data in parallel
      const [
        statsData,
        usersData,
        propertiesData,
        pendingData,
        reportsData,
        analyticsData,
      ] = await Promise.allSettled([
        api.getDashboardStats(),
        api.getAllUsers({ page: 0, size: 20 }),
        api.getProperties({ page: 0, size: 20 }),
        api.getPendingProperties({ page: 0, size: 20 }),
        api.getAllReports({ page: 0, size: 20 }),
        api.getPlatformAnalytics(),
      ]);

      if (statsData.status === "fulfilled") setStats(statsData.value);
      if (usersData.status === "fulfilled")
        setUsers(usersData.value.content || []);
      if (propertiesData.status === "fulfilled") {
        const data = propertiesData.value;
        setProperties(Array.isArray(data) ? data : data.content || []);
      }
      if (pendingData.status === "fulfilled") {
        const actuallyPending = (pendingData.value.content || []).filter(
          (p: PendingPropertyResponse) =>
            p.status?.toLowerCase() === "pending" ||
            p.status?.toLowerCase() === "pending_approval" ||
            p.status?.toLowerCase() === "pending approval"
        );
        setPendingListings(actuallyPending);
      }
      if (reportsData.status === "fulfilled")
        setReports(reportsData.value.content || []);
      if (analyticsData.status === "fulfilled")
        setAnalytics(analyticsData.value);
    } catch (err) {
      setError("Failed to load some dashboard data.");
    } finally {
      setLoading(false);
    }
  };

  const handleBanUser = async (userId: number, userName: string) => {
    try {
      await api.banUser(userId, "Violates terms of service");
      setUsers(
        users.map((u) => (u.userId === userId ? { ...u, isActive: false } : u))
      );
      toast.success(`User ${userName} has been banned`);
    } catch (err) {
      toast.error("Failed to ban user");
    }
  };

  const handleUnbanUser = async (userId: number, userName: string) => {
    try {
      await api.unbanUser(userId);
      setUsers(
        users.map((u) => (u.userId === userId ? { ...u, isActive: true } : u))
      );
      toast.success(`User ${userName} has been unbanned`);
    } catch (err) {
      toast.error("Failed to unban user");
    }
  };

  const handleDeleteProperty = async (id: number) => {
    try {
      // Check if property exists in local state
      const propertyExists = properties.find((p) => p.propertyId === id);

      if (!propertyExists) {
        toast.error("Property not found in current list");
        return;
      }

      const propertyTitle =
        propertyExists.titleEn || propertyExists.titleAr || "Untitled";

      // Try admin-specific endpoint first
      try {
        if (typeof (api as any).deletePropertyAsAdmin === "function") {
          await (api as any).deletePropertyAsAdmin(id);
        } else {
          await api.deleteProperty(id);
        }
      } catch (deleteError: any) {
        console.error("\n❌ DELETE request failed:");
        console.error("   - Status:", deleteError.status);
        console.error("   - Message:", deleteError.message);
        console.error("   - Data:", deleteError.data);

        // Handle specific errors
        if (deleteError.status === 404) {
          toast.warning("Property not found on server. Removing from list.");
          setProperties(properties.filter((p) => p.propertyId !== id));
          return;
        }

        if (deleteError.status === 500) {
          // Server error - likely has dependencies
          console.error(
            "❌ Server error (500) - Property likely has dependencies"
          );
          toast.error(
            `Cannot delete property "${propertyTitle}". ` +
              `It may have active bookings, reviews, or other dependencies. ` +
              `Please check the backend logs for details.`,
            { duration: 6000 }
          );
          return;
        }

        if (deleteError.status === 403) {
          console.error("❌ Access denied (403)");
          toast.error(
            "Access denied. You don't have permission to delete this property."
          );
          return;
        }

        if (deleteError.status === 400) {
          console.error("❌ Bad request (400)");
          toast.error("Cannot delete property. It may have active bookings.");
          return;
        }

        // Unknown error
        throw deleteError;
      }

      // If we got here, deletion was successful
      setProperties(properties.filter((p) => p.propertyId !== id));

      toast.success(`Property "${propertyTitle}" deleted successfully`);
    } catch (err: any) {
      console.error("\n❌ ========================================");
      console.error("❌ UNEXPECTED ERROR");
      console.error("❌ ========================================");
      console.error(err);
      console.error("❌ ========================================\n");

      toast.error(
        `Unexpected error: ${err.message || "Unknown error"}. ` +
          `Please check the console for details.`
      );
    }
  };

  const handleApprove = async (id: number, title: string) => {
    try {
      await api.approveProperty(id);
      setPendingListings(pendingListings.filter((p) => p.propertyId !== id));
      toast.success(`Property "${title}" has been approved`);
      await loadDashboardData();
    } catch (err) {
      toast.error("Failed to approve property");
    }
  };

  const handleReject = async (id: number, title: string) => {
    try {
      await api.rejectProperty(id, "Does not meet platform standards");
      setPendingListings(pendingListings.filter((p) => p.propertyId !== id));
      toast.error(`Property "${title}" has been rejected`);
      await loadDashboardData();
    } catch (err) {
      toast.error("Failed to reject property");
    }
  };

  return {
    stats,
    users,
    properties,
    pendingListings,
    reports,
    analytics,
    loading,
    error,
    handleBanUser,
    handleUnbanUser,
    handleDeleteProperty,
    handleApprove,
    handleReject,
    loadDashboardData,
  };
}
