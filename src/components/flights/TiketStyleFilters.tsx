import { useState } from "react";
import { 
  Filter, SlidersHorizontal, Plane, Clock, DollarSign, 
  Sun, Sunset, Moon, X, Check, ArrowUpDown, ChevronDown
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface FilterChip {
  id: string;
  label: string;
  active: boolean;
}

interface FilterState {
  stops: string[];
  airlines: string[];
  departureTime: string[];
  priceRange: { min: number; max: number };
  duration: number | null;
}

interface TiketStyleFiltersProps {
  airlines: string[];
  onFilterChange: (filters: FilterState) => void;
  onSortChange: (sort: string) => void;
  resultCount: number;
}

const TiketStyleFilters = ({ 
  airlines = [], 
  onFilterChange, 
  onSortChange,
  resultCount 
}: TiketStyleFiltersProps) => {
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [activeSort, setActiveSort] = useState("recommended");
  const [filters, setFilters] = useState<FilterState>({
    stops: [],
    airlines: [],
    departureTime: [],
    priceRange: { min: 0, max: 10000 },
    duration: null,
  });

  // Quick filter chips - Tiket style
  const quickFilters: FilterChip[] = [
    { id: "direct", label: "Direct", active: filters.stops.includes("0") },
    { id: "1stop", label: "1 Stop", active: filters.stops.includes("1") },
    { id: "morning", label: "Morning", active: filters.departureTime.includes("morning") },
    { id: "cheapest", label: "Cheapest", active: activeSort === "price_asc" },
  ];

  // Sort options
  const sortOptions = [
    { id: "recommended", label: "Recommended", labelAr: "الأفضل" },
    { id: "price_asc", label: "Lowest Price", labelAr: "الأقل سعراً" },
    { id: "price_desc", label: "Highest Price", labelAr: "الأعلى سعراً" },
    { id: "duration", label: "Shortest Duration", labelAr: "الأقصر مدة" },
    { id: "departure", label: "Earliest Departure", labelAr: "الأبكر مغادرة" },
  ];

  // Time slots
  const timeSlots = [
    { id: "early_morning", label: "Early Morning", time: "00:00 - 06:00", icon: Moon },
    { id: "morning", label: "Morning", time: "06:00 - 12:00", icon: Sun },
    { id: "afternoon", label: "Afternoon", time: "12:00 - 18:00", icon: Sun },
    { id: "evening", label: "Evening", time: "18:00 - 24:00", icon: Sunset },
  ];

  const toggleQuickFilter = (filterId: string) => {
    if (filterId === "direct") {
      const newStops = filters.stops.includes("0") 
        ? filters.stops.filter(s => s !== "0")
        : [...filters.stops, "0"];
      setFilters({ ...filters, stops: newStops });
    } else if (filterId === "1stop") {
      const newStops = filters.stops.includes("1") 
        ? filters.stops.filter(s => s !== "1")
        : [...filters.stops, "1"];
      setFilters({ ...filters, stops: newStops });
    } else if (filterId === "morning") {
      const newTime = filters.departureTime.includes("morning") 
        ? filters.departureTime.filter(t => t !== "morning")
        : [...filters.departureTime, "morning"];
      setFilters({ ...filters, departureTime: newTime });
    } else if (filterId === "cheapest") {
      setActiveSort("price_asc");
      onSortChange("price_asc");
    }
    onFilterChange(filters);
  };

  const handleSort = (sortId: string) => {
    setActiveSort(sortId);
    onSortChange(sortId);
  };

  const toggleStop = (stop: string) => {
    const newStops = filters.stops.includes(stop)
      ? filters.stops.filter(s => s !== stop)
      : [...filters.stops, stop];
    setFilters({ ...filters, stops: newStops });
    onFilterChange({ ...filters, stops: newStops });
  };

  const toggleAirline = (airline: string) => {
    const newAirlines = filters.airlines.includes(airline)
      ? filters.airlines.filter(a => a !== airline)
      : [...filters.airlines, airline];
    setFilters({ ...filters, airlines: newAirlines });
    onFilterChange({ ...filters, airlines: newAirlines });
  };

  const toggleTime = (time: string) => {
    const newTimes = filters.departureTime.includes(time)
      ? filters.departureTime.filter(t => t !== time)
      : [...filters.departureTime, time];
    setFilters({ ...filters, departureTime: newTimes });
    onFilterChange({ ...filters, departureTime: newTimes });
  };

  const clearFilters = () => {
    const clearedFilters = {
      stops: [],
      airlines: [],
      departureTime: [],
      priceRange: { min: 0, max: 10000 },
      duration: null,
    };
    setFilters(clearedFilters);
    onFilterChange(clearedFilters);
  };

  const activeFiltersCount = filters.stops.length + filters.airlines.length + filters.departureTime.length;

  return (
    <div className="sticky top-0 z-40 bg-white border-b shadow-sm">
      {/* Main Filter Bar */}
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          
          {/* Left - Results Count & Quick Filters */}
          <div className="flex items-center gap-3 overflow-x-auto pb-1 flex-1">
            <span className="text-sm font-semibold text-gray-600 whitespace-nowrap">
              {resultCount} رحلة
            </span>
            
            <div className="h-6 w-px bg-gray-300" />
            
            {/* Filter Button */}
            <button
              onClick={() => setShowFilterModal(true)}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-full border-2 text-sm font-medium transition-all whitespace-nowrap",
                activeFiltersCount > 0
                  ? "border-[#0064D2] bg-blue-50 text-[#0064D2]"
                  : "border-gray-300 text-gray-700 hover:border-[#0064D2]"
              )}
            >
              <Filter className="w-4 h-4" />
              <span>Filter</span>
              {activeFiltersCount > 0 && (
                <span className="w-5 h-5 bg-[#0064D2] text-white rounded-full text-xs flex items-center justify-center">
                  {activeFiltersCount}
                </span>
              )}
            </button>

            {/* Quick Filter Chips */}
            {quickFilters.map((chip) => (
              <button
                key={chip.id}
                onClick={() => toggleQuickFilter(chip.id)}
                className={cn(
                  "px-4 py-2 rounded-full border-2 text-sm font-medium transition-all whitespace-nowrap",
                  chip.active
                    ? "border-[#0064D2] bg-[#0064D2] text-white"
                    : "border-gray-300 text-gray-700 hover:border-[#0064D2]"
                )}
              >
                {chip.label}
              </button>
            ))}
          </div>

          {/* Right - Sort Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowFilterModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-200 transition-all"
            >
              <ArrowUpDown className="w-4 h-4" />
              <span>{sortOptions.find(s => s.id === activeSort)?.labelAr}</span>
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Filter Modal */}
      {showFilterModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100]">
          <div className="h-full flex">
            {/* Sidebar Filter Panel */}
            <div className="w-full max-w-md bg-white h-full overflow-y-auto animate-in slide-in-from-right">
              {/* Header */}
              <div className="sticky top-0 bg-white border-b p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <SlidersHorizontal className="w-5 h-5 text-[#0064D2]" />
                  <h2 className="text-lg font-bold">Filters & Sort</h2>
                </div>
                <button onClick={() => setShowFilterModal(false)} className="p-2 hover:bg-gray-100 rounded-full">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-4 space-y-6">
                {/* Sort */}
                <div>
                  <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                    <ArrowUpDown className="w-4 h-4 text-[#0064D2]" />
                    Sort By
                  </h3>
                  <div className="space-y-2">
                    {sortOptions.map((opt) => (
                      <button
                        key={opt.id}
                        onClick={() => handleSort(opt.id)}
                        className={cn(
                          "w-full flex items-center justify-between p-3 rounded-lg border-2 transition-all",
                          activeSort === opt.id
                            ? "border-[#0064D2] bg-blue-50"
                            : "border-gray-200 hover:border-gray-300"
                        )}
                      >
                        <span className="font-medium">{opt.labelAr}</span>
                        {activeSort === opt.id && <Check className="w-5 h-5 text-[#0064D2]" />}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Stops */}
                <div>
                  <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                    <Plane className="w-4 h-4 text-[#0064D2]" />
                    Number of Stops
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { value: "0", label: "Direct" },
                      { value: "1", label: "1 Stop" },
                      { value: "2", label: "2+ Stops" },
                    ].map((stop) => (
                      <button
                        key={stop.value}
                        onClick={() => toggleStop(stop.value)}
                        className={cn(
                          "px-4 py-2 rounded-lg border-2 text-sm font-medium transition-all",
                          filters.stops.includes(stop.value)
                            ? "border-[#0064D2] bg-[#0064D2] text-white"
                            : "border-gray-200 hover:border-[#0064D2]"
                        )}
                      >
                        {stop.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Departure Time */}
                <div>
                  <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-[#0064D2]" />
                    Departure Time
                  </h3>
                  <div className="grid grid-cols-2 gap-2">
                    {timeSlots.map((slot) => (
                      <button
                        key={slot.id}
                        onClick={() => toggleTime(slot.id)}
                        className={cn(
                          "p-3 rounded-lg border-2 text-sm transition-all text-right",
                          filters.departureTime.includes(slot.id)
                            ? "border-[#0064D2] bg-blue-50"
                            : "border-gray-200 hover:border-gray-300"
                        )}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <slot.icon className="w-4 h-4 text-gray-500" />
                          <span className="font-medium">{slot.label}</span>
                        </div>
                        <div className="text-xs text-gray-500">{slot.time}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Airlines */}
                {airlines.length > 0 && (
                  <div>
                    <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                      <Plane className="w-4 h-4 text-[#0064D2]" />
                      Airlines
                    </h3>
                    <div className="space-y-2">
                      {airlines.map((airline) => (
                        <label
                          key={airline}
                          className="flex items-center justify-between p-3 rounded-lg border hover:bg-gray-50 cursor-pointer"
                        >
                          <span className="font-medium">{airline}</span>
                          <div className={cn(
                            "w-5 h-5 rounded border-2 flex items-center justify-center transition-all",
                            filters.airlines.includes(airline)
                              ? "bg-[#0064D2] border-[#0064D2]"
                              : "border-gray-300"
                          )}>
                            {filters.airlines.includes(airline) && <Check className="w-3 h-3 text-white" />}
                          </div>
                          <input
                            type="checkbox"
                            checked={filters.airlines.includes(airline)}
                            onChange={() => toggleAirline(airline)}
                            className="sr-only"
                          />
                        </label>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="sticky bottom-0 bg-white border-t p-4 flex gap-3">
                <Button
                  variant="outline"
                  onClick={clearFilters}
                  className="flex-1"
                >
                  Clear All
                </Button>
                <Button
                  onClick={() => setShowFilterModal(false)}
                  className="flex-1 bg-[#FF5E1F] hover:bg-[#E54E10]"
                >
                  Show {resultCount} Results
                </Button>
              </div>
            </div>

            {/* Click outside to close */}
            <div 
              className="flex-1" 
              onClick={() => setShowFilterModal(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default TiketStyleFilters;
