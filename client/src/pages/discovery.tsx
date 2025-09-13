import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BookOpen,
  GraduationCap,
  Building,
  PartyPopper,
  Search,
  MapPin,
  Filter,
  List,
  Map,
  Star,
  Clock,
  Navigation,
  Wifi,
  Coffee,
  Menu,
  Bell,
  Heart,
  ExternalLink,
  ChevronDown
} from "lucide-react";

export default function Discovery() {
  const [searchTerm, setSearchTerm] = useState("libraries near me");
  const [activeCategory, setActiveCategory] = useState("libraries");
  const [viewMode, setViewMode] = useState<"list" | "map">("list");
  const [showFilters, setShowFilters] = useState(true);

  const categories = [
    { id: "all", label: "All", icon: null },
    { id: "libraries", label: "Libraries", icon: BookOpen },
    { id: "tutors", label: "Tutors", icon: GraduationCap },
    { id: "hostels", label: "Hostels", icon: Building },
    { id: "events", label: "Events", icon: PartyPopper },
  ];

  const mockResults = [
    {
      id: 1,
      name: "Central Library",
      type: "Library",
      rating: 4.8,
      reviews: 124,
      distance: "0.3 miles",
      walkTime: "7 min walk",
      status: "Open",
      hours: "Open until 10:00 PM",
      features: ["WiFi", "Study Rooms", "24/7"],
      image: "/api/placeholder/80/80"
    },
    {
      id: 2,
      name: "Science Library",
      type: "Library",
      rating: 4.6,
      reviews: 89,
      distance: "0.8 miles",
      walkTime: "12 min walk",
      status: "Closed",
      hours: "Opens at 7:00 AM tomorrow",
      features: ["WiFi", "Computer Lab", "Group Study"],
      image: "/api/placeholder/80/80"
    },
    {
      id: 3,
      name: "East Campus Library",
      type: "Library",
      rating: 4.4,
      reviews: 156,
      distance: "1.2 miles",
      walkTime: "15 min walk",
      status: "Open",
      hours: "Open until 11:00 PM",
      features: ["WiFi", "Study Rooms", "Printing"],
      image: "/api/placeholder/80/80"
    }
  ];

  const filters = {
    distance: ["0-1mi", "1-3mi", "3-5mi"],
    price: ["Free", "$", "$$"],
    rating: ["4+ stars"],
    hours: ["Open now", "24/7"],
    amenities: ["WiFi", "Quiet", "24/7", "Study Rooms", "Computer Lab", "Printing"]
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Top Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="flex items-center justify-between h-16 px-4">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" data-testid="button-menu">
              <Menu className="h-5 w-5" />
            </Button>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold text-foreground">StudyConnect</span>
            </div>
          </div>
          
          <div className="flex-1 max-w-2xl mx-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search libraries, tutors, hostels..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
                data-testid="input-search"
              />
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" data-testid="button-notifications">
              <Bell className="h-5 w-5" />
            </Button>
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
              <span className="text-primary-foreground text-sm font-medium">S</span>
            </div>
          </div>
        </div>
      </nav>

      <div className="pt-16">
        {/* Search Bar & Location */}
        <div className="bg-background border-b border-border p-4">
          <div className="max-w-7xl mx-auto flex items-center gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search: libraries near me"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
                data-testid="input-main-search"
              />
            </div>
            <Select defaultValue="campus">
              <SelectTrigger className="w-48" data-testid="select-location">
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-2" />
                  <SelectValue />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="campus">Near Campus</SelectItem>
                <SelectItem value="downtown">Downtown</SelectItem>
                <SelectItem value="current">Current Location</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="bg-background border-b border-border p-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <Tabs value={activeCategory} onValueChange={setActiveCategory} className="flex-1">
              <TabsList className="grid w-full max-w-2xl grid-cols-5">
                {categories.map((category) => (
                  <TabsTrigger
                    key={category.id}
                    value={category.id}
                    className="flex items-center gap-2"
                    data-testid={`tab-${category.id}`}
                  >
                    {category.icon && <category.icon className="h-4 w-4" />}
                    {category.label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
            
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              data-testid="button-toggle-filters"
            >
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
          </div>
        </div>

        <div className="max-w-7xl mx-auto flex">
          {/* Filters Sidebar */}
          {showFilters && (
            <aside className="w-64 p-6 border-r border-border">
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-foreground mb-3" data-testid="heading-distance">Distance</h3>
                  <div className="space-y-2">
                    {filters.distance.map((option) => (
                      <div key={option} className="flex items-center space-x-2">
                        <Checkbox id={`distance-${option}`} />
                        <label htmlFor={`distance-${option}`} className="text-sm text-foreground">
                          {option}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-foreground mb-3" data-testid="heading-price">Price</h3>
                  <div className="space-y-2">
                    {filters.price.map((option) => (
                      <div key={option} className="flex items-center space-x-2">
                        <Checkbox id={`price-${option}`} />
                        <label htmlFor={`price-${option}`} className="text-sm text-foreground">
                          {option}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-foreground mb-3" data-testid="heading-rating">Rating</h3>
                  <div className="space-y-2">
                    {filters.rating.map((option) => (
                      <div key={option} className="flex items-center space-x-2">
                        <Checkbox id={`rating-${option}`} />
                        <label htmlFor={`rating-${option}`} className="text-sm text-foreground">
                          ⭐⭐⭐⭐+
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-foreground mb-3" data-testid="heading-hours">Hours</h3>
                  <div className="space-y-2">
                    {filters.hours.map((option) => (
                      <div key={option} className="flex items-center space-x-2">
                        <Checkbox id={`hours-${option}`} />
                        <label htmlFor={`hours-${option}`} className="text-sm text-foreground">
                          {option}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-foreground mb-3" data-testid="heading-amenities">Amenities</h3>
                  <div className="space-y-2">
                    {filters.amenities.map((option) => (
                      <div key={option} className="flex items-center space-x-2">
                        <Checkbox id={`amenity-${option}`} />
                        <label htmlFor={`amenity-${option}`} className="text-sm text-foreground">
                          {option}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Button variant="outline" className="w-full" data-testid="button-clear-filters">
                    Clear
                  </Button>
                  <Button className="w-full" data-testid="button-apply-filters">
                    Apply
                  </Button>
                </div>
              </div>
            </aside>
          )}

          {/* Results Area */}
          <main className={`flex-1 p-6 ${!showFilters ? 'max-w-none' : ''}`}>
            {/* Results Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-semibold text-foreground" data-testid="text-results-count">
                  245 results found
                </h2>
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Button
                    variant={viewMode === "list" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setViewMode("list")}
                    data-testid="button-list-view"
                  >
                    <List className="h-4 w-4 mr-2" />
                    List
                  </Button>
                  <Button
                    variant={viewMode === "map" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setViewMode("map")}
                    data-testid="button-map-view"
                  >
                    <Map className="h-4 w-4 mr-2" />
                    Map
                  </Button>
                </div>
                <Select defaultValue="relevance">
                  <SelectTrigger className="w-32" data-testid="select-sort">
                    <SelectValue />
                    <ChevronDown className="h-4 w-4" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="relevance">Sort by</SelectItem>
                    <SelectItem value="distance">Distance</SelectItem>
                    <SelectItem value="rating">Rating</SelectItem>
                    <SelectItem value="name">Name</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Results List */}
            <div className="space-y-4">
              {mockResults.map((result) => (
                <Card key={result.id} className="p-6" data-testid={`result-card-${result.id}`}>
                  <div className="flex gap-4">
                    <div className="w-20 h-20 bg-muted rounded-lg flex items-center justify-center">
                      <BookOpen className="h-8 w-8 text-muted-foreground" />
                    </div>
                    
                    <div className="flex-1 space-y-2">
                      <div className="flex items-start justify-between">
                        <h3 className="text-lg font-semibold text-foreground" data-testid={`result-name-${result.id}`}>
                          {result.name}
                        </h3>
                        <div className="flex items-center space-x-2">
                          <Button variant="ghost" size="sm" data-testid={`button-save-${result.id}`}>
                            <Heart className="h-4 w-4" />
                            Save
                          </Button>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                          <span className="font-medium" data-testid={`result-rating-${result.id}`}>
                            {result.rating}
                          </span>
                          <span className="text-muted-foreground ml-1">
                            ({result.reviews} reviews)
                          </span>
                        </div>
                        <Badge 
                          variant={result.status === "Open" ? "default" : "secondary"}
                          data-testid={`result-status-${result.id}`}
                        >
                          {result.status}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <div className="flex items-center">
                          <Navigation className="h-4 w-4 mr-1" />
                          <span data-testid={`result-distance-${result.id}`}>
                            {result.distance} • {result.walkTime}
                          </span>
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          <span data-testid={`result-hours-${result.id}`}>{result.hours}</span>
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-2">
                        {result.features.map((feature) => (
                          <Badge key={feature} variant="outline" className="text-xs">
                            ✅ {feature}
                          </Badge>
                        ))}
                      </div>
                      
                      <div className="flex space-x-3 pt-2">
                        <Button variant="outline" data-testid={`button-details-${result.id}`}>
                          View Details
                        </Button>
                        <Button variant="outline" data-testid={`button-directions-${result.id}`}>
                          Get Directions
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}