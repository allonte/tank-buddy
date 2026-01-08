// Tank configuration data for multiple tanks

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
    capacityLevels: [
      { percentage: 5, height: 112 },
      { percentage: 10, height: 224 },
      { percentage: 85, height: 1901 },
      { percentage: 90, height: 2013 },
      { percentage: 95, height: 2125 },
      { percentage: 100, height: 2237 },
    ],
  },
  "tank-2": {
    id: "tank-2",
    name: "Tank 2",
    owner: "Mabati Rolling Mills",
    location: "Mombasa, Kenya",
    reference: "20257001051EN-002",
    description: "LPG Bullet Tank",
    insideDiameter: 2267,
    shellLength: 16900,
    nominalCapacity: 64059,
    maxHeight: 2235,
    calibrationDate: "24/11/2025",
    validity: "10 Years",
    uncertainty: "+0.012%",
    method: "API MPMS CHAPTER 2",
    calibratedBy: "Murban Engineering Limited",
    certificateNo: "20257001051EN-002",
    capacityLevels: [
      { percentage: 5, height: 112 },
      { percentage: 10, height: 224 },
      { percentage: 85, height: 1901 },
      { percentage: 90, height: 2013 },
      { percentage: 95, height: 2125 },
      { percentage: 100, height: 2235 },
    ],
  },
};

export const TANK_LIST = Object.values(TANKS);
