"use client"

import { useState, useEffect } from "react"
import { format } from "date-fns"
import { Wallet, TrendingUp, Calendar, ArrowUpRight, ArrowDownRight, Coins } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { getFarmerSavings, withdrawSavings, type SavingsTransaction } from "@/lib/savings-service"

interface FarmerSavingsDashboardProps {
  farmerId: string
  farmerName: string
}

export function FarmerSavingsDashboard({ farmerId, farmerName }: FarmerSavingsDashboardProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [savingsData, setSavingsData] = useState<any | null>(null)
  const [withdrawalAmount, setWithdrawalAmount] = useState("")
  const [withdrawalError, setWithdrawalError] = useState<string | null>(null)
  const [withdrawalSuccess, setWithdrawalSuccess] = useState(false)

  useEffect(() => {
    async function loadSavingsData() {
      setIsLoading(true)
      try {
        const data = await getFarmerSavings(farmerId)

        // If no data exists yet, create mock data for demonstration
        if (!data) {
          setSavingsData({
            farmerId,
            farmerName,
            totalSavings: 25000,
            availableForWithdrawal: 20000,
            lastUpdated: new Date().toISOString(),
            annualInterestRate: 8,
            lastRolloverDate: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000).toISOString(), // 6 months ago
            transactions: [
              {
                id: "sav-001",
                farmerId,
                orderId: "ord-123",
                amount: 5000,
                date: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000).toISOString(),
                type: "deposit",
                balance: 5000,
              },
              {
                id: "sav-002",
                farmerId,
                orderId: "ord-456",
                amount: 8000,
                date: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000).toISOString(),
                type: "deposit",
                balance: 13000,
              },
              {
                id: "sav-003",
                farmerId,
                orderId: "interest",
                amount: 1040,
                date: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
                type: "interest",
                balance: 14040,
              },
              {
                id: "sav-004",
                farmerId,
                orderId: "ord-789",
                amount: 12000,
                date: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
                type: "deposit",
                balance: 26040,
              },
              {
                id: "sav-005",
                farmerId,
                orderId: "withdrawal",
                amount: -5000,
                date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
                type: "withdrawal",
                balance: 21040,
              },
              {
                id: "sav-006",
                farmerId,
                orderId: "interest",
                amount: 1683,
                date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
                type: "interest",
                balance: 22723,
              },
              {
                id: "sav-007",
                farmerId,
                orderId: "ord-101",
                amount: 2277,
                date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
                type: "deposit",
                balance: 25000,
              },
            ],
          })
        } else {
          setSavingsData(data)
        }
      } catch (error) {
        console.error("Error loading savings data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadSavingsData()
  }, [farmerId, farmerName])

  async function handleWithdrawal() {
    setWithdrawalError(null)
    setWithdrawalSuccess(false)

    const amount = Number.parseFloat(withdrawalAmount)
    if (isNaN(amount) || amount <= 0) {
      setWithdrawalError("Please enter a valid amount")
      return
    }

    if (amount > (savingsData?.availableForWithdrawal || 0)) {
      setWithdrawalError("Withdrawal amount exceeds available balance")
      return
    }

    try {
      const result = await withdrawSavings(farmerId, amount)
      if (result.success) {
        setWithdrawalSuccess(true)
        // Update local state
        setSavingsData((prev: any) => ({
          ...prev,
          totalSavings: prev.totalSavings - amount,
          availableForWithdrawal: prev.availableForWithdrawal - amount,
          transactions: [result.transaction, ...prev.transactions],
        }))
        setWithdrawalAmount("")
      } else {
        setWithdrawalError(result.error || "Failed to process withdrawal")
      }
    } catch (error) {
      console.error("Error processing withdrawal:", error)
      setWithdrawalError("An error occurred while processing your withdrawal")
    }
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Savings Dashboard</CardTitle>
          <CardDescription>Loading your savings information...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="h-8 w-full animate-pulse rounded-md bg-muted" />
            <div className="h-32 w-full animate-pulse rounded-md bg-muted" />
            <div className="h-64 w-full animate-pulse rounded-md bg-muted" />
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!savingsData) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Savings Dashboard</CardTitle>
          <CardDescription>No savings information available</CardDescription>
        </CardHeader>
        <CardContent>
          <p>You don't have any savings records yet. Savings are automatically created when you fulfill orders.</p>
        </CardContent>
      </Card>
    )
  }

  // Calculate time until next annual rollover
  const lastRollover = savingsData.lastRolloverDate ? new Date(savingsData.lastRolloverDate) : new Date()
  const nextRollover = new Date(lastRollover)
  nextRollover.setFullYear(nextRollover.getFullYear() + 1)
  const daysUntilRollover = Math.max(0, Math.floor((nextRollover.getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
  const rolloverProgress = 100 - (daysUntilRollover / 365) * 100

  // Calculate projected interest
  const projectedInterest = (savingsData.totalSavings * savingsData.annualInterestRate) / 100

  return (
    <Card>
      <CardHeader>
        <CardTitle>Savings Dashboard</CardTitle>
        <CardDescription>Manage your compulsory savings with Africa Alliance MMF</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-primary/10 p-2">
                  <Wallet className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Savings</p>
                  <p className="text-2xl font-bold">KES {savingsData.totalSavings.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-green-100 p-2">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Interest Rate</p>
                  <p className="text-2xl font-bold">{savingsData.annualInterestRate}% p.a.</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-blue-100 p-2">
                  <Calendar className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Next Annual Rollover</p>
                  <p className="text-2xl font-bold">{daysUntilRollover} days</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Annual Rollover Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Progress</span>
                <span>{Math.round(rolloverProgress)}%</span>
              </div>
              <Progress value={rolloverProgress} className="h-2" />
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Last rollover: {format(new Date(lastRollover), "MMM d, yyyy")}</span>
                <span>Next rollover: {format(new Date(nextRollover), "MMM d, yyyy")}</span>
              </div>
            </div>
            <div className="mt-4 rounded-md bg-muted p-3">
              <div className="flex justify-between">
                <div>
                  <p className="text-sm font-medium">Projected Interest</p>
                  <p className="text-lg font-bold text-primary">KES {projectedInterest.toLocaleString()}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">Total After Rollover</p>
                  <p className="text-lg font-bold">
                    KES {(savingsData.totalSavings + projectedInterest).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="transactions">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="transactions">Transaction History</TabsTrigger>
            <TabsTrigger value="withdraw">Withdraw Funds</TabsTrigger>
          </TabsList>
          <TabsContent value="transactions" className="space-y-4">
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Reference</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead className="text-right">Balance</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {savingsData.transactions.map((transaction: SavingsTransaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell>{format(new Date(transaction.date), "MMM d, yyyy")}</TableCell>
                      <TableCell>
                        {transaction.type === "deposit" ? (
                          <Badge className="bg-green-100 text-green-800">Deposit</Badge>
                        ) : transaction.type === "withdrawal" ? (
                          <Badge className="bg-orange-100 text-orange-800">Withdrawal</Badge>
                        ) : (
                          <Badge className="bg-blue-100 text-blue-800">Interest</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        {transaction.orderId === "withdrawal"
                          ? "Withdrawal"
                          : transaction.orderId === "interest"
                            ? "Annual Interest"
                            : `Order #${transaction.orderId}`}
                      </TableCell>
                      <TableCell className="text-right">
                        <span
                          className={
                            transaction.amount > 0
                              ? "flex items-center justify-end text-green-600"
                              : "flex items-center justify-end text-red-600"
                          }
                        >
                          {transaction.amount > 0 ? (
                            <ArrowUpRight className="mr-1 h-4 w-4" />
                          ) : (
                            <ArrowDownRight className="mr-1 h-4 w-4" />
                          )}
                          KES {Math.abs(transaction.amount).toLocaleString()}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">KES {transaction.balance.toLocaleString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
          <TabsContent value="withdraw" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Withdraw Funds</CardTitle>
                <CardDescription>
                  You can withdraw from your available balance. Annual withdrawals are limited to once per year.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-md bg-muted p-4">
                  <div className="flex justify-between">
                    <div>
                      <p className="text-sm font-medium">Available for Withdrawal</p>
                      <p className="text-2xl font-bold">KES {savingsData.availableForWithdrawal.toLocaleString()}</p>
                    </div>
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                      <Coins className="h-6 w-6 text-primary" />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="withdrawalAmount">Withdrawal Amount</Label>
                  <div className="flex items-center gap-2">
                    <span className="text-sm">KES</span>
                    <Input
                      id="withdrawalAmount"
                      type="number"
                      placeholder="Enter amount"
                      value={withdrawalAmount}
                      onChange={(e) => setWithdrawalAmount(e.target.value)}
                      min={1}
                      max={savingsData.availableForWithdrawal}
                    />
                  </div>
                  {withdrawalError && <p className="text-sm text-red-500">{withdrawalError}</p>}
                  {withdrawalSuccess && <p className="text-sm text-green-500">Withdrawal processed successfully!</p>}
                </div>

                <div className="rounded-md bg-amber-50 p-3 text-sm text-amber-800">
                  <p>
                    <strong>Note:</strong> Withdrawals will be processed via M-Pesa to your registered phone number.
                    Processing may take up to 24 hours.
                  </p>
                </div>
              </CardContent>
              <CardFooter>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="w-full">Withdraw Funds</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Confirm Withdrawal</DialogTitle>
                      <DialogDescription>
                        You are about to withdraw KES {Number.parseFloat(withdrawalAmount || "0").toLocaleString()} from
                        your savings account.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="rounded-md bg-muted p-3">
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Withdrawal Amount:</span>
                          <span className="font-medium">
                            KES {Number.parseFloat(withdrawalAmount || "0").toLocaleString()}
                          </span>
                        </div>
                        <div className="mt-2 flex justify-between">
                          <span className="text-sm text-muted-foreground">Remaining Balance:</span>
                          <span className="font-medium">
                            KES{" "}
                            {(savingsData.totalSavings - Number.parseFloat(withdrawalAmount || "0")).toLocaleString()}
                          </span>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        The funds will be sent to your registered M-Pesa number. Do you want to proceed?
                      </p>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => {}}>
                        Cancel
                      </Button>
                      <Button onClick={handleWithdrawal}>Confirm Withdrawal</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
