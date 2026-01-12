// Pressure Correction Factor (PCF) Lookup Table
export const PCF_TABLE: Record<number, number> = {
  5: 0.99905,
  6: 0.99913,
  7: 0.99921,
  8: 0.99929,
  9: 0.99937,
  10: 0.99944,
  11: 0.99952,
  12: 0.99960,
  13: 0.99968,
  14: 0.99976,
  15: 0.99984,
  16: 0.99992,
  17: 1.00000,
  18: 1.00008,
  19: 1.00016,
  20: 1.00024,
  21: 1.00032,
  22: 1.00040,
  23: 1.00048,
  24: 1.00056,
  25: 1.00063,
  26: 1.00071,
  27: 1.00079,
  28: 1.00087,
  29: 1.00095,
  30: 1.00103,
  31: 1.00111,
  32: 1.00119,
  33: 1.00127,
  34: 1.00135,
};

/**
 * Lookup PCF for a given pressure (bar)
 * Uses linear interpolation for values between table entries
 */
export function lookupPCF(pressure: number): number {
  const pressures = Object.keys(PCF_TABLE).map(Number).sort((a, b) => a - b);
  const minPressure = pressures[0];
  const maxPressure = pressures[pressures.length - 1];

  // Clamp to table range
  if (pressure <= minPressure) return PCF_TABLE[minPressure];
  if (pressure >= maxPressure) return PCF_TABLE[maxPressure];

  // Find surrounding pressures for interpolation
  let lowerPressure = minPressure;
  let upperPressure = maxPressure;

  for (let i = 0; i < pressures.length - 1; i++) {
    if (pressures[i] <= pressure && pressures[i + 1] >= pressure) {
      lowerPressure = pressures[i];
      upperPressure = pressures[i + 1];
      break;
    }
  }

  // Linear interpolation
  const lowerPCF = PCF_TABLE[lowerPressure];
  const upperPCF = PCF_TABLE[upperPressure];
  const fraction = (pressure - lowerPressure) / (upperPressure - lowerPressure);
  
  return lowerPCF + fraction * (upperPCF - lowerPCF);
}
