import { useState } from "react";
import AccommodationSearch from "@/components/accommodation/accommodation-search";
import AccommodationListing from "@/components/accommodation/accommodation-listing";

interface AccommodationFilters {
  college?: string;
  distance?: string;
  accommodationType?: string;
  occupancy?: string;
  query?: string;
  quickFilters?: string[];
  distanceFilters?: string[];
  rentFilters?: string[];
  roomTypeFilters?: string[];
  amenitiesFilters?: string[];
  ratingFilters?: string[];
  specialFilters?: string[];
  sortBy?: string;
}

export default function AccommodationsPage() {
  const [filters, setFilters] = useState<AccommodationFilters>({});

  const handleSearch = (searchData: any) => {
    setFilters(searchData);
  };

  const handleFiltersChange = (newFilters: any) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900" data-testid="page-accommodations">
        <div className="container mx-auto px-4 py-8 space-y-8">
          {/* Accommodation Search */}
          <AccommodationSearch 
            onSearch={handleSearch}
            onFiltersChange={handleFiltersChange}
            data-testid="accommodation-search-section"
          />

          {/* Accommodation Listing */}
          <AccommodationListing 
            searchFilters={filters}
            onFiltersChange={handleFiltersChange}
            data-testid="accommodation-listing-section"
          />
        </div>
    </div>
  );
}