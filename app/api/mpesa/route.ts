import { type NextRequest, NextResponse } from "next/server"

// This would typically be an environment variable
const MPESA_API_KEY = process.env.MPESA_API_KEY || "your-mpesa-api-key"
const MPESA_API_SECRET = process.env.MPESA_API_SECRET || "your-mpesa-api-secret"
const MPESA_PASSKEY = process.env.MPESA_PASSKEY || "your-mpesa-passkey"
const MPESA_SHORTCODE = process.env.MPESA_SHORTCODE || "your-mpesa-shortcode"
const MPESA_CALLBACK_URL = process.env.MPESA_CALLBACK_URL || "https://akulima.com/api/mpesa/callback"

export async function POST(request: NextRequest) {
  try {
    const { phone, amount, reference } = await request.json()

    // Sanitize phone number to format required by M-Pesa (254XXXXXXXXX)
    let formattedPhone = phone.toString().replace(/\D/g, "")
    if (formattedPhone.startsWith("0")) {
      formattedPhone = "254" + formattedPhone.substring(1)
    } else if (formattedPhone.startsWith("+254")) {
      formattedPhone = formattedPhone.substring(1)
    } else if (formattedPhone.startsWith("+")) {
      formattedPhone = formattedPhone.substring(1)
    }

    // Generate timestamp (format: YYYYMMDDHHmmss)
    const timestamp = new Date()
      .toISOString()
      .replace(/[-T:.Z]/g, "")
      .slice(0, 14)

    // Create password (shortcode + passkey + timestamp)
    const password = Buffer.from(`${MPESA_SHORTCODE}${MPESA_PASSKEY}${timestamp}`).toString("base64")

    // Create authorization token
    const auth = Buffer.from(`${MPESA_API_KEY}:${MPESA_API_SECRET}`).toString("base64")

    // Prepare STK Push request
    const stkPushRequest = {
      BusinessShortCode: MPESA_SHORTCODE,
      Password: password,
      Timestamp: timestamp,
      TransactionType: "CustomerPayBillOnline",
      Amount: amount,
      PartyA: formattedPhone,
      PartyB: MPESA_SHORTCODE,
      PhoneNumber: formattedPhone,
      CallBackURL: MPESA_CALLBACK_URL,
      AccountReference: reference || "Akulima Payment",
      TransactionDesc: "Payment for produce",
    }

    // Make API request to M-Pesa
    const response = await fetch("https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest", {
      method: "POST",
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(stkPushRequest),
    })

    const data = await response.json()

    return NextResponse.json(data)
  } catch (error) {
    console.error("M-Pesa API Error:", error)
    return NextResponse.json({ error: "Failed to process payment" }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({ status: "M-Pesa API is running" })
}
