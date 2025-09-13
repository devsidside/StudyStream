export default function FloatingIcons() {
  return (
    <>
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
    </>
  );
}