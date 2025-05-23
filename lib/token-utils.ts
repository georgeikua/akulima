import { createHash, randomBytes } from "crypto"
import { createClient } from "@supabase/supabase-js"

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ""
const supabase = createClient(supabaseUrl, supabaseServiceKey)

// Generate a secure token for farmer dashboard access
export async function generateSecureToken(farmerId: string): Promise<string> {
  // Generate a random token
  const randomToken = randomBytes(16).toString("hex")

  // Create a hash of the token with the farmer ID
  const hash = createHash("sha256").update(`${randomToken}:${farmerId}:${Date.now()}`).digest("hex").substring(0, 12) // Keep it reasonably short for URL

  // Store the token in Supabase with expiration
  const expiresAt = new Date()
  expiresAt.setMinutes(expiresAt.getMinutes() + 30) // 30 minutes expiration

  await supabase.from("access_tokens").insert({
    token: hash,
    farmer_id: farmerId,
    expires_at: expiresAt.toISOString(),
    used: false,
  })

  return hash
}

// Verify a token and get the associated farmer ID
export async function verifyToken(token: string): Promise<string | null> {
  try {
    // Check if token exists and is valid
    const { data, error } = await supabase
      .from("access_tokens")
      .select("farmer_id, expires_at, used")
      .eq("token", token)
      .single()

    if (error || !data) {
      console.error("Token verification error:", error)
      return null
    }

    // Check if token is expired
    const expiresAt = new Date(data.expires_at)
    if (expiresAt < new Date() || data.used) {
      console.log("Token expired or already used")
      return null
    }

    // Mark token as used (one-time use)
    await supabase.from("access_tokens").update({ used: true }).eq("token", token)

    return data.farmer_id
  } catch (error) {
    console.error("Error verifying token:", error)
    return null
  }
}
