import { Fuel } from "lucide-react";
import murbanLogo from "@/assets/murban-logo.png";

interface HeaderProps {
  tankName: string;
}

const Header = ({ tankName }: HeaderProps) => {
  return (
    <header className="glass-card px-6 py-4 mb-8">
      <div className="flex items-center justify-between">
        {/* Murban Logo */}
        <div className="flex items-center gap-3">
          <img src={murbanLogo} alt="Murban Logo" className="w-10 h-10 object-contain" />
          <span className="font-bold text-lg text-foreground">Murban</span>
        </div>

        {/* Tank Name */}
        <div className="flex items-center gap-4">
          <div className="p-3 bg-primary/20 rounded-xl">
            <Fuel className="w-6 h-6 text-primary" />
          </div>
          <h1 className="text-xl md:text-2xl font-bold text-foreground">{tankName}</h1>
        </div>
      </div>
    </header>
  );
};

export default Header;
