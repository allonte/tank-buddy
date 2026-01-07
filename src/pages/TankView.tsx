import { Link } from "react-router-dom";
import { ArrowLeft, MapPin, Calendar, Building } from "lucide-react";
import tankImage from "@/assets/tank-207.png";

const TankView = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Background pattern */}
      <div className="fixed inset-0 opacity-30 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent" />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link
            to="/"
            className="p-2 rounded-lg bg-card hover:bg-accent transition-colors border border-border"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold gradient-text">Tank View</h1>
            <p className="text-muted-foreground">Physical tank photo and details</p>
          </div>
        </div>

        {/* Main Image Card */}
        <div className="glass-card overflow-hidden mb-8">
          <div className="relative">
            <img
              src={tankImage}
              alt="Tank 207 - LPG Bullet Tank"
              className="w-full h-auto object-cover"
            />
            <div className="absolute top-4 left-4 bg-background/90 backdrop-blur-sm px-4 py-2 rounded-lg border border-border">
              <span className="text-xl font-bold text-primary">TANK 207</span>
            </div>
          </div>
        </div>

        {/* Tank Details */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="glass-card p-6">
            <div className="flex items-center gap-3 mb-2">
              <Building className="w-5 h-5 text-primary" />
              <span className="text-sm text-muted-foreground">Owner</span>
            </div>
            <p className="font-semibold text-lg">Mabati Rolling Mills</p>
          </div>

          <div className="glass-card p-6">
            <div className="flex items-center gap-3 mb-2">
              <MapPin className="w-5 h-5 text-primary" />
              <span className="text-sm text-muted-foreground">Location</span>
            </div>
            <p className="font-semibold text-lg">Mombasa, Kenya</p>
          </div>

          <div className="glass-card p-6">
            <div className="flex items-center gap-3 mb-2">
              <Calendar className="w-5 h-5 text-primary" />
              <span className="text-sm text-muted-foreground">Calibration Date</span>
            </div>
            <p className="font-semibold text-lg">24/11/2025</p>
          </div>
        </div>

        {/* Specifications on Tank */}
        <div className="glass-card p-6 mt-8">
          <h2 className="text-lg font-semibold mb-4 text-primary">Tank Plate Specifications</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Serial No:</span>
              <p className="font-medium">CS09R6</p>
            </div>
            <div>
              <span className="text-muted-foreground">Capacity:</span>
              <p className="font-medium">96 TON</p>
            </div>
            <div>
              <span className="text-muted-foreground">T.P:</span>
              <p className="font-medium">175 PSIG</p>
            </div>
            <div>
              <span className="text-muted-foreground">S.W.P:</span>
              <p className="font-medium">250 PSIG</p>
            </div>
            <div>
              <span className="text-muted-foreground">T.D:</span>
              <p className="font-medium">24/11/2025</p>
            </div>
            <div>
              <span className="text-muted-foreground">N.T.D:</span>
              <p className="font-medium">24/11/2029</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TankView;
