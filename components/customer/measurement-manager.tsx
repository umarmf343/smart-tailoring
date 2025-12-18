"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Pencil, Trash2 } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

// Mock data
const MOCK_MEASUREMENTS = [
  {
    id: "1",
    name: "Formal Suit",
    measurements: {
      chest: 40,
      waist: 34,
      shoulder: 18,
      sleeveLength: 25,
      inseam: 32,
    },
    unit: "inch" as const,
  },
  {
    id: "2",
    name: "Casual Wear",
    measurements: {
      chest: 39,
      waist: 33,
      hips: 38,
    },
    unit: "inch" as const,
  },
]

export function MeasurementManager() {
  const [measurements] = useState(MOCK_MEASUREMENTS)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>My Measurements</CardTitle>
            <CardDescription>Store and manage your body measurements for accurate tailoring</CardDescription>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Add Measurement
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Add New Measurement Profile</DialogTitle>
              </DialogHeader>
              <MeasurementForm onClose={() => setIsDialogOpen(false)} />
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-2 gap-4">
          {measurements.map((measurement) => (
            <div key={measurement.id} className="border border-border rounded-lg p-4">
              <div className="flex items-start justify-between mb-3">
                <h3 className="font-bold">{measurement.name}</h3>
                <div className="flex gap-2">
                  <Button size="sm" variant="ghost">
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="ghost">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                {Object.entries(measurement.measurements).map(([key, value]) => (
                  <div key={key} className="flex justify-between">
                    <span className="text-muted-foreground capitalize">{key.replace(/([A-Z])/g, " $1")}</span>
                    <span className="font-medium">
                      {value} {measurement.unit}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

function MeasurementForm({ onClose }: { onClose: () => void }) {
  const [unit, setUnit] = useState<"cm" | "inch">("inch")

  return (
    <form
      className="space-y-4"
      onSubmit={(e) => {
        e.preventDefault()
        onClose()
      }}
    >
      <div className="space-y-2">
        <Label htmlFor="name">Profile Name</Label>
        <Input id="name" placeholder="e.g., Formal Suit, Casual Wear" required />
      </div>

      <div className="space-y-2">
        <Label htmlFor="unit">Unit</Label>
        <Select value={unit} onValueChange={(value) => setUnit(value as "cm" | "inch")}>
          <SelectTrigger id="unit">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="inch">Inches</SelectItem>
            <SelectItem value="cm">Centimeters</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="chest">Chest</Label>
          <Input id="chest" type="number" step="0.1" placeholder={unit === "inch" ? "40" : "102"} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="waist">Waist</Label>
          <Input id="waist" type="number" step="0.1" placeholder={unit === "inch" ? "34" : "86"} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="hips">Hips</Label>
          <Input id="hips" type="number" step="0.1" placeholder={unit === "inch" ? "38" : "97"} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="shoulder">Shoulder</Label>
          <Input id="shoulder" type="number" step="0.1" placeholder={unit === "inch" ? "18" : "46"} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="sleeveLength">Sleeve Length</Label>
          <Input id="sleeveLength" type="number" step="0.1" placeholder={unit === "inch" ? "25" : "64"} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="inseam">Inseam</Label>
          <Input id="inseam" type="number" step="0.1" placeholder={unit === "inch" ? "32" : "81"} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="neck">Neck</Label>
          <Input id="neck" type="number" step="0.1" placeholder={unit === "inch" ? "15" : "38"} />
        </div>
      </div>

      <div className="flex gap-2 justify-end pt-4">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit">Save Measurement</Button>
      </div>
    </form>
  )
}
