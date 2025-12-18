import { Suspense } from "react"
import { SignupForm } from "@/components/auth/signup-form"
import Link from "next/link"
import { Scissors } from "lucide-react"

export default function SignupPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-muted p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <Scissors className="h-8 w-8" />
            <span className="text-2xl font-bold">Haib Tailor</span>
          </Link>
          <h1 className="text-3xl font-bold mb-2">Create Account</h1>
          <p className="text-muted-foreground">Get started with Haib Tailor</p>
        </div>

        <div className="bg-background border border-border rounded-lg p-8">
          <Suspense
            fallback={<div className="text-center text-muted-foreground py-4">Preparing signup options...</div>}
          >
            <SignupForm />
          </Suspense>

          <div className="mt-6 text-center text-sm">
            <p className="text-muted-foreground">
              Already have an account?{" "}
              <Link href="/auth/login" className="font-medium underline underline-offset-4">
                Log in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
