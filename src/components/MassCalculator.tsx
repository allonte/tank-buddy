import { Thermometer, Droplets, Scale } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { lookupDensity, calculateCorrectedDensity } from "@/lib/densityLookup";

interface MassCalculatorProps {
  volume: number;
  temperature: number;
  density: number;
  onTemperatureChange: (temp: number) => void;
  onDensityChange: (density: number) => void;
}

const MassCalculator = ({
  volume,
  temperature,
  density,
  onTemperatureChange,
  onDensityChange,
}: MassCalculatorProps) => {
  const correctionFactor = lookupDensity(temperature, density);
  const correctedDensity = calculateCorrectedDensity(density, temperature);
  const mass = volume * correctedDensity;

  const handleTemperatureInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    if (!isNaN(value)) {
      onTemperatureChange(Math.max(0, Math.min(30, value)));
    }
  };

  const handleDensityInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    if (!isNaN(value)) {
      onDensityChange(Math.max(0.500, Math.min(0.590, value)));
    }
  };

  return (
    <div className="glass-card p-6 space-y-5">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 rounded-lg bg-primary/20">
          <Scale className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-foreground">Mass Calculator</h3>
          <p className="text-sm text-muted-foreground">Calculate mass from volume</p>
        </div>
      </div>

      {/* Temperature Input */}
      <div className="space-y-2">
        <Label htmlFor="temperature" className="flex items-center gap-2 text-sm font-medium">
          <Thermometer className="w-4 h-4 text-muted-foreground" />
          Temperature (°C)
        </Label>
        <Input
          id="temperature"
          type="number"
          value={temperature}
          onChange={handleTemperatureInput}
          min={0}
          max={30}
          step={0.5}
          className="font-mono"
        />
        <p className="text-xs text-muted-foreground">Range: 0°C - 30°C</p>
      </div>

      {/* Density Input */}
      <div className="space-y-2">
        <Label htmlFor="density" className="flex items-center gap-2 text-sm font-medium">
          <Droplets className="w-4 h-4 text-muted-foreground" />
          Specific Gravity @ 60°F
        </Label>
        <Input
          id="density"
          type="number"
          value={density}
          onChange={handleDensityInput}
          min={0.500}
          max={0.590}
          step={0.001}
          className="font-mono"
        />
        <p className="text-xs text-muted-foreground">Range: 0.500 - 0.590</p>
      </div>

      {/* Calculation Results */}
      <div className="grid grid-cols-2 gap-3 pt-4 border-t border-border/50">
        <div className="text-center p-3 rounded-lg bg-secondary/50">
          <p className="text-xs text-muted-foreground mb-1">Correction Factor</p>
          <p className="text-lg font-mono font-bold text-foreground">{correctionFactor.toFixed(4)}</p>
        </div>
        <div className="text-center p-3 rounded-lg bg-secondary/50">
          <p className="text-xs text-muted-foreground mb-1">Corrected Density</p>
          <p className="text-lg font-mono font-bold text-foreground">{correctedDensity.toFixed(4)} kg/L</p>
        </div>
      </div>

      {/* Mass Result */}
      <div className="text-center p-4 rounded-lg bg-primary/10 border border-primary/20">
        <p className="text-sm text-muted-foreground mb-1">Calculated Mass</p>
        <p className="text-2xl font-mono font-bold text-primary">
          {mass.toLocaleString(undefined, { maximumFractionDigits: 1 })} kg
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          {volume.toLocaleString()} L × {correctedDensity.toFixed(4)} kg/L
        </p>
      </div>
    </div>
  );
};

export default MassCalculator;
