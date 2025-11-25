import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { PropertyCard } from "../PropertyCard";
import { Button } from "../ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Slider } from "../ui/slider";
import { Switch } from "../ui/switch";
import { Label } from "../ui/label";
import { Search, SlidersHorizontal, Loader2, X } from "lucide-react";
import api, { PropertyResponse, SearchRequest } from "../../../api";
import { toast } from "sonner";
import { Language, translations } from "../../lib/translations";
import { SearchBar, SearchParams } from "./home/SearchBar";

interface PropertiesPageProps {
  onNavigate: (page: string, propertyId?: string) => void;
  language?: Language;
}

export function PropertiesPage({
  onNavigate,
  language = "en",
}: PropertiesPageProps) {
  const t = translations[language]?.home || translations.en.home;

  const [urlSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const [properties, setProperties] = useState<PropertyResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  // Parse URL search params from React Router
  const initialGovernorate = urlSearchParams.get("governorate") ?? "";
  const initialCheckIn = urlSearchParams.get("checkInDate") ?? "";
  const initialCheckOut = urlSearchParams.get("checkOutDate") ?? "";
  const initialGuests = urlSearchParams.get("minGuests") ?? "";

  // Search filters - Initialize with URL params
  const [governorate, setGovernorate] = useState(initialGovernorate);
  const [city, setCity] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const [rentalType, setRentalType] = useState("");
  const [priceRange, setPriceRange] = useState([0, 50000]);
  const [bedrooms, setBedrooms] = useState(initialGuests);
  const [furnished, setFurnished] = useState<boolean | undefined>(undefined);
  const [petsAllowed, setPetsAllowed] = useState<boolean | undefined>(
    undefined
  );
  const [sortBy, setSortBy] = useState("recommended");

  // Date filters
  const [checkInDate, setCheckInDate] = useState(initialCheckIn);
  const [checkOutDate, setCheckOutDate] = useState(initialCheckOut);

  const [governorates, setGovernorates] = useState<string[]>([]);
  const [cities, setCities] = useState<string[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    setIsLoggedIn(!!token);

    loadGovernorates();
  }, []);

  // Search when URL params change
  useEffect(() => {
    searchProperties();
  }, [urlSearchParams]);

  useEffect(() => {
    if (governorate) {
      loadCities(governorate);
    }
  }, [governorate]);

  // ✅ NEW: Trigger search when sortBy changes
  useEffect(() => {
    if (!loading) {
      searchProperties();
    }
  }, [sortBy]);

  const loadGovernorates = async () => {
    try {
      const data = await api.getGovernorates();
      setGovernorates(data || []);
    } catch (err) {
      console.error("Error loading governorates:", err);
    }
  };

  const loadCities = async (gov: string) => {
    try {
      const data = await api.getCities(gov);
      setCities(data || []);
    } catch (err) {
      console.error("Error loading cities:", err);
    }
  };

  const searchProperties = async () => {
    try {
      setLoading(true);

      // Determine sort direction based on sort type
      let sortDirection: "ASC" | "DESC" = "DESC";
      let sortField = sortBy;

      if (sortBy === "recommended") {
        sortField = "averageRating";
        sortDirection = "DESC";
      } else if (sortBy === "pricePerNight") {
        sortDirection = "ASC"; // Low to high for price
      } else if (sortBy === "pricePerNightDesc") {
        sortField = "pricePerNight";
        sortDirection = "DESC"; // High to low for price
      } else if (sortBy === "averageRating") {
        sortDirection = "DESC"; // High to low for rating
      } else if (sortBy === "createdAt") {
        sortDirection = "DESC"; // Newest first
      }

      const searchRequest: SearchRequest = {
        governorate: governorate || undefined,
        city: city || undefined,
        propertyType: propertyType || undefined,
        rentalType: rentalType || undefined,
        minPrice: priceRange[0] > 0 ? priceRange[0] : undefined,
        maxPrice: priceRange[1] < 50000 ? priceRange[1] : undefined,
        minBedrooms: bedrooms ? parseInt(bedrooms) : undefined,
        furnished: furnished,
        petsAllowed: petsAllowed,
        checkInDate: checkInDate || undefined,
        checkOutDate: checkOutDate || undefined,
        sortBy: sortField,
        sortDirection: sortDirection,
        page: 0,
        size: 20,
      };

      const response = await api.advancedSearch(searchRequest);

      if (response && Array.isArray(response.properties)) {
        setProperties(response.properties);
      } else {
        setProperties([]);
      }
    } catch (err: any) {
      console.error("❌ Search error:", err);
      toast.error("Failed to load properties");
      setProperties([]);
    } finally {
      setLoading(false);
    }
  };

  // ✅ FIXED: Update URL params when searching from sticky bar
  const handleStickySearch = (params: SearchParams) => {
    console.log("🔍 Sticky search triggered:", params);

    // Update filters
    setGovernorate(params.location);
    setBedrooms(params.guests);

    if (params.checkIn) {
      setCheckInDate(params.checkIn.toISOString().split("T")[0]);
    } else {
      setCheckInDate("");
    }

    if (params.checkOut) {
      setCheckOutDate(params.checkOut.toISOString().split("T")[0]);
    } else {
      setCheckOutDate("");
    }

    // ✅ Update URL parameters
    const urlParams = new URLSearchParams();
    if (params.location) {
      urlParams.set("governorate", params.location);
    }
    if (params.checkIn) {
      urlParams.set("checkInDate", params.checkIn.toISOString().split("T")[0]);
    }
    if (params.checkOut) {
      urlParams.set(
        "checkOutDate",
        params.checkOut.toISOString().split("T")[0]
      );
    }
    if (params.guests) {
      urlParams.set("minGuests", params.guests);
    }

    // Navigate with new params (this will trigger the search via useEffect)
    navigate(`/properties?${urlParams.toString()}`, { replace: true });
  };

  const handleSearch = () => {
    searchProperties();
  };

  const handleReset = () => {
    setGovernorate("");
    setCity("");
    setPropertyType("");
    setRentalType("");
    setPriceRange([0, 50000]);
    setBedrooms("");
    setFurnished(undefined);
    setPetsAllowed(undefined);
    setSortBy("recommended");
    setCheckInDate("");
    setCheckOutDate("");

    // Clear URL params
    navigate("/properties", { replace: true });
  };

  const activeFilters = [
    governorate && { label: `📍 ${governorate}`, key: "location" },
    checkInDate &&
      checkOutDate && {
        label: `📅 ${checkInDate} → ${checkOutDate}`,
        key: "dates",
      },
    bedrooms && { label: `👥 ${bedrooms}+ guests`, key: "guests" },
    propertyType && { label: `🏠 ${propertyType}`, key: "type" },
    rentalType && { label: `⏰ ${rentalType}`, key: "rental" },
  ].filter(Boolean);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sticky Search Bar */}
      <div className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <SearchBar
            t={t}
            language={language}
            governorates={governorates}
            isSearchFocused={isSearchFocused}
            onFocusChange={setIsSearchFocused}
            onSearch={handleStickySearch}
            compact={true}
            initialValues={{
              location: governorate,
              checkIn: checkInDate ? new Date(checkInDate) : undefined,
              checkOut: checkOutDate ? new Date(checkOutDate) : undefined,
              guests: bedrooms,
            }}
          />
        </div>
      </div>

      {/* Header */}
      <div className="bg-white border-b border-gray-200 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-semibold text-[#2B2B2B]">
                {language === "ar"
                  ? "العقارات المتاحة"
                  : "Available Properties"}
              </h1>
              <p className="text-gray-600 mt-1">
                {loading ? (
                  language === "ar" ? (
                    "جاري التحميل..."
                  ) : (
                    "Loading..."
                  )
                ) : (
                  <>
                    {properties.length}{" "}
                    {language === "ar"
                      ? "عقار متاح"
                      : `propert${
                          properties.length === 1 ? "y" : "ies"
                        } available`}
                  </>
                )}
              </p>

              {/* Active Filters */}
              {activeFilters.length > 0 && (
                <div className="flex gap-2 mt-3 flex-wrap">
                  {activeFilters.map((filter: any) => (
                    <span
                      key={filter.key}
                      className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm bg-[#00BFA6]/10 text-[#00BFA6] border border-[#00BFA6]/20"
                    >
                      {filter.label}
                      <button
                        onClick={() => {
                          if (filter.key === "location") setGovernorate("");
                          if (filter.key === "dates") {
                            setCheckInDate("");
                            setCheckOutDate("");
                          }
                          if (filter.key === "guests") setBedrooms("");
                          if (filter.key === "type") setPropertyType("");
                          if (filter.key === "rental") setRentalType("");
                          setTimeout(() => searchProperties(), 100);
                        }}
                        className="hover:bg-[#00BFA6]/20 rounded-full p-0.5"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                  <button
                    onClick={handleReset}
                    className="text-sm text-gray-500 hover:text-gray-700 underline"
                  >
                    Clear all
                  </button>
                </div>
              )}
            </div>

            <Button
              onClick={() => setShowFilters(!showFilters)}
              variant="outline"
              className="flex items-center gap-2"
            >
              <SlidersHorizontal className="w-4 h-4" />
              {language === "ar" ? "الفلاتر" : "Filters"}
              {activeFilters.length > 0 && (
                <span className="ml-1 px-2 py-0.5 bg-[#00BFA6] text-white text-xs rounded-full">
                  {activeFilters.length}
                </span>
              )}
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Filters Sidebar */}
          {showFilters && (
            <div className="w-80 flex-shrink-0">
              <div className="bg-white rounded-lg shadow-sm p-6 space-y-6 sticky top-32">
                <h3 className="font-semibold text-lg text-[#2B2B2B]">
                  {language === "ar" ? "تصفية النتائج" : "Filter Results"}
                </h3>

                <div className="space-y-3">
                  <Label>{language === "ar" ? "الموقع" : "Location"}</Label>
                  <Select value={governorate} onValueChange={setGovernorate}>
                    <SelectTrigger>
                      <SelectValue
                        placeholder={
                          language === "ar" ? "المحافظة" : "Governorate"
                        }
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {governorates.map((gov) => (
                        <SelectItem key={gov} value={gov}>
                          {gov}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {governorate && (
                    <Select value={city} onValueChange={setCity}>
                      <SelectTrigger>
                        <SelectValue
                          placeholder={language === "ar" ? "المدينة" : "City"}
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {cities.map((c) => (
                          <SelectItem key={c} value={c}>
                            {c}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                </div>

                <div className="space-y-3">
                  <Label>
                    {language === "ar" ? "نوع العقار" : "Property Type"}
                  </Label>
                  <Select value={propertyType} onValueChange={setPropertyType}>
                    <SelectTrigger>
                      <SelectValue
                        placeholder={
                          language === "ar" ? "اختر النوع" : "Select type"
                        }
                      />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="apartment">
                        {language === "ar" ? "شقة" : "Apartment"}
                      </SelectItem>
                      <SelectItem value="villa">
                        {language === "ar" ? "فيلا" : "Villa"}
                      </SelectItem>
                      <SelectItem value="chalet">
                        {language === "ar" ? "شاليه" : "Chalet"}
                      </SelectItem>
                      <SelectItem value="studio">
                        {language === "ar" ? "استوديو" : "Studio"}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3">
                  <Label>
                    {language === "ar" ? "نوع الإيجار" : "Rental Type"}
                  </Label>
                  <Select value={rentalType} onValueChange={setRentalType}>
                    <SelectTrigger>
                      <SelectValue
                        placeholder={
                          language === "ar" ? "اختر المدة" : "Select duration"
                        }
                      />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">
                        {language === "ar" ? "يومي" : "Daily"}
                      </SelectItem>
                      <SelectItem value="weekly">
                        {language === "ar" ? "أسبوعي" : "Weekly"}
                      </SelectItem>
                      <SelectItem value="monthly">
                        {language === "ar" ? "شهري" : "Monthly"}
                      </SelectItem>
                      <SelectItem value="yearly">
                        {language === "ar" ? "سنوي" : "Yearly"}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3">
                  <Label>
                    {language === "ar" ? "السعر" : "Price Range"}:{" "}
                    {priceRange[0]} - {priceRange[1]} EGP
                  </Label>
                  <Slider
                    min={0}
                    max={50000}
                    step={500}
                    value={priceRange}
                    onValueChange={setPriceRange}
                  />
                </div>

                <div className="space-y-3">
                  <Label>{language === "ar" ? "عدد الغرف" : "Bedrooms"}</Label>
                  <Select value={bedrooms} onValueChange={setBedrooms}>
                    <SelectTrigger>
                      <SelectValue
                        placeholder={language === "ar" ? "أي عدد" : "Any"}
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {[1, 2, 3, 4, 5].map((num) => (
                        <SelectItem key={num} value={num.toString()}>
                          {num}+ {language === "ar" ? "غرف" : "bedrooms"}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between">
                  <Label>{language === "ar" ? "مفروش" : "Furnished"}</Label>
                  <Switch
                    checked={furnished || false}
                    onCheckedChange={setFurnished}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label>
                    {language === "ar" ? "يسمح بالحيوانات" : "Pets Allowed"}
                  </Label>
                  <Switch
                    checked={petsAllowed || false}
                    onCheckedChange={setPetsAllowed}
                  />
                </div>

                <div className="space-y-2 pt-4">
                  <Button
                    onClick={handleSearch}
                    className="w-full bg-[#00BFA6] hover:bg-[#00A890]"
                  >
                    <Search className="w-4 h-4 mr-2" />
                    {language === "ar" ? "بحث" : "Search"}
                  </Button>
                  <Button
                    onClick={handleReset}
                    variant="outline"
                    className="w-full"
                  >
                    {language === "ar" ? "إعادة تعيين" : "Reset Filters"}
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Properties Grid */}
          <div className="flex-1">
            <div className="mb-6 flex items-center justify-between">
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-48">
                  <SelectValue
                    placeholder={language === "ar" ? "ترتيب حسب" : "Sort by"}
                  />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recommended">
                    {language === "ar" ? "موصى به" : "Recommended"}
                  </SelectItem>
                  <SelectItem value="pricePerNight">
                    {language === "ar"
                      ? "السعر: من الأقل للأعلى"
                      : "Price: Low to High"}
                  </SelectItem>
                  <SelectItem value="pricePerNightDesc">
                    {language === "ar"
                      ? "السعر: من الأعلى للأقل"
                      : "Price: High to Low"}
                  </SelectItem>
                  <SelectItem value="averageRating">
                    {language === "ar" ? "الأعلى تقييماً" : "Highest Rated"}
                  </SelectItem>
                  <SelectItem value="createdAt">
                    {language === "ar" ? "الأحدث" : "Newest"}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {loading && (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="w-10 h-10 text-[#00BFA6] animate-spin" />
              </div>
            )}

            {!loading && properties.length === 0 && (
              <div className="text-center py-20">
                <p className="text-gray-600 text-lg">
                  {language === "ar"
                    ? "لا توجد عقارات متاحة"
                    : "No properties found"}
                </p>
                <Button
                  onClick={handleReset}
                  variant="outline"
                  className="mt-4"
                >
                  {language === "ar" ? "مسح الفلاتر" : "Clear Filters"}
                </Button>
              </div>
            )}

            {!loading && properties.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {properties.map((property) => (
                  <PropertyCard
                    key={property.propertyId}
                    property={property}
                    onNavigate={onNavigate}
                    language={language}
                    showFavorite={isLoggedIn}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
