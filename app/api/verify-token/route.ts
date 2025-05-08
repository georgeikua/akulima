import { type NextRequest, NextResponse } from "next/server"
import { verifyToken } from "@/lib/token-utils"

export async function GET(request: NextRequest) {
  try {
    const token = request.nextUrl.searchParams.get("token")

    if (!token) {
      return NextResponse.json({ error: "No token provided" }, { status: 400 })
    }

    const farmerId = await verifyToken(token)

    if (!farmerId) {
      return NextResponse.json({ error: "Invalid or expired token" }, { status: 401 })
    }

    return NextResponse.json({ farmerId })
  } catch (error) {
    console.error("Token verification error:", error)
    return NextResponse.json({ error: "Failed to verify token" }, { status: 500 })
  }
}
