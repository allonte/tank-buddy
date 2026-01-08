import murbanLogo from "@/assets/murban-logo.png";

interface HeaderProps {
  tankName: string;
  tankDescription?: string;
}

const Header = ({ tankName, tankDescription }: HeaderProps) => {
  return (
    <header className="mb-8">
      {/* Company Header */}
      <div className="flex items-center gap-3 mb-6">
        <img src={murbanLogo} alt="Murban Logo" className="w-12 h-12 object-contain" />
        <div>
          <h2 className="font-bold text-lg text-foreground">Murban Engineering</h2>
          <span className="text-primary font-medium text-sm uppercase tracking-wide">Mabati Rolling Mills</span>
        </div>
      </div>

      {/* Page Title */}
      <h1 className="text-3xl md:text-4xl font-bold text-primary mb-2">Tank Mass Calculator</h1>
      {tankDescription && (
        <p className="text-muted-foreground">
          Single tank: {tankName} — {tankDescription}
        </p>
      )}
    </header>
  );
};

export default Header;
