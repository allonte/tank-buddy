import { useState, useEffect } from "react";
import { Slider } from "@/components/ui/slider";

interface TankVisualizationProps {
  level: number;
  capacity: number;
  unit?: string;
  mass?: number;
  maxHeight?: number;
  currentHeight?: number;
  onHeightChange?: (height: number) => void;
}

const TankVisualization = ({ 
  level, 
  capacity, 
  unit = "L", 
  mass,
  maxHeight = 2237,
  currentHeight = 0,
  onHeightChange 
}: TankVisualizationProps) => {
  const [animatedLevel, setAnimatedLevel] = useState(0);
  
  // Calculate percentage based on height position (0 to maxHeight = 0 to 100%)
  const percentage = maxHeight > 0 ? (currentHeight / maxHeight) * 100 : 0;

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedLevel(percentage);
    }, 300);
    return () => clearTimeout(timer);
  }, [percentage]);

  const handleSliderChange = (value: number[]) => {
    if (onHeightChange) {
      // Convert slider percentage to height in mm
      const newHeight = Math.round((value[0] / 100) * maxHeight);
      onHeightChange(newHeight);
    }
  };

  // Calculate slider value from current height
  const sliderValue = maxHeight > 0 ? (currentHeight / maxHeight) * 100 : 0;

  // SVG dimensions - wider to fill screen
  const width = 600;
  const height = 200;
  const tankHeight = 120;
  const tankWidth = 500;
  const hemisphereRadius = tankHeight / 2;
  const cylinderWidth = tankWidth - tankHeight;

  // Calculate fill from bottom based on percentage
  const fillHeight = (animatedLevel / 100) * tankHeight;
  const tankCenterY = 90;
  const fillY = tankCenterY + hemisphereRadius - fillHeight;

  return (
    <div className="flex flex-col items-center gap-4 w-full">
      {/* Tank SVG with white background */}
      <div className="relative w-full flex justify-center rounded-xl overflow-hidden p-4 bg-white border border-border">
        {/* Percentage and capacity badge */}
        <div className="absolute top-3 right-3 bg-white border border-border rounded-lg px-3 py-2 shadow-sm z-10">
          <p className="text-lg font-bold text-foreground">{animatedLevel.toFixed(1)}%</p>
          <p className="text-xs text-muted-foreground">Cap: {level.toLocaleString()} {unit}</p>
        </div>

        <svg
          width="100%"
          height={height}
          viewBox={`0 0 ${width} ${height}`}
          className="drop-shadow-sm max-w-full"
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            {/* Clip path for the bullet tank shape */}
            <clipPath id="tankShape">
              <circle cx={50 + hemisphereRadius} cy={tankCenterY} r={hemisphereRadius} />
              <rect x={50 + hemisphereRadius} y={tankCenterY - hemisphereRadius} width={cylinderWidth} height={tankHeight} />
              <circle cx={50 + hemisphereRadius + cylinderWidth} cy={tankCenterY} r={hemisphereRadius} />
            </clipPath>
            
            {/* Gradient for liquid - green */}
            <linearGradient id="liquidGradient" x1="0%" y1="100%" x2="0%" y2="0%">
              <stop offset="0%" stopColor="hsl(142, 76%, 36%)" stopOpacity="0.95" />
              <stop offset="50%" stopColor="hsl(142, 70%, 45%)" stopOpacity="0.85" />
              <stop offset="100%" stopColor="hsl(142, 65%, 50%)" stopOpacity="0.75" />
            </linearGradient>

            {/* Tank body gradient - realistic metallic gray */}
            <linearGradient id="tankGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="hsl(220, 14%, 96%)" />
              <stop offset="25%" stopColor="hsl(220, 12%, 92%)" />
              <stop offset="50%" stopColor="hsl(220, 10%, 88%)" />
              <stop offset="75%" stopColor="hsl(220, 12%, 85%)" />
              <stop offset="100%" stopColor="hsl(220, 10%, 82%)" />
            </linearGradient>

            {/* Highlight gradient for 3D effect */}
            <linearGradient id="highlightGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="white" stopOpacity="0.4" />
              <stop offset="30%" stopColor="white" stopOpacity="0.1" />
              <stop offset="100%" stopColor="white" stopOpacity="0" />
            </linearGradient>

            {/* Platform gradient */}
            <linearGradient id="platformGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="hsl(220, 15%, 55%)" />
              <stop offset="100%" stopColor="hsl(220, 15%, 45%)" />
            </linearGradient>
          </defs>

          {/* Tank body background */}
          <g clipPath="url(#tankShape)">
            <rect x="0" y="0" width={width} height={height} fill="url(#tankGradient)" />
            {/* Top highlight for 3D effect */}
            <ellipse 
              cx={width / 2} 
              cy={tankCenterY - hemisphereRadius + 15} 
              rx={cylinderWidth / 2 + 20} 
              ry="20" 
              fill="url(#highlightGradient)" 
            />
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
            {/* Liquid surface highlight */}
            {fillHeight > 5 && (
              <line
                x1={60}
                y1={fillY + 2}
                x2={width - 60}
                y2={fillY + 2}
                stroke="hsl(142, 60%, 60%)"
                strokeWidth="2"
                strokeOpacity="0.5"
                style={{ transition: "y 0.5s ease-out" }}
              />
            )}
          </g>

          {/* Tank outline - subtle gray */}
          <path
            d={`M ${50 + hemisphereRadius} ${tankCenterY - hemisphereRadius} 
                A ${hemisphereRadius} ${hemisphereRadius} 0 0 0 ${50 + hemisphereRadius} ${tankCenterY + hemisphereRadius}`}
            fill="none"
            stroke="hsl(220, 15%, 70%)"
            strokeWidth="2.5"
          />
          <line
            x1={50 + hemisphereRadius}
            y1={tankCenterY - hemisphereRadius}
            x2={50 + hemisphereRadius + cylinderWidth}
            y2={tankCenterY - hemisphereRadius}
            stroke="hsl(220, 15%, 70%)"
            strokeWidth="2.5"
          />
          <path
            d={`M ${50 + hemisphereRadius + cylinderWidth} ${tankCenterY - hemisphereRadius} 
                A ${hemisphereRadius} ${hemisphereRadius} 0 0 1 ${50 + hemisphereRadius + cylinderWidth} ${tankCenterY + hemisphereRadius}`}
            fill="none"
            stroke="hsl(220, 15%, 70%)"
            strokeWidth="2.5"
          />
          <line
            x1={50 + hemisphereRadius}
            y1={tankCenterY + hemisphereRadius}
            x2={50 + hemisphereRadius + cylinderWidth}
            y2={tankCenterY + hemisphereRadius}
            stroke="hsl(220, 15%, 70%)"
            strokeWidth="2.5"
          />

          {/* Top valves/nozzles */}
          <circle cx="180" cy={tankCenterY - hemisphereRadius - 5} r="5" fill="hsl(220, 15%, 60%)" />
          <circle cx="300" cy={tankCenterY - hemisphereRadius - 5} r="5" fill="hsl(220, 15%, 60%)" />
          <circle cx="420" cy={tankCenterY - hemisphereRadius - 5} r="5" fill="hsl(220, 15%, 60%)" />

          {/* Support platform - more realistic */}
          <rect 
            x="30" 
            y={tankCenterY + hemisphereRadius + 5} 
            width={width - 60} 
            height="12" 
            fill="url(#platformGradient)" 
            rx="2" 
          />
          
          {/* Support legs */}
          <rect x="100" y={tankCenterY + hemisphereRadius + 17} width="20" height="25" fill="hsl(220, 15%, 50%)" rx="2" />
          <rect x="480" y={tankCenterY + hemisphereRadius + 17} width="20" height="25" fill="hsl(220, 15%, 50%)" rx="2" />
        </svg>
      </div>

      {/* Slider gauge with labels */}
      <div className="w-full px-2">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-foreground">Fill Level: {animatedLevel.toFixed(1)}%</span>
          <span className="text-sm text-muted-foreground">
            Height: {currentHeight} mm • Volume: {level.toLocaleString()} {unit}
          </span>
        </div>
        <Slider
          value={[sliderValue]}
          onValueChange={handleSliderChange}
          max={100}
          step={0.1}
          className="w-full"
        />
        <div className="flex justify-between mt-1 text-xs text-muted-foreground">
          <span>0 mm</span>
          <span>{maxHeight} mm</span>
        </div>
      </div>
    </div>
  );
};

export default TankVisualization;
