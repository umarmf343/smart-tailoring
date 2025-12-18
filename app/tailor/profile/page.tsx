import { redirect } from "next/navigation"
import { getSession } from "@/lib/auth"
import { TailorHeader } from "@/components/tailor/tailor-header"
import { TailorProfile } from "@/components/tailor/tailor-profile"
import { TailorPortfolio } from "@/components/tailor/tailor-portfolio"

export default async function TailorProfilePage() {
  const user = await getSession()

  if (!user || user.role !== "tailor") {
    redirect("/auth/login")
  }

  return (
    <div className="min-h-screen bg-background">
      <TailorHeader user={user} />

      <main className="container mx-auto px-4 py-8 space-y-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Business Profile</h1>
          <p className="text-muted-foreground max-w-2xl">
            Publish your shop details, specialties, and showcase recent work so customers can trust your craft before
            booking.
          </p>
        </div>

        <TailorProfile />
        <TailorPortfolio />
      </main>
    </div>
  )
}
