import { useState } from "react";
import { Cylinder, Ruler, Move, Droplets, Box } from "lucide-react";
import Header from "@/components/Header";
import TankVisualization from "@/components/TankVisualization";
import SpecificationCard from "@/components/SpecificationCard";
import CapacityChart from "@/components/CapacityChart";
import CertificateCard from "@/components/CertificateCard";
import LevelSlider from "@/components/LevelSlider";

// Tank 207 Data
const TANK_DATA = {
  name: "Tank 207",
  owner: "Mabati Rolling Mills",
  location: "Mombasa, Kenya",
  reference: "20257001051EN-207",
  description: "LPG Bullet Tank",
  insideDiameter: 2267,
  shellLength: 16900,
  nominalCapacity: 65000,
  calibrationDate: "24/11/2025",
  validity: "10 Years",
  uncertainty: "+0.012%",
  method: "API MPMS CHAPTER 2",
  calibratedBy: "Murban Engineering Limited",
  certificateNo: "20257001051EN-207",
};

const CAPACITY_LEVELS = [
  { percentage: 5, height: 112 },
  { percentage: 10, height: 224 },
  { percentage: 85, height: 1901 },
  { percentage: 90, height: 2013 },
  { percentage: 95, height: 2125 },
  { percentage: 100, height: 2237 },
];

const Index = () => {
  const [currentLevel, setCurrentLevel] = useState(55250); // Start at ~85%

  const percentage = (currentLevel / TANK_DATA.nominalCapacity) * 100;

  return (
    <div className="min-h-screen bg-background">
      {/* Background pattern */}
      <div className="fixed inset-0 opacity-30 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,_var(--tw-gradient-stops))] from-accent/5 via-transparent to-transparent" />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8 max-w-7xl">
        <Header
          tankName={TANK_DATA.name}
          tankOwner={TANK_DATA.owner}
          location={TANK_DATA.location}
          reference={TANK_DATA.reference}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main visualization area */}
          <div className="lg:col-span-2 space-y-6">
            {/* Tank Visualization */}
            <div className="glass-card p-8">
              <TankVisualization
                level={currentLevel}
                capacity={TANK_DATA.nominalCapacity}
                unit="L"
              />
            </div>

            {/* Level Simulator */}
            <LevelSlider
              value={currentLevel}
              onChange={setCurrentLevel}
              max={TANK_DATA.nominalCapacity}
            />

            {/* Specifications Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <SpecificationCard
                icon={<Cylinder className="w-5 h-5" />}
                label="Tank Type"
                value={TANK_DATA.description}
              />
              <SpecificationCard
                icon={<Ruler className="w-5 h-5" />}
                label="Inside Diameter"
                value={TANK_DATA.insideDiameter}
                unit="mm"
              />
              <SpecificationCard
                icon={<Move className="w-5 h-5" />}
                label="Shell Length"
                value={TANK_DATA.shellLength.toLocaleString()}
                unit="mm"
              />
              <SpecificationCard
                icon={<Droplets className="w-5 h-5" />}
                label="Nominal Capacity"
                value={TANK_DATA.nominalCapacity.toLocaleString()}
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
            {/* Certificate */}
            <CertificateCard
              certificateNo={TANK_DATA.certificateNo}
              calibrationDate={TANK_DATA.calibrationDate}
              validity={TANK_DATA.validity}
              calibratedBy={TANK_DATA.calibratedBy}
              method={TANK_DATA.method}
              uncertainty={TANK_DATA.uncertainty}
            />

            {/* Capacity Chart */}
            <CapacityChart
              levels={CAPACITY_LEVELS}
              currentLevel={percentage}
              maxHeight={2237}
            />
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-12 text-center text-sm text-muted-foreground">
          <p>
            Calibrated by <span className="text-primary font-medium">{TANK_DATA.calibratedBy}</span> • 
            November 2025
          </p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
