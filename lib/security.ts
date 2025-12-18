"use server"

// Note: bcrypt would normally be installed, but for demo purposes we'll simulate it

export async function hashPassword(password: string): Promise<string> {
  // In production, use: const bcrypt = require('bcryptjs')
  // return await bcrypt.hash(password, 10)

  // Simulated hash for demo
  const hash = Buffer.from(password).toString("base64")
  return `$2b$10$${hash}`
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  // In production, use: const bcrypt = require('bcryptjs')
  // return await bcrypt.compare(password, hash)

  // Simulated verification for demo
  const expectedHash = await hashPassword(password)
  return hash === expectedHash
}

export function generateToken(length = 32): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
  let token = ""
  for (let i = 0; i < length; i++) {
    token += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return token
}

export function sanitizeInput(input: string): string {
  return input.trim().replace(/[<>]/g, "")
}
