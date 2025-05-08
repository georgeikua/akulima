"use client"

import { useState } from "react"
import { MessageSquare } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"

interface SMSNotificationProps {
  recipients: string[]
  defaultMessage?: string
  onSuccess?: () => void
}

export function SMSNotification({ recipients, defaultMessage = "", onSuccess }: SMSNotificationProps) {
  const [open, setOpen] = useState(false)
  const [message, setMessage] = useState(defaultMessage)
  const [isSending, setIsSending] = useState(false)
  const { toast } = useToast()

  const handleSend = async () => {
    if (!message.trim()) {
      toast({
        title: "Message Required",
        description: "Please enter a message to send.",
        variant: "destructive",
      })
      return
    }

    setIsSending(true)

    try {
      // Send SMS to each recipient
      const results = await Promise.all(
        recipients.map(async (to) => {
          const response = await fetch("/api/sms", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ to, message }),
          })

          return response.json()
        }),
      )

      const successCount = results.filter((r) => r.success).length
      const failCount = results.length - successCount

      if (successCount > 0) {
        toast({
          title: "SMS Sent Successfully",
          description: `${successCount} message(s) sent successfully${failCount > 0 ? `, ${failCount} failed` : ""}`,
        })

        if (onSuccess) {
          onSuccess()
        }
      } else {
        toast({
          title: "Failed to Send SMS",
          description: "All messages failed to send. Please try again.",
          variant: "destructive",
        })
      }

      setOpen(false)
    } catch (error) {
      console.error("SMS sending error:", error)
      toast({
        title: "Error",
        description: "Failed to send SMS. Please try again later.",
        variant: "destructive",
      })
    } finally {
      setIsSending(false)
    }
  }

  return (
    <>
      <Button variant="outline" onClick={() => setOpen(true)}>
        <MessageSquare className="mr-2 h-4 w-4" />
        Send SMS
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Send SMS Notification</DialogTitle>
            <DialogDescription>
              Send an SMS message to {recipients.length} recipient{recipients.length !== 1 ? "s" : ""}.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <Textarea
              placeholder="Enter your message here..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="min-h-[100px]"
            />
            <p className="text-xs text-muted-foreground">
              Character count: {message.length} ({Math.ceil(message.length / 160)} SMS)
            </p>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="button" onClick={handleSend} disabled={isSending}>
              {isSending ? "Sending..." : "Send Message"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
