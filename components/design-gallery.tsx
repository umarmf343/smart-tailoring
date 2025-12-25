"use client"

import { useState } from "react"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Eye, Heart } from "lucide-react"

interface Design {
  id: string
  name: string
  category: string
  description: string
  imageUrl: string
  popular: boolean
}

const MOCK_DESIGNS: Design[] = [
  {
    id: "1",
    name: "Classic Two-Piece Suit",
    category: "suits",
    description: "Timeless two-button suit with notch lapels, perfect for business and formal occasions",
    imageUrl: "/placeholder.svg?height=400&width=300",
    popular: true,
  },
  {
    id: "2",
    name: "Double-Breasted Blazer",
    category: "suits",
    description: "Sophisticated double-breasted design with peak lapels for a commanding presence",
    imageUrl: "/placeholder.svg?height=400&width=300",
    popular: true,
  },
  {
    id: "3",
    name: "A-Line Evening Dress",
    category: "dresses",
    description: "Elegant A-line silhouette with floor-length hem, ideal for formal events",
    imageUrl: "/placeholder.svg?height=400&width=300",
    popular: true,
  },
  {
    id: "4",
    name: "Cocktail Dress",
    category: "dresses",
    description: "Chic knee-length dress perfect for semi-formal occasions and parties",
    imageUrl: "/placeholder.svg?height=400&width=300",
    popular: false,
  },
  {
    id: "5",
    name: "Slim Fit Dress Shirt",
    category: "shirts",
    description: "Modern slim-fit cut with spread collar and French cuffs",
    imageUrl: "/placeholder.svg?height=400&width=300",
    popular: true,
  },
  {
    id: "6",
    name: "Oxford Button-Down",
    category: "shirts",
    description: "Classic button-down collar in premium Oxford cloth",
    imageUrl: "/placeholder.svg?height=400&width=300",
    popular: false,
  },
]

export function DesignGallery() {
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedDesign, setSelectedDesign] = useState<Design | null>(null)
  const [favorites, setFavorites] = useState<string[]>([])

  const filteredDesigns =
    selectedCategory === "all" ? MOCK_DESIGNS : MOCK_DESIGNS.filter((d) => d.category === selectedCategory)

  function toggleFavorite(id: string) {
    setFavorites((prev) => (prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]))
  }

  return (
    <>
      <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="w-full">
        <TabsList className="grid w-full max-w-md mx-auto grid-cols-4 mb-8">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="suits">Suits</TabsTrigger>
          <TabsTrigger value="dresses">Dresses</TabsTrigger>
          <TabsTrigger value="shirts">Shirts</TabsTrigger>
        </TabsList>

        <TabsContent value={selectedCategory} className="mt-0">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredDesigns.map((design) => (
              <Card key={design.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative h-80">
                  <Image
                    src={design.imageUrl || "/placeholder.svg"}
                    alt={design.name}
                    fill
                    sizes="(min-width: 1280px) 25vw, (min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                    className="object-cover"
                  />
                  {design.popular && (
                    <Badge className="absolute top-3 left-3 bg-primary text-primary-foreground">Popular</Badge>
                  )}
                  <Button
                    size="sm"
                    variant={favorites.includes(design.id) ? "default" : "secondary"}
                    className="absolute top-3 right-3"
                    onClick={() => toggleFavorite(design.id)}
                  >
                    <Heart className={`h-4 w-4 ${favorites.includes(design.id) ? "fill-current" : ""}`} />
                  </Button>
                </div>
                <CardContent className="p-4">
                  <h3 className="font-bold mb-2">{design.name}</h3>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{design.description}</p>
                  <Button className="w-full gap-2" onClick={() => setSelectedDesign(design)}>
                    <Eye className="h-4 w-4" />
                    View Details
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Design Detail Dialog */}
      <Dialog open={!!selectedDesign} onOpenChange={() => setSelectedDesign(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>{selectedDesign?.name}</DialogTitle>
            <DialogDescription>{selectedDesign?.description}</DialogDescription>
          </DialogHeader>
          {selectedDesign && (
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <Image
                  src={selectedDesign.imageUrl || "/placeholder.svg"}
                  alt={selectedDesign.name}
                  width={600}
                  height={800}
                  className="w-full rounded-lg object-cover h-auto"
                />
              </div>
              <div className="space-y-4">
                <div>
                  <Badge>{selectedDesign.category}</Badge>
                  {selectedDesign.popular && (
                    <Badge className="ml-2" variant="outline">
                      Popular Choice
                    </Badge>
                  )}
                </div>
                <p className="text-muted-foreground">{selectedDesign.description}</p>
                <div className="space-y-2">
                  <h4 className="font-bold">Design Features:</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                    <li>Fully customizable measurements</li>
                    <li>Choice of premium fabrics</li>
                    <li>Professional tailoring</li>
                    <li>Multiple fitting sessions included</li>
                  </ul>
                </div>
                <Button className="w-full" onClick={() => setSelectedDesign(null)}>
                  Select This Design
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
