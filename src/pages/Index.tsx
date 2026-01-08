import { useState, useEffect } from "react";
import { Cylinder, Ruler, Move, Droplets, Box } from "lucide-react";
import Header from "@/components/Header";
import TankVisualization from "@/components/TankVisualization";
import SpecificationCard from "@/components/SpecificationCard";
import CertificateCard from "@/components/CertificateCard";
import ManualInputs from "@/components/ManualInputs";
import TankSelector from "@/components/TankSelector";
import { TANKS, TankConfig } from "@/lib/tankData";
import { calculateCorrectedDensity } from "@/lib/densityLookup";
import { lookupCapacity } from "@/lib/capacityLookup";
import { getTank2CapacityByHeight } from "@/lib/tank230CapacityLookup";

const Index = () => {
  const [selectedTankId, setSelectedTankId] = useState("tank-207");
  const [currentLevel, setCurrentLevel] = useState(0);
  const [temperature, setTemperature] = useState(20.0);
  const [shellTemperature, setShellTemperature] = useState(20.0);
  const [density, setDensity] = useState(0.55);
  const [height, setHeight] = useState(0);
  const [pressure, setPressure] = useState(17);

  const tankData: TankConfig = TANKS[selectedTankId];

  // Reset values when tank changes
  useEffect(() => {
    setCurrentLevel(0);
    setHeight(0);
  }, [selectedTankId]);

  const handleCalculate = () => {
    // Look up volume from height based on selected tank
    let volume: number;
    if (selectedTankId === "tank-230") {
      volume = getTank2CapacityByHeight(height);
    } else {
      volume = lookupCapacity(height);
    }
    setCurrentLevel(Math.round(volume));
  };

  const handleReset = () => {
    setTemperature(20.0);
    setShellTemperature(20.0);
    setDensity(0.55);
    setHeight(0);
    setPressure(17);
    setCurrentLevel(0);
  };

  const percentage = (currentLevel / tankData.nominalCapacity) * 100;
  const correctedDensity = calculateCorrectedDensity(density, temperature);
  const mass = currentLevel * correctedDensity;

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <Header tankName={tankData.name} />

        {/* Tank Selector */}
        <div className="mb-6">
          <TankSelector value={selectedTankId} onChange={setSelectedTankId} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main visualization area */}
          <div className="lg:col-span-2 space-y-6">
            {/* Tank Visualization */}
            <div className="bg-card rounded-lg border border-border p-8">
              <TankVisualization
                level={currentLevel}
                capacity={tankData.nominalCapacity}
                unit="L"
                mass={mass}
              />
            </div>

            {/* Manual Inputs */}
            <ManualInputs
              density={density}
              temperature={temperature}
              shellTemperature={shellTemperature}
              height={height}
              pressure={pressure}
              onDensityChange={setDensity}
              onTemperatureChange={setTemperature}
              onShellTemperatureChange={setShellTemperature}
              onHeightChange={setHeight}
              onPressureChange={setPressure}
              onCalculate={handleCalculate}
              onReset={handleReset}
              maxHeight={tankData.maxHeight}
              selectedTankId={selectedTankId}
            />

            {/* Specifications Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <SpecificationCard
                icon={<Cylinder className="w-5 h-5" />}
                label="Tank Type"
                value={tankData.description}
              />
              <SpecificationCard
                icon={<Ruler className="w-5 h-5" />}
                label="Inside Diameter"
                value={tankData.insideDiameter}
                unit="mm"
              />
              <SpecificationCard
                icon={<Move className="w-5 h-5" />}
                label="Shell Length"
                value={tankData.shellLength.toLocaleString()}
                unit="mm"
              />
              <SpecificationCard
                icon={<Droplets className="w-5 h-5" />}
                label="Nominal Capacity"
                value={tankData.nominalCapacity.toLocaleString()}
                unit="Liters"
                highlight
              />
              <SpecificationCard
                icon={<Box className="w-5 h-5" />}
                label="Current Volume"
                value={currentLevel.toLocaleString()}
                unit="Liters"
              />
              <SpecificationCard
                icon={<Ruler className="w-5 h-5" />}
                label="Fill Level"
                value={percentage.toFixed(1)}
                unit="%"
                highlight
              />
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Calculation Results */}
            <div className="bg-card rounded-lg border border-border p-6">
              <h3 className="text-lg font-semibold mb-4">Calculation Results</h3>
              <div className="space-y-4">
                <div className="p-4 bg-secondary rounded-lg">
                  <p className="text-sm text-muted-foreground mb-1">Corrected Density</p>
                  <p className="text-xl font-mono font-bold">{correctedDensity.toFixed(4)} kg/L</p>
                </div>
                <div className="p-4 bg-primary/10 rounded-lg border border-primary/20">
                  <p className="text-sm text-muted-foreground mb-1">Calculated Mass</p>
                  <p className="text-2xl font-mono font-bold text-primary">
                    {mass.toLocaleString(undefined, { maximumFractionDigits: 1 })} kg
                  </p>
                </div>
              </div>
            </div>

            {/* Certificate */}
            <CertificateCard
              certificateNo={tankData.certificateNo}
              calibrationDate={tankData.calibrationDate}
              validity={tankData.validity}
              calibratedBy={tankData.calibratedBy}
              method={tankData.method}
              uncertainty={tankData.uncertainty}
            />
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-12 text-center text-sm text-muted-foreground">
          <p>
            Calibrated by <span className="text-primary font-medium">{tankData.calibratedBy}</span> • 
            November 2025
          </p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
