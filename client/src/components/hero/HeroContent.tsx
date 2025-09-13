import { Button } from "@/components/ui/button";

export default function HeroContent() {
  return (
    <div className='left w-full lg:w-[45%] xl:w-[40%] relative flex flex-col items-center lg:items-start'>
      <div className='relative w-full flex flex-col items-center lg:items-start'>
        <div className="text-left">
          <h1 className="text-3xl xs:text-4xl sm:text-5xl md:text-5xl lg:text-6xl leading-[1.1] sm:leading-[1.2] md:leading-[1.2] font-bold">
            <span className="text-[#d4a018] block">Find Study Groups,</span>
            <span className="text-black block mt-1 sm:mt-2">Notes, and Campus</span>
            <span className="text-black flex items-end mt-1 sm:mt-2">
              <span className="mr-2">Services Near You</span>
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
      <div className="text-white w-fit mt-6 md:mt-8 bg-[#1eb1bf] flex items-center space-x-2 p-3 md:p-4 px-5 md:px-6 rounded-full font-semibold shadow-[0_8px_30px_rgba(30,177,191,0.4)] hover:bg-[#189ba8] transition-colors cursor-pointer" onClick={() => window.location.href = "/signin"} data-testid="button-join-now">
        <span className="text-sm md:text-base">JOIN NOW &gt;</span>
      </div>
    </div>
  );
}