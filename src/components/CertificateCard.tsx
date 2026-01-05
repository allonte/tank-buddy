import { Shield, Calendar, Award, CheckCircle } from "lucide-react";

interface CertificateCardProps {
  certificateNo: string;
  calibrationDate: string;
  validity: string;
  calibratedBy: string;
  method: string;
  uncertainty: string;
}

const CertificateCard = ({
  certificateNo,
  calibrationDate,
  validity,
  calibratedBy,
  method,
  uncertainty,
}: CertificateCardProps) => {
  return (
    <div className="glass-card p-6 border-primary/20 glow-gold">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-primary/20 rounded-lg">
          <Shield className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-foreground">Calibration Certificate</h3>
          <p className="text-sm text-muted-foreground font-mono">{certificateNo}</p>
        </div>
        <div className="ml-auto">
          <span className="flex items-center gap-1 text-success text-sm font-medium bg-success/10 px-3 py-1 rounded-full">
            <CheckCircle className="w-4 h-4" />
            Valid
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <p className="text-xs text-muted-foreground uppercase tracking-wider">Calibration Date</p>
          <p className="text-sm font-medium text-foreground flex items-center gap-2">
            <Calendar className="w-4 h-4 text-primary" />
            {calibrationDate}
          </p>
        </div>

        <div className="space-y-1">
          <p className="text-xs text-muted-foreground uppercase tracking-wider">Validity Period</p>
          <p className="text-sm font-medium text-foreground">{validity}</p>
        </div>

        <div className="space-y-1">
          <p className="text-xs text-muted-foreground uppercase tracking-wider">Calibrated By</p>
          <p className="text-sm font-medium text-foreground flex items-center gap-2">
            <Award className="w-4 h-4 text-primary" />
            {calibratedBy}
          </p>
        </div>

        <div className="space-y-1">
          <p className="text-xs text-muted-foreground uppercase tracking-wider">Overall Uncertainty</p>
          <p className="text-sm font-medium text-primary font-mono">{uncertainty}</p>
        </div>

        <div className="col-span-2 space-y-1 pt-2 border-t border-border">
          <p className="text-xs text-muted-foreground uppercase tracking-wider">Method</p>
          <p className="text-sm font-medium text-foreground">{method}</p>
        </div>
      </div>
    </div>
  );
};

export default CertificateCard;
