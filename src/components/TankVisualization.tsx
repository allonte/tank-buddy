import { useState, useEffect } from "react";

interface TankVisualizationProps {
  level: number;
  capacity: number;
  unit?: string;
}

const TankVisualization = ({ level, capacity, unit = "L" }: TankVisualizationProps) => {
  const [animatedLevel, setAnimatedLevel] = useState(0);
  const percentage = (level / capacity) * 100;

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedLevel(percentage);
    }, 300);
    return () => clearTimeout(timer);
  }, [percentage]);

  const getStatusColor = () => {
    if (percentage <= 10) return "bg-danger";
    if (percentage <= 25) return "bg-warning";
    return "bg-tank-liquid";
  };

  const getGlowColor = () => {
    if (percentage <= 10) return "shadow-[0_0_60px_hsl(0_72%_51%/0.4)]";
    if (percentage <= 25) return "shadow-[0_0_60px_hsl(38_92%_50%/0.4)]";
    return "shadow-[0_0_60px_hsl(200_85%_50%/0.3)]";
  };

  return (
    <div className="flex flex-col items-center gap-6">
      {/* Bullet Tank SVG */}
      <div className={`relative transition-all duration-700 ${getGlowColor()}`}>
        <svg
          viewBox="0 0 400 160"
          className="w-full max-w-md h-auto"
          style={{ filter: "drop-shadow(0 10px 30px rgba(0,0,0,0.5))" }}
        >
          {/* Tank body - horizontal bullet shape */}
          <defs>
            <linearGradient id="tankGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="hsl(222 30% 25%)" />
              <stop offset="50%" stopColor="hsl(222 30% 18%)" />
              <stop offset="100%" stopColor="hsl(222 30% 12%)" />
            </linearGradient>
            <linearGradient id="liquidGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="hsl(200 85% 60%)" />
              <stop offset="50%" stopColor="hsl(200 75% 45%)" />
              <stop offset="100%" stopColor="hsl(200 65% 35%)" />
            </linearGradient>
            <linearGradient id="warningGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="hsl(38 92% 60%)" />
              <stop offset="100%" stopColor="hsl(38 92% 40%)" />
            </linearGradient>
            <linearGradient id="dangerGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="hsl(0 72% 60%)" />
              <stop offset="100%" stopColor="hsl(0 72% 40%)" />
            </linearGradient>
            <clipPath id="tankClip">
              <ellipse cx="50" cy="80" rx="30" ry="55" />
              <rect x="50" y="25" width="300" height="110" />
              <ellipse cx="350" cy="80" rx="30" ry="55" />
            </clipPath>
          </defs>

          {/* Tank outline */}
          <g clipPath="url(#tankClip)">
            <rect x="0" y="0" width="400" height="160" fill="url(#tankGradient)" />
            
            {/* Liquid fill - animated from bottom */}
            <rect
              x="0"
              y={160 - (animatedLevel / 100) * 130 - 15}
              width="400"
              height={(animatedLevel / 100) * 130 + 15}
              fill={
                percentage <= 10
                  ? "url(#dangerGradient)"
                  : percentage <= 25
                  ? "url(#warningGradient)"
                  : "url(#liquidGradient)"
              }
              className="transition-all duration-1000 ease-out"
            />

            {/* Wave effect on top of liquid */}
            <ellipse
              cx="200"
              cy={160 - (animatedLevel / 100) * 130 - 15}
              rx="180"
              ry="8"
              fill={
                percentage <= 10
                  ? "hsl(0 72% 65%)"
                  : percentage <= 25
                  ? "hsl(38 92% 65%)"
                  : "hsl(200 85% 65%)"
              }
              className="animate-liquid-wave origin-center"
              style={{ opacity: 0.6 }}
            />
          </g>

          {/* Tank border */}
          <ellipse cx="50" cy="80" rx="30" ry="55" fill="none" stroke="hsl(38 92% 55%)" strokeWidth="2" />
          <rect x="50" y="25" width="300" height="110" fill="none" stroke="hsl(38 92% 55%)" strokeWidth="2" />
          <ellipse cx="350" cy="80" rx="30" ry="55" fill="none" stroke="hsl(38 92% 55%)" strokeWidth="2" />

          {/* Legs */}
          <rect x="80" y="135" width="20" height="25" rx="3" fill="hsl(222 25% 22%)" stroke="hsl(38 92% 55%)" strokeWidth="1" />
          <rect x="300" y="135" width="20" height="25" rx="3" fill="hsl(222 25% 22%)" stroke="hsl(38 92% 55%)" strokeWidth="1" />

          {/* Top valve */}
          <rect x="190" y="10" width="20" height="20" rx="2" fill="hsl(222 25% 22%)" stroke="hsl(38 92% 55%)" strokeWidth="1" />
          <circle cx="200" cy="8" r="6" fill="hsl(38 92% 55%)" />
        </svg>
      </div>

      {/* Level indicators */}
      <div className="flex items-center gap-8">
        <div className="text-center">
          <p className="text-muted-foreground text-sm font-medium mb-1">Current Level</p>
          <p className="text-4xl font-bold gradient-text font-mono">
            {animatedLevel.toFixed(1)}%
          </p>
        </div>
        <div className="w-px h-12 bg-border" />
        <div className="text-center">
          <p className="text-muted-foreground text-sm font-medium mb-1">Volume</p>
          <p className="text-4xl font-bold text-foreground font-mono">
            {level.toLocaleString()} <span className="text-xl text-muted-foreground">{unit}</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default TankVisualization;
