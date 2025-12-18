"use client"

import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowLeft, MessageCircle, Package, CheckCircle, Clock } from "lucide-react"

interface OrderDetailProps {
  orderId: string
}

// Mock order data
const MOCK_ORDER = {
  id: "ORD-001",
  tailorName: "Master Tailor Co.",
  tailorId: "1",
  service: "Custom Suit",
  status: "in-progress" as const,
  price: 450,
  createdAt: new Date("2025-01-10"),
  estimatedDelivery: new Date("2025-01-25"),
  measurements: {
    chest: 40,
    waist: 34,
    shoulder: 18,
    sleeveLength: 25,
    inseam: 32,
  },
  fabricChoice: "Navy Blue Wool",
  customDesign: "Classic two-button with notch lapels",
  specialInstructions: "Extra padding on shoulders, slightly tapered waist",
  timeline: [
    { status: "Order Placed", date: new Date("2025-01-10"), completed: true },
    { status: "In Progress", date: new Date("2025-01-12"), completed: true },
    { status: "Fitting Required", date: null, completed: false },
    { status: "Completed", date: null, completed: false },
    { status: "Delivered", date: null, completed: false },
  ],
}

const statusColors = {
  pending: "bg-muted text-muted-foreground",
  confirmed: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  "in-progress": "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  "fitting-required": "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
  completed: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  delivered: "bg-primary text-primary-foreground",
  cancelled: "bg-destructive text-destructive-foreground",
}

export function OrderDetail({ orderId }: OrderDetailProps) {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <Link href="/customer/dashboard">
          <Button variant="ghost" className="gap-2 mb-4">
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Button>
        </Link>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Order #{MOCK_ORDER.id}</h1>
            <p className="text-muted-foreground">Placed on {MOCK_ORDER.createdAt.toLocaleDateString()}</p>
          </div>
          <Badge className={statusColors[MOCK_ORDER.status]} style={{ fontSize: "1rem", padding: "0.5rem 1rem" }}>
            {MOCK_ORDER.status.replace("-", " ")}
          </Badge>
        </div>
      </div>

      <div className="grid gap-6">
        {/* Order Timeline */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Order Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {MOCK_ORDER.timeline.map((step, index) => (
                <div key={step.status} className="flex items-start gap-4">
                  <div className="flex flex-col items-center">
                    <div
                      className={`h-10 w-10 rounded-full flex items-center justify-center ${
                        step.completed ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {step.completed ? <CheckCircle className="h-5 w-5" /> : <Clock className="h-5 w-5" />}
                    </div>
                    {index < MOCK_ORDER.timeline.length - 1 && (
                      <div className={`w-0.5 h-12 ${step.completed ? "bg-primary" : "bg-muted"}`} />
                    )}
                  </div>
                  <div className="flex-1 pt-2">
                    <p className={`font-medium ${step.completed ? "text-foreground" : "text-muted-foreground"}`}>
                      {step.status}
                    </p>
                    {step.date && <p className="text-sm text-muted-foreground">{step.date.toLocaleDateString()}</p>}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Order Details */}
        <Card>
          <CardHeader>
            <CardTitle>Order Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Service</p>
                <p className="font-medium">{MOCK_ORDER.service}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Tailor</p>
                <Link href={`/customer/tailor/${MOCK_ORDER.tailorId}`}>
                  <p className="font-medium hover:underline">{MOCK_ORDER.tailorName}</p>
                </Link>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Price</p>
                <p className="font-medium text-lg">${MOCK_ORDER.price}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Estimated Delivery</p>
                <p className="font-medium">{MOCK_ORDER.estimatedDelivery.toLocaleDateString()}</p>
              </div>
            </div>

            {MOCK_ORDER.fabricChoice && (
              <div>
                <p className="text-sm text-muted-foreground mb-1">Fabric Choice</p>
                <p className="font-medium">{MOCK_ORDER.fabricChoice}</p>
              </div>
            )}

            {MOCK_ORDER.customDesign && (
              <div>
                <p className="text-sm text-muted-foreground mb-1">Custom Design</p>
                <p className="font-medium">{MOCK_ORDER.customDesign}</p>
              </div>
            )}

            {MOCK_ORDER.specialInstructions && (
              <div>
                <p className="text-sm text-muted-foreground mb-1">Special Instructions</p>
                <p className="font-medium">{MOCK_ORDER.specialInstructions}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Measurements */}
        <Card>
          <CardHeader>
            <CardTitle>Measurements</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {Object.entries(MOCK_ORDER.measurements).map(([key, value]) => (
                <div key={key} className="p-3 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground capitalize mb-1">{key.replace(/([A-Z])/g, " $1")}</p>
                  <p className="font-bold text-lg">{value} inch</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <Card>
          <CardContent className="p-6">
            <div className="flex gap-3">
              <Button className="flex-1 gap-2">
                <MessageCircle className="h-4 w-4" />
                Message Tailor
              </Button>
              {MOCK_ORDER.status === "completed" && (
                <Button variant="outline" className="flex-1 bg-transparent">
                  Leave Review
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
