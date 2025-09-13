import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import VendorCard from "@/components/vendors/vendor-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Search, MapPin, Grid, List, Filter } from "lucide-react";

const VENDOR_CATEGORIES = [
  { key: 'accommodation', label: 'Hostels & PG', icon: '🏠', count: 124 },
  { key: 'food', label: 'Food & Mess', icon: '🍽️', count: 89 },
  { key: 'tutoring', label: 'Tutoring & Classes', icon: '👨‍🏫', count: 156 },
  { key: 'transport', label: 'Transportation', icon: '🚗', count: 67 },
  { key: 'entertainment', label: 'Entertainment', icon: '🎉', count: 45 },
  { key: 'services', label: 'Services', icon: '🔧', count: 78 },
  { key: 'shopping', label: 'Shopping', icon: '🛍️', count: 34 },
];

const PRICE_RANGES = [
  { key: 'budget', label: 'Budget-friendly', count: 234 },
  { key: 'mid-range', label: 'Mid-range', count: 156 },
  { key: 'premium', label: 'Premium', count: 89 },
];

export default function Vendors() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedPriceRanges, setSelectedPriceRanges] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  // Fetch vendors with filters
  const { data: vendorsData, isLoading } = useQuery({
    queryKey: ['/api/vendors', {
      search: searchTerm,
      category: selectedCategory,
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

  const handlePriceRangeFilter = (priceRange: string) => {
    setSelectedPriceRanges(prev => 
      prev.includes(priceRange) 
        ? prev.filter(p => p !== priceRange)
        : [...prev, priceRange]
    );
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setSelectedCategory("");
    setSelectedPriceRanges([]);
    setSearchTerm("");
    setCurrentPage(1);
  };

  const totalPages = Math.ceil((vendorsData?.total || 0) / itemsPerPage);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Header */}
      <div className="pt-24 pb-8 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <h1 className="text-3xl font-bold">Campus Services & Vendors</h1>
              <p className="text-muted-foreground mt-2">
                {vendorsData?.total ? `${vendorsData.total} services found` : 'Discover trusted services near your campus'}
              </p>
            </div>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="flex gap-2 lg:min-w-[400px]">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  type="text"
                  placeholder="Search services, vendors..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                  data-testid="input-search-vendors"
                />
              </div>
              <Button type="submit" data-testid="button-search-vendors">
                Search
              </Button>
            </form>
          </div>

          {/* Active Filters Display */}
          {(selectedCategory || selectedPriceRanges.length > 0 || searchTerm) && (
            <div className="flex flex-wrap gap-2 mt-4">
              {searchTerm && (
                <Badge variant="secondary" className="cursor-pointer" onClick={() => setSearchTerm("")} data-testid="active-filter-search">
                  Search: "{searchTerm}" ×
                </Badge>
              )}
              {selectedCategory && (
                <Badge variant="secondary" className="cursor-pointer" onClick={() => setSelectedCategory("")} data-testid="active-filter-category">
                  {VENDOR_CATEGORIES.find(c => c.key === selectedCategory)?.label} ×
                </Badge>
              )}
              {selectedPriceRanges.map(range => (
                <Badge key={range} variant="secondary" className="cursor-pointer" onClick={() => handlePriceRangeFilter(range)} data-testid={`active-filter-price-${range}`}>
                  {PRICE_RANGES.find(p => p.key === range)?.label} ×
                </Badge>
              ))}
              <Button variant="ghost" size="sm" onClick={clearFilters} data-testid="button-clear-filters">
                Clear All
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Category Tabs */}
      <div className="py-6 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-2 overflow-x-auto pb-2">
            <Button
              variant={selectedCategory === "" ? "default" : "outline"}
              size="sm"
              onClick={() => handleCategoryFilter("")}
              data-testid="category-all"
            >
              All Services
            </Button>
            {VENDOR_CATEGORIES.map((category) => (
              <Button
                key={category.key}
                variant={selectedCategory === category.key ? "default" : "outline"}
                size="sm"
                onClick={() => handleCategoryFilter(category.key)}
                className="flex items-center space-x-2 whitespace-nowrap"
                data-testid={`category-${category.key}`}
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

      {/* Main Content */}
      <div className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-8">
            {/* Sidebar Filters */}
            <div className="hidden lg:block w-64 flex-shrink-0">
              <div className="space-y-6">
                {/* Price Range Filter */}
                <Card data-testid="card-price-filter">
                  <CardHeader>
                    <CardTitle className="text-sm">Price Range</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {PRICE_RANGES.map((range) => (
                      <div key={range.key} className="flex items-center space-x-2">
                        <Checkbox
                          id={range.key}
                          checked={selectedPriceRanges.includes(range.key)}
                          onCheckedChange={() => handlePriceRangeFilter(range.key)}
                          data-testid={`checkbox-price-${range.key}`}
                        />
                        <Label 
                          htmlFor={range.key}
                          className="text-sm cursor-pointer flex-1 flex items-center justify-between"
                        >
                          <span>{range.label}</span>
                          <span className="text-xs text-muted-foreground">({range.count})</span>
                        </Label>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Location Filter */}
                <Card data-testid="card-location-filter">
                  <CardHeader>
                    <CardTitle className="text-sm flex items-center space-x-2">
                      <MapPin className="w-4 h-4" />
                      <span>Near Campus</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center justify-between">
                        <span>Within 1 km</span>
                        <span className="text-xs text-muted-foreground">(145)</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Within 2 km</span>
                        <span className="text-xs text-muted-foreground">(234)</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Within 5 km</span>
                        <span className="text-xs text-muted-foreground">(389)</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Featured Vendors */}
                <Card data-testid="card-featured-vendors">
                  <CardHeader>
                    <CardTitle className="text-sm">Featured Services</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2 p-2 rounded-lg hover:bg-muted transition-colors">
                        <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                          <span>🏠</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium">Campus Residences</p>
                          <p className="text-xs text-muted-foreground">Premium hostels</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 p-2 rounded-lg hover:bg-muted transition-colors">
                        <div className="w-8 h-8 bg-secondary/10 rounded-lg flex items-center justify-center">
                          <span>🍽️</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium">Healthy Meals</p>
                          <p className="text-xs text-muted-foreground">Nutritious food</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 min-w-0">
              {/* View Controls */}
              <div className="flex items-center justify-between mb-6">
                <div className="text-sm text-muted-foreground" data-testid="text-results-count">
                  {vendorsData?.total ? `Showing ${vendorsData.vendors?.length || 0} of ${vendorsData.total} services` : 'Loading...'}
                </div>

                <div className="flex items-center space-x-2">
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
                    <Card key={i} className="animate-pulse" data-testid={`skeleton-vendor-${i}`}>
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
              ) : vendorsData?.vendors?.length === 0 ? (
                <Card data-testid="card-no-vendors">
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
                  {/* Vendors Grid/List */}
                  <div className={viewMode === 'grid' 
                    ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6" 
                    : "space-y-4"
                  } data-testid="vendors-container">
                    {vendorsData?.vendors?.map((vendor: any) => (
                      <VendorCard 
                        key={vendor.id} 
                        vendor={vendor}
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

      <Footer />
    </div>
  );
}
