import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { WorldMap } from "@/components/ui/world-map";
import { Search, MapPin, Star, Bookmark, Phone, Calendar, BookOpen, Home, GraduationCap, Users } from "lucide-react";

export default function TryItYourselfSection() {
  const [searchQuery, setSearchQuery] = useState("");

  // Sample search results for live preview
  const sampleResults = [
    { id: 1, type: "notes", title: "Data Structures & Algorithms Notes", author: "Sarah M.", rating: 4.8, category: "Computer Science", icon: BookOpen },
    { id: 2, type: "hostel", title: "Green Valley Hostel", location: "Near Campus", rating: 4.5, price: "₹8,000/month", icon: Home },
    { id: 3, type: "tutoring", title: "Mathematics Tutoring", instructor: "Prof. Kumar", rating: 4.9, price: "₹500/hour", icon: GraduationCap },
    { id: 4, type: "study-group", title: "Physics Study Group", members: 12, topic: "Quantum Mechanics", icon: Users },
  ];

  // India city connections for the map
  const indiaConnections = [
    {
      start: { lat: 19.2183, lng: 72.9781, label: "Mumbai" },
      end: { lat: 18.5204, lng: 73.8567, label: "Pune" }
    },
    {
      start: { lat: 19.9975, lng: 73.7898, label: "Nashik" },
      end: { lat: 19.2183, lng: 72.9781, label: "Mumbai" }
    },
    {
      start: { lat: 28.7041, lng: 77.1025, label: "Delhi" },
      end: { lat: 28.4595, lng: 77.0266, label: "Gurgaon" }
    },
    {
      start: { lat: 12.9716, lng: 77.5946, label: "Bangalore" },
      end: { lat: 13.0827, lng: 80.2707, label: "Chennai" }
    },
    {
      start: { lat: 17.3850, lng: 78.4867, label: "Hyderabad" },
      end: { lat: 18.5204, lng: 73.8567, label: "Pune" }
    },
    {
      start: { lat: 22.5726, lng: 88.3639, label: "Kolkata" },
      end: { lat: 20.2961, lng: 85.8245, label: "Bhubaneswar" }
    }
  ];

  return (
    <section className="py-16 bg-gradient-to-b from-background to-muted/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center space-y-4 mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-primary flex items-center justify-center gap-3">
            <Search className="w-8 h-8" />
            TRY IT YOURSELF
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Experience the power of StudyConnect — search live resources in your city
          </p>
        </div>

        {/* Search Interface */}
        <div className="bg-card border border-border rounded-2xl p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4 mb-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
              <Input
                type="text"
                placeholder="Search: notes, hostels, tutors..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 pr-4 py-3 text-lg rounded-xl border-2 border-primary/20 focus:border-primary transition-colors"
                data-testid="input-search"
              />
            </div>
            <div className="lg:w-48">
              <Select defaultValue="delhi">
                <SelectTrigger className="w-full py-3 rounded-xl border-2 border-primary/20" data-testid="select-location">
                  <MapPin className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="delhi">Delhi</SelectItem>
                  <SelectItem value="mumbai">Mumbai</SelectItem>
                  <SelectItem value="bangalore">Bangalore</SelectItem>
                  <SelectItem value="chennai">Chennai</SelectItem>
                  <SelectItem value="hyderabad">Hyderabad</SelectItem>
                  <SelectItem value="kolkata">Kolkata</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button className="px-8 py-3 rounded-xl" data-testid="button-search">
              Search
            </Button>
          </div>
          
          {/* Popular Suggestions */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              💡 Popular:
            </span>
            <button className="hover:text-primary transition-colors" onClick={() => setSearchQuery("Data Structures Notes")}>
              Data Structures Notes
            </button>
            <span>•</span>
            <button className="hover:text-primary transition-colors" onClick={() => setSearchQuery("PG near campus")}>
              PG near campus
            </button>
            <span>•</span>
            <button className="hover:text-primary transition-colors" onClick={() => setSearchQuery("NEET Coaching")}>
              NEET Coaching
            </button>
          </div>
        </div>

        {/* Two Column Layout */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Map View - Left Column */}
          <div className="bg-card border border-border rounded-2xl p-6">
            <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
              🌍 MAP VIEW
            </h3>
            
            {/* Interactive World Map */}
            <div className="mb-6">
              <WorldMap
                dots={indiaConnections}
                lineColor="#1eb1bf"
              />
            </div>

            {/* City Statistics */}
            <div className="space-y-3 mb-6">
              {[
                { city: "Delhi", count: "2.3k" },
                { city: "Mumbai", count: "1.8k" },
                { city: "Bangalore", count: "2.1k" },
                { city: "Chennai", count: "1.5k" },
                { city: "Hyderabad", count: "900" },
                { city: "Kolkata", count: "1.1k" }
              ].map((item) => (
                <div key={item.city} className="flex items-center justify-between p-2 hover:bg-muted/50 rounded-lg transition-colors cursor-pointer">
                  <span className="text-foreground">• {item.city}</span>
                  <span className="text-primary font-medium">({item.count})</span>
                </div>
              ))}
            </div>

            <Select defaultValue="search-city">
              <SelectTrigger className="w-full" data-testid="select-search-city">
                <Search className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Search Your City" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="search-city">Search Your City</SelectItem>
                <SelectItem value="pune">Pune</SelectItem>
                <SelectItem value="ahmedabad">Ahmedabad</SelectItem>
                <SelectItem value="jaipur">Jaipur</SelectItem>
                <SelectItem value="lucknow">Lucknow</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Live Results - Right Column */}
          <div className="bg-card border border-border rounded-2xl p-6">
            <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
              📋 LIVE RESULTS
            </h3>
            
            <div className="space-y-4">
              {/* Notes Result */}
              <div className="p-4 border border-border rounded-xl hover:shadow-md transition-all">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-primary" />
                    <h4 className="font-semibold">Data Structures Notes</h4>
                  </div>
                  <div className="flex items-center gap-1">
                    {[1,2,3,4,5].map((i) => (
                      <Star key={i} className={`w-4 h-4 ${i <= 4 ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
                    ))}
                    <span className="text-sm ml-1">4.8</span>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mb-3">Free • CS Dept</p>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" data-testid="button-view-notes">View</Button>
                  <Button size="sm" variant="outline">
                    <Bookmark className="w-4 h-4 mr-1" />Save
                  </Button>
                </div>
              </div>

              {/* Hostel Result */}
              <div className="p-4 border border-border rounded-xl hover:shadow-md transition-all">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Home className="w-5 h-5 text-secondary" />
                    <h4 className="font-semibold">Green Valley Hostel</h4>
                  </div>
                  <div className="flex items-center gap-1">
                    {[1,2,3,4].map((i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                    <Star className="w-4 h-4 text-gray-300" />
                    <span className="text-sm ml-1">4.2</span>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mb-3">₹8000/month • 0.5 km</p>
                <Button size="sm" className="w-full" data-testid="button-contact-hostel">
                  <Phone className="w-4 h-4 mr-1" />Contact
                </Button>
              </div>

              {/* Tutor Result */}
              <div className="p-4 border border-border rounded-xl hover:shadow-md transition-all">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <GraduationCap className="w-5 h-5 text-accent" />
                    <h4 className="font-semibold">Math Tutor - Prof. Ray</h4>
                  </div>
                  <div className="flex items-center gap-1">
                    {[1,2,3,4,5].map((i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                    <span className="text-sm ml-1">4.9</span>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mb-3">₹500/hr • Online/Offline</p>
                <Button size="sm" className="w-full" data-testid="button-book-tutor">
                  <Calendar className="w-4 h-4 mr-1" />Book
                </Button>
              </div>

              {/* Event Result */}
              <div className="p-4 border border-border rounded-xl hover:shadow-md transition-all">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-primary" />
                    <h4 className="font-semibold">Tech Workshop • IIT Campus</h4>
                  </div>
                  <span className="text-sm text-green-600 font-medium">Free</span>
                </div>
                <p className="text-sm text-muted-foreground mb-3">50 seats left</p>
                <Button size="sm" className="w-full" data-testid="button-join-workshop">
                  Join Now
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}