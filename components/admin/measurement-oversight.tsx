"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { AlertCircle, ShieldCheck, Ruler, Lock } from "lucide-react"
import { MEASUREMENT_LIBRARY, describeGarmentType, formatConvertedMeasurement, generateMeasurementAlerts } from "@/lib/measurement-system"

export function MeasurementOversight() {
  const flaggedProfiles = MEASUREMENT_LIBRARY.filter((profile) => generateMeasurementAlerts(profile).length > 0)
  const verifiedProfiles = MEASUREMENT_LIBRARY.filter((profile) => profile.status === "verified")
  const unitSplit = MEASUREMENT_LIBRARY.reduce(
    (acc, profile) => ({ ...acc, [profile.unit]: (acc[profile.unit] || 0) + 1 }),
    {} as Record<string, number>,
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Ruler className="h-4 w-4" /> Measurement Governance
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid md:grid-cols-3 gap-3">
          <Card className="bg-muted/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Profiles</CardTitle>
            </CardHeader>
            <CardContent className="text-2xl font-bold">{MEASUREMENT_LIBRARY.length}</CardContent>
          </Card>
          <Card className="bg-muted/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Verified</CardTitle>
            </CardHeader>
            <CardContent className="text-2xl font-bold flex items-center gap-2">
              {verifiedProfiles.length}
              <ShieldCheck className="h-4 w-4 text-green-600" />
            </CardContent>
          </Card>
          <Card className="bg-muted/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Unit split</CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-x-2">
              {Object.entries(unitSplit).map(([unit, count]) => (
                <Badge key={unit} variant="outline">
                  {unit.toUpperCase()}: {count}
                </Badge>
              ))}
            </CardContent>
          </Card>
        </div>

        <Separator />

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-amber-600" />
            <p className="text-sm font-semibold">Flagged measurements</p>
          </div>
          {flaggedProfiles.length === 0 && (
            <p className="text-sm text-muted-foreground">No profiles require review.</p>
          )}
          {flaggedProfiles.map((profile) => {
            const alerts = generateMeasurementAlerts(profile)
            return (
              <div key={profile.id} className="p-3 border rounded-lg">
                <div className="flex flex-wrap gap-2 items-center mb-2">
                  <Badge variant="secondary">{profile.name}</Badge>
                  <Badge variant="outline">{describeGarmentType(profile.garmentType)}</Badge>
                  <Badge variant="outline">{profile.unit.toUpperCase()}</Badge>
                </div>
                <div className="grid md:grid-cols-2 gap-2 text-sm">
                  {Object.entries(profile.measurements).map(([key, value]) => (
                    <div key={key} className="flex justify-between">
                      <span className="capitalize text-muted-foreground">{key.replace(/([A-Z])/g, " $1")}</span>
                      <span className="font-medium">
                        {value} {profile.unit} ({formatConvertedMeasurement(value, profile.unit)})
                      </span>
                    </div>
                  ))}
                </div>
                <ul className="list-disc list-inside text-sm text-muted-foreground mt-2 space-y-1">
                  {alerts.map((alert) => (
                    <li key={alert.message}>{alert.message}</li>
                  ))}
                </ul>
              </div>
            )
          })}
        </div>

        <Separator />
        <div className="flex items-start gap-2 text-sm text-muted-foreground">
          <Lock className="h-4 w-4 mt-0.5" />
          <p>
            Admin-only visibility: measurements stay encrypted at rest and are shared with assigned tailors on a
            per-order basis. Use this panel to spot anomalies before orders progress.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
