import { type NextRequest, NextResponse } from "next/server"

// This would typically be an environment variable
const WHATSAPP_API_KEY = process.env.WHATSAPP_API_KEY || "your-whatsapp-api-key"
const WHATSAPP_API_URL = "https://graph.facebook.com/v17.0/YOUR_PHONE_NUMBER_ID/messages"

// Mock floor prices by produce type (in KES per kg)
const FLOOR_PRICES = {
  maize: 45,
  beans: 120,
  potatoes: 35,
  tomatoes: 80,
  onions: 60,
  cabbage: 25,
  avocados: 150,
}

// Mock service costs (percentages)
const SERVICE_COSTS = {
  grader: 0.05, // 5%
  transport: 0.08, // 8%
  insurance: 0.02, // 2%
}

type MessageTemplate = {
  name: string
  language: {
    code: string
  }
  components?: {
    type: string
    parameters: any[]
  }[]
}

export async function POST(request: NextRequest) {
  try {
    const { to, templateName, templateParams, messageType } = await request.json()

    // Format phone number for WhatsApp API
    let formattedPhone = to.toString().replace(/\D/g, "")
    if (formattedPhone.startsWith("0")) {
      formattedPhone = "254" + formattedPhone.substring(1)
    } else if (formattedPhone.startsWith("+")) {
      formattedPhone = formattedPhone.substring(1)
    }

    // Handle bid request validation if it's a bid request
    if (messageType === "bid_request") {
      const { produce, price } = JSON.parse(templateParams[0])
      const floorPrice = FLOOR_PRICES[produce as keyof typeof FLOOR_PRICES] || 0

      if (price < floorPrice) {
        // Send floor price error message
        return sendWhatsAppMessage(formattedPhone, "floor_price_error", [
          produce,
          floorPrice.toString(),
          price.toString(),
        ])
      }

      // Calculate price breakdown
      const graderCost = price * SERVICE_COSTS.grader
      const transportCost = price * SERVICE_COSTS.transport
      const insuranceCost = price * SERVICE_COSTS.insurance
      const netPrice = price - graderCost - transportCost - insuranceCost

      // Add price breakdown to template params
      templateParams.push(
        JSON.stringify({
          buyerPrice: price,
          netPrice: netPrice.toFixed(2),
          deductions: (graderCost + transportCost + insuranceCost).toFixed(2),
        }),
      )
    }

    // Prepare template message
    const template: MessageTemplate = {
      name: templateName,
      language: { code: "en" },
    }

    // Add template parameters if provided
    if (templateParams && templateParams.length > 0) {
      template.components = [
        {
          type: "body",
          parameters: templateParams.map((param: string) => ({
            type: "text",
            text: param,
          })),
        },
      ]
    }

    // Prepare WhatsApp API request
    const whatsappRequest = {
      messaging_product: "whatsapp",
      recipient_type: "individual",
      to: formattedPhone,
      type: "template",
      template,
    }

    // Make API request to WhatsApp Business API
    const response = await fetch(WHATSAPP_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${WHATSAPP_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(whatsappRequest),
    })

    const data = await response.json()

    return NextResponse.json(data)
  } catch (error) {
    console.error("WhatsApp API Error:", error)
    return NextResponse.json({ error: "Failed to send WhatsApp message" }, { status: 500 })
  }
}

// Helper function to send WhatsApp messages
async function sendWhatsAppMessage(to: string, templateName: string, templateParams: string[]) {
  try {
    const template: MessageTemplate = {
      name: templateName,
      language: { code: "en" },
    }

    if (templateParams && templateParams.length > 0) {
      template.components = [
        {
          type: "body",
          parameters: templateParams.map((param: string) => ({
            type: "text",
            text: param,
          })),
        },
      ]
    }

    const whatsappRequest = {
      messaging_product: "whatsapp",
      recipient_type: "individual",
      to: to,
      type: "template",
      template,
    }

    const response = await fetch(WHATSAPP_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${WHATSAPP_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(whatsappRequest),
    })

    return await response.json()
  } catch (error) {
    console.error("WhatsApp API Error:", error)
    throw error
  }
}

export async function GET() {
  return NextResponse.json({ status: "WhatsApp API is running" })
}
