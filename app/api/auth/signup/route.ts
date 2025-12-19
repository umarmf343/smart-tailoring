import { type NextRequest, NextResponse } from "next/server"

import { signUp } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password, phone, name, role } = body

    if (!email || !password || !phone || !name || !role) {
      return NextResponse.json({ success: false, error: "All fields are required" }, { status: 400 })
    }

    const result = await signUp({ email, password, phone, name, role })

    if (!result.success) {
      return NextResponse.json(result, { status: 400 })
    }

    return NextResponse.json(result)
  } catch (error) {
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}
