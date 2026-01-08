import { useState, useEffect } from "react";
import { Cylinder, Ruler, Move, Droplets, Box } from "lucide-react";
import Header from "@/components/Header";
import TankVisualization from "@/components/TankVisualization";
import SpecificationCard from "@/components/SpecificationCard";
import CapacityChart from "@/components/CapacityChart";
import CertificateCard from "@/components/CertificateCard";
import LevelSlider from "@/components/LevelSlider";
import MassCalculator from "@/components/MassCalculator";
import TankSelector from "@/components/TankSelector";
import { TANKS, TankConfig } from "@/lib/tankData";
import { calculateCorrectedDensity } from "@/lib/densityLookup";

const Index = () => {
  const [selectedTankId, setSelectedTankId] = useState("tank-207");
  const [currentLevel, setCurrentLevel] = useState(55250);
  const [temperature, setTemperature] = useState(20.0);
  const [density, setDensity] = useState(0.540);

  const tankData: TankConfig = TANKS[selectedTankId];

  // Reset level when tank changes
  useEffect(() => {
    setCurrentLevel(Math.round(tankData.nominalCapacity * 0.85));
  }, [selectedTankId, tankData.nominalCapacity]);

  const percentage = (currentLevel / tankData.nominalCapacity) * 100;
  const correctedDensity = calculateCorrectedDensity(density, temperature);
  const mass = currentLevel * correctedDensity;

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <Header
          tankName={tankData.name}
          tankOwner={tankData.owner}
          location={tankData.location}
          reference={tankData.reference}
        />

        {/* Tank Selector */}
        <div className="mb-6">
          <TankSelector value={selectedTankId} onChange={setSelectedTankId} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main visualization area */}
          <div className="lg:col-span-2 space-y-6">
            {/* Tank Visualization */}
            <div className="glass-card p-8">
              <TankVisualization
                level={currentLevel}
                capacity={tankData.nominalCapacity}
                unit="L"
                mass={mass}
              />
            </div>

            {/* Level Simulator */}
            <LevelSlider
              value={currentLevel}
              onChange={setCurrentLevel}
              max={tankData.nominalCapacity}
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
            {/* Mass Calculator with Temperature & Density inputs */}
            <MassCalculator
              volume={currentLevel}
              temperature={temperature}
              density={density}
              onTemperatureChange={setTemperature}
              onDensityChange={setDensity}
            />

            {/* Certificate */}
            <CertificateCard
              certificateNo={tankData.certificateNo}
              calibrationDate={tankData.calibrationDate}
              validity={tankData.validity}
              calibratedBy={tankData.calibratedBy}
              method={tankData.method}
              uncertainty={tankData.uncertainty}
            />

            {/* Capacity Chart */}
            <CapacityChart
              levels={tankData.capacityLevels}
              currentLevel={percentage}
              maxHeight={tankData.maxHeight}
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
