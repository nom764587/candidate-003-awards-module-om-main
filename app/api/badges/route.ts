import { type NextRequest, NextResponse } from "next/server"
import { loadBadgesFromFirestore } from "@/lib/firestore"

export const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
}

export async function OPTIONS(req: NextRequest) {
  return NextResponse.json({}, { headers: corsHeaders })
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const influencerId = searchParams.get("influencerId")

    // Load all badges from Firestore
    const allBadges = await loadBadgesFromFirestore()
    console.log("All Badges:", allBadges.length)
    console.log("Influencer ID:", influencerId)
    // Filter by influencer ID if provided
    if (influencerId) {
      const userBadges = allBadges.filter((badge) => badge.influencerId === influencerId)
      return NextResponse.json(userBadges, { headers: corsHeaders })
    }
    
    // Return all badges if no influencer ID specified
    return NextResponse.json(allBadges, { headers: corsHeaders })
  } catch (error) {
    console.error("Error fetching badges:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500, headers: corsHeaders }
    )
  }
}