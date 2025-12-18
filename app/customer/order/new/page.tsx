import { redirect } from "next/navigation"
import { getSession } from "@/lib/auth"
import { OrderPlacement } from "@/components/customer/order-placement"

export default async function NewOrderPage() {
  const user = await getSession()

  if (!user || user.role !== "customer") {
    redirect("/auth/login")
  }

  return <OrderPlacement user={user} />
}
