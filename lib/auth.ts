"use server"

import { cookies } from "next/headers"
import type { User } from "./types"

type AuthUser = User & { password: string }

// Mock database - replace with actual database later
export const MOCK_USERS: AuthUser[] = [
  {
    id: "1",
    email: "admin@haib.com",
    phone: "+1234567890",
    name: "Admin User",
    role: "admin",
    password: "admin123",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "2",
    email: "customer@haib.com",
    phone: "+15551234567",
    name: "Amelia Customer",
    role: "customer",
    password: "customer123",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "3",
    email: "tailor@haib.com",
    phone: "+15557654321",
    name: "Taylor Stitch",
    role: "tailor",
    password: "tailor123",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
]

function sanitizeUser(user: AuthUser): User {
  const { password, ...safeUser } = user
  return safeUser
}

function findUserByEmail(email: string) {
  return MOCK_USERS.find((user) => user.email.toLowerCase() === email.toLowerCase())
}

function findUserById(id: string) {
  return MOCK_USERS.find((user) => user.id === id)
}

export async function createSession(user: User) {
  const cookieStore = await cookies()
  cookieStore.set("session", JSON.stringify({ userId: user.id, role: user.role }), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7, // 1 week
  })
}

function validateCredentials(email: string, password: string): User | null {
  const user = findUserByEmail(email)

  if (!user || user.password !== password) {
    return null
  }

  return sanitizeUser(user)
}

export async function signUp(data: {
  email: string
  password: string
  phone: string
  name: string
  role: "customer" | "tailor"
}) {
  // Mock signup - replace with actual database and password hashing
  const existingUser = findUserByEmail(data.email)

  if (existingUser) {
    return { success: false, error: "User already exists" }
  }

  const newUser: AuthUser = {
    id: Math.random().toString(36).substring(7),
    email: data.email,
    phone: data.phone,
    name: data.name,
    role: data.role,
    password: data.password,
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  MOCK_USERS.push(newUser)

  const safeUser = sanitizeUser(newUser)
  await createSession(safeUser)

  return { success: true, user: safeUser }
}

export async function login(email: string, password: string) {
  // Mock login - replace with actual authentication
  const user = validateCredentials(email, password)

  if (!user) {
    return { success: false, error: "Invalid credentials" }
  }

  await createSession(user)

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
    const user = findUserById(session.userId)
    return user ? sanitizeUser(user) : null
  } catch {
    return null
  }
}
