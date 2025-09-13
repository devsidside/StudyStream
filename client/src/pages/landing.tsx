import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import { Button } from "@/components/ui/button";

export default function Landing() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <div className='px-4 sm:px-6 md:px-8 lg:px-12 xl:px-30 relative pt-24'>
        {/* Decorative background elements - hidden on mobile */}
        <img
          src="https://i.postimg.cc/HLqqKkfF/line.png"
          className='absolute left-0 top-4 w-20 md:w-30 lg:w-40 xl:w-50 hidden lg:block'
          alt="Decorative line"
        />
        <img
          src="https://i.postimg.cc/X7BtB78r/ll-removebg-preview.png"
          className='absolute right-0 w-20 md:w-30 lg:w-40 xl:w-45 top-15 md:top-25 lg:top-35 hidden md:block'
          alt="Decorative element"
        />

        {/* Hero Content */}
        <div className='flex flex-col lg:flex-row justify-around items-center gap-8 lg:gap-4 xl:gap-8 pt-6 md:pt-10 lg:pt-16'>
          {/* Left hero - text content */}
          <div className='left w-full lg:w-[45%] xl:w-[40%] relative flex flex-col items-center lg:items-start'>
            <div className='relative w-full flex flex-col items-center lg:items-start'>
              <div className="text-left">
                <h1 className="text-4xl xs:text-5xl sm:text-6xl md:text-6xl lg:text-7xl leading-[1.1] sm:leading-[1.2] md:leading-[1.2] font-bold">
                  <span className="text-[#d4a018] block">Take your time</span>
                  <span className="text-black block mt-1 sm:mt-2">and learn from</span>
                  <span className="text-black flex items-end mt-1 sm:mt-2">
                    <span className="mr-2">anywhere</span>
                    <img
                      src="https://i.postimg.cc/XYw7xtGj/kk.png"
                      className='w-10 h-10 xs:w-12 xs:h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 lg:w-20 lg:h-20 xl:w-24 xl:h-24'
                      alt="Decoration"
                    />
                  </span>
                </h1>
              </div>
            </div>
            <p className='text-sm xs:text-base sm:text-lg md:text-xl text-gray-600 font-medium mt-4 md:mt-6 lg:mt-8 max-w-md'>
              A learning system based on formalised teaching but with the help of electronic resources.
            </p>
            <div className="text-white w-fit mt-6 md:mt-8 bg-[#1eb1bf] flex items-center space-x-2 p-3 md:p-4 px-5 md:px-6 rounded-full font-semibold shadow-[0_8px_30px_rgba(30,177,191,0.4)] hover:bg-[#189ba8] transition-colors cursor-pointer" onClick={() => window.location.href = "/signin"} data-testid="button-learn-now">
              <span className="text-sm md:text-base">LEARN NOW &gt;</span>
            </div>
          </div>

          {/* Right hero - image with floating elements */}
          <div className='relative w-full lg:w-[50%] xl:w-[45%] aspect-square max-w-md lg:max-w-none bg-[url("https://i.postimg.cc/3xFQkvb1/image.png")] bg-center bg-cover rounded-lg overflow-hidden'>
            {/* Batch icon */}
            <div className='absolute top-20 lg:top-40 left-4 sm:left-8 md:left-16 lg:left-22 flex justify-center items-center rounded-full p-2 w-8 h-8 sm:w-14 sm:h-14 md:w-16 md:h-16 lg:w-15 lg:h-15 bg-white shadow-[0_4px_20px_rgba(0,0,0,0.15)]'>
              <img
                src="https://i.postimg.cc/pVgpgv2D/batch.png"
                className='w-5 sm:w-6 md:w-7'
                alt="Batch icon"
              />
            </div>

            {/* Cap icon */}
            <div className='absolute bottom-10 right-8 sm:right-12 md:right-20 lg:right-35 flex justify-center items-center rounded-full p-2 w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 lg:w-16 lg:h-16 bg-white shadow-[0_4px_20px_rgba(0,0,0,0.15)]'>
              <img
                src="https://i.postimg.cc/V6mF9thk/cap.png"
                className='w-6 sm:w-7 md:w-8 lg:w-10'
                alt="Graduation cap"
              />
            </div>

            {/* Free courses counter */}
            <div className='absolute top-6 sm:top-8 md:top-12 lg:top-25 right-2 sm:right-4 md:right-6 lg:right-0 w-40 sm:w-48 md:w-52 bg-white flex space-x-2 sm:space-x-3 md:space-x-4 shadow-[0_4px_20px_rgba(0,0,0,0.15)] p-3 sm:p-4 rounded-xl md:rounded-2xl'>
              <div className='flex justify-center items-center bg-amber-500 p-2 sm:p-3 md:p-4 w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-lg md:rounded-xl'>
                <img
                  src="https://i.postimg.cc/vBntdz6h/image.png"
                  className='w-5 sm:w-6 md:w-7 lg:w-8'
                  alt="Courses icon"
                />
              </div>
              <div className='flex flex-col gap-0 sm:gap-1'>
                <span className='text-lg sm:text-xl md:text-2xl text-[#1eb1bf] font-bold' data-testid="text-free-courses">250k</span>
                <span className='text-xs sm:text-sm md:text-base font-semibold text-gray-500'>Free Courses</span>
              </div>
            </div>

            {/* Active students counter */}
            <div className='absolute bottom-4 sm:bottom-6 md:bottom-10 lg:bottom-16 left-4 sm:left-6 w-40 sm:w-45 bg-white shadow-[0_4px_20px_rgba(0,0,0,0.15)] rounded-xl md:rounded-2xl p-4 sm:p-5'>
              <div className='absolute -top-4 -left-4 sm:-top-5 sm:-left-5 md:-top-6 md:-left-6 flex justify-center items-center bg-amber-500 p-2 sm:p-3 md:p-4 w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-full'>
                <img
                  src="https://i.postimg.cc/9Qf09Q1H/image.png"
                  className='w-5 sm:w-6 md:w-7'
                  alt="Students icon"
                />
              </div>
              <div className='flex flex-col gap-0 sm:gap-1'>
                <span className='text-lg sm:text-xl md:text-2xl text-[#1eb1bf] font-bold' data-testid="text-active-students">150k</span>
                <span className='text-xs sm:text-sm md:text-base font-semibold text-gray-500'>Active Students</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Problem Section */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl md:text-4xl font-bold">The Student Struggle is Real</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Students spend countless hours searching for resources, quality accommodations, and reliable services. We're here to change that.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-card rounded-2xl p-8 hover-lift border border-border">
              <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-destructive" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
              <h3 className="text-4xl font-bold text-destructive mb-2" data-testid="text-hours-wasted">6+ Hours</h3>
              <p className="text-lg font-semibold mb-2">Wasted Weekly</p>
              <p className="text-muted-foreground">Students spend hours searching for notes, accommodation, and campus services</p>
            </div>
            
            <div className="bg-card rounded-2xl p-8 hover-lift border border-border">
              <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"/>
                </svg>
              </div>
              <h3 className="text-4xl font-bold text-secondary mb-2" data-testid="text-higher-costs">40%</h3>
              <p className="text-lg font-semibold mb-2">Higher Costs</p>
              <p className="text-muted-foreground">Without proper information, students often pay more for subpar services</p>
            </div>
            
            <div className="bg-card rounded-2xl p-8 hover-lift border border-border">
              <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
                </svg>
              </div>
              <h3 className="text-4xl font-bold text-accent mb-2" data-testid="text-isolated">Isolated</h3>
              <p className="text-lg font-semibold mb-2">Communities</p>
              <p className="text-muted-foreground">Lack of proper platforms for academic collaboration and peer support</p>
            </div>
          </div>
        </div>
      </section>

      {/* Solution Platform Overview */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <h2 className="text-3xl md:text-4xl font-bold">One Platform, Everything You Need</h2>
                <p className="text-xl text-muted-foreground">
                  StudyConnect brings together academic resources, campus services, and student community in one powerful platform.
                </p>
              </div>
              
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                    <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Instant Access to Quality Resources</h3>
                    <p className="text-muted-foreground">Find notes, projects, and study materials curated by your peers and verified by our community.</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-secondary/10 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                    <svg className="w-4 h-4 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Trusted Campus Services</h3>
                    <p className="text-muted-foreground">Browse verified hostels, mess services, tutoring, and cafes with real reviews from students.</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-accent/10 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                    <svg className="w-4 h-4 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Vibrant Student Community</h3>
                    <p className="text-muted-foreground">Connect with peers, join study groups, and participate in discussions while maintaining privacy.</p>
                  </div>
                </div>
              </div>
              
              <Button 
                className="bg-primary text-primary-foreground px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors"
                onClick={() => window.location.href = "/api/login"}
                data-testid="button-explore-platform"
              >
                Sign In
              </Button>
            </div>
            
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600" 
                alt="Modern dashboard interface displaying student resources and analytics" 
                className="rounded-2xl shadow-2xl" 
                data-testid="img-dashboard"
              />
              
              <div className="absolute top-6 left-6 glass-card rounded-xl p-4">
                <div className="space-y-2">
                  <p className="text-sm font-semibold">Active Today</p>
                  <p className="text-2xl font-bold text-primary" data-testid="text-active-users">2,847</p>
                  <p className="text-xs text-muted-foreground">Students online</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary via-accent to-secondary">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          <div className="space-y-4">
            <h2 className="text-3xl md:text-5xl font-bold text-white">
              Ready to Transform Your Student Experience?
            </h2>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              Join thousands of students who are already saving time, finding better resources, and building meaningful connections through StudyConnect.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Button 
              size="lg"
              className="bg-white text-primary px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white/90 transition-colors transform hover:scale-105"
              onClick={() => window.location.href = "/api/login"}
              data-testid="button-start-free"
            >
              Start Your Journey - Free
            </Button>
            <Button 
              variant="outline"
              size="lg"
              className="border-2 border-white text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white/10 transition-colors"
              onClick={() => window.location.href = "/api/login"}
              data-testid="button-list-service-cta"
            >
              List Your Service
            </Button>
          </div>
          
          <div className="flex justify-center items-center space-x-8 text-white/80 text-sm">
            <div className="flex items-center space-x-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              <span data-testid="text-free-start">Free to start</span>
            </div>
            <div className="flex items-center space-x-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              <span data-testid="text-no-credit-card">No credit card required</span>
            </div>
            <div className="flex items-center space-x-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              <span data-testid="text-quick-join">Join in 30 seconds</span>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
