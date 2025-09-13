import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function Navbar() {
  const { isAuthenticated, user } = useAuth();
  const [location] = useLocation();

  return (
    <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <Link href={isAuthenticated ? "/" : "/"}>
              <div className="flex items-center space-x-3" data-testid="link-home">
                <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-primary-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
                  </svg>
                </div>
                <span className="text-xl font-bold text-foreground">StudyConnect</span>
              </div>
            </Link>
            
            {isAuthenticated && (
              <div className="hidden md:flex space-x-6">
                <Link href="/browse">
                  <a className={`text-muted-foreground hover:text-foreground transition-colors ${location === '/browse' ? 'text-foreground font-medium' : ''}`} data-testid="link-browse">
                    Browse
                  </a>
                </Link>
                <Link href="/notes">
                  <a className={`text-muted-foreground hover:text-foreground transition-colors ${location === '/notes' ? 'text-foreground font-medium' : ''}`} data-testid="link-notes">
                    Notes
                  </a>
                </Link>
                <Link href="/upload">
                  <a className={`text-muted-foreground hover:text-foreground transition-colors ${location === '/upload' ? 'text-foreground font-medium' : ''}`} data-testid="link-upload">
                    Upload
                  </a>
                </Link>
                <Link href="/vendors">
                  <a className={`text-muted-foreground hover:text-foreground transition-colors ${location === '/vendors' ? 'text-foreground font-medium' : ''}`} data-testid="link-vendors">
                    Services
                  </a>
                </Link>
              </div>
            )}
          </div>
          
          <div className="flex items-center space-x-4">
            {!isAuthenticated ? (
              <>
                <Button variant="ghost" onClick={() => window.location.href = "/api/login"} data-testid="button-sign-in">
                  Sign In
                </Button>
                <Button onClick={() => window.location.href = "/api/login"} data-testid="button-get-started">
                  Get Started
                </Button>
              </>
            ) : (
              <>
                {user?.role === 'admin' && (
                  <Link href="/admin">
                    <Button variant="outline" size="sm" data-testid="button-admin">
                      Admin
                    </Button>
                  </Link>
                )}
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-10 w-10 rounded-full" data-testid="button-user-menu">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={user?.profileImageUrl || undefined} alt={user?.firstName || "User"} />
                        <AvatarFallback>
                          {user?.firstName?.[0] || user?.email?.[0] || 'U'}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <div className="flex flex-col space-y-1 p-2">
                      <p className="text-sm font-medium leading-none" data-testid="text-user-name">
                        {user?.firstName} {user?.lastName}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground" data-testid="text-user-email">
                        {user?.email}
                      </p>
                    </div>
                    <DropdownMenuSeparator />
                    <Link href="/saved">
                      <DropdownMenuItem data-testid="menu-item-saved">
                        Saved Notes
                      </DropdownMenuItem>
                    </Link>
                    <DropdownMenuItem data-testid="menu-item-profile">
                      Profile Settings
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => window.location.href = "/api/logout"} data-testid="menu-item-logout">
                      Log Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
