"use client"
import { HelpCircle, Users, Truck, FileText, CheckCircle, Gavel, Wallet, Percent } from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export default function HelpPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <HelpCircle className="h-6 w-6" />
        <h1 className="text-3xl font-bold tracking-tight">Akulima Platform Manual</h1>
      </div>

      <Tabs defaultValue="introduction" className="space-y-4">
        <TabsList>
          <TabsTrigger value="introduction">Introduction</TabsTrigger>
          <TabsTrigger value="overview">Platform Overview</TabsTrigger>
          <TabsTrigger value="userguide">User Guide</TabsTrigger>
          <TabsTrigger value="workflows">Key Workflows</TabsTrigger>
          <TabsTrigger value="getting-started">Getting Started</TabsTrigger>
        </TabsList>

        <TabsContent value="introduction" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Introduction to Akulima</CardTitle>
              <CardDescription>What is Akulima and who is it for?</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                <strong>Akulima</strong> is a digital marketplace connecting women and youth-led agricultural producer
                groups with fair market buyers. The platform streamlines the agricultural value chain by providing
                direct market access, transparent pricing, and efficient logistics management.
              </p>
              <p>
                Our mission is to empower small-scale farmers by eliminating intermediaries, reducing post-harvest
                losses, and ensuring fair compensation for their produce.
              </p>
              <h3 className="mt-4 text-lg font-medium">Key Benefits</h3>
              <ul className="ml-6 list-disc space-y-2">
                <li>
                  <strong>For Farmer Groups</strong>: Direct market access, better prices, collective bargaining power
                </li>
                <li>
                  <strong>For Buyers</strong>: Reliable supply, quality assurance, streamlined procurement
                </li>
                <li>
                  <strong>For All Users</strong>: Transparent pricing, reduced intermediaries, efficient communication
                </li>
              </ul>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Platform Overview</CardTitle>
              <CardDescription>Core features and user roles</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <h3 className="text-lg font-medium">User Roles</h3>
              <div className="space-y-2">
                <div className="rounded-md border p-4">
                  <h4 className="font-medium">Akulima Groups</h4>
                  <p className="text-sm text-muted-foreground">
                    Farmer collectives that register, manage members, and sell produce collectively
                  </p>
                </div>
                <div className="rounded-md border p-4">
                  <h4 className="font-medium">Buyers</h4>
                  <p className="text-sm text-muted-foreground">
                    Businesses that purchase produce directly from farmer groups
                  </p>
                </div>
                <div className="rounded-md border p-4">
                  <h4 className="font-medium">Graders</h4>
                  <p className="text-sm text-muted-foreground">
                    Quality assurance specialists who verify produce quality
                  </p>
                </div>
                <div className="rounded-md border p-4">
                  <h4 className="font-medium">Transporters</h4>
                  <p className="text-sm text-muted-foreground">Logistics providers who handle produce delivery</p>
                </div>
                <div className="rounded-md border p-4">
                  <h4 className="font-medium">Administrators</h4>
                  <p className="text-sm text-muted-foreground">
                    Platform managers who oversee operations and maintain the system
                  </p>
                </div>
              </div>

              <h3 className="mt-6 text-lg font-medium">How the Marketplace Works</h3>
              <ol className="ml-6 list-decimal space-y-2">
                <li>Buyers post purchase requests specifying produce type, quantity, and price</li>
                <li>Farmer groups bid on these requests</li>
                <li>When a bid is accepted, the group allocates the order to its members</li>
                <li>Graders verify produce quality</li>
                <li>Transporters deliver the produce to buyers</li>
                <li>Payments are processed and distributed to farmers</li>
              </ol>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="userguide" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>User Guide by Role</CardTitle>
              <CardDescription>Specific instructions for each user type</CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="akulima-group">
                  <AccordionTrigger>
                    <div className="flex items-center">
                      <Users className="mr-2 h-5 w-5" />
                      <span>For Akulima Groups</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="space-y-4">
                    <p>As an Akulima Group, you have access to the following features:</p>

                    <h4 className="font-medium">Dashboard</h4>
                    <p className="text-sm">View market trends, active requests, and group performance</p>

                    <h4 className="font-medium">Members</h4>
                    <ul className="ml-6 list-disc space-y-1 text-sm">
                      <li>Add new members using ID verification with Smile ID</li>
                      <li>Verify member phone numbers via OTP for M-Pesa payments</li>
                      <li>Select produce types grown by each member</li>
                      <li>View and manage the complete member directory</li>
                    </ul>

                    <h4 className="font-medium">Bids</h4>
                    <ul className="ml-6 list-disc space-y-1 text-sm">
                      <li>View open market requests</li>
                      <li>Submit bids with quantity and pricing</li>
                      <li>Allocate accepted bids to members based on their produce</li>
                      <li>Send notifications to members about their allocations</li>
                    </ul>

                    <h4 className="font-medium">Transit</h4>
                    <ul className="ml-6 list-disc space-y-1 text-sm">
                      <li>Confirm down payments when received</li>
                      <li>Track produce in transit</li>
                      <li>Record quality check results</li>
                      <li>Confirm final payments</li>
                    </ul>

                    <h4 className="font-medium">Payments</h4>
                    <ul className="ml-6 list-disc space-y-1 text-sm">
                      <li>View payment allocations to members</li>
                      <li>Disburse payments via M-Pesa</li>
                      <li>Generate payment statements</li>
                    </ul>

                    <h4 className="font-medium">Deductions</h4>
                    <ul className="ml-6 list-disc space-y-1 text-sm">
                      <li>Manage fee deductions from payments</li>
                      <li>Set percentage or fixed amount deductions</li>
                      <li>View deduction impact on payments</li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="buyers">
                  <AccordionTrigger>
                    <div className="flex items-center">
                      <FileText className="mr-2 h-5 w-5" />
                      <span>For Buyers</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="space-y-4">
                    <p>As a Buyer, you have access to the following features:</p>

                    <h4 className="font-medium">Market Requests</h4>
                    <p className="text-sm">Post new purchase requests specifying produce type, quantity, and price</p>

                    <h4 className="font-medium">Orders</h4>
                    <p className="text-sm">Track order status and delivery</p>

                    <h4 className="font-medium">Market Prices</h4>
                    <p className="text-sm">View current market prices and trends</p>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="graders">
                  <AccordionTrigger>
                    <div className="flex items-center">
                      <CheckCircle className="mr-2 h-5 w-5" />
                      <span>For Graders</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="space-y-4">
                    <p>As a Grader, you have access to the following features:</p>

                    <h4 className="font-medium">Produce Grading</h4>
                    <p className="text-sm">Verify and grade produce quality</p>

                    <h4 className="font-medium">Quality Reports</h4>
                    <p className="text-sm">Generate quality assessment reports</p>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="transporters">
                  <AccordionTrigger>
                    <div className="flex items-center">
                      <Truck className="mr-2 h-5 w-5" />
                      <span>For Transporters</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="space-y-4">
                    <p>As a Transporter, you have access to the following features:</p>

                    <h4 className="font-medium">Delivery Management</h4>
                    <p className="text-sm">Schedule and track deliveries</p>

                    <h4 className="font-medium">Route Planning</h4>
                    <p className="text-sm">Optimize delivery routes</p>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="workflows" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Key Workflows</CardTitle>
              <CardDescription>Step-by-step guides for main processes</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="mb-2 text-lg font-medium">Akulima Group Workflow</h3>
                <div className="rounded-md border p-4">
                  <ol className="space-y-4">
                    <li className="flex items-start">
                      <div className="mr-4 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                        1
                      </div>
                      <div>
                        <h4 className="font-medium">Registration</h4>
                        <p className="text-sm text-muted-foreground">
                          Register as an Akulima Group. The system automatically generates a unique group code.
                        </p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <div className="mr-4 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                        2
                      </div>
                      <div>
                        <h4 className="font-medium">Add Members</h4>
                        <p className="text-sm text-muted-foreground">
                          Add members by entering their ID and name. Smile ID retrieves gender and age. Verify phone
                          numbers via OTP for M-Pesa payments. Select produce types grown by each member.
                        </p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <div className="mr-4 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                        3
                      </div>
                      <div>
                        <h4 className="font-medium">Bid on Market Requests</h4>
                        <p className="text-sm text-muted-foreground">
                          View open market requests, submit bids with quantity and indicate if down payment is needed.
                        </p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <div className="mr-4 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                        4
                      </div>
                      <div>
                        <h4 className="font-medium">Allocate Produce</h4>
                        <p className="text-sm text-muted-foreground">
                          When a bid is accepted, allocate the required produce quantity among your members based on
                          their capacity.
                        </p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <div className="mr-4 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                        5
                      </div>
                      <div>
                        <h4 className="font-medium">Track Transit</h4>
                        <p className="text-sm text-muted-foreground">
                          Monitor the produce in transit, confirm down payments, record quality checks, and verify final
                          payments.
                        </p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <div className="mr-4 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                        6
                      </div>
                      <div>
                        <h4 className="font-medium">Manage Payments</h4>
                        <p className="text-sm text-muted-foreground">
                          Distribute payments to members via M-Pesa based on their contribution, after applying any
                          necessary deductions.
                        </p>
                      </div>
                    </li>
                  </ol>
                </div>
              </div>

              <div>
                <h3 className="mb-2 text-lg font-medium">Akulima Group Features</h3>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  <div className="rounded-md border p-4">
                    <div className="mb-2 flex items-center">
                      <Users className="mr-2 h-5 w-5 text-primary" />
                      <h4 className="font-medium">Members Management</h4>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Register and manage group members with secure identity verification through Smile ID and phone
                      verification via OTP.
                    </p>
                  </div>
                  <div className="rounded-md border p-4">
                    <div className="mb-2 flex items-center">
                      <Gavel className="mr-2 h-5 w-5 text-primary" />
                      <h4 className="font-medium">Bids Management</h4>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Respond to market requests, submit competitive bids, and allocate accepted bids to group members.
                    </p>
                  </div>
                  <div className="rounded-md border p-4">
                    <div className="mb-2 flex items-center">
                      <Truck className="mr-2 h-5 w-5 text-primary" />
                      <h4 className="font-medium">Transit Tracking</h4>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Monitor produce shipments in real-time, update status, and manage the delivery process from pickup
                      to delivery.
                    </p>
                  </div>
                  <div className="rounded-md border p-4">
                    <div className="mb-2 flex items-center">
                      <Wallet className="mr-2 h-5 w-5 text-primary" />
                      <h4 className="font-medium">Payments Management</h4>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Manage and distribute payments to group members via M-Pesa, with detailed transaction records and
                      statements.
                    </p>
                  </div>
                  <div className="rounded-md border p-4">
                    <div className="mb-2 flex items-center">
                      <Percent className="mr-2 h-5 w-5 text-primary" />
                      <h4 className="font-medium">Deductions Management</h4>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Configure and apply deductions for loans, input advances, membership fees, and other expenses.
                    </p>
                  </div>
                  <div className="rounded-md border p-4">
                    <div className="mb-2 flex items-center">
                      <FileText className="mr-2 h-5 w-5 text-primary" />
                      <h4 className="font-medium">Reports & Analytics</h4>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Generate comprehensive reports on group performance, member contributions, and financial
                      transactions.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="getting-started" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Getting Started with Akulima</CardTitle>
              <CardDescription>Quick start guide for new users</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <h3 className="text-lg font-medium">For Akulima Groups</h3>
              <ol className="ml-6 list-decimal space-y-2">
                <li>
                  <strong>Register your group</strong>: Sign up as an Akulima Group and receive your unique group code.
                </li>
                <li>
                  <strong>Add members</strong>: Register your group members using Smile ID for identity verification and
                  OTP for phone verification.
                </li>
                <li>
                  <strong>Set up produce profiles</strong>: Add the types of produce your group members grow.
                </li>
                <li>
                  <strong>Browse market requests</strong>: View available market requests and submit bids.
                </li>
                <li>
                  <strong>Manage payments</strong>: Set up payment distribution methods and deduction rules.
                </li>
              </ol>

              <div className="mt-6 rounded-md border bg-muted/50 p-4">
                <h4 className="font-medium">Need Help?</h4>
                <p className="text-sm text-muted-foreground">
                  If you need assistance with any aspect of the Akulima platform, please contact our support team at
                  support@akulima.com or call +254 712 345 678.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
