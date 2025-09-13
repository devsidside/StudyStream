import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

interface FilterSidebarProps {
  onFiltersChange: (filters: FilterState) => void;
  subjectStats?: { subject: string; count: number }[];
}

interface FilterState {
  subjects: string[];
  contentTypes: string[];
  universities: string[];
  rating: string;
  sortBy: string;
}

const CONTENT_TYPES = [
  { key: 'lecture-notes', label: 'Lecture Notes', count: 567 },
  { key: 'study-guide', label: 'Study Guides', count: 234 },
  { key: 'past-paper', label: 'Past Papers', count: 189 },
  { key: 'project', label: 'Projects', count: 156 },
  { key: 'lab-report', label: 'Lab Reports', count: 123 },
  { key: 'assignment', label: 'Assignments', count: 234 },
  { key: 'reference-material', label: 'Reference Material', count: 89 },
];

const UNIVERSITIES = [
  { key: 'university-of-technology', label: 'University of Technology', count: 890 },
  { key: 'state-university', label: 'State University', count: 456 },
  { key: 'city-college', label: 'City College', count: 234 },
];

export default function FilterSidebar({ onFiltersChange, subjectStats = [] }: FilterSidebarProps) {
  const [filters, setFilters] = useState<FilterState>({
    subjects: [],
    contentTypes: [],
    universities: [],
    rating: '',
    sortBy: 'recent',
  });

  const updateFilters = (newFilters: Partial<FilterState>) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);
    onFiltersChange(updatedFilters);
  };

  const toggleArrayFilter = (category: keyof FilterState, value: string) => {
    const currentArray = filters[category] as string[];
    const newArray = currentArray.includes(value)
      ? currentArray.filter(item => item !== value)
      : [...currentArray, value];
    
    updateFilters({ [category]: newArray });
  };

  const clearAllFilters = () => {
    const clearedFilters: FilterState = {
      subjects: [],
      contentTypes: [],
      universities: [],
      rating: '',
      sortBy: 'recent',
    };
    setFilters(clearedFilters);
    onFiltersChange(clearedFilters);
  };

  const getActiveFilterCount = () => {
    return filters.subjects.length + 
           filters.contentTypes.length + 
           filters.universities.length + 
           (filters.rating ? 1 : 0);
  };

  return (
    <div className="space-y-6" data-testid="filter-sidebar">
      {/* Active Filters */}
      {getActiveFilterCount() > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm">Active Filters</CardTitle>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={clearAllFilters}
                data-testid="button-clear-all"
              >
                Clear All
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex flex-wrap gap-2">
              {filters.subjects.map(subject => (
                <Badge 
                  key={subject} 
                  variant="secondary" 
                  className="text-xs cursor-pointer hover:bg-destructive hover:text-destructive-foreground"
                  onClick={() => toggleArrayFilter('subjects', subject)}
                  data-testid={`active-filter-subject-${subject}`}
                >
                  {subject.replace('-', ' ')} <X className="w-3 h-3 ml-1" />
                </Badge>
              ))}
              {filters.contentTypes.map(type => (
                <Badge 
                  key={type} 
                  variant="secondary" 
                  className="text-xs cursor-pointer hover:bg-destructive hover:text-destructive-foreground"
                  onClick={() => toggleArrayFilter('contentTypes', type)}
                  data-testid={`active-filter-type-${type}`}
                >
                  {type.replace('-', ' ')} <X className="w-3 h-3 ml-1" />
                </Badge>
              ))}
              {filters.universities.map(uni => (
                <Badge 
                  key={uni} 
                  variant="secondary" 
                  className="text-xs cursor-pointer hover:bg-destructive hover:text-destructive-foreground"
                  onClick={() => toggleArrayFilter('universities', uni)}
                  data-testid={`active-filter-university-${uni}`}
                >
                  {uni.replace('-', ' ')} <X className="w-3 h-3 ml-1" />
                </Badge>
              ))}
              {filters.rating && (
                <Badge 
                  variant="secondary" 
                  className="text-xs cursor-pointer hover:bg-destructive hover:text-destructive-foreground"
                  onClick={() => updateFilters({ rating: '' })}
                  data-testid="active-filter-rating"
                >
                  {filters.rating}+ stars <X className="w-3 h-3 ml-1" />
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Sort By */}
      <Card data-testid="card-sort">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Sort By</CardTitle>
        </CardHeader>
        <CardContent>
          <RadioGroup value={filters.sortBy} onValueChange={(value) => updateFilters({ sortBy: value })}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="recent" id="recent" />
              <Label htmlFor="recent" className="text-sm" data-testid="sort-recent">Most Recent</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="popular" id="popular" />
              <Label htmlFor="popular" className="text-sm" data-testid="sort-popular">Most Popular</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="rating" id="rating" />
              <Label htmlFor="rating" className="text-sm" data-testid="sort-rating">Highest Rated</Label>
            </div>
          </RadioGroup>
        </CardContent>
      </Card>

      {/* Subjects */}
      <Card data-testid="card-subjects">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center space-x-2">
            <span>📚 BY SUBJECT</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {subjectStats.map((subject) => (
            <div key={subject.subject} className="flex items-center space-x-2">
              <Checkbox
                id={subject.subject}
                checked={filters.subjects.includes(subject.subject)}
                onCheckedChange={() => toggleArrayFilter('subjects', subject.subject)}
                data-testid={`checkbox-subject-${subject.subject}`}
              />
              <Label 
                htmlFor={subject.subject}
                className="text-sm cursor-pointer flex-1 flex items-center justify-between"
              >
                <span className="capitalize">{subject.subject.replace('-', ' ')}</span>
                <span className="text-xs text-muted-foreground">({subject.count})</span>
              </Label>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Content Types */}
      <Card data-testid="card-content-types">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center space-x-2">
            <span>📁 BY TYPE</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {CONTENT_TYPES.map((type) => (
            <div key={type.key} className="flex items-center space-x-2">
              <Checkbox
                id={type.key}
                checked={filters.contentTypes.includes(type.key)}
                onCheckedChange={() => toggleArrayFilter('contentTypes', type.key)}
                data-testid={`checkbox-type-${type.key}`}
              />
              <Label 
                htmlFor={type.key}
                className="text-sm cursor-pointer flex-1 flex items-center justify-between"
              >
                <span>{type.label}</span>
                <span className="text-xs text-muted-foreground">({type.count})</span>
              </Label>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Rating Filter */}
      <Card data-testid="card-rating">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center space-x-2">
            <span>⭐ RATING</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <RadioGroup value={filters.rating} onValueChange={(value) => updateFilters({ rating: value })}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="4.5" id="45" />
              <Label htmlFor="45" className="text-sm" data-testid="rating-45">4.5+ stars</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="4.0" id="40" />
              <Label htmlFor="40" className="text-sm" data-testid="rating-40">4.0+ stars</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="3.0" id="30" />
              <Label htmlFor="30" className="text-sm" data-testid="rating-30">3.0+ stars</Label>
            </div>
          </RadioGroup>
        </CardContent>
      </Card>

      {/* Universities */}
      <Card data-testid="card-universities">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center space-x-2">
            <span>🏫 BY UNIVERSITY</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {UNIVERSITIES.map((uni) => (
            <div key={uni.key} className="flex items-center space-x-2">
              <Checkbox
                id={uni.key}
                checked={filters.universities.includes(uni.key)}
                onCheckedChange={() => toggleArrayFilter('universities', uni.key)}
                data-testid={`checkbox-university-${uni.key}`}
              />
              <Label 
                htmlFor={uni.key}
                className="text-sm cursor-pointer flex-1 flex items-center justify-between"
              >
                <span>{uni.label}</span>
                <span className="text-xs text-muted-foreground">({uni.count})</span>
              </Label>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
