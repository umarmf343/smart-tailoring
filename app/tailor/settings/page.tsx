import { redirect } from "next/navigation"
import { getSession } from "@/lib/auth"
import { TailorHeader } from "@/components/tailor/tailor-header"
import { AvailabilityCalendar } from "@/components/tailor/availability-calendar"
import { ServiceAreaManager } from "@/components/tailor/service-area-manager"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

export default async function TailorSettingsPage() {
  const user = await getSession()

  if (!user || user.role !== "tailor") {
    redirect("/auth/login")
  }

  return (
    <div className="min-h-screen bg-background">
      <TailorHeader user={user} />

      <main className="container mx-auto px-4 py-8 space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Settings & Availability</h1>
          <p className="text-muted-foreground max-w-2xl">
            Control the areas you serve, set appointment availability, and fine-tune how customers can reach you.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <AvailabilityCalendar />
            <ServiceAreaManager />
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Customer Communication</CardTitle>
                <CardDescription>Decide how customers can contact you for clarifications</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="messages">Enable in-app messaging</Label>
                  <Switch id="messages" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="clarifications">Allow measurement clarification requests</Label>
                  <Switch id="clarifications" defaultChecked />
                </div>
                <p className="text-sm text-muted-foreground">
                  When enabled, customers can message you directly and respond to adjustment requests before work
                  starts.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Safety & Visibility</CardTitle>
                <CardDescription>Control what customers see on your public profile</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="show-address">Show shop address</Label>
                  <Switch id="show-address" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="accept-walkins">Accept walk-in fittings</Label>
                  <Switch id="accept-walkins" />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="share-portfolio">Display portfolio publicly</Label>
                  <Switch id="share-portfolio" defaultChecked />
                </div>
                <p className="text-sm text-muted-foreground">
                  Adjust visibility to balance online appointments with in-store visits while keeping your portfolio
                  discoverable.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
