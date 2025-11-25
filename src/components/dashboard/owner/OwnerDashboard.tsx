// src/components/dashboard/owner/OwnerDashboard.tsx - NO AUTO-REFRESH
import { useState, useEffect, useCallback, useRef } from "react";
import { AddPropertyForm } from "./AddPropertyForm";
import { Language, translations } from "../../../lib/translations";
import {
  Plus,
  Home,
  Calendar,
  TrendingUp,
  Settings,
  Loader2,
  RefreshCw,
} from "lucide-react";
import { toast } from "sonner";
import api from "../../../../api";
import { useProfile } from "../../../hooks/useProfile";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../ui/tabs";
import { Card } from "../../ui/card";
import { Button } from "../../ui/button";
import { OwnerOverview } from "./OwnerOverview";
import { OwnerProperties } from "./OwnerProperties";
import { OwnerBookings } from "./OwnerBookings";
import { OwnerAnalytics } from "./OwnerAnalytics";
import { OwnerSettings } from "./OwnerSettings";

interface OwnerDashboardProps {
  onNavigate?: (page: string, propertyId?: string) => void;
  showAddPropertyOnMount?: boolean;
  language: Language;
}

export function OwnerDashboard({
  onNavigate,
  showAddPropertyOnMount = false,
  language,
}: OwnerDashboardProps) {
  const t = translations[language];
  const { profile, loading: profileLoading } = useProfile();
  const [activeTab, setActiveTab] = useState("overview");
  const [showAddProperty, setShowAddProperty] = useState(
    showAddPropertyOnMount
  );

  const [dashboard, setDashboard] = useState<any>(null);
  const [properties, setProperties] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // ✅ Track last refresh to prevent duplicate calls
  const lastRefreshTime = useRef<number>(0);
  const refreshCooldown = 1000; // 1 second cooldown

  // ============================================
  // ✅ MAIN DATA LOADING FUNCTION
  // ============================================
  const loadDashboardData = useCallback(async (forceReload = false) => {
    const now = Date.now();

    if (now - lastRefreshTime.current < refreshCooldown && !forceReload) {
      return;
    }

    lastRefreshTime.current = now;

    try {
      setLoading(true);

      const [propertiesData, dashboardData, bookingsData] = await Promise.all([
        api.getMyProperties({ page: 0, size: 100 }),
        api.getOwnerDashboard().catch(() => null),
        api.getOwnerBookings().catch(() => []),
      ]);

      // ✅ ADD CONSOLE LOGS FOR DEBUGGING
      console.log("📦 Raw API Response:", propertiesData);
      console.log("📦 Properties content:", propertiesData?.content);
      console.log("📦 Properties length:", propertiesData?.content?.length);

      // ✅ SAFE EXTRACTION with validation
      const propertiesList = Array.isArray(propertiesData?.content)
        ? propertiesData.content
        : Array.isArray(propertiesData)
        ? propertiesData
        : [];

      console.log(
        "📦 Extracted properties list:",
        propertiesList.length,
        propertiesList
      );

      // ✅ Filter deleted properties
      const activeProperties = propertiesList.filter((p) => {
        if (!p) return false;
        const status = (p.status || "").toLowerCase();
        const isDeleted = status === "deleted";
        console.log(
          `Property ${p.propertyId}: status=${status}, deleted=${isDeleted}`
        );
        return !isDeleted;
      });

      console.log(
        "✅ Active properties after filter:",
        activeProperties.length
      );
      console.log("✅ Active properties:", activeProperties);

      // ✅ UPDATE STATE
      setDashboard(dashboardData);
      setProperties(activeProperties);
      setBookings(Array.isArray(bookingsData) ? bookingsData : []);
    } catch (error) {
      console.error("❌ Dashboard load failed:", error);
      setProperties([]);
      setBookings([]);
    } finally {
      setLoading(false);
    }
  }, []);
  // ============================================
  // ✅ MANUAL REFRESH HANDLER
  // ============================================
  const handleManualRefresh = useCallback(async () => {
    setRefreshing(true);

    try {
      await loadDashboardData(true);
      toast.success("Dashboard refreshed successfully");
    } catch (error) {
      toast.error("Failed to refresh dashboard");
    } finally {
      setRefreshing(false);
    }
  }, [loadDashboardData]);

  // ============================================
  // ✅ INITIAL LOAD - RUNS ONCE ON MOUNT
  // ============================================
  useEffect(() => {
    if (profile?.userType === "landlord") {
      loadDashboardData();
    }
  }, [profile?.userType, loadDashboardData]);

  // ============================================
  // ✅ LISTEN FOR REVIEW EVENTS
  // ============================================
  useEffect(() => {
    const handleReviewEvent = (event: Event) => {
      loadDashboardData(true);
    };

    window.addEventListener("reviewAdded", handleReviewEvent);
    window.addEventListener("reviewUpdated", handleReviewEvent);
    window.addEventListener("reviewDeleted", handleReviewEvent);
    window.addEventListener("reviewApproved", handleReviewEvent);

    return () => {
      window.removeEventListener("reviewAdded", handleReviewEvent);
      window.removeEventListener("reviewUpdated", handleReviewEvent);
      window.removeEventListener("reviewDeleted", handleReviewEvent);
      window.removeEventListener("reviewApproved", handleReviewEvent);
    };
  }, [loadDashboardData]);

  // ============================================
  // ❌ AUTO-REFRESH DISABLED
  // Uncomment below to enable auto-refresh every 30 seconds
  // ============================================
  /*
  useEffect(() => {
    if (activeTab !== "overview") return;
    
    const interval = setInterval(() => {
      loadDashboardData(true);
    }, 30000); // 30 seconds

    return () => clearInterval(interval);
  }, [activeTab, loadDashboardData]);
  */

  // ============================================
  // ✅ EVENT HANDLERS
  // ============================================
  const handlePropertyCreated = useCallback(() => {
    setShowAddProperty(false);
    setActiveTab("properties");
    setTimeout(() => loadDashboardData(true), 500);
  }, [loadDashboardData]);

  const handlePropertyDeleted = useCallback(() => {
    loadDashboardData(true);
    toast.success("Property deleted successfully");
  }, [loadDashboardData]);

  const handleBookingUpdated = useCallback(() => {
    loadDashboardData(true);
  }, [loadDashboardData]);

  // ============================================
  // ✅ LOADING STATE
  // ============================================
  if (profileLoading || loading) {
    return (
      <div className="min-h-screen bg-[#F9F6F1] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-[#00BFA6] mx-auto mb-2" />
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // ============================================
  // ✅ ACCESS DENIED
  // ============================================
  if (profile?.userType !== "landlord") {
    return (
      <div className="min-h-screen bg-[#F9F6F1] flex items-center justify-center">
        <Card className="p-8 text-center">
          <h2 className="text-xl font-semibold mb-2">Access Denied</h2>
          <p className="text-gray-600">
            Only property owners can access this dashboard
          </p>
        </Card>
      </div>
    );
  }

  // ============================================
  // ✅ MAIN RENDER
  // ============================================
  return (
    <div
      className="min-h-screen bg-[#F9F6F1]"
      dir={language === "ar" ? "rtl" : "ltr"}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div
          className={`flex items-center justify-between mb-8 ${
            language === "ar" ? "flex-row-reverse" : ""
          }`}
        >
          <div className={language === "ar" ? "text-right" : "text-left"}>
            <h1 className="text-3xl font-semibold text-[#2B2B2B]">
              {t.hostDashboard.title}
            </h1>
            <p className="text-gray-600 mt-1">
              {t.hostDashboard.welcome.replace("🎉", "")} {profile?.firstName}!
            </p>
          </div>

          {/* ✅ Action Buttons */}
          <div className="flex items-center gap-3">
            {/* Refresh Button */}
            {!showAddProperty && (
              <Button
                onClick={handleManualRefresh}
                disabled={refreshing}
                variant="outline"
                className="gap-2"
              >
                <RefreshCw
                  className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`}
                />
                {refreshing ? "Refreshing..." : "Refresh"}
              </Button>
            )}

            {/* Add Property Button */}
            {!showAddProperty && (
              <Button
                onClick={() => setShowAddProperty(true)}
                className={`gap-2 ${
                  language === "ar" ? "flex-row-reverse" : ""
                }`}
              >
                <Plus className="w-5 h-5" />
                {t.hostDashboard.addProperty}
              </Button>
            )}
          </div>
        </div>

        {/* Content */}
        {showAddProperty ? (
          <AddPropertyForm
            onSuccess={handlePropertyCreated}
            onCancel={() => setShowAddProperty(false)}
          />
        ) : (
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList
              className={`grid w-full max-w-3xl grid-cols-5 mb-8 ${
                language === "ar" ? "flex-row-reverse" : ""
              }`}
            >
              <TabsTrigger
                value="overview"
                className={`gap-2 ${
                  language === "ar" ? "flex-row-reverse" : ""
                }`}
              >
                <Home className="w-4 h-4" />
                <span className="hidden sm:inline">
                  {t.hostDashboard.overview}
                </span>
              </TabsTrigger>
              <TabsTrigger value="properties" className="gap-2">
                <Home className="w-4 h-4" />
                <span className="hidden sm:inline">
                  {t.hostDashboard.myProperties}
                </span>
              </TabsTrigger>
              <TabsTrigger value="bookings" className="gap-2">
                <Calendar className="w-4 h-4" />
                <span className="hidden sm:inline">
                  {t.hostDashboard.bookings}
                </span>
              </TabsTrigger>
              <TabsTrigger value="analytics" className="gap-2">
                <TrendingUp className="w-4 h-4" />
                <span className="hidden sm:inline">
                  {t.hostDashboard.analytics}
                </span>
              </TabsTrigger>
              <TabsTrigger
                value="settings"
                className={`gap-2 ${
                  language === "ar" ? "flex-row-reverse" : ""
                }`}
              >
                <Settings className="w-4 h-4" />
                <span className="hidden sm:inline">
                  {t.hostDashboard.settings}
                </span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview">
              <OwnerOverview
                dashboard={dashboard}
                properties={properties}
                language={language}
                onRefresh={handleManualRefresh}
              />
            </TabsContent>

            <TabsContent value="properties">
              <OwnerProperties
                properties={properties}
                onPropertyDeleted={handlePropertyDeleted}
                onNavigate={onNavigate}
                language={language}
              />
            </TabsContent>

            <TabsContent value="bookings">
              <OwnerBookings
                bookings={bookings}
                onBookingUpdated={handleBookingUpdated}
                language={language}
              />
            </TabsContent>

            <TabsContent value="analytics">
              <OwnerAnalytics dashboard={dashboard} language={language} />
            </TabsContent>

            <TabsContent value="settings">
              <OwnerSettings profile={profile} language={language} />
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  );
}

// ============================================
// ✅ EXPORT EVENT HELPERS
// ============================================

export function notifyReviewAdded() {
  window.dispatchEvent(new Event("reviewAdded"));
}

export function notifyReviewUpdated() {
  window.dispatchEvent(new Event("reviewUpdated"));
}

export function notifyReviewDeleted() {
  window.dispatchEvent(new Event("reviewDeleted"));
}

export function notifyReviewApproved() {
  window.dispatchEvent(new Event("reviewApproved"));
}
