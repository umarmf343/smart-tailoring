import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = body

    if (!email || !password) {
      return NextResponse.json({ success: false, error: "Email and password required" }, { status: 400 })
    }

    // Mock user verification - replace with actual database query
    const mockUser = {
      id: "1",
      email: "admin@haib.com",
      name: "Admin User",
      role: "admin" as const,
    }

    if (email !== mockUser.email) {
      return NextResponse.json({ success: false, error: "Invalid credentials" }, { status: 401 })
    }

    // Verify password (in production, compare with hashed password)
    // const isValid = await verifyPassword(password, user.passwordHash)

    const session = { userId: mockUser.id, role: mockUser.role }
    const cookieStore = await cookies()
    cookieStore.set("session", JSON.stringify(session), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7,
    })

    return NextResponse.json({ success: true, user: mockUser })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}
