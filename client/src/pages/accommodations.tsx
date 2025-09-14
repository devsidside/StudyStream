import { useState } from "react";
import AccommodationSearch from "@/components/accommodation/accommodation-search";
import AccommodationListing from "@/components/accommodation/accommodation-listing";
import type { AccommodationSearchFilters } from "@shared/schema";

export default function AccommodationsPage() {
  const [filters, setFilters] = useState<AccommodationSearchFilters>({});

  const handleSearch = (searchData: AccommodationSearchFilters) => {
    setFilters(searchData);
  };

  const handleFiltersChange = (newFilters: AccommodationSearchFilters) => {
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