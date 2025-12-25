"use client"

import { useMemo, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Pencil, Trash2, ShieldCheck, Ruler, Lightbulb, Info, Sparkles } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import {
  MEASUREMENT_LIBRARY,
  formatConvertedMeasurement,
  generateMeasurementAlerts,
  getFieldsForGarment,
  getFitSuggestions,
  type GarmentType,
  type MeasurementUnit,
  describeGarmentType,
} from "@/lib/measurement-system"
import type { Measurement } from "@/lib/types"
import { Separator } from "@/components/ui/separator"

const statusStyles = {
  verified: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  "needs-review": "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200",
  draft: "bg-slate-100 text-slate-800 dark:bg-slate-900 dark:text-slate-200",
}

interface MeasurementFormState {
  name: string
  garmentType: GarmentType
  unit: MeasurementUnit
  measurements: Record<string, number>
  notes: string
}

const initialForm: MeasurementFormState = {
  name: "",
  garmentType: "shirt",
  unit: "inch",
  measurements: {},
  notes: "",
}

export function MeasurementManager() {
  const [measurementProfiles, setMeasurementProfiles] = useState<Measurement[]>(MEASUREMENT_LIBRARY)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedProfileId, setSelectedProfileId] = useState<string | null>(MEASUREMENT_LIBRARY[0]?.id ?? null)

  const selectedProfile = useMemo(
    () => measurementProfiles.find((profile) => profile.id === selectedProfileId) ?? measurementProfiles[0],
    [measurementProfiles, selectedProfileId],
  )

  const flaggedCount = useMemo(
    () => measurementProfiles.filter((profile) => generateMeasurementAlerts(profile).length > 0).length,
    [measurementProfiles],
  )

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>My Measurements</CardTitle>
            <CardDescription>
              Register multiple measurement sets by garment type, keep them verified, and reuse them when placing orders.
            </CardDescription>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Add Measurement
              </Button>
            </DialogTrigger>
              <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Create or Update a Measurement Profile</DialogTitle>
                <DialogDescription>
                  Choose your garment type, enter values with your preferred unit, and preview conversions and validation
                  alerts in real time.
                </DialogDescription>
              </DialogHeader>
              <MeasurementForm
                onClose={() => setIsDialogOpen(false)}
                onSave={(profile) => {
                  setMeasurementProfiles((prev) => [...prev, profile])
                  setSelectedProfileId(profile.id)
                  setIsDialogOpen(false)
                }}
              />
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid md:grid-cols-3 gap-4">
          <Card className="bg-muted/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Ruler className="h-4 w-4" />
                Active profiles
              </CardTitle>
            </CardHeader>
            <CardContent className="text-2xl font-bold">{measurementProfiles.length}</CardContent>
          </Card>
          <Card className="bg-muted/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <ShieldCheck className="h-4 w-4" />
                Verified sets
              </CardTitle>
            </CardHeader>
            <CardContent className="text-2xl font-bold">
              {measurementProfiles.filter((profile) => profile.status === "verified").length}
            </CardContent>
          </Card>
          <Card className="bg-muted/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Info className="h-4 w-4" />
                Needs attention
              </CardTitle>
            </CardHeader>
            <CardContent className="text-2xl font-bold">{flaggedCount}</CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-4">
          {measurementProfiles.map((profile) => (
            <MeasurementCard
              key={profile.id}
              profile={profile}
              selected={profile.id === selectedProfile?.id}
              onSelect={() => setSelectedProfileId(profile.id)}
            />
          ))}
        </div>

        {selectedProfile && <MeasurementDetail profile={selectedProfile} />}

        <Card className="border-dashed">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Lightbulb className="h-4 w-4" />
              Privacy & reuse tips
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground space-y-2">
            <p>
              • Measurements are stored per profile so you can attach the right set to each order without re-entering
              values.
            </p>
            <p>
              • Switch units at entry time; conversions are displayed automatically so you can verify inch/cm values
              before saving.
            </p>
            <p>• Tailors can request clarifications on flagged fields, and admins can verify sets to keep data clean.</p>
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  )
}

function MeasurementCard({
  profile,
  selected,
  onSelect,
}: {
  profile: Measurement
  selected: boolean
  onSelect: () => void
}) {
  const alerts = generateMeasurementAlerts(profile)
  const suggestions = getFitSuggestions(profile)
  return (
    <div className={`border rounded-lg p-4 space-y-3 ${selected ? "border-primary" : "border-border"}`}>
      <div className="flex items-start justify-between gap-2">
        <div>
          <h3 className="font-bold flex items-center gap-2">
            {profile.name}
            {profile.primary && <Badge variant="secondary">Primary</Badge>}
          </h3>
          <p className="text-sm text-muted-foreground">
            {describeGarmentType(profile.garmentType)} • {profile.unit.toUpperCase()}
          </p>
        </div>
        <Badge className={statusStyles[profile.status]}> {profile.status.replace("-", " ")} </Badge>
      </div>

      <div className="grid grid-cols-2 gap-2 text-sm">
        {Object.entries(profile.measurements).map(([key, value]) => (
          <div key={key} className="flex flex-col border rounded-md p-2">
            <span className="text-muted-foreground capitalize">{key.replace(/([A-Z])/g, " $1")}</span>
            <span className="font-semibold">
              {value} {profile.unit}
            </span>
            <span className="text-xs text-muted-foreground">≈ {formatConvertedMeasurement(value, profile.unit)}</span>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-2">
        {alerts.slice(0, 2).map((alert, idx) => (
          <Badge key={idx} variant="outline" className="border-amber-500/50 text-amber-700 dark:text-amber-200">
            {alert.message}
          </Badge>
        ))}
      </div>

      <div className="space-y-1 text-xs text-muted-foreground">
        <p>Last used: {profile.lastUsedOrderId ? `Order ${profile.lastUsedOrderId}` : "Not attached yet"}</p>
        {profile.notes && <p>Note: {profile.notes}</p>}
        <p>Fit hint: {suggestions[0]}</p>
      </div>

      <div className="flex gap-2">
        <Button variant="outline" size="sm" onClick={onSelect} className="flex-1 bg-transparent">
          <Sparkles className="h-4 w-4" />
          Use this set
        </Button>
        <Button variant="ghost" size="sm">
          <Pencil className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="sm">
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

function MeasurementDetail({ profile }: { profile: Measurement }) {
  const alerts = generateMeasurementAlerts(profile)
  const suggestions = getFitSuggestions(profile)

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">{profile.name} overview</CardTitle>
            <CardDescription>
              Verification-ready measurements with cross-checks and fit suggestions tailored to the garment type.
            </CardDescription>
          </div>
          <Badge className={statusStyles[profile.status]}>{profile.status.replace("-", " ")}</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid md:grid-cols-3 gap-3">
          <Card className="bg-muted/60">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Unit preference</CardTitle>
            </CardHeader>
            <CardContent className="text-2xl font-bold">{profile.unit}</CardContent>
          </Card>
          <Card className="bg-muted/60">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Garment</CardTitle>
            </CardHeader>
            <CardContent className="text-2xl font-bold">{describeGarmentType(profile.garmentType)}</CardContent>
          </Card>
          <Card className="bg-muted/60">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Alerts</CardTitle>
            </CardHeader>
            <CardContent className="text-2xl font-bold">{alerts.length}</CardContent>
          </Card>
        </div>

        <div className="grid md:grid-cols-2 gap-3">
          <div className="space-y-2">
            <h4 className="text-sm font-semibold">Validation & plausibility</h4>
            {alerts.length === 0 && (
              <p className="text-sm text-muted-foreground">No issues detected for this profile.</p>
            )}
            {alerts.map((alert, idx) => (
              <div key={idx} className="p-3 border rounded-md bg-amber-50 dark:bg-amber-950/30 text-sm">
                <p className="font-medium">{alert.message}</p>
                <p className="text-xs text-muted-foreground">Fields: {alert.fields.join(", ")}</p>
              </div>
            ))}
          </div>
          <div className="space-y-2">
            <h4 className="text-sm font-semibold">Fit suggestions</h4>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
              {suggestions.map((suggestion) => (
                <li key={suggestion}>{suggestion}</li>
              ))}
            </ul>
          </div>
        </div>

        <Separator />

        <div className="space-y-3">
          <h4 className="text-sm font-semibold">Field guide</h4>
          <div className="grid md:grid-cols-2 gap-3">
            {getFieldsForGarment(profile.garmentType).map((field) => (
              <div key={field.key} className="p-3 border rounded-lg">
                <p className="font-medium">{field.label}</p>
                <p className="text-xs text-muted-foreground">{field.helper}</p>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function MeasurementForm({
  onSave,
  onClose,
}: {
  onSave: (profile: Measurement) => void
  onClose: () => void
}) {
  const [formState, setFormState] = useState<MeasurementFormState>(initialForm)
  const [activeField, setActiveField] = useState<string | null>(null)

  const fields = getFieldsForGarment(formState.garmentType)

  const draftProfile: Measurement = {
    id: "draft-profile",
    customerId: "customer-1",
    name: formState.name || "Draft",
    garmentType: formState.garmentType,
    measurements: formState.measurements,
    unit: formState.unit,
    status: "draft",
    notes: formState.notes,
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  const alerts = generateMeasurementAlerts(draftProfile)

  function updateMeasurement(key: string, value?: number) {
    setFormState((prev) => ({
      ...prev,
      measurements: {
        ...prev.measurements,
        [key]: value ?? undefined,
      },
    }))
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const newProfile: Measurement = {
      ...draftProfile,
      id: `ms-${Date.now()}`,
      status: alerts.length ? "needs-review" : "verified",
      primary: false,
    }
    onSave(newProfile)
    setFormState(initialForm)
    onClose()
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Profile Name</Label>
          <Input
            id="name"
            placeholder="e.g., Formal Suit, Summer Dress, Cycling Pants"
            required
            value={formState.name}
            onChange={(event) => setFormState((prev) => ({ ...prev, name: event.target.value }))}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="garment">Garment Type</Label>
          <Select
            value={formState.garmentType}
            onValueChange={(value) => setFormState((prev) => ({ ...prev, garmentType: value as GarmentType }))}
          >
            <SelectTrigger id="garment">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="shirt">Shirt / Top</SelectItem>
              <SelectItem value="dress">Dress</SelectItem>
              <SelectItem value="pants">Pants</SelectItem>
              <SelectItem value="blazer">Suit / Blazer</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="unit">Unit</Label>
          <Select
            value={formState.unit}
            onValueChange={(value) => setFormState((prev) => ({ ...prev, unit: value as MeasurementUnit }))}
          >
            <SelectTrigger id="unit">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="inch">Inches</SelectItem>
              <SelectItem value="cm">Centimeters</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="notes">Notes for tailor</Label>
          <Textarea
            id="notes"
            placeholder="Add ease preferences, posture notes, or areas to double-check"
            value={formState.notes}
            onChange={(event) => setFormState((prev) => ({ ...prev, notes: event.target.value }))}
            rows={3}
          />
        </div>
      </div>

      <Card className="bg-muted/70">
        <CardHeader>
          <CardTitle className="text-base">Tailor’s live garment preview</CardTitle>
          <CardDescription>
            I’ll keep the silhouette and selected garment label in view while you enter measurements in real time.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-[220px_minmax(0,1fr)]">
          <div className="flex items-center justify-center rounded-lg border bg-background p-4">
            <GarmentSilhouette garmentType={formState.garmentType} />
          </div>
          <div className="space-y-3">
            <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Selected garment: {describeGarmentType(formState.garmentType)}
            </div>
            <div className="grid gap-2 sm:grid-cols-2 text-sm">
              {fields.map((field) => {
                const value = formState.measurements[field.key]
                return (
                  <div
                    key={field.key}
                    className={`flex items-center justify-between rounded-md border px-3 py-2 transition ${
                      activeField === field.key ? "border-primary bg-primary/5" : "bg-background"
                    }`}
                  >
                    <span className="font-medium">{field.label}</span>
                    <span className="text-muted-foreground">
                      {value !== undefined ? `${value} ${formState.unit}` : "—"}
                    </span>
                  </div>
                )
              })}
            </div>
            <p className="text-xs text-muted-foreground">
              {activeField
                ? `Editing ${fields.find((field) => field.key === activeField)?.label ?? "measurement"}`
                : "Select a field to highlight it in the preview list."}
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-4">
        {fields.map((field) => (
          <div key={field.key} className="space-y-1">
            <div className="flex items-center justify-between">
              <Label htmlFor={field.key}>{field.label}</Label>
              <span className="text-xs text-muted-foreground">{field.helper}</span>
            </div>
            <Input
              id={field.key}
              type="number"
              step="0.1"
              value={formState.measurements[field.key] ?? ""}
              onChange={(event) => updateMeasurement(field.key, event.target.value ? Number(event.target.value) : undefined)}
              onFocus={() => setActiveField(field.key)}
              onBlur={() => setActiveField(null)}
              placeholder="Add value"
            />
            {formState.measurements[field.key] !== undefined && (
              <p className="text-xs text-muted-foreground">
                ≈ {formatConvertedMeasurement(formState.measurements[field.key]!, formState.unit)}
              </p>
            )}
          </div>
        ))}
      </div>

      <Card className="bg-muted/70">
        <CardContent className="space-y-2 pt-4">
          <p className="text-sm font-semibold">Review before saving</p>
          <div className="grid md:grid-cols-2 gap-2 text-sm">
            {Object.entries(formState.measurements).map(([key, value]) => (
              <div key={key} className="flex justify-between">
                <span className="capitalize">{key.replace(/([A-Z])/g, " $1")}</span>
                <span className="font-medium">
                  {value} {formState.unit} ({formatConvertedMeasurement(value, formState.unit)})
                </span>
              </div>
            ))}
            {Object.keys(formState.measurements).length === 0 && (
              <p className="text-muted-foreground">Enter values to see a confirmation summary.</p>
            )}
          </div>
        </CardContent>
      </Card>

      {alerts.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-semibold">Validation alerts</p>
          {alerts.map((alert, idx) => (
            <div key={idx} className="p-3 border rounded-md bg-amber-50 dark:bg-amber-950/30 text-sm">
              <p className="font-medium">{alert.message}</p>
            </div>
          ))}
        </div>
      )}

      <DialogFooter>
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" className="gap-2">
          <ShieldCheck className="h-4 w-4" />
          Save Measurement
        </Button>
      </DialogFooter>
    </form>
  )
}

function GarmentSilhouette({ garmentType }: { garmentType: GarmentType }) {
  const silhouette = {
    shirt: (
      <>
        <path d="M60 30 L90 10 H110 L140 30 L175 20 L190 60 L160 80 L160 210 H40 V80 L10 60 L25 20 Z" />
        <rect x="75" y="80" width="50" height="80" rx="8" fill="currentColor" fillOpacity="0.2" />
      </>
    ),
    dress: (
      <>
        <path d="M90 18 L110 18 L135 55 L165 200 L35 200 L65 55 Z" />
        <path d="M90 18 L85 50 L115 50 L110 18 Z" fill="currentColor" fillOpacity="0.2" />
      </>
    ),
    pants: (
      <>
        <path d="M60 20 H140 L155 210 H110 L100 120 L90 210 H45 Z" />
        <path d="M100 120 L120 210" stroke="currentColor" strokeOpacity="0.25" strokeWidth="10" />
      </>
    ),
    blazer: (
      <>
        <path d="M60 30 L90 10 H110 L140 30 L175 25 L190 70 L160 90 L160 210 H40 V90 L10 70 L25 25 Z" />
        <path d="M100 50 L70 120 H130 Z" fill="currentColor" fillOpacity="0.2" />
      </>
    ),
  }[garmentType]

  return (
    <div className="flex flex-col items-center gap-2 text-muted-foreground">
      <svg
        viewBox="0 0 200 240"
        className="h-40 w-40 text-amber-600/80 dark:text-amber-300/80"
        aria-hidden="true"
      >
        <g fill="currentColor">{silhouette}</g>
      </svg>
      <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {describeGarmentType(garmentType)}
      </span>
    </div>
  )
}
