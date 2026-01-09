import { useState, useEffect } from "react";
import { Cylinder, Ruler, Move, Droplets, Box, Copy, FileSpreadsheet, Printer } from "lucide-react";
import { toast } from "sonner";
import Header from "@/components/Header";
import TankVisualization from "@/components/TankVisualization";
import SpecificationCard from "@/components/SpecificationCard";
import CertificateCard from "@/components/CertificateCard";
import ManualInputs from "@/components/ManualInputs";
import TankSelector from "@/components/TankSelector";
import { Button } from "@/components/ui/button";
import { TANKS, TankConfig } from "@/lib/tankData";
import { calculateCorrectedDensity, lookupDensity } from "@/lib/densityLookup";
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
  
  // Calculate VCF (Volume Correction Factor) from product temperature
  const vcf = lookupDensity(temperature, density);
  
  // Shell Correction Factor (simplified - typically 1.0 at reference temp)
  const scf = 1.0;
  
  // PCF (Pressure Correction Factor) - simplified
  const pcf = 1.0;
  
  // Corrected Volume
  const correctedVolume = currentLevel * vcf * scf;
  
  // Mass calculation
  const mass = correctedVolume * density;

  // Results data for export
  const resultsData = {
    referenceVolume: currentLevel,
    vcf,
    scf,
    correctedVolume,
    pcf,
    densityUsed: density,
    mass,
  };

  const handleCopyResults = () => {
    const text = `Reference Volume (L): ${resultsData.referenceVolume.toFixed(3)}
Product Temperature Factor (VCF): ${resultsData.vcf.toFixed(6)}
Shell Correction Factor (SCF): ${resultsData.scf.toFixed(6)}
Corrected Volume (L): ${resultsData.correctedVolume.toFixed(3)}
PCF used: ${resultsData.pcf.toFixed(6)}
Product Density used (kg/L): ${resultsData.densityUsed.toFixed(3)}
Mass (kg): ${resultsData.mass.toFixed(3)}`;
    
    navigator.clipboard.writeText(text);
    toast.success("Results copied to clipboard");
  };

  const handleExportCSV = () => {
    const csv = `Parameter,Value
Reference Volume (L),${resultsData.referenceVolume.toFixed(3)}
Product Temperature Factor (VCF),${resultsData.vcf.toFixed(6)}
Shell Correction Factor (SCF),${resultsData.scf.toFixed(6)}
Corrected Volume (L),${resultsData.correctedVolume.toFixed(3)}
PCF used,${resultsData.pcf.toFixed(6)}
Product Density used (kg/L),${resultsData.densityUsed.toFixed(3)}
Mass (kg),${resultsData.mass.toFixed(3)}`;
    
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `tank-results-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("CSV exported");
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <Header tankName={tankData.name} tankDescription={tankData.description} />

        {/* Tank Selector - Full Width */}
        <div className="mb-6">
          <TankSelector value={selectedTankId} onChange={setSelectedTankId} />
        </div>

        {/* Tank Visualization - Full Width */}
        <div className="mb-6 bg-card rounded-lg border border-border p-6">
          <TankVisualization
            level={currentLevel}
            capacity={tankData.nominalCapacity}
            unit="L"
            maxHeight={tankData.maxHeight}
            currentHeight={height}
            onHeightChange={(newHeight) => {
              setHeight(newHeight);
              // Look up volume from height based on selected tank
              let volume: number;
              if (selectedTankId === "tank-230") {
                volume = getTank2CapacityByHeight(newHeight);
              } else {
                volume = lookupCapacity(newHeight);
              }
              setCurrentLevel(Math.round(volume));
            }}
          />
        </div>

        {/* Manual Inputs and Results Side by Side */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
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

          {/* Calculation Results */}
          <div className="bg-card rounded-lg border border-border p-6">
            <h3 className="text-xl font-bold text-foreground mb-6">Results</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b border-border">
                <span className="text-muted-foreground">Reference Volume (L)</span>
                <span className="font-mono font-semibold">{resultsData.referenceVolume.toFixed(3)}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-border">
                <span className="text-muted-foreground">Product Temperature Factor (VCF)</span>
                <span className="font-mono font-semibold">{resultsData.vcf.toFixed(6)}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-border">
                <span className="text-muted-foreground">Shell Correction Factor (SCF)</span>
                <span className="font-mono font-semibold">{resultsData.scf.toFixed(6)}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-border">
                <span className="text-muted-foreground">Corrected Volume (L)</span>
                <span className="font-mono font-semibold">{resultsData.correctedVolume.toFixed(3)}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-border">
                <span className="text-muted-foreground">PCF used</span>
                <span className="font-mono font-semibold">{resultsData.pcf.toFixed(6)}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-border">
                <span className="text-muted-foreground">Product Density used (kg/L)</span>
                <span className="font-mono font-semibold">{resultsData.densityUsed.toFixed(3)}</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="font-semibold text-foreground">Mass (kg)</span>
                <span className="font-mono font-bold text-lg">{resultsData.mass.toFixed(3)}</span>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex flex-wrap gap-2 mt-6">
              <Button onClick={handleCopyResults} className="bg-primary hover:bg-primary/90">
                <Copy className="w-4 h-4 mr-2" />
                Copy results
              </Button>
              <Button variant="secondary" onClick={handleExportCSV}>
                <FileSpreadsheet className="w-4 h-4 mr-2" />
                Export CSV
              </Button>
              <Button variant="secondary" onClick={handlePrint}>
                <Printer className="w-4 h-4 mr-2" />
                Print
              </Button>
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
          tankName={tankData.name}
          owner={tankData.owner}
          location={tankData.location}
          description={tankData.description}
          insideDiameter={tankData.insideDiameter}
          shellLength={tankData.shellLength}
          nominalCapacity={tankData.nominalCapacity}
        />

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
