import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { MapPin, Star, Phone, Heart, Camera, Calendar, MessageCircle, Map, Filter, Grid, List } from "lucide-react";
import RatingStars from "@/components/common/rating-stars";
import { cn } from "@/utils/utils";
import type { 
  AccommodationSearchFilters, 
  AccommodationSearchResult, 
  AccommodationWithRooms,
  Amenity,
  RoomType,
  AccommodationType 
} from "@shared/schema";

// Filter item type for UI filters
interface FilterItem {
  key: string;
  label: string;
  checked: boolean;
}

// Distance filter options
const DISTANCE_FILTERS = [
  { key: '500', label: '<500m', checked: true },
  { key: '1000', label: '<1km', checked: true },
  { key: '2000', label: '<2km', checked: false },
  { key: '5000', label: '<5km', checked: false },
];

// Rent range filters
const RENT_FILTERS = [
  { key: '0-5000', label: '<₹5k', checked: false },
  { key: '5000-10000', label: '₹5k-10k', checked: true },
  { key: '10000-15000', label: '₹10k-15k', checked: false },
  { key: '15000+', label: '>₹15k', checked: false },
];

// Room type filters
const ROOM_TYPE_FILTERS = [
  { key: 'single', label: 'Single', checked: true },
  { key: 'double', label: 'Double', checked: true },
  { key: 'triple', label: 'Triple', checked: false },
  { key: 'dormitory', label: 'Dormitory', checked: false },
];

// Amenities filters
const AMENITIES_FILTERS = [
  { key: 'ac', label: 'AC', checked: true },
  { key: 'wifi', label: 'WiFi', checked: true },
  { key: 'mess', label: 'Mess', checked: true },
  { key: 'laundry', label: 'Laundry', checked: true },
  { key: 'security', label: 'Security', checked: true },
  { key: 'gym', label: 'Gym', checked: false },
  { key: 'pool', label: 'Pool', checked: false },
];

// Rating filters
const RATING_FILTERS = [
  { key: '4.5+', label: '4.5+ ⭐', checked: true },
  { key: '4.0+', label: '4.0+ ⭐', checked: true },
  { key: '3.5+', label: '3.5+ ⭐', checked: false },
];

// Special feature filters
const SPECIAL_FILTERS = [
  { key: 'verified', label: 'Verified', checked: true },
  { key: 'new', label: 'New', checked: true },
  { key: 'premium', label: 'Premium', checked: false },
  { key: 'featured', label: 'Featured', checked: false },
];

// Sort options
const SORT_OPTIONS = [
  { key: 'price-asc', label: 'Price: Low to High' },
  { key: 'price-desc', label: 'Price: High to Low' },
  { key: 'rating', label: 'Highest Rated' },
  { key: 'distance', label: 'Nearest First' },
  { key: 'newest', label: 'Newest First' },
];

// Build API query parameters from filters
const buildQueryParams = (filters: AccommodationSearchFilters) => {
  const params = new URLSearchParams();
  
  // Basic filters
  if (filters.college) params.append('college', filters.college);
  if (filters.distance) params.append('distance', String(filters.distance));
  if (filters.accommodationType) params.append('accommodationType', filters.accommodationType);
  if (filters.genderPreference) params.append('genderPreference', filters.genderPreference);
  if (filters.roomType) params.append('roomType', filters.roomType);
  if (filters.rating) params.append('rating', String(filters.rating));
  
  // Search term - backend expects 'search' not 'searchTerm'
  if (filters.query) params.append('search', filters.query);
  
  // Amenities array - backend expects 'amenities' not 'quickFilters'
  if (filters.amenities && Array.isArray(filters.amenities)) {
    filters.amenities.forEach((amenity: Amenity) => params.append('amenities', amenity));
  }
  
  // Price range
  if (filters.minPrice) params.append('minPrice', String(filters.minPrice));
  if (filters.maxPrice) params.append('maxPrice', String(filters.maxPrice));
  
  // Sorting
  if (filters.sortBy) params.append('sortBy', filters.sortBy);
  
  // Pagination
  params.append('limit', '20');
  params.append('offset', '0');
  
  return params.toString();
};

interface AccommodationListingProps {
  searchFilters?: AccommodationSearchFilters;
  onFiltersChange?: (filters: AccommodationSearchFilters) => void;
  className?: string;
}

export default function AccommodationListing({ 
  searchFilters, 
  onFiltersChange,
  className 
}: AccommodationListingProps) {
  const [distanceFilters, setDistanceFilters] = useState<FilterItem[]>(DISTANCE_FILTERS);
  const [rentFilters, setRentFilters] = useState<FilterItem[]>(RENT_FILTERS);
  const [roomTypeFilters, setRoomTypeFilters] = useState<FilterItem[]>(ROOM_TYPE_FILTERS);
  const [amenitiesFilters, setAmenitiesFilters] = useState<FilterItem[]>(AMENITIES_FILTERS);
  const [ratingFilters, setRatingFilters] = useState<FilterItem[]>(RATING_FILTERS);
  const [specialFilters, setSpecialFilters] = useState<FilterItem[]>(SPECIAL_FILTERS);
  const [sortBy, setSortBy] = useState('price-asc');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [selectedForComparison, setSelectedForComparison] = useState<number[]>([]);

  // Fetch accommodations with React Query
  const { data: accommodationsData, isLoading, error } = useQuery<AccommodationSearchResult>({
    queryKey: ['/api/accommodations', searchFilters],
    queryFn: async () => {
      if (!searchFilters) return { accommodations: [], total: 0 };
      
      const queryString = buildQueryParams(searchFilters);
      const response = await fetch(`/api/accommodations?${queryString}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch accommodations');
      }
      
      return response.json();
    },
    enabled: !!searchFilters,
  });

  const accommodations = accommodationsData?.accommodations || [];
  const totalAccommodations = accommodationsData?.total || 0;

  // Toggle filter function
  const toggleFilter = (filters: FilterItem[], setFilters: React.Dispatch<React.SetStateAction<FilterItem[]>>, key: string) => {
    setFilters(filters.map(filter => 
      filter.key === key ? { ...filter, checked: !filter.checked } : filter
    ));
  };

  // Reset all filters
  const resetFilters = () => {
    setDistanceFilters(DISTANCE_FILTERS);
    setRentFilters(RENT_FILTERS);
    setRoomTypeFilters(ROOM_TYPE_FILTERS);
    setAmenitiesFilters(AMENITIES_FILTERS);
    setRatingFilters(RATING_FILTERS);
    setSpecialFilters(SPECIAL_FILTERS);
  };

  // Get active filter count
  const activeFilterCount = [
    ...distanceFilters,
    ...rentFilters,
    ...roomTypeFilters,
    ...amenitiesFilters,
    ...ratingFilters,
    ...specialFilters
  ].filter(f => f.checked).length;

  // Toggle comparison selection
  const toggleComparison = (accommodationId: number) => {
    setSelectedForComparison(prev => 
      prev.includes(accommodationId)
        ? prev.filter(id => id !== accommodationId)
        : prev.length < 3 ? [...prev, accommodationId] : prev
    );
  };

  return (
    <div className={cn("grid grid-cols-1 lg:grid-cols-4 gap-6", className)} data-testid="accommodation-listing">
      {/* Advanced Filters Sidebar */}
      <div className="lg:col-span-1" data-testid="filters-sidebar">
        <Card className="sticky top-4">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">FILTERS</h3>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={resetFilters}
                data-testid="button-reset-filters"
              >
                Reset
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-6 text-sm">
            {/* Distance Filters */}
            <div className="space-y-3" data-testid="distance-filters">
              <h4 className="font-medium flex items-center">📍 DISTANCE</h4>
              <div className="space-y-2">
                {distanceFilters.map((filter) => (
                  <div key={filter.key} className="flex items-center space-x-2">
                    <Checkbox
                      id={`distance-${filter.key}`}
                      checked={filter.checked}
                      onCheckedChange={() => toggleFilter(distanceFilters, setDistanceFilters, filter.key)}
                      data-testid={`checkbox-distance-${filter.key}`}
                    />
                    <Label htmlFor={`distance-${filter.key}`} className="text-sm">
                      {filter.label}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Rent Filters */}
            <div className="space-y-3" data-testid="rent-filters">
              <h4 className="font-medium flex items-center">💰 RENT</h4>
              <div className="space-y-2">
                {rentFilters.map((filter) => (
                  <div key={filter.key} className="flex items-center space-x-2">
                    <Checkbox
                      id={`rent-${filter.key}`}
                      checked={filter.checked}
                      onCheckedChange={() => toggleFilter(rentFilters, setRentFilters, filter.key)}
                      data-testid={`checkbox-rent-${filter.key}`}
                    />
                    <Label htmlFor={`rent-${filter.key}`} className="text-sm">
                      {filter.label}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Room Type Filters */}
            <div className="space-y-3" data-testid="room-type-filters">
              <h4 className="font-medium flex items-center">🏠 ROOM TYPE</h4>
              <div className="space-y-2">
                {roomTypeFilters.map((filter) => (
                  <div key={filter.key} className="flex items-center space-x-2">
                    <Checkbox
                      id={`room-${filter.key}`}
                      checked={filter.checked}
                      onCheckedChange={() => toggleFilter(roomTypeFilters, setRoomTypeFilters, filter.key)}
                      data-testid={`checkbox-room-${filter.key}`}
                    />
                    <Label htmlFor={`room-${filter.key}`} className="text-sm">
                      {filter.label}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Amenities Filters */}
            <div className="space-y-3" data-testid="amenities-filters">
              <h4 className="font-medium flex items-center">🏷️ AMENITIES</h4>
              <div className="space-y-2">
                {amenitiesFilters.map((filter) => (
                  <div key={filter.key} className="flex items-center space-x-2">
                    <Checkbox
                      id={`amenity-${filter.key}`}
                      checked={filter.checked}
                      onCheckedChange={() => toggleFilter(amenitiesFilters, setAmenitiesFilters, filter.key)}
                      data-testid={`checkbox-amenity-${filter.key}`}
                    />
                    <Label htmlFor={`amenity-${filter.key}`} className="text-sm">
                      {filter.label}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Rating Filters */}
            <div className="space-y-3" data-testid="rating-filters">
              <h4 className="font-medium flex items-center">⭐ RATING</h4>
              <div className="space-y-2">
                {ratingFilters.map((filter) => (
                  <div key={filter.key} className="flex items-center space-x-2">
                    <Checkbox
                      id={`rating-${filter.key}`}
                      checked={filter.checked}
                      onCheckedChange={() => toggleFilter(ratingFilters, setRatingFilters, filter.key)}
                      data-testid={`checkbox-rating-${filter.key}`}
                    />
                    <Label htmlFor={`rating-${filter.key}`} className="text-sm">
                      {filter.label}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Special Filters */}
            <div className="space-y-3" data-testid="special-filters">
              <h4 className="font-medium flex items-center">🎯 SPECIAL</h4>
              <div className="space-y-2">
                {specialFilters.map((filter) => (
                  <div key={filter.key} className="flex items-center space-x-2">
                    <Checkbox
                      id={`special-${filter.key}`}
                      checked={filter.checked}
                      onCheckedChange={() => toggleFilter(specialFilters, setSpecialFilters, filter.key)}
                      data-testid={`checkbox-special-${filter.key}`}
                    />
                    <Label htmlFor={`special-${filter.key}`} className="text-sm">
                      {filter.label}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Apply Button */}
            <Button 
              className="w-full" 
              data-testid="button-apply-filters"
            >
              Apply ({activeFilterCount})
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Results Section */}
      <div className="lg:col-span-3 space-y-4" data-testid="results-section">
        {/* Results Header */}
        <div className="flex items-center justify-between" data-testid="results-header">
          <div className="flex items-center space-x-4">
            <h2 className="text-lg font-semibold">
              {isLoading ? 'Loading...' : `${totalAccommodations} accommodations found`}
            </h2>
            <Button variant="outline" size="sm" data-testid="button-map-view">
              <Map className="w-4 h-4 mr-2" />
              🗺️ Map
            </Button>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">Sort:</span>
            <Select value={sortBy} onValueChange={setSortBy} data-testid="select-sort">
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {SORT_OPTIONS.map((option) => (
                  <SelectItem key={option.key} value={option.key}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center items-center py-8" data-testid="loading-state">
            <div className="text-lg">Loading accommodations...</div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="flex justify-center items-center py-8" data-testid="error-state">
            <div className="text-lg text-red-600">Error loading accommodations. Please try again.</div>
          </div>
        )}

        {/* No Results State */}
        {!isLoading && !error && accommodations.length === 0 && (
          <div className="flex justify-center items-center py-8" data-testid="no-results-state">
            <div className="text-lg text-gray-600">No accommodations found. Try adjusting your filters.</div>
          </div>
        )}

        {/* Accommodation Cards */}
        {!isLoading && !error && accommodations.length > 0 && (
          <div className="space-y-4" data-testid="accommodation-cards">
            {accommodations.map((accommodation: AccommodationWithRooms) => (
            <Card key={accommodation.id} className="hover:shadow-md transition-shadow" data-testid={`card-accommodation-${accommodation.id}`}>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {/* Premium Badge */}
                  {accommodation.isPremium && (
                    <div className="flex justify-center">
                      <Badge className="bg-yellow-100 text-yellow-800 px-3 py-1">
                        🌟 PREMIUM CHOICE
                      </Badge>
                    </div>
                  )}

                  {/* Header */}
                  <div className="flex items-start justify-between">
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center space-x-2">
                        <Button variant="outline" size="sm" data-testid={`button-photos-${accommodation.id}`}>
                          <Camera className="w-4 h-4 mr-1" />
                          🖼️ {accommodation.photos} Photos
                        </Button>
                        <h3 className="font-semibold text-lg">{accommodation.name}</h3>
                      </div>
                      
                      <div className="flex items-center space-x-4 text-sm">
                        <span className="flex items-center space-x-1">
                          <MapPin className="w-4 h-4 text-muted-foreground" />
                          <span>{accommodation.distance}</span>
                        </span>
                        <div className="flex items-center space-x-1">
                          <RatingStars rating={accommodation.rating} size="sm" />
                          <span className="font-medium">{accommodation.rating}</span>
                          <span className="text-muted-foreground">({accommodation.totalRatings} reviews)</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2 text-sm">
                        <span className="font-semibold text-primary text-lg">
                          💰 ₹{accommodation.price.toLocaleString()}/month
                        </span>
                        <span>• 🏠 {accommodation.roomTypes.join("/")} rooms {accommodation.available || "available"}</span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => toggleComparison(accommodation.id)}
                        className={cn(
                          selectedForComparison.includes(accommodation.id) && "bg-red-100 text-red-600"
                        )}
                        data-testid={`button-save-${accommodation.id}`}
                      >
                        <Heart className={cn(
                          "w-4 h-4",
                          accommodation.isSaved && "fill-red-500 text-red-500"
                        )} />
                        {accommodation.isSaved ? "Saved" : "Save"}
                      </Button>
                      <Button variant="outline" size="sm" data-testid={`button-call-${accommodation.id}`}>
                        <Phone className="w-4 h-4 mr-1" />
                        📱Call
                      </Button>
                    </div>
                  </div>

                  {/* Amenities */}
                  <div className="flex flex-wrap gap-2 text-sm" data-testid={`amenities-${accommodation.id}`}>
                    {accommodation.amenities.map((amenity) => (
                      <span key={amenity} className="text-green-600">✅ {amenity}</span>
                    ))}
                    {accommodation.excludedAmenities?.map((amenity) => (
                      <span key={amenity} className="text-red-600">❌ {amenity}</span>
                    ))}
                  </div>

                  {/* Special Features */}
                  <div className="flex flex-wrap gap-2 text-sm" data-testid={`features-${accommodation.id}`}>
                    {accommodation.specialFeatures.map((feature) => (
                      <span key={feature} className="text-blue-600">• {feature}</span>
                    ))}
                  </div>

                  {/* Review */}
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3" data-testid={`review-${accommodation.id}`}>
                    <p className="text-sm italic">💬 "{accommodation.review.text}"</p>
                    <p className="text-xs text-gray-600 mt-1">- {accommodation.review.author}</p>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-2" data-testid={`actions-${accommodation.id}`}>
                    <Button variant="outline" size="sm">
                      <Camera className="w-4 h-4 mr-1" />
                      📸 Virtual Tour
                    </Button>
                    <Button variant="outline" size="sm">
                      <Calendar className="w-4 h-4 mr-1" />
                      📅 Schedule Visit
                    </Button>
                    <Button size="sm">
                      <MessageCircle className="w-4 h-4 mr-1" />
                      💬 Chat Owner
                    </Button>
                    <Button variant="outline" size="sm">
                      📋 Compare
                    </Button>
                    <Button variant="outline" size="sm">
                      <MapPin className="w-4 h-4 mr-1" />
                      📍 Location
                    </Button>
                    <Button variant="outline" size="sm">
                      📄 Details
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        )}

        {/* Comparison Tool */}
        {selectedForComparison.length > 0 && (
          <Card className="sticky bottom-4 bg-blue-50 border-blue-200" data-testid="comparison-tool">
            <CardContent className="p-4">
              <div className="text-center space-y-2">
                <h3 className="font-semibold">🎯 COMPARISON TOOL</h3>
                <p className="text-sm">
                  Selected for comparison: ({selectedForComparison.length}/3)
                </p>
                <p className="text-sm">
                  {accommodations
                    .filter(acc => selectedForComparison.includes(acc.id))
                    .map(acc => `🏠 ${acc.name}`)
                    .join(" vs ")}
                </p>
                <div className="flex justify-center space-x-2 mt-3">
                  <Button size="sm" data-testid="button-compare-features">
                    📊 Compare Features
                  </Button>
                  <Button variant="outline" size="sm" data-testid="button-compare-prices">
                    💰 Compare Prices
                  </Button>
                  <Button variant="outline" size="sm" data-testid="button-compare-reviews">
                    ⭐ Compare Reviews
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}