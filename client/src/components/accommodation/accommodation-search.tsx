import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, MapPin, Users, Building, Home, Filter, Star, Map } from "lucide-react";
import { cn } from "@/utils/utils";
import type { 
  AccommodationSearchFilters, 
  AccommodationType, 
  GenderPreference,
  Amenity
} from "@shared/schema";

// Smart location search with colleges/universities
const POPULAR_COLLEGES = [
  { key: 'iit-delhi', label: 'IIT Delhi', location: 'Delhi', count: 456 },
  { key: 'nit-trichy', label: 'NIT Trichy', location: 'Tamil Nadu', count: 234 },
  { key: 'du-north', label: 'DU North Campus', location: 'Delhi', count: 189 },
  { key: 'vit-vellore', label: 'VIT Vellore', location: 'Tamil Nadu', count: 167 },
  { key: 'iit-bombay', label: 'IIT Bombay', location: 'Mumbai', count: 298 },
  { key: 'bits-pilani', label: 'BITS Pilani', location: 'Rajasthan', count: 145 },
];

// Distance options for accommodation search
const DISTANCE_OPTIONS = [
  { key: '500', label: 'Within 500m', icon: '🚶' },
  { key: '1000', label: 'Within 1km', icon: '🚶' },
  { key: '2000', label: 'Within 2km', icon: '🚲' },
  { key: '5000', label: 'Within 5km', icon: '🚗' },
];

// Accommodation types with counts (aligned with schema enum)
const ACCOMMODATION_TYPES = [
  { key: 'pg', label: 'PG', description: 'Paying Guest', icon: '🏠', count: 1847 },
  { key: 'hostel', label: 'HOSTELS', description: 'Student Hostels', icon: '🏫', count: 500 },
  { key: 'apartment', label: 'APARTMENTS', description: 'Premium Living', icon: '🏨', count: 567 },
  { key: 'shared-room', label: 'SHARED', description: 'Budget Friendly', icon: '🏠', count: 1234 },
  { key: 'flat', label: 'FLATS', description: 'Independent', icon: '🏘️', count: 345 },
] as const;

// Quick filters for accommodation
const QUICK_FILTERS = [
  { key: 'boys', label: 'Boys', type: 'gender' },
  { key: 'girls', label: 'Girls', type: 'gender' },
  { key: 'co-ed', label: 'Co-ed', type: 'gender' },
  { key: 'ac', label: 'AC', type: 'amenity' },
  { key: 'wifi', label: 'WiFi', type: 'amenity' },
  { key: 'mess', label: 'Mess', type: 'amenity' },
  { key: 'under-10k', label: '<₹10k', type: 'price' },
  { key: 'verified', label: 'Verified', type: 'feature' },
];

// Occupancy options
const OCCUPANCY_OPTIONS = [
  { key: '1', label: '1 Person', icon: '👤' },
  { key: '2', label: '2 People', icon: '👥' },
  { key: '3', label: '3+ People', icon: '👥' },
];

interface AccommodationSearchProps {
  onFiltersChange?: (filters: AccommodationSearchFilters) => void;
  onSearch?: (searchData: AccommodationSearchFilters) => void;
  className?: string;
}

export default function AccommodationSearch({ 
  onFiltersChange, 
  onSearch,
  className 
}: AccommodationSearchProps) {
  // Smart location search state
  const [selectedCollege, setSelectedCollege] = useState("");
  const [selectedDistance, setSelectedDistance] = useState("2000");
  const [selectedAccommodationType, setSelectedAccommodationType] = useState("");
  const [selectedOccupancy, setSelectedOccupancy] = useState("1");
  const [searchQuery, setSearchQuery] = useState("");
  
  // Quick filters state
  const [selectedQuickFilters, setSelectedQuickFilters] = useState<string[]>([]);
  
  // Advanced filters state
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  // Handle quick filter toggle
  const toggleQuickFilter = (filterKey: string) => {
    setSelectedQuickFilters(prev => 
      prev.includes(filterKey) 
        ? prev.filter(f => f !== filterKey)
        : [...prev, filterKey]
    );
  };

  // Handle search execution
  const handleSearch = () => {
    // Extract amenities from quick filters
    const amenities = selectedQuickFilters
      .filter(filter => QUICK_FILTERS.find(f => f.key === filter)?.type === 'amenity')
      .filter((amenity): amenity is Amenity => {
        // Ensure the amenity is valid according to the schema
        const validAmenities: Amenity[] = ['ac', 'wifi', 'mess', 'laundry', 'security', 'cctv', 'gym', 'pool', 'parking', 'study-room', 'common-area', 'hot-water', 'attached-bath', 'meals'];
        return validAmenities.includes(amenity as Amenity);
      });

    // Extract gender preference from quick filters
    const genderFilter = selectedQuickFilters
      .find(filter => QUICK_FILTERS.find(f => f.key === filter)?.type === 'gender');
    const genderPreference = genderFilter && ['boys', 'girls', 'co-ed'].includes(genderFilter) 
      ? genderFilter as GenderPreference 
      : undefined;

    // Extract price filters
    const priceFilter = selectedQuickFilters
      .find(filter => QUICK_FILTERS.find(f => f.key === filter)?.type === 'price');
    const maxPrice = priceFilter === 'under-10k' ? 10000 : undefined;

    const searchData: AccommodationSearchFilters = {
      college: selectedCollege || undefined,
      distance: selectedDistance ? parseInt(selectedDistance, 10) : undefined,
      accommodationType: selectedAccommodationType as AccommodationType || undefined,
      genderPreference,
      amenities: amenities.length > 0 ? amenities : undefined,
      maxPrice,
      query: searchQuery || undefined,
      // Additional filters that can be extended
      // roomType: undefined, // Could be mapped from occupancy if needed
      // minPrice: undefined,
      // rating: undefined,
      // sortBy: undefined,
      // limit: undefined,
      // offset: undefined,
    };
    
    // Filter out undefined values to keep the object clean
    const cleanedSearchData = Object.fromEntries(
      Object.entries(searchData).filter(([_, value]) => value !== undefined)
    ) as AccommodationSearchFilters;
    
    onSearch?.(cleanedSearchData);
    onFiltersChange?.(cleanedSearchData);
  };

  // Get popular searches for suggestions
  const popularSearches = [
    "NIT Trichy hostels",
    "DU North Campus PG", 
    "VIT Vellore rooms"
  ];

  return (
    <div className={cn("w-full space-y-6", className)} data-testid="accommodation-search">
      {/* Hero Section */}
      <div className="text-center space-y-4 py-8">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white" data-testid="text-hero-title">
          🏠 FIND YOUR PERFECT ACCOMMODATION
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300" data-testid="text-hero-subtitle">
          Safe, verified, and student-friendly options
        </p>
      </div>

      {/* Smart Location Search */}
      <Card data-testid="card-location-search">
        <CardHeader>
          <CardTitle className="text-center">SMART LOCATION SEARCH</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Main search inputs */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium">🏫 College/University</Label>
              <Select value={selectedCollege} onValueChange={setSelectedCollege} data-testid="select-college">
                <SelectTrigger>
                  <SelectValue placeholder="IIT Delhi" />
                </SelectTrigger>
                <SelectContent>
                  {POPULAR_COLLEGES.map((college) => (
                    <SelectItem key={college.key} value={college.key}>
                      {college.label} ({college.count})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">📍 Distance</Label>
              <Select value={selectedDistance} onValueChange={setSelectedDistance} data-testid="select-distance">
                <SelectTrigger>
                  <SelectValue placeholder="Within 2km" />
                </SelectTrigger>
                <SelectContent>
                  {DISTANCE_OPTIONS.map((option) => (
                    <SelectItem key={option.key} value={option.key}>
                      {option.icon} {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">🏠 Type</Label>
              <Select value={selectedAccommodationType} onValueChange={setSelectedAccommodationType} data-testid="select-accommodation-type">
                <SelectTrigger>
                  <SelectValue placeholder="PG/Hostel" />
                </SelectTrigger>
                <SelectContent>
                  {ACCOMMODATION_TYPES.map((type) => (
                    <SelectItem key={type.key} value={type.key}>
                      {type.icon} {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">👥 Occupancy</Label>
              <Select value={selectedOccupancy} onValueChange={setSelectedOccupancy} data-testid="select-occupancy">
                <SelectTrigger>
                  <SelectValue placeholder="1 Person" />
                </SelectTrigger>
                <SelectContent>
                  {OCCUPANCY_OPTIONS.map((option) => (
                    <SelectItem key={option.key} value={option.key}>
                      {option.icon} {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Search</Label>
              <Button 
                className="w-full" 
                onClick={handleSearch}
                data-testid="button-search"
              >
                <Search className="w-4 h-4 mr-2" />
                🔍
              </Button>
            </div>
          </div>

          {/* Popular searches */}
          <div className="flex flex-wrap items-center gap-2" data-testid="popular-searches">
            <span className="text-sm text-gray-600 dark:text-gray-400">💡 Popular:</span>
            {popularSearches.map((search, index) => (
              <Button
                key={index}
                variant="ghost"
                size="sm"
                className="text-sm text-blue-600 hover:text-blue-800 p-1 h-auto"
                onClick={() => setSearchQuery(search)}
                data-testid={`popular-search-${index}`}
              >
                "{search}"
              </Button>
            ))}
          </div>

          {/* Quick Filters */}
          <div className="space-y-3" data-testid="quick-filters">
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium">🎯 QUICK FILTERS:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {QUICK_FILTERS.map((filter) => (
                <Button
                  key={filter.key}
                  variant={selectedQuickFilters.includes(filter.key) ? "default" : "outline"}
                  size="sm"
                  onClick={() => toggleQuickFilter(filter.key)}
                  className={cn(
                    "text-sm",
                    selectedQuickFilters.includes(filter.key) && "bg-blue-600 text-white"
                  )}
                  data-testid={`quick-filter-${filter.key}`}
                >
                  {filter.label}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Accommodation Types */}
      <Card data-testid="card-accommodation-types">
        <CardHeader>
          <CardTitle className="text-center">ACCOMMODATION TYPES</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {ACCOMMODATION_TYPES.map((type) => (
              <Button
                key={type.key}
                variant={selectedAccommodationType === type.key ? "default" : "outline"}
                className={cn(
                  "h-auto p-4 flex flex-col items-center space-y-2",
                  selectedAccommodationType === type.key && "bg-blue-600 text-white"
                )}
                onClick={() => setSelectedAccommodationType(type.key)}
                data-testid={`accommodation-type-${type.key}`}
              >
                <div className="text-2xl">{type.icon}</div>
                <div className="text-sm font-semibold">{type.label}</div>
                <div className="text-xs opacity-70">{type.description}</div>
                <div className="text-xs font-medium">{type.count.toLocaleString()} options</div>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Search Actions */}
      <div className="flex justify-center space-x-4" data-testid="search-actions">
        <Button 
          size="lg" 
          onClick={handleSearch}
          className="px-8"
          data-testid="button-find-accommodation"
        >
          <Search className="w-5 h-5 mr-2" />
          Find Accommodation
        </Button>
        <Button 
          variant="outline" 
          size="lg"
          onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
          data-testid="button-advanced-filters"
        >
          <Filter className="w-5 h-5 mr-2" />
          Advanced Filters
        </Button>
        <Button 
          variant="outline" 
          size="lg"
          data-testid="button-map-view"
        >
          <Map className="w-5 h-5 mr-2" />
          🗺️ Map View
        </Button>
      </div>
    </div>
  );
}