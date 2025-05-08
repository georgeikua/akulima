"use client"

import { useState } from "react"
import { Computer, Loader2, LogOut, Smartphone, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { ProtectedRoute } from "@/components/protected-route"

// Mock session data
const initialSessions = [
  {
    id: "session-1",
    device: "Chrome on Windows",
    location: "Nairobi, Kenya",
    ip: "196.201.xxx.xxx",
    lastActive: "Just now",
    isCurrent: true,
    type: "desktop",
  },
  {
    id: "session-2",
    device: "Safari on iPhone",
    location: "Nairobi, Kenya",
    ip: "196.201.xxx.xxx",
    lastActive: "2 hours ago",
    isCurrent: false,
    type: "mobile",
  },
  {
    id: "session-3",
    device: "Firefox on Ubuntu",
    location: "Mombasa, Kenya",
    ip: "41.90.xxx.xxx",
    lastActive: "Yesterday at 3:45 PM",
    isCurrent: false,
    type: "desktop",
  },
]

export default function AdminSessionsPage() {
  const [sessions, setSessions] = useState(initialSessions)
  const [isLoading, setIsLoading] = useState(false)
  const [actionSuccess, setActionSuccess] = useState<string | null>(null)

  // Handle session termination
  const terminateSession = async (sessionId: string) => {
    setIsLoading(true)
    setActionSuccess(null)

    try {
      // Simulate API call to terminate session
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Remove the session from the list
      setSessions(sessions.filter((session) => session.id !== sessionId))

      // Show success message
      setActionSuccess("Session terminated successfully")

      // Clear success message after a delay
      setTimeout(() => {
        setActionSuccess(null)
      }, 3000)
    } catch (error) {
      console.error("Failed to terminate session:", error)
    } finally {
      setIsLoading(false)
    }
  }

  // Handle termination of all other sessions
  const terminateAllOtherSessions = async () => {
    setIsLoading(true)
    setActionSuccess(null)

    try {
      // Simulate API call to terminate all other sessions
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Keep only the current session
      setSessions(sessions.filter((session) => session.isCurrent))

      // Show success message
      setActionSuccess("All other sessions terminated successfully")

      // Clear success message after a delay
      setTimeout(() => {
        setActionSuccess(null)
      }, 3000)
    } catch (error) {
      console.error("Failed to terminate all sessions:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <div className="container mx-auto py-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Active Sessions</h1>
          <p className="text-muted-foreground">Manage your active admin sessions across devices</p>
        </div>

        {actionSuccess && (
          <Alert className="border-green-500">
            <AlertTitle>Success</AlertTitle>
            <AlertDescription>{actionSuccess}</AlertDescription>
          </Alert>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Your Sessions</CardTitle>
            <CardDescription>
              These are the devices that are currently logged into your admin account. If you don't recognize a session,
              terminate it immediately.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Device</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>IP Address</TableHead>
                  <TableHead>Last Active</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sessions.map((session) => (
                  <TableRow key={session.id}>
                    <TableCell>
                      <div className="flex items-center">
                        {session.type === "desktop" ? (
                          <Computer className="mr-2 h-4 w-4" />
                        ) : (
                          <Smartphone className="mr-2 h-4 w-4" />
                        )}
                        <span>{session.device}</span>
                        {session.isCurrent && (
                          <span className="ml-2 text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                            Current
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{session.location}</TableCell>
                    <TableCell>{session.ip}</TableCell>
                    <TableCell>{session.lastActive}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        disabled={session.isCurrent || isLoading}
                        onClick={() => terminateSession(session.id)}
                      >
                        {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            <div className="mt-6">
              <Button
                variant="destructive"
                onClick={terminateAllOtherSessions}
                disabled={sessions.length <= 1 || isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <LogOut className="mr-2 h-4 w-4" />
                    Terminate All Other Sessions
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Security Recommendations</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-5 space-y-2">
              <li>Regularly review your active sessions and terminate any that you don't recognize.</li>
              <li>Always log out when using shared or public computers.</li>
              <li>Enable two-factor authentication for an additional layer of security.</li>
              <li>Use a strong, unique password for your admin account.</li>
              <li>Update your password regularly, at least every 90 days.</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </ProtectedRoute>
  )
}
