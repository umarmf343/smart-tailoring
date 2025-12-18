"use client"

import type { User } from "@/lib/types"
import Link from "next/link"
import Image from "next/image"
import { CustomerHeader } from "./customer-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MapPin, Clock, Star, Heart, MessageCircle, ShoppingBag } from "lucide-react"

interface TailorPublicProfileProps {
  tailorId: string
  user: User
}

// Mock tailor data
const MOCK_TAILOR = {
  id: "1",
  businessName: "Master Tailor Co.",
  rating: 4.8,
  reviewCount: 156,
  location: "123 Main St, Downtown, New York, NY 10001",
  businessHours: "Mon-Fri: 9AM-6PM, Sat: 10AM-4PM",
  description:
    "Master Tailor Co. has been providing premium custom tailoring services for over 20 years. We specialize in bespoke suits, formal wear, and wedding attire with meticulous attention to detail and craftsmanship.",
  specialties: ["Suits", "Formal Wear", "Wedding Attire", "Alterations"],
  services: [
    { name: "Custom Suit", price: 450, description: "Full bespoke suit with consultation" },
    { name: "Shirt Making", price: 120, description: "Custom fitted shirts" },
    { name: "Alterations", price: 50, description: "Basic alterations" },
    { name: "Wedding Attire", price: 600, description: "Complete wedding outfit" },
  ],
  portfolio: [
    { id: "1", imageUrl: "/placeholder.svg?height=300&width=300" },
    { id: "2", imageUrl: "/placeholder.svg?height=300&width=300" },
    { id: "3", imageUrl: "/placeholder.svg?height=300&width=300" },
    { id: "4", imageUrl: "/placeholder.svg?height=300&width=300" },
  ],
  reviews: [
    {
      id: "1",
      customerName: "John D.",
      rating: 5,
      comment: "Excellent work! The suit fits perfectly and the attention to detail is outstanding.",
      date: new Date("2025-01-10"),
    },
    {
      id: "2",
      customerName: "Jane S.",
      rating: 4,
      comment: "Great service, very professional. My dress turned out beautifully.",
      date: new Date("2025-01-08"),
    },
  ],
}

export function TailorPublicProfile({ tailorId, user }: TailorPublicProfileProps) {
  return (
    <div className="min-h-screen bg-background">
      <CustomerHeader user={user} />

      <main className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <Card className="mb-8">
          <CardContent className="p-8">
            <div className="flex items-start justify-between mb-6">
              <div className="flex-1">
                <h1 className="text-4xl font-bold mb-3">{MOCK_TAILOR.businessName}</h1>
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center gap-1">
                    <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                    <span className="font-bold text-lg">{MOCK_TAILOR.rating}</span>
                    <span className="text-muted-foreground">({MOCK_TAILOR.reviewCount} reviews)</span>
                  </div>
                </div>
                <div className="space-y-2 text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    <span>{MOCK_TAILOR.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span>{MOCK_TAILOR.businessHours}</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="lg">
                  <Heart className="h-5 w-5" />
                </Button>
                <Button variant="outline" size="lg" className="gap-2 bg-transparent">
                  <MessageCircle className="h-5 w-5" />
                  Message
                </Button>
                <Link href={`/customer/order/new?tailorId=${tailorId}`}>
                  <Button size="lg" className="gap-2">
                    <ShoppingBag className="h-5 w-5" />
                    Place Order
                  </Button>
                </Link>
              </div>
            </div>

            <p className="text-lg leading-relaxed">{MOCK_TAILOR.description}</p>

            <div className="mt-6">
              <h3 className="font-bold mb-3">Specialties</h3>
              <div className="flex flex-wrap gap-2">
                {MOCK_TAILOR.specialties.map((specialty) => (
                  <Badge key={specialty} variant="secondary" className="text-sm">
                    {specialty}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs Section */}
        <Tabs defaultValue="services" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-3">
            <TabsTrigger value="services">Services</TabsTrigger>
            <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
          </TabsList>

          <TabsContent value="services" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Services & Pricing</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  {MOCK_TAILOR.services.map((service) => (
                    <Card key={service.name}>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-bold text-lg">{service.name}</h3>
                          <span className="font-bold text-xl">${service.price}</span>
                        </div>
                        <p className="text-sm text-muted-foreground">{service.description}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="portfolio" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Work Portfolio</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {MOCK_TAILOR.portfolio.map((item) => (
                    <div
                      key={item.id}
                      className="aspect-square relative overflow-hidden rounded-lg border border-border"
                    >
                      <Image
                        src={item.imageUrl || "/placeholder.svg"}
                        alt="Portfolio item"
                        fill
                        sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 100vw"
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reviews" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Customer Reviews</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {MOCK_TAILOR.reviews.map((review) => (
                    <div key={review.id} className="border border-border rounded-lg p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <p className="font-medium">{review.customerName}</p>
                          <p className="text-sm text-muted-foreground">{review.date.toLocaleDateString()}</p>
                        </div>
                        <div className="flex items-center gap-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`h-4 w-4 ${review.rating >= star ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"}`}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-sm">{review.comment}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
