export default function FloatingStats() {
  return (
    <>
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
    </>
  );
}