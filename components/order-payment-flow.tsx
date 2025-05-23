"use client"

import { useState } from "react"
import { Loader2, CheckCircle, AlertTriangle, ArrowRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { submitToFinancePartner, requestPaymentDisbursement } from "@/lib/finance-service"
import { depositSavings } from "@/lib/savings-service"

interface OrderPaymentFlowProps {
  bidId: string
  buyerId: string
  buyerName: string
  groupId: string
  groupName: string
  produceType: string
  quantity: number
  pricePerKg: number
  totalAmount: number
  contributions: {
    farmerId: string
    farmerName: string
    quantity: number
    percentage: number
  }[]
  onComplete: (orderId: string) => void
}

export function OrderPaymentFlow({
  bidId,
  buyerId,
  buyerName,
  groupId,
  groupName,
  produceType,
  quantity,
  pricePerKg,
  totalAmount,
  contributions,
  onComplete,
}: OrderPaymentFlowProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [orderId, setOrderId] = useState<string | null>(null)
  const [financeResponse, setFinanceResponse] = useState<any | null>(null)
  const [downPaymentPercentage, setDownPaymentPercentage] = useState(30) // Default 30%
  const [estimatedDeliveryDate, setEstimatedDeliveryDate] = useState(
    new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
  ) // Default 7 days from now

  const totalSteps = 4
  const progress = (currentStep / totalSteps) * 100

  async function createOrder() {
    setIsLoading(true)
    setError(null)

    try {
      // In a real app, this would be an API call to create the order
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Generate a mock order ID
      const newOrderId = `ORD-${Date.now().toString().substring(7)}`
      setOrderId(newOrderId)

      // Move to next step
      setCurrentStep(2)
    } catch (err) {
      setError("Failed to create order. Please try again.")
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  async function submitFinancing() {
    if (!orderId) return

    setIsLoading(true)
    setError(null)

    try {
      const response = await submitToFinancePartner({
        orderId,
        buyerId,
        buyerName,
        groupId,
        groupName,
        produceType,
        quantity,
        pricePerKg,
        totalAmount,
        downPaymentPercentage,
        estimatedDeliveryDate,
        contributions,
      })

      setFinanceResponse(response)

      // Move to next step
      setCurrentStep(3)
    } catch (err) {
      setError("Failed to submit financing request. Please try again.")
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  async function processDownPayment() {
    if (!orderId || !financeResponse) return

    setIsLoading(true)
    setError(null)

    try {
      // Request disbursement from finance partner
      await requestPaymentDisbursement(orderId, "downpayment", financeResponse.downPaymentAmount)

      // Process savings for each farmer
      for (const contribution of contributions) {
        await depositSavings(contribution.farmerId, contribution.farmerName, orderId, contribution.quantity)
      }

      // Move to next step
      setCurrentStep(4)
    } catch (err) {
      setError("Failed to process down payment. Please try again.")
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  async function completeProcess() {
    if (!orderId) return
    onComplete(orderId)
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Order Payment Process</CardTitle>
        <CardDescription>Complete the following steps to process the order payment</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Progress</span>
            <span>
              Step {currentStep} of {totalSteps}
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {error && (
          <div className="rounded-md bg-red-50 p-4 text-sm text-red-800">
            <div className="flex">
              <AlertTriangle className="mr-2 h-5 w-5 text-red-400" />
              <span>{error}</span>
            </div>
          </div>
        )}

        {currentStep === 1 && (
          <div className="space-y-4">
            <div className="rounded-md bg-muted p-4">
              <h3 className="font-medium">Order Summary</h3>
              <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
                <div>
                  <p className="text-muted-foreground">Produce:</p>
                  <p className="font-medium">{produceType}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Quantity:</p>
                  <p className="font-medium">
                    {quantity} kg ({(quantity / 1000).toFixed(1)} tons)
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Price per kg:</p>
                  <p className="font-medium">KES {pricePerKg}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Total Amount:</p>
                  <p className="font-medium">KES {totalAmount.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Buyer:</p>
                  <p className="font-medium">{buyerName}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Group:</p>
                  <p className="font-medium">{groupName}</p>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="downPaymentPercentage">Down Payment Percentage</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="downPaymentPercentage"
                  type="number"
                  min="10"
                  max="50"
                  value={downPaymentPercentage}
                  onChange={(e) => setDownPaymentPercentage(Number.parseInt(e.target.value))}
                  className="w-24"
                />
                <span>%</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Down payment amount: KES {((totalAmount * downPaymentPercentage) / 100).toLocaleString()}
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="estimatedDeliveryDate">Estimated Delivery Date</Label>
              <Input
                id="estimatedDeliveryDate"
                type="date"
                value={estimatedDeliveryDate}
                onChange={(e) => setEstimatedDeliveryDate(e.target.value)}
              />
            </div>

            <div className="rounded-md bg-blue-50 p-4 text-sm text-blue-800">
              <p>
                <strong>Note:</strong> Creating an order will initiate the payment process with our finance partner.
              </p>
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div className="space-y-4">
            <div className="rounded-md bg-green-50 p-4 text-sm text-green-800">
              <div className="flex">
                <CheckCircle className="mr-2 h-5 w-5 text-green-400" />
                <div>
                  <p className="font-medium">Order Created Successfully</p>
                  <p>Order ID: {orderId}</p>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="font-medium">Finance Partner Details</h3>
              <p className="text-sm text-muted-foreground">
                The order will now be submitted to our finance partner (Finserve) for processing.
              </p>
            </div>

            <div className="rounded-md bg-muted p-4">
              <h4 className="text-sm font-medium">Payment Structure</h4>
              <div className="mt-2 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Down Payment ({downPaymentPercentage}%)</span>
                  <span>KES {((totalAmount * downPaymentPercentage) / 100).toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Balance ({100 - downPaymentPercentage}%)</span>
                  <span>KES {((totalAmount * (100 - downPaymentPercentage)) / 100).toLocaleString()}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-medium">
                  <span>Total</span>
                  <span>KES {totalAmount.toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="font-medium">Farmer Contributions</h3>
              <div className="max-h-60 overflow-y-auto rounded-md border">
                <table className="w-full text-sm">
                  <thead className="bg-muted">
                    <tr>
                      <th className="p-2 text-left">Farmer</th>
                      <th className="p-2 text-right">Quantity (kg)</th>
                      <th className="p-2 text-right">Percentage</th>
                      <th className="p-2 text-right">Amount (KES)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {contributions.map((contribution, index) => (
                      <tr key={index} className="border-t">
                        <td className="p-2">{contribution.farmerName}</td>
                        <td className="p-2 text-right">{contribution.quantity}</td>
                        <td className="p-2 text-right">{contribution.percentage.toFixed(1)}%</td>
                        <td className="p-2 text-right">
                          {Math.round((totalAmount * contribution.percentage) / 100).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {currentStep === 3 && financeResponse && (
          <div className="space-y-4">
            <div className="rounded-md bg-green-50 p-4 text-sm text-green-800">
              <div className="flex">
                <CheckCircle className="mr-2 h-5 w-5 text-green-400" />
                <div>
                  <p className="font-medium">Financing Approved</p>
                  <p>Reference ID: {financeResponse.referenceId}</p>
                </div>
              </div>
            </div>

            <div className="rounded-md bg-muted p-4">
              <h3 className="font-medium">Payment Details</h3>
              <div className="mt-2 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Down Payment</span>
                  <span>KES {financeResponse.downPaymentAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Balance (upon delivery)</span>
                  <span>KES {financeResponse.balanceAmount.toLocaleString()}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-medium">
                  <span>Total</span>
                  <span>KES {totalAmount.toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="font-medium">Disbursement Information</h3>
              <p className="text-sm text-muted-foreground">
                The down payment will be disbursed to farmers based on their contribution percentages. Each farmer will
                also have KES 2/kg of their contribution automatically saved in the Africa Alliance Money Market Fund.
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="font-medium">Compulsory Savings</h3>
              <div className="rounded-md border p-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">KES 2/kg saved</p>
                    <p className="text-sm text-muted-foreground">
                      Total: KES {(quantity * 2).toLocaleString()} ({quantity} kg)
                    </p>
                  </div>
                  <Badge className="bg-blue-100 text-blue-800">Africa Alliance MMF</Badge>
                </div>
              </div>
            </div>
          </div>
        )}

        {currentStep === 4 && (
          <div className="space-y-4">
            <div className="rounded-md bg-green-50 p-4 text-center">
              <CheckCircle className="mx-auto h-12 w-12 text-green-500" />
              <h3 className="mt-2 text-lg font-medium text-green-800">Payment Process Complete</h3>
              <p className="mt-1 text-sm text-green-600">
                The down payment has been processed and savings have been allocated.
              </p>
            </div>

            <div className="rounded-md bg-muted p-4">
              <h3 className="font-medium">Next Steps</h3>
              <ul className="mt-2 space-y-2 text-sm">
                <li className="flex items-start">
                  <ArrowRight className="mr-2 h-4 w-4" />
                  <span>The group will prepare the produce for delivery.</span>
                </li>
                <li className="flex items-start">
                  <ArrowRight className="mr-2 h-4 w-4" />
                  <span>External quality control will verify the produce before delivery.</span>
                </li>
                <li className="flex items-start">
                  <ArrowRight className="mr-2 h-4 w-4" />
                  <span>Upon buyer confirmation, the balance payment will be processed.</span>
                </li>
                <li className="flex items-start">
                  <ArrowRight className="mr-2 h-4 w-4" />
                  <span>Farmers can track their savings in their profile.</span>
                </li>
              </ul>
            </div>

            <div className="rounded-md bg-blue-50 p-4 text-sm text-blue-800">
              <p>
                <strong>Order ID:</strong> {orderId}
              </p>
              <p>
                <strong>Finance Reference:</strong> {financeResponse?.referenceId}
              </p>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        {currentStep > 1 && currentStep < 4 && (
          <Button variant="outline" onClick={() => setCurrentStep(currentStep - 1)} disabled={isLoading}>
            Back
          </Button>
        )}
        {currentStep === 1 && (
          <Button onClick={createOrder} disabled={isLoading} className="ml-auto">
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Create Order
          </Button>
        )}
        {currentStep === 2 && (
          <Button onClick={submitFinancing} disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Submit to Finance Partner
          </Button>
        )}
        {currentStep === 3 && (
          <Button onClick={processDownPayment} disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Process Down Payment
          </Button>
        )}
        {currentStep === 4 && (
          <Button onClick={completeProcess} className="ml-auto">
            Complete
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}
