"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Heart, Trash2, ShoppingCart } from "lucide-react"

interface SavedDesign {
  id: string
  name: string
  category: string
  imageUrl: string
  notes?: string
  savedAt: Date
}

const MOCK_FAVORITES: SavedDesign[] = [
  {
    id: "1",
    name: "Classic Navy Suit",
    category: "Suits",
    imageUrl: "/placeholder.svg?height=300&width=300",
    notes: "Double-breasted with peak lapels",
    savedAt: new Date("2025-01-15"),
  },
  {
    id: "2",
    name: "Slim Fit Dress Shirt",
    category: "Shirts",
    imageUrl: "/placeholder.svg?height=300&width=300",
    notes: "Button-down collar, French cuffs",
    savedAt: new Date("2025-01-12"),
  },
]

export function FavoriteDesigns() {
  const [favorites, setFavorites] = useState(MOCK_FAVORITES)

  function removeFavorite(id: string) {
    setFavorites((prev) => prev.filter((design) => design.id !== id))
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Heart className="h-5 w-5" />
          Favorite Designs
        </CardTitle>
        <CardDescription>Save and reuse your favorite tailoring designs</CardDescription>
      </CardHeader>
      <CardContent>
        {favorites.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <Heart className="h-12 w-12 mx-auto mb-3 opacity-20" />
            <p>No favorite designs yet</p>
            <p className="text-sm">Browse designs and save your favorites</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {favorites.map((design) => (
              <div key={design.id} className="border border-border rounded-lg overflow-hidden">
                <div className="aspect-video relative">
                  <img
                    src={design.imageUrl || "/placeholder.svg"}
                    alt={design.name}
                    className="w-full h-full object-cover"
                  />
                  <Badge className="absolute top-2 right-2">{design.category}</Badge>
                </div>
                <div className="p-4">
                  <h3 className="font-bold mb-1">{design.name}</h3>
                  {design.notes && <p className="text-sm text-muted-foreground mb-3">{design.notes}</p>}
                  <p className="text-xs text-muted-foreground mb-3">Saved {design.savedAt.toLocaleDateString()}</p>
                  <div className="flex gap-2">
                    <Button size="sm" className="flex-1 gap-2">
                      <ShoppingCart className="h-4 w-4" />
                      Use Design
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => removeFavorite(design.id)}
                      className="gap-2 text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
