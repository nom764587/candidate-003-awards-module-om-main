import { type NextRequest, NextResponse } from "next/server"
import { Registration, loadRegistrationsFromFirestore } from "@/lib/firestore"

// Read registrations from Firestore
async function readRegistrations(): Promise<Registration[]> {
  return await loadRegistrationsFromFirestore()
}
export const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};


export async function OPTIONS(req: NextRequest) {
  return NextResponse.json({}, { headers: corsHeaders });
}
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const influencerId = searchParams.get("influencerId")

  // Read registrations from Firestore
  const registrations = await readRegistrations()

  if (influencerId) {
    const userRegistrations = registrations.filter((reg) => reg.influencerId === influencerId)
    return NextResponse.json(userRegistrations, { headers: corsHeaders })
  }

  return NextResponse.json(registrations, { headers: corsHeaders })
}
