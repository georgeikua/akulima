"use client"

import { useState } from "react"
import { Download, Share2 } from "lucide-react"
import { QRCodeSVG } from "qrcode.react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { SMSNotification } from "@/components/sms-notification"

export type PaymentStatementMember = {
  id: string
  name: string
  phone: string
  contribution: number
  percentage: number
  amount: number
}

interface PaymentStatementProps {
  orderId: string
  orderTitle: string
  buyerName: string
  orderDate: string
  paymentDate: string
  orderTotal: number
  platformFee: number
  transportFee: number
  gradingFee: number
  members: PaymentStatementMember[]
  onSendSMS: (memberIds: string[]) => Promise<void>
}

export function PaymentStatement({
  orderId,
  orderTitle,
  buyerName,
  orderDate,
  paymentDate,
  orderTotal,
  platformFee,
  transportFee,
  gradingFee,
  members,
  onSendSMS,
}: PaymentStatementProps) {
  const [isSending, setIsSending] = useState(false)

  // Calculate total deductions
  const platformFeeAmount = (orderTotal * platformFee) / 100
  const totalDeductions = platformFeeAmount + transportFee + gradingFee
  const netAmount = orderTotal - totalDeductions

  // Calculate total distributed amount
  const totalDistributed = members.reduce((sum, member) => sum + member.amount, 0)

  // Generate statement URL for sharing
  const statementUrl = `${window.location.origin}/statements/${orderId}`

  // Generate SMS message
  const generateSmsMessage = (member: PaymentStatementMember) => {
    return `Akulima: Payment for order #${orderId} (${orderTitle}). Amount: KES ${member.amount}. View details: ${statementUrl}`
  }

  const handleSendAllSMS = async () => {
    setIsSending(true)
    try {
      await onSendSMS(members.map((m) => m.id))
    } finally {
      setIsSending(false)
    }
  }

  const handleDownloadStatement = () => {
    // In a real application, this would generate a PDF
    alert("Downloading statement as PDF...")
  }

  const handleShareStatement = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Payment Statement - Order #${orderId}`,
          text: `Payment statement for ${orderTitle} order from ${buyerName}`,
          url: statementUrl,
        })
      } catch (error) {
        console.error("Error sharing:", error)
      }
    } else {
      // Fallback for browsers that don't support the Web Share API
      navigator.clipboard.writeText(statementUrl)
      alert("Statement URL copied to clipboard!")
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Payment Statement</CardTitle>
          <CardDescription>
            Order #{orderId} - {orderTitle} from {buyerName}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium">Order Information</h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="text-muted-foreground">Order Date:</div>
                  <div>{orderDate}</div>
                  <div className="text-muted-foreground">Payment Date:</div>
                  <div>{paymentDate}</div>
                  <div className="text-muted-foreground">Buyer:</div>
                  <div>{buyerName}</div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium">Payment Breakdown</h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="text-muted-foreground">Order Total:</div>
                  <div>KES {orderTotal.toLocaleString()}</div>
                  <div className="text-muted-foreground">Platform Fee ({platformFee}%):</div>
                  <div>KES {platformFeeAmount.toLocaleString()}</div>
                  <div className="text-muted-foreground">Transport Fee:</div>
                  <div>KES {transportFee.toLocaleString()}</div>
                  <div className="text-muted-foreground">Grading Fee:</div>
                  <div>KES {gradingFee.toLocaleString()}</div>
                  <div className="text-muted-foreground font-medium">Total Deductions:</div>
                  <div className="font-medium">KES {totalDeductions.toLocaleString()}</div>
                  <div className="text-muted-foreground font-bold">Net Amount:</div>
                  <div className="font-bold text-primary">KES {netAmount.toLocaleString()}</div>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-center justify-center space-y-4 border rounded-lg p-6">
              <h3 className="text-lg font-medium">Statement QR Code</h3>
              <QRCodeSVG value={statementUrl} size={180} />
              <p className="text-sm text-muted-foreground text-center">
                Scan this QR code to view the payment statement online
              </p>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={handleShareStatement}>
                  <Share2 className="mr-2 h-4 w-4" />
                  Share
                </Button>
                <Button variant="outline" size="sm" onClick={handleDownloadStatement}>
                  <Download className="mr-2 h-4 w-4" />
                  Download
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Payment Distribution</CardTitle>
          <CardDescription>
            Distribution of KES {netAmount.toLocaleString()} among {members.length} members
          </CardDescription>
        </CardHeader>
        <CardContent>
          {members.length === 0 ? (
            <Alert>
              <AlertTitle>No contributions recorded</AlertTitle>
              <AlertDescription>
                There are no graded contributions for this order yet. Record and grade member contributions to see
                payment distribution.
              </AlertDescription>
            </Alert>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Member</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Contribution</TableHead>
                  <TableHead>Percentage</TableHead>
                  <TableHead className="text-right">Amount (KES)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {members.map((member) => (
                  <TableRow key={member.id}>
                    <TableCell className="font-medium">{member.name}</TableCell>
                    <TableCell>{member.phone}</TableCell>
                    <TableCell>{member.contribution.toFixed(2)}</TableCell>
                    <TableCell>{member.percentage.toFixed(2)}%</TableCell>
                    <TableCell className="text-right">{member.amount.toLocaleString()}</TableCell>
                  </TableRow>
                ))}
                <TableRow>
                  <TableCell colSpan={3} />
                  <TableCell className="font-bold">Total</TableCell>
                  <TableCell className="text-right font-bold">{totalDistributed.toLocaleString()}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <div className="text-sm text-muted-foreground">
            {members.length} members will receive payment based on their contribution
          </div>
          <div className="flex gap-2">
            <SMSNotification
              recipients={members.map((m) => m.phone)}
              defaultMessage={members.length > 0 ? generateSmsMessage(members[0]) : ""}
            />
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
