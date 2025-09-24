import { useState } from "react";
import { useAuth } from "@/contexts/auth-context";
import DualAuthModal from "@/components/auth/dual-auth-modal";
import { Logo } from "@/components/navbar/Logo";
import { MobileMenu } from "@/components/navbar/MobileMenu";
import { DesktopMenu } from "@/components/navbar/DesktopMenu";

export default function Navbar() {
  const { user } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [studentsDropdownOpen, setStudentsDropdownOpen] = useState(false);
  const [vendorsDropdownOpen, setVendorsDropdownOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalType, setAuthModalType] = useState<'login' | 'signup'>('login');

  const handleAuthClick = (type: 'login' | 'signup') => {
    setAuthModalType(type);
    setAuthModalOpen(true);
  };

  return (
    <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <Logo />
            
            <MobileMenu
              isOpen={isMobileMenuOpen}
              onOpenChange={setIsMobileMenuOpen}
              user={user}
              onAuthClick={handleAuthClick}
            />
            
            <DesktopMenu
              user={user}
              studentsDropdownOpen={studentsDropdownOpen}
              vendorsDropdownOpen={vendorsDropdownOpen}
              setStudentsDropdownOpen={setStudentsDropdownOpen}
              setVendorsDropdownOpen={setVendorsDropdownOpen}
              onAuthClick={handleAuthClick}
            />
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