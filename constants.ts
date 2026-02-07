
export const KYAT_TO_PAE = 16;
export const PAE_TO_YWAY = 8;
export const KYAT_TO_YWAY = KYAT_TO_PAE * PAE_TO_YWAY; // 128

// Systems
export const SYSTEM_GRAMS = {
  OLD: 16.606, // Traditional Academy
  NEW: 16.329  // Modern / New Standard
};

// Global Conversion
export const TROY_OUNCE_TO_GRAMS = 31.1034768;
export const DEFAULT_USD_MMK = 4500; // Estimated market rate for simulation

export const DEFAULT_GOLD_PRICE = 4500000;

export const GOLD_PURITIES = [
  { label: 'Academy (16 Pae)', value: 16, description: 'High Purity (24K)' },
  { label: '15 Pae', value: 15, description: 'Standard Jewelry' },
  { label: '14 Pae 2 Yway', value: 14.25, description: 'Standard 14/2' },
  { label: '13 Pae', value: 13, description: 'Economy Grade' },
];
