import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";

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
              <Link href="/">
                <Button variant="ghost" className="text-muted-foreground hover:text-foreground transition-colors" data-testid="link-home-nav">
                  Home
                </Button>
              </Link>
              <Link href="/about">
                <Button variant="ghost" className="text-muted-foreground hover:text-foreground transition-colors" data-testid="link-about">
                  About
                </Button>
              </Link>
              <Link href="/features">
                <Button variant="ghost" className="text-muted-foreground hover:text-foreground transition-colors" data-testid="link-features">
                  Features
                </Button>
              </Link>
              <Link href="/contact">
                <Button variant="ghost" className="text-muted-foreground hover:text-foreground transition-colors" data-testid="link-contact">
                  Contact
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
