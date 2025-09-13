import HeroContent from "./HeroContent";
import HeroVisual from "./HeroVisual";

export default function HeroSection() {
  return (
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
        <HeroContent />
        <HeroVisual />
      </div>
    </div>
  );
}