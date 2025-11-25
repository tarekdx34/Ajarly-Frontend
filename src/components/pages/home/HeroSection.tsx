import { useState } from "react";
import { SearchBar, SearchParams } from "./SearchBar";
import { Scene3D } from "./Scene3D";
import { Language } from "../../../lib/translations";

interface HeroSectionProps {
  t: any;
  language: Language;
  scrollY: number;
  governorates: string[];
  onSearch: (params: SearchParams) => void;
}

export function HeroSection({
  t,
  language,
  scrollY,
  governorates,
  onSearch,
}: HeroSectionProps) {
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  return (
    <div className="relative h-[600px] flex items-center justify-center overflow-hidden">
      {/* Static 3D Scene - no parallax animation */}
      <div className="absolute inset-0">
        <Scene3D />
      </div>

      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-white/20 pointer-events-none" />

      <div className="relative z-10 text-center px-4 w-full max-w-4xl mx-auto">
        {/* Shorter, more concise hero text - no scroll animation */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-3 drop-shadow-lg animate-fadeIn">
            {language === "ar" ? (
              <>
                اكتشف{" "}
                <span className="text-[#00BFA6] drop-shadow-lg">
                  إيجارات فريدة
                </span>{" "}
                على ساحل مصر المتوسطي
              </>
            ) : (
              <>
                Find Your Perfect{" "}
                <span className="text-[#00BFA6] drop-shadow-lg">
                  Mediterranean Rental
                </span>
              </>
            )}
          </h1>
          <p className="text-lg md:text-xl text-white/90 drop-shadow-md animate-fadeIn delay-200">
            {language === "ar"
              ? "اكتشف عقارات فريدة على طول ساحل مصر المذهل"
              : "Discover unique vacation rentals along Egypt's stunning coast"}
          </p>
        </div>

        {/* Search bar - no scroll animations */}
        <SearchBar
          t={t}
          language={language}
          scrollY={0}
          governorates={governorates}
          isSearchFocused={isSearchFocused}
          onFocusChange={setIsSearchFocused}
          onSearch={onSearch}
        />
      </div>

      {/* Scroll indicator - static, no animation based on scroll */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 animate-bounce">
        <svg
          className="w-8 h-8 text-white drop-shadow-lg"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 14l-7 7m0 0l-7-7m7 7V3"
          />
        </svg>
      </div>
    </div>
  );
}
