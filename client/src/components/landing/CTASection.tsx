import { Button } from "@/components/ui/button";

export default function CTASection() {
  return (
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
  );
}