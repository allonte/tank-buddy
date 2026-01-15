import { useState, useMemo, useEffect } from "react";
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
import { lookupDensity, COMBINED_TABLE, SPECIFIC_GRAVITY_VALUES } from "@/lib/densityLookup";
import { CAPACITY_TABLE } from "@/lib/capacityLookup";
import { TANK2_CAPACITY_TABLE } from "@/lib/tank230CapacityLookup";
import { SCF_TABLE } from "@/lib/scfLookup";
import { PCF_TABLE } from "@/lib/pcfLookup";

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
  selectedTankId: string;
}

/**
 * Hook to manage a numeric input with local raw string state, min/max clamping,
 * and optional validator that checks final values against reference tables.
 *
 * validator: (n:number) => { valid: boolean, message?: string }
 */
function useNumberInput(
  value: number,
  onChangeNumber: (v: number) => void,
  min?: number,
  max?: number,
  validator?: (n: number) => { valid: boolean; message?: string }
) {
  const [raw, setRaw] = useState<string>(String(value));

  // keep raw in sync with external numeric changes
  useEffect(() => {
    setRaw(String(value));
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const s = e.target.value;
    setRaw(s);

    // allow intermediate states
    if (s === "" || s === "-") return;

    const n = Number(s);
    if (!Number.isNaN(n)) {
      let clamped = n;
      if (min !== undefined) clamped = Math.max(min, clamped);
      if (max !== undefined) clamped = Math.min(max, clamped);

      // only call parent if validator accepts it (or no validator provided)
      if (validator) {
        const res = validator(clamped);
        if (res.valid) onChangeNumber(clamped);
      } else {
        onChangeNumber(clamped);
      }
    }
  };

  const handleBlur = () => {
    // If user left an intermediate state, reset to parent's numeric value
    if (raw === "" || raw === "-") {
      setRaw(String(value));
      return;
    }

    const n = Number(raw);
    if (Number.isNaN(n)) {
      setRaw(String(value));
      return;
    }

    let clamped = n;
    if (min !== undefined) clamped = Math.max(min, clamped);
    if (max !== undefined) clamped = Math.min(max, clamped);

    if (validator) {
      const res = validator(clamped);
      if (!res.valid) {
        // Prompt the user to provide a permitted value and reset display to last valid
        const msg =
          res.message ??
          `Value ${clamped} is not in the allowed reference range. Please enter a permitted value.`;
        // Use alert for a prompt; replace with in-UI message if preferred
        window.alert(msg);
        setRaw(String(value));
        return;
      }
    }

    // If valid, finalize with parent and sync display
    onChangeNumber(clamped);
    setRaw(String(clamped));
  };

  return {
    raw,
    handleChange,
    handleBlur,
    // expose setter for advanced use if needed
    setRaw,
  };
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
  selectedTankId,
}: ManualInputsProps) => {
  const [showVCFTable, setShowVCFTable] = useState(false);
  const [vcfDialogOpen, setVcfDialogOpen] = useState(false);
  const [heightCapacityOpen, setHeightCapacityOpen] = useState(false);
  const [scfDialogOpen, setScfDialogOpen] = useState(false);
  const [pcfDialogOpen, setPcfDialogOpen] = useState(false);

  // Generate VCF table data - ALL values from the lookup table
  const vcfTemps = useMemo(() => {
    return Object.keys(COMBINED_TABLE).map(Number).sort((a, b) => a - b);
  }, []);
  
  const vcfDensities = SPECIFIC_GRAVITY_VALUES;

  // Validators for each field that reference the appropriate tables
  const densityValidator = (n: number) => {
    // compare to 3-decimal precision like the VCF values
    const ok = vcfDensities.some((d) => Math.abs(d - n) < 0.0005);
    return {
      valid: ok,
      message: ok
        ? undefined
        : `Density ${n} is not in the reference VCF densities. Allowed values: ${vcfDensities
            .map((d) => d.toFixed(3))
            .join(", ")}.`,
    };
  };

  const productTempValidator = (n: number) => {
    // Allow any temp that exists in combined table (0.5 step increments)
    const ok = vcfTemps.includes(n);
    return {
      valid: ok,
      message: ok
        ? undefined
        : `Temperature ${n}°C is not in the VCF reference temperatures. Allowed range: ${vcfTemps[0]}°C to ${vcfTemps[vcfTemps.length - 1]}°C in 0.5°C steps.`,
    };
  };

  const shellTempValidator = (n: number) => {
    const scfKeys = Object.keys(SCF_TABLE).map(Number);
    const ok = scfKeys.includes(n);
    const min = Math.min(...scfKeys);
    const max = Math.max(...scfKeys);
    return {
      valid: ok,
      message: ok
        ? undefined
        : `Shell temperature ${n}°C is not listed in the SCF reference table. Allowed values include: ${scfKeys.join(
            ", "
          )}°C. Allowed range ${min}-${max}°C.`,
    };
  };

  const heightValidator = (n: number) => {
    const table = selectedTankId === "tank-230" ? TANK2_CAPACITY_TABLE : CAPACITY_TABLE;
    const heights = Object.keys(table).map(Number);
    const ok = heights.includes(n);
    const min = Math.min(...heights);
    const max = Math.max(...heights);
    return {
      valid: ok,
      message: ok
        ? undefined
        : `Height ${n}mm is not in the selected tank's Height→Capacity reference table. Sampled heights include: ${heights
            .slice(0, 10)
            .join(", ")}... (range ${min}-${max} mm). Please enter a permitted height.`,
    };
  };

  const pressureValidator = (n: number) => {
    const pKeys = Object.keys(PCF_TABLE).map(Number);
    const ok = pKeys.includes(n);
    const min = Math.min(...pKeys);
    const max = Math.max(...pKeys);
    return {
      valid: ok,
      message: ok
        ? undefined
        : `Pressure ${n} bar is not in the Pressure Correction Factor table. Allowed pressures include: ${pKeys.join(
            ", "
          )}. Allowed range ${min}-${max} bar.`,
    };
  };

  // use hook for each numeric input so typing is not blocked and we validate against tables
  const densityInput = useNumberInput(density, onDensityChange, 0.5, 0.59, densityValidator);
  const temperatureInput = useNumberInput(temperature, onTemperatureChange, 0, 30, productTempValidator);
  const shellTempInput = useNumberInput(shellTemperature, onShellTemperatureChange, 0, 50, shellTempValidator);
  const heightInput = useNumberInput(height, onHeightChange, 0, maxHeight, heightValidator);
  const pressureInput = useNumberInput(pressure, onPressureChange, 0, 50, pressureValidator);

  // Generate capacity table rows based on selected tank - ALL values
  const capacityTableRows = useMemo(() => {
    const table = selectedTankId === "tank-230" ? TANK2_CAPACITY_TABLE : CAPACITY_TABLE;
    const heights = Object.keys(table).map(Number).sort((a, b) => a - b);
    const rows: { h1: number; c1: number; h2?: number; c2?: number }[] = [];

    // Show ALL heights, not sampled
    const half = Math.ceil(heights.length / 2);

    for (let i = 0; i < half; i++) {
      const h1 = heights[i];
      const h2 = heights[i + half];
      rows.push({
        h1,
        c1: table[h1],
        h2,
        c2: h2 !== undefined ? table[h2] : undefined,
      });
    }
    return rows;
  }, [selectedTankId]);

  // Generate SCF table rows (two columns side by side)
  const scfTableRows = useMemo(() => {
    const temps = Object.keys(SCF_TABLE).map(Number).sort((a, b) => a - b);
    const rows: { t1: number; scf1: number; t2?: number; scf2?: number }[] = [];
    const half = Math.ceil(temps.length / 2);

    for (let i = 0; i < half; i++) {
      const t1 = temps[i];
      const t2 = temps[i + half];
      rows.push({
        t1,
        scf1: SCF_TABLE[t1],
        t2,
        scf2: t2 !== undefined ? SCF_TABLE[t2] : undefined,
      });
    }
    return rows;
  }, []);

  // Generate PCF table rows (two columns side by side)
  const pcfTableRows = useMemo(() => {
    const pressures = Object.keys(PCF_TABLE).map(Number).sort((a, b) => a - b);
    const rows: { p1: number; pcf1: number; p2?: number; pcf2?: number }[] = [];
    const half = Math.ceil(pressures.length / 2);

    for (let i = 0; i < half; i++) {
      const p1 = pressures[i];
      const p2 = pressures[i + half];
      rows.push({
        p1,
        pcf1: PCF_TABLE[p1],
        p2,
        pcf2: p2 !== undefined ? PCF_TABLE[p2] : undefined,
      });
    }
    return rows;
  }, []);

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
            value={densityInput.raw}
            onChange={densityInput.handleChange}
            onBlur={densityInput.handleBlur}
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
            value={temperatureInput.raw}
            onChange={temperatureInput.handleChange}
            onBlur={temperatureInput.handleBlur}
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
            value={shellTempInput.raw}
            onChange={shellTempInput.handleChange}
            onBlur={shellTempInput.handleBlur}
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
            value={heightInput.raw}
            onChange={heightInput.handleChange}
            onBlur={heightInput.handleBlur}
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
          value={pressureInput.raw}
          onChange={pressureInput.handleChange}
          onBlur={pressureInput.handleBlur}
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
        <Button variant="outline" onClick={() => setScfDialogOpen(true)}>
          Shell Correction Factors
        </Button>
        <Button variant="outline" onClick={() => setPcfDialogOpen(true)}>
          Pressure Factors
        </Button>
        <Button variant="outline" onClick={() => setHeightCapacityOpen(true)}>
          Height↔Capacity Table
        </Button>
      </div>

      {/* VCF Table Dialog - ALL values */}
      <Dialog open={vcfDialogOpen} onOpenChange={setVcfDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-auto">
          <DialogHeader>
            <DialogTitle>Volume Correction Factors (VCF) - Complete Table (0°C to 30°C)</DialogTitle>
          </DialogHeader>
          <div className="overflow-x-auto">
            <table className="w-full text-xs border-collapse">
              <thead className="sticky top-0 bg-secondary z-10">
                <tr>
                  <th className="border border-border p-1 text-left">Temp (°C)</th>
                  {vcfDensities.map((d) => (
                    <th key={d} className="border border-border p-1 text-center whitespace-nowrap">
                      {d.toFixed(3)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {vcfTemps.map((t) => (
                  <tr key={t} className="hover:bg-muted/50">
                    <td className="border border-border p-1 font-medium">{t.toFixed(1)}</td>
                    {vcfDensities.map((d) => (
                      <td key={`${t}-${d}`} className="border border-border p-1 text-center font-mono">
                        {lookupDensity(t, d).toFixed(3)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </DialogContent>
      </Dialog>

      {/* Height-Capacity Dialog - ALL values */}
      <Dialog open={heightCapacityOpen} onOpenChange={setHeightCapacityOpen}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-auto">
          <DialogHeader>
            <DialogTitle>Height ↔ Capacity Table - Complete ({selectedTankId === "tank-230" ? "Tank 230" : "Tank 207"})</DialogTitle>
          </DialogHeader>
          <div className="overflow-x-auto">
            <table className="w-full text-xs border-collapse">
              <thead className="sticky top-0 bg-secondary z-10">
                <tr>
                  <th className="border border-border p-1 text-left">Height (mm)</th>
                  <th className="border border-border p-1 text-right">Capacity (L)</th>
                  <th className="border border-border p-1 text-left">Height (mm)</th>
                  <th className="border border-border p-1 text-right">Capacity (L)</th>
                </tr>
              </thead>
              <tbody>
                {capacityTableRows.map((row, idx) => (
                  <tr key={idx} className="hover:bg-muted/50">
                    <td className="border border-border p-1 font-medium">{row.h1}</td>
                    <td className="border border-border p-1 text-right font-mono">{row.c1?.toLocaleString() ?? "-"}</td>
                    <td className="border border-border p-1 font-medium">{row.h2 ?? "-"}</td>
                    <td className="border border-border p-1 text-right font-mono">{row.c2?.toLocaleString() ?? "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </DialogContent>
      </Dialog>

      {/* Shell Correction Factor Dialog */}
      <Dialog open={scfDialogOpen} onOpenChange={setScfDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-auto">
          <DialogHeader>
            <DialogTitle>Shell Correction Factors (SCF)</DialogTitle>
          </DialogHeader>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-secondary">
                  <th className="border border-border p-2 text-left">Temperature °C</th>
                  <th className="border border-border p-2 text-right">Correction Factor</th>
                  <th className="border border-border p-2 text-left">Temperature °C</th>
                  <th className="border border-border p-2 text-right">Correction Factor</th>
                </tr>
              </thead>
              <tbody>
                {scfTableRows.map((row, idx) => (
                  <tr key={idx} className="hover:bg-muted/50">
                    <td className="border border-border p-2 font-medium">{row.t1}</td>
                    <td className="border border-border p-2 text-right font-mono">{row.scf1.toFixed(6)}</td>
                    <td className="border border-border p-2 font-medium">{row.t2 ?? "-"}</td>
                    <td className="border border-border p-2 text-right font-mono">{row.scf2?.toFixed(6) ?? "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </DialogContent>
      </Dialog>

      {/* Pressure Correction Factor Dialog */}
      <Dialog open={pcfDialogOpen} onOpenChange={setPcfDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-auto">
          <DialogHeader>
            <DialogTitle>Pressure Correction Factors (PCF)</DialogTitle>
          </DialogHeader>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-secondary">
                  <th className="border border-border p-2 text-left">Pressure (Bars)</th>
                  <th className="border border-border p-2 text-right">Correction Factor</th>
                  <th className="border border-border p-2 text-left">Pressure (Bars)</th>
                  <th className="border border-border p-2 text-right">Correction Factor</th>
                </tr>
              </thead>
              <tbody>
                {pcfTableRows.map((row, idx) => (
                  <tr key={idx} className="hover:bg-muted/50">
                    <td className="border border-border p-2 font-medium">{row.p1}</td>
                    <td className="border border-border p-2 text-right font-mono">{row.pcf1.toFixed(5)}</td>
                    <td className="border border-border p-2 font-medium">{row.p2 ?? "-"}</td>
                    <td className="border border-border p-2 text-right font-mono">{row.pcf2?.toFixed(5) ?? "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ManualInputs;
