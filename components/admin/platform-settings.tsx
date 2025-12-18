"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Settings, Mail, Globe, Shield, DollarSign } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function PlatformSettings() {
  const [settings, setSettings] = useState({
    siteName: "Haib Tailor",
    siteDescription: "Custom Tailoring Made Simple",
    supportEmail: "support@haibtailor.com",
    enableRegistration: true,
    requireEmailVerification: true,
    defaultCommissionRate: 15,
    minOrderAmount: 50,
    maxOrderAmount: 5000,
    enableReviews: true,
    enableMessaging: true,
  })

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Platform Settings
          </CardTitle>
          <CardDescription>Configure system-wide settings and preferences</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="general">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="general">General</TabsTrigger>
              <TabsTrigger value="features">Features</TabsTrigger>
              <TabsTrigger value="payments">Payments</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
            </TabsList>

            <TabsContent value="general" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="siteName" className="flex items-center gap-2">
                  <Globe className="h-4 w-4" />
                  Site Name
                </Label>
                <Input
                  id="siteName"
                  value={settings.siteName}
                  onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="siteDescription">Site Description</Label>
                <Textarea
                  id="siteDescription"
                  value={settings.siteDescription}
                  onChange={(e) => setSettings({ ...settings, siteDescription: e.target.value })}
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="supportEmail" className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Support Email
                </Label>
                <Input
                  id="supportEmail"
                  type="email"
                  value={settings.supportEmail}
                  onChange={(e) => setSettings({ ...settings, supportEmail: e.target.value })}
                />
              </div>

              <Button className="mt-4">Save Changes</Button>
            </TabsContent>

            <TabsContent value="features" className="space-y-4">
              <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                <div>
                  <p className="font-medium">Enable User Registration</p>
                  <p className="text-sm text-muted-foreground">Allow new users to sign up</p>
                </div>
                <Switch
                  checked={settings.enableRegistration}
                  onCheckedChange={(checked) => setSettings({ ...settings, enableRegistration: checked })}
                />
              </div>

              <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                <div>
                  <p className="font-medium">Enable Reviews</p>
                  <p className="text-sm text-muted-foreground">Allow customers to leave reviews</p>
                </div>
                <Switch
                  checked={settings.enableReviews}
                  onCheckedChange={(checked) => setSettings({ ...settings, enableReviews: checked })}
                />
              </div>

              <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                <div>
                  <p className="font-medium">Enable Messaging</p>
                  <p className="text-sm text-muted-foreground">Allow customer-tailor communication</p>
                </div>
                <Switch
                  checked={settings.enableMessaging}
                  onCheckedChange={(checked) => setSettings({ ...settings, enableMessaging: checked })}
                />
              </div>

              <Button className="mt-4">Save Changes</Button>
            </TabsContent>

            <TabsContent value="payments" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="commissionRate" className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  Default Commission Rate (%)
                </Label>
                <Input
                  id="commissionRate"
                  type="number"
                  value={settings.defaultCommissionRate}
                  onChange={(e) => setSettings({ ...settings, defaultCommissionRate: Number.parseInt(e.target.value) })}
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="minOrder">Minimum Order Amount ($)</Label>
                  <Input
                    id="minOrder"
                    type="number"
                    value={settings.minOrderAmount}
                    onChange={(e) => setSettings({ ...settings, minOrderAmount: Number.parseInt(e.target.value) })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="maxOrder">Maximum Order Amount ($)</Label>
                  <Input
                    id="maxOrder"
                    type="number"
                    value={settings.maxOrderAmount}
                    onChange={(e) => setSettings({ ...settings, maxOrderAmount: Number.parseInt(e.target.value) })}
                  />
                </div>
              </div>

              <Button className="mt-4">Save Changes</Button>
            </TabsContent>

            <TabsContent value="security" className="space-y-4">
              <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                <div>
                  <p className="font-medium flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    Require Email Verification
                  </p>
                  <p className="text-sm text-muted-foreground">Verify email addresses for new accounts</p>
                </div>
                <Switch
                  checked={settings.requireEmailVerification}
                  onCheckedChange={(checked) => setSettings({ ...settings, requireEmailVerification: checked })}
                />
              </div>

              <div className="p-4 border border-border rounded-lg">
                <p className="font-medium mb-2">Session Duration</p>
                <p className="text-sm text-muted-foreground mb-3">Set how long user sessions remain active</p>
                <Input type="number" placeholder="7" />
                <p className="text-xs text-muted-foreground mt-1">Days</p>
              </div>

              <Button className="mt-4">Save Changes</Button>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
