import { type NextRequest, NextResponse } from "next/server"

// This would typically be an environment variable
const MPESA_API_KEY = process.env.MPESA_API_KEY || "your-mpesa-api-key"
const MPESA_API_SECRET = process.env.MPESA_API_SECRET || "your-mpesa-api-secret"
const MPESA_PASSKEY = process.env.MPESA_PASSKEY || "your-mpesa-passkey"
const MPESA_SHORTCODE = process.env.MPESA_SHORTCODE || "your-mpesa-shortcode"
const MPESA_B2C_URL = "https://sandbox.safaricom.co.ke/mpesa/b2c/v1/paymentrequest"

export async function POST(request: NextRequest) {
  try {
    const { phone, amount, reason, remarks, orderId } = await request.json()

    if (!phone || !amount || amount <= 0) {
      return NextResponse.json({ error: "Invalid phone number or amount" }, { status: 400 })
    }

    // Sanitize phone number to format required by M-Pesa (254XXXXXXXXX)
    let formattedPhone = phone.toString().replace(/\D/g, "")
    if (formattedPhone.startsWith("0")) {
      formattedPhone = "254" + formattedPhone.substring(1)
    } else if (formattedPhone.startsWith("+254")) {
      formattedPhone = formattedPhone.substring(1)
    } else if (formattedPhone.startsWith("+")) {
      formattedPhone = formattedPhone.substring(1)
    }

    // Create authorization token
    const auth = Buffer.from(`${MPESA_API_KEY}:${MPESA_API_SECRET}`).toString("base64")

    // Prepare B2C request
    const b2cRequest = {
      InitiatorName: "Akulima Platform",
      SecurityCredential: MPESA_PASSKEY, // In production, this would be encrypted
      CommandID: "BusinessPayment", // Use "SalaryPayment" for salary disbursements
      Amount: amount.toString(),
      PartyA: MPESA_SHORTCODE,
      PartyB: formattedPhone,
      Remarks: remarks || "Payment from Akulima Platform",
      QueueTimeOutURL: `https://akulima.com/api/mpesa/timeout?orderId=${orderId}`,
      ResultURL: `https://akulima.com/api/mpesa/result?orderId=${orderId}`,
      Occasion: reason || "Produce payment",
    }

    // Make API request to M-Pesa
    const response = await fetch(MPESA_B2C_URL, {
      method: "POST",
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(b2cRequest),
    })

    const data = await response.json()

    return NextResponse.json(data)
  } catch (error) {
    console.error("M-Pesa B2C API Error:", error)
    return NextResponse.json({ error: "Failed to process payment disbursement" }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({ status: "M-Pesa B2C API is running" })
}
