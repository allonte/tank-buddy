// Tank configuration data for multiple tanks
import tank207Image from "@/assets/tank-207.png";
import tank230Image from "@/assets/tank-230.png";

export interface TankConfig {
  id: string;
  name: string;
  owner: string;
  location: string;
  reference: string;
  description: string;
  insideDiameter: number;
  shellLength: number;
  nominalCapacity: number;
  maxHeight: number;
  calibrationDate: string;
  validity: string;
  uncertainty: string;
  method: string;
  calibratedBy: string;
  certificateNo: string;
  image?: string;
  capacityLevels: { percentage: number; height: number }[];
}

export const TANKS: Record<string, TankConfig> = {
  "tank-207": {
    id: "tank-207",
    name: "Tank 207",
    owner: "Mabati Rolling Mills",
    location: "Mombasa, Kenya",
    reference: "20257001051EN-207",
    description: "LPG Bullet Tank",
    insideDiameter: 2267,
    shellLength: 16900,
    nominalCapacity: 65000,
    maxHeight: 2235,
    calibrationDate: "24/11/2025",
    validity: "10 Years",
    uncertainty: "+0.012%",
    method: "API MPMS CHAPTER 2",
    calibratedBy: "Murban Engineering Limited",
    certificateNo: "20257001051EN-207",
    image: tank207Image,
    capacityLevels: [
      { percentage: 5, height: 112 },
      { percentage: 10, height: 224 },
      { percentage: 85, height: 1901 },
      { percentage: 90, height: 2013 },
      { percentage: 95, height: 2125 },
      { percentage: 100, height: 2237 },
    ],
  },
  "tank-230": {
    id: "tank-230",
    name: "Tank 230",
    owner: "Mabati Rolling Mills",
    location: "Mombasa, Kenya",
    reference: "20257001051EN-230",
    description: "LPG Bullet Tank",
    insideDiameter: 2277,
    shellLength: 16900,
    nominalCapacity: 65000,
    maxHeight: 2247,
    calibrationDate: "24/11/2025",
    validity: "10 Years",
    uncertainty: "+0.011%",
    method: "API MPMS CHAPTER 2",
    calibratedBy: "Murban Engineering Limited",
    certificateNo: "20257001051EN-230",
    image: tank230Image,
    capacityLevels: [
      { percentage: 5, height: 112 },
      { percentage: 10, height: 225 },
      { percentage: 85, height: 1910 },
      { percentage: 90, height: 2022 },
      { percentage: 95, height: 2135 },
      { percentage: 100, height: 2247 },
    ],
  },
};

export const TANK_LIST = Object.values(TANKS);
