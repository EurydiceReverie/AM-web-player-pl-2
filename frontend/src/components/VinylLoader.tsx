import { cn } from "@/lib/utils";

interface VinylLoaderProps {
  albumCover?: string;
  size?: "sm" | "md" | "lg";
}

export function VinylLoader({ albumCover, size = "md" }: VinylLoaderProps) {
  const sizeClasses = {
    sm: "w-24 h-24",
    md: "w-48 h-48",
    lg: "w-64 h-64"
  };

  return (
    <div className={cn("relative flex flex-col items-center gap-6", sizeClasses[size])}>
      {/* Vinyl disc with grooves */}
      <div className="absolute inset-0" style={{ animation: "spin 3s linear infinite" }}>
        <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-2xl">
          {/* Outer vinyl disc */}
          <defs>
            <radialGradient id="vinylGradient" cx="50%" cy="50%">
              <stop offset="0%" stopColor="#1a1a1a" />
              <stop offset="40%" stopColor="#0a0a0a" />
              <stop offset="60%" stopColor="#1a1a1a" />
              <stop offset="80%" stopColor="#0a0a0a" />
              <stop offset="100%" stopColor="#000000" />
            </radialGradient>
            
            <clipPath id="albumClip">
              <circle cx="100" cy="100" r="95" />
            </clipPath>
          </defs>
          
          {/* Album artwork filling entire disc */}
          {albumCover ? (
            <image
              href={albumCover}
              x="5"
              y="5"
              width="190"
              height="190"
              clipPath="url(#albumClip)"
              preserveAspectRatio="xMidYMid slice"
            />
          ) : (
            <circle cx="100" cy="100" r="95" fill="url(#vinylGradient)" />
          )}
          
          {/* Grooves overlay */}
          {[...Array(20)].map((_, i) => (
            <circle
              key={i}
              cx="100"
              cy="100"
              r={95 - (i * 3.5)}
              fill="none"
              stroke="#000000"
              strokeWidth="0.5"
              opacity={0.15 + (i % 2) * 0.1}
            />
          ))}
          
          {/* Outer edge border */}
          <circle cx="100" cy="100" r="96" fill="none" stroke="#000000" strokeWidth="2" opacity="0.8" />
          <circle cx="100" cy="100" r="95" fill="none" stroke="#ffffff" strokeWidth="1" opacity="0.2" />
          
          {/* Center label area */}
          <circle cx="100" cy="100" r="25" fill="#000000" opacity="0.9" />
          <circle cx="100" cy="100" r="25" fill="none" stroke="#ffffff" strokeWidth="2" opacity="0.4" />
          
          {/* Center hole with thick border */}
          <circle cx="100" cy="100" r="9" fill="#000000" />
          <circle cx="100" cy="100" r="8" fill="#0a0a0a" stroke="#ffffff" strokeWidth="1.5" opacity="0.3" />
          
          {/* Inner shine */}
          <path
            d="M 100,5 A 95,95 0 0,1 195,100"
            fill="none"
            stroke="#ffffff"
            strokeWidth="3"
            opacity="0.1"
          />
        </svg>
      </div>
      
      {/* Loading text below the vinyl */}
      <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 translate-y-full mt-2">
        <div className="text-sm font-medium text-white/60 animate-pulse whitespace-nowrap">
          Loading your music...
        </div>
      </div>
    </div>
  );
}
