"use client"

interface AuthResponse<TUser = unknown> {
  success: boolean
  user?: TUser
  error?: string
}

export function normalizeEmail(email: string) {
  return email.trim().toLowerCase()
}

async function postAuth<TResponse>(path: string, body: Record<string, unknown>): Promise<AuthResponse<TResponse>> {
  const response = await fetch(path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  })

  const data = await response.json()

  if (!response.ok) {
    return { success: false, error: data.error || "Something went wrong" }
  }

  return data
}

export async function login(email: string, password: string) {
  return postAuth("/api/auth/login", { email: normalizeEmail(email), password })
}

export async function signUp(data: {
  email: string
  password: string
  phone: string
  name: string
  role: "customer" | "tailor"
}) {
  return postAuth("/api/auth/signup", {
    ...data,
    email: normalizeEmail(data.email),
    phone: data.phone.trim(),
    name: data.name.trim(),
  })
}

export async function logout() {
  return postAuth("/api/auth/logout", {})
}
