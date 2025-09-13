import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import { Button } from "@/components/ui/button";

export default function Landing() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-24 pb-20 hero-gradient">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <h1 className="text-4xl md:text-6xl font-bold leading-tight">
                  Your Complete <span className="gradient-text">Student Resource Hub</span>
                </h1>
                <p className="text-xl text-muted-foreground leading-relaxed">
                  Connect with academic resources, find the best campus services, share knowledge, and build your student community. Everything you need in one unified platform.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  size="lg"
                  className="bg-gradient-to-r from-primary to-accent text-primary-foreground px-8 py-4 rounded-xl font-semibold hover:shadow-lg transition-all transform hover:scale-105"
                  onClick={() => window.location.href = "/signin"}
                  data-testid="button-start-journey"
                >
                  Start Your Journey
                </Button>
                <Button 
                  variant="outline"
                  size="lg"
                  className="border border-border text-foreground px-8 py-4 rounded-xl font-semibold hover:bg-muted transition-colors"
                  onClick={() => window.location.href = "/signin"}
                  data-testid="button-list-services"
                >
                  List Your Services
                </Button>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="flex -space-x-2">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 border-2 border-background"></div>
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-green-600 border-2 border-background"></div>
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 border-2 border-background"></div>
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-400 to-pink-600 border-2 border-background"></div>
                </div>
                <span className="text-muted-foreground" data-testid="text-user-count">Join 10,000+ students already using StudyConnect</span>
              </div>
            </div>
            
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600" 
                alt="Students collaborating in modern study environment" 
                className="rounded-2xl shadow-2xl animate-float" 
                data-testid="img-hero"
              />
              
              <div className="absolute -top-4 -left-4 glass-card rounded-xl p-4 animate-float" style={{animationDelay: "1s"}}>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                    <svg className="w-4 h-4 text-primary-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                    </svg>
                  </div>
                  <div>
                    <p className="font-semibold text-sm" data-testid="text-notes-count">245 Notes</p>
                    <p className="text-xs text-muted-foreground">Computer Science</p>
                  </div>
                </div>
              </div>
              
              <div className="absolute -bottom-4 -right-4 glass-card rounded-xl p-4 animate-float" style={{animationDelay: "2s"}}>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-secondary rounded-lg flex items-center justify-center">
                    <svg className="w-4 h-4 text-secondary-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                    </svg>
                  </div>
                  <div>
                    <p className="font-semibold text-sm" data-testid="text-vendors-count">50+ Vendors</p>
                    <p className="text-xs text-muted-foreground">Near Campus</p>
                  </div>
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
                Explore Platform →
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
