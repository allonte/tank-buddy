import { useState, useEffect } from "react";

interface TankVisualizationProps {
  level: number;
  capacity: number;
  unit?: string;
  mass?: number;
}

const TankVisualization = ({ level, capacity, unit = "L", mass }: TankVisualizationProps) => {
  const [animatedLevel, setAnimatedLevel] = useState(0);
  const percentage = (level / capacity) * 100;

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedLevel(percentage);
    }, 300);
    return () => clearTimeout(timer);
  }, [percentage]);

  const getLiquidColor = () => {
    if (percentage <= 10) return "hsl(0, 72%, 51%)"; // Red/danger
    if (percentage <= 25) return "hsl(38, 92%, 50%)"; // Amber/warning
    return "hsl(225, 55%, 45%)"; // Murban blue
  };

  const getGlowColor = () => {
    if (percentage <= 10) return "shadow-[0_0_60px_hsl(0_72%_51%/0.4)]";
    if (percentage <= 25) return "shadow-[0_0_60px_hsl(38_92%_50%/0.4)]";
    return "shadow-[0_0_60px_hsl(225_55%_45%/0.3)]";
  };

  // SVG dimensions
  const width = 400;
  const height = 160;
  const tankHeight = 100;
  const tankWidth = 300;
  const hemisphereRadius = tankHeight / 2;
  const cylinderWidth = tankWidth - tankHeight; // Subtract both hemispheres

  // Calculate fill from bottom based on percentage
  const fillHeight = (animatedLevel / 100) * tankHeight;
  const fillY = height / 2 + hemisphereRadius - fillHeight;

  return (
    <div className="flex flex-col items-center gap-6">
      {/* 2D Bullet Tank SVG */}
      <div className={`relative w-full flex justify-center rounded-xl overflow-hidden ${getGlowColor()} p-6 bg-muted/30`}>
        <svg
          width={width}
          height={height}
          viewBox={`0 0 ${width} ${height}`}
          className="drop-shadow-lg"
        >
          {/* Define clip path for the bullet tank shape */}
          <defs>
            <clipPath id="tankShape">
              {/* Left hemisphere */}
              <circle cx={50 + hemisphereRadius} cy={height / 2} r={hemisphereRadius} />
              {/* Center cylinder */}
              <rect x={50 + hemisphereRadius} y={height / 2 - hemisphereRadius} width={cylinderWidth} height={tankHeight} />
              {/* Right hemisphere */}
              <circle cx={50 + hemisphereRadius + cylinderWidth} cy={height / 2} r={hemisphereRadius} />
            </clipPath>
            
            {/* Gradient for liquid - from bottom to top */}
            <linearGradient id="liquidGradient" x1="0%" y1="100%" x2="0%" y2="0%">
              <stop offset="0%" stopColor={getLiquidColor()} stopOpacity="1" />
              <stop offset="100%" stopColor={getLiquidColor()} stopOpacity="0.8" />
            </linearGradient>

            {/* Tank body gradient */}
            <linearGradient id="tankGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="hsl(220, 15%, 95%)" />
              <stop offset="50%" stopColor="hsl(220, 15%, 90%)" />
              <stop offset="100%" stopColor="hsl(220, 15%, 85%)" />
            </linearGradient>
          </defs>

          {/* Tank body background */}
          <g clipPath="url(#tankShape)">
            <rect x="0" y="0" width={width} height={height} fill="url(#tankGradient)" />
          </g>

          {/* Liquid fill - from bottom */}
          <g clipPath="url(#tankShape)">
            <rect
              x="0"
              y={fillY}
              width={width}
              height={fillHeight}
              fill="url(#liquidGradient)"
              style={{ transition: "y 0.5s ease-out, height 0.5s ease-out" }}
            />
          </g>

          {/* Tank outline */}
          {/* Left hemisphere outline */}
          <path
            d={`M ${50 + hemisphereRadius} ${height / 2 - hemisphereRadius} 
                A ${hemisphereRadius} ${hemisphereRadius} 0 0 0 ${50 + hemisphereRadius} ${height / 2 + hemisphereRadius}`}
            fill="none"
            stroke="hsl(0, 72%, 35%)"
            strokeWidth="3"
          />
          {/* Top line */}
          <line
            x1={50 + hemisphereRadius}
            y1={height / 2 - hemisphereRadius}
            x2={50 + hemisphereRadius + cylinderWidth}
            y2={height / 2 - hemisphereRadius}
            stroke="hsl(0, 72%, 35%)"
            strokeWidth="3"
          />
          {/* Right hemisphere outline */}
          <path
            d={`M ${50 + hemisphereRadius + cylinderWidth} ${height / 2 - hemisphereRadius} 
                A ${hemisphereRadius} ${hemisphereRadius} 0 0 1 ${50 + hemisphereRadius + cylinderWidth} ${height / 2 + hemisphereRadius}`}
            fill="none"
            stroke="hsl(0, 72%, 35%)"
            strokeWidth="3"
          />
          {/* Bottom line */}
          <line
            x1={50 + hemisphereRadius}
            y1={height / 2 + hemisphereRadius}
            x2={50 + hemisphereRadius + cylinderWidth}
            y2={height / 2 + hemisphereRadius}
            stroke="hsl(0, 72%, 35%)"
            strokeWidth="3"
          />

          {/* Support legs */}
          <rect x="120" y={height / 2 + hemisphereRadius} width="20" height="25" fill="hsl(220, 15%, 30%)" rx="2" />
          <rect x="260" y={height / 2 + hemisphereRadius} width="20" height="25" fill="hsl(220, 15%, 30%)" rx="2" />

          {/* Top valve */}
          <rect x="195" y={height / 2 - hemisphereRadius - 20} width="10" height="20" fill="hsl(220, 15%, 30%)" rx="1" />
          <circle cx="200" cy={height / 2 - hemisphereRadius - 25} r="8" fill="hsl(0, 72%, 35%)" />
        </svg>
      </div>

      {/* Level indicators */}
      <div className="flex items-center gap-6 flex-wrap justify-center">
        <div className="text-center">
          <p className="text-muted-foreground text-sm font-medium mb-1">Current Level</p>
          <p className="text-3xl font-bold gradient-text font-mono">
            {animatedLevel.toFixed(1)}%
          </p>
        </div>
        <div className="w-px h-12 bg-border" />
        <div className="text-center">
          <p className="text-muted-foreground text-sm font-medium mb-1">Volume</p>
          <p className="text-3xl font-bold text-foreground font-mono">
            {level.toLocaleString()} <span className="text-lg text-muted-foreground">{unit}</span>
          </p>
        </div>
        {mass !== undefined && (
          <>
            <div className="w-px h-12 bg-border" />
            <div className="text-center">
              <p className="text-muted-foreground text-sm font-medium mb-1">Mass</p>
              <p className="text-3xl font-bold text-primary font-mono">
                {mass.toLocaleString(undefined, { maximumFractionDigits: 1 })} <span className="text-lg text-muted-foreground">kg</span>
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default TankVisualization;
