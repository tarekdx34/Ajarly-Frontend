import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Language, translations } from "../../lib/translations";
import { HeroSection } from "./home/HeroSection";
import { SearchParams } from "./home/SearchBar";
import { PopularLocations } from "./home/PopularLocations";
import { Categories } from "./home/Categories";
import { FeaturedProperties } from "./home/FeaturedProperties";
import { WhyAjarly } from "./home/WhyAjarly";
import { HostCTA } from "./home/HostCTA";
import { useHomeData } from "./home/useHomeData";

interface HomePageProps {
  onNavigate: (
    page: string,
    propertyId?: string,
    searchParams?: URLSearchParams
  ) => void;
  language?: Language;
  user?: any | null;
}

export function HomePage({ onNavigate, language = "en", user }: HomePageProps) {
  const t = translations[language]?.home || translations.en.home;
  const [scrollY, setScrollY] = useState(0);
  const navigate = useNavigate(); // ✅ Add React Router hook

  const {
    featuredProperties,
    popularLocations,
    governorates,
    loading,
    error,
    refreshing,
    handleRefresh,
  } = useHomeData();

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSearch = (params: SearchParams) => {
    const urlParams = new URLSearchParams();

    if (params.location) {
      urlParams.set("governorate", params.location);
    }
    if (params.checkIn) {
      const checkInStr = params.checkIn.toISOString().split("T")[0];
      urlParams.set("checkInDate", checkInStr);
    }
    if (params.checkOut) {
      const checkOutStr = params.checkOut.toISOString().split("T")[0];
      urlParams.set("checkOutDate", checkOutStr);
    }
    if (params.guests) {
      urlParams.set("minGuests", params.guests);
    }

    console.log("🔗 Final URL params:", urlParams.toString());

    // ✅ Use React Router navigate directly with search params
    navigate(`/properties?${urlParams.toString()}`);
  };

  return (
    <div className="min-h-screen">
      <HeroSection
        t={t}
        language={language}
        scrollY={scrollY}
        governorates={governorates}
        onSearch={handleSearch}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {error && (
          <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}

        <section className="mb-16">
          <h2 className="text-3xl font-semibold text-[#2B2B2B] mb-8">
            {t?.popularDestinations || "Popular Destinations"}
          </h2>
          <PopularLocations
            t={t}
            language={language}
            locations={popularLocations}
            loading={loading}
            onNavigate={onNavigate}
          />
        </section>

        <section className="mb-16">
          <h2 className="text-3xl font-semibold text-[#2B2B2B] mb-8">
            {language === "ar" ? "عش في أي مكان" : "Live Anywhere"}
          </h2>
          <Categories language={language} onNavigate={onNavigate} />
        </section>

        <section className="mb-16">
          <FeaturedProperties
            t={t}
            language={language}
            properties={featuredProperties}
            loading={loading}
            refreshing={refreshing}
            user={user}
            onNavigate={onNavigate}
            onRefresh={handleRefresh}
          />
        </section>

        <section className="mb-16">
          <h2 className="text-3xl font-semibold text-[#2B2B2B] mb-8 text-center">
            {t?.whyChooseAjarly || "Why Choose Ajarly"}
          </h2>
          <WhyAjarly t={t} />
        </section>

        <HostCTA language={language} onNavigate={onNavigate} />
      </div>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 1s ease-out forwards;
        }
        
        .delay-200 {
          animation-delay: 0.2s;
          opacity: 0;
        }
      `}</style>
    </div>
  );
}
