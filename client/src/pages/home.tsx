import { useQuery } from "@tanstack/react-query";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import NoteCard from "@/components/notes/note-card";
import VendorCard from "@/components/vendors/vendor-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "wouter";
import { useAuth } from "@/hooks/useAuth";

// Define interface for vendors API response
interface VendorsResponse {
  vendors: Array<{
    id: number;
    name: string;
    description?: string;
    category: string;
    phone?: string;
    email?: string;
    address?: string;
    website?: string;
    priceRange?: string;
    averageRating: string;
    totalRatings: number;
    isVerified: boolean;
    isActive: boolean;
  }>;
  total: number;
}

export default function Home() {
  const { user } = useAuth();
  
  const { data: trendingNotes } = useQuery({
    queryKey: ['/api/analytics/trending'],
  });

  const { data: recentNotes } = useQuery({
    queryKey: ['/api/analytics/recent'],
  });

  const { data: subjectStats } = useQuery({
    queryKey: ['/api/analytics/subjects'],
  });

  const { data: vendorsData } = useQuery<VendorsResponse>({
    queryKey: ['/api/vendors', { limit: 6 }],
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-24 pb-16 hero-gradient">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-6">
            <h1 className="text-4xl md:text-5xl font-bold">
              Welcome back, <span className="gradient-text">{user?.firstName || 'Student'}</span>!
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Discover new resources, connect with peers, and accelerate your academic journey.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/browse">
                <Button size="lg" className="bg-primary text-primary-foreground" data-testid="button-browse-notes">
                  Browse Notes & Projects
                </Button>
              </Link>
              <Link href="/upload">
                <Button variant="outline" size="lg" data-testid="button-upload-content">
                  Upload Content
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="py-12 -mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-6">
            <Card className="glass-card hover-lift" data-testid="card-total-notes">
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-primary mb-2">5,000+</div>
                <div className="text-muted-foreground">Notes Available</div>
              </CardContent>
            </Card>
            <Card className="glass-card hover-lift" data-testid="card-active-users">
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-secondary mb-2">2,847</div>
                <div className="text-muted-foreground">Active Students</div>
              </CardContent>
            </Card>
            <Card className="glass-card hover-lift" data-testid="card-verified-vendors">
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-accent mb-2">500+</div>
                <div className="text-muted-foreground">Verified Vendors</div>
              </CardContent>
            </Card>
            <Card className="glass-card hover-lift" data-testid="card-universities">
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-green-500 mb-2">50+</div>
                <div className="text-muted-foreground">Universities</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Main Content Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column - Categories */}
            <div className="space-y-6">
              <Card data-testid="card-categories">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/>
                    </svg>
                    <span>Browse by Subject</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {subjectStats && Array.isArray(subjectStats) ? subjectStats.slice(0, 6).map((subject: any) => (
                    <Link key={subject.subject} href={`/browse?subject=${subject.subject}`}>
                      <div className="flex justify-between items-center p-3 rounded-lg hover:bg-muted transition-colors cursor-pointer" data-testid={`link-subject-${subject.subject}`}>
                        <span className="capitalize">{subject.subject.replace('-', ' ')}</span>
                        <span className="text-sm text-muted-foreground">({subject.count})</span>
                      </div>
                    </Link>
                  )) : null}
                  <Link href="/browse">
                    <Button variant="ghost" size="sm" className="w-full" data-testid="button-view-all-subjects">
                      View All Subjects →
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              <Card data-testid="card-quick-actions">
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Link href="/upload">
                    <Button className="w-full justify-start" variant="outline" data-testid="button-upload-notes">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/>
                      </svg>
                      Upload Notes
                    </Button>
                  </Link>
                  <Link href="/vendors">
                    <Button className="w-full justify-start" variant="outline" data-testid="button-find-services">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                      </svg>
                      Find Services
                    </Button>
                  </Link>
                  <Button className="w-full justify-start" variant="outline" data-testid="button-join-study-group">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
                    </svg>
                    Join Study Group
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Right Columns - Featured Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Trending This Week */}
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold flex items-center space-x-2">
                    <svg className="w-6 h-6 text-destructive" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z"/>
                    </svg>
                    <span>Trending This Week</span>
                  </h2>
                  <Link href="/browse?sortBy=popular">
                    <Button variant="ghost" size="sm" data-testid="button-view-all-trending">
                      View All →
                    </Button>
                  </Link>
                </div>
                
                <div className="grid gap-4">
                  {trendingNotes && Array.isArray(trendingNotes) ? trendingNotes.slice(0, 3).map((note: any) => (
                    <NoteCard key={note.id} note={note} />
                  )) : null}
                </div>
              </div>

              {/* Recent Uploads */}
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold flex items-center space-x-2">
                    <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                    <span>Recent Uploads</span>
                  </h2>
                  <Link href="/browse?sortBy=recent">
                    <Button variant="ghost" size="sm" data-testid="button-view-all-recent">
                      View All →
                    </Button>
                  </Link>
                </div>
                
                <div className="grid gap-4">
                  {recentNotes && Array.isArray(recentNotes) ? recentNotes.slice(0, 3).map((note: any) => (
                    <NoteCard key={note.id} note={note} />
                  )) : null}
                </div>
              </div>

              {/* Featured Vendors */}
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold flex items-center space-x-2">
                    <svg className="w-6 h-6 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
                    </svg>
                    <span>Campus Services</span>
                  </h2>
                  <Link href="/vendors">
                    <Button variant="ghost" size="sm" data-testid="button-view-all-vendors">
                      View All →
                    </Button>
                  </Link>
                </div>
                
                <div className="grid md:grid-cols-2 gap-4">
                  {vendorsData?.vendors && Array.isArray(vendorsData.vendors) ? vendorsData.vendors.slice(0, 4).map((vendor: any) => (
                    <VendorCard key={vendor.id} vendor={vendor} />
                  )) : null}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
