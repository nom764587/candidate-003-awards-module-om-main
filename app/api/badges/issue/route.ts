import { type NextRequest, NextResponse } from "next/server"
import { saveBadgeToFirestore, loadBadgesFromFirestore, generateUniqueBadgeId } from "@/lib/firestore"

export const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
}

export async function OPTIONS(req: NextRequest) {
  return NextResponse.json({}, { headers: corsHeaders })
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { influencerId, badge } = body

    // Validate required fields
    if (!influencerId || !badge) {
      return NextResponse.json(
        { error: "influencerId and badge are required" },
        { status: 400, headers: corsHeaders }
      )
    }

    // Validate influencer ID format
    if (!influencerId.startsWith("INF_")) {
      return NextResponse.json(
        { error: "Invalid influencer ID format. Must start with 'INF_'" },
        { status: 400, headers: corsHeaders }
      )
    }

    // Load existing badges to generate unique ID
    const existingBadges = await loadBadgesFromFirestore()
    const badgeId = generateUniqueBadgeId(existingBadges)

    // Create badge object
    const badgeData = {
      badgeId,
      influencerId,
      badge,
      awardedAt: new Date().toISOString(),
    }

    // Save badge to Firestore
    await saveBadgeToFirestore(badgeData)

    return NextResponse.json({ badgeId }, { headers: corsHeaders })
  } catch (error) {
    console.error("Error issuing badge:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500, headers: corsHeaders }
    )
  }
}