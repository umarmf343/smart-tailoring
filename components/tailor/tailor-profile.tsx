"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { MapPin, Clock, DollarSign, X } from "lucide-react"
import { formatNaira } from "@/lib/currency"

export function TailorProfile() {
  const [isEditing, setIsEditing] = useState(false)
  const [specialties, setSpecialties] = useState(["Agbada", "Aso Oke", "Wedding Attire"])
  const [newSpecialty, setNewSpecialty] = useState("")

  function addSpecialty() {
    if (newSpecialty && !specialties.includes(newSpecialty)) {
      setSpecialties([...specialties, newSpecialty])
      setNewSpecialty("")
    }
  }

  function removeSpecialty(specialty: string) {
    setSpecialties(specialties.filter((s) => s !== specialty))
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Business Profile</CardTitle>
              <CardDescription>Manage your business information</CardDescription>
            </div>
            <Button onClick={() => setIsEditing(!isEditing)} variant={isEditing ? "outline" : "default"}>
              {isEditing ? "Cancel" : "Edit Profile"}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <form
            className="space-y-6"
            onSubmit={(e) => {
              e.preventDefault()
              setIsEditing(false)
            }}
          >
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="businessName">Business Name</Label>
                <Input
                  id="businessName"
                  defaultValue="Lagos Heritage Tailors"
                  disabled={!isEditing}
                  className={!isEditing ? "bg-muted" : ""}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  defaultValue="+234 802 123 4567"
                  disabled={!isEditing}
                  className={!isEditing ? "bg-muted" : ""}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address" className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Business Address
              </Label>
              <Input
                id="address"
                defaultValue="12 Adeola Odeku, Victoria Island, Lagos"
                disabled={!isEditing}
                className={!isEditing ? "bg-muted" : ""}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="businessHours" className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Business Hours
              </Label>
              <Input
                id="businessHours"
                defaultValue="Mon-Sat: 9AM-7PM, Sun: 1PM-5PM"
                disabled={!isEditing}
                className={!isEditing ? "bg-muted" : ""}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Business Description</Label>
              <Textarea
                id="description"
                rows={4}
                defaultValue="Lagos Heritage Tailors delivers premium Nigerian tailoring with agbada, senator, and aso-ebi expertise for weddings and corporate wear."
                disabled={!isEditing}
                className={!isEditing ? "bg-muted" : ""}
              />
            </div>

            <div className="space-y-2">
              <Label>Specialties</Label>
              <div className="flex flex-wrap gap-2 mb-3">
                {specialties.map((specialty) => (
                  <Badge key={specialty} variant="secondary" className="gap-2">
                    {specialty}
                    {isEditing && (
                      <button
                        type="button"
                        onClick={() => removeSpecialty(specialty)}
                        className="hover:text-destructive"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    )}
                  </Badge>
                ))}
              </div>
              {isEditing && (
                <div className="flex gap-2">
                  <Input
                    placeholder="Add specialty..."
                    value={newSpecialty}
                    onChange={(e) => setNewSpecialty(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault()
                        addSpecialty()
                      }
                    }}
                  />
                  <Button type="button" onClick={addSpecialty}>
                    Add
                  </Button>
                </div>
              )}
            </div>

            {isEditing && (
              <div className="flex gap-2 justify-end pt-4">
                <Button type="button" variant="outline" onClick={() => setIsEditing(false)}>
                  Cancel
                </Button>
                <Button type="submit">Save Changes</Button>
              </div>
            )}
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Service Pricing
          </CardTitle>
          <CardDescription>Manage your service pricing</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { service: "Agbada Set", price: 180000, description: "Three-piece agbada with embroidery and inner kaftan" },
              { service: "Senator Suit", price: 120000, description: "Modern senator suit with sharp tailoring" },
              { service: "Alterations", price: 20000, description: "Basic alterations starting price" },
            ].map((item) => (
              <div key={item.service} className="flex items-center justify-between p-4 border border-border rounded-lg">
                <div>
                  <p className="font-medium">{item.service}</p>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold">{formatNaira(item.price)}</p>
                  <Button size="sm" variant="ghost">
                    Edit
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
