import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import Hero from "@/components/sections/hero";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Search, FileText, Home, Users, GraduationCap } from "lucide-react";
import { IndiaMap } from "@/components/ui/india-map";

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
      <Hero />

      {/* Live Search Preview Section */}
      <section className="py-16 bg-gradient-to-b from-background to-muted/20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-primary">LIVE SEARCH PREVIEW</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Experience instant access to notes, accommodations, tutoring, and study groups
            </p>
          </div>
          
          {/* India Network Map */}
          <div className="mb-12">
            <div className="text-center mb-6">
              <h3 className="text-xl font-semibold text-foreground mb-2">Students Connecting Across India</h3>
              <p className="text-muted-foreground">Real-time connections between students in major cities</p>
            </div>
            <IndiaMap 
              dots={indiaConnections}
              lineColor="#1eb1bf"
              showLabels={true}
              animationDuration={2}
              loop={true}
            />
          </div>
          
          <div className="max-w-2xl mx-auto">
            {/* Search Input */}
            <div className="relative mb-8">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
              <Input
                type="text"
                placeholder="Search notes, hostels, tutoring, study groups..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 pr-4 py-4 text-lg rounded-2xl border-2 border-primary/20 focus:border-primary transition-colors"
                data-testid="input-live-search"
              />
            </div>
            
            {/* Search Results */}
            <div className="space-y-4">
              {(searchQuery.length > 0 ? filteredResults : sampleResults).slice(0, 4).map((result) => {
                const IconComponent = result.icon;
                return (
                  <div key={result.id} className="bg-card rounded-xl p-4 border border-border hover:shadow-lg transition-all duration-300 hover-lift cursor-pointer" data-testid={`result-${result.type}-${result.id}`}>
                    <div className="flex items-start space-x-4">
                      <div className={`p-3 rounded-lg ${
                        result.type === 'notes' ? 'bg-primary/10' :
                        result.type === 'hostel' ? 'bg-secondary/10' :
                        result.type === 'tutoring' ? 'bg-accent/10' :
                        'bg-primary/10'
                      }`}>
                        <IconComponent className={`w-6 h-6 ${
                          result.type === 'notes' ? 'text-primary' :
                          result.type === 'hostel' ? 'text-secondary' :
                          result.type === 'tutoring' ? 'text-accent' :
                          'text-primary'
                        }`} />
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-semibold text-lg text-foreground">{result.title}</h3>
                            {result.author && (
                              <p className="text-sm text-muted-foreground">by {result.author}</p>
                            )}
                            {result.location && (
                              <p className="text-sm text-muted-foreground">{result.location}</p>
                            )}
                            {result.instructor && (
                              <p className="text-sm text-muted-foreground">with {result.instructor}</p>
                            )}
                            {result.members && (
                              <p className="text-sm text-muted-foreground">{result.members} members</p>
                            )}
                          </div>
                          
                          <div className="text-right">
                            {result.rating && (
                              <div className="flex items-center space-x-1 mb-1">
                                <svg className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
                                  <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
                                </svg>
                                <span className="text-sm font-medium">{result.rating}</span>
                              </div>
                            )}
                            {result.price && (
                              <p className="text-sm font-semibold text-primary">{result.price}</p>
                            )}
                            {result.category && (
                              <span className="inline-block px-2 py-1 bg-muted rounded-full text-xs text-muted-foreground">{result.category}</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
              
              {searchQuery.length > 0 && filteredResults.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No results found. Try searching for "data", "hostel", or "math"</p>
                </div>
              )}
            </div>
            
            {/* CTA Button */}
            <div className="text-center mt-8">
              <Button 
                className="bg-primary text-primary-foreground px-8 py-3 rounded-xl hover:bg-primary/90 transition-colors"
                onClick={() => window.location.href = "/api/login"}
                data-testid="button-explore-full-platform"
              >
                Explore Full Platform
              </Button>
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
