"use client"

import { useState } from "react"
import { CustomerHeader } from "./customer-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Search, MapPin, Star, Heart, Zap, BadgeCheck } from "lucide-react"
import Link from "next/link"
import type { User } from "@/lib/types"
import { TailorMap } from "@/components/map/tailor-map"
import { getBadgeMeta } from "@/lib/badge-utils"
import type { TailorBadgeType } from "@/lib/types"
import { formatNaira } from "@/lib/currency"

// Mock tailors data
const MOCK_TAILORS = [
  {
    id: "1",
    businessName: "Lagos Heritage Tailors",
    location: { address: "12 Adeola Odeku, Victoria Island, Lagos", latitude: 6.4281, longitude: 3.4219 },
    rating: 4.8,
    reviewCount: 156,
    specialties: ["Agbada", "Aso Oke", "Wedding Attire"],
    services: ["Agbada Sets", "Kaftan & Trousers", "Alterations"],
    basePrice: 95000,
    distance: "2.0 km",
    express: { enabled: true, expressSlaDays: 3, feeRate: 0.25, minimumFee: 15000, weeklyCap: 5, weeklyInUse: 2 },
    badges: [
      {
        id: "b1",
        type: "professional",
        label: "Professional Tailor",
        description: "6+ months tenure and 100+ verified orders",
        awardedAt: new Date("2024-07-01"),
        status: "active" as const,
        source: "automated" as const,
      },
      {
        id: "b2",
        type: "express-specialist",
        label: "Express Specialist",
        description: "On-time express delivery streak",
        awardedAt: new Date("2024-12-01"),
        status: "active" as const,
        source: "automated" as const,
      },
      {
        id: "b3",
        type: "top-rated",
        label: "Top Rated",
        description: "4.8★+ with 150 reviews",
        awardedAt: new Date("2024-03-12"),
        status: "active" as const,
        source: "automated" as const,
      },
    ],
  },
  {
    id: "2",
    businessName: "Abuja Threadworks",
    location: { address: "22 Aminu Kano Cres, Wuse 2, Abuja", latitude: 9.0765, longitude: 7.3986 },
    rating: 4.9,
    reviewCount: 203,
    specialties: ["Buba & Wrapper", "Lace", "Bridal"],
    services: ["Buba & Wrapper", "Aso Ebi", "Alterations"],
    basePrice: 110000,
    distance: "3.5 km",
    express: { enabled: true, expressSlaDays: 2, feeRate: 0.3, minimumFee: 20000, weeklyCap: 3, weeklyInUse: 1 },
    badges: [
      {
        id: "b1",
        type: "verified",
        label: "Verified Tailor",
        description: "Identity & skill assessment completed",
        awardedAt: new Date("2025-01-10"),
        status: "active" as const,
        source: "manual" as const,
      },
      {
        id: "b2",
        type: "style-specialist",
        label: "Bridal Specialist",
        description: "High bridal completion & satisfaction",
        awardedAt: new Date("2024-11-18"),
        status: "active" as const,
        source: "automated" as const,
        specialty: "Bridal",
      },
    ],
  },
  {
    id: "3",
    businessName: "Enugu Stitch House",
    location: { address: "18 Presidential Rd, Enugu", latitude: 6.4402, longitude: 7.4943 },
    rating: 4.7,
    reviewCount: 98,
    specialties: ["Senator", "Corporate Native", "Casual Wear"],
    services: ["Senator Suit", "Kaftan", "Pants Tailoring"],
    basePrice: 85000,
    distance: "5.8 km",
    express: { enabled: false, expressSlaDays: 0, feeRate: 0, weeklyCap: 0, weeklyInUse: 0 },
    badges: [
      {
        id: "b1",
        type: "professional",
        label: "Professional Tailor",
        description: "Consistent completion and retention",
        awardedAt: new Date("2024-05-10"),
        status: "active" as const,
        source: "automated" as const,
      },
    ],
  },
  {
    id: "4",
    businessName: "Ibadan Royal Cuts",
    location: { address: "47 Ring Rd, Ibadan", latitude: 7.3775, longitude: 3.947 },
    rating: 4.6,
    reviewCount: 84,
    specialties: ["Traditional Wear", "Adire Styles"],
    services: ["Traditional Wear", "Embroidery", "Alterations"],
    basePrice: 78000,
    distance: "7.2 km",
    express: { enabled: true, expressSlaDays: 4, feeRate: 0.2, minimumFee: 12000, weeklyCap: 4, weeklyInUse: 3 },
    badges: [
      {
        id: "b1",
        type: "style-specialist",
        label: "Traditional Wear Pro",
        description: "Recognized for cultural wear expertise",
        awardedAt: new Date("2024-09-15"),
        status: "active" as const,
        source: "automated" as const,
        specialty: "Traditional",
      },
    ],
  },
]

interface TailorSearchProps {
  user: User
}

export function TailorSearch({ user }: TailorSearchProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedService, setSelectedService] = useState("all")
  const [sortBy, setSortBy] = useState("distance")
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 250000])
  const [ratingFilter, setRatingFilter] = useState(0)
  const [expressOnly, setExpressOnly] = useState(false)
  const [badgeFilter, setBadgeFilter] = useState<TailorBadgeType | "all">("all")

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
    const matchesExpress = !expressOnly || tailor.express.enabled
    const matchesBadge = badgeFilter === "all" || tailor.badges.some((badge) => badge.type === badgeFilter)

    return matchesSearch && matchesService && matchesPrice && matchesRating && matchesExpress && matchesBadge
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
          <p className="text-muted-foreground">Discover expert tailors across Nigeria</p>
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
                    <SelectItem value="agbada">Agbada</SelectItem>
                    <SelectItem value="kaftan">Kaftan</SelectItem>
                    <SelectItem value="senator">Senator</SelectItem>
                    <SelectItem value="buba">Buba & Wrapper</SelectItem>
                    <SelectItem value="alterations">Alterations</SelectItem>
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
                  Price Range: {formatNaira(priceRange[0])} - {formatNaira(priceRange[1])}
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
                    onChange={(e) => setPriceRange([priceRange[0], Number.parseInt(e.target.value) || 250000])}
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

            <div className="grid md:grid-cols-3 gap-4 pt-4">
              <div className="flex items-center justify-between rounded-lg border border-border px-4 py-3">
                <div className="space-y-1">
                  <p className="text-sm font-medium flex items-center gap-2">
                    <Zap className="h-4 w-4 text-orange-500" /> Express-ready only
                  </p>
                  <p className="text-xs text-muted-foreground">Surface tailors who can ship in 2–4 days.</p>
                </div>
                <Switch checked={expressOnly} onCheckedChange={setExpressOnly} aria-label="Filter express ready tailors" />
              </div>

              <div className="space-y-2">
                <Label className="text-sm">Badge filter</Label>
                <Select value={badgeFilter} onValueChange={(value) => setBadgeFilter(value as TailorBadgeType | "all")}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by badge" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Any badge</SelectItem>
                    <SelectItem value="verified">Verified</SelectItem>
                    <SelectItem value="top-rated">Top Rated</SelectItem>
                    <SelectItem value="professional">Professional</SelectItem>
                    <SelectItem value="express-specialist">Express Specialist</SelectItem>
                    <SelectItem value="style-specialist">Style Specialist</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="rounded-lg border border-border px-4 py-3 bg-muted/40">
                <p className="text-sm font-medium flex items-center gap-2">
                  <BadgeCheck className="h-4 w-4 text-emerald-600" />
                  Badge-first ranking
                </p>
                <p className="text-xs text-muted-foreground">Top-rated & verified tailors appear first when matched.</p>
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
                  {tailor.express.enabled && (
                    <Badge className="bg-orange-100 text-orange-900 dark:bg-orange-900 dark:text-orange-100 flex items-center gap-1">
                      <Zap className="h-3 w-3" /> Express {tailor.express.expressSlaDays}-day
                    </Badge>
                  )}
                  <div className="text-sm">
                    <span className="text-muted-foreground">Starting from</span>
                    <span className="font-bold ml-1">{formatNaira(tailor.basePrice)}</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  {tailor.badges.map((badge) => {
                    const meta = getBadgeMeta(badge)
                    const Icon = meta.icon ?? BadgeCheck
                    return (
                      <Badge key={`${tailor.id}-${badge.id}`} className={meta.tone}>
                        <Icon className="h-3.5 w-3.5 mr-1" />
                        {meta.label ?? badge.label}
                      </Badge>
                    )
                  })}
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

                {tailor.express.enabled ? (
                  <div className="mb-4 rounded-lg border border-orange-200 dark:border-orange-900 bg-orange-50/60 dark:bg-orange-950/30 p-4">
                    <div className="flex flex-wrap items-center gap-3 mb-2">
                      <Badge className="bg-orange-600 text-white flex items-center gap-1">
                        <Zap className="h-3 w-3" /> Express available
                      </Badge>
                      <p className="text-sm font-semibold">{tailor.express.expressSlaDays}-day delivery</p>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      +{Math.round(tailor.express.feeRate * 100)}% fee (min {formatNaira(tailor.express.minimumFee ?? 0)}) applied at checkout.
                      Weekly capacity: {tailor.express.weeklyInUse}/{tailor.express.weeklyCap} slots.
                    </p>
                  </div>
                ) : (
                  <div className="mb-4 rounded-lg border border-border p-4">
                    <p className="text-sm font-semibold">Express not currently available</p>
                    <p className="text-xs text-muted-foreground">Choose a different tailor or standard timeline.</p>
                  </div>
                )}

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
