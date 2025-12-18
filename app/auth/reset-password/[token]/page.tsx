import { ResetPasswordForm } from "@/components/auth/reset-password-form"
import Link from "next/link"
import { Scissors } from "lucide-react"

export default async function ResetPasswordPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <Scissors className="h-8 w-8" />
            <span className="text-2xl font-bold">Haib Tailor</span>
          </Link>
          <h1 className="text-3xl font-bold mb-2">Set New Password</h1>
          <p className="text-muted-foreground">Enter your new password below</p>
        </div>

        <div className="bg-background border border-border rounded-lg p-8">
          <ResetPasswordForm token={token} />
        </div>
      </div>
    </div>
  )
}
