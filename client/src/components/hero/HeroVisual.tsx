import FloatingIcons from "./FloatingIcons";
import FloatingStats from "./FloatingStats";

export default function HeroVisual() {
  return (
    <div className='relative w-full lg:w-[50%] xl:w-[45%] aspect-square max-w-md lg:max-w-none bg-[url("https://i.postimg.cc/3xFQkvb1/image.png")] bg-center bg-cover rounded-lg overflow-hidden'>
      <FloatingIcons />
      <FloatingStats />
    </div>
  );
}