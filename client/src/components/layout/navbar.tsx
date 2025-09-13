import { useState } from 'react';
import { Search, User, ChevronDown, LogIn, Menu, X } from 'lucide-react';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="flex justify-between items-center p-4 md:p-6 lg:px-16 relative bg-white">
      {/* Logo section */}
      <div className='start flex gap-2 md:gap-4 h-8 md:h-10'>
        <img
          src="https://i.postimg.cc/jSGr83xS/alogo.png"
          className='h-full object-contain'
          alt="Logo"
          data-testid="img-logo"
        />
        <img
          src="https://i.postimg.cc/wjNrBqz9/atit.png"
          className='h-full object-contain hidden sm:block'
          alt="Brand name"
          data-testid="img-brand"
        />
      </div>

      {/* Desktop Navigation */}
      <div className='mid hidden md:flex space-x-6 lg:space-x-10 font-semibold text-lg lg:text-xl text-gray-500'>
        <div className="relative text-green-800/50 group cursor-pointer" data-testid="link-home">
          Home
          <span className="absolute bottom-0 left-0 w-1/2 border-b-2 border-green-800/50 group-hover:w-full transition-all duration-300"></span>
        </div>
        <div className="relative group cursor-pointer" data-testid="link-about">
          About
          <span className="absolute bottom-0 left-0 w-0 border-b-2 border-green-800/50 group-hover:w-full transition-all duration-300"></span>
        </div>
        <div className='relative group cursor-pointer' data-testid="link-courses">
          <img
            src="https://i.postimg.cc/Z5YrhP8h/lo.png"
            className='absolute -top-5 lg:-top-7 left-4 lg:left-6 w-4 lg:w-auto'
            alt="Course icon"
          />
          Courses
          <span className="absolute bottom-0 left-0 w-0 border-b-2 border-green-800/50 group-hover:w-full transition-all duration-300"></span>
        </div>
        <div className="relative group cursor-pointer" data-testid="link-contact">
          Contact
          <span className="absolute bottom-0 left-0 w-0 border-b-2 border-green-800/50 group-hover:w-full transition-all duration-300"></span>
        </div>
      </div>

      {/* Desktop Right Section */}
      <div className='end hidden md:flex items-center space-x-4'>
        <div className='begin flex items-center space-x-3 lg:space-x-5'>
          <Search className='cursor-pointer w-5 h-5 text-gray-500' data-testid="button-search" />
          <img
            src="https://i.postimg.cc/VsjB5JrG/image.png"
            className='h-6 lg:h-8 cursor-pointer'
            alt="User profile"
            data-testid="img-profile"
          />
          <div className='flex items-center space-x-1 lg:space-x-2 cursor-pointer' data-testid="button-language">
            <span className='text-lg font-semibold text-gray-600'>EN</span>
            <ChevronDown className='w-4 h-4 text-gray-500' />
          </div>
        </div>
        <div className="text-white bg-amber-500 flex items-center space-x-2 px-4 lg:px-6 py-2 lg:py-3 rounded-full font-semibold shadow-[0_8px_20px_rgba(245,158,11,0.4)] cursor-pointer hover:bg-amber-600 transition-colors" data-testid="button-login">
          <LogIn className='w-5 h-5' />
          <span>Login</span>
        </div>
      </div>

      {/* Mobile menu button */}
      <div className='md:hidden flex items-center'>
        <button
          onClick={toggleMenu}
          className="text-gray-500 focus:outline-none"
          data-testid="button-menu"
        >
          {isMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white shadow-lg z-50 p-4" data-testid="menu-mobile">
          <div className="flex flex-col space-y-4">
            <div className="text-green-800/50 font-semibold py-2 border-b border-gray-200 cursor-pointer" data-testid="link-home-mobile">
              Home
            </div>
            <div className="text-gray-500 font-semibold py-2 border-b border-gray-200 cursor-pointer" data-testid="link-about-mobile">
              About
            </div>
            <div className="text-gray-500 font-semibold py-2 border-b border-gray-200 flex items-center cursor-pointer" data-testid="link-courses-mobile">
              <img
                src="https://i.postimg.cc/Z5YrhP8h/lo.png"
                className='w-5 mr-2'
                alt="Course icon"
              />
              Courses
            </div>
            <div className="text-gray-500 font-semibold py-2 border-b border-gray-200 cursor-pointer" data-testid="link-contact-mobile">
              Contact
            </div>

            <div className="flex items-center justify-between pt-4">
              <div className='flex items-center space-x-4'>
                <Search className='cursor-pointer w-5 h-5 text-gray-500' data-testid="button-search-mobile" />
                <img
                  src="https://i.postimg.cc/VsjB5JrG/image.png"
                  className='h-6 cursor-pointer'
                  alt="User profile"
                  data-testid="img-profile-mobile"
                />
                <div className='flex items-center space-x-1 cursor-pointer' data-testid="button-language-mobile">
                  <span className='font-semibold text-gray-600'>EN</span>
                  <ChevronDown className='w-4 h-4 text-gray-500' />
                </div>
              </div>
              <div className="text-white bg-amber-500 flex items-center space-x-2 px-4 py-2 rounded-full font-semibold shadow-[0_8px_20px_rgba(245,158,11,0.4)] cursor-pointer" data-testid="button-login-mobile">
                <LogIn className='w-5 h-5' />
                <span>Login</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}