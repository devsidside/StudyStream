import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Search, FileText, Home, Users, GraduationCap, MapPin, Star, Bookmark, Phone, Calendar, BookOpen } from "lucide-react";
import { WorldMap } from "@/components/ui/world-map";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import HeroSection from "@/components/hero/HeroSection";

export default function Landing() {
  const [searchQuery, setSearchQuery] = useState("");
  
  // Sample search results for live preview
  const sampleResults = [
    { id: 1, type: "notes", title: "Data Structures & Algorithms Notes", author: "Sarah M.", rating: 4.8, category: "Computer Science", icon: FileText },
    { id: 2, type: "hostel", title: "Green Valley Hostel", location: "Near Campus", rating: 4.5, price: "₹8,000/month", icon: Home },
    { id: 3, type: "tutoring", title: "Mathematics Tutoring", instructor: "Prof. Kumar", rating: 4.9, price: "₹500/hour", icon: GraduationCap },
    { id: 4, type: "study-group", title: "Physics Study Group", members: 12, topic: "Quantum Mechanics", icon: Users },
  ];
  
  const filteredResults = sampleResults.filter(result => 
    result.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (result.author && result.author.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (result.category && result.category.toLowerCase().includes(searchQuery.toLowerCase()))
  );

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
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <HeroSection />

      {/* Try It Yourself Section */}
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

      {/* Problem Section */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl md:text-4xl font-bold">The Student Struggle is Real</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Students spend countless hours searching for resources, quality accommodations, and reliable services. We're here to change that.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-card rounded-2xl p-8 hover-lift border border-border">
              <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-destructive" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
              <h3 className="text-4xl font-bold text-destructive mb-2" data-testid="text-hours-wasted">6+ Hours</h3>
              <p className="text-lg font-semibold mb-2">Wasted Weekly</p>
              <p className="text-muted-foreground">Students spend hours searching for notes, accommodation, and campus services</p>
            </div>
            
            <div className="bg-card rounded-2xl p-8 hover-lift border border-border">
              <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"/>
                </svg>
              </div>
              <h3 className="text-4xl font-bold text-secondary mb-2" data-testid="text-higher-costs">40%</h3>
              <p className="text-lg font-semibold mb-2">Higher Costs</p>
              <p className="text-muted-foreground">Without proper information, students often pay more for subpar services</p>
            </div>
            
            <div className="bg-card rounded-2xl p-8 hover-lift border border-border">
              <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
                </svg>
              </div>
              <h3 className="text-4xl font-bold text-accent mb-2" data-testid="text-isolated">Isolated</h3>
              <p className="text-lg font-semibold mb-2">Communities</p>
              <p className="text-muted-foreground">Lack of proper platforms for academic collaboration and peer support</p>
            </div>
          </div>
        </div>
      </section>

      {/* Solution Platform Overview */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <h2 className="text-3xl md:text-4xl font-bold">One Platform, Everything You Need</h2>
                <p className="text-xl text-muted-foreground">
                  StudyConnect brings together academic resources, campus services, and student community in one powerful platform.
                </p>
              </div>
              
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                    <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Instant Access to Quality Resources</h3>
                    <p className="text-muted-foreground">Find notes, projects, and study materials curated by your peers and verified by our community.</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-secondary/10 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                    <svg className="w-4 h-4 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Trusted Campus Services</h3>
                    <p className="text-muted-foreground">Browse verified hostels, mess services, tutoring, and cafes with real reviews from students.</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-accent/10 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                    <svg className="w-4 h-4 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Vibrant Student Community</h3>
                    <p className="text-muted-foreground">Connect with peers, join study groups, and participate in discussions while maintaining privacy.</p>
                  </div>
                </div>
              </div>
              
              <Button 
                className="bg-primary text-primary-foreground px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors"
                onClick={() => window.location.href = "/api/login"}
                data-testid="button-explore-platform"
              >
                Sign In
              </Button>
            </div>
            
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600" 
                alt="Modern dashboard interface displaying student resources and analytics" 
                className="rounded-2xl shadow-2xl" 
                data-testid="img-dashboard"
              />
              
              <div className="absolute top-6 left-6 glass-card rounded-xl p-4">
                <div className="space-y-2">
                  <p className="text-sm font-semibold">Active Today</p>
                  <p className="text-2xl font-bold text-primary" data-testid="text-active-users">2,847</p>
                  <p className="text-xs text-muted-foreground">Students online</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary via-accent to-secondary">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          <div className="space-y-4">
            <h2 className="text-3xl md:text-5xl font-bold text-white">
              Ready to Transform Your Student Experience?
            </h2>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              Join thousands of students who are already saving time, finding better resources, and building meaningful connections through StudyConnect.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Button 
              size="lg"
              className="bg-white text-primary px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white/90 transition-colors transform hover:scale-105"
              onClick={() => window.location.href = "/api/login"}
              data-testid="button-start-free"
            >
              Start Your Journey - Free
            </Button>
            <Button 
              variant="outline"
              size="lg"
              className="border-2 border-white text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white/10 transition-colors"
              onClick={() => window.location.href = "/api/login"}
              data-testid="button-list-service-cta"
            >
              List Your Service
            </Button>
          </div>
          
          <div className="flex justify-center items-center space-x-8 text-white/80 text-sm">
            <div className="flex items-center space-x-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              <span data-testid="text-free-start">Free to start</span>
            </div>
            <div className="flex items-center space-x-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              <span data-testid="text-no-credit-card">No credit card required</span>
            </div>
            <div className="flex items-center space-x-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              <span data-testid="text-quick-join">Join in 30 seconds</span>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
