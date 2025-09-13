import { useState, useEffect } from "react";
import { useDebounce } from "@/hooks/use-debounce";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Search, Filter, X, CalendarIcon, Star, Download, Eye, Clock } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

export interface SearchFilters {
  searchTerm: string;
  subjects: string[];
  contentTypes: string[];
  universities: string[];
  professors: string[];
  courseCodes: string[];
  tags: string[];
  minRating: number;
  dateRange: {
    from?: Date;
    to?: Date;
  };
  sortBy: string;
  sortOrder: 'asc' | 'desc';
  limit: number;
  offset: number;
}

interface AdvancedSearchProps {
  filters: SearchFilters;
  onFiltersChange: (filters: SearchFilters) => void;
  onSearch: () => void;
  isLoading?: boolean;
  totalResults?: number;
}

// Available filter options
const SUBJECTS = [
  { value: "computer-science", label: "Computer Science" },
  { value: "mathematics", label: "Mathematics" },
  { value: "physics", label: "Physics" },
  { value: "chemistry", label: "Chemistry" },
  { value: "engineering", label: "Engineering" },
  { value: "business", label: "Business" },
  { value: "biology", label: "Biology" },
  { value: "psychology", label: "Psychology" },
  { value: "economics", label: "Economics" },
  { value: "literature", label: "Literature" },
  { value: "history", label: "History" },
  { value: "other", label: "Other" }
];

const CONTENT_TYPES = [
  { value: "lecture-notes", label: "Lecture Notes", icon: "📝" },
  { value: "study-guide", label: "Study Guides", icon: "📖" },
  { value: "past-paper", label: "Past Papers", icon: "📋" },
  { value: "project", label: "Projects", icon: "💻" },
  { value: "lab-report", label: "Lab Reports", icon: "🧪" },
  { value: "assignment", label: "Assignments", icon: "📄" },
  { value: "reference-material", label: "Reference Material", icon: "📚" }
];

const SORT_OPTIONS = [
  { value: "recent", label: "Most Recent", icon: Clock },
  { value: "popular", label: "Most Downloaded", icon: Download },
  { value: "rating", label: "Highest Rated", icon: Star },
  { value: "views", label: "Most Viewed", icon: Eye },
  { value: "title", label: "Alphabetical", icon: Search }
];

export default function AdvancedSearch({ 
  filters, 
  onFiltersChange, 
  onSearch, 
  isLoading = false,
  totalResults = 0 
}: AdvancedSearchProps) {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [localSearchTerm, setLocalSearchTerm] = useState(filters.searchTerm);
  
  // Debounce search term to avoid excessive API calls
  const debouncedSearchTerm = useDebounce(localSearchTerm, 300);

  useEffect(() => {
    if (debouncedSearchTerm !== filters.searchTerm) {
      onFiltersChange({ ...filters, searchTerm: debouncedSearchTerm, offset: 0 });
    }
  }, [debouncedSearchTerm]);

  const updateFilter = (key: keyof SearchFilters, value: any) => {
    onFiltersChange({ ...filters, [key]: value, offset: 0 });
  };

  const toggleArrayFilter = (key: keyof SearchFilters, value: string) => {
    const currentArray = filters[key] as string[];
    const newArray = currentArray.includes(value)
      ? currentArray.filter(item => item !== value)
      : [...currentArray, value];
    updateFilter(key, newArray);
  };

  const clearFilters = () => {
    onFiltersChange({
      searchTerm: "",
      subjects: [],
      contentTypes: [],
      universities: [],
      professors: [],
      courseCodes: [],
      tags: [],
      minRating: 0,
      dateRange: {},
      sortBy: "recent",
      sortOrder: "desc",
      limit: 20,
      offset: 0
    });
    setLocalSearchTerm("");
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.subjects.length > 0) count++;
    if (filters.contentTypes.length > 0) count++;
    if (filters.universities.length > 0) count++;
    if (filters.professors.length > 0) count++;
    if (filters.courseCodes.length > 0) count++;
    if (filters.tags.length > 0) count++;
    if (filters.minRating > 0) count++;
    if (filters.dateRange.from || filters.dateRange.to) count++;
    return count;
  };

  return (
    <Card className="w-full" data-testid="advanced-search">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <Search className="w-5 h-5" />
            <span>Search & Filter</span>
            {totalResults > 0 && (
              <Badge variant="secondary" className="ml-2">
                {totalResults.toLocaleString()} results
              </Badge>
            )}
          </CardTitle>
          <div className="flex items-center space-x-2">
            {getActiveFiltersCount() > 0 && (
              <Button variant="ghost" size="sm" onClick={clearFilters} data-testid="button-clear-filters">
                <X className="w-4 h-4 mr-1" />
                Clear ({getActiveFiltersCount()})
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowAdvanced(!showAdvanced)}
              data-testid="button-toggle-advanced"
            >
              <Filter className="w-4 h-4 mr-1" />
              {showAdvanced ? "Simple" : "Advanced"}
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Main Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search for notes, projects, or topics..."
            value={localSearchTerm}
            onChange={(e) => setLocalSearchTerm(e.target.value)}
            className="pl-10 pr-4"
            data-testid="input-search-term"
          />
        </div>

        {/* Quick Filters */}
        <div className="space-y-4">
          <div>
            <Label className="text-sm font-medium mb-2 block">Content Type</Label>
            <div className="flex flex-wrap gap-2">
              {CONTENT_TYPES.map((type) => (
                <Button
                  key={type.value}
                  variant={filters.contentTypes.includes(type.value) ? "default" : "outline"}
                  size="sm"
                  onClick={() => toggleArrayFilter("contentTypes", type.value)}
                  className="h-8"
                  data-testid={`button-content-type-${type.value}`}
                >
                  <span className="mr-1">{type.icon}</span>
                  {type.label}
                </Button>
              ))}
            </div>
          </div>

          <div>
            <Label className="text-sm font-medium mb-2 block">Subject</Label>
            <div className="flex flex-wrap gap-2">
              {SUBJECTS.map((subject) => (
                <Button
                  key={subject.value}
                  variant={filters.subjects.includes(subject.value) ? "default" : "outline"}
                  size="sm"
                  onClick={() => toggleArrayFilter("subjects", subject.value)}
                  className="h-8"
                  data-testid={`button-subject-${subject.value}`}
                >
                  {subject.label}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Advanced Filters */}
        {showAdvanced && (
          <>
            <Separator />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Sort Options */}
              <div className="space-y-3">
                <Label className="text-sm font-medium">Sort By</Label>
                <Select value={filters.sortBy} onValueChange={(value) => updateFilter("sortBy", value)}>
                  <SelectTrigger data-testid="select-sort-by">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {SORT_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        <div className="flex items-center space-x-2">
                          <option.icon className="w-4 h-4" />
                          <span>{option.label}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Rating Filter */}
              <div className="space-y-3">
                <Label className="text-sm font-medium">Minimum Rating</Label>
                <div className="space-y-2">
                  <Slider
                    value={[filters.minRating]}
                    onValueChange={(value) => updateFilter("minRating", value[0])}
                    max={5}
                    min={0}
                    step={0.5}
                    className="w-full"
                    data-testid="slider-min-rating"
                  />
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>Any</span>
                    <div className="flex items-center space-x-1">
                      <Star className="w-3 h-3 fill-current" />
                      <span>{filters.minRating}+</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Date Range */}
              <div className="space-y-3">
                <Label className="text-sm font-medium">Date Range</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !filters.dateRange.from && "text-muted-foreground"
                      )}
                      data-testid="button-date-range"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {filters.dateRange.from ? (
                        filters.dateRange.to ? (
                          <>
                            {format(filters.dateRange.from, "LLL dd, y")} -{" "}
                            {format(filters.dateRange.to, "LLL dd, y")}
                          </>
                        ) : (
                          format(filters.dateRange.from, "LLL dd, y")
                        )
                      ) : (
                        <span>Pick a date range</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      initialFocus
                      mode="range"
                      defaultMonth={filters.dateRange.from}
                      selected={filters.dateRange}
                      onSelect={(range) => updateFilter("dateRange", range || {})}
                      numberOfMonths={2}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            {/* Additional Text Filters */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="university" className="text-sm font-medium">University</Label>
                <Input
                  id="university"
                  placeholder="Filter by university..."
                  value={filters.universities.join(", ")}
                  onChange={(e) => updateFilter("universities", e.target.value.split(",").map(s => s.trim()).filter(Boolean))}
                  data-testid="input-university"
                />
              </div>
              
              <div>
                <Label htmlFor="professor" className="text-sm font-medium">Professor</Label>
                <Input
                  id="professor"
                  placeholder="Filter by professor..."
                  value={filters.professors.join(", ")}
                  onChange={(e) => updateFilter("professors", e.target.value.split(",").map(s => s.trim()).filter(Boolean))}
                  data-testid="input-professor"
                />
              </div>
              
              <div>
                <Label htmlFor="courseCode" className="text-sm font-medium">Course Code</Label>
                <Input
                  id="courseCode"
                  placeholder="e.g., CS101, MATH201..."
                  value={filters.courseCodes.join(", ")}
                  onChange={(e) => updateFilter("courseCodes", e.target.value.split(",").map(s => s.trim()).filter(Boolean))}
                  data-testid="input-course-code"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="tags" className="text-sm font-medium">Tags</Label>
              <Input
                id="tags"
                placeholder="Separate tags with commas..."
                value={filters.tags.join(", ")}
                onChange={(e) => updateFilter("tags", e.target.value.split(",").map(s => s.trim()).filter(Boolean))}
                data-testid="input-tags"
              />
            </div>
          </>
        )}

        {/* Search Button */}
        <div className="flex justify-center pt-4">
          <Button
            onClick={onSearch}
            disabled={isLoading}
            size="lg"
            className="min-w-32"
            data-testid="button-search"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Searching...
              </>
            ) : (
              <>
                <Search className="w-4 h-4 mr-2" />
                Search
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}