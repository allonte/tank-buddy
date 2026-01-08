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

  const getLiquidColor = () => {
    return "hsl(142, 76%, 36%)"; // Green
  };

  // SVG dimensions
  const width = 500;
  const height = 180;
  const tankHeight = 100;
  const tankWidth = 400;
  const hemisphereRadius = tankHeight / 2;
  const cylinderWidth = tankWidth - tankHeight;

  // Calculate fill from bottom based on percentage
  const fillHeight = (animatedLevel / 100) * tankHeight;
  const fillY = height / 2 + hemisphereRadius - fillHeight - 15;

  const handleSliderChange = (value: number[]) => {
    if (onHeightChange) {
      // Convert slider percentage to height in mm
      const newHeight = Math.round((value[0] / 100) * maxHeight);
      onHeightChange(newHeight);
    }
  };

  // Calculate slider value from current height
  const sliderValue = maxHeight > 0 ? (currentHeight / maxHeight) * 100 : 0;

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Tank SVG with white background */}
      <div className="relative w-full flex justify-center rounded-xl overflow-hidden p-6 bg-white border border-border">
        {/* Percentage and capacity badge */}
        <div className="absolute top-4 right-4 bg-white border border-border rounded-lg px-3 py-2 shadow-sm z-10">
          <p className="text-lg font-bold text-foreground">{animatedLevel.toFixed(1)}%</p>
          <p className="text-xs text-muted-foreground">Cap: {level.toLocaleString()} {unit}</p>
        </div>

        <svg
          width={width}
          height={height}
          viewBox={`0 0 ${width} ${height}`}
          className="drop-shadow-sm"
        >
          {/* Define clip path for the bullet tank shape */}
          <defs>
            <clipPath id="tankShape">
              <circle cx={50 + hemisphereRadius} cy={height / 2 - 15} r={hemisphereRadius} />
              <rect x={50 + hemisphereRadius} y={height / 2 - hemisphereRadius - 15} width={cylinderWidth} height={tankHeight} />
              <circle cx={50 + hemisphereRadius + cylinderWidth} cy={height / 2 - 15} r={hemisphereRadius} />
            </clipPath>
            
            {/* Gradient for liquid */}
            <linearGradient id="liquidGradient" x1="0%" y1="100%" x2="0%" y2="0%">
              <stop offset="0%" stopColor={getLiquidColor()} stopOpacity="0.9" />
              <stop offset="100%" stopColor={getLiquidColor()} stopOpacity="0.7" />
            </linearGradient>

            {/* Tank body gradient - light gray */}
            <linearGradient id="tankGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="hsl(210, 20%, 96%)" />
              <stop offset="50%" stopColor="hsl(210, 15%, 92%)" />
              <stop offset="100%" stopColor="hsl(210, 15%, 88%)" />
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

          {/* Tank outline - subtle gray */}
          <path
            d={`M ${50 + hemisphereRadius} ${height / 2 - hemisphereRadius - 15} 
                A ${hemisphereRadius} ${hemisphereRadius} 0 0 0 ${50 + hemisphereRadius} ${height / 2 + hemisphereRadius - 15}`}
            fill="none"
            stroke="hsl(210, 15%, 75%)"
            strokeWidth="2"
          />
          <line
            x1={50 + hemisphereRadius}
            y1={height / 2 - hemisphereRadius - 15}
            x2={50 + hemisphereRadius + cylinderWidth}
            y2={height / 2 - hemisphereRadius - 15}
            stroke="hsl(210, 15%, 75%)"
            strokeWidth="2"
          />
          <path
            d={`M ${50 + hemisphereRadius + cylinderWidth} ${height / 2 - hemisphereRadius - 15} 
                A ${hemisphereRadius} ${hemisphereRadius} 0 0 1 ${50 + hemisphereRadius + cylinderWidth} ${height / 2 + hemisphereRadius - 15}`}
            fill="none"
            stroke="hsl(210, 15%, 75%)"
            strokeWidth="2"
          />
          <line
            x1={50 + hemisphereRadius}
            y1={height / 2 + hemisphereRadius - 15}
            x2={50 + hemisphereRadius + cylinderWidth}
            y2={height / 2 + hemisphereRadius - 15}
            stroke="hsl(210, 15%, 75%)"
            strokeWidth="2"
          />

          {/* Top valves */}
          <circle cx="150" cy={height / 2 - hemisphereRadius - 20} r="4" fill="hsl(210, 15%, 70%)" />
          <circle cx="250" cy={height / 2 - hemisphereRadius - 20} r="4" fill="hsl(210, 15%, 70%)" />
          <circle cx="350" cy={height / 2 - hemisphereRadius - 20} r="4" fill="hsl(210, 15%, 70%)" />

          {/* Support platform */}
          <rect x="40" y={height / 2 + hemisphereRadius - 10} width={420} height="8" fill="hsl(210, 15%, 60%)" rx="2" />
          
          {/* Support legs */}
          <rect x="100" y={height / 2 + hemisphereRadius - 2} width="15" height="20" fill="hsl(210, 15%, 55%)" rx="1" />
          <rect x="385" y={height / 2 + hemisphereRadius - 2} width="15" height="20" fill="hsl(210, 15%, 55%)" rx="1" />
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

      {/* Mass display if available */}
      {mass !== undefined && (
        <div className="text-center pt-2">
          <p className="text-sm text-muted-foreground">Mass</p>
          <p className="text-2xl font-bold text-primary font-mono">
            {mass.toLocaleString(undefined, { maximumFractionDigits: 1 })} <span className="text-sm text-muted-foreground">kg</span>
          </p>
        </div>
      )}
    </div>
  );
};

export default TankVisualization;
