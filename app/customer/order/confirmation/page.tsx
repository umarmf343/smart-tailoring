import { redirect } from "next/navigation"
import { getSession } from "@/lib/auth"
import { OrderConfirmation } from "@/components/customer/order-confirmation"

export default async function OrderConfirmationPage() {
  const user = await getSession()

  if (!user || user.role !== "customer") {
    redirect("/auth/login")
  }

  return <OrderConfirmation user={user} />
}
