import { redirect } from "next/navigation"
import { getSession } from "@/lib/auth"
import { AdminHeader } from "@/components/admin/admin-header"
import { PlatformSettings } from "@/components/admin/platform-settings"
import { CommissionSettings } from "@/components/admin/commission-settings"
import { RefundManager } from "@/components/admin/refund-manager"
import { BulkOrderManager } from "@/components/admin/bulk-order-manager"

export default async function AdminSettingsPage() {
  const user = await getSession()

  if (!user || user.role !== "admin") {
    redirect("/auth/login")
  }

  return (
    <div className="min-h-screen bg-background">
      <AdminHeader user={user} />

      <main className="container mx-auto px-4 py-8 space-y-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Platform Settings</h1>
          <p className="text-muted-foreground max-w-3xl">
            Configure registration rules, payments, commissions, refunds, and bulk order workflows for the entire
            marketplace.
          </p>
        </div>

        <PlatformSettings />

        <div className="grid lg:grid-cols-2 gap-6">
          <CommissionSettings />
          <RefundManager />
        </div>

        <BulkOrderManager />
      </main>
    </div>
  )
}
