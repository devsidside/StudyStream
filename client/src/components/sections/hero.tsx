export default function Hero() {
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
        {/* Left hero - text content */}
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

          {/* Reviews counter */}
          <div className='absolute top-6 sm:top-8 md:top-12 lg:top-25 right-2 sm:right-4 md:right-6 lg:right-0 w-36 sm:w-40 bg-white flex space-x-3 shadow-[0_4px_20px_rgba(0,0,0,0.15)] p-3 rounded-xl md:rounded-2xl'>
            <div className='flex justify-center items-center bg-amber-500 p-2 w-10 h-10 sm:w-12 sm:h-12 rounded-lg'>
              <img
                src="https://i.postimg.cc/vBntdz6h/image.png"
                className='w-5 sm:w-6'
                alt="Reviews icon"
              />
            </div>
            <div className='flex flex-col justify-center'>
              <span className='text-lg sm:text-xl font-bold text-[#1eb1bf]' data-testid="text-reviews">4.9</span>
              <span className='text-xs sm:text-sm font-semibold text-gray-500'>Reviews</span>
            </div>
          </div>

          {/* Active students counter */}
          <div className='absolute bottom-4 sm:bottom-6 md:bottom-10 lg:bottom-16 left-4 sm:left-6 w-36 sm:w-40 bg-white shadow-[0_4px_20px_rgba(0,0,0,0.15)] rounded-xl md:rounded-2xl p-3 flex space-x-3'>
            <div className='flex justify-center items-center bg-amber-500 p-2 w-10 h-10 sm:w-12 sm:h-12 rounded-lg'>
              <img
                src="https://i.postimg.cc/9Qf09Q1H/image.png"
                className='w-5 sm:w-6'
                alt="Students icon"
              />
            </div>
            <div className='flex flex-col justify-center'>
              <span className='text-lg sm:text-xl font-bold text-[#1eb1bf]' data-testid="text-active-students">150k</span>
              <span className='text-xs sm:text-sm font-semibold text-gray-500'>Active Students</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}