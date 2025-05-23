import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { to, message } = await request.json()

    if (!to || !message) {
      return NextResponse.json({ error: "Phone number and message are required" }, { status: 400 })
    }

    // Format phone number
    let formattedPhone = to.toString().replace(/\D/g, "")
    if (formattedPhone.startsWith("0")) {
      formattedPhone = "254" + formattedPhone.substring(1)
    } else if (formattedPhone.startsWith("+")) {
      formattedPhone = formattedPhone.substring(1)
    }

    // In a real application, you would integrate with an SMS provider like Africa's Talking
    // This is a mock implementation
    console.log(`Sending SMS to ${formattedPhone}: ${message}`)

    // Simulate API call
    // In production, replace with actual SMS API call
    const response = {
      success: true,
      messageId: `msg_${Date.now()}`,
      to: formattedPhone,
      status: "queued",
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error("SMS API Error:", error)
    return NextResponse.json({ error: "Failed to send SMS" }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({ status: "SMS API is running" })
}
