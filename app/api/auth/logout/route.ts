import { NextResponse } from "next/server"

import { logout } from "@/lib/auth"

export async function POST() {
  try {
    const result = await logout()
    return NextResponse.json(result)
  } catch {
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}
