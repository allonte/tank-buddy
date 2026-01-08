import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { lookupDensity, calculateCorrectedDensity } from "@/lib/densityLookup";

interface ManualInputsProps {
  density: number;
  temperature: number;
  shellTemperature: number;
  height: number;
  pressure: number;
  onDensityChange: (value: number) => void;
  onTemperatureChange: (value: number) => void;
  onShellTemperatureChange: (value: number) => void;
  onHeightChange: (value: number) => void;
  onPressureChange: (value: number) => void;
  onCalculate: () => void;
  onReset: () => void;
  maxHeight: number;
}

const ManualInputs = ({
  density,
  temperature,
  shellTemperature,
  height,
  pressure,
  onDensityChange,
  onTemperatureChange,
  onShellTemperatureChange,
  onHeightChange,
  onPressureChange,
  onCalculate,
  onReset,
  maxHeight,
}: ManualInputsProps) => {
  const [showVCFTable, setShowVCFTable] = useState(false);
  const [vcfDialogOpen, setVcfDialogOpen] = useState(false);
  const [heightCapacityOpen, setHeightCapacityOpen] = useState(false);

  const handleNumberInput = (
    e: React.ChangeEvent<HTMLInputElement>,
    setter: (value: number) => void,
    min?: number,
    max?: number
  ) => {
    const value = parseFloat(e.target.value);
    if (!isNaN(value)) {
      let finalValue = value;
      if (min !== undefined) finalValue = Math.max(min, finalValue);
      if (max !== undefined) finalValue = Math.min(max, finalValue);
      setter(finalValue);
    }
  };

  // Generate VCF table data
  const generateVCFTable = () => {
    const temps = [0, 5, 10, 15, 20, 25, 30];
    const densities = [0.500, 0.520, 0.540, 0.560, 0.580, 0.590];
    return { temps, densities };
  };

  const { temps, densities } = generateVCFTable();

  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <h2 className="text-xl font-bold text-foreground mb-6">Manual Inputs</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        {/* Product Density */}
        <div className="space-y-2">
          <Label htmlFor="density" className="text-sm font-medium text-foreground">
            Product Density (kg/L)
          </Label>
          <Input
            id="density"
            type="number"
            value={density}
            onChange={(e) => handleNumberInput(e, onDensityChange, 0.500, 0.590)}
            step={0.001}
            className="bg-secondary border-border"
          />
        </div>

        {/* Product Temperature */}
        <div className="space-y-2">
          <Label htmlFor="productTemp" className="text-sm font-medium text-foreground">
            Product Temperature (°C)
          </Label>
          <Input
            id="productTemp"
            type="number"
            value={temperature}
            onChange={(e) => handleNumberInput(e, onTemperatureChange, 0, 30)}
            step={0.5}
            className="bg-secondary border-border"
          />
        </div>

        {/* Shell Temperature */}
        <div className="space-y-2">
          <Label htmlFor="shellTemp" className="text-sm font-medium text-foreground">
            Shell Temperature (°C)
          </Label>
          <Input
            id="shellTemp"
            type="number"
            value={shellTemperature}
            onChange={(e) => handleNumberInput(e, onShellTemperatureChange, 0, 50)}
            step={0.5}
            className="bg-secondary border-border"
          />
        </div>

        {/* Height */}
        <div className="space-y-2">
          <Label htmlFor="height" className="text-sm font-medium text-foreground">
            Height (mm)
          </Label>
          <Input
            id="height"
            type="number"
            value={height}
            onChange={(e) => handleNumberInput(e, onHeightChange, 0, maxHeight)}
            step={1}
            className="bg-secondary border-border"
          />
        </div>
      </div>

      {/* Pressure - Full width */}
      <div className="space-y-2 mb-6">
        <Label htmlFor="pressure" className="text-sm font-medium text-foreground">
          Pressure (bar)
        </Label>
        <Input
          id="pressure"
          type="number"
          value={pressure}
          onChange={(e) => handleNumberInput(e, onPressureChange, 0, 50)}
          step={0.1}
          className="bg-secondary border-border md:w-1/2"
        />
      </div>

      {/* VCF Table Toggle */}
      <div className="flex items-center gap-3 mb-6">
        <Switch
          checked={showVCFTable}
          onCheckedChange={(checked) => {
            setShowVCFTable(checked);
            if (checked) setVcfDialogOpen(true);
          }}
        />
        <Label className="text-sm text-foreground cursor-pointer">
          Show Product Temperature (VCF) table
        </Label>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3">
        <Button onClick={onCalculate} className="bg-primary hover:bg-primary/90 text-primary-foreground">
          Calculate
        </Button>
        <Button variant="secondary" onClick={onReset}>
          Reset
        </Button>
        <Button variant="outline" onClick={() => setVcfDialogOpen(true)}>
          Shell Correction Factors
        </Button>
        <Button variant="outline">
          Pressure Factors
        </Button>
        <Button variant="outline" onClick={() => setHeightCapacityOpen(true)}>
          Height↔Capacity Table
        </Button>
      </div>

      {/* VCF Table Dialog */}
      <Dialog open={vcfDialogOpen} onOpenChange={setVcfDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-auto">
          <DialogHeader>
            <DialogTitle>Volume Correction Factors (VCF)</DialogTitle>
          </DialogHeader>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-secondary">
                  <th className="border border-border p-2 text-left">Temp (°C)</th>
                  {densities.map((d) => (
                    <th key={d} className="border border-border p-2 text-center">
                      SG {d.toFixed(3)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {temps.map((t) => (
                  <tr key={t} className="hover:bg-muted/50">
                    <td className="border border-border p-2 font-medium">{t}°C</td>
                    {densities.map((d) => (
                      <td key={`${t}-${d}`} className="border border-border p-2 text-center font-mono">
                        {lookupDensity(t, d).toFixed(4)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </DialogContent>
      </Dialog>

      {/* Height-Capacity Dialog */}
      <Dialog open={heightCapacityOpen} onOpenChange={setHeightCapacityOpen}>
        <DialogContent className="max-w-md max-h-[80vh] overflow-auto">
          <DialogHeader>
            <DialogTitle>Height ↔ Capacity Table</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            Use the Height input above and click Calculate to look up the corresponding volume from the calibration table.
          </p>
          <div className="mt-4 p-4 bg-secondary rounded-lg">
            <p className="text-sm text-muted-foreground mb-1">Current Height</p>
            <p className="text-xl font-mono font-bold">{height} mm</p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ManualInputs;
