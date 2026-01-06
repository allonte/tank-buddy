// Tank 207 Capacity Lookup Table
// Height (mm) to Volume (Liters) mapping from calibration certificate
// Reference: 20257001051EN-207

export const CAPACITY_TABLE: Record<number, number> = {
  0: 66,
  1: 74,
  2: 81,
  3: 89,
  4: 96,
  5: 104,
  6: 111,
  7: 118,
  8: 126,
  9: 133,
  10: 140,
  11: 148,
  12: 156,
  13: 164,
  14: 172,
  15: 180,
  16: 188,
  17: 197,
  18: 205,
  19: 214,
  20: 223,
  21: 232,
  22: 241,
  23: 250,
  24: 259,
  25: 269,
  26: 278,
  27: 288,
  28: 298,
  29: 307,
  30: 317,
  31: 327,
  32: 337,
  33: 347,
  34: 357,
  35: 367,
  36: 377,
  37: 388,
  38: 398,
  39: 408,
  40: 419,
  41: 430,
  42: 440,
  43: 451,
  44: 462,
  45: 473,
  46: 484,
  47: 495,
  48: 506,
  49: 518,
  50: 529,
  51: 540,
  52: 552,
  53: 564,
  54: 575,
  55: 587,
  56: 599,
  57: 610,
  58: 622,
  59: 634,
  60: 646,
  61: 658,
  62: 671,
  63: 683,
  64: 695,
  65: 707,
  66: 720,
  67: 733,
  68: 745,
  69: 758,
  70: 771,
  71: 784,
  72: 797,
  73: 810,
  74: 823,
  75: 836,
  76: 850,
  77: 863,
  78: 877,
  79: 890,
  80: 904,
  81: 917,
  82: 931,
  83: 945,
  84: 959,
  85: 973,
  86: 987,
  87: 1001,
  88: 1015,
  89: 1030,
  90: 1044,
  91: 1058,
  92: 1073,
  93: 1087,
  94: 1102,
  95: 1117,
  96: 1131,
  97: 1146,
  98: 1161,
  99: 1176,
  100: 1191,
  101: 1206,
  102: 1221,
  103: 1237,
  104: 1252,
  105: 1267,
  106: 1283,
  107: 1298,
  108: 1314,
  109: 1329,
  110: 1345,
  111: 1361,
  112: 1376,
  113: 1392,
  114: 1408,
  115: 1424,
  116: 1440,
  117: 1456,
  118: 1473,
  119: 1489,
  120: 1505,
  121: 1521,
  122: 1538,
  123: 1554,
  124: 1571,
  125: 1587,
  126: 1604,
  127: 1621,
  128: 1638,
  129: 1654,
  130: 1671,
  131: 1688,
  132: 1705,
  133: 1722,
  134: 1739,
  135: 1756,
  136: 1774,
  137: 1791,
};

/**
 * Lookup volume from height with linear interpolation for values between entries
 */
export function lookupCapacity(heightMm: number): number {
  const heights = Object.keys(CAPACITY_TABLE).map(Number).sort((a, b) => a - b);
  const minHeight = heights[0];
  const maxHeight = heights[heights.length - 1];

  if (heightMm <= minHeight) return CAPACITY_TABLE[minHeight];
  if (heightMm >= maxHeight) return CAPACITY_TABLE[maxHeight];

  // Find surrounding entries for interpolation
  const lowerHeight = Math.floor(heightMm);
  const upperHeight = Math.ceil(heightMm);

  if (lowerHeight === upperHeight) {
    return CAPACITY_TABLE[lowerHeight] || 0;
  }

  const lowerVolume = CAPACITY_TABLE[lowerHeight];
  const upperVolume = CAPACITY_TABLE[upperHeight];

  if (lowerVolume === undefined || upperVolume === undefined) {
    // Find nearest known values
    let lower = lowerHeight;
    let upper = upperHeight;
    while (CAPACITY_TABLE[lower] === undefined && lower > minHeight) lower--;
    while (CAPACITY_TABLE[upper] === undefined && upper < maxHeight) upper++;
    
    const lv = CAPACITY_TABLE[lower] || 0;
    const uv = CAPACITY_TABLE[upper] || 0;
    const ratio = (heightMm - lower) / (upper - lower);
    return Math.round(lv + ratio * (uv - lv));
  }

  // Linear interpolation
  const ratio = heightMm - lowerHeight;
  return Math.round(lowerVolume + ratio * (upperVolume - lowerVolume));
}

/**
 * Reverse lookup: find height from volume
 */
export function lookupHeight(volumeLiters: number): number {
  const entries = Object.entries(CAPACITY_TABLE)
    .map(([h, v]) => ({ height: Number(h), volume: v }))
    .sort((a, b) => a.volume - b.volume);

  const minVolume = entries[0].volume;
  const maxVolume = entries[entries.length - 1].volume;

  if (volumeLiters <= minVolume) return entries[0].height;
  if (volumeLiters >= maxVolume) return entries[entries.length - 1].height;

  // Find surrounding entries
  let lower = entries[0];
  let upper = entries[entries.length - 1];

  for (let i = 0; i < entries.length - 1; i++) {
    if (entries[i].volume <= volumeLiters && entries[i + 1].volume >= volumeLiters) {
      lower = entries[i];
      upper = entries[i + 1];
      break;
    }
  }

  // Linear interpolation
  const ratio = (volumeLiters - lower.volume) / (upper.volume - lower.volume);
  return Math.round(lower.height + ratio * (upper.height - lower.height));
}

export const MAX_CALIBRATED_HEIGHT = Math.max(...Object.keys(CAPACITY_TABLE).map(Number));
export const MAX_CALIBRATED_VOLUME = CAPACITY_TABLE[MAX_CALIBRATED_HEIGHT];
