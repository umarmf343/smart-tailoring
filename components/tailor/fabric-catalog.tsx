"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Plus, Edit, Trash2 } from "lucide-react"

interface Fabric {
  id: string
  name: string
  type: string
  color: string
  price: number
  inStock: boolean
  description: string
  imageUrl?: string
}

const MOCK_FABRICS: Fabric[] = [
  {
    id: "1",
    name: "Navy Blue Wool",
    type: "Wool",
    color: "Navy Blue",
    price: 150,
    inStock: true,
    description: "Premium Italian wool, perfect for formal suits",
  },
  {
    id: "2",
    name: "Charcoal Grey Linen",
    type: "Linen",
    color: "Charcoal Grey",
    price: 120,
    inStock: true,
    description: "Lightweight linen blend, ideal for summer wear",
  },
  {
    id: "3",
    name: "Black Silk",
    type: "Silk",
    color: "Black",
    price: 200,
    inStock: false,
    description: "Luxurious silk fabric for evening wear",
  },
]

export function FabricCatalog() {
  const [fabrics, setFabrics] = useState<Fabric[]>(MOCK_FABRICS)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [newFabric, setNewFabric] = useState<Partial<Fabric>>({
    inStock: true,
  })

  function handleAddFabric() {
    if (!newFabric.name || !newFabric.type || !newFabric.price) return

    const fabric: Fabric = {
      id: Math.random().toString(36).substring(7),
      name: newFabric.name,
      type: newFabric.type,
      color: newFabric.color || "",
      price: newFabric.price,
      inStock: newFabric.inStock || true,
      description: newFabric.description || "",
    }

    setFabrics([...fabrics, fabric])
    setIsAddDialogOpen(false)
    setNewFabric({ inStock: true })
  }

  function handleDeleteFabric(id: string) {
    setFabrics(fabrics.filter((f) => f.id !== id))
  }

  function handleToggleStock(id: string) {
    setFabrics(fabrics.map((f) => (f.id === id ? { ...f, inStock: !f.inStock } : f)))
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Available Fabrics</CardTitle>
              <CardDescription>Manage your fabric inventory</CardDescription>
            </div>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <Plus className="h-4 w-4" />
                  Add Fabric
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Fabric</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Fabric Name</Label>
                    <Input
                      id="name"
                      placeholder="e.g., Navy Blue Wool"
                      value={newFabric.name || ""}
                      onChange={(e) => setNewFabric({ ...newFabric, name: e.target.value })}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="type">Type</Label>
                      <Input
                        id="type"
                        placeholder="e.g., Wool, Cotton"
                        value={newFabric.type || ""}
                        onChange={(e) => setNewFabric({ ...newFabric, type: e.target.value })}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="color">Color</Label>
                      <Input
                        id="color"
                        placeholder="e.g., Navy Blue"
                        value={newFabric.color || ""}
                        onChange={(e) => setNewFabric({ ...newFabric, color: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="price">Price per yard ($)</Label>
                    <Input
                      id="price"
                      type="number"
                      placeholder="150"
                      value={newFabric.price || ""}
                      onChange={(e) => setNewFabric({ ...newFabric, price: Number.parseFloat(e.target.value) })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      placeholder="Describe the fabric..."
                      value={newFabric.description || ""}
                      onChange={(e) => setNewFabric({ ...newFabric, description: e.target.value })}
                      rows={3}
                    />
                  </div>

                  <Button onClick={handleAddFabric} className="w-full">
                    Add Fabric
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {fabrics.map((fabric) => (
              <Card key={fabric.id}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="font-bold mb-1">{fabric.name}</h3>
                      <div className="flex gap-2 mb-2">
                        <Badge variant="secondary">{fabric.type}</Badge>
                        <Badge variant={fabric.inStock ? "default" : "destructive"}>
                          {fabric.inStock ? "In Stock" : "Out of Stock"}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <Button size="sm" variant="ghost">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => handleDeleteFabric(fabric.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <p className="text-sm text-muted-foreground mb-3">{fabric.description}</p>

                  <div className="flex items-center justify-between">
                    <span className="font-bold text-lg">${fabric.price}/yard</span>
                    <Button size="sm" variant="outline" onClick={() => handleToggleStock(fabric.id)}>
                      {fabric.inStock ? "Mark Out of Stock" : "Mark In Stock"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
