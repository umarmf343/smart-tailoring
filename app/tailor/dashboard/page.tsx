import { redirect } from "next/navigation"
import { getSession } from "@/lib/auth"
import { TailorDashboard } from "@/components/tailor/tailor-dashboard"

export default async function TailorDashboardPage() {
  const user = await getSession()

  if (!user || user.role !== "tailor") {
    redirect("/auth/login")
  }

  return <TailorDashboard user={user} />
}
