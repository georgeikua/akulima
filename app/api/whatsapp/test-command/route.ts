import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { phone, command } = await request.json()

    if (!phone || !command) {
      return NextResponse.json({ error: "Phone number and command are required" }, { status: 400 })
    }

    // In a real implementation, this would call the WhatsApp API
    // For now, we'll just simulate a successful response
    console.log(`Sending test command ${command} to ${phone}`)

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    return NextResponse.json({
      success: true,
      message: `Test command ${command} sent to ${phone}`,
      messageId: `msg_${Date.now()}`,
    })
  } catch (error) {
    console.error("Error sending test command:", error)
    return NextResponse.json({ error: "Failed to send test command" }, { status: 500 })
  }
}
