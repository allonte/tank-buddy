import { useState } from "react";
import { Thermometer, Droplets, Scale } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { lookupDensity, calculateCorrectedDensity, TEMPERATURES, SPECIFIC_GRAVITY_VALUES } from "@/lib/densityLookup";

interface DensityCalculatorProps {
  onDensityChange?: (density: number) => void;
}

const DensityCalculator = ({ onDensityChange }: DensityCalculatorProps) => {
  const [temperature, setTemperature] = useState(20.0);
  const [specificGravity, setSpecificGravity] = useState(0.540);

  const correctionFactor = lookupDensity(temperature, specificGravity);
  const correctedDensity = calculateCorrectedDensity(specificGravity, temperature);

  const handleTemperatureChange = (value: number[]) => {
    const newTemp = value[0];
    setTemperature(newTemp);
    onDensityChange?.(calculateCorrectedDensity(specificGravity, newTemp));
  };

  const handleSGChange = (value: number[]) => {
    const newSG = value[0];
    setSpecificGravity(newSG);
    onDensityChange?.(calculateCorrectedDensity(newSG, temperature));
  };

  return (
    <div className="glass-card p-6 space-y-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 rounded-lg bg-primary/20">
          <Scale className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-foreground">Density Calculator</h3>
          <p className="text-sm text-muted-foreground">LPG Density Correction Table</p>
        </div>
      </div>

      {/* Temperature Slider */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Thermometer className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-medium text-foreground">Temperature</span>
          </div>
          <span className="text-lg font-mono font-bold text-primary">{temperature.toFixed(1)}°C</span>
        </div>
        <Slider
          value={[temperature]}
          onValueChange={handleTemperatureChange}
          min={0}
          max={30.0}
          step={0.5}
          className="w-full"
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>0°C</span>
          <span>30.0°C</span>
        </div>
      </div>

      {/* Specific Gravity Slider */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Droplets className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-medium text-foreground">Specific Gravity @ 60°F</span>
          </div>
          <span className="text-lg font-mono font-bold text-primary">{specificGravity.toFixed(3)}</span>
        </div>
        <Slider
          value={[specificGravity]}
          onValueChange={handleSGChange}
          min={0.500}
          max={0.590}
          step={0.010}
          className="w-full"
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>0.500</span>
          <span>0.590</span>
        </div>
      </div>

      {/* Results */}
      <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border/50">
        <div className="text-center p-3 rounded-lg bg-secondary/50">
          <p className="text-xs text-muted-foreground mb-1">Correction Factor</p>
          <p className="text-xl font-mono font-bold text-foreground">{correctionFactor.toFixed(3)}</p>
        </div>
        <div className="text-center p-3 rounded-lg bg-primary/10 border border-primary/20">
          <p className="text-xs text-muted-foreground mb-1">Corrected Density</p>
          <p className="text-xl font-mono font-bold text-primary">{correctedDensity.toFixed(3)}</p>
          <p className="text-xs text-muted-foreground">kg/L</p>
        </div>
      </div>
    </div>
  );
};

export default DensityCalculator;
