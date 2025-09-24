import { Button } from "@/components/ui/button";

export default function SolutionSection() {
  return (
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
  );
}