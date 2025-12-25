"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { MapPin, Plus, X } from "lucide-react"
import { formatNaira } from "@/lib/currency"

interface ServiceArea {
  id: string
  zipCode: string
  city: string
  deliveryFee: number
}

const MOCK_SERVICE_AREAS: ServiceArea[] = [
  { id: "1", zipCode: "101233", city: "Victoria Island, Lagos", deliveryFee: 3500 },
  { id: "2", zipCode: "900211", city: "Wuse 2, Abuja", deliveryFee: 4500 },
  { id: "3", zipCode: "400241", city: "GRA, Enugu", deliveryFee: 4000 },
]

export function ServiceAreaManager() {
  const [serviceAreas, setServiceAreas] = useState<ServiceArea[]>(MOCK_SERVICE_AREAS)
  const [showAddForm, setShowAddForm] = useState(false)
  const [newArea, setNewArea] = useState({
    zipCode: "",
    city: "",
    deliveryFee: 10,
  })

  function addServiceArea() {
    if (!newArea.zipCode || !newArea.city) return

    const area: ServiceArea = {
      id: Math.random().toString(36).substring(7),
      ...newArea,
    }

    setServiceAreas([...serviceAreas, area])
    setNewArea({ zipCode: "", city: "", deliveryFee: 10 })
    setShowAddForm(false)
  }

  function removeServiceArea(id: string) {
    setServiceAreas(serviceAreas.filter((area) => area.id !== id))
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Service Area
            </CardTitle>
            <CardDescription>Define areas where you provide delivery services</CardDescription>
          </div>
          <Button onClick={() => setShowAddForm(!showAddForm)} className="gap-2">
            <Plus className="h-4 w-4" />
            Add Area
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {showAddForm && (
          <Card className="border-2 border-primary">
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="zipCode">Postal Code</Label>
                    <Input
                      id="zipCode"
                      placeholder="101233"
                      value={newArea.zipCode}
                      onChange={(e) => setNewArea({ ...newArea, zipCode: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="city">City/Area</Label>
                    <Input
                      id="city"
                      placeholder="Victoria Island"
                      value={newArea.city}
                      onChange={(e) => setNewArea({ ...newArea, city: e.target.value })}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="deliveryFee">Delivery Fee (₦)</Label>
                  <Input
                    id="deliveryFee"
                    type="number"
                    placeholder="10"
                    value={newArea.deliveryFee}
                    onChange={(e) => setNewArea({ ...newArea, deliveryFee: Number.parseFloat(e.target.value) })}
                  />
                </div>
                <div className="flex gap-2">
                  <Button onClick={addServiceArea} className="flex-1">
                    Add Area
                  </Button>
                  <Button variant="outline" onClick={() => setShowAddForm(false)} className="flex-1">
                    Cancel
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="space-y-3">
          <p className="text-sm font-medium">Current Service Areas ({serviceAreas.length})</p>
          <div className="grid md:grid-cols-2 gap-3">
            {serviceAreas.map((area) => (
              <div key={area.id} className="flex items-center justify-between p-3 border border-border rounded-lg">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant="secondary">{area.zipCode}</Badge>
                    <p className="font-medium text-sm">{area.city}</p>
                  </div>
                  <p className="text-xs text-muted-foreground">Delivery Fee: {formatNaira(area.deliveryFee)}</p>
                </div>
                <Button size="sm" variant="ghost" onClick={() => removeServiceArea(area.id)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-4 border-t border-border">
          <p className="text-sm text-muted-foreground">
            Service areas help customers know if delivery is available in their location. Customers outside these areas
            can still choose pickup.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
