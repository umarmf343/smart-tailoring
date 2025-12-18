import { redirect } from "next/navigation"
import { getSession } from "@/lib/auth"
import { AdminDashboard } from "@/components/admin/admin-dashboard"

export default async function AdminDashboardPage() {
  const user = await getSession()

  if (!user || user.role !== "admin") {
    redirect("/auth/login")
  }

  return <AdminDashboard user={user} />
}
