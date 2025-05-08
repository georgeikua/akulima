"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { CheckCircle, ChevronRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function RegistrationSuccessPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [type, setType] = useState<string | null>(null)
  const [code, setCode] = useState<string | null>(null)

  useEffect(() => {
    const typeParam = searchParams.get("type")
    const codeParam = searchParams.get("code")

    setType(typeParam)
    setCode(codeParam)
  }, [searchParams])

  return (
    <div className="container max-w-md mx-auto px-4 py-8">
      <Card className="border-green-200">
        <CardHeader className="pb-2">
          <div className="flex justify-center mb-4">
            <div className="rounded-full bg-green-100 p-3">
              <CheckCircle className="h-12 w-12 text-green-600" />
            </div>
          </div>
          <CardTitle className="text-center text-2xl">Registration Successful</CardTitle>
          <CardDescription className="text-center">
            {type === "buyer"
              ? "Your buyer account has been created successfully."
              : type === "group"
                ? "Your group has been registered successfully."
                : "Your account has been created successfully."}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {code && (
            <div className="rounded-md bg-muted p-4 text-center">
              <p className="text-sm font-medium mb-1">Your {type} code is:</p>
              <p className="text-xl font-mono">{code}</p>
              <p className="text-xs text-muted-foreground mt-1">Keep this code for your records</p>
            </div>
          )}

          <div className="space-y-2">
            <p className="text-sm">What happens next?</p>
            <ul className="text-sm space-y-1">
              {type === "buyer" ? (
                <>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 shrink-0" />
                    <span>You can now submit bid requests for produce</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 shrink-0" />
                    <span>Receive and review bids from Akulima Groups</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 shrink-0" />
                    <span>Track your transactions from grading to delivery</span>
                  </li>
                </>
              ) : type === "group" ? (
                <>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 shrink-0" />
                    <span>You will receive SMS notifications for new bid requests</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 shrink-0" />
                    <span>Submit bids for produce requests from buyers</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 shrink-0" />
                    <span>Manage your group members and track contributions</span>
                  </li>
                </>
              ) : (
                <>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 shrink-0" />
                    <span>Your account has been created successfully</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 shrink-0" />
                    <span>You can now log in to access the platform</span>
                  </li>
                </>
              )}
            </ul>
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full" onClick={() => router.push("/login")}>
            Continue to Login
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
