import { OTPVerificationForm } from "@/components/auth/otp-verification-form"
import Link from "next/link"
import { Scissors, ShieldCheck } from "lucide-react"

export default function VerifyOTPPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-muted p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <Scissors className="h-8 w-8" />
            <span className="text-2xl font-bold">Haib Tailor</span>
          </Link>
          <div className="flex justify-center mb-4">
            <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
              <ShieldCheck className="h-8 w-8 text-primary" />
            </div>
          </div>
          <h1 className="text-3xl font-bold mb-2">Verify Your Account</h1>
          <p className="text-muted-foreground">Enter the 6-digit code sent to your email</p>
        </div>

        <div className="bg-background border border-border rounded-lg p-8">
          <OTPVerificationForm />
        </div>
      </div>
    </div>
  )
}
