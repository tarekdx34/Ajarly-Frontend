// src/components/dashboard/renter/RenterDashboard.tsx - FIXED URL PERSISTENCE
import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../ui/tabs";
import { Language, translations } from "../../../lib/translations";
import { OverviewTab } from "./overview/OverviewTab";
import { ProfileTab } from "../../profile/ProfileTab";
import { TripsTab } from "./trips/TripsTab";
import { FavoritesTab } from "./favorites/FavoritesTab";
import { ReviewsTab } from "./reviews/ReviewsTab";
import { PaymentsTab } from "./payments/PaymentsTab";
import {
  Calendar,
  Heart,
  MessageSquare,
  Receipt,
  User,
  LayoutDashboard,
} from "lucide-react";

interface RenterDashboardProps {
  onNavigate: (page: string, id?: string) => void;
  currentUser?: any;
  onUserUpdate?: (user: any) => void;
  language: Language;
}

export function RenterDashboard({
  onNavigate,
  currentUser,
  onUserUpdate,
  language,
}: RenterDashboardProps) {
  const t = translations[language];

  // ✅ Initialize tab from URL
  const [activeTab, setActiveTab] = useState(() => {
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      const tabParam = urlParams.get("tab");
      const validTabs = [
        "overview",
        "trips",
        "favorites",
        "reviews",
        "payments",
        "profile",
      ];
      if (tabParam && validTabs.includes(tabParam)) {
        return tabParam;
      }
    }
    return "overview";
  });

  // ✅ Extract highlightBookingId from URL
  const [highlightBookingId, setHighlightBookingId] = useState<
    number | undefined
  >(() => {
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      const bookingId = urlParams.get("bookingId");
      return bookingId ? parseInt(bookingId, 10) : undefined;
    }
    return undefined;
  });

  // ✅ Update URL when tab changes manually
  const handleTabChange = (newTab: string) => {
    setActiveTab(newTab);

    const params = new URLSearchParams(window.location.search);
    params.set("tab", newTab);

    // Clear bookingId when switching tabs manually
    if (newTab !== "reviews") {
      params.delete("bookingId");
      setHighlightBookingId(undefined);
    }

    const newUrl = `${window.location.pathname}?${params.toString()}`;
    window.history.pushState({}, "", newUrl);
  };

  // ✅ Listen to popstate AND custom events for tab changes
  useEffect(() => {
    const handleUrlChange = () => {
      const urlParams = new URLSearchParams(window.location.search);
      const tabParam = urlParams.get("tab") || "overview";
      const bookingId = urlParams.get("bookingId");

      setActiveTab(tabParam);
      setHighlightBookingId(bookingId ? parseInt(bookingId, 10) : undefined);
    };

    // Listen to both popstate and custom storage events
    window.addEventListener("popstate", handleUrlChange);

    // Initial check on mount
    handleUrlChange();

    return () => {
      window.removeEventListener("popstate", handleUrlChange);
    };
  }, []);

  // ✅ Enhanced navigate handler that supports tab switching
  const handleNavigate = (page: string, id?: string) => {
    // If page is a tab name (reviews, trips, etc.), switch to that tab
    const validTabs = [
      "overview",
      "trips",
      "favorites",
      "reviews",
      "payments",
      "profile",
    ];

    if (validTabs.includes(page)) {
      const params = new URLSearchParams(window.location.search);
      params.set("tab", page);

      // If id is provided (e.g., bookingId), add it to URL
      if (id) {
        params.set("bookingId", id);
        setHighlightBookingId(parseInt(id, 10));
      } else {
        params.delete("bookingId");
        setHighlightBookingId(undefined);
      }

      const newUrl = `${window.location.pathname}?${params.toString()}`;
      window.history.pushState({}, "", newUrl);
      setActiveTab(page);

      // Smooth scroll to top after tab change
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }, 100);
    } else {
      // Otherwise, use the original navigation handler
      onNavigate(page, id);
    }
  };

  return (
    <div
      className="min-h-screen bg-[#F9F6F1]"
      dir={language === "ar" ? "rtl" : "ltr"}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1
          className={`text-3xl font-semibold text-[#2B2B2B] mb-8 ${
            language === "ar" ? "text-right" : "text-left"
          }`}
        >
          {t.userDashboard.myDashboard}
        </h1>
        <Tabs value={activeTab} onValueChange={handleTabChange}>
          <TabsList
            className="grid w-full max-w-4xl grid-cols-6 mb-8"
            style={{
              direction: language === "ar" ? "rtl" : "ltr",
            }}
          >
            <TabsTrigger
              value="overview"
              className={`gap-2 ${language === "ar" ? "flex-row-reverse" : ""}`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span className="hidden sm:inline">
                {t.userDashboard.overview}
              </span>
            </TabsTrigger>
            <TabsTrigger
              value="trips"
              className={`gap-2 ${language === "ar" ? "flex-row-reverse" : ""}`}
            >
              <Calendar className="w-4 h-4" />
              <span className="hidden sm:inline">
                {t.userDashboard.myBookings}
              </span>
            </TabsTrigger>
            <TabsTrigger
              value="favorites"
              className={`gap-2 ${language === "ar" ? "flex-row-reverse" : ""}`}
            >
              <Heart className="w-4 h-4" />
              <span className="hidden sm:inline">
                {t.userDashboard.favourites}
              </span>
            </TabsTrigger>

            <TabsTrigger
              value="reviews"
              className={`gap-2 ${language === "ar" ? "flex-row-reverse" : ""}`}
            >
              <MessageSquare className="w-4 h-4" />
              <span className="hidden sm:inline">
                {t.userDashboard.reviews}
              </span>
            </TabsTrigger>
            <TabsTrigger
              value="payments"
              className={`gap-2 ${language === "ar" ? "flex-row-reverse" : ""}`}
            >
              <Receipt className="w-4 h-4" />
              <span className="hidden sm:inline">
                {t.userDashboard.payments}
              </span>
            </TabsTrigger>
            <TabsTrigger
              value="profile"
              className={`gap-2 ${language === "ar" ? "flex-row-reverse" : ""}`}
            >
              <User className="w-4 h-4" />
              <span className="hidden sm:inline">
                {t.userDashboard.profile}
              </span>
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview">
            <OverviewTab onNavigate={handleNavigate} language={language} />
          </TabsContent>

          {/* Trips Tab */}
          <TabsContent value="trips">
            <TripsTab onNavigate={handleNavigate} language={language} />
          </TabsContent>

          {/* Favorites Tab */}
          <TabsContent value="favorites">
            <FavoritesTab onNavigate={handleNavigate} language={language} />
          </TabsContent>

          {/* Reviews Tab */}
          <TabsContent value="reviews">
            <ReviewsTab
              onNavigate={handleNavigate}
              language={language}
              highlightBookingId={highlightBookingId}
            />
          </TabsContent>

          {/* Payments Tab */}
          <TabsContent value="payments">
            <PaymentsTab onNavigate={handleNavigate} language={language} />
          </TabsContent>

          {/* Profile Tab */}
          <TabsContent value="profile">
            <ProfileTab
              currentUser={currentUser}
              onUserUpdate={onUserUpdate}
              language={language}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
