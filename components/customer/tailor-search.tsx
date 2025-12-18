"use client"

import { useState } from "react"
import { CustomerHeader } from "./customer-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, MapPin, Star, Heart } from "lucide-react"
import Link from "next/link"
import { getSession } from "@/lib/auth"
import { use } from "react"
import { TailorMap } from "@/components/map/tailor-map"

// Mock tailors data
const MOCK_TAILORS = [
  {
    id: "1",
    businessName: "Master Tailor Co.",
    location: { address: "123 Main St, Downtown, New York", latitude: 40.7128, longitude: -74.006 },
    rating: 4.8,
    reviewCount: 156,
    specialties: ["Suits", "Formal Wear", "Wedding Attire"],
    services: ["Custom Suits", "Alterations", "Shirt Making"],
    basePrice: 400,
    distance: "0.5 miles",
  },
  {
    id: "2",
    businessName: "Elite Stitches",
    location: { address: "456 Oak Ave, Brooklyn, New York", latitude: 40.6782, longitude: -73.9442 },
    rating: 4.9,
    reviewCount: 203,
    specialties: ["Dresses", "Alterations", "Bridal"],
    services: ["Dress Making", "Alterations", "Custom Design"],
    basePrice: 350,
    distance: "1.2 miles",
  },
  {
    id: "3",
    businessName: "Precision Tailoring",
    location: { address: "789 Park Blvd, Manhattan, New York", latitude: 40.7589, longitude: -73.9851 },
    rating: 4.7,
    reviewCount: 98,
    specialties: ["Shirts", "Casual Wear", "Business Attire"],
    services: ["Shirt Customization", "Pants Tailoring", "Jackets"],
    basePrice: 250,
    distance: "2.3 miles",
  },
  {
    id: "4",
    businessName: "Heritage Tailors",
    location: { address: "321 Elm St, Queens, New York", latitude: 40.7282, longitude: -73.7949 },
    rating: 4.6,
    reviewCount: 84,
    specialties: ["Traditional Wear", "Ethnic Clothing"],
    services: ["Custom Traditional Wear", "Alterations", "Embroidery"],
    basePrice: 300,
    distance: "3.1 miles",
  },
]

export function TailorSearch() {
  const user = use(getSession())
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedService, setSelectedService] = useState("all")
  const [sortBy, setSortBy] = useState("distance")
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000])
  const [ratingFilter, setRatingFilter] = useState(0)

  if (!user) return null

  let filteredTailors = MOCK_TAILORS.filter((tailor) => {
    const matchesSearch =
      searchQuery === "" ||
      tailor.businessName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tailor.location.address.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesService =
      selectedService === "all" ||
      tailor.services.some((s) => s.toLowerCase().includes(selectedService.toLowerCase())) ||
      tailor.specialties.some((s) => s.toLowerCase().includes(selectedService.toLowerCase()))

    const matchesPrice = tailor.basePrice >= priceRange[0] && tailor.basePrice <= priceRange[1]
    const matchesRating = tailor.rating >= ratingFilter

    return matchesSearch && matchesService && matchesPrice && matchesRating
  })

  if (sortBy === "distance") {
    filteredTailors = filteredTailors.sort((a, b) => Number.parseFloat(a.distance) - Number.parseFloat(b.distance))
  } else if (sortBy === "rating") {
    filteredTailors = filteredTailors.sort((a, b) => b.rating - a.rating)
  } else if (sortBy === "price") {
    filteredTailors = filteredTailors.sort((a, b) => a.basePrice - b.basePrice)
  }

  const tailorLocations = filteredTailors.map((tailor) => ({
    id: tailor.id,
    businessName: tailor.businessName,
    latitude: tailor.location.latitude,
    longitude: tailor.location.longitude,
    rating: tailor.rating,
  }))

  return (
    <div className="min-h-screen bg-background">
      <CustomerHeader user={user} />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Find Tailors Near You</h1>
          <p className="text-muted-foreground">Discover expert tailors in your area</p>
        </div>

        {/* Search and Filter Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Search Filters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4 mb-4">
              <div className="space-y-2">
                <Input
                  placeholder="Search by name or location..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <Select value={selectedService} onValueChange={setSelectedService}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by service" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Services</SelectItem>
                    <SelectItem value="suits">Suits</SelectItem>
                    <SelectItem value="dresses">Dresses</SelectItem>
                    <SelectItem value="alterations">Alterations</SelectItem>
                    <SelectItem value="shirts">Shirts</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="distance">Distance</SelectItem>
                    <SelectItem value="rating">Rating</SelectItem>
                    <SelectItem value="price">Price</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4 pt-4 border-t border-border">
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Price Range: ${priceRange[0]} - ${priceRange[1]}
                </label>
                <div className="flex gap-2 items-center">
                  <Input
                    type="number"
                    value={priceRange[0]}
                    onChange={(e) => setPriceRange([Number.parseInt(e.target.value) || 0, priceRange[1]])}
                    className="w-24"
                  />
                  <span>to</span>
                  <Input
                    type="number"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], Number.parseInt(e.target.value) || 1000])}
                    className="w-24"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Minimum Rating: {ratingFilter} stars</label>
                <Select value={ratingFilter.toString()} onValueChange={(v) => setRatingFilter(Number.parseFloat(v))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">All Ratings</SelectItem>
                    <SelectItem value="4">4+ Stars</SelectItem>
                    <SelectItem value="4.5">4.5+ Stars</SelectItem>
                    <SelectItem value="4.8">4.8+ Stars</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="pt-4 border-t border-border mt-4">
              <p className="text-sm text-muted-foreground">
                Showing {filteredTailors.length} of {MOCK_TAILORS.length} tailors
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="mb-8">
          <TailorMap
            tailors={tailorLocations}
            onTailorSelect={(tailorId) => {
              // Scroll to tailor card or navigate to profile
              const element = document.getElementById(`tailor-${tailorId}`)
              element?.scrollIntoView({ behavior: "smooth" })
            }}
            height="400px"
          />
        </div>

        {/* Tailors List */}
        <div className="space-y-4">
          {filteredTailors.map((tailor) => (
            <Card key={tailor.id} id={`tailor-${tailor.id}`}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h2 className="text-2xl font-bold">{tailor.businessName}</h2>
                      <Badge variant="secondary">{tailor.distance}</Badge>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                      <MapPin className="h-4 w-4" />
                      {tailor.location.address}
                    </div>
                  </div>
                  <Button size="sm" variant="ghost">
                    <Heart className="h-5 w-5" />
                  </Button>
                </div>

                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center gap-1">
                    <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                    <span className="font-bold">{tailor.rating}</span>
                    <span className="text-sm text-muted-foreground">({tailor.reviewCount} reviews)</span>
                  </div>
                  <div className="text-sm">
                    <span className="text-muted-foreground">Starting from</span>
                    <span className="font-bold ml-1">${tailor.basePrice}</span>
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-sm font-medium mb-2">Specialties:</p>
                  <div className="flex flex-wrap gap-2">
                    {tailor.specialties.map((specialty) => (
                      <Badge key={specialty} variant="outline">
                        {specialty}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-sm font-medium mb-2">Services:</p>
                  <div className="flex flex-wrap gap-2">
                    {tailor.services.map((service) => (
                      <Badge key={service}>{service}</Badge>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2">
                  <Link href={`/customer/tailor/${tailor.id}`} className="flex-1">
                    <Button className="w-full gap-2">
                      <Search className="h-4 w-4" />
                      View Profile
                    </Button>
                  </Link>
                  <Link href={`/customer/order/new?tailorId=${tailor.id}`}>
                    <Button variant="outline">Place Order</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  )
}
