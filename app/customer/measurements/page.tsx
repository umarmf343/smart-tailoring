import { redirect } from "next/navigation"
import { getSession } from "@/lib/auth"
import { CustomerHeader } from "@/components/customer/customer-header"
import { MeasurementManager } from "@/components/customer/measurement-manager"
import { ReferralProgram } from "@/components/customer/referral-program"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default async function MeasurementsPage() {
  const user = await getSession()

  if (!user || user.role !== "customer") {
    redirect("/auth/login")
  }

  return (
    <div className="min-h-screen bg-background">
      <CustomerHeader user={user} />

      <main className="container mx-auto px-4 py-8 space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Measurement Library</h1>
          <p className="text-muted-foreground max-w-2xl">
            Save detailed body measurements for every garment type so tailors can deliver the perfect fit without
            repeated appointments.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <MeasurementManager />

            <Card>
              <CardHeader>
                <CardTitle>Fit Tips</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-muted-foreground">
                <p>
                  • Add multiple profiles (e.g., “Formal Suit”, “Casual Wear”, “Traditional”) so tailors know the
                  intended fit.
                </p>
                <p>• Update your unit preference before entering values to avoid conversions later.</p>
                <p>
                  • Use the notes field in orders to flag any changes since your last fitting or to highlight preferred
                  ease.
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <ReferralProgram userId={user.id} />
            <Card>
              <CardHeader>
                <CardTitle>Reuse Measurements</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-muted-foreground">
                <p>Attach an existing profile when placing an order to skip re-entering details.</p>
                <p>Tailors can request clarifications directly through Messages if something looks off.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
