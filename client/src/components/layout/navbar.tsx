import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ChevronDown, Menu, Search, BookOpen, Home, Users, GraduationCap, Smartphone, Trophy, FileText, BarChart3, DollarSign, TrendingUp, Target, Handshake, MessageCircle } from "lucide-react";
import { useState } from "react";

export default function Navbar() {
  const [location] = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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

            {/* Mobile menu button */}
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="md:hidden"
                  data-testid="button-mobile-menu"
                >
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle mobile menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <nav className="flex flex-col space-y-4">
                  <div className="flex items-center space-x-3 pb-4 border-b border-border">
                    <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-primary-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
                      </svg>
                    </div>
                    <span className="text-xl font-bold text-foreground">StudyConnect</span>
                  </div>
                  
                  <Link href="/how-it-works">
                    <Button variant="ghost" className="w-full justify-start hover:bg-muted/70 transition-all duration-200 ease-in-out" data-testid="link-how-it-works-mobile">
                      How It Works
                    </Button>
                  </Link>
                  
                  {/* Mobile For Students section */}
                  <div className="space-y-2">
                    <div className="font-medium text-foreground px-4 py-2">For Students</div>
                    <Link href="/browse">
                      <Button variant="ghost" className="w-full justify-start pl-8 hover:bg-muted/70 transition-all duration-200 ease-in-out" data-testid="link-browse-services-mobile">
                        <Search className="mr-2 h-4 w-4" />
                        Browse All Services
                      </Button>
                    </Link>
                    <Link href="/notes">
                      <Button variant="ghost" className="w-full justify-start pl-8 hover:bg-muted/70 transition-all duration-200 ease-in-out" data-testid="link-study-notes-mobile">
                        <BookOpen className="mr-2 h-4 w-4" />
                        Study Notes & Resources
                      </Button>
                    </Link>
                    <Link href="/accommodation">
                      <Button variant="ghost" className="w-full justify-start pl-8 hover:bg-muted/70 transition-all duration-200 ease-in-out" data-testid="link-accommodation-mobile">
                        <Home className="mr-2 h-4 w-4" />
                        Find Accommodation
                      </Button>
                    </Link>
                    <Link href="/tutors">
                      <Button variant="ghost" className="w-full justify-start pl-8 hover:bg-muted/70 transition-all duration-200 ease-in-out" data-testid="link-tutors-mobile">
                        <GraduationCap className="mr-2 h-4 w-4" />
                        Book Tutors & Coaching
                      </Button>
                    </Link>
                    <Link href="/events">
                      <Button variant="ghost" className="w-full justify-start pl-8 hover:bg-muted/70 transition-all duration-200 ease-in-out" data-testid="link-events-mobile">
                        <Users className="mr-2 h-4 w-4" />
                        Events & Study Groups
                      </Button>
                    </Link>
                    <Link href="/mobile-app">
                      <Button variant="ghost" className="w-full justify-start pl-8 hover:bg-muted/70 transition-all duration-200 ease-in-out" data-testid="link-mobile-app-mobile">
                        <Smartphone className="mr-2 h-4 w-4" />
                        Mobile App
                      </Button>
                    </Link>
                    <Link href="/student-success">
                      <Button variant="ghost" className="w-full justify-start pl-8 hover:bg-muted/70 transition-all duration-200 ease-in-out" data-testid="link-student-success-mobile">
                        <Trophy className="mr-2 h-4 w-4" />
                        Student Success Stories
                      </Button>
                    </Link>
                  </div>
                  
                  {/* Mobile For Vendors section */}
                  <div className="space-y-2">
                    <div className="font-medium text-foreground px-4 py-2">For Vendors</div>
                    <Link href="/vendor/list-service">
                      <Button variant="ghost" className="w-full justify-start pl-8 hover:bg-muted/70 transition-all duration-200 ease-in-out" data-testid="link-list-service-mobile">
                        <FileText className="mr-2 h-4 w-4" />
                        List Your Service
                      </Button>
                    </Link>
                    <Link href="/vendor/dashboard">
                      <Button variant="ghost" className="w-full justify-start pl-8 hover:bg-muted/70 transition-all duration-200 ease-in-out" data-testid="link-vendor-dashboard-mobile">
                        <BarChart3 className="mr-2 h-4 w-4" />
                        Vendor Dashboard
                      </Button>
                    </Link>
                    <Link href="/vendor/pricing">
                      <Button variant="ghost" className="w-full justify-start pl-8 hover:bg-muted/70 transition-all duration-200 ease-in-out" data-testid="link-vendor-pricing-mobile">
                        <DollarSign className="mr-2 h-4 w-4" />
                        Pricing & Plans
                      </Button>
                    </Link>
                    <Link href="/vendor/marketing">
                      <Button variant="ghost" className="w-full justify-start pl-8 hover:bg-muted/70 transition-all duration-200 ease-in-out" data-testid="link-marketing-tools-mobile">
                        <TrendingUp className="mr-2 h-4 w-4" />
                        Marketing Tools
                      </Button>
                    </Link>
                    <Link href="/vendor/success">
                      <Button variant="ghost" className="w-full justify-start pl-8 hover:bg-muted/70 transition-all duration-200 ease-in-out" data-testid="link-vendor-success-mobile">
                        <Target className="mr-2 h-4 w-4" />
                        Success Stories
                      </Button>
                    </Link>
                    <Link href="/vendor/partner">
                      <Button variant="ghost" className="w-full justify-start pl-8 hover:bg-muted/70 transition-all duration-200 ease-in-out" data-testid="link-partner-program-mobile">
                        <Handshake className="mr-2 h-4 w-4" />
                        Partner Program
                      </Button>
                    </Link>
                    <Link href="/vendor/support">
                      <Button variant="ghost" className="w-full justify-start pl-8 hover:bg-muted/70 transition-all duration-200 ease-in-out" data-testid="link-vendor-support-mobile">
                        <MessageCircle className="mr-2 h-4 w-4" />
                        Support Center
                      </Button>
                    </Link>
                  </div>
                  
                  <Link href="/pricing">
                    <Button variant="ghost" className="w-full justify-start hover:bg-muted/70 transition-all duration-200 ease-in-out" data-testid="link-pricing-mobile">
                      Pricing
                    </Button>
                  </Link>
                  
                  {/* Mobile auth buttons */}
                  <div className="pt-4 border-t border-border space-y-2">
                    <Link href="/signin">
                      <Button variant="ghost" className="w-full hover:bg-muted/70 transition-all duration-200 ease-in-out" data-testid="button-login-mobile">
                        Login
                      </Button>
                    </Link>
                    <Link href="/signin">
                      <Button className="w-full hover:shadow-lg transition-all duration-200 ease-in-out" data-testid="button-signup-free-mobile">
                        Sign Up Free
                      </Button>
                    </Link>
                  </div>
                </nav>
              </SheetContent>
            </Sheet>
            
            <div className="hidden md:flex space-x-6">
              <Link href="/how-it-works">
                <Button variant="ghost" className="text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all duration-200 ease-in-out transform hover:scale-105" data-testid="link-how-it-works">
                  How It Works
                </Button>
              </Link>
              
              {/* For Students Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all duration-200 ease-in-out transform hover:scale-105" data-testid="dropdown-for-students">
                    For Students <ChevronDown className="ml-1 h-4 w-4 transition-transform duration-200 group-hover:rotate-180" />
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
                  <Button variant="ghost" className="text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all duration-200 ease-in-out transform hover:scale-105" data-testid="dropdown-for-vendors">
                    For Vendors <ChevronDown className="ml-1 h-4 w-4 transition-transform duration-200" />
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
                <Button variant="ghost" className="text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all duration-200 ease-in-out transform hover:scale-105" data-testid="link-pricing">
                  Pricing
                </Button>
              </Link>
            </div>
          </div>
          
          <div className="hidden md:flex items-center space-x-4">
            <Link href="/signin">
              <Button variant="ghost" className="hover:bg-muted/50 transition-all duration-200 ease-in-out transform hover:scale-105" data-testid="button-login">
                Login
              </Button>
            </Link>
            <Link href="/signin">
              <Button className="hover:shadow-lg transition-all duration-200 ease-in-out transform hover:scale-105" data-testid="button-signup-free">
                Sign Up Free
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
