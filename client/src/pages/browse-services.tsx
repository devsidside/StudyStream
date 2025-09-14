import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import ServicesListing from "@/components/services/services-listing";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function BrowseServices() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <ServicesListing 
        apiEndpoint="/api/vendors"
        title="Browse All Services"
        subtitle="Discover 10,000+ verified services across India"
      />
      
      {/* Help Section */}
      <div className="py-12 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold mb-2">🎯 Not Finding What You Need?</h2>
          </div>
          
          <Card>
            <CardContent className="p-8">
              <div className="text-center space-y-6">
                <p className="text-muted-foreground text-lg">
                  🔍 Refine your search • 📝 Request a specific service • 💬 Chat with support
                </p>
                
                <div className="flex flex-wrap justify-center gap-4">
                  <Button variant="outline" data-testid="button-advanced-search">
                    🔍 Advanced Search
                  </Button>
                  <Button variant="outline" data-testid="button-post-request">
                    📝 Post Request
                  </Button>
                  <Button variant="outline" data-testid="button-get-help">
                    💬 Get Help
                  </Button>
                  <Button variant="outline" data-testid="button-set-alert">
                    📧 Set Alert
                  </Button>
                </div>
                
                <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <p className="text-sm text-blue-800 dark:text-blue-200">
                    💡 Tip: Use specific keywords like "CS algorithms notes IIT" for better results
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Call to Action */}
      <div className="py-12 bg-primary/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">🚀 Ready to Get Started?</h2>
          <p className="text-lg text-muted-foreground mb-8">
            Found something interesting? Sign up to save favorites and book services
          </p>
          
          <div className="flex flex-wrap justify-center gap-4">
            <Button size="lg" data-testid="button-signup-student">
              🎓 Sign Up - Student
            </Button>
            <Button size="lg" variant="outline" data-testid="button-list-service">
              🏢 List Service - Vendor
            </Button>
          </div>
          
          <div className="mt-6 flex justify-center items-center space-x-4 text-sm text-muted-foreground">
            <span className="flex items-center space-x-1">
              <span>✅</span>
              <span>Free account</span>
            </span>
            <span className="flex items-center space-x-1">
              <span>⚡</span>
              <span>Instant access</span>
            </span>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}