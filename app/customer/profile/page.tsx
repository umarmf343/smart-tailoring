import { getSession } from "@/lib/auth"
import { redirect } from "next/navigation"
import { CustomerHeader } from "@/components/customer/customer-header"
import { CustomerProfile } from "@/components/customer/customer-profile"

export default async function ProfilePage() {
  const user = await getSession()

  if (!user || user.role !== "customer") {
    redirect("/auth/login")
  }

  return (
    <div className="min-h-screen bg-background">
      <CustomerHeader user={user} />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">My Profile</h1>
          <p className="text-muted-foreground">Manage your personal information and preferences</p>
        </div>

        <CustomerProfile user={user} />
      </main>
    </div>
  )
}
