"use client"

import type { User } from "@/lib/types"
import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import {
  Camera,
  CheckCircle2,
  CreditCard,
  Globe,
  Lock,
  Mail,
  MapPin,
  Palette,
  Phone,
  Save,
  Shield,
  ShieldCheck,
  Sparkles,
} from "lucide-react"

interface CustomerProfileProps {
  user: User
}

export function CustomerProfile({ user }: CustomerProfileProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
    phone: user.phone,
    address: "",
    city: "Lagos, Nigeria",
    preferredFit: "Tailored fit",
  })
  const [preferences, setPreferences] = useState({
    twoFactor: true,
    loginAlerts: true,
    marketingEmails: false,
    smsAlerts: true,
    darkMode: true,
    autoSaveMeasurements: true,
  })

  function handleSave() {
    // Mock save - replace with actual API call
    setIsEditing(false)
  }

  return (
    <div className="space-y-8">
      <Card className="overflow-hidden border-none bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white shadow-lg">
        <CardContent className="p-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-4">
              <div className="relative">
                <Avatar className="h-16 w-16 border border-white/10 bg-white/10 text-white">
                  <AvatarFallback className="text-2xl font-semibold uppercase">{user.name.slice(0, 2)}</AvatarFallback>
                </Avatar>
                <Button
                  size="sm"
                  variant="secondary"
                  className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full p-0 bg-white text-slate-900 hover:bg-white/90"
                >
                  <Camera className="h-4 w-4" />
                </Button>
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-2xl font-semibold">Welcome back, {user.name}</h1>
                  <Badge variant="secondary" className="bg-white/10 text-white">
                    Customer
                  </Badge>
                  <Badge variant="secondary" className="bg-emerald-500/20 text-emerald-100">
                    Verified
                  </Badge>
                </div>
                <p className="text-sm text-slate-200/80 mt-1">
                  Keep your account details fresh and secure to get tailored updates and smoother fittings.
                </p>
                <div className="mt-3 flex flex-wrap gap-4 text-sm text-slate-200/80">
                  <span className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    {user.email}
                  </span>
                  <span className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    {user.phone}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button variant="secondary" className="bg-white text-slate-900 hover:bg-white/90 gap-2">
                <Sparkles className="h-4 w-4" />
                Guided update
              </Button>
              <Button variant="outline" className="border-white/20 text-white hover:bg-white/10" onClick={() => setIsEditing(true)}>
                Edit profile
              </Button>
            </div>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { title: "Loyalty tier", value: "Tailor Circle", icon: ShieldCheck },
              { title: "Completed orders", value: "12", icon: CheckCircle2 },
              { title: "Fit preference", value: formData.preferredFit, icon: Sparkles },
              { title: "Last login", value: "Today, 09:24 AM", icon: Lock },
            ].map((item) => (
              <div key={item.title} className="rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur">
                <div className="flex items-center gap-2 text-sm text-slate-200/80">
                  <item.icon className="h-4 w-4" />
                  {item.title}
                </div>
                <p className="mt-2 text-xl font-semibold">{item.value}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle>Account profile</CardTitle>
              <CardDescription>Refresh your personal details and preferences</CardDescription>
            </div>
            {!isEditing && (
              <Button variant="outline" onClick={() => setIsEditing(true)} className="gap-2">
                <Sparkles className="h-4 w-4" />
                Start editing
              </Button>
            )}
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name" className="flex items-center gap-2">
                  Full Name
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  disabled={!isEditing}
                  className={!isEditing ? "bg-muted" : ""}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  disabled={!isEditing}
                  className={!isEditing ? "bg-muted" : ""}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  Phone Number
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  disabled={!isEditing}
                  className={!isEditing ? "bg-muted" : ""}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="city" className="flex items-center gap-2">
                  <Globe className="h-4 w-4" />
                  City / Region
                </Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  disabled={!isEditing}
                  className={!isEditing ? "bg-muted" : ""}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address" className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Primary address
              </Label>
              <Textarea
                id="address"
                placeholder="Enter your full address..."
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                disabled={!isEditing}
                className={!isEditing ? "bg-muted" : ""}
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="fit" className="flex items-center gap-2">
                <Palette className="h-4 w-4" />
                Fit & styling note
              </Label>
              <Input
                id="fit"
                value={formData.preferredFit}
                onChange={(e) => setFormData({ ...formData, preferredFit: e.target.value })}
                disabled={!isEditing}
                className={!isEditing ? "bg-muted" : ""}
                placeholder="E.g. tapered legs, structured shoulders"
              />
            </div>

            {isEditing && (
              <div className="flex flex-wrap gap-2 pt-2">
                <Button type="button" onClick={handleSave} className="gap-2">
                  <Save className="h-4 w-4" />
                  Save changes
                </Button>
                <Button type="button" variant="outline" onClick={() => setIsEditing(false)}>
                  Cancel
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Security center</CardTitle>
              <CardDescription>Protect your sessions and measurements</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between rounded-lg border border-border p-4">
                <div>
                  <p className="font-medium">Password</p>
                  <p className="text-sm text-muted-foreground">Last changed 30 days ago</p>
                </div>
                <Button variant="outline" className="gap-2">
                  <Lock className="h-4 w-4" />
                  Update
                </Button>
              </div>
              <div className="flex items-center justify-between rounded-lg border border-border p-4">
                <div>
                  <p className="font-medium">Two-factor authentication</p>
                  <p className="text-sm text-muted-foreground">Add an extra layer on login</p>
                </div>
                <Switch
                  checked={preferences.twoFactor}
                  onCheckedChange={(checked) => setPreferences((prev) => ({ ...prev, twoFactor: checked }))}
                />
              </div>
              <div className="flex items-center justify-between rounded-lg border border-border p-4">
                <div>
                  <p className="font-medium">Login alerts</p>
                  <p className="text-sm text-muted-foreground">Notify on new devices and locations</p>
                </div>
                <Switch
                  checked={preferences.loginAlerts}
                  onCheckedChange={(checked) => setPreferences((prev) => ({ ...prev, loginAlerts: checked }))}
                />
              </div>
              <div className="flex items-center justify-between rounded-lg border border-border p-4">
                <div>
                  <p className="font-medium">Saved measurement backups</p>
                  <p className="text-sm text-muted-foreground">Auto-save drafts for fitting sessions</p>
                </div>
                <Switch
                  checked={preferences.autoSaveMeasurements}
                  onCheckedChange={(checked) => setPreferences((prev) => ({ ...prev, autoSaveMeasurements: checked }))}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Payment & preferences</CardTitle>
              <CardDescription>Manage notifications and default experiences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between rounded-lg border border-border p-4">
                <div>
                  <p className="font-medium">Payment methods</p>
                  <p className="text-sm text-muted-foreground">Cards and wallets for deposits</p>
                </div>
                <Button variant="outline" className="gap-2">
                  <CreditCard className="h-4 w-4" />
                  Manage
                </Button>
              </div>
              <div className="flex items-center justify-between rounded-lg border border-border p-4">
                <div>
                  <p className="font-medium">Marketing emails</p>
                  <p className="text-sm text-muted-foreground">Exclusive drops and fabric arrivals</p>
                </div>
                <Switch
                  checked={preferences.marketingEmails}
                  onCheckedChange={(checked) => setPreferences((prev) => ({ ...prev, marketingEmails: checked }))}
                />
              </div>
              <div className="flex items-center justify-between rounded-lg border border-border p-4">
                <div>
                  <p className="font-medium">SMS updates</p>
                  <p className="text-sm text-muted-foreground">Progress pings for active orders</p>
                </div>
                <Switch
                  checked={preferences.smsAlerts}
                  onCheckedChange={(checked) => setPreferences((prev) => ({ ...prev, smsAlerts: checked }))}
                />
              </div>
              <div className="flex items-center justify-between rounded-lg border border-border p-4">
                <div>
                  <p className="font-medium">Interface theme</p>
                  <p className="text-sm text-muted-foreground">Match your workspace look and feel</p>
                </div>
                <Switch
                  checked={preferences.darkMode}
                  onCheckedChange={(checked) => setPreferences((prev) => ({ ...prev, darkMode: checked }))}
                />
              </div>
              <div className="flex items-center justify-between rounded-lg border border-border p-4">
                <div>
                  <p className="font-medium">Pro support</p>
                  <p className="text-sm text-muted-foreground">Priority help for measurements and fittings</p>
                </div>
                <Button className="gap-2">
                  <Shield className="h-4 w-4" />
                  Upgrade
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
