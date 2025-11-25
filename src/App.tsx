// src/App.tsx - With Lazy Loading
import { useState, useEffect, lazy, Suspense } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useNavigate,
  useLocation,
} from "react-router-dom";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";
import { Toaster } from "./components/ui/sonner";
import { FavoritesProvider } from "./contexts/FavoritesContext";
import { Language } from "./lib/translations";
import api from "../api";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

// Lazy load all page components
const HomePage = lazy(() =>
  import("./components/pages/HomePage").then((m) => ({ default: m.HomePage }))
);
const LoginPage = lazy(() =>
  import("./components/pages/LoginPage").then((m) => ({ default: m.LoginPage }))
);
const RegisterPage = lazy(() =>
  import("./components/pages/RegisterPage").then((m) => ({
    default: m.RegisterPage,
  }))
);
const PropertiesPage = lazy(() =>
  import("./components/pages/PropertiesPage").then((m) => ({
    default: m.PropertiesPage,
  }))
);
const PropertyDetailsPage = lazy(() =>
  import("./components/pages/PropertyDetailsPage").then((m) => ({
    default: m.PropertyDetailsPage,
  }))
);
const BookingConfirmationPage = lazy(() =>
  import("./components/pages/BookingConfirmationPage").then((m) => ({
    default: m.BookingConfirmationPage,
  }))
);
const RenterDashboard = lazy(() =>
  import("./components/dashboard/renter/RenterDashboard").then((m) => ({
    default: m.RenterDashboard,
  }))
);
const OwnerDashboard = lazy(() =>
  import("./components/dashboard/owner/OwnerDashboard").then((m) => ({
    default: m.OwnerDashboard,
  }))
);
const AdminDashboard = lazy(() =>
  import("./components/dashboard/admin/AdminDashboard").then((m) => ({
    default: m.AdminDashboard,
  }))
);
const ForgotPasswordPage = lazy(() =>
  import("./components/pages/ForgotPasswordPage").then((m) => ({
    default: m.ForgotPasswordPage,
  }))
);
const AboutUsPage = lazy(() =>
  import("./components/pages/AboutUsPage").then((m) => ({
    default: m.AboutUsPage,
  }))
);
const ContactPage = lazy(() =>
  import("./components/pages/ContactPage").then((m) => ({
    default: m.ContactPage,
  }))
);
const FAQPage = lazy(() =>
  import("./components/pages/FAQPage").then((m) => ({ default: m.FAQPage }))
);
const SupportPage = lazy(() =>
  import("./components/pages/SupportPage").then((m) => ({
    default: m.SupportPage,
  }))
);
const PrivacyPolicyPage = lazy(() =>
  import("./components/pages/PrivacyPolicyPage").then((m) => ({
    default: m.PrivacyPolicyPage,
  }))
);
const TermsConditionsPage = lazy(() =>
  import("./components/pages/TermsConditionsPage").then((m) => ({
    default: m.TermsConditionsPage,
  }))
);

// Loading Fallback Component
function LoadingFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <Loader2 className="w-12 h-12 text-[#00BFA6] animate-spin mx-auto mb-4" />
        <p className="text-gray-600 text-lg">Loading...</p>
      </div>
    </div>
  );
}

export interface User {
  userId: number;
  name: string;
  email: string;
  role: "renter" | "owner" | "admin";
  avatar?: string;
  phoneNumber?: string;
  isActive?: boolean;
  userType?: string;
  profilePhoto?: string;
}

// Protected Route Component
function ProtectedRoute({
  children,
  allowedRoles,
}: {
  children: React.ReactNode;
  allowedRoles?: ("renter" | "owner" | "admin")[];
}) {
  const token = localStorage.getItem("authToken");
  const location = useLocation();

  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}

// Main App Layout Component
function AppLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [language, setLanguage] = useState<Language>("en");
  const [isNewHost, setIsNewHost] = useState(false);

  // Check auth on mount
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("authToken");
      if (token) {
        try {
          const userProfile = await api.getProfile();
          const user: User = {
            userId: userProfile.userId,
            name: userProfile.firstName + " " + userProfile.lastName,
            email: userProfile.email,
            role:
              userProfile.userType === "landlord"
                ? "owner"
                : userProfile.userType === "admin"
                ? "admin"
                : "renter",
            avatar: userProfile.profilePhoto,
            profilePhoto: userProfile.profilePhoto,
            phoneNumber: userProfile.phoneNumber,
            isActive: userProfile.isActive,
            userType: userProfile.userType,
          };
          setUser(user);
        } catch (error) {
          localStorage.removeItem("authToken");
        }
      }
    };

    checkAuth();
  }, []);

  // Apply RTL direction
  useEffect(() => {
    document.documentElement.dir = language === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = language;
  }, [language]);

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [location.pathname]);

  // Navigation handler
  const handleNavigate = (
    page: string,
    propertyId?: string,
    searchParams?: URLSearchParams
  ) => {
    const [pageName, queryString] = page.split("?");
    const params = new URLSearchParams(queryString || "");

    const routeMap: Record<string, string> = {
      home: "/",
      login: "/login",
      register:
        params.get("role") === "owner" ? "/register?role=owner" : "/register",
      "forgot-password": "/forgot-password",
      properties: "/properties",
      "property-details": propertyId
        ? `/properties/${propertyId}`
        : "/properties",
      "booking-confirmation": "/booking/confirmation",
      "user-dashboard": "/dashboard/renter",
      "owner-dashboard": "/dashboard/owner",
      "admin-dashboard": "/dashboard/admin",
      about: "/about",
      contact: "/contact",
      faq: "/faq",
      support: "/support",
      "privacy-policy": "/privacy",
      terms: "/terms",
    };

    let route = routeMap[pageName] || "/";
    if (searchParams && searchParams.toString()) {
      route += `?${searchParams.toString()}`;
    }
    navigate(route);
  };

  const handleHostRegistration = () => {
    setIsNewHost(true);
    navigate("/dashboard/owner");
  };

  // Login handler
  const handleLogin = async (email: string, password: string) => {
    try {
      const response = await api.login(email, password);
      const userProfile = await api.getProfile();

      const user: User = {
        userId: userProfile.userId,
        name: userProfile.firstName + " " + userProfile.lastName,
        email: userProfile.email,
        role:
          userProfile.userType === "landlord"
            ? "owner"
            : userProfile.userType === "admin"
            ? "admin"
            : "renter",
        avatar: userProfile.profilePhoto,
        profilePhoto: userProfile.profilePhoto,
        phoneNumber: userProfile.phoneNumber,
        isActive: userProfile.isActive,
        userType: userProfile.userType,
      };

      setUser(user);
      toast.success(`Welcome back, ${user.name}!`);

      let targetRoute: string;
      if (userProfile.userType === "admin") {
        targetRoute = "/dashboard/admin";
      } else if (userProfile.userType === "landlord") {
        targetRoute = "/dashboard/owner";
      } else {
        targetRoute = "/dashboard/renter";
      }

      setTimeout(() => {
        navigate(targetRoute);
      }, 100);
    } catch (error: any) {
      const errorMessage =
        error?.message ||
        error?.data?.message ||
        "Login failed. Please check your credentials.";
      toast.error(errorMessage);
      throw error;
    }
  };

  // Register handler
  const handleRegister = async (
    name: string,
    email: string,
    password: string,
    role: "renter" | "owner"
  ) => {
    try {
      const [firstName, lastName] = name.split(" ");
      const response = await api.register({
        email,
        password,
        phoneNumber: "",
        firstName: firstName || name,
        lastName: lastName || "",
        userType: role === "owner" ? "landlord" : "renter",
      });

      const userProfile = await api.getProfile();

      const newUser: User = {
        userId: userProfile.userId,
        name: userProfile.firstName + " " + userProfile.lastName,
        email: userProfile.email,
        role:
          userProfile.userType === "landlord"
            ? "owner"
            : userProfile.userType === "admin"
            ? "admin"
            : "renter",
        avatar: userProfile.profilePhoto,
        profilePhoto: userProfile.profilePhoto,
        phoneNumber: userProfile.phoneNumber,
        isActive: userProfile.isActive,
        userType: userProfile.userType,
      };

      setUser(newUser);
      toast.success(`Welcome to Ajarly, ${newUser.name}!`);

      await new Promise((resolve) => setTimeout(resolve, 150));

      if (role === "owner") {
        setIsNewHost(true);
        navigate("/dashboard/owner");
      } else {
        navigate("/dashboard/renter");
      }
    } catch (error: any) {
      const errorMessage =
        error?.message ||
        error?.data?.message ||
        "Registration failed. Please try again.";
      toast.error(errorMessage);
      throw error;
    }
  };

  // Logout handler
  const handleLogout = async () => {
    try {
      await api.logout();
      setUser(null);
      toast.success("Logged out successfully!");
      setTimeout(() => {
        navigate("/");
      }, 100);
    } catch (error) {
      setUser(null);
      navigate("/");
    }
  };

  const hideNavFooter = [
    "/login",
    "/register",
    "/booking/confirmation",
    "/forgot-password",
  ];
  const showNavbar = !hideNavFooter.some((path) =>
    location.pathname.startsWith(path)
  );
  const showFooter = showNavbar;

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {showNavbar && (
        <Navbar
          onNavigate={handleNavigate}
          currentPage={location.pathname}
          user={user}
          onLogout={handleLogout}
          language={language}
          onLanguageChange={setLanguage}
        />
      )}

      <main className="flex-1">
        <Suspense fallback={<LoadingFallback />}>
          <Routes>
            {/* Public Routes */}
            <Route
              path="/"
              element={
                <HomePage
                  onNavigate={handleNavigate}
                  language={language}
                  user={user}
                />
              }
            />

            <Route
              path="/properties"
              element={
                <PropertiesPage
                  onNavigate={handleNavigate}
                  language={language}
                />
              }
            />

            <Route
              path="/properties/:id"
              element={
                <PropertyDetailsPage
                  onNavigate={handleNavigate}
                  language={language}
                />
              }
            />

            <Route
              path="/about"
              element={
                <AboutUsPage onNavigate={handleNavigate} language={language} />
              }
            />

            <Route
              path="/contact"
              element={
                <ContactPage onNavigate={handleNavigate} language={language} />
              }
            />

            <Route
              path="/faq"
              element={
                <FAQPage onNavigate={handleNavigate} language={language} />
              }
            />

            <Route
              path="/support"
              element={
                <SupportPage onNavigate={handleNavigate} language={language} />
              }
            />

            <Route
              path="/privacy"
              element={
                <PrivacyPolicyPage
                  onNavigate={handleNavigate}
                  language={language}
                />
              }
            />

            <Route
              path="/terms"
              element={
                <TermsConditionsPage
                  onNavigate={handleNavigate}
                  language={language}
                />
              }
            />

            {/* Auth Routes */}
            <Route
              path="/login"
              element={
                <LoginPage
                  onNavigate={handleNavigate}
                  onLogin={handleLogin}
                  language={language}
                  onLanguageChange={setLanguage}
                />
              }
            />

            <Route
              path="/register"
              element={
                <RegisterPage
                  onNavigate={handleNavigate}
                  initialRole={
                    new URLSearchParams(location.search).get("role") === "owner"
                      ? "owner"
                      : "renter"
                  }
                  onRegister={handleRegister}
                  language={language}
                  onLanguageChange={setLanguage}
                />
              }
            />

            <Route
              path="/forgot-password"
              element={
                <ForgotPasswordPage
                  onNavigate={handleNavigate}
                  language={language}
                  onLanguageChange={setLanguage}
                />
              }
            />

            {/* Booking Route */}
            <Route
              path="/booking/confirmation"
              element={
                <BookingConfirmationPage
                  onNavigate={handleNavigate}
                  language={language}
                />
              }
            />

            {/* Protected Dashboard Routes */}
            <Route
              path="/dashboard/renter/*"
              element={
                <ProtectedRoute allowedRoles={["renter"]}>
                  <RenterDashboard
                    onNavigate={handleNavigate}
                    currentUser={user}
                    onUserUpdate={setUser}
                    language={language}
                  />
                </ProtectedRoute>
              }
            />

            <Route
              path="/dashboard/owner/*"
              element={
                <ProtectedRoute allowedRoles={["owner"]}>
                  <OwnerDashboard
                    onNavigate={handleNavigate}
                    showAddPropertyOnMount={isNewHost}
                    language={language}
                  />
                </ProtectedRoute>
              }
            />

            <Route
              path="/dashboard/admin/*"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <AdminDashboard
                    onNavigate={handleNavigate}
                    language={language}
                  />
                </ProtectedRoute>
              }
            />

            {/* Catch all - redirect to home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </main>

      {showFooter && <Footer onNavigate={handleNavigate} language={language} />}

      <Toaster position="top-right" richColors closeButton duration={4000} />
    </div>
  );
}

export default function App() {
  return (
    <FavoritesProvider>
      <Router>
        <AppLayout />
      </Router>
    </FavoritesProvider>
  );
}
