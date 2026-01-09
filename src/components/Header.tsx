import { Menu } from "lucide-react";
import { Link } from "react-router-dom";
import murbanLogo from "@/assets/murban-logo.png";
import tank207Image from "@/assets/tank-207.png";
import tank230Image from "@/assets/tank-230.png";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

interface HeaderProps {
  tankName: string;
  tankDescription?: string;
}

const Header = ({ tankName, tankDescription }: HeaderProps) => {
  return (
    <header className="mb-8">
      {/* Company Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <img src={murbanLogo} alt="Murban Logo" className="w-12 h-12 object-contain" />
          <div>
            <h2 className="font-bold text-lg text-foreground">Murban Engineering</h2>
            <span className="text-primary font-medium text-sm uppercase tracking-wide">Mabati Rolling Mills</span>
          </div>
        </div>

        {/* Tank View Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2">
              <Menu className="w-4 h-4" />
              Tank View
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-72 p-4">
            <div className="space-y-4">
              <Link to="/tank-view?tank=tank-207" className="block">
                <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted transition-colors">
                  <img src={tank207Image} alt="Tank 207" className="w-16 h-12 object-cover rounded" />
                  <span className="font-medium">Tank 207</span>
                </div>
              </Link>
              <Link to="/tank-view?tank=tank-230" className="block">
                <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted transition-colors">
                  <img src={tank230Image} alt="Tank 230" className="w-16 h-12 object-cover rounded" />
                  <span className="font-medium">Tank 230</span>
                </div>
              </Link>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Page Title */}
      <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-green-800 via-green-600 to-green-700 bg-clip-text text-transparent mb-2">
        Tank Mass Calculator
      </h1>
      {tankDescription && (
        <p className="text-muted-foreground">
          Single tank: {tankName} — {tankDescription}
        </p>
      )}
    </header>
  );
};

export default Header;
