// Shell Correction Factor (SCF) lookup table
// Temperature (°C) -> Correction Factor

export const SCF_TABLE: Record<number, number> = {
  10: 0.999640,
  11: 0.999676,
  12: 0.999712,
  13: 0.999748,
  14: 0.999784,
  15: 0.999820,
  16: 0.999856,
  17: 0.999892,
  18: 0.999928,
  19: 0.999964,
  20: 1.000000,
  21: 1.000036,
  22: 1.000072,
  23: 1.000108,
  24: 1.000144,
  25: 1.000180,
  26: 1.000216,
  27: 1.000252,
  28: 1.000288,
  29: 1.000324,
  30: 1.000360,
  31: 1.000396,
  32: 1.000432,
  33: 1.000468,
  34: 1.000504,
  35: 1.000540,
  36: 1.000576,
  37: 1.000612,
  38: 1.000648,
  39: 1.000684,
  40: 1.000720,
  41: 1.000756,
  42: 1.000792,
  43: 1.000828,
  44: 1.000864,
  45: 1.000900,
  46: 1.000936,
  47: 1.000972,
  48: 1.001008,
  49: 1.001044,
  50: 1.001080,
  51: 1.001116,
  52: 1.001152,
  53: 1.001188,
  54: 1.001224,
  55: 1.001260,
  56: 1.001296,
  57: 1.001332,
  58: 1.001368,
  59: 1.001404,
  60: 1.001440,
  61: 1.001476,
  62: 1.001512,
  63: 1.001548,
  64: 1.001584,
  65: 1.001620,
  66: 1.001656,
  67: 1.001692,
  68: 1.001728,
  69: 1.001764,
};

/**
 * Lookup Shell Correction Factor with linear interpolation
 * @param temperature - Shell temperature in °C
 * @returns Shell Correction Factor
 */
export function lookupSCF(temperature: number): number {
  const temps = Object.keys(SCF_TABLE).map(Number).sort((a, b) => a - b);
  const minTemp = temps[0];
  const maxTemp = temps[temps.length - 1];

  // Clamp temperature to valid range
  if (temperature <= minTemp) return SCF_TABLE[minTemp];
  if (temperature >= maxTemp) return SCF_TABLE[maxTemp];

  // Find surrounding temperatures for interpolation
  const lowerTemp = Math.floor(temperature);
  const upperTemp = Math.ceil(temperature);

  if (lowerTemp === upperTemp) return SCF_TABLE[lowerTemp];

  // Linear interpolation
  const lowerSCF = SCF_TABLE[lowerTemp];
  const upperSCF = SCF_TABLE[upperTemp];
  const fraction = temperature - lowerTemp;

  return lowerSCF + fraction * (upperSCF - lowerSCF);
}
