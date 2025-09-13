import React, { useState, useEffect } from 'react'

const Landing = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentSearchQuery, setCurrentSearchQuery] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const searchQueries = [
    "libraries near me",
    "data structures notes", 
    "hostels near IIT",
    "physics tutors online",
    "study groups for GATE"
  ];

  // Auto-typing animation for search demo
  useEffect(() => {
    let currentIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    const typeWriter = () => {
      const currentWord = searchQueries[currentIndex];

      if (isDeleting) {
        setCurrentSearchQuery(currentWord.substring(0, charIndex - 1));
        charIndex--;
      } else {
        setCurrentSearchQuery(currentWord.substring(0, charIndex + 1));
        charIndex++;
      }

      setIsTyping(!isDeleting && charIndex < currentWord.length);

      if (!isDeleting && charIndex === currentWord.length) {
        setTimeout(() => setIsDeleting(true), 2000);
      } else if (isDeleting && charIndex === 0) {
        setIsDeleting(false);
        currentIndex = (currentIndex + 1) % searchQueries.length;
      }
    };

    const timer = setInterval(typeWriter, isDeleting ? 50 : 150);
    return () => clearInterval(timer);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className='w-full overflow-x-hidden'>
      {/* Enhanced Navbar */}
      <nav className="flex justify-between items-center p-4 md:p-6 lg:px-16 relative bg-white shadow-sm">
        {/* Logo section */}
        <div className='start flex gap-2 md:gap-4 h-8 md:h-10 items-center'>
          <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-r from-teal-500 to-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">🎓</span>
          </div>
          <span className="text-xl md:text-2xl font-bold text-gray-800 hidden sm:block">StudyConnect</span>
        </div>

        {/* Enhanced Desktop Navigation */}
        <div className='mid hidden md:flex space-x-6 lg:space-x-10 font-semibold text-base lg:text-lg text-gray-600'>
          <div className="relative text-teal-600 group cursor-pointer">
            Home
            <span className="absolute bottom-0 left-0 w-1/2 border-b-2 border-teal-600 group-hover:w-full transition-all duration-300"></span>
          </div>
          <div className="relative group cursor-pointer hover:text-teal-600 transition-colors">
            How It Works
            <span className="absolute bottom-0 left-0 w-0 border-b-2 border-teal-600 group-hover:w-full transition-all duration-300"></span>
          </div>
          <div className="relative group cursor-pointer hover:text-teal-600 transition-colors">
            For Students
            <span className="absolute bottom-0 left-0 w-0 border-b-2 border-teal-600 group-hover:w-full transition-all duration-300"></span>
          </div>
          <div className="relative group cursor-pointer hover:text-teal-600 transition-colors">
            For Vendors
            <span className="absolute bottom-0 left-0 w-0 border-b-2 border-teal-600 group-hover:w-full transition-all duration-300"></span>
          </div>
          <div className="relative group cursor-pointer hover:text-teal-600 transition-colors">
            Pricing
            <span className="absolute bottom-0 left-0 w-0 border-b-2 border-teal-600 group-hover:w-full transition-all duration-300"></span>
          </div>
        </div>

        {/* Enhanced Desktop Right Section */}
        <div className='end hidden md:flex items-center space-x-4'>
          <div className='begin flex items-center space-x-3 lg:space-x-5'>
            <svg className='cursor-pointer hover:text-teal-600 transition-colors' width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M7.39687 14.7937C5.32954 14.7937 3.58009 14.0776 2.14851 12.6452C0.716928 11.2129 0.000759255 9.46344 6.02106e-07 7.39687C-0.000758051 5.3303 0.715411 3.58084 2.14851 2.14851C3.5816 0.716169 5.33106 0 7.39687 0C9.46268 0 11.2125 0.716169 12.6464 2.14851C14.0802 3.58084 14.796 5.3303 14.7937 7.39687C14.7937 8.23139 14.661 9.01849 14.3954 9.75818C14.1299 10.4979 13.7696 11.1522 13.3144 11.7212L19.6871 18.0939C19.8957 18.3025 20 18.568 20 18.8905C20 19.2129 19.8957 19.4784 19.6871 19.6871C19.4784 19.8957 19.2129 20 18.8905 20C18.568 20 18.3025 19.8957 18.0939 19.6871L11.7212 13.3144C11.1522 13.7696 10.4979 14.1299 9.75818 14.3954C9.01849 14.661 8.23139 14.7937 7.39687 14.7937ZM7.39687 12.5178C8.81935 12.5178 10.0286 12.0201 11.0248 11.0247C12.0209 10.0294 12.5185 8.8201 12.5178 7.39687C12.5170 5.97364 12.0193 4.76472 11.0248 3.77013C10.0302 2.77553 8.82086 2.27748 7.39687 2.27596C5.97288 2.27444 4.76396 2.7725 3.77013 3.77013C2.77629 4.76776 2.27824 5.97667 2.27596 7.39687C2.27368 8.81707 2.77174 10.0264 3.77013 11.0247C4.76852 12.0231 5.97743 12.5208 7.39687 12.5178Z" fill="currentColor"/>
            </svg>
            <div className="text-gray-600 border border-gray-300 px-3 py-2 rounded-lg hover:border-teal-500 transition-colors cursor-pointer">
              Login
            </div>
          </div>
          <div className="text-white bg-teal-500 flex items-center space-x-2 px-6 py-3 rounded-full font-semibold shadow-lg hover:bg-teal-600 transition-colors cursor-pointer">
            <span>Sign Up Free</span>
          </div>
        </div>

        {/* Mobile menu button */}
        <div className='md:hidden flex items-center'>
          <button onClick={toggleMenu} className="text-gray-500 focus:outline-none">
            {isMenuOpen ? (
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

        {/* Enhanced Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-white shadow-xl z-50 p-6 border-t">
            <div className="flex flex-col space-y-6">
              <div className="text-teal-600 font-semibold py-2 border-b border-gray-200">Home</div>
              <div className="text-gray-600 font-semibold py-2 border-b border-gray-200">How It Works</div>
              <div className="text-gray-600 font-semibold py-2 border-b border-gray-200">For Students</div>
              <div className="text-gray-600 font-semibold py-2 border-b border-gray-200">For Vendors</div>
              <div className="text-gray-600 font-semibold py-2 border-b border-gray-200">Pricing</div>
              <div className="flex flex-col space-y-3 pt-4">
                <button className="text-gray-600 border border-gray-300 px-4 py-2 rounded-lg">Login</button>
                <button className="text-white bg-teal-500 px-4 py-2 rounded-lg font-semibold">Sign Up Free</button>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Enhanced Hero Section */}
      <div className='px-4 sm:px-6 md:px-8 lg:px-16 xl:px-24 relative'>
        {/* Hero Content */}
        <div className='flex flex-col lg:flex-row justify-between items-center gap-8 lg:gap-12 pt-8 md:pt-16 lg:pt-20'>
          {/* Enhanced Left hero - text content */}
          <div className='left w-full lg:w-[50%] flex flex-col items-center lg:items-start'>
            <div className="text-center lg:text-left mb-6">
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-tight font-bold mb-4">
                <span className="text-gray-900 block">Find Everything</span>
                <span className="text-gray-900 block">You Need for</span>
                <span className="text-teal-600 block">College in One Place</span>
              </h1>

              <div className="flex flex-wrap justify-center lg:justify-start gap-2 mb-6">
                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">✅ 10,000+ Verified Services</span>
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">✅ Real-time Availability</span>
                <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium">✅ Instant Booking</span>
              </div>
            </div>

            <p className='text-lg md:text-xl text-gray-600 font-medium mb-8 max-w-lg text-center lg:text-left'>
              From study notes to hostels, tutors to events - discover, compare, and book everything you need for your academic success.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <button className="bg-teal-500 text-white px-8 py-4 rounded-full font-semibold text-lg shadow-lg hover:bg-teal-600 transition-all hover:scale-105">
                🚀 Get Started Free
              </button>
              <button className="border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-full font-semibold text-lg hover:border-teal-500 hover:text-teal-600 transition-colors">
                👁️ Browse Without Signup
              </button>
            </div>

            <div className="text-center lg:text-left text-sm text-gray-500 mb-4">
              🎓 Trusted by students from
            </div>
            <div className="flex flex-wrap justify-center lg:justify-start gap-4 text-sm font-semibold text-gray-600">
              <span className="bg-gray-100 px-3 py-1 rounded">IIT</span>
              <span className="bg-gray-100 px-3 py-1 rounded">NIT</span>
              <span className="bg-gray-100 px-3 py-1 rounded">DU</span>
              <span className="bg-gray-100 px-3 py-1 rounded">JNU</span>
              <span className="text-teal-600">+500 more</span>
            </div>
          </div>

          {/* Enhanced Right hero - image with floating elements */}
          <div className='relative w-full lg:w-[45%] aspect-square max-w-md lg:max-w-lg'>
            <div className="relative w-full h-full bg-gradient-to-br from-teal-100 to-blue-100 rounded-3xl overflow-hidden">
              <img src="https://i.postimg.cc/3xFQkvb1/image.png" alt="Student" className="w-full h-full object-cover"/>

              {/* Enhanced floating elements */}
              <div className='absolute top-8 right-8 bg-white rounded-2xl p-4 shadow-xl border border-gray-100'>
                <div className='flex items-center gap-3'>
                  <div className='w-12 h-12 bg-teal-500 rounded-xl flex items-center justify-center'>
                    <span className="text-white text-xl">📚</span>
                  </div>
                  <div>
                    <div className='text-2xl font-bold text-teal-600'>250k+</div>
                    <div className='text-sm text-gray-600 font-medium'>Students</div>
                  </div>
                </div>
              </div>

              <div className='absolute top-24 left-4 bg-white rounded-xl p-3 shadow-lg'>
                <div className='flex items-center gap-2'>
                  <span className="text-yellow-500">⭐</span>
                  <span className='text-lg font-bold'>4.9</span>
                </div>
                <div className='text-xs text-gray-600'>Rating</div>
              </div>

              <div className='absolute bottom-8 left-8 bg-white rounded-2xl p-4 shadow-xl border border-gray-100'>
                <div className='flex items-center gap-3'>
                  <div className='w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center'>
                    <span className="text-white text-xl">🎯</span>
                  </div>
                  <div>
                    <div className='text-2xl font-bold text-orange-600'>50k+</div>
                    <div className='text-sm text-gray-600 font-medium'>Reviews</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* New Interactive Search Preview Section */}
      <div className='px-4 sm:px-6 md:px-8 lg:px-16 xl:px-24 py-16 md:py-24 bg-gray-50'>
        <div className='text-center mb-12'>
          <h2 className='text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4'>
            See StudyConnect in Action
          </h2>
          <p className='text-lg md:text-xl text-gray-600 max-w-3xl mx-auto'>
            Watch how students find exactly what they need in real-time across India
          </p>
        </div>

        {/* Interactive Demo */}
        <div className='max-w-6xl mx-auto'>
          <div className='bg-white rounded-2xl shadow-xl overflow-hidden'>
            {/* Demo Search Bar */}
            <div className='p-6 bg-gradient-to-r from-teal-500 to-blue-600'>
              <div className='flex flex-col md:flex-row gap-4 items-center'>
                <div className='flex-1 relative'>
                  <input 
                    type="text" 
                    value={currentSearchQuery}
                    placeholder="Search notes, hostels, tutoring, study groups..."
                    className='w-full px-6 py-4 rounded-xl text-lg border-none focus:outline-none focus:ring-2 focus:ring-white'
                    readOnly
                  />
                  <div className={`absolute right-4 top-1/2 transform -translate-y-1/2 w-1 h-6 bg-teal-500 ${isTyping ? 'animate-pulse' : ''}`}></div>
                </div>
                <select className='px-6 py-4 rounded-xl bg-white text-gray-700 font-medium focus:outline-none focus:ring-2 focus:ring-white'>
                  <option>📍 Delhi</option>
                  <option>📍 Mumbai</option>
                  <option>📍 Bangalore</option>
                </select>
                <button className='bg-white text-teal-600 px-8 py-4 rounded-xl font-semibold hover:bg-gray-50 transition-colors'>
                  Search
                </button>
              </div>
            </div>

            {/* Demo Results */}
            <div className='flex flex-col lg:flex-row'>
              {/* Map Section */}
              <div className='lg:w-1/2 p-6 bg-blue-50'>
                <h3 className='text-xl font-bold text-gray-800 mb-4'>Live Results Across India</h3>
                <div className='relative h-80 bg-white rounded-xl p-4'>
                  <div className='absolute inset-4 bg-gray-100 rounded-lg flex items-center justify-center'>
                    <div className='text-center'>
                      <div className='text-4xl mb-2'>🗺️</div>
                      <div className='text-gray-600 font-medium'>Interactive Map</div>
                      <div className='text-sm text-gray-500 mt-2'>Showing 2,500+ services across 50+ cities</div>
                    </div>
                  </div>
                  {/* Sample markers */}
                  <div className='absolute top-8 right-12 w-4 h-4 bg-teal-500 rounded-full animate-pulse'></div>
                  <div className='absolute top-16 left-8 w-4 h-4 bg-orange-500 rounded-full animate-pulse'></div>
                  <div className='absolute bottom-12 right-8 w-4 h-4 bg-purple-500 rounded-full animate-pulse'></div>
                </div>
              </div>

              {/* Results Section */}
              <div className='lg:w-1/2 p-6'>
                <h3 className='text-xl font-bold text-gray-800 mb-4'>156 Results Found</h3>
                <div className='space-y-4'>
                  <div className='border border-gray-200 rounded-xl p-4 hover:shadow-lg transition-shadow'>
                    <div className='flex items-start gap-3'>
                      <div className='w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-xl'>📚</div>
                      <div className='flex-1'>
                        <h4 className='font-semibold text-gray-800'>Data Structures Notes</h4>
                        <div className='flex items-center gap-2 text-sm text-gray-600 mb-2'>
                          <span className='flex items-center gap-1'>⭐⭐⭐⭐⭐ 4.9</span>
                          <span>•</span>
                          <span>Computer Science</span>
                          <span>•</span>
                          <span className='text-green-600 font-medium'>Free</span>
                        </div>
                        <div className='flex gap-2'>
                          <button className='bg-teal-500 text-white px-3 py-1 rounded text-sm hover:bg-teal-600'>View</button>
                          <button className='border border-gray-300 text-gray-600 px-3 py-1 rounded text-sm hover:border-teal-500'>Save</button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className='border border-gray-200 rounded-xl p-4 hover:shadow-lg transition-shadow'>
                    <div className='flex items-start gap-3'>
                      <div className='w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center text-xl'>🏠</div>
                      <div className='flex-1'>
                        <h4 className='font-semibold text-gray-800'>Green Valley Hostel</h4>
                        <div className='flex items-center gap-2 text-sm text-gray-600 mb-2'>
                          <span className='flex items-center gap-1'>⭐⭐⭐⭐⚪ 4.2</span>
                          <span>•</span>
                          <span>0.5km away</span>
                          <span>•</span>
                          <span className='text-blue-600 font-medium'>₹8,000/month</span>
                        </div>
                        <div className='flex gap-2'>
                          <button className='bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600'>Call</button>
                          <button className='border border-gray-300 text-gray-600 px-3 py-1 rounded text-sm hover:border-green-500'>Book Tour</button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className='border border-gray-200 rounded-xl p-4 hover:shadow-lg transition-shadow'>
                    <div className='flex items-start gap-3'>
                      <div className='w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center text-xl'>👨‍🏫</div>
                      <div className='flex-1'>
                        <h4 className='font-semibold text-gray-800'>Math Tutor - Prof Ray</h4>
                        <div className='flex items-center gap-2 text-sm text-gray-600 mb-2'>
                          <span className='flex items-center gap-1'>⭐⭐⭐⭐⭐ 4.9</span>
                          <span>•</span>
                          <span>Online/Offline</span>
                          <span>•</span>
                          <span className='text-purple-600 font-medium'>₹500/hr</span>
                        </div>
                        <div className='flex gap-2'>
                          <button className='bg-purple-500 text-white px-3 py-1 rounded text-sm hover:bg-purple-600'>Book</button>
                          <button className='border border-gray-300 text-gray-600 px-3 py-1 rounded text-sm hover:border-purple-500'>Message</button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <button className='w-full mt-4 bg-gray-100 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-200 transition-colors'>
                  View All Results →
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className='text-center mt-12'>
          <button className='bg-gradient-to-r from-teal-500 to-blue-600 text-white px-12 py-4 rounded-full text-xl font-semibold shadow-xl hover:shadow-2xl hover:scale-105 transition-all'>
            Try It Yourself - Free!
          </button>
        </div>
      </div>

      {/* Problem Statement Section */}
      <div className='px-4 sm:px-6 md:px-8 lg:px-16 xl:px-24 py-16 md:py-24'>
        <div className='text-center mb-16'>
          <h2 className='text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4'>
            The Student Struggle is Real
          </h2>
          <p className='text-lg md:text-xl text-gray-600 max-w-3xl mx-auto'>
            Students spend countless hours searching for resources, quality accommodations, and reliable services. We're here to change that.
          </p>
        </div>

        <div className='grid md:grid-cols-3 gap-8 max-w-6xl mx-auto'>
          <div className='text-center p-8 bg-red-50 rounded-2xl'>
            <div className='w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6'>
              <span className='text-4xl'>⏰</span>
            </div>
            <h3 className='text-2xl font-bold text-red-600 mb-2'>6+ Hours</h3>
            <h4 className='text-xl font-semibold text-gray-800 mb-4'>Wasted Weekly</h4>
            <p className='text-gray-600'>Students spend hours searching across multiple platforms for resources, tutoring, and campus services</p>
          </div>

          <div className='text-center p-8 bg-orange-50 rounded-2xl'>
            <div className='w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6'>
              <span className='text-4xl'>💰</span>
            </div>
            <h3 className='text-2xl font-bold text-orange-600 mb-2'>40%</h3>
            <h4 className='text-xl font-semibold text-gray-800 mb-4'>Higher Costs</h4>
            <p className='text-gray-600'>Without proper information, students often pay higher rates and receive subpar services</p>
          </div>

          <div className='text-center p-8 bg-purple-50 rounded-2xl'>
            <div className='w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6'>
              <span className='text-4xl'>😔</span>
            </div>
            <h3 className='text-2xl font-bold text-purple-600 mb-2'>Isolated</h3>
            <h4 className='text-xl font-semibold text-gray-800 mb-4'>Communities</h4>
            <p className='text-gray-600'>Lack of proper platforms for academic collaboration and networking among students</p>
          </div>
        </div>
      </div>

      {/* Final CTA Section */}
      <div className='px-4 sm:px-6 md:px-8 lg:px-16 xl:px-24 py-16 md:py-24 bg-gradient-to-r from-teal-500 via-blue-600 to-purple-600'>
        <div className='text-center text-white'>
          <h2 className='text-3xl md:text-4xl lg:text-5xl font-bold mb-6'>
            Ready to Transform Your Student Experience?
          </h2>
          <p className='text-lg md:text-xl mb-12 max-w-3xl mx-auto opacity-90'>
            Join 250,000+ students who are already saving time, finding better resources, and building meaningful connections through StudyConnect
          </p>

          <div className='flex flex-col sm:flex-row gap-6 justify-center items-center'>
            <button className='bg-white text-gray-800 px-12 py-4 rounded-full text-xl font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all'>
              🚀 Start Your Journey - FREE
            </button>
            <button className='border-2 border-white text-white px-12 py-4 rounded-full text-xl font-semibold hover:bg-white hover:text-gray-800 transition-all'>
              📱 Download Mobile App
            </button>
          </div>

          <div className='flex items-center justify-center gap-8 mt-8 text-sm opacity-80'>
            <span className='flex items-center gap-2'>✅ Free forever</span>
            <span className='flex items-center gap-2'>⚡ Instant setup</span>
            <span className='flex items-center gap-2'>🔒 100% secure</span>
          </div>
        </div>
      </div>

      {/* Enhanced Footer */}
      <footer className='bg-gray-900 text-white px-4 sm:px-6 md:px-8 lg:px-16 xl:px-24 py-16'>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 max-w-6xl mx-auto'>
          {/* Brand Section */}
          <div className='lg:col-span-2'>
            <div className='flex items-center gap-3 mb-6'>
              <div className="w-10 h-10 bg-gradient-to-r from-teal-500 to-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">🎓</span>
              </div>
              <span className="text-2xl font-bold">StudyConnect</span>
            </div>
            <p className='text-gray-400 mb-6 max-w-sm'>
              India's #1 student resource platform connecting students with everything they need for academic success.
            </p>
            <button className='bg-teal-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-teal-600 transition-colors'>
              📱 Download App
            </button>
          </div>

          {/* For Students */}
          <div>
            <h3 className='text-xl font-semibold mb-6'>For Students</h3>
            <ul className='space-y-3 text-gray-400'>
              <li><a href="#" className='hover:text-white transition-colors'>Browse Notes</a></li>
              <li><a href="#" className='hover:text-white transition-colors'>Find Hostels</a></li>
              <li><a href="#" className='hover:text-white transition-colors'>Book Tutors</a></li>
              <li><a href="#" className='hover:text-white transition-colors'>Join Events</a></li>
              <li><a href="#" className='hover:text-white transition-colors'>Mobile App</a></li>
            </ul>
          </div>

          {/* For Vendors */}
          <div>
            <h3 className='text-xl font-semibold mb-6'>For Vendors</h3>
            <ul className='space-y-3 text-gray-400'>
              <li><a href="#" className='hover:text-white transition-colors'>List Your Service</a></li>
              <li><a href="#" className='hover:text-white transition-colors'>Vendor Dashboard</a></li>
              <li><a href="#" className='hover:text-white transition-colors'>Pricing Plans</a></li>
              <li><a href="#" className='hover:text-white transition-colors'>API Access</a></li>
              <li><a href="#" className='hover:text-white transition-colors'>Support</a></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className='text-xl font-semibold mb-6'>Company</h3>
            <ul className='space-y-3 text-gray-400'>
              <li><a href="#" className='hover:text-white transition-colors'>About Us</a></li>
              <li><a href="#" className='hover:text-white transition-colors'>Careers</a></li>
              <li><a href="#" className='hover:text-white transition-colors'>Press Kit</a></li>
              <li><a href="#" className='hover:text-white transition-colors'>Contact</a></li>
              <li><a href="#" className='hover:text-white transition-colors'>Legal</a></li>
            </ul>
          </div>
        </div>

        <div className='border-t border-gray-800 pt-8 mt-16 max-w-6xl mx-auto'>
          <div className='flex flex-col md:flex-row justify-between items-center'>
            <p className='text-gray-400 text-center md:text-left'>
              © 2024 StudyConnect. All rights reserved.
            </p>
            <div className='flex gap-6 mt-4 md:mt-0'>
              <a href="#" className='text-gray-400 hover:text-white transition-colors text-2xl'>📘</a>
              <a href="#" className='text-gray-400 hover:text-white transition-colors text-2xl'>🐦</a>
              <a href="#" className='text-gray-400 hover:text-white transition-colors text-2xl'>📷</a>
              <a href="#" className='text-gray-400 hover:text-white transition-colors text-2xl'>💼</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Landing
