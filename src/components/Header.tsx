import { Link, useLocation } from "react-router-dom";
import { Fuel, MapPin, Image, LayoutDashboard } from "lucide-react";
import murbanLogo from "@/assets/murban-logo.png";

interface HeaderProps {
  tankName: string;
  tankOwner: string;
  location: string;
  reference: string;
}

const Header = ({ tankName, tankOwner, location, reference }: HeaderProps) => {
  const { pathname } = useLocation();

  return (
    <header className="glass-card px-6 py-4 mb-8">
      {/* Murban Logo */}
      <div className="flex items-center gap-3 mb-4 pb-4 border-b border-border">
        <img src={murbanLogo} alt="Murban Logo" className="w-10 h-10 object-contain" />
        <span className="font-bold text-lg text-foreground">Murban</span>
      </div>

      <div className="flex flex-col gap-4">
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

        {/* Navigation */}
        <nav className="flex gap-2 border-t border-border pt-4">
          <Link
            to="/"
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              pathname === "/"
                ? "bg-primary text-primary-foreground"
                : "hover:bg-accent text-muted-foreground hover:text-foreground"
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            Dashboard
          </Link>
          <Link
            to="/tank-view"
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              pathname === "/tank-view"
                ? "bg-primary text-primary-foreground"
                : "hover:bg-accent text-muted-foreground hover:text-foreground"
            }`}
          >
            <Image className="w-4 h-4" />
            Tank View
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
