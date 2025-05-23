"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { WhatsappMessaging } from "@/components/whatsapp-messaging"
import { WhatsappManagement } from "@/components/whatsapp-management"

export default function WhatsAppAdminPage() {
  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">WhatsApp Management</h1>
        <p className="text-muted-foreground">Manage WhatsApp messaging and farmer interactions</p>
      </div>

      <Tabs defaultValue="dashboard">
        <TabsList className="mb-4">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="messaging">Messaging</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard">
          <WhatsappManagement />
        </TabsContent>

        <TabsContent value="messaging">
          <Card>
            <CardHeader>
              <CardTitle>Send WhatsApp Messages</CardTitle>
              <CardDescription>Send WhatsApp messages to farmers or groups</CardDescription>
            </CardHeader>
            <CardContent>
              <WhatsappMessaging />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates">
          <Card>
            <CardHeader>
              <CardTitle>Message Templates</CardTitle>
              <CardDescription>Manage WhatsApp message templates</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Template management interface will be implemented here.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
