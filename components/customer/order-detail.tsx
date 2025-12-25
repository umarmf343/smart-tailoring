"use client"

import Link from "next/link"
import { useMemo, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, MessageCircle, Package, CheckCircle, Clock, Sparkles, AlertCircle } from "lucide-react"
import { formatDate } from "@/lib/date"
import { formatNaira } from "@/lib/currency"
import {
  MEASUREMENT_LIBRARY,
  describeGarmentType,
  formatConvertedMeasurement,
  generateMeasurementAlerts,
  getFitSuggestions,
} from "@/lib/measurement-system"

interface OrderDetailProps {
  orderId: string
}

// Mock order data
const MOCK_ORDER = {
  id: "ORD-001",
  tailorName: "Lagos Heritage Tailors",
  tailorId: "1",
  service: "Agbada Set",
  measurementProfileId: "ms-agbada-classic",
  status: "in-progress" as const,
  price: 180000,
  createdAt: new Date("2025-01-10"),
  estimatedDelivery: new Date("2025-02-10"),
  fabricChoice: "Aso Oke (deep navy)",
  customDesign: "Gold embroidery chest panel with wide agbada sleeves",
  specialInstructions: "Leave extra ease for dancing during reception",
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
  const [selectedProfileId, setSelectedProfileId] = useState<string | null>(null)
  const measurementProfile = useMemo(
    () => MEASUREMENT_LIBRARY.find((profile) => profile.id === selectedProfileId),
    [selectedProfileId],
  )
  const measurementAlerts = measurementProfile ? generateMeasurementAlerts(measurementProfile) : []
  const fitSuggestions = measurementProfile ? getFitSuggestions(measurementProfile) : []

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
            <p className="text-muted-foreground">Placed on {formatDate(MOCK_ORDER.createdAt)}</p>
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
                    {step.date && <p className="text-sm text-muted-foreground">{formatDate(step.date)}</p>}
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
                <p className="font-medium text-lg">{formatNaira(MOCK_ORDER.price)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Estimated Delivery</p>
                <p className="font-medium">{formatDate(MOCK_ORDER.estimatedDelivery)}</p>
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
            <div className="mt-3 max-w-sm">
              <Select value={selectedProfileId ?? ""} onValueChange={setSelectedProfileId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a measurement profile" />
                </SelectTrigger>
                <SelectContent>
                  {MEASUREMENT_LIBRARY.map((profile) => (
                    <SelectItem key={profile.id} value={profile.id}>
                      {profile.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {measurementProfile && (
              <div className="flex flex-wrap gap-2 mt-3">
                <Badge variant="secondary">{measurementProfile.name}</Badge>
                <Badge variant="outline">
                  {describeGarmentType(measurementProfile.garmentType)} • {measurementProfile.unit}
                </Badge>
                {measurementAlerts.length > 0 ? (
                  <Badge variant="destructive" className="bg-amber-100 text-amber-800">
                    {measurementAlerts.length} alert(s) flagged
                  </Badge>
                ) : (
                  <Badge variant="outline">Verified</Badge>
                )}
              </div>
            )}
          </CardHeader>
          <CardContent>
            {!measurementProfile && (
              <div className="rounded-lg border border-dashed p-6 text-sm text-muted-foreground">
                Select a profile to view measurements, alerts, and tailor guidance for this order.
              </div>
            )}

            {measurementProfile && (
              <>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {Object.entries(measurementProfile.measurements).map(([key, value]) => (
                    <div key={key} className="p-3 bg-muted rounded-lg">
                      <p className="text-sm text-muted-foreground capitalize mb-1">{key.replace(/([A-Z])/g, " $1")}</p>
                      <p className="font-bold text-lg">
                        {value} {measurementProfile.unit}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        ≈ {formatConvertedMeasurement(value, measurementProfile.unit)}
                      </p>
                    </div>
                  ))}
                </div>
                {measurementAlerts.length > 0 && (
                  <div className="mt-4 space-y-2">
                    {measurementAlerts.map((alert) => (
                      <div
                        key={alert.message}
                        className="p-3 border rounded-md bg-amber-50 dark:bg-amber-950/30 text-sm flex items-start gap-2"
                      >
                        <AlertCircle className="h-4 w-4 text-amber-600 mt-0.5" />
                        <div>
                          <p className="font-medium">{alert.message}</p>
                          <p className="text-xs text-muted-foreground">Fields: {alert.fields.join(", ")}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                <div className="mt-4 space-y-2">
                  <p className="text-sm font-semibold flex items-center gap-2">
                    <Sparkles className="h-4 w-4" />
                    Fit suggestions from tailor
                  </p>
                  <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                    {fitSuggestions.map((suggestion) => (
                      <li key={suggestion}>{suggestion}</li>
                    ))}
                  </ul>
                </div>
              </>
            )}
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
