import { redirect } from "next/navigation"
import { getSession } from "@/lib/auth"
import { CustomerDashboard } from "@/components/customer/customer-dashboard"

export default async function CustomerDashboardPage() {
  const user = await getSession()

  if (!user || user.role !== "customer") {
    redirect("/auth/login")
  }

  return <CustomerDashboard user={user} />
}
