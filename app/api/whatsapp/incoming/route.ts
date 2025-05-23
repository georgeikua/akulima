import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { generateSecureToken } from "@/lib/token-utils"

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ""
const supabase = createClient(supabaseUrl, supabaseServiceKey)

// WhatsApp API configuration (would use environment variables in production)
const WHATSAPP_API_URL = "https://graph.facebook.com/v17.0/YOUR_PHONE_NUMBER_ID/messages"
const WHATSAPP_API_KEY = process.env.WHATSAPP_API_KEY || "your-whatsapp-api-key"

export async function POST(request: NextRequest) {
  try {
    // Parse the incoming webhook from WhatsApp
    const body = await request.json()

    // Extract the message details
    const messages = body.entry?.[0]?.changes?.[0]?.value?.messages
    if (!messages || messages.length === 0) {
      return NextResponse.json({ status: "No messages found" })
    }

    const message = messages[0]
    const from = message.from // Phone number that sent the message
    const messageBody = message.text?.body || ""
    const messageType = message.type
    const messageId = message.id

    // Process interactive messages (button responses)
    if (messageType === "interactive") {
      const interactiveResponse = message.interactive
      const buttonId = interactiveResponse?.button_reply?.id

      if (buttonId === "earnings_btn") {
        return handleEarningsCommand(from)
      } else if (buttonId === "savings_btn") {
        return handleSavingsCommand(from)
      } else if (buttonId === "loan_btn") {
        return handleLoanCommand(from)
      }
    }

    // Process text commands
    const command = messageBody.trim().toUpperCase()

    switch (command) {
      case "EARNINGS":
        return handleEarningsCommand(from)
      case "SAVINGS":
        return handleSavingsCommand(from)
      case "LOAN":
        return handleLoanCommand(from)
      case "PROFILE":
        return handleProfileCommand(from)
      case "HELP":
        return sendHelpMessage(from)
      default:
        return sendWelcomeMenu(from)
    }
  } catch (error) {
    console.error("WhatsApp webhook processing error:", error)
    return NextResponse.json({ error: "Failed to process WhatsApp message" }, { status: 500 })
  }
}

// Command handlers
async function handleEarningsCommand(phoneNumber: string) {
  try {
    // Fetch farmer data from Supabase
    const { data: farmer, error } = await supabase
      .from("farmers")
      .select("id, name, total_earnings, last_payout_amount, last_payout_date")
      .eq("phone_number", phoneNumber)
      .single()

    if (error || !farmer) {
      return sendMessage(
        phoneNumber,
        "❌ We couldn't find your farmer record. Please contact your group admin for assistance.",
      )
    }

    // Format the response
    const message = `💰 *EARNINGS UPDATE*\n\nHello ${farmer.name},\n\nThis season's total earnings: KES ${farmer.total_earnings.toLocaleString()}\n\nLast payout: KES ${farmer.last_payout_amount.toLocaleString()} on ${new Date(farmer.last_payout_date).toLocaleDateString()}\n\nSend PROFILE for your complete dashboard.`

    return sendMessage(phoneNumber, message)
  } catch (error) {
    console.error("Error processing earnings command:", error)
    return sendErrorMessage(phoneNumber)
  }
}

async function handleSavingsCommand(phoneNumber: string) {
  try {
    // Fetch farmer savings data from Supabase
    const { data: savings, error } = await supabase
      .from("farmer_savings")
      .select("farmer_id, farmer:farmers(name), total_savings, available_for_withdrawal, last_rollover_date")
      .eq("farmer:farmers.phone_number", phoneNumber)
      .single()

    if (error || !savings) {
      return sendMessage(
        phoneNumber,
        "❌ We couldn't find your savings record. Please contact your group admin for assistance.",
      )
    }

    // Determine if payout is due or rolled over
    const lastRollover = savings.last_rollover_date ? new Date(savings.last_rollover_date) : null
    const today = new Date()
    const rolloverStatus =
      lastRollover && today.getTime() - lastRollover.getTime() < 30 * 24 * 60 * 60 * 1000
        ? "Your savings were rolled over on " + lastRollover.toLocaleDateString()
        : "You are eligible for payout. Send PROFILE to access your dashboard."

    // Format the response
    const message = `🏦 *SAVINGS UPDATE*\n\nHello ${savings.farmer.name},\n\nTotal savings balance: KES ${savings.total_savings.toLocaleString()}\n\nAvailable for withdrawal: KES ${savings.available_for_withdrawal.toLocaleString()}\n\n${rolloverStatus}`

    return sendMessage(phoneNumber, message)
  } catch (error) {
    console.error("Error processing savings command:", error)
    return sendErrorMessage(phoneNumber)
  }
}

async function handleLoanCommand(phoneNumber: string) {
  try {
    // Fetch farmer loan data from Supabase
    const { data: loan, error } = await supabase
      .from("farmer_loans")
      .select("farmer_id, farmer:farmers(name), outstanding_balance, next_deduction_amount, next_deduction_date")
      .eq("farmer:farmers.phone_number", phoneNumber)
      .single()

    if (error || !loan) {
      return sendMessage(phoneNumber, "✅ You have no outstanding loans at this time.")
    }

    // Format the response
    const message = `💸 *LOAN UPDATE*\n\nHello ${loan.farmer.name},\n\nOutstanding loan balance: KES ${loan.outstanding_balance.toLocaleString()}\n\nNext deduction: KES ${loan.next_deduction_amount.toLocaleString()} on ${new Date(loan.next_deduction_date).toLocaleDateString()}\n\nSend PROFILE to view your complete loan details.`

    return sendMessage(phoneNumber, message)
  } catch (error) {
    console.error("Error processing loan command:", error)
    return sendErrorMessage(phoneNumber)
  }
}

async function handleProfileCommand(phoneNumber: string) {
  try {
    // Fetch farmer ID from Supabase
    const { data: farmer, error } = await supabase
      .from("farmers")
      .select("id, name")
      .eq("phone_number", phoneNumber)
      .single()

    if (error || !farmer) {
      return sendMessage(
        phoneNumber,
        "❌ We couldn't find your farmer record. Please contact your group admin for assistance.",
      )
    }

    // Generate a secure token for the farmer
    const token = await generateSecureToken(farmer.id)

    // Create the dashboard URL
    const dashboardUrl = `https://akulima.africa/profile/view?token=${token}`

    // Format the response
    const message = `🔐 *SECURE DASHBOARD ACCESS*\n\nHello ${farmer.name},\n\nAccess your personal dashboard here:\n${dashboardUrl}\n\nThis link expires in 30 minutes and is for your use only.\n\nDo not share this link with anyone.`

    return sendMessage(phoneNumber, message)
  } catch (error) {
    console.error("Error processing profile command:", error)
    return sendErrorMessage(phoneNumber)
  }
}

async function sendWelcomeMenu(phoneNumber: string) {
  try {
    // Fetch farmer name from Supabase
    const { data: farmer } = await supabase.from("farmers").select("name").eq("phone_number", phoneNumber).single()

    const farmerName = farmer?.name || "Farmer"

    // Send interactive buttons menu
    return sendInteractiveButtonsMessage(phoneNumber, farmerName)
  } catch (error) {
    console.error("Error sending welcome menu:", error)
    return sendErrorMessage(phoneNumber)
  }
}

async function sendHelpMessage(phoneNumber: string) {
  const helpMessage = `*AKULIMA WHATSAPP COMMANDS*\n\nSend any of these commands:\n\n💰 EARNINGS - View your total earnings\n\n🏦 SAVINGS - Check your savings balance\n\n💸 LOAN - View your loan balance\n\n🔐 PROFILE - Get a link to your dashboard\n\n❓ HELP - Show this help message`

  return sendMessage(phoneNumber, helpMessage)
}

async function sendErrorMessage(phoneNumber: string) {
  return sendMessage(
    phoneNumber,
    "❌ Sorry, we encountered an error processing your request. Please try again later or contact support.",
  )
}

// Helper function to send WhatsApp messages
async function sendMessage(to: string, text: string) {
  try {
    const payload = {
      messaging_product: "whatsapp",
      recipient_type: "individual",
      to: to,
      type: "text",
      text: {
        body: text,
      },
    }

    const response = await fetch(WHATSAPP_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${WHATSAPP_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("Error sending WhatsApp message:", error)
    return NextResponse.json({ error: "Failed to send WhatsApp message" }, { status: 500 })
  }
}

// Helper function to send interactive buttons message
async function sendInteractiveButtonsMessage(to: string, farmerName: string) {
  try {
    const payload = {
      messaging_product: "whatsapp",
      recipient_type: "individual",
      to: to,
      type: "interactive",
      interactive: {
        type: "button",
        body: {
          text: `Hi ${farmerName}, what would you like to check today?`,
        },
        action: {
          buttons: [
            {
              type: "reply",
              reply: {
                id: "earnings_btn",
                title: "💰 Earnings",
              },
            },
            {
              type: "reply",
              reply: {
                id: "savings_btn",
                title: "🏦 Savings",
              },
            },
            {
              type: "reply",
              reply: {
                id: "loan_btn",
                title: "💸 Loan Balance",
              },
            },
          ],
        },
      },
    }

    const response = await fetch(WHATSAPP_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${WHATSAPP_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("Error sending WhatsApp interactive message:", error)
    return NextResponse.json({ error: "Failed to send WhatsApp interactive message" }, { status: 500 })
  }
}

// GET method to verify the webhook
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const mode = searchParams.get("hub.mode")
  const token = searchParams.get("hub.verify_token")
  const challenge = searchParams.get("hub.challenge")

  // Verify token (this should be set as an environment variable in production)
  const VERIFY_TOKEN = "akulima_whatsapp_verify_token"

  if (mode === "subscribe" && token === VERIFY_TOKEN) {
    return new Response(challenge, { status: 200 })
  } else {
    return new Response("Verification failed", { status: 403 })
  }
}
