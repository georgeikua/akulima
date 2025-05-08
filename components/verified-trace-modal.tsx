"use client"

import type React from "react"

import { useState } from "react"
import { FileText, CheckCircle, ExternalLink } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { BlockchainContractInterface } from "@/components/blockchain-contract-interface"

interface VerifiedTraceModalProps {
  orderId: string
  userRole: "buyer" | "group" | "admin" | "farmer"
  children: React.ReactNode
}

export function VerifiedTraceModal({ orderId, userRole, children }: VerifiedTraceModalProps) {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
            Verified Blockchain Trace
          </DialogTitle>
          <DialogDescription>Immutable record of this order's journey from farm to delivery</DialogDescription>
        </DialogHeader>
        <ScrollArea className="flex-1 pr-4">
          <Tabs defaultValue="contract">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="contract">Smart Contract</TabsTrigger>
              <TabsTrigger value="timeline">Timeline</TabsTrigger>
              <TabsTrigger value="verification">Verification</TabsTrigger>
            </TabsList>
            <TabsContent value="contract" className="space-y-4 mt-4">
              <BlockchainContractInterface orderId={orderId} userRole={userRole} />
            </TabsContent>
            <TabsContent value="timeline" className="space-y-4 mt-4">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Order Timeline</h3>

                <div className="relative border-l-2 border-muted pl-6 pb-2">
                  <div className="absolute left-[-8px] top-0 h-4 w-4 rounded-full bg-green-500"></div>
                  <div className="mb-4">
                    <p className="text-sm font-medium">Order Created</p>
                    <p className="text-xs text-muted-foreground">May 15, 2023 - 10:30 AM</p>
                    <p className="text-sm mt-1">Order #ORD-001 created by Metro Supermarket</p>
                    <div className="flex items-center mt-1">
                      <code className="text-xs font-mono bg-muted p-1 rounded">
                        0x7d6e5f4a3b2c1d0e9f8a7b6c5d4e3f2a1b0c9d8e7f6a5b4c3d2e1f
                      </code>
                      <Button variant="ghost" size="icon" className="h-6 w-6 ml-1">
                        <ExternalLink className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>

                  <div className="absolute left-[-8px] top-[100px] h-4 w-4 rounded-full bg-green-500"></div>
                  <div className="mb-4">
                    <p className="text-sm font-medium">Farmer Contributions Recorded</p>
                    <p className="text-xs text-muted-foreground">May 16, 2023 - 2:45 PM</p>
                    <p className="text-sm mt-1">4 farmers contributed a total of 500kg of produce</p>
                    <div className="flex items-center mt-1">
                      <code className="text-xs font-mono bg-muted p-1 rounded">
                        0x8f2e3c5d7b6a9f0e1d2c4b5a6f3e2d1c0b9a8f7e6d5c4b3a2f1e0d
                      </code>
                      <Button variant="ghost" size="icon" className="h-6 w-6 ml-1">
                        <ExternalLink className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>

                  <div className="absolute left-[-8px] top-[200px] h-4 w-4 rounded-full bg-green-500"></div>
                  <div className="mb-4">
                    <p className="text-sm font-medium">Delivery Confirmed</p>
                    <p className="text-xs text-muted-foreground">May 18, 2023 - 11:15 AM</p>
                    <p className="text-sm mt-1">Delivery confirmed by Metro Supermarket</p>
                    <div className="flex items-center mt-1">
                      <code className="text-xs font-mono bg-muted p-1 rounded">
                        0x9e8d7c6b5a4f3e2d1c0b9a8f7e6d5c4b3a2f1e0d9c8b7a6f5e4d3c
                      </code>
                      <Button variant="ghost" size="icon" className="h-6 w-6 ml-1">
                        <ExternalLink className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>

                  <div className="absolute left-[-8px] top-[300px] h-4 w-4 rounded-full bg-green-500"></div>
                  <div>
                    <p className="text-sm font-medium">Payment Processed</p>
                    <p className="text-xs text-muted-foreground">May 20, 2023 - 3:30 PM</p>
                    <p className="text-sm mt-1">Payment of KES 20,000 processed via M-Pesa</p>
                    <div className="flex items-center mt-1">
                      <code className="text-xs font-mono bg-muted p-1 rounded">
                        0xa9b8c7d6e5f4g3h2i1j0k9l8m7n6o5p4q3r2s1t0u9v8w7x6y5z4
                      </code>
                      <Button variant="ghost" size="icon" className="h-6 w-6 ml-1">
                        <ExternalLink className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="verification" className="space-y-4 mt-4">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Verification Details</h3>

                <div className="rounded-lg border p-4 bg-green-50">
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                    <p className="font-medium">Blockchain Verification Successful</p>
                  </div>
                  <p className="text-sm mt-1">
                    This order has been verified on the blockchain. All transactions are authentic and tamper-proof.
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                      <p className="text-sm">Order Creation</p>
                    </div>
                    <Badge className="bg-green-100 text-green-800">Verified</Badge>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                      <p className="text-sm">Farmer Contributions</p>
                    </div>
                    <Badge className="bg-green-100 text-green-800">Verified</Badge>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                      <p className="text-sm">Delivery Confirmation</p>
                    </div>
                    <Badge className="bg-green-100 text-green-800">Verified</Badge>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                      <p className="text-sm">Payment Processing</p>
                    </div>
                    <Badge className="bg-green-100 text-green-800">Verified</Badge>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                      <p className="text-sm">Payment Distribution</p>
                    </div>
                    <Badge className="bg-green-100 text-green-800">Verified</Badge>
                  </div>
                </div>

                <div className="rounded-lg border p-4">
                  <h4 className="text-sm font-medium mb-2">Verification Method</h4>
                  <p className="text-sm">
                    This order was verified using a decentralized blockchain network. Each transaction is
                    cryptographically signed and cannot be altered.
                  </p>
                  <div className="mt-3 pt-3 border-t">
                    <p className="text-xs text-muted-foreground">Verification Timestamp: May 20, 2023 - 3:45 PM</p>
                    <p className="text-xs text-muted-foreground">Network: Akulima Blockchain</p>
                    <p className="text-xs text-muted-foreground">Block Number: 12345678</p>
                  </div>
                </div>

                <Button className="w-full">
                  <FileText className="mr-2 h-4 w-4" />
                  Download Verification Certificate
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
