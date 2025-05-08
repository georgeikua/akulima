// Fee structure based on truck size and quantity
export type TruckSize = "1ton" | "2ton" | "3ton" | "4ton" | "5ton" | "6ton" | "7ton" | "8ton" | "10ton"

export interface FeeStructure {
  platformFeePercentage: number
  transportFeePerKg: number
  gradingFeePerKg: number
  financeFacilitationPercentage: number
  compulsorySavingsPerKg: number
}

export interface DeductionBreakdown {
  platformFee: number
  transportFee: number
  gradingFee: number
  financeFacilitationFee: number
  compulsorySavings: number
  totalDeductions: number
  netAmount: number
}

// Calculate fee structure based on truck size
export function getFeeStructure(truckSize: TruckSize): FeeStructure {
  // Base fee structure
  const baseStructure = {
    transportFeePerKg: 5,
    gradingFeePerKg: 2.5,
    financeFacilitationPercentage: 1,
    compulsorySavingsPerKg: 2,
  }

  // Determine platform fee percentage based on truck size
  let platformFeePercentage: number

  if (truckSize === "1ton" || truckSize === "2ton") {
    platformFeePercentage = 10
  } else if (truckSize === "3ton" || truckSize === "4ton") {
    platformFeePercentage = 8
  } else if (truckSize === "5ton" || truckSize === "6ton") {
    platformFeePercentage = 6
  } else {
    // 7ton and above
    platformFeePercentage = 5
  }

  return {
    ...baseStructure,
    platformFeePercentage,
  }
}

// Calculate deductions and net amount
export function calculateDeductions(totalAmount: number, quantity: number, truckSize: TruckSize): DeductionBreakdown {
  const feeStructure = getFeeStructure(truckSize)

  const platformFee = (totalAmount * feeStructure.platformFeePercentage) / 100
  const transportFee = quantity * feeStructure.transportFeePerKg
  const gradingFee = quantity * feeStructure.gradingFeePerKg
  const financeFacilitationFee = (totalAmount * feeStructure.financeFacilitationPercentage) / 100
  const compulsorySavings = quantity * feeStructure.compulsorySavingsPerKg

  const totalDeductions = platformFee + transportFee + gradingFee + financeFacilitationFee + compulsorySavings
  const netAmount = totalAmount - totalDeductions

  return {
    platformFee,
    transportFee,
    gradingFee,
    financeFacilitationFee,
    compulsorySavings,
    totalDeductions,
    netAmount,
  }
}

// Calculate price per kg after deductions
export function calculateNetPricePerKg(pricePerKg: number, truckSize: TruckSize): number {
  const feeStructure = getFeeStructure(truckSize)

  const platformFeePerKg = (pricePerKg * feeStructure.platformFeePercentage) / 100
  const financeFacilitationFeePerKg = (pricePerKg * feeStructure.financeFacilitationPercentage) / 100

  const totalDeductionsPerKg =
    platformFeePerKg +
    feeStructure.transportFeePerKg +
    feeStructure.gradingFeePerKg +
    financeFacilitationFeePerKg +
    feeStructure.compulsorySavingsPerKg

  return pricePerKg - totalDeductionsPerKg
}

// Get minimum quantity in kg
export function getMinimumQuantity(): number {
  return 1000 // 1 ton in kg
}
