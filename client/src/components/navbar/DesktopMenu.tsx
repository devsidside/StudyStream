import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ChevronDown, Search, BookOpen, Home, Users, GraduationCap, Coffee, Bus, FolderOpen, Settings, Code2, FileText, BarChart3, DollarSign, TrendingUp, Target, Handshake, MessageCircle } from "lucide-react";

interface DesktopMenuProps {
  user: any;
  studentsDropdownOpen: boolean;
  vendorsDropdownOpen: boolean;
  setStudentsDropdownOpen: (open: boolean) => void;
  setVendorsDropdownOpen: (open: boolean) => void;
  onAuthClick: (type: 'login' | 'signup') => void;
}

export function DesktopMenu({ 
  user, 
  studentsDropdownOpen, 
  vendorsDropdownOpen, 
  setStudentsDropdownOpen, 
  setVendorsDropdownOpen, 
  onAuthClick 
}: DesktopMenuProps) {
  return (
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
              💼 Projects
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/practicals" className="flex w-full" data-testid="link-practicals">
              <Settings className="mr-2 h-4 w-4" />
              🔬 Practicals
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/code" className="flex w-full" data-testid="link-code">
              <Code2 className="mr-2 h-4 w-4" />
              💻 Code
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
            <Link href="/vendors/benefits" className="flex w-full" data-testid="link-vendor-benefits">
              <TrendingUp className="mr-2 h-4 w-4" />
              Benefits for Vendors
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/vendors/success-stories" className="flex w-full" data-testid="link-vendor-success">
              <Target className="mr-2 h-4 w-4" />
              Success Stories
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/vendors/support" className="flex w-full" data-testid="link-vendor-support">
              <MessageCircle className="mr-2 h-4 w-4" />
              Support & Resources
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/vendors/partnerships" className="flex w-full" data-testid="link-vendor-partnerships">
              <Handshake className="mr-2 h-4 w-4" />
              Partnership Opportunities
            </Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Link href="/vendors/pricing">
        <Button variant="ghost" className="text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all duration-200 ease-in-out transform hover:scale-105" data-testid="link-pricing">
          Pricing
        </Button>
      </Link>

      {/* Desktop auth buttons */}
      {!user && (
        <div className="flex items-center space-x-3">
          <Button 
            variant="ghost" 
            className="text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all duration-200 ease-in-out transform hover:scale-105" 
            data-testid="button-login"
            onClick={() => onAuthClick('login')}
          >
            Login
          </Button>
          <Button 
            className="hover:shadow-lg transition-all duration-200 ease-in-out transform hover:scale-105 shadow-sm" 
            data-testid="button-signup-free"
            onClick={() => onAuthClick('signup')}
          >
            Sign Up Free
          </Button>
        </div>
      )}
    </div>
  );
}