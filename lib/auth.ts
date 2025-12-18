"use server"

import { cookies } from "next/headers"
import type { User } from "./types"

// Mock database - replace with actual database later
const MOCK_USERS: User[] = [
  {
    id: "1",
    email: "admin@haib.com",
    phone: "+1234567890",
    name: "Admin User",
    role: "admin",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
]

export async function signUp(data: {
  email: string
  password: string
  phone: string
  name: string
  role: "customer" | "tailor"
}) {
  // Mock signup - replace with actual database and password hashing
  const existingUser = MOCK_USERS.find((u) => u.email === data.email)

  if (existingUser) {
    return { success: false, error: "User already exists" }
  }

  const newUser: User = {
    id: Math.random().toString(36).substring(7),
    email: data.email,
    phone: data.phone,
    name: data.name,
    role: data.role,
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  MOCK_USERS.push(newUser)

  // Create session
  const session = { userId: newUser.id, role: newUser.role }
  const cookieStore = await cookies()
  cookieStore.set("session", JSON.stringify(session), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7, // 1 week
  })

  return { success: true, user: newUser }
}

export async function login(email: string, password: string) {
  // Mock login - replace with actual authentication
  const user = MOCK_USERS.find((u) => u.email === email)

  if (!user) {
    return { success: false, error: "Invalid credentials" }
  }

  // Create session
  const session = { userId: user.id, role: user.role }
  const cookieStore = await cookies()
  cookieStore.set("session", JSON.stringify(session), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7, // 1 week
  })

  return { success: true, user }
}

export async function logout() {
  const cookieStore = await cookies()
  cookieStore.delete("session")
  return { success: true }
}

export async function getSession() {
  const cookieStore = await cookies()
  const sessionCookie = cookieStore.get("session")

  if (!sessionCookie) {
    return null
  }

  try {
    const session = JSON.parse(sessionCookie.value)
    const user = MOCK_USERS.find((u) => u.id === session.userId)
    return user || null
  } catch {
    return null
  }
}
