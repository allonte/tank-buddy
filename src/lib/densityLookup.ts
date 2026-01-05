// Density correction factors based on temperature and specific gravity
// Temperature in °C, Specific Gravity at 60°F columns: 0.500 to 0.590

export const SPECIFIC_GRAVITY_VALUES = [0.500, 0.510, 0.520, 0.530, 0.540, 0.550, 0.560, 0.570, 0.580, 0.590];

export const DENSITY_TABLE: Record<number, number[]> = {
  15.5: [1.015, 1.014, 1.013, 1.013, 1.012, 1.011, 1.011, 1.010, 1.010, 1.009],
  16.0: [1.013, 1.012, 1.012, 1.011, 1.011, 1.010, 1.010, 1.009, 1.009, 1.008],
  16.5: [1.012, 1.011, 1.010, 1.010, 1.009, 1.009, 1.008, 1.008, 1.008, 1.007],
  17.0: [1.010, 1.009, 1.009, 1.008, 1.008, 1.007, 1.007, 1.007, 1.007, 1.006],
  17.5: [1.008, 1.008, 1.007, 1.007, 1.007, 1.006, 1.006, 1.006, 1.006, 1.005],
  18.0: [1.007, 1.006, 1.006, 1.006, 1.005, 1.005, 1.005, 1.004, 1.004, 1.004],
  18.5: [1.005, 1.005, 1.004, 1.004, 1.004, 1.004, 1.004, 1.003, 1.003, 1.003],
  19.0: [1.003, 1.003, 1.003, 1.003, 1.003, 1.002, 1.002, 1.002, 1.002, 1.002],
  19.5: [1.002, 1.002, 1.001, 1.001, 1.001, 1.001, 1.001, 1.001, 1.001, 1.001],
  20.0: [1.000, 1.000, 1.000, 1.000, 1.000, 1.000, 1.000, 1.000, 1.000, 1.000],
  20.5: [0.998, 0.998, 0.999, 0.999, 0.999, 0.999, 0.999, 0.999, 0.999, 0.999],
  21.0: [0.997, 0.997, 0.997, 0.997, 0.997, 0.998, 0.998, 0.998, 0.998, 0.998],
  21.5: [0.995, 0.995, 0.996, 0.996, 0.996, 0.996, 0.996, 0.997, 0.997, 0.997],
  22.0: [0.994, 0.994, 0.994, 0.994, 0.995, 0.995, 0.995, 0.996, 0.996, 0.996],
  22.5: [0.992, 0.992, 0.993, 0.993, 0.993, 0.994, 0.994, 0.994, 0.995, 0.995],
  23.0: [0.990, 0.991, 0.992, 0.992, 0.992, 0.993, 0.993, 0.993, 0.993, 0.994],
  23.5: [0.989, 0.989, 0.990, 0.990, 0.991, 0.992, 0.992, 0.992, 0.992, 0.993],
  24.0: [0.987, 0.988, 0.989, 0.989, 0.990, 0.990, 0.990, 0.991, 0.991, 0.992],
  24.5: [0.986, 0.986, 0.987, 0.988, 0.988, 0.989, 0.989, 0.990, 0.990, 0.991],
  25.0: [0.984, 0.985, 0.986, 0.986, 0.987, 0.988, 0.988, 0.989, 0.989, 0.990],
  25.5: [0.982, 0.984, 0.985, 0.985, 0.986, 0.987, 0.987, 0.988, 0.988, 0.989],
  26.0: [0.981, 0.982, 0.983, 0.983, 0.984, 0.986, 0.986, 0.987, 0.987, 0.988],
  26.5: [0.979, 0.981, 0.982, 0.982, 0.983, 0.984, 0.985, 0.986, 0.986, 0.987],
  27.0: [0.978, 0.979, 0.980, 0.981, 0.982, 0.983, 0.983, 0.985, 0.985, 0.986],
  27.5: [0.976, 0.978, 0.979, 0.979, 0.981, 0.982, 0.982, 0.984, 0.984, 0.985],
  28.0: [0.975, 0.976, 0.978, 0.978, 0.979, 0.981, 0.981, 0.982, 0.983, 0.984],
  28.5: [0.973, 0.975, 0.976, 0.977, 0.978, 0.980, 0.980, 0.981, 0.982, 0.983],
  29.0: [0.972, 0.973, 0.975, 0.975, 0.977, 0.979, 0.979, 0.980, 0.981, 0.982],
  29.5: [0.970, 0.972, 0.974, 0.974, 0.976, 0.977, 0.978, 0.979, 0.980, 0.981],
  30.0: [0.969, 0.970, 0.972, 0.973, 0.974, 0.976, 0.977, 0.978, 0.978, 0.980],
};

export const TEMPERATURES = Object.keys(DENSITY_TABLE).map(Number).sort((a, b) => a - b);

/**
 * Lookup density correction factor based on temperature and specific gravity
 * Uses linear interpolation for values between table entries
 */
export function lookupDensity(temperature: number, specificGravity: number): number {
  // Clamp values to table range
  const clampedTemp = Math.max(15.5, Math.min(30.0, temperature));
  const clampedSG = Math.max(0.500, Math.min(0.590, specificGravity));

  // Find surrounding temperature rows
  const tempIndex = TEMPERATURES.findIndex(t => t >= clampedTemp);
  const lowerTempIdx = tempIndex === 0 ? 0 : tempIndex - 1;
  const upperTempIdx = tempIndex === -1 ? TEMPERATURES.length - 1 : tempIndex;
  
  const lowerTemp = TEMPERATURES[lowerTempIdx];
  const upperTemp = TEMPERATURES[upperTempIdx];

  // Find surrounding SG columns
  const sgIndex = SPECIFIC_GRAVITY_VALUES.findIndex(sg => sg >= clampedSG);
  const lowerSGIdx = sgIndex === 0 ? 0 : sgIndex - 1;
  const upperSGIdx = sgIndex === -1 ? SPECIFIC_GRAVITY_VALUES.length - 1 : sgIndex;

  const lowerSG = SPECIFIC_GRAVITY_VALUES[lowerSGIdx];
  const upperSG = SPECIFIC_GRAVITY_VALUES[upperSGIdx];

  // Get the four surrounding values
  const v00 = DENSITY_TABLE[lowerTemp][lowerSGIdx];
  const v01 = DENSITY_TABLE[lowerTemp][upperSGIdx];
  const v10 = DENSITY_TABLE[upperTemp][lowerSGIdx];
  const v11 = DENSITY_TABLE[upperTemp][upperSGIdx];

  // Bilinear interpolation
  const tempRatio = upperTemp === lowerTemp ? 0 : (clampedTemp - lowerTemp) / (upperTemp - lowerTemp);
  const sgRatio = upperSG === lowerSG ? 0 : (clampedSG - lowerSG) / (upperSG - lowerSG);

  const v0 = v00 + (v01 - v00) * sgRatio;
  const v1 = v10 + (v11 - v10) * sgRatio;
  
  return v0 + (v1 - v0) * tempRatio;
}

/**
 * Calculate corrected density in kg/L
 * @param specificGravity - Specific gravity at 60°F
 * @param temperature - Temperature in °C
 * @returns Corrected density in kg/L
 */
export function calculateCorrectedDensity(specificGravity: number, temperature: number): number {
  const correctionFactor = lookupDensity(temperature, specificGravity);
  return specificGravity * correctionFactor;
}
