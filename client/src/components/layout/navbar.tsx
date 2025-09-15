import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ChevronDown, Menu, Search, BookOpen, Home, Users, GraduationCap, Smartphone, Trophy, FileText, BarChart3, DollarSign, TrendingUp, Target, Handshake, MessageCircle, Coffee, Bus, FolderOpen, Settings, Code2 } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/contexts/auth-context";
import DualAuthModal from "@/components/auth/dual-auth-modal";

export default function Navbar() {
  const [location] = useLocation();
  const { user } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [studentsDropdownOpen, setStudentsDropdownOpen] = useState(false);
  const [vendorsDropdownOpen, setVendorsDropdownOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalType, setAuthModalType] = useState<'login' | 'signup'>('login');

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
                  
                  <Link href="/how-it-works" onClick={() => setIsMobileMenuOpen(false)}>
                    <Button variant="ghost" className="w-full justify-start hover:bg-muted/70 transition-all duration-200 ease-in-out" data-testid="link-how-it-works-mobile">
                      How It Works
                    </Button>
                  </Link>
                  
                  {/* Mobile For Students section */}
                  <div className="space-y-2">
                    <div className="font-medium text-foreground px-4 py-2">For Students</div>
                    <Link href="/browse-services" onClick={() => setIsMobileMenuOpen(false)}>
                      <Button variant="ghost" className="w-full justify-start pl-8 hover:bg-muted/70 transition-all duration-200 ease-in-out" data-testid="link-browse-services-mobile">
                        <Search className="mr-2 h-4 w-4" />
                        Browse All Services
                      </Button>
                    </Link>
                    {user && (
                      <Link href="/notes" onClick={() => setIsMobileMenuOpen(false)}>
                        <Button variant="ghost" className="w-full justify-start pl-8 hover:bg-muted/70 transition-all duration-200 ease-in-out" data-testid="link-study-notes-mobile">
                          <BookOpen className="mr-2 h-4 w-4" />
                          Study Notes & Resources
                        </Button>
                      </Link>
                    )}
                    <Link href="/accommodations" onClick={() => setIsMobileMenuOpen(false)}>
                      <Button variant="ghost" className="w-full justify-start pl-8 hover:bg-muted/70 transition-all duration-200 ease-in-out" data-testid="link-accommodation-mobile">
                        <Home className="mr-2 h-4 w-4" />
                        Find Accommodation
                      </Button>
                    </Link>
                    <Link href="/book-tutors" onClick={() => setIsMobileMenuOpen(false)}>
                      <Button variant="ghost" className="w-full justify-start pl-8 hover:bg-muted/70 transition-all duration-200 ease-in-out" data-testid="link-tutors-mobile">
                        <GraduationCap className="mr-2 h-4 w-4" />
                        Book Tutors & Coaching
                      </Button>
                    </Link>
                    {user && (
                      <Link href="/study-groups" onClick={() => setIsMobileMenuOpen(false)}>
                        <Button variant="ghost" className="w-full justify-start pl-8 hover:bg-muted/70 transition-all duration-200 ease-in-out" data-testid="link-events-mobile">
                          <Users className="mr-2 h-4 w-4" />
                          🎉 Events & Study Groups
                        </Button>
                      </Link>
                    )}
                    <Link href="/campus-cafes" onClick={() => setIsMobileMenuOpen(false)}>
                      <Button variant="ghost" className="w-full justify-start pl-8 hover:bg-muted/70 transition-all duration-200 ease-in-out" data-testid="link-campus-cafes-mobile">
                        <Coffee className="mr-2 h-4 w-4" />
                        Campus Cafes & Study Spaces
                      </Button>
                    </Link>
                    <Link href="/transport" onClick={() => setIsMobileMenuOpen(false)}>
                      <Button variant="ghost" className="w-full justify-start pl-8 hover:bg-muted/70 transition-all duration-200 ease-in-out" data-testid="link-transport-mobile">
                        <Bus className="mr-2 h-4 w-4" />
                        Transport & Travel
                      </Button>
                    </Link>
                    <Link href="/projects" onClick={() => setIsMobileMenuOpen(false)}>
                      <Button variant="ghost" className="w-full justify-start pl-8 hover:bg-muted/70 transition-all duration-200 ease-in-out" data-testid="link-projects-mobile">
                        <FolderOpen className="mr-2 h-4 w-4" />
                        Projects
                      </Button>
                    </Link>
                    <Link href="/practicals" onClick={() => setIsMobileMenuOpen(false)}>
                      <Button variant="ghost" className="w-full justify-start pl-8 hover:bg-muted/70 transition-all duration-200 ease-in-out" data-testid="link-practicals-mobile">
                        <Settings className="mr-2 h-4 w-4" />
                        Practicals
                      </Button>
                    </Link>
                    <Link href="/code" onClick={() => setIsMobileMenuOpen(false)}>
                      <Button variant="ghost" className="w-full justify-start pl-8 hover:bg-muted/70 transition-all duration-200 ease-in-out" data-testid="link-code-mobile">
                        <Code2 className="mr-2 h-4 w-4" />
                        Code
                      </Button>
                    </Link>
                  </div>
                  
                  {/* Mobile For Vendors section */}
                  <div className="space-y-2">
                    <div className="font-medium text-foreground px-4 py-2">For Vendors</div>
                    {user && (
                      <Link href="/vendors/list-service" onClick={() => setIsMobileMenuOpen(false)}>
                        <Button variant="ghost" className="w-full justify-start pl-8 hover:bg-muted/70 transition-all duration-200 ease-in-out" data-testid="link-list-service-mobile">
                          <FileText className="mr-2 h-4 w-4" />
                          List Your Service
                        </Button>
                      </Link>
                    )}
                    {user && (
                      <Link href="/vendors/dashboard" onClick={() => setIsMobileMenuOpen(false)}>
                        <Button variant="ghost" className="w-full justify-start pl-8 hover:bg-muted/70 transition-all duration-200 ease-in-out" data-testid="link-vendor-dashboard-mobile">
                          <BarChart3 className="mr-2 h-4 w-4" />
                          Vendor Dashboard
                        </Button>
                      </Link>
                    )}
                    <Link href="/vendors/pricing" onClick={() => setIsMobileMenuOpen(false)}>
                      <Button variant="ghost" className="w-full justify-start pl-8 hover:bg-muted/70 transition-all duration-200 ease-in-out" data-testid="link-vendor-pricing-mobile">
                        <DollarSign className="mr-2 h-4 w-4" />
                        Pricing & Plans
                      </Button>
                    </Link>
                    <Link href="/vendors/success-stories" onClick={() => setIsMobileMenuOpen(false)}>
                      <Button variant="ghost" className="w-full justify-start pl-8 hover:bg-muted/70 transition-all duration-200 ease-in-out" data-testid="link-vendor-success-mobile">
                        <Target className="mr-2 h-4 w-4" />
                        Success Stories
                      </Button>
                    </Link>
                  </div>
                  
                  <Link href="/vendors/pricing" onClick={() => setIsMobileMenuOpen(false)}>
                    <Button variant="ghost" className="w-full justify-start hover:bg-muted/70 transition-all duration-200 ease-in-out" data-testid="link-pricing-mobile">
                      Pricing
                    </Button>
                  </Link>
                  
                  {/* Mobile auth buttons */}
                  <div className="pt-4 border-t border-border space-y-2">
                    <Button 
                      variant="ghost" 
                      className="w-full hover:bg-muted/70 transition-all duration-200 ease-in-out" 
                      data-testid="button-login-mobile"
                      onClick={() => {
                        setAuthModalType('login');
                        setAuthModalOpen(true);
                        setIsMobileMenuOpen(false);
                      }}
                    >
                      Login
                    </Button>
                    <Button 
                      className="w-full hover:shadow-lg transition-all duration-200 ease-in-out" 
                      data-testid="button-signup-free-mobile"
                      onClick={() => {
                        setAuthModalType('signup');
                        setAuthModalOpen(true);
                        setIsMobileMenuOpen(false);
                      }}
                    >
                      Sign Up Free
                    </Button>
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
              <DropdownMenu open={studentsDropdownOpen} onOpenChange={setStudentsDropdownOpen}>
                <DropdownMenuTrigger 
                  asChild
                  onMouseEnter={() => setStudentsDropdownOpen(true)}
                  onMouseLeave={() => setStudentsDropdownOpen(false)}
                >
                  <Button variant="ghost" className="text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all duration-200 ease-in-out transform hover:scale-105" data-testid="dropdown-for-students">
                    For Students <ChevronDown className={`ml-1 h-4 w-4 transition-transform duration-200 ${studentsDropdownOpen ? 'rotate-180' : ''}`} />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent 
                  className="w-56" 
                  onMouseEnter={() => setStudentsDropdownOpen(true)}
                  onMouseLeave={() => setStudentsDropdownOpen(false)}
                >
                  <DropdownMenuItem asChild>
                    <Link href="/browse-services" className="flex w-full" data-testid="link-browse-services">
                      <Search className="mr-2 h-4 w-4" />
                      Browse All Services
                    </Link>
                  </DropdownMenuItem>
                  {user && (
                    <DropdownMenuItem asChild>
                      <Link href="/notes" className="flex w-full" data-testid="link-study-notes">
                        <BookOpen className="mr-2 h-4 w-4" />
                        Study Notes & Resources
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem asChild>
                    <Link href="/accommodations" className="flex w-full" data-testid="link-accommodation">
                      <Home className="mr-2 h-4 w-4" />
                      Find Accommodation
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/book-tutors" className="flex w-full" data-testid="link-tutors">
                      <GraduationCap className="mr-2 h-4 w-4" />
                      Book Tutors & Coaching
                    </Link>
                  </DropdownMenuItem>
                  {user && (
                    <DropdownMenuItem asChild>
                      <Link href="/study-groups" className="flex w-full" data-testid="link-events">
                        <Users className="mr-2 h-4 w-4" />
                        🎉 Events & Study Groups
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem asChild>
                    <Link href="/campus-cafes" className="flex w-full" data-testid="link-campus-cafes">
                      <Coffee className="mr-2 h-4 w-4" />
                      ☕ Campus Cafes & Study Spaces
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/transport" className="flex w-full" data-testid="link-transport">
                      <Bus className="mr-2 h-4 w-4" />
                      🚌 Transport & Travel
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/projects" className="flex w-full" data-testid="link-projects">
                      <FolderOpen className="mr-2 h-4 w-4" />
                      Projects
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/practicals" className="flex w-full" data-testid="link-practicals">
                      <Settings className="mr-2 h-4 w-4" />
                      Practicals
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/code" className="flex w-full" data-testid="link-code">
                      <Code2 className="mr-2 h-4 w-4" />
                      Code
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* For Vendors Dropdown */}
              <DropdownMenu open={vendorsDropdownOpen} onOpenChange={setVendorsDropdownOpen}>
                <DropdownMenuTrigger 
                  asChild
                  onMouseEnter={() => setVendorsDropdownOpen(true)}
                  onMouseLeave={() => setVendorsDropdownOpen(false)}
                >
                  <Button variant="ghost" className="text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all duration-200 ease-in-out transform hover:scale-105" data-testid="dropdown-for-vendors">
                    For Vendors <ChevronDown className={`ml-1 h-4 w-4 transition-transform duration-200 ${vendorsDropdownOpen ? 'rotate-180' : ''}`} />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent 
                  className="w-56"
                  onMouseEnter={() => setVendorsDropdownOpen(true)}
                  onMouseLeave={() => setVendorsDropdownOpen(false)}
                >
                  {user && (
                    <DropdownMenuItem asChild>
                      <Link href="/vendors/list-service" className="flex w-full" data-testid="link-list-service">
                        <FileText className="mr-2 h-4 w-4" />
                        List Your Service
                      </Link>
                    </DropdownMenuItem>
                  )}
                  {user && (
                    <DropdownMenuItem asChild>
                      <Link href="/vendors/dashboard" className="flex w-full" data-testid="link-vendor-dashboard">
                        <BarChart3 className="mr-2 h-4 w-4" />
                        Vendor Dashboard
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem asChild>
                    <Link href="/vendors/pricing" className="flex w-full" data-testid="link-vendor-pricing">
                      <DollarSign className="mr-2 h-4 w-4" />
                      Pricing & Plans
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/vendors/success-stories" className="flex w-full" data-testid="link-vendor-success">
                      <Target className="mr-2 h-4 w-4" />
                      Success Stories
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <Link href="/vendors/pricing">
                <Button variant="ghost" className="text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all duration-200 ease-in-out transform hover:scale-105" data-testid="link-pricing">
                  Pricing
                </Button>
              </Link>
            </div>
          </div>
          
          <div className="hidden md:flex items-center space-x-4">
            <Button 
              variant="ghost" 
              className="hover:bg-muted/50 transition-all duration-200 ease-in-out transform hover:scale-105" 
              data-testid="button-login"
              onClick={() => {
                setAuthModalType('login');
                setAuthModalOpen(true);
              }}
            >
              Login
            </Button>
            <Button 
              className="hover:shadow-lg transition-all duration-200 ease-in-out transform hover:scale-105" 
              data-testid="button-signup-free"
              onClick={() => {
                setAuthModalType('signup');
                setAuthModalOpen(true);
              }}
            >
              Sign Up Free
            </Button>
          </div>
        </div>
      </div>
      
      {/* Dual Authentication Modal */}
      <DualAuthModal 
        open={authModalOpen} 
        onOpenChange={setAuthModalOpen} 
        type={authModalType} 
      />
    </nav>
  );
}
