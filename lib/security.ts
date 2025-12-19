import { randomBytes, scryptSync, timingSafeEqual } from "crypto"

const SALT_LENGTH = 16
const KEY_LENGTH = 64

function deriveKey(password: string, salt: string) {
  return scryptSync(password, salt, KEY_LENGTH)
}

export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(SALT_LENGTH).toString("hex")
  const derivedKey = deriveKey(password, salt)
  return `${salt}:${derivedKey.toString("hex")}`
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  const [salt, storedHash] = hash.split(":")
  if (!salt || !storedHash) return false

  const derivedKey = deriveKey(password, salt)
  const storedBuffer = Buffer.from(storedHash, "hex")

  if (storedBuffer.length !== derivedKey.length) return false

  return timingSafeEqual(derivedKey, storedBuffer)
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
