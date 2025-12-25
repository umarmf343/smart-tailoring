"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Star, MapPin, Heart } from "lucide-react"
import Link from "next/link"

// Mock data
const MOCK_TAILORS = [
  {
    id: "1",
    businessName: "Lagos Heritage Tailors",
    location: "Victoria Island, Lagos",
    rating: 4.8,
    reviewCount: 156,
    specialties: ["Agbada", "Senator", "Aso Oke"],
  },
  {
    id: "2",
    businessName: "Abuja Threadworks",
    location: "Wuse 2, Abuja",
    rating: 4.9,
    reviewCount: 203,
    specialties: ["Kaftan", "Corporate Native", "Alterations"],
  },
  {
    id: "3",
    businessName: "Enugu Stitch House",
    location: "Independence Layout, Enugu",
    rating: 4.7,
    reviewCount: 98,
    specialties: ["Buba & Wrapper", "Lace", "Aso Ebi"],
  },
]

export function SavedTailors() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Saved Tailors</CardTitle>
        <CardDescription>Your favorite tailors for quick ordering</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {MOCK_TAILORS.map((tailor) => (
            <div key={tailor.id} className="border border-border rounded-lg p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="font-bold text-lg">{tailor.businessName}</h3>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                    <MapPin className="h-4 w-4" />
                    {tailor.location}
                  </div>
                </div>
                <Button size="sm" variant="ghost" className="text-destructive">
                  <Heart className="h-4 w-4 fill-current" />
                </Button>
              </div>

              <div className="flex items-center gap-2 mb-3">
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-medium">{tailor.rating}</span>
                </div>
                <span className="text-sm text-muted-foreground">({tailor.reviewCount} reviews)</span>
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                {tailor.specialties.map((specialty) => (
                  <Badge key={specialty} variant="secondary">
                    {specialty}
                  </Badge>
                ))}
              </div>

              <div className="flex gap-2">
                <Link href={`/customer/tailor/${tailor.id}`} className="flex-1">
                  <Button className="w-full">View Profile</Button>
                </Link>
                <Link href={`/customer/order/new?tailorId=${tailor.id}`}>
                  <Button variant="outline">Order</Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
