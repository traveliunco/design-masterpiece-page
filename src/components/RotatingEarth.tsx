import { cn } from "@/lib/utils";

export const RotatingEarth = ({ className }: { className?: string }) => {
  return (
    <div className={cn("relative w-full h-full overflow-hidden", className)}>
      {/* Space Background */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-40 z-0"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?q=80&w=2000')" }}
      />
      
      {/* Earth Container - Centered */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] md:w-[1000px] md:h-[1000px] z-10 opacity-90 transition-all duration-1000">
        <div className="relative w-full h-full rounded-full overflow-hidden shadow-[0_0_100px_rgba(0,100,255,0.3)]">
          {/* Rotating Texture */}
          <div 
            className="absolute inset-0 animate-earth-rotate"
            style={{ 
              backgroundImage: "url('https://upload.wikimedia.org/wikipedia/commons/thumb/2/23/Blue_Marble_2002.png/2000px-Blue_Marble_2002.png')",
              backgroundSize: '200% 100%', // 200% width allows scrolling through twice (seamless) if image is repetitive or just scroll once 0 to 200%? 
              // If image is 2:1 ratio (equirectangular), to wrap we need seamless. Blue Marble 2002 is 2:1.
              // To loop seamless, we need two copies or css repeat. background-repeat: repeat-x handles it.
              backgroundRepeat: 'repeat-x'
            }}
          />
          
          {/* Atmosphere / Gloss Overlay */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-black/80 via-transparent to-white/10 pointer-events-none" />
          
          {/* Inner Shadow for 3D Sphere Effect */}
          <div className="absolute inset-0 rounded-full shadow-[inset_-50px_-20px_100px_rgba(0,0,0,0.9),inset_20px_10px_50px_rgba(255,255,255,0.1)] pointer-events-none" />
        </div>
      </div>
    </div>
  );
};
