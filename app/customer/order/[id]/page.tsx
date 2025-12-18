import { getSession } from "@/lib/auth"
import { redirect } from "next/navigation"
import { CustomerHeader } from "@/components/customer/customer-header"
import { OrderDetail } from "@/components/customer/order-detail"

export default async function OrderDetailPage({ params }: { params: { id: string } }) {
  const user = await getSession()
  const { id } = params

  if (!user || user.role !== "customer") {
    redirect("/auth/login")
  }

  return (
    <div className="min-h-screen bg-background">
      <CustomerHeader user={user} />

      <main className="container mx-auto px-4 py-8">
        <OrderDetail orderId={id} />
      </main>
    </div>
  )
}
