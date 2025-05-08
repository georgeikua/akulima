// Savings management service

export interface SavingsTransaction {
  id: string
  farmerId: string
  orderId: string
  amount: number
  date: string
  type: "deposit" | "withdrawal" | "interest"
  balance: number
}

export interface FarmerSavings {
  farmerId: string
  farmerName: string
  totalSavings: number
  availableForWithdrawal: number
  lastUpdated: string
  transactions: SavingsTransaction[]
  annualInterestRate: number
  lastRolloverDate?: string
}

// Mock database for savings (in a real app, this would be in a database)
const savingsDb = new Map<string, FarmerSavings>()

export async function depositSavings(
  farmerId: string,
  farmerName: string,
  orderId: string,
  quantity: number,
): Promise<SavingsTransaction> {
  const savingsPerKg = 2 // KES 2 per kg
  const amount = quantity * savingsPerKg

  // Get or create farmer savings record
  let farmerSavings = savingsDb.get(farmerId)

  if (!farmerSavings) {
    farmerSavings = {
      farmerId,
      farmerName,
      totalSavings: 0,
      availableForWithdrawal: 0,
      lastUpdated: new Date().toISOString(),
      transactions: [],
      annualInterestRate: 8, // 8% annual interest rate
    }
  }

  // Create transaction
  const transaction: SavingsTransaction = {
    id: `SAV-${Date.now().toString().substring(7)}`,
    farmerId,
    orderId,
    amount,
    date: new Date().toISOString(),
    type: "deposit",
    balance: farmerSavings.totalSavings + amount,
  }

  // Update farmer savings
  farmerSavings.totalSavings += amount
  farmerSavings.availableForWithdrawal += amount
  farmerSavings.lastUpdated = new Date().toISOString()
  farmerSavings.transactions.push(transaction)

  // Save to mock database
  savingsDb.set(farmerId, farmerSavings)

  return transaction
}

export async function getFarmerSavings(farmerId: string): Promise<FarmerSavings | null> {
  return savingsDb.get(farmerId) || null
}

export async function withdrawSavings(
  farmerId: string,
  amount: number,
): Promise<{ success: boolean; transaction?: SavingsTransaction; error?: string }> {
  const farmerSavings = savingsDb.get(farmerId)

  if (!farmerSavings) {
    return { success: false, error: "Farmer savings record not found" }
  }

  if (amount > farmerSavings.availableForWithdrawal) {
    return { success: false, error: "Insufficient funds available for withdrawal" }
  }

  // Create transaction
  const transaction: SavingsTransaction = {
    id: `SAV-${Date.now().toString().substring(7)}`,
    farmerId,
    orderId: "withdrawal",
    amount: -amount, // Negative amount for withdrawal
    date: new Date().toISOString(),
    type: "withdrawal",
    balance: farmerSavings.totalSavings - amount,
  }

  // Update farmer savings
  farmerSavings.totalSavings -= amount
  farmerSavings.availableForWithdrawal -= amount
  farmerSavings.lastUpdated = new Date().toISOString()
  farmerSavings.transactions.push(transaction)

  // Save to mock database
  savingsDb.set(farmerId, farmerSavings)

  return { success: true, transaction }
}

export async function applyAnnualInterest(farmerId: string): Promise<{ success: boolean; interestAmount?: number }> {
  const farmerSavings = savingsDb.get(farmerId)

  if (!farmerSavings) {
    return { success: false }
  }

  const interestRate = farmerSavings.annualInterestRate / 100
  const interestAmount = Math.round(farmerSavings.totalSavings * interestRate)

  // Create transaction
  const transaction: SavingsTransaction = {
    id: `SAV-${Date.now().toString().substring(7)}`,
    farmerId,
    orderId: "interest",
    amount: interestAmount,
    date: new Date().toISOString(),
    type: "interest",
    balance: farmerSavings.totalSavings + interestAmount,
  }

  // Update farmer savings
  farmerSavings.totalSavings += interestAmount
  farmerSavings.availableForWithdrawal += interestAmount
  farmerSavings.lastUpdated = new Date().toISOString()
  farmerSavings.transactions.push(transaction)
  farmerSavings.lastRolloverDate = new Date().toISOString()

  // Save to mock database
  savingsDb.set(farmerId, farmerSavings)

  return { success: true, interestAmount }
}
