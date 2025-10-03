import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import NoteCard from "@/components/notes/note-card";
import FilterSidebar from "@/components/notes/filter-sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, Grid, List } from "lucide-react";
import { useLocation } from "wouter";

interface FilterState {
  subjects: string[];
  contentTypes: string[];
  universities: string[];
  rating: string;
  sortBy: string;
}

export default function BrowseNotes() {
  const [location, setLocation] = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState<FilterState>({
    subjects: [],
    contentTypes: [],
    universities: [],
    rating: '',
    sortBy: 'recent',
  });
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  // Parse URL parameters on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const subject = params.get('subject');
    const contentType = params.get('contentType');
    const sortBy = params.get('sortBy');
    const search = params.get('search');

    if (subject) {
      setFilters(prev => ({ ...prev, subjects: [subject] }));
    }
    if (contentType) {
      setFilters(prev => ({ ...prev, contentTypes: [contentType] }));
    }
    if (sortBy) {
      setFilters(prev => ({ ...prev, sortBy }));
    }
    if (search) {
      setSearchTerm(search);
    }
  }, []);

  // Fetch notes with filters
  const { data: notesData, isLoading } = useQuery({
    queryKey: ['/api/notes', {
      search: searchTerm,
      subject: filters.subjects[0],
      contentType: filters.contentTypes[0],
      university: filters.universities[0],
      sortBy: filters.sortBy,
      limit: itemsPerPage,
      offset: (currentPage - 1) * itemsPerPage,
    }],
    enabled: true,
  });

  // Fetch subject stats for sidebar
  const { data: subjectStats } = useQuery({
    queryKey: ['/api/analytics/subjects'],
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
  };

  const handleFiltersChange = (newFilters: FilterState) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  const clearSearch = () => {
    setSearchTerm("");
    setCurrentPage(1);
  };

  const totalPages = Math.ceil((notesData?.total || 0) / itemsPerPage);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Header */}
      <div className="pt-24 pb-8 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <h1 className="text-3xl font-bold">Browse Notes & Projects</h1>
              <p className="text-muted-foreground mt-2">
                {notesData?.total ? `${notesData.total} results found` : 'Discover academic resources from students worldwide'}
              </p>
            </div>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="flex gap-2 lg:min-w-[400px]">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  type="text"
                  placeholder="Search notes, projects..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                  data-testid="input-search"
                />
              </div>
              <Button type="submit" data-testid="button-search">
                Search
              </Button>
            </form>
          </div>

          {/* Active Filters Display */}
          {(filters.subjects.length > 0 || filters.contentTypes.length > 0 || searchTerm) && (
            <div className="flex flex-wrap gap-2 mt-4">
              {searchTerm && (
                <Badge variant="secondary" className="cursor-pointer" onClick={clearSearch} data-testid="active-filter-search">
                  Search: "{searchTerm}" ×
                </Badge>
              )}
              {filters.subjects.map(subject => (
                <Badge key={subject} variant="secondary" data-testid={`active-filter-subject-${subject}`}>
                  {subject.replace('-', ' ')}
                </Badge>
              ))}
              {filters.contentTypes.map(type => (
                <Badge key={type} variant="secondary" data-testid={`active-filter-type-${type}`}>
                  {type.replace('-', ' ')}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-8">
            {/* Sidebar */}
            <div className="hidden lg:block w-64 flex-shrink-0">
              <FilterSidebar 
                onFiltersChange={handleFiltersChange}
                subjectStats={subjectStats}
              />
            </div>

            {/* Main Content Area */}
            <div className="flex-1 min-w-0">
              {/* Tabs and View Controls */}
              <div className="flex items-center justify-between mb-6">
                <Tabs defaultValue="all" className="flex-1" data-testid="tabs-content-filter">
                  <TabsList>
                    <TabsTrigger value="all" data-testid="tab-all">All</TabsTrigger>
                    <TabsTrigger value="notes" data-testid="tab-notes">Notes</TabsTrigger>
                    <TabsTrigger value="projects" data-testid="tab-projects">Projects</TabsTrigger>
                    <TabsTrigger value="labs" data-testid="tab-labs">Labs</TabsTrigger>
                    <TabsTrigger value="assignments" data-testid="tab-assignments">Assignments</TabsTrigger>
                  </TabsList>
                </Tabs>

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
                    <Card key={i} className="animate-pulse" data-testid={`skeleton-card-${i}`}>
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
              ) : notesData?.notes?.length === 0 ? (
                <Card data-testid="card-no-results">
                  <CardContent className="p-8 text-center">
                    <div className="space-y-4">
                      <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto">
                        <Search className="w-8 h-8 text-muted-foreground" />
                      </div>
                      <h3 className="text-lg font-semibold">No results found</h3>
                      <p className="text-muted-foreground">
                        Try adjusting your search terms or filters to find what you're looking for.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <>
                  {/* Notes Grid/List */}
                  <div className={viewMode === 'grid' 
                    ? "grid grid-cols-1 lg:grid-cols-2 gap-6" 
                    : "space-y-4"
                  } data-testid="notes-container">
                    {notesData?.notes?.map((note: any) => (
                      <NoteCard 
                        key={note.id} 
                        note={note}
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
