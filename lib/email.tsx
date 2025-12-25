"use server"

import { formatNaira } from "@/lib/currency"

export async function sendEmail(to: string, subject: string, html: string) {
  // In production, use Nodemailer or email service provider
  // const nodemailer = require('nodemailer')
  // const transporter = nodemailer.createTransport({...})
  // await transporter.sendMail({ from, to, subject, html })

  console.log("[v0] Email would be sent to:", to)
  console.log("[v0] Subject:", subject)
  return { success: true, messageId: `MSG-${Date.now()}` }
}

export async function sendPasswordResetEmail(email: string, token: string) {
  const resetUrl = `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/auth/reset-password/${token}`

  const html = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>Reset Your Password</h2>
      <p>Click the link below to reset your password:</p>
      <a href="${resetUrl}" style="display: inline-block; padding: 12px 24px; background: #000; color: #fff; text-decoration: none; border-radius: 4px;">
        Reset Password
      </a>
      <p>This link will expire in 1 hour.</p>
      <p>If you didn't request this, please ignore this email.</p>
    </div>
  `

  return sendEmail(email, "Reset Your Password - Haib Tailor", html)
}

export async function sendOrderConfirmationEmail(email: string, orderDetails: any) {
  const html = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>Order Confirmation</h2>
      <p>Thank you for your order!</p>
      <p><strong>Order ID:</strong> ${orderDetails.id}</p>
      <p><strong>Service:</strong> ${orderDetails.service}</p>
      <p><strong>Total:</strong> ${formatNaira(orderDetails.price)}</p>
      <p>Your tailor will be in touch soon!</p>
    </div>
  `

  return sendEmail(email, `Order Confirmation - ${orderDetails.id}`, html)
}
