interface CertificateCardProps {
  certificateNo: string;
  calibrationDate: string;
  validity: string;
  calibratedBy: string;
  method: string;
  uncertainty: string;
  tankName?: string;
  owner?: string;
  location?: string;
  description?: string;
  insideDiameter?: number;
  shellLength?: number;
  nominalCapacity?: number;
}

interface DescriptionRowProps {
  label: string;
  value: string | number;
}

const DescriptionRow = ({ label, value }: DescriptionRowProps) => (
  <div className="flex justify-between items-center py-3 px-4 bg-muted/30 rounded-lg">
    <span className="text-primary text-sm">{label}</span>
    <span className="text-foreground font-medium text-sm text-right">{value}</span>
  </div>
);

const CertificateCard = ({
  certificateNo,
  calibrationDate,
  validity,
  calibratedBy,
  method,
  uncertainty,
  tankName = "Tank 207",
  owner = "Mabati Rolling Mills",
  location = "Mombasa, Kenya",
  description = "LPG Bullet Tank",
  insideDiameter = 2267,
  shellLength = 16900,
  nominalCapacity = 65000,
}: CertificateCardProps) => {
  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <h3 className="text-xl font-bold text-foreground mb-6">Tank Description</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <DescriptionRow label="Client" value={owner} />
        <DescriptionRow label="Revision Date" value={calibrationDate} />
        <DescriptionRow label="Revision No." value="rev 01" />
        
        <DescriptionRow label="Project No." value={certificateNo} />
        <DescriptionRow label="Tank" value={tankName} />
        <DescriptionRow label="Tank Owner" value={owner} />
        
        <DescriptionRow label="Location" value={location} />
        <DescriptionRow label="Tank Description" value={description} />
        <DescriptionRow label="Nominal Diameter" value={`${insideDiameter} mm`} />
        
        <DescriptionRow label="Cylinder Length" value={`${shellLength.toLocaleString()} mm`} />
        <DescriptionRow label="Tank Nominal Capacity" value={`${nominalCapacity.toLocaleString()} Liters`} />
        <DescriptionRow label="Date of Calibration" value={calibrationDate} />
        
        <DescriptionRow label="Validity" value={validity} />
        <DescriptionRow label="Overall Uncertainty" value={uncertainty} />
        <DescriptionRow label="Method of Calibration" value={method} />
        
        <DescriptionRow label="Tank calibrated by" value={calibratedBy} />
        <DescriptionRow label="Certificate No." value={certificateNo} />
      </div>
    </div>
  );
};

export default CertificateCard;
