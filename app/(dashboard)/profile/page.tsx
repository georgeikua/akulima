"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Save, User, Mail, Phone, MapPin, Building } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ProtectedRoute } from "@/components/protected-route"
import { useAuth } from "@/lib/auth-context"

// Form schema for profile details
const profileFormSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  phone: z.string().min(10, {
    message: "Phone number must be at least 10 characters.",
  }),
  role: z.string(),
  bio: z.string().optional(),
  location: z.string().min(2, {
    message: "Location must be at least 2 characters.",
  }),
  organization: z.string().optional(),
})

type ProfileFormValues = z.infer<typeof profileFormSchema>

// Form schema for notification settings
const notificationFormSchema = z.object({
  marketUpdates: z.boolean().default(true),
  orderNotifications: z.boolean().default(true),
  paymentAlerts: z.boolean().default(true),
  marketingEmails: z.boolean().default(false),
  smsNotifications: z.boolean().default(true),
  whatsappNotifications: z.boolean().default(true),
})

type NotificationFormValues = z.infer<typeof notificationFormSchema>

export default function ProfilePage() {
  const { user } = useAuth()
  const [isEditing, setIsEditing] = useState(false)

  // Initialize form with default values
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
      phone: "+254712345678",
      role: user?.role || "group",
      bio: "Passionate about sustainable agriculture and connecting farmers with markets.",
      location: "Machakos, Kenya",
      organization: user?.role === "group" ? "Wanake Farmers Group" : "",
    },
  })

  // Handle form submission
  function onSubmit(data: ProfileFormValues) {
    console.log(data)
    setIsEditing(false)
  }

  // Get user initials for avatar fallback
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  return (
    <ProtectedRoute>
      <div className="space-y-6">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
            <p className="text-muted-foreground">Manage your account settings and preferences.</p>
          </div>
          {!isEditing ? (
            <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
          ) : (
            <Button onClick={form.handleSubmit(onSubmit)}>
              <Save className="mr-2 h-4 w-4" />
              Save Changes
            </Button>
          )}
        </div>

        <div className="grid gap-6 md:grid-cols-[250px_1fr]">
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col items-center space-y-4">
                <Avatar className="h-24 w-24">
                  <AvatarImage src="/placeholder.svg?height=96&width=96" alt={user?.name || "User"} />
                  <AvatarFallback>{getInitials(user?.name || "User")}</AvatarFallback>
                </Avatar>
                <div className="space-y-1 text-center">
                  <h3 className="font-medium">{user?.name}</h3>
                  <p className="text-sm text-muted-foreground capitalize">{user?.role}</p>
                </div>
                <Button variant="outline" className="w-full" disabled={!isEditing}>
                  Change Avatar
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Tabs defaultValue="general" className="w-full">
              <TabsList className="w-full">
                <TabsTrigger value="general" className="flex-1">
                  General
                </TabsTrigger>
                <TabsTrigger value="notifications" className="flex-1">
                  Notifications
                </TabsTrigger>
                <TabsTrigger value="security" className="flex-1">
                  Security
                </TabsTrigger>
              </TabsList>

              <TabsContent value="general" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Profile Information</CardTitle>
                    <CardDescription>Update your personal information.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Form {...form}>
                      <form className="space-y-6">
                        <div className="grid gap-4 sm:grid-cols-2">
                          <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Full Name</FormLabel>
                                <FormControl>
                                  <div className="relative">
                                    <User className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input className="pl-8" disabled={!isEditing} {...field} />
                                  </div>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                  <div className="relative">
                                    <Mail className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input className="pl-8" disabled={!isEditing} {...field} />
                                  </div>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="phone"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Phone Number</FormLabel>
                                <FormControl>
                                  <div className="relative">
                                    <Phone className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input className="pl-8" disabled={!isEditing} {...field} />
                                  </div>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="location"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Location</FormLabel>
                                <FormControl>
                                  <div className="relative">
                                    <MapPin className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input className="pl-8" disabled={!isEditing} {...field} />
                                  </div>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <FormField
                          control={form.control}
                          name="role"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Role</FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                                disabled={!isEditing || true} // Always disabled as role shouldn't change
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select role" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="group">Group</SelectItem>
                                  <SelectItem value="farmer">Farmer</SelectItem>
                                  <SelectItem value="buyer">Buyer</SelectItem>
                                  <SelectItem value="admin">Admin</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormDescription>Your role in the Akulima platform.</FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        {user?.role === "group" && (
                          <FormField
                            control={form.control}
                            name="organization"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Group Name</FormLabel>
                                <FormControl>
                                  <div className="relative">
                                    <Building className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input className="pl-8" disabled={!isEditing} {...field} />
                                  </div>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        )}

                        <FormField
                          control={form.control}
                          name="bio"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Bio</FormLabel>
                              <FormControl>
                                <Textarea
                                  placeholder="Tell us about yourself or your organization..."
                                  className="min-h-[120px]"
                                  disabled={!isEditing}
                                  {...field}
                                />
                              </FormControl>
                              <FormDescription>Brief description about yourself or your organization.</FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </form>
                    </Form>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Account Information</CardTitle>
                    <CardDescription>View your account details.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Account ID</p>
                          <p>{user?.id || "N/A"}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Member Since</p>
                          <p>January 15, 2023</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Account Status</p>
                          <p className="text-emerald-600 dark:text-emerald-400">Active</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Last Login</p>
                          <p>Today at {new Date().toLocaleTimeString()}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="notifications" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Notification Preferences</CardTitle>
                    <CardDescription>Manage how you receive notifications.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Market Updates</p>
                          <p className="text-sm text-muted-foreground">
                            Receive notifications about market price changes and trends.
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button variant="outline" size="sm">
                            Email
                          </Button>
                          <Button variant="outline" size="sm">
                            SMS
                          </Button>
                          <Button variant="outline" size="sm">
                            WhatsApp
                          </Button>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Order Notifications</p>
                          <p className="text-sm text-muted-foreground">
                            Receive notifications about your orders and deliveries.
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button variant="outline" size="sm">
                            Email
                          </Button>
                          <Button variant="outline" size="sm">
                            SMS
                          </Button>
                          <Button variant="outline" size="sm">
                            WhatsApp
                          </Button>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Payment Alerts</p>
                          <p className="text-sm text-muted-foreground">
                            Receive notifications about payments and transactions.
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button variant="outline" size="sm">
                            Email
                          </Button>
                          <Button variant="outline" size="sm">
                            SMS
                          </Button>
                          <Button variant="outline" size="sm">
                            WhatsApp
                          </Button>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Marketing Emails</p>
                          <p className="text-sm text-muted-foreground">
                            Receive marketing emails about new features and offers.
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button variant="outline" size="sm">
                            Email
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button>Save Notification Preferences</Button>
                  </CardFooter>
                </Card>
              </TabsContent>

              <TabsContent value="security" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Change Password</CardTitle>
                    <CardDescription>Update your password to keep your account secure.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <FormLabel>Current Password</FormLabel>
                        <Input type="password" />
                      </div>
                      <div>
                        <FormLabel>New Password</FormLabel>
                        <Input type="password" />
                      </div>
                      <div>
                        <FormLabel>Confirm New Password</FormLabel>
                        <Input type="password" />
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button>Update Password</Button>
                  </CardFooter>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Two-Factor Authentication</CardTitle>
                    <CardDescription>Add an extra layer of security to your account.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">SMS Authentication</p>
                          <p className="text-sm text-muted-foreground">
                            Receive a code via SMS to verify your identity.
                          </p>
                        </div>
                        <Button variant="outline">Enable</Button>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Email Authentication</p>
                          <p className="text-sm text-muted-foreground">
                            Receive a code via email to verify your identity.
                          </p>
                        </div>
                        <Button variant="outline">Enable</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}
