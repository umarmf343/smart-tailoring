"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { DollarSign, Percent } from "lucide-react"
import { formatNaira } from "@/lib/currency"

interface CommissionSettingsState {
  defaultRate: number
  minimumCommission: number
  customRates: Array<{
    tailorId: string
    tailorName: string
    rate: number
  }>
}

export function CommissionSettings() {
  const [settings, setSettings] = useState<CommissionSettingsState>({
    defaultRate: 10,
    minimumCommission: 5000,
    customRates: [
      { tailorId: "1", tailorName: "Lagos Heritage Tailors", rate: 8 },
      { tailorId: "2", tailorName: "Abuja Threadworks", rate: 12 },
    ],
  })
  const [isEditing, setIsEditing] = useState(false)

  function handleSave() {
    // Save commission settings
    setIsEditing(false)
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Percent className="h-5 w-5" />
              Commission Settings
            </CardTitle>
            <CardDescription>Configure platform commission rates for tailors</CardDescription>
          </div>
          <Button
            onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
            variant={isEditing ? "default" : "outline"}
          >
            {isEditing ? "Save Changes" : "Edit Settings"}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Default Settings */}
        <div className="space-y-4">
          <h3 className="font-medium">Default Commission Rate</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="defaultRate">Platform Commission (%)</Label>
              <div className="relative">
                <Input
                  id="defaultRate"
                  type="number"
                  step="0.1"
                  value={settings.defaultRate}
                  onChange={(e) => setSettings({ ...settings, defaultRate: Number.parseFloat(e.target.value) })}
                  disabled={!isEditing}
                  className={!isEditing ? "bg-muted" : ""}
                />
                <Percent className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              </div>
              <p className="text-xs text-muted-foreground">Default commission applied to all new tailors</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="minimumCommission">Minimum Commission (₦)</Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="minimumCommission"
                  type="number"
                  step="0.01"
                  value={settings.minimumCommission}
                  onChange={(e) => setSettings({ ...settings, minimumCommission: Number.parseFloat(e.target.value) })}
                  disabled={!isEditing}
                  className={!isEditing ? "bg-muted pl-8" : "pl-8"}
                />
              </div>
              <p className="text-xs text-muted-foreground">Minimum commission per order</p>
            </div>
          </div>
        </div>

        {/* Custom Rates */}
        <div className="space-y-4 pt-4 border-t border-border">
          <h3 className="font-medium">Custom Tailor Rates</h3>
          <div className="space-y-3">
            {settings.customRates.map((rate) => (
              <div
                key={rate.tailorId}
                className="flex items-center justify-between p-4 border border-border rounded-lg"
              >
                <div>
                  <p className="font-medium">{rate.tailorName}</p>
                  <p className="text-sm text-muted-foreground">Tailor ID: {rate.tailorId}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    step="0.1"
                    value={rate.rate}
                    onChange={(e) => {
                      const updatedRates = settings.customRates.map((r) =>
                        r.tailorId === rate.tailorId ? { ...r, rate: Number.parseFloat(e.target.value) } : r,
                      )
                      setSettings({ ...settings, customRates: updatedRates })
                    }}
                    disabled={!isEditing}
                    className={`w-20 ${!isEditing ? "bg-muted" : ""}`}
                  />
                  <span className="text-sm font-medium">%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Commission Calculation Example */}
        <div className="space-y-3 pt-4 border-t border-border bg-muted p-4 rounded-lg">
          <p className="font-medium text-sm">Commission Calculation Example:</p>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Order Value:</span>
              <span className="font-medium">{formatNaira(180000)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Commission Rate:</span>
              <span className="font-medium">{settings.defaultRate}%</span>
            </div>
            <div className="flex justify-between border-t border-border pt-2">
              <span className="font-medium">Platform Commission:</span>
              <span className="font-bold">{formatNaira((180000 * settings.defaultRate) / 100, 2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Tailor Receives:</span>
              <span className="font-bold">{formatNaira(180000 * (1 - settings.defaultRate / 100), 2)}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
