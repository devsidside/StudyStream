import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Search, BookOpen, Home, Users, GraduationCap, Coffee, Bus, FolderOpen, Settings, Code2, FileText, BarChart3, DollarSign, Target } from "lucide-react";
import { Logo } from "./Logo";

interface MobileMenuProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  user: any;
  onAuthClick: (type: 'login' | 'signup') => void;
}

export function MobileMenu({ isOpen, onOpenChange, user, onAuthClick }: MobileMenuProps) {
  const closeMobileMenu = () => onOpenChange(false);

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
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
          <div className="pb-4 border-b border-border">
            <Logo />
          </div>
          
          <Link href="/how-it-works" onClick={closeMobileMenu}>
            <Button variant="ghost" className="w-full justify-start hover:bg-muted/70 transition-all duration-200 ease-in-out" data-testid="link-how-it-works-mobile">
              How It Works
            </Button>
          </Link>
          
          {/* Mobile For Students section */}
          <div className="space-y-2">
            <div className="font-medium text-foreground px-4 py-2">For Students</div>
            <Link href="/browse-services" onClick={closeMobileMenu}>
              <Button variant="ghost" className="w-full justify-start pl-8 hover:bg-muted/70 transition-all duration-200 ease-in-out" data-testid="link-browse-services-mobile">
                <Search className="mr-2 h-4 w-4" />
                Browse All Services
              </Button>
            </Link>
            {user && (
              <Link href="/notes" onClick={closeMobileMenu}>
                <Button variant="ghost" className="w-full justify-start pl-8 hover:bg-muted/70 transition-all duration-200 ease-in-out" data-testid="link-study-notes-mobile">
                  <BookOpen className="mr-2 h-4 w-4" />
                  Study Notes & Resources
                </Button>
              </Link>
            )}
            <Link href="/accommodations" onClick={closeMobileMenu}>
              <Button variant="ghost" className="w-full justify-start pl-8 hover:bg-muted/70 transition-all duration-200 ease-in-out" data-testid="link-accommodation-mobile">
                <Home className="mr-2 h-4 w-4" />
                Find Accommodation
              </Button>
            </Link>
            <Link href="/book-tutors" onClick={closeMobileMenu}>
              <Button variant="ghost" className="w-full justify-start pl-8 hover:bg-muted/70 transition-all duration-200 ease-in-out" data-testid="link-tutors-mobile">
                <GraduationCap className="mr-2 h-4 w-4" />
                Book Tutors & Coaching
              </Button>
            </Link>
            {user && (
              <Link href="/study-groups" onClick={closeMobileMenu}>
                <Button variant="ghost" className="w-full justify-start pl-8 hover:bg-muted/70 transition-all duration-200 ease-in-out" data-testid="link-events-mobile">
                  <Users className="mr-2 h-4 w-4" />
                  🎉 Events & Study Groups
                </Button>
              </Link>
            )}
            <Link href="/campus-cafes" onClick={closeMobileMenu}>
              <Button variant="ghost" className="w-full justify-start pl-8 hover:bg-muted/70 transition-all duration-200 ease-in-out" data-testid="link-campus-cafes-mobile">
                <Coffee className="mr-2 h-4 w-4" />
                Campus Cafes & Study Spaces
              </Button>
            </Link>
            <Link href="/transport" onClick={closeMobileMenu}>
              <Button variant="ghost" className="w-full justify-start pl-8 hover:bg-muted/70 transition-all duration-200 ease-in-out" data-testid="link-transport-mobile">
                <Bus className="mr-2 h-4 w-4" />
                Transport & Travel
              </Button>
            </Link>
            <Link href="/projects" onClick={closeMobileMenu}>
              <Button variant="ghost" className="w-full justify-start pl-8 hover:bg-muted/70 transition-all duration-200 ease-in-out" data-testid="link-projects-mobile">
                <FolderOpen className="mr-2 h-4 w-4" />
                Projects
              </Button>
            </Link>
            <Link href="/practicals" onClick={closeMobileMenu}>
              <Button variant="ghost" className="w-full justify-start pl-8 hover:bg-muted/70 transition-all duration-200 ease-in-out" data-testid="link-practicals-mobile">
                <Settings className="mr-2 h-4 w-4" />
                Practicals
              </Button>
            </Link>
            <Link href="/code" onClick={closeMobileMenu}>
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
              <Link href="/vendors/list-service" onClick={closeMobileMenu}>
                <Button variant="ghost" className="w-full justify-start pl-8 hover:bg-muted/70 transition-all duration-200 ease-in-out" data-testid="link-list-service-mobile">
                  <FileText className="mr-2 h-4 w-4" />
                  List Your Service
                </Button>
              </Link>
            )}
            {user && (
              <Link href="/vendors/dashboard" onClick={closeMobileMenu}>
                <Button variant="ghost" className="w-full justify-start pl-8 hover:bg-muted/70 transition-all duration-200 ease-in-out" data-testid="link-vendor-dashboard-mobile">
                  <BarChart3 className="mr-2 h-4 w-4" />
                  Vendor Dashboard
                </Button>
              </Link>
            )}
            <Link href="/vendors/pricing" onClick={closeMobileMenu}>
              <Button variant="ghost" className="w-full justify-start pl-8 hover:bg-muted/70 transition-all duration-200 ease-in-out" data-testid="link-vendor-pricing-mobile">
                <DollarSign className="mr-2 h-4 w-4" />
                Pricing & Plans
              </Button>
            </Link>
            <Link href="/vendors/success-stories" onClick={closeMobileMenu}>
              <Button variant="ghost" className="w-full justify-start pl-8 hover:bg-muted/70 transition-all duration-200 ease-in-out" data-testid="link-vendor-success-mobile">
                <Target className="mr-2 h-4 w-4" />
                Success Stories
              </Button>
            </Link>
          </div>
          
          <Link href="/vendors/pricing" onClick={closeMobileMenu}>
            <Button variant="ghost" className="w-full justify-start hover:bg-muted/70 transition-all duration-200 ease-in-out" data-testid="link-pricing-mobile">
              Pricing
            </Button>
          </Link>
          
          {/* Mobile auth buttons */}
          {!user && (
            <div className="pt-4 border-t border-border space-y-2">
              <Button 
                variant="ghost" 
                className="w-full hover:bg-muted/70 transition-all duration-200 ease-in-out" 
                data-testid="button-login-mobile"
                onClick={() => {
                  onAuthClick('login');
                  closeMobileMenu();
                }}
              >
                Login
              </Button>
              <Button 
                className="w-full hover:shadow-lg transition-all duration-200 ease-in-out" 
                data-testid="button-signup-free-mobile"
                onClick={() => {
                  onAuthClick('signup');
                  closeMobileMenu();
                }}
              >
                Sign Up Free
              </Button>
            </div>
          )}
        </nav>
      </SheetContent>
    </Sheet>
  );
}