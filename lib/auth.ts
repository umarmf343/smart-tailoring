import "server-only"

import bcrypt from "bcryptjs"
import { cookies } from "next/headers"
import { prisma } from "@/lib/prisma"
import type { User, UserRole } from "./types"

function normalizeEmail(email: string) {
  return email.trim().toLowerCase()
}

function normalizeRole(role: string): UserRole {
  const normalized = role.toLowerCase()
  if (normalized === "tailor" || normalized === "admin") return normalized
  return "customer"
}

function sanitizeUser(user: { passwordHash: string } & User): User {
  const { passwordHash, ...safeUser } = user
  return safeUser
}

async function findUserByEmail(email: string) {
  const normalizedEmail = normalizeEmail(email)
  return prisma.user.findUnique({ where: { email: normalizedEmail } })
}

async function findUserById(id: string) {
  return prisma.user.findUnique({ where: { id } })
}

export async function createSession(user: User) {
  const cookieStore = await cookies()
  cookieStore.set("session", JSON.stringify({ userId: user.id, role: user.role }), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7, // 1 week
  })
}

async function validateCredentials(email: string, password: string): Promise<User | null> {
  const user = await findUserByEmail(email)

  if (!user) {
    return null
  }

  const isValidPassword = await bcrypt.compare(password, user.passwordHash)

  if (!isValidPassword) {
    return null
  }

  return sanitizeUser({
    ...user,
    role: normalizeRole(user.role),
  })
}

export async function signUp(data: {
  email: string
  password: string
  phone: string
  name: string
  role: "customer" | "tailor"
}) {
  const normalizedEmail = normalizeEmail(data.email)
  const existingUser = await findUserByEmail(normalizedEmail)

  if (existingUser) {
    return { success: false, error: "User already exists" }
  }

  const passwordHash = await bcrypt.hash(data.password, 10)

  const newUser = await prisma.user.create({
    data: {
      email: normalizedEmail,
      phone: data.phone.trim(),
      name: data.name.trim(),
      role: data.role.toUpperCase(),
      passwordHash,
    },
  })

  const safeUser = sanitizeUser({
    ...newUser,
    role: normalizeRole(newUser.role),
  })
  await createSession(safeUser)

  return { success: true, user: safeUser }
}

export async function login(email: string, password: string) {
  const user = await validateCredentials(email, password)

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
    const user = await findUserById(session.userId)
    return user
      ? sanitizeUser({
          ...user,
          role: normalizeRole(user.role),
        })
      : null
  } catch {
    return null
  }
}
