
import { KYAT_TO_PAE, PAE_TO_YWAY } from '../constants';
import { GoldWeight } from '../types';

/**
 * Normalizes gold units: 8 Yway -> 1 Pae, 16 Pae -> 1 Kyat
 */
export const normalizeWeight = (weight: GoldWeight): GoldWeight => {
  let { kyat, pae, yway } = weight;

  // Handle Yway overflow
  if (yway >= PAE_TO_YWAY) {
    pae += Math.floor(yway / PAE_TO_YWAY);
    yway %= PAE_TO_YWAY;
  } else if (yway < 0) {
    yway = 0;
  }

  // Handle Pae overflow
  if (pae >= KYAT_TO_PAE) {
    kyat += Math.floor(pae / KYAT_TO_PAE);
    pae %= KYAT_TO_PAE;
  } else if (pae < 0) {
    pae = 0;
  }

  return { 
    kyat: Math.max(0, kyat), 
    pae: Math.max(0, pae), 
    yway: Math.max(0, yway) 
  };
};

export const convertToDecimalKyat = (kyat: number, pae: number, yway: number): number => {
  const totalPae = pae + (yway / PAE_TO_YWAY);
  const decimalKyat = kyat + (totalPae / KYAT_TO_PAE);
  return decimalKyat;
};

export const decimalToWeight = (decimal: number): GoldWeight => {
  const kyat = Math.floor(decimal);
  const remainingPae = (decimal - kyat) * KYAT_TO_PAE;
  const pae = Math.floor(remainingPae);
  const yway = Math.round((remainingPae - pae) * PAE_TO_YWAY * 1000) / 1000;
  return normalizeWeight({ kyat, pae, yway });
};

export const gramsToWeight = (grams: number, systemGrams: number): GoldWeight => {
  const decimalKyat = grams / systemGrams;
  return decimalToWeight(decimalKyat);
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('my-MM', {
    style: 'decimal',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount) + ' Ks';
};

export const calculateGoldSalesDetails = (
  weight: GoldWeight,
  pricePerKyat: number,
  handmadeFee: number = 0,
  stoneFee: number = 0,
  waste: GoldWeight = { kyat: 0, pae: 0, yway: 0 }
) => {
  const totalWeightKyat = convertToDecimalKyat(weight.kyat, weight.pae, weight.yway);
  const wasteWeightKyat = convertToDecimalKyat(waste.kyat, waste.pae, waste.yway);
  
  const pureGoldValue = totalWeightKyat * pricePerKyat;
  const wasteValue = wasteWeightKyat * pricePerKyat; // လျော့တွက် is additive
  
  const totalAmount = pureGoldValue + wasteValue + handmadeFee + stoneFee;
  
  return {
    pureGoldValue,
    wasteValue,
    handmadeFee,
    stoneFee,
    totalAmount,
    totalWeightKyat,
    wasteWeightKyat
  };
};
