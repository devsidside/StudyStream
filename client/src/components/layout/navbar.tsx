import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ChevronDown, Search, BookOpen, Home, Users, GraduationCap, Smartphone, Trophy, FileText, BarChart3, DollarSign, TrendingUp, Target, Handshake, MessageCircle } from "lucide-react";

export default function Navbar() {
  const [location] = useLocation();

  return (
    <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <Link href="/">
              <div className="flex items-center space-x-3" data-testid="link-home">
                <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-primary-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
                  </svg>
                </div>
                <span className="text-xl font-bold text-foreground">StudyConnect</span>
              </div>
            </Link>
            
            <div className="hidden md:flex space-x-6">
              <Link href="/how-it-works">
                <Button variant="ghost" className="text-muted-foreground hover:text-foreground transition-colors" data-testid="link-how-it-works">
                  How It Works
                </Button>
              </Link>
              
              {/* For Students Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="text-muted-foreground hover:text-foreground transition-colors" data-testid="dropdown-for-students">
                    For Students <ChevronDown className="ml-1 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56">
                  <DropdownMenuItem>
                    <Search className="mr-2 h-4 w-4" />
                    <Link href="/browse" className="flex-1" data-testid="link-browse-services">Browse All Services</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <BookOpen className="mr-2 h-4 w-4" />
                    <Link href="/notes" className="flex-1" data-testid="link-study-notes">Study Notes & Resources</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Home className="mr-2 h-4 w-4" />
                    <Link href="/accommodation" className="flex-1" data-testid="link-accommodation">Find Accommodation</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <GraduationCap className="mr-2 h-4 w-4" />
                    <Link href="/tutors" className="flex-1" data-testid="link-tutors">Book Tutors & Coaching</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Users className="mr-2 h-4 w-4" />
                    <Link href="/events" className="flex-1" data-testid="link-events">Events & Study Groups</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Smartphone className="mr-2 h-4 w-4" />
                    <Link href="/mobile-app" className="flex-1" data-testid="link-mobile-app">Mobile App</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Trophy className="mr-2 h-4 w-4" />
                    <Link href="/student-success" className="flex-1" data-testid="link-student-success">Student Success Stories</Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* For Vendors Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="text-muted-foreground hover:text-foreground transition-colors" data-testid="dropdown-for-vendors">
                    For Vendors <ChevronDown className="ml-1 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56">
                  <DropdownMenuItem>
                    <FileText className="mr-2 h-4 w-4" />
                    <Link href="/vendor/list-service" className="flex-1" data-testid="link-list-service">List Your Service</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <BarChart3 className="mr-2 h-4 w-4" />
                    <Link href="/vendor/dashboard" className="flex-1" data-testid="link-vendor-dashboard">Vendor Dashboard</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <DollarSign className="mr-2 h-4 w-4" />
                    <Link href="/vendor/pricing" className="flex-1" data-testid="link-vendor-pricing">Pricing & Plans</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <TrendingUp className="mr-2 h-4 w-4" />
                    <Link href="/vendor/marketing" className="flex-1" data-testid="link-marketing-tools">Marketing Tools</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Target className="mr-2 h-4 w-4" />
                    <Link href="/vendor/success" className="flex-1" data-testid="link-vendor-success">Success Stories</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Handshake className="mr-2 h-4 w-4" />
                    <Link href="/vendor/partner" className="flex-1" data-testid="link-partner-program">Partner Program</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <MessageCircle className="mr-2 h-4 w-4" />
                    <Link href="/vendor/support" className="flex-1" data-testid="link-vendor-support">Support Center</Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <Link href="/pricing">
                <Button variant="ghost" className="text-muted-foreground hover:text-foreground transition-colors" data-testid="link-pricing">
                  Pricing
                </Button>
              </Link>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <Button variant="ghost" onClick={() => window.location.href = "/signin"} data-testid="button-login">
              Login
            </Button>
            <Button onClick={() => window.location.href = "/signin"} data-testid="button-signup-free">
              Sign Up Free
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
