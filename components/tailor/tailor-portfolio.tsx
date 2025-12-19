"use client"

import { useState } from "react"
import Image from "next/image"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Plus, X, Upload } from "lucide-react"
import { FileUpload } from "@/components/upload/file-upload"
import { formatDate } from "@/lib/date"

interface PortfolioItem {
  id: string
  title: string
  category: string
  description: string
  imageUrl: string
  date: Date
}

const MOCK_PORTFOLIO: PortfolioItem[] = [
  {
    id: "1",
    title: "Navy Blue Three-Piece Suit",
    category: "Suits",
    description: "Custom tailored three-piece suit with peak lapels",
    imageUrl: "/placeholder.svg?height=400&width=400",
    date: new Date("2025-01-15"),
  },
  {
    id: "2",
    title: "Wedding Dress Alteration",
    category: "Dresses",
    description: "Elegant wedding dress with custom embroidery",
    imageUrl: "/placeholder.svg?height=400&width=400",
    date: new Date("2025-01-10"),
  },
  {
    id: "3",
    title: "Custom Dress Shirts",
    category: "Shirts",
    description: "Set of 3 tailored business shirts",
    imageUrl: "/placeholder.svg?height=400&width=400",
    date: new Date("2025-01-05"),
  },
  {
    id: "4",
    title: "Formal Tuxedo",
    category: "Suits",
    description: "Black tie tuxedo with satin details",
    imageUrl: "/placeholder.svg?height=400&width=400",
    date: new Date("2024-12-20"),
  },
]

export function TailorPortfolio() {
  const [portfolio, setPortfolio] = useState(MOCK_PORTFOLIO)
  const [selectedItem, setSelectedItem] = useState<PortfolioItem | null>(null)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [filterCategory, setFilterCategory] = useState("all")

  const categories = ["all", ...Array.from(new Set(portfolio.map((item) => item.category)))]
  const filteredPortfolio =
    filterCategory === "all" ? portfolio : portfolio.filter((item) => item.category === filterCategory)

  function removeItem(id: string) {
    setPortfolio((prev) => prev.filter((item) => item.id !== id))
    setSelectedItem(null)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Portfolio Gallery</CardTitle>
              <CardDescription>Showcase your best work to attract customers</CardDescription>
            </div>
            <Button onClick={() => setIsAddDialogOpen(true)} className="gap-2">
              <Plus className="h-4 w-4" />
              Add Work
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2 mb-6">
            {categories.map((category) => (
              <Badge
                key={category}
                variant={filterCategory === category ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => setFilterCategory(category)}
              >
                {category === "all" ? "All" : category}
              </Badge>
            ))}
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredPortfolio.map((item) => (
              <div
                key={item.id}
                className="group relative aspect-square rounded-lg overflow-hidden cursor-pointer border border-border"
                onClick={() => setSelectedItem(item)}
              >
                <Image
                  src={item.imageUrl || "/placeholder.svg"}
                  alt={item.title}
                  fill
                  sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                  className="object-cover transition-transform group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <p className="text-white font-bold">{item.title}</p>
                    <p className="text-white/80 text-sm">{item.category}</p>
                  </div>
                </div>
                <Badge className="absolute top-2 right-2">{item.category}</Badge>
              </div>
            ))}
          </div>

          {filteredPortfolio.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <p>No portfolio items in this category</p>
            </div>
          )}
        </CardContent>
      </Card>

      {selectedItem && (
        <Dialog open={!!selectedItem} onOpenChange={() => setSelectedItem(null)}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>{selectedItem.title}</DialogTitle>
              <DialogDescription>Added on {formatDate(selectedItem.date)}</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <Image
                src={selectedItem.imageUrl || "/placeholder.svg"}
                alt={selectedItem.title}
                width={900}
                height={900}
                className="w-full h-auto rounded-lg border border-border"
              />
              <div>
                <Badge>{selectedItem.category}</Badge>
                <p className="text-muted-foreground mt-2">{selectedItem.description}</p>
              </div>
              <Button variant="destructive" onClick={() => removeItem(selectedItem.id)} className="gap-2">
                <X className="h-4 w-4" />
                Remove from Portfolio
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}

      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Portfolio Item</DialogTitle>
            <DialogDescription>Upload images of your completed work</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <FileUpload
              onUpload={(files) => {
                console.log("[v0] Uploaded files:", files)
              }}
              accept="image/*"
              maxSize={5}
            />
            <Button className="w-full gap-2">
              <Upload className="h-4 w-4" />
              Add to Portfolio
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
