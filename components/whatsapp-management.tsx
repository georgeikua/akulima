"use client"

import { useState } from "react"
import { Check, Copy, Download, Loader2, RefreshCw, Send } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

const commandExamples = [
  {
    command: "EARNINGS",
    description: "Returns total earnings and last payout",
    example:
      "💰 EARNINGS UPDATE\n\nHello [Name],\n\nThis season's total earnings: KES 24,500\n\nLast payout: KES 12,300 on 15/04/2023",
  },
  {
    command: "SAVINGS",
    description: "Returns savings balance and rollover info",
    example:
      "🏦 SAVINGS UPDATE\n\nHello [Name],\n\nTotal savings balance: KES 4,850\n\nAvailable for withdrawal: KES 3,200\n\nYour savings were rolled over on 01/04/2023",
  },
  {
    command: "LOAN",
    description: "Returns loan balance and next deduction",
    example:
      "💸 LOAN UPDATE\n\nHello [Name],\n\nOutstanding loan balance: KES 15,000\n\nNext deduction: KES 3,000 on 30/05/2023",
  },
  {
    command: "PROFILE",
    description: "Sends secure dashboard link",
    example:
      "🔐 SECURE DASHBOARD ACCESS\n\nHello [Name],\n\nAccess your personal dashboard here:\nhttps://akulima.africa/profile/view?token=abc123\n\nThis link expires in 30 minutes.",
  },
]

export function WhatsappManagement() {
  const [selectedTab, setSelectedTab] = useState("overview")
  const [testNumber, setTestNumber] = useState("")
  const [testCommand, setTestCommand] = useState("EARNINGS")
  const [isSending, setIsSending] = useState(false)
  const [sendResult, setSendResult] = useState<{ success: boolean; message: string } | null>(null)
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)
  const [isRefreshing, setIsRefreshing] = useState(false)

  const handleSendTest = async () => {
    if (!testNumber || !testCommand) return

    setIsSending(true)
    setSendResult(null)

    try {
      // Format phone number
      let formattedPhone = testNumber.replace(/\D/g, "")
      if (formattedPhone.startsWith("0")) {
        formattedPhone = "254" + formattedPhone.substring(1)
      } else if (formattedPhone.startsWith("+")) {
        formattedPhone = formattedPhone.substring(1)
      }

      // Send test message
      const response = await fetch("/api/whatsapp/test-command", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          phone: formattedPhone,
          command: testCommand,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setSendResult({
          success: true,
          message: "Test message sent successfully!",
        })
      } else {
        setSendResult({
          success: false,
          message: data.error || "Failed to send test message",
        })
      }
    } catch (error) {
      console.error("Error sending test message:", error)
      setSendResult({
        success: false,
        message: "An error occurred while sending the test message",
      })
    } finally {
      setIsSending(false)
    }
  }

  const handleCopyExample = (index: number) => {
    navigator.clipboard.writeText(commandExamples[index].example)
    setCopiedIndex(index)
    setTimeout(() => setCopiedIndex(null), 2000)
  }

  const handleRefreshStats = async () => {
    setIsRefreshing(true)

    try {
      // In a real app, this would fetch updated stats from the server
      await new Promise((resolve) => setTimeout(resolve, 1500))
    } catch (error) {
      console.error("Error refreshing stats:", error)
    } finally {
      setIsRefreshing(false)
    }
  }

  return (
    <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="commands">Commands</TabsTrigger>
        <TabsTrigger value="test">Test Tool</TabsTrigger>
      </TabsList>

      <TabsContent value="overview" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>WhatsApp Integration Statistics</CardTitle>
            <CardDescription>Overview of farmer interactions via WhatsApp</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="rounded-lg border p-3">
                <p className="text-sm font-medium text-muted-foreground">Total Messages</p>
                <p className="text-2xl font-bold">1,248</p>
                <p className="text-xs text-muted-foreground">Last 30 days</p>
              </div>
              <div className="rounded-lg border p-3">
                <p className="text-sm font-medium text-muted-foreground">Active Users</p>
                <p className="text-2xl font-bold">342</p>
                <p className="text-xs text-muted-foreground">Unique farmers</p>
              </div>
              <div className="rounded-lg border p-3">
                <p className="text-sm font-medium text-muted-foreground">Dashboard Views</p>
                <p className="text-2xl font-bold">518</p>
                <p className="text-xs text-muted-foreground">Via secure links</p>
              </div>
            </div>

            <div className="mt-6">
              <h3 className="mb-2 font-medium">Command Usage</h3>
              <div className="rounded-lg border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Command</TableHead>
                      <TableHead className="text-right">Count</TableHead>
                      <TableHead className="text-right">Percentage</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell>EARNINGS</TableCell>
                      <TableCell className="text-right">487</TableCell>
                      <TableCell className="text-right">39%</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>SAVINGS</TableCell>
                      <TableCell className="text-right">312</TableCell>
                      <TableCell className="text-right">25%</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>LOAN</TableCell>
                      <TableCell className="text-right">256</TableCell>
                      <TableCell className="text-right">21%</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>PROFILE</TableCell>
                      <TableCell className="text-right">193</TableCell>
                      <TableCell className="text-right">15%</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" onClick={handleRefreshStats} disabled={isRefreshing}>
              {isRefreshing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Refreshing...
                </>
              ) : (
                <>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Refresh Stats
                </>
              )}
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Interactions</CardTitle>
            <CardDescription>Latest WhatsApp messages from farmers</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { phone: "+254712345678", command: "EARNINGS", time: "10 minutes ago" },
                { phone: "+254723456789", command: "PROFILE", time: "25 minutes ago" },
                { phone: "+254734567890", command: "LOAN", time: "1 hour ago" },
                { phone: "+254745678901", command: "SAVINGS", time: "2 hours ago" },
                { phone: "+254756789012", command: "EARNINGS", time: "3 hours ago" },
              ].map((interaction, i) => (
                <div key={i} className="flex items-center justify-between rounded-lg border p-3">
                  <div>
                    <p className="font-medium">{interaction.phone}</p>
                    <p className="text-sm text-muted-foreground">Command: {interaction.command}</p>
                  </div>
                  <p className="text-sm text-muted-foreground">{interaction.time}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="commands" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>WhatsApp Command Examples</CardTitle>
            <CardDescription>Reference for WhatsApp command responses</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {commandExamples.map((example, i) => (
                <div key={i} className="rounded-lg border p-4">
                  <div className="mb-2 flex items-center justify-between">
                    <h3 className="font-bold">{example.command}</h3>
                    <Button variant="ghost" size="sm" onClick={() => handleCopyExample(i)}>
                      {copiedIndex === i ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                  <p className="mb-2 text-sm text-muted-foreground">{example.description}</p>
                  <div className="rounded-md bg-muted p-3">
                    <pre className="text-xs whitespace-pre-wrap">{example.example}</pre>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Command Documentation</CardTitle>
            <CardDescription>Download or share command documentation</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <p className="text-sm">
              Share this documentation with your team to ensure consistent WhatsApp support for farmers.
            </p>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Download PDF
              </Button>
              <Button variant="outline">
                <Copy className="mr-2 h-4 w-4" />
                Copy All Commands
              </Button>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="test" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Test WhatsApp Commands</CardTitle>
            <CardDescription>Send test commands to verify functionality</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  placeholder="+254712345678"
                  value={testNumber}
                  onChange={(e) => setTestNumber(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  Enter a phone number in international format (e.g., +254712345678)
                </p>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="command">Command</Label>
                <Select value={testCommand} onValueChange={setTestCommand}>
                  <SelectTrigger id="command">
                    <SelectValue placeholder="Select a command" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="EARNINGS">EARNINGS</SelectItem>
                    <SelectItem value="SAVINGS">SAVINGS</SelectItem>
                    <SelectItem value="LOAN">LOAN</SelectItem>
                    <SelectItem value="PROFILE">PROFILE</SelectItem>
                    <SelectItem value="HELP">HELP</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {sendResult && (
                <div
                  className={`rounded-lg p-3 text-sm ${
                    sendResult.success ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                  }`}
                >
                  {sendResult.message}
                </div>
              )}
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={handleSendTest} disabled={isSending || !testNumber || !testCommand}>
              {isSending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Send Test Command
                </>
              )}
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Custom Message</CardTitle>
            <CardDescription>Send a custom WhatsApp message</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="custom-phone">Phone Number</Label>
                <Input id="custom-phone" placeholder="+254712345678" />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="custom-message">Message</Label>
                <Textarea id="custom-message" placeholder="Enter your custom message here..." rows={4} />
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline">
              <Send className="mr-2 h-4 w-4" />
              Send Custom Message
            </Button>
          </CardFooter>
        </Card>
      </TabsContent>
    </Tabs>
  )
}
