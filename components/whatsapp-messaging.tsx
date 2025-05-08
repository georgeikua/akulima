"use client"

import { useState } from "react"
import { Loader2, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

const messageTemplates = [
  {
    id: "market_request",
    name: "Market Request Alert",
    description: "Notify farmers about a new market request",
    params: ["produce_type", "quantity", "price", "deadline"],
  },
  {
    id: "order_confirmation",
    name: "Order Confirmation",
    description: "Confirm an order has been placed",
    params: ["order_id", "produce_type", "delivery_date"],
  },
  {
    id: "pickup_scheduled",
    name: "Pickup Scheduled",
    description: "Notify farmer about scheduled pickup",
    params: ["date", "time", "transporter_name", "transporter_phone"],
  },
  {
    id: "payment_processed",
    name: "Payment Processed",
    description: "Confirm payment has been processed",
    params: ["amount", "order_id", "transaction_id"],
  },
  {
    id: "quality_inspection",
    name: "Quality Inspection",
    description: "Schedule a quality inspection",
    params: ["date", "time", "grader_name"],
  },
]

interface WhatsappMessagingProps {
  recipients?: string[]
  defaultTemplate?: string
  onSuccess?: () => void
  onError?: (error: string) => void
}

export function WhatsappMessaging({ recipients = [], defaultTemplate, onSuccess, onError }: WhatsappMessagingProps) {
  const [selectedTemplate, setSelectedTemplate] = useState(defaultTemplate || "")
  const [templateParams, setTemplateParams] = useState<Record<string, string>>({})
  const [recipient, setRecipient] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [open, setOpen] = useState(false)

  const currentTemplate = messageTemplates.find((template) => template.id === selectedTemplate)

  const handleParamChange = (param: string, value: string) => {
    setTemplateParams((prev) => ({
      ...prev,
      [param]: value,
    }))
  }

  const handleSendMessage = async () => {
    if (!recipient) {
      setError("Please enter a recipient phone number")
      return
    }

    if (!selectedTemplate) {
      setError("Please select a message template")
      return
    }

    // Check if all required parameters are filled
    if (currentTemplate) {
      const missingParams = currentTemplate.params.filter(
        (param) => !templateParams[param] || templateParams[param].trim() === "",
      )

      if (missingParams.length > 0) {
        setError(`Please fill all required parameters: ${missingParams.join(", ")}`)
        return
      }
    }

    setIsLoading(true)
    setError(null)

    try {
      // Prepare the message payload
      const payload = {
        to: recipient,
        templateName: selectedTemplate,
        templateParams: currentTemplate?.params.map((param) => templateParams[param]) || [],
      }

      const response = await fetch("/api/whatsapp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to send WhatsApp message")
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
    setRecipient("")
    setTemplateParams({})
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Send className="mr-2 h-4 w-4" />
          Send WhatsApp Message
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Send WhatsApp Message</DialogTitle>
          <DialogDescription>
            Select a template and fill in the required parameters to send a WhatsApp message.
          </DialogDescription>
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
              <h3 className="text-lg font-medium">Message Sent</h3>
              <p className="text-sm text-muted-foreground">Your WhatsApp message has been successfully sent.</p>
            </div>
          ) : (
            <>
              <div className="grid gap-2">
                <Label htmlFor="recipient">Recipient Phone Number</Label>
                <Input
                  id="recipient"
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                  placeholder="e.g., +254712345678"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="template">Message Template</Label>
                <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
                  <SelectTrigger id="template">
                    <SelectValue placeholder="Select a template" />
                  </SelectTrigger>
                  <SelectContent>
                    {messageTemplates.map((template) => (
                      <SelectItem key={template.id} value={template.id}>
                        {template.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {currentTemplate && (
                <div className="grid gap-4">
                  <div className="rounded-md bg-muted p-3">
                    <p className="text-sm font-medium">{currentTemplate.name}</p>
                    <p className="text-xs text-muted-foreground">{currentTemplate.description}</p>
                  </div>
                  {currentTemplate.params.map((param) => (
                    <div key={param} className="grid gap-2">
                      <Label htmlFor={param}>
                        {param
                          .split("_")
                          .join(" ")
                          .replace(/\b\w/g, (l) => l.toUpperCase())}
                      </Label>
                      <Input
                        id={param}
                        value={templateParams[param] || ""}
                        onChange={(e) => handleParamChange(param, e.target.value)}
                        placeholder={`Enter ${param.split("_").join(" ")}`}
                      />
                    </div>
                  ))}
                </div>
              )}
              {error && <div className="text-center text-sm text-red-500">{error}</div>}
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
              <Button onClick={handleSendMessage} disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isLoading ? "Sending..." : "Send Message"}
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
