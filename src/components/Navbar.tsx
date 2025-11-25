// src/components/Navbar.tsx - Fixed Profile Photo Display
import { useState, useEffect } from "react";
import {
  Menu,
  Globe,
  Heart,
  Star,
  User,
  LogOut,
  LayoutDashboard,
} from "lucide-react";
import { Button } from "./ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
  SheetDescription,
} from "./ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "./ui/dropdown-menu";
import { Badge } from "./ui/badge";
import { User as UserType } from "../App";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useFavorites } from "../contexts/FavoritesContext";
import { FavoriteButton } from "./dashboard/shared/components/FavoriteButton";
import logo from "../assets/Logo.svg";
import { useProfile } from "../hooks/useProfile";

interface NavbarProps {
  onNavigate?: (page: string, propertyId?: string) => void;
  currentPage?: string;
  user?: UserType | null;
  onLogout?: () => void;
  language?: "en" | "ar";
  onLanguageChange?: (language: "en" | "ar") => void;
}

export function Navbar({
  onNavigate,
  currentPage = "home",
  user = null,
  onLogout,
  language = "en",
  onLanguageChange,
}: NavbarProps) {
  const [localLanguage, setLocalLanguage] = useState<"en" | "ar">(language);
  const { favorites } = useFavorites();
  const { profile, fetchProfile } = useProfile();

  // Fetch profile when user logs in
  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  // Log when profile updates
  useEffect(() => {
    if (profile) {
    }
  }, [profile]);

  const toggleLanguage = () => {
    const newLang = localLanguage === "en" ? "ar" : "en";
    setLocalLanguage(newLang);
    if (onLanguageChange) {
      onLanguageChange(newLang);
    }
  };

  const handleNavigation = (page: string, propertyId?: string) => {
    if (onNavigate) {
      onNavigate(page, propertyId);
    }
  };

  const getDashboardPage = () => {
    if (!user) return "user-dashboard";

    if (user.userType === "landlord") return "owner-dashboard";
    if (user.userType === "admin") return "admin-dashboard";
    if (user.role === "owner") return "owner-dashboard";
    if (user.role === "admin") return "admin-dashboard";

    return "user-dashboard";
  };

  const isArabic = localLanguage === "ar";

  // Get user initials for fallback
  const getUserInitials = () => {
    if (!user) return "U";
    const names = user.name.split(" ");
    if (names.length >= 2) {
      return `${names[0].charAt(0)}${names[1].charAt(0)}`.toUpperCase();
    }
    return user.name.charAt(0).toUpperCase();
  };

  // Get profile photo - prioritize user prop, then profile from hook
  const getProfilePhoto = () => {
    return user?.profilePhoto || user?.avatar || profile?.profilePhoto || null;
  };

  return (
    <nav className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <button
            onClick={() => handleNavigation("home")}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <div>
              <img src={logo} alt="Logo" className="w-32 h-32 " />
            </div>
          </button>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <button
              onClick={() => handleNavigation("properties")}
              className="text-[#2B2B2B] hover:text-[#00BFA6] transition-colors"
            >
              {isArabic ? "استكشف" : "Explore"}
            </button>
            <button
              onClick={() => handleNavigation("register?role=owner")}
              className="text-[#2B2B2B] hover:text-[#00BFA6] transition-colors"
            >
              {isArabic ? "كن مضيفاً" : "Become a Host"}
            </button>

            {/* Favourites with Context */}
            {user && (
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative">
                    <Heart className="w-5 h-5" />
                    {favorites.length > 0 && (
                      <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-[#FF6B6B] hover:bg-[#FF6B6B]">
                        {favorites.length}
                      </Badge>
                    )}
                  </Button>
                </SheetTrigger>
                <SheetContent className="w-full sm:max-w-md">
                  <SheetTitle className="text-2xl font-semibold text-[#2B2B2B] mb-6">
                    {isArabic ? "المفضلة" : "Favourites"}
                  </SheetTitle>
                  <SheetDescription className="sr-only">
                    {isArabic
                      ? "قائمة العقارات المفضلة لديك"
                      : "Your saved favourite properties"}
                  </SheetDescription>
                  <div className="flex flex-col h-full">
                    {favorites.length === 0 ? (
                      <div className="flex-1 flex flex-col items-center justify-center text-center px-4">
                        <Heart className="w-16 h-16 text-gray-300 mb-4" />
                        <h3 className="text-xl font-semibold text-[#2B2B2B] mb-2">
                          {isArabic
                            ? "لا توجد مفضلات بعد"
                            : "No favourites yet"}
                        </h3>
                        <p className="text-gray-600 mb-6">
                          {isArabic
                            ? "ابدأ بإضافة عقارات إلى قائمة المفضلة الخاصة بك"
                            : "Start adding properties to your favourites list"}
                        </p>
                        <Button
                          onClick={() => handleNavigation("properties")}
                          className="bg-[#00BFA6] hover:bg-[#00A890]"
                        >
                          {isArabic ? "استكشف العقارات" : "Explore Properties"}
                        </Button>
                      </div>
                    ) : (
                      <div className="flex-1 overflow-y-auto space-y-4">
                        {favorites.map((favorite) => (
                          <div
                            key={favorite.favoriteId}
                            className="group flex gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                          >
                            <div
                              className="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0 cursor-pointer bg-gray-200"
                              onClick={() => {
                                if (onNavigate) {
                                  onNavigate(
                                    "property-details",
                                    String(favorite.property.propertyId)
                                  );
                                }
                              }}
                            >
                              {favorite.property.coverImage ? (
                                <img
                                  src={favorite.property.coverImage}
                                  alt={
                                    favorite.property.titleEn ||
                                    favorite.property.titleAr ||
                                    "Property"
                                  }
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    e.currentTarget.style.display = "none";
                                  }}
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <Heart className="w-8 h-8 text-gray-400" />
                                </div>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3
                                className="font-semibold text-[#2B2B2B] line-clamp-1 cursor-pointer hover:text-[#00BFA6]"
                                onClick={() => {
                                  if (onNavigate) {
                                    onNavigate(
                                      "property-details",
                                      String(favorite.property.propertyId)
                                    );
                                  }
                                }}
                              >
                                {favorite.property.titleEn ||
                                  favorite.property.titleAr}
                              </h3>
                              <p className="text-sm text-gray-600 line-clamp-1">
                                {favorite.property.city},{" "}
                                {favorite.property.governorate}
                              </p>
                              {favorite.property.averageRating > 0 && (
                                <div className="flex items-center gap-1 mt-1">
                                  <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                                  <span className="text-sm">
                                    {favorite.property.averageRating.toFixed(1)}
                                  </span>
                                </div>
                              )}
                              <p className="text-sm font-semibold text-[#2B2B2B] mt-1">
                                {favorite.property.pricePerNight?.toLocaleString() ||
                                  0}{" "}
                                EGP / {isArabic ? "ليلة" : "night"}
                              </p>
                            </div>
                            <div className="flex-shrink-0">
                              <FavoriteButton
                                property={favorite.property}
                                size="sm"
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </SheetContent>
              </Sheet>
            )}

            {/* Language Toggle */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="gap-2">
                  <Globe className="w-4 h-4" />
                  <span>{localLanguage.toUpperCase()}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={() => {
                    setLocalLanguage("en");
                    if (onLanguageChange) onLanguageChange("en");
                  }}
                >
                  English
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    setLocalLanguage("ar");
                    if (onLanguageChange) onLanguageChange("ar");
                  }}
                >
                  العربية
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* User Menu or Auth Buttons */}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="gap-2">
                    <Avatar className="w-8 h-8">
                      {getProfilePhoto() && (
                        <AvatarImage
                          src={getProfilePhoto()!}
                          alt={user.name}
                          className="object-cover"
                        />
                      )}
                      <AvatarFallback className="bg-[#00BFA6] text-white">
                        {getUserInitials()}
                      </AvatarFallback>
                    </Avatar>
                    <span className="hidden lg:inline">{user.name}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="px-2 py-1.5">
                    <p className="text-sm font-semibold text-[#2B2B2B]">
                      {user.name}
                    </p>
                    <p className="text-xs text-gray-600">{user.email}</p>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => handleNavigation(getDashboardPage())}
                    className="cursor-pointer"
                  >
                    <LayoutDashboard className="w-4 h-4 mr-2" />
                    {isArabic ? "لوحة التحكم" : "Dashboard"}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={onLogout}
                    className="text-red-600 cursor-pointer"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    {isArabic ? "تسجيل الخروج" : "Log out"}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Button
                  variant="outline"
                  onClick={() => handleNavigation("login")}
                  className="border-[#00BFA6] text-[#00BFA6] hover:bg-[#00BFA6] hover:text-white"
                >
                  {isArabic ? "تسجيل الدخول" : "Log in"}
                </Button>
                <Button
                  onClick={() => handleNavigation("register")}
                  className="bg-[#FF6B6B] text-white hover:bg-[#FF5252]"
                >
                  {isArabic ? "إنشاء حساب" : "Sign up"}
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu */}
          <Sheet>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="w-6 h-6" />
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetTitle className="text-2xl font-semibold text-[#2B2B2B] mb-6">
                {isArabic ? "القائمة" : "Menu"}
              </SheetTitle>
              <SheetDescription className="sr-only">
                {isArabic ? "قائمة التنقل الرئيسية" : "Main navigation menu"}
              </SheetDescription>
              <div className="flex flex-col gap-6 mt-8">
                {user ? (
                  <>
                    <div className="pb-4 border-b flex items-center gap-3">
                      <Avatar className="w-12 h-12">
                        {getProfilePhoto() && (
                          <AvatarImage
                            src={getProfilePhoto()!}
                            alt={user.name}
                            className="object-cover"
                          />
                        )}
                        <AvatarFallback className="bg-[#00BFA6] text-white">
                          {getUserInitials()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-semibold text-[#2B2B2B]">
                          {user.name}
                        </p>
                        <p className="text-xs text-gray-600">{user.email}</p>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      onClick={() => handleNavigation(getDashboardPage())}
                      className="justify-start gap-2 border-[#00BFA6] text-[#00BFA6]"
                    >
                      <LayoutDashboard className="w-4 h-4" />
                      {isArabic ? "لوحة التحكم" : "Dashboard"}
                    </Button>
                    <button
                      onClick={() => handleNavigation("properties")}
                      className="text-left text-lg text-[#2B2B2B] hover:text-[#00BFA6] transition-colors"
                    >
                      {isArabic ? "استكشف" : "Explore"}
                    </button>
                    <Button
                      variant="outline"
                      onClick={onLogout}
                      className="justify-start gap-2 border-red-600 text-red-600"
                    >
                      <LogOut className="w-4 h-4" />
                      {isArabic ? "تسجيل الخروج" : "Log out"}
                    </Button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => handleNavigation("properties")}
                      className="text-left text-lg text-[#2B2B2B] hover:text-[#00BFA6] transition-colors"
                    >
                      {isArabic ? "استكشف" : "Explore"}
                    </button>
                    <button
                      onClick={() => handleNavigation("register?role=owner")}
                      className="text-left text-lg text-[#2B2B2B] hover:text-[#00BFA6] transition-colors"
                    >
                      {isArabic ? "كن مضيفاً" : "Become a Host"}
                    </button>
                    <Button
                      variant="outline"
                      onClick={() => handleNavigation("login")}
                      className="justify-start border-[#00BFA6] text-[#00BFA6]"
                    >
                      {isArabic ? "تسجيل الدخول" : "Log in"}
                    </Button>
                    <Button
                      onClick={() => handleNavigation("register")}
                      className="justify-start bg-[#FF6B6B] text-white"
                    >
                      {isArabic ? "إنشاء حساب" : "Sign up"}
                    </Button>
                  </>
                )}
                <Button
                  variant="ghost"
                  onClick={toggleLanguage}
                  className="justify-start gap-2"
                >
                  <Globe className="w-4 h-4" />
                  <span>{localLanguage === "en" ? "العربية" : "English"}</span>
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}
