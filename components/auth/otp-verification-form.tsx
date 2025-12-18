"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp"
import { CheckCircle } from "lucide-react"

export function OTPVerificationForm() {
  const router = useRouter()
  const [otp, setOtp] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")

    if (otp.length !== 6) {
      setError("Please enter a valid 6-digit code")
      return
    }

    setLoading(true)

    // Mock verification - replace with actual OTP verification
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Simulate success
    setSuccess(true)
    setLoading(false)

    setTimeout(() => {
      router.push("/tailor/dashboard")
    }, 2000)
  }

  async function handleResend() {
    setError("")
    // Mock resend - replace with actual resend logic
    await new Promise((resolve) => setTimeout(resolve, 500))
    alert("New code sent to your email")
  }

  if (success) {
    return (
      <div className="text-center space-y-4">
        <div className="flex justify-center">
          <div className="h-16 w-16 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
            <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
          </div>
        </div>
        <div>
          <h3 className="font-bold text-lg mb-2">Verification Successful</h3>
          <p className="text-sm text-muted-foreground">Redirecting to your dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex justify-center">
        <InputOTP maxLength={6} value={otp} onChange={setOtp}>
          <InputOTPGroup>
            <InputOTPSlot index={0} />
            <InputOTPSlot index={1} />
            <InputOTPSlot index={2} />
            <InputOTPSlot index={3} />
            <InputOTPSlot index={4} />
            <InputOTPSlot index={5} />
          </InputOTPGroup>
        </InputOTP>
      </div>

      {error && <div className="text-sm text-destructive text-center">{error}</div>}

      <Button type="submit" className="w-full" disabled={loading || otp.length !== 6}>
        {loading ? "Verifying..." : "Verify Code"}
      </Button>

      <div className="text-center">
        <Button type="button" variant="link" onClick={handleResend} className="text-sm">
          Didn't receive code? Resend
        </Button>
      </div>
    </form>
  )
}
