import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, MapPin, Grid, List, Filter, Star } from "lucide-react";
import ServiceCard from "@/components/services/service-card";

// Enhanced categories matching the design
const SERVICE_CATEGORIES = [
  { key: '', label: 'All Services', icon: '📚', count: 2847 },
  { key: 'notes', label: 'Notes', icon: '📝', count: 1205 },
  { key: 'hostels', label: 'Hostels', icon: '🏠', count: 324 },
  { key: 'tutors', label: 'Tutors', icon: '👨‍🏫', count: 456 },
  { key: 'events', label: 'Events', icon: '🎉', count: 89 },
  { key: 'cafes', label: 'Cafes', icon: '☕', count: 156 },
  { key: 'transport', label: 'Transport', icon: '🚌', count: 67 },
  { key: 'fitness', label: 'Fitness', icon: '🏋️', count: 45 },
  { key: 'food', label: 'Food', icon: '🍕', count: 234 },
  { key: 'books', label: 'Books', icon: '📚', count: 78 },
];

const LOCATIONS = [
  { key: 'delhi', label: 'Delhi', count: 856 },
  { key: 'mumbai', label: 'Mumbai', count: 624 },
  { key: 'bangalore', label: 'Bangalore', count: 532 },
  { key: 'chennai', label: 'Chennai', count: 428 },
  { key: 'pune', label: 'Pune', count: 267 },
  { key: 'hyderabad', label: 'Hyderabad', count: 198 },
];

const PRICE_RANGES = [
  { key: 'free', label: 'Free', count: 1245 },
  { key: '1-500', label: '₹1-500', count: 623 },
  { key: '500-2000', label: '₹500-2000', count: 456 },
  { key: '2000+', label: '₹2000+', count: 234 },
];

const RATING_FILTERS = [
  { key: '4.5+', label: '4.5+ stars', count: 456 },
  { key: '4.0+', label: '4.0+ stars', count: 1234 },
  { key: '3.5+', label: '3.5+ stars', count: 1876 },
  { key: '3.0+', label: '3.0+ stars', count: 2234 },
];

const AVAILABILITY_FILTERS = [
  { key: 'available', label: 'Available', count: 1876 },
  { key: 'busy', label: 'Busy', count: 456 },
  { key: 'closed', label: 'Closed', count: 234 },
];

const SUBJECTS = [
  { key: 'cs', label: 'Computer Science', count: 678 },
  { key: 'math', label: 'Mathematics', count: 534 },
  { key: 'physics', label: 'Physics', count: 456 },
  { key: 'chemistry', label: 'Chemistry', count: 389 },
  { key: 'biology', label: 'Biology', count: 267 },
  { key: 'english', label: 'English', count: 198 },
];

const LEVELS = [
  { key: 'beginner', label: 'Beginner', count: 923 },
  { key: 'intermediate', label: 'Intermediate', count: 1245 },
  { key: 'advanced', label: 'Advanced', count: 456 },
];

const UNIVERSITIES = [
  { key: 'iit', label: 'IIT', count: 1234 },
  { key: 'nit', label: 'NIT', count: 876 },
  { key: 'du', label: 'Delhi University', count: 543 },
  { key: 'other', label: 'Other', count: 2345 },
];

const FEATURES = [
  { key: 'verified', label: 'Verified', count: 1456 },
  { key: 'new', label: 'New', count: 234 },
  { key: 'premium', label: 'Premium', count: 456 },
  { key: 'featured', label: 'Featured', count: 123 },
];

interface ServicesListingProps {
  apiEndpoint?: string;
  title?: string;
  subtitle?: string;
  showCategories?: boolean;
  showFilters?: boolean;
  defaultCategory?: string;
  itemsPerPage?: number;
}

export default function ServicesListing({
  apiEndpoint = '/api/services',
  title = "Browse All Services",
  subtitle = "Discover 10,000+ verified services across India",
  showCategories = true,
  showFilters = true,
  defaultCategory = "",
  itemsPerPage = 20
}: ServicesListingProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(defaultCategory);
  const [selectedPriceRanges, setSelectedPriceRanges] = useState<string[]>([]);
  const [selectedRatings, setSelectedRatings] = useState<string[]>([]);
  const [selectedAvailability, setSelectedAvailability] = useState<string[]>([]);
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [selectedLevels, setSelectedLevels] = useState<string[]>([]);
  const [selectedUniversities, setSelectedUniversities] = useState<string[]>([]);
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState('popular');

  // Fetch services with filters
  const { data: servicesData, isLoading } = useQuery<{
    services: any[];
    total: number;
  }>({
    queryKey: [apiEndpoint, {
      search: searchTerm,
      location: selectedLocation,
      category: selectedCategory,
      priceRanges: selectedPriceRanges,
      ratings: selectedRatings,
      availability: selectedAvailability,
      subjects: selectedSubjects,
      levels: selectedLevels,
      universities: selectedUniversities,
      features: selectedFeatures,
      sortBy,
      limit: itemsPerPage,
      offset: (currentPage - 1) * itemsPerPage,
    }],
    enabled: true,
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
  };

  const handleCategoryFilter = (category: string) => {
    setSelectedCategory(category === selectedCategory ? "" : category);
    setCurrentPage(1);
  };

  const toggleFilter = (value: string, currentFilters: string[], setFilters: (filters: string[]) => void) => {
    setFilters(
      currentFilters.includes(value) 
        ? currentFilters.filter(f => f !== value)
        : [...currentFilters, value]
    );
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setSelectedCategory(defaultCategory);
    setSelectedPriceRanges([]);
    setSelectedRatings([]);
    setSelectedAvailability([]);
    setSelectedSubjects([]);
    setSelectedLevels([]);
    setSelectedUniversities([]);
    setSelectedFeatures([]);
    setSelectedLocation("");
    setSearchTerm("");
    setCurrentPage(1);
  };

  const hasActiveFilters = selectedCategory !== defaultCategory || selectedPriceRanges.length > 0 || 
    selectedRatings.length > 0 || selectedAvailability.length > 0 || selectedSubjects.length > 0 || 
    selectedLevels.length > 0 || selectedUniversities.length > 0 || selectedFeatures.length > 0 || 
    selectedLocation || searchTerm;

  const totalPages = Math.ceil((servicesData?.total || 0) / itemsPerPage);

  return (
    <div className="min-h-screen bg-background">      
      {/* Header */}
      <div className="pt-8 pb-8 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-2" data-testid="services-title">🔍 {title}</h1>
            <p className="text-muted-foreground text-lg" data-testid="services-subtitle">
              {subtitle}
            </p>
          </div>

          {/* Search & Filter Bar */}
          <Card className="mb-6">
            <CardContent className="p-6">
              <form onSubmit={handleSearch} className="flex flex-col lg:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    type="text"
                    placeholder="🔍 Search services, notes, hostels..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                    data-testid="input-search-services"
                  />
                </div>
                
                <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                  <SelectTrigger className="lg:w-48" data-testid="select-location">
                    <MapPin className="w-4 h-4 mr-2" />
                    <SelectValue placeholder="📍 Location" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Locations</SelectItem>
                    {LOCATIONS.map(location => (
                      <SelectItem key={location.key} value={location.key}>
                        {location.label} ({location.count})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <Button type="submit" data-testid="button-search-services">
                  🔍 Search
                </Button>
              </form>
              
              <div className="mt-4 text-sm text-muted-foreground">
                💡 Try: "CS notes", "PG near IIT", "NEET coaching", "study groups"
              </div>
            </CardContent>
          </Card>

          {/* Results Count */}
          <div className="text-center text-muted-foreground">
            {servicesData?.total ? `${servicesData.total} services found` : 'Loading services...'}
          </div>
        </div>
      </div>

      {/* Category Tabs */}
      {showCategories && (
        <div className="py-6 border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center space-x-2 overflow-x-auto pb-2">
              {SERVICE_CATEGORIES.map((category) => (
                <Button
                  key={category.key}
                  variant={selectedCategory === category.key ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleCategoryFilter(category.key)}
                  className="flex items-center space-x-2 whitespace-nowrap"
                  data-testid={`category-${category.key || 'all'}`}
                >
                  <span>{category.icon}</span>
                  <span>{category.label}</span>
                  <Badge variant="secondary" className="text-xs">
                    {category.count}
                  </Badge>
                </Button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-8">
            {/* Sidebar Filters */}
            {showFilters && (
              <div className="hidden lg:block w-64 flex-shrink-0">
                <div className="space-y-6">
                  {/* Active Filters Summary */}
                  {hasActiveFilters && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-sm flex items-center justify-between">
                          <span>Active Filters</span>
                          <Button variant="ghost" size="sm" onClick={clearFilters}>
                            Clear All
                          </Button>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-wrap gap-1">
                          {selectedCategory && selectedCategory !== defaultCategory && (
                            <Badge variant="secondary" className="text-xs">
                              {SERVICE_CATEGORIES.find(c => c.key === selectedCategory)?.label}
                            </Badge>
                          )}
                          {selectedLocation && (
                            <Badge variant="secondary" className="text-xs">
                              {LOCATIONS.find(l => l.key === selectedLocation)?.label}
                            </Badge>
                          )}
                          {selectedPriceRanges.length > 0 && (
                            <Badge variant="secondary" className="text-xs">
                              {selectedPriceRanges.length} price filters
                            </Badge>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Price Range Filter */}
                  <Card data-testid="card-price-filter">
                    <CardHeader>
                      <CardTitle className="text-sm">💰 Price Range</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {PRICE_RANGES.map((range) => (
                        <div key={range.key} className="flex items-center space-x-2">
                          <Checkbox
                            id={`price-${range.key}`}
                            checked={selectedPriceRanges.includes(range.key)}
                            onCheckedChange={() => toggleFilter(range.key, selectedPriceRanges, setSelectedPriceRanges)}
                            data-testid={`checkbox-price-${range.key}`}
                          />
                          <Label 
                            htmlFor={`price-${range.key}`}
                            className="text-sm cursor-pointer flex-1 flex items-center justify-between"
                          >
                            <span>{range.label}</span>
                            <span className="text-xs text-muted-foreground">({range.count})</span>
                          </Label>
                        </div>
                      ))}
                    </CardContent>
                  </Card>

                  {/* Rating Filter */}
                  <Card data-testid="card-rating-filter">
                    <CardHeader>
                      <CardTitle className="text-sm">⭐ Rating</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {RATING_FILTERS.map((rating) => (
                        <div key={rating.key} className="flex items-center space-x-2">
                          <Checkbox
                            id={`rating-${rating.key}`}
                            checked={selectedRatings.includes(rating.key)}
                            onCheckedChange={() => toggleFilter(rating.key, selectedRatings, setSelectedRatings)}
                            data-testid={`checkbox-rating-${rating.key}`}
                          />
                          <Label 
                            htmlFor={`rating-${rating.key}`}
                            className="text-sm cursor-pointer flex-1 flex items-center justify-between"
                          >
                            <span>{rating.label}</span>
                            <span className="text-xs text-muted-foreground">({rating.count})</span>
                          </Label>
                        </div>
                      ))}
                    </CardContent>
                  </Card>

                  {/* Subject Filter */}
                  <Card data-testid="card-subject-filter">
                    <CardHeader>
                      <CardTitle className="text-sm">📚 Subject</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {SUBJECTS.map((subject) => (
                        <div key={subject.key} className="flex items-center space-x-2">
                          <Checkbox
                            id={`subject-${subject.key}`}
                            checked={selectedSubjects.includes(subject.key)}
                            onCheckedChange={() => toggleFilter(subject.key, selectedSubjects, setSelectedSubjects)}
                            data-testid={`checkbox-subject-${subject.key}`}
                          />
                          <Label 
                            htmlFor={`subject-${subject.key}`}
                            className="text-sm cursor-pointer flex-1 flex items-center justify-between"
                          >
                            <span>{subject.label}</span>
                            <span className="text-xs text-muted-foreground">({subject.count})</span>
                          </Label>
                        </div>
                      ))}
                    </CardContent>
                  </Card>

                  {/* Level Filter */}
                  <Card data-testid="card-level-filter">
                    <CardHeader>
                      <CardTitle className="text-sm">🎓 Level</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {LEVELS.map((level) => (
                        <div key={level.key} className="flex items-center space-x-2">
                          <Checkbox
                            id={`level-${level.key}`}
                            checked={selectedLevels.includes(level.key)}
                            onCheckedChange={() => toggleFilter(level.key, selectedLevels, setSelectedLevels)}
                            data-testid={`checkbox-level-${level.key}`}
                          />
                          <Label 
                            htmlFor={`level-${level.key}`}
                            className="text-sm cursor-pointer flex-1 flex items-center justify-between"
                          >
                            <span>{level.label}</span>
                            <span className="text-xs text-muted-foreground">({level.count})</span>
                          </Label>
                        </div>
                      ))}
                    </CardContent>
                  </Card>

                  {/* University Filter */}
                  <Card data-testid="card-university-filter">
                    <CardHeader>
                      <CardTitle className="text-sm">🏫 University</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {UNIVERSITIES.map((university) => (
                        <div key={university.key} className="flex items-center space-x-2">
                          <Checkbox
                            id={`university-${university.key}`}
                            checked={selectedUniversities.includes(university.key)}
                            onCheckedChange={() => toggleFilter(university.key, selectedUniversities, setSelectedUniversities)}
                            data-testid={`checkbox-university-${university.key}`}
                          />
                          <Label 
                            htmlFor={`university-${university.key}`}
                            className="text-sm cursor-pointer flex-1 flex items-center justify-between"
                          >
                            <span>{university.label}</span>
                            <span className="text-xs text-muted-foreground">({university.count})</span>
                          </Label>
                        </div>
                      ))}
                    </CardContent>
                  </Card>

                  {/* Features Filter */}
                  <Card data-testid="card-features-filter">
                    <CardHeader>
                      <CardTitle className="text-sm">🔧 Features</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {FEATURES.map((feature) => (
                        <div key={feature.key} className="flex items-center space-x-2">
                          <Checkbox
                            id={`feature-${feature.key}`}
                            checked={selectedFeatures.includes(feature.key)}
                            onCheckedChange={() => toggleFilter(feature.key, selectedFeatures, setSelectedFeatures)}
                            data-testid={`checkbox-feature-${feature.key}`}
                          />
                          <Label 
                            htmlFor={`feature-${feature.key}`}
                            className="text-sm cursor-pointer flex-1 flex items-center justify-between"
                          >
                            <span>{feature.label}</span>
                            <span className="text-xs text-muted-foreground">({feature.count})</span>
                          </Label>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}

            {/* Main Content Area */}
            <div className="flex-1 min-w-0">
              {/* View Controls */}
              <div className="flex items-center justify-between mb-6">
                <div className="text-sm text-muted-foreground" data-testid="text-results-count">
                  {servicesData?.total ? `Showing ${servicesData.services?.length || 0} of ${servicesData.total} services` : 'Loading...'}
                </div>

                <div className="flex items-center space-x-2">
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-40" data-testid="select-sort">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="popular">Popular</SelectItem>
                      <SelectItem value="newest">Newest</SelectItem>
                      <SelectItem value="rating">Highest Rated</SelectItem>
                      <SelectItem value="price-low">Price: Low to High</SelectItem>
                      <SelectItem value="price-high">Price: High to Low</SelectItem>
                    </SelectContent>
                  </Select>

                  <Button
                    variant={viewMode === 'grid' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setViewMode('grid')}
                    data-testid="button-grid-view"
                  >
                    <Grid className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={viewMode === 'list' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setViewMode('list')}
                    data-testid="button-list-view"
                  >
                    <List className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Results */}
              {isLoading ? (
                <div className="space-y-4">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <Card key={i} className="animate-pulse" data-testid={`skeleton-service-${i}`}>
                      <CardContent className="p-6">
                        <div className="space-y-3">
                          <div className="h-4 bg-muted rounded w-3/4"></div>
                          <div className="h-4 bg-muted rounded w-1/2"></div>
                          <div className="h-4 bg-muted rounded w-5/6"></div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : servicesData?.services?.length === 0 ? (
                <Card data-testid="card-no-services">
                  <CardContent className="p-8 text-center">
                    <div className="space-y-4">
                      <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto">
                        <Search className="w-8 h-8 text-muted-foreground" />
                      </div>
                      <h3 className="text-lg font-semibold">No services found</h3>
                      <p className="text-muted-foreground">
                        Try adjusting your search terms or filters to find services.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <>
                  {/* Services Grid/List */}
                  <div className={viewMode === 'grid' 
                    ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6" 
                    : "space-y-4"
                  } data-testid="services-container">
                    {servicesData?.services?.map((service: any) => (
                      <ServiceCard 
                        key={service.id} 
                        service={service}
                        className={viewMode === 'list' ? 'w-full' : ''}
                      />
                    ))}
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="flex items-center justify-center space-x-2 mt-8" data-testid="pagination">
                      <Button
                        variant="outline"
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        data-testid="button-prev-page"
                      >
                        Previous
                      </Button>
                      
                      <span className="text-sm text-muted-foreground px-4" data-testid="text-pagination-info">
                        Page {currentPage} of {totalPages}
                      </span>
                      
                      <Button
                        variant="outline"
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        data-testid="button-next-page"
                      >
                        Next
                      </Button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}