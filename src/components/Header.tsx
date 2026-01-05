import { Fuel, MapPin } from "lucide-react";

interface HeaderProps {
  tankName: string;
  tankOwner: string;
  location: string;
  reference: string;
}

const Header = ({ tankName, tankOwner, location, reference }: HeaderProps) => {
  return (
    <header className="glass-card px-6 py-4 mb-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-primary/20 rounded-xl glow-gold">
            <Fuel className="w-8 h-8 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold gradient-text">{tankName}</h1>
            <p className="text-muted-foreground font-medium">{tankOwner}</p>
          </div>
        </div>

        <div className="flex flex-col md:items-end gap-1">
          <div className="flex items-center gap-2 text-muted-foreground">
            <MapPin className="w-4 h-4 text-primary" />
            <span className="text-sm">{location}</span>
          </div>
          <p className="text-xs text-muted-foreground font-mono">
            Ref: {reference}
          </p>
        </div>
      </div>
    </header>
  );
};

export default Header;
