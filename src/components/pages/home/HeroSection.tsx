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
  const parallaxOffset = scrollY * 0.5;

  return (
    <div className="relative h-[600px] flex items-center justify-center overflow-hidden">
      <div
        className="absolute inset-0 transition-transform duration-100 ease-out"
        style={{ transform: `translateY(${parallaxOffset}px)` }}
      >
        <Scene3D />
      </div>

      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-white/20 pointer-events-none" />

      <div className="relative z-10 text-center px-4 w-full max-w-4xl mx-auto">
        <div
          style={{
            opacity: Math.max(0, 1 - scrollY / 300),
            transform: `translateY(${-scrollY * 0.3}px)`,
            transition: "opacity 0.1s, transform 0.1s",
          }}
        >
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4 drop-shadow-lg animate-fadeIn">
            {t?.heroTitle || "Find Your Perfect"}{" "}
            <span className="text-[#00BFA6] drop-shadow-lg">
              {t?.heroTitleHighlight || "Rental in Egypt"}
            </span>
          </h1>
          <p className="text-xl text-white/90 mb-8 drop-shadow-md animate-fadeIn delay-200">
            {t?.heroSubtitle || "Discover amazing properties across Egypt"}
          </p>
        </div>

        <SearchBar
          t={t}
          language={language}
          scrollY={scrollY}
          governorates={governorates}
          isSearchFocused={isSearchFocused}
          onFocusChange={setIsSearchFocused}
          onSearch={onSearch}
        />
      </div>

      <div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 animate-bounce"
        style={{ opacity: Math.max(0, 1 - scrollY / 200) }}
      >
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
