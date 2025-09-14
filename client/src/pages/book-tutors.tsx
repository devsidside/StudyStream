import { useState } from "react";
import TutorSearch from "@/components/tutors/tutor-search";
import TutorListing from "@/components/tutors/tutor-listing";
import type { TutorSearchFilters } from "@shared/schema";

export default function BookTutorsPage() {
  const [filters, setFilters] = useState<TutorSearchFilters>({});

  const handleSearch = (searchData: TutorSearchFilters) => {
    setFilters(searchData);
  };

  const handleFiltersChange = (newFilters: TutorSearchFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900" data-testid="page-book-tutors">
        <div className="container mx-auto px-4 py-8 space-y-8">
          {/* Tutor Search */}
          <TutorSearch 
            onSearch={handleSearch}
            onFiltersChange={handleFiltersChange}
            data-testid="tutor-search-section"
          />

          {/* Tutor Listing */}
          <TutorListing 
            searchFilters={filters}
            onFiltersChange={handleFiltersChange}
            data-testid="tutor-listing-section"
          />
        </div>
    </div>
  );
}