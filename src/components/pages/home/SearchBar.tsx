import { useState } from "react";
import { Search } from "lucide-react";
import { format } from "date-fns";
import { Button } from "../../ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "../../ui/popover";
import { Calendar } from "../../ui/calendar";
import { Language } from "../../../lib/translations";

export interface SearchParams {
  location: string;
  checkIn?: Date;
  checkOut?: Date;
  guests: string;
}

interface SearchBarProps {
  t: any;
  language: Language;
  scrollY?: number;
  governorates: string[];
  isSearchFocused: boolean;
  onFocusChange: (focused: boolean) => void;
  onSearch: (params: SearchParams) => void;
  compact?: boolean;
  initialValues?: SearchParams;
}

export function SearchBar({
  t,
  language,
  scrollY = 0,
  governorates,
  isSearchFocused,
  onFocusChange,
  onSearch,
  compact = false,
  initialValues,
}: SearchBarProps) {
  const [location, setLocation] = useState(initialValues?.location || "");
  const [checkIn, setCheckIn] = useState<Date | undefined>(
    initialValues?.checkIn
  );
  const [checkOut, setCheckOut] = useState<Date | undefined>(
    initialValues?.checkOut
  );
  const [guests, setGuests] = useState(initialValues?.guests || "");

  const handleSearch = () => {
    onSearch({ location, checkIn, checkOut, guests });
  };

  const containerClass = compact
    ? "bg-white rounded-lg shadow-md"
    : "bg-white/95 backdrop-blur-md rounded-full shadow-2xl hover:shadow-3xl";

  const wrapperStyle = compact
    ? {}
    : {
        opacity: Math.max(0, 1 - scrollY / 400),
        transform: `translateY(${Math.min(scrollY * 0.2, 100)}px)`,
      };

  return (
    <div
      className={`transition-all duration-500 ease-out ${
        isSearchFocused && !compact ? "scale-105" : "scale-100"
      }`}
      style={wrapperStyle}
    >
      <div
        className={`${containerClass} flex flex-col md:flex-row items-stretch md:items-center gap-2 transition-all duration-300`}
      >
        <div className="flex-1 px-4 py-3 border-b md:border-b-0 md:border-r border-gray-200">
          <Select value={location} onValueChange={setLocation}>
            <SelectTrigger
              className="border-0 bg-transparent h-auto p-0 focus:ring-0 focus:ring-offset-0"
              onFocus={() => onFocusChange(true)}
              onBlur={() => onFocusChange(false)}
            >
              <SelectValue
                placeholder={t?.searchPlaceholder || "Where are you going?"}
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
        </div>

        <Popover>
          <PopoverTrigger asChild>
            <button
              className="flex-1 px-4 py-3 text-left border-b md:border-b-0 md:border-r border-gray-200 hover:bg-gray-50 rounded-lg transition-colors"
              onFocus={() => onFocusChange(true)}
              onBlur={() => onFocusChange(false)}
            >
              <span className="text-sm text-gray-500 block">
                {t?.checkIn || "Check in"}
              </span>
              <span className="font-medium">
                {checkIn
                  ? format(checkIn, "MMM dd")
                  : t?.selectDates || "Select dates"}
              </span>
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={checkIn}
              onSelect={setCheckIn}
              initialFocus
            />
          </PopoverContent>
        </Popover>

        <Popover>
          <PopoverTrigger asChild>
            <button
              className="flex-1 px-4 py-3 text-left border-b md:border-b-0 md:border-r border-gray-200 hover:bg-gray-50 rounded-lg transition-colors"
              onFocus={() => onFocusChange(true)}
              onBlur={() => onFocusChange(false)}
            >
              <span className="text-sm text-gray-500 block">
                {t?.checkOut || "Check out"}
              </span>
              <span className="font-medium">
                {checkOut
                  ? format(checkOut, "MMM dd")
                  : t?.selectDates || "Select dates"}
              </span>
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={checkOut}
              onSelect={setCheckOut}
              initialFocus
              disabled={(date: Date) => (checkIn ? date < checkIn : false)}
            />
          </PopoverContent>
        </Popover>

        <div className="flex-1 px-4 py-3 border-b md:border-b-0 md:border-r border-gray-200">
          <Select value={guests} onValueChange={setGuests}>
            <SelectTrigger
              className="border-0 bg-transparent h-auto p-0 focus:ring-0 focus:ring-offset-0"
              onFocus={() => onFocusChange(true)}
              onBlur={() => onFocusChange(false)}
            >
              <SelectValue placeholder={t?.guests || "Guests"} />
            </SelectTrigger>
            <SelectContent>
              {[1, 2, 3, 4, 5, 6].map((num) => (
                <SelectItem key={num} value={num.toString()}>
                  {language === "ar"
                    ? `${num} ضيوف`
                    : `${num} Guest${num > 1 ? "s" : ""}`}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button
          onClick={handleSearch}
          size="lg"
          className={`bg-[#FF6B6B] hover:bg-[#FF5252] text-white ${
            compact ? "rounded-lg" : "rounded-full"
          } px-8 transition-all duration-300 hover:scale-110 active:scale-95`}
        >
          <Search />
        </Button>
      </div>
    </div>
  );
}
