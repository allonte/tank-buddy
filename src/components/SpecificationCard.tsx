import { ReactNode } from "react";

interface SpecificationCardProps {
  icon: ReactNode;
  label: string;
  value: string | number;
  unit?: string;
  highlight?: boolean;
}

const SpecificationCard = ({ icon, label, value, unit, highlight = false }: SpecificationCardProps) => {
  return (
    <div
      className={`glass-card p-4 flex items-center gap-4 transition-all duration-300 hover:scale-[1.02] hover:border-primary/50 ${
        highlight ? "border-primary/30 glow-gold" : ""
      }`}
    >
      <div className={`p-3 rounded-lg ${highlight ? "bg-primary/20 text-primary" : "bg-secondary text-muted-foreground"}`}>
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-muted-foreground font-medium">{label}</p>
        <p className={`text-lg font-semibold truncate ${highlight ? "text-primary" : "text-foreground"}`}>
          {value}
          {unit && <span className="text-sm text-muted-foreground ml-1">{unit}</span>}
        </p>
      </div>
    </div>
  );
};

export default SpecificationCard;
