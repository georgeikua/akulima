"use client"

import { useState } from "react"
import { PhoneInput } from "react-international-phone"
import "react-international-phone/style.css"

import { Button } from "@/components/ui/button"
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
import { Loader2 } from "lucide-react"

interface MpesaPaymentProps {
  amount: number
  reference: string
  onSuccess?: () => void
  onError?: (error: string) => void
}

export function MpesaPayment({ amount, reference, onSuccess, onError }: MpesaPaymentProps) {
  const [phone, setPhone] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [open, setOpen] = useState(false)

  const handlePayment = async () => {
    if (!phone) {
      setError("Please enter a phone number")
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/mpesa", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          phone,
          amount,
          reference,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to process payment")
      }

      setSuccess(true)
      if (onSuccess) {
        onSuccess()
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An unknown error occurred"
      setError(errorMessage)
      if (onError) {
        onError(errorMessage)
      }
    } finally {
      setIsLoading(false)
    }
  }

  const resetForm = () => {
    setSuccess(false)
    setError(null)
    setPhone("")
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Pay with M-Pesa</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>M-Pesa Payment</DialogTitle>
          <DialogDescription>Enter your phone number to receive a payment prompt.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {success ? (
            <div className="flex flex-col items-center justify-center gap-2 p-4 text-center">
              <div className="rounded-full bg-green-100 p-2 text-green-600">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-lg font-medium">Payment Initiated</h3>
              <p className="text-sm text-muted-foreground">
                Please check your phone for the M-Pesa prompt to complete your payment.
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="phone" className="text-right">
                  Phone
                </Label>
                <div className="col-span-3">
                  <PhoneInput
                    defaultCountry="ke"
                    value={phone}
                    onChange={(phone) => setPhone(phone)}
                    inputClassName="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  />
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Amount</Label>
                <div className="col-span-3">
                  <div className="flex h-10 items-center rounded-md border border-input bg-muted px-3 text-sm">
                    KES {amount.toFixed(2)}
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Reference</Label>
                <div className="col-span-3">
                  <div className="flex h-10 items-center rounded-md border border-input bg-muted px-3 text-sm">
                    {reference}
                  </div>
                </div>
              </div>
              {error && <div className="col-span-4 text-center text-sm text-red-500">{error}</div>}
            </>
          )}
        </div>
        <DialogFooter>
          {success ? (
            <Button onClick={() => setOpen(false)}>Close</Button>
          ) : (
            <>
              <Button variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handlePayment} disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isLoading ? "Processing..." : "Pay Now"}
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
