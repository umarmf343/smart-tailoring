"use client"

import { useMemo, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Eye, MessageCircle, CheckCircle } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  MEASUREMENT_LIBRARY,
  describeGarmentType,
  formatConvertedMeasurement,
  generateMeasurementAlerts,
  getFitSuggestions,
} from "@/lib/measurement-system"
import { MeasurementAdjustmentRequest } from "./measurement-adjustment-request"
import { Separator } from "@/components/ui/separator"

interface TailorOrdersProps {
  limit?: number
}

// Mock data
const MOCK_ORDERS = [
  {
    id: "ORD-001",
    customerName: "John Doe",
    service: "Custom Suit",
    garmentType: "blazer" as const,
    status: "in-progress" as const,
    price: 450,
    createdAt: new Date("2025-01-10"),
    estimatedDelivery: new Date("2025-01-25"),
    measurementProfileId: "ms-formal-suit",
  },
  {
    id: "ORD-002",
    customerName: "Jane Smith",
    service: "Dress Alteration",
    garmentType: "dress" as const,
    status: "pending" as const,
    price: 80,
    createdAt: new Date("2025-01-15"),
    estimatedDelivery: new Date("2025-01-20"),
    measurementProfileId: "ms-wedding-dress",
  },
  {
    id: "ORD-003",
    customerName: "Mike Johnson",
    service: "Shirt Customization",
    garmentType: "pants" as const,
    status: "fitting-required" as const,
    price: 120,
    createdAt: new Date("2025-01-12"),
    estimatedDelivery: new Date("2025-01-22"),
    measurementProfileId: "ms-cycling-pants",
  },
]

const statusColors = {
  pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  confirmed: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  "in-progress": "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
  "fitting-required": "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
  completed: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  delivered: "bg-primary text-primary-foreground",
  cancelled: "bg-destructive text-destructive-foreground",
}

export function TailorOrders({ limit }: TailorOrdersProps) {
  const orders = limit ? MOCK_ORDERS.slice(0, limit) : MOCK_ORDERS
  const [selectedOrder, setSelectedOrder] = useState<(typeof MOCK_ORDERS)[0] | null>(null)
  const [selectedProfileId, setSelectedProfileId] = useState<string | null>(null)
  const [statusFilter, setStatusFilter] = useState("all")

  const measurementProfile = useMemo(
    () =>
      MEASUREMENT_LIBRARY.find(
        (profile) => profile.id === (selectedProfileId ?? selectedOrder?.measurementProfileId),
      ),
    [selectedOrder, selectedProfileId],
  )
  const measurementAlerts = measurementProfile ? generateMeasurementAlerts(measurementProfile) : []
  const fitSuggestions = measurementProfile ? getFitSuggestions(measurementProfile) : []
  const garmentMatchedProfiles = selectedOrder
    ? MEASUREMENT_LIBRARY.filter((profile) => profile.garmentType === selectedOrder.garmentType)
    : MEASUREMENT_LIBRARY
  const filteredOrders = statusFilter === "all" ? orders : orders.filter((order) => order.status === statusFilter)

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Orders</CardTitle>
              <CardDescription>Manage your customer orders</CardDescription>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Orders</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="fitting-required">Fitting Required</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredOrders.map((order) => {
                const profile = MEASUREMENT_LIBRARY.find((item) => item.id === order.measurementProfileId)
                return (
                  <div
                    key={order.id}
                    className="flex items-center justify-between p-4 border border-border rounded-lg"
                  >
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center gap-3">
                        <p className="font-medium">{order.service}</p>
                        <Badge className={statusColors[order.status]}>{order.status.replace("-", " ")}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">Customer: {order.customerName}</p>
                      <p className="text-sm text-muted-foreground">
                        Order #{order.id} • Placed {order.createdAt.toLocaleDateString()}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Est. Delivery: {order.estimatedDelivery.toLocaleDateString()}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Measurements: {profile?.name ?? "Not attached"} •{" "}
                        {profile ? profile.status.replace("-", " ") : "pending"} (
                        {describeGarmentType(order.garmentType)})
                      </p>
                    </div>
                    <div className="text-right space-y-2">
                      <p className="font-bold">${order.price}</p>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setSelectedOrder(order)
                            setSelectedProfileId(order.measurementProfileId)
                          }}
                          className="gap-2"
                        >
                          <Eye className="h-4 w-4" />
                          View
                        </Button>
                        <Button size="sm" variant="ghost">
                          <MessageCircle className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

      {/* Order Details Dialog */}
      <Dialog
        open={!!selectedOrder}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedOrder(null)
            setSelectedProfileId(null)
          }
        }}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Order Details - {selectedOrder?.id}</DialogTitle>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Customer</p>
                  <p className="font-medium">{selectedOrder.customerName}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Service</p>
                  <p className="font-medium">{selectedOrder.service}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <Badge className={statusColors[selectedOrder.status]}>{selectedOrder.status}</Badge>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Price</p>
                  <p className="font-medium">${selectedOrder.price}</p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="font-bold">Customer Measurements</h3>
                  <Select
                    value={selectedProfileId ?? selectedOrder.measurementProfileId}
                    onValueChange={setSelectedProfileId}
                  >
                    <SelectTrigger className="w-[220px]">
                      <SelectValue placeholder="Switch measurement set" />
                    </SelectTrigger>
                    <SelectContent>
                      {garmentMatchedProfiles.map((profile) => (
                        <SelectItem key={profile.id} value={profile.id}>
                          {profile.name} ({profile.status.replace("-", " ")})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {measurementProfile ? (
                  <>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="secondary">{measurementProfile.name}</Badge>
                      <Badge variant="outline">{describeGarmentType(measurementProfile.garmentType)}</Badge>
                      <Badge variant="outline">{measurementProfile.unit.toUpperCase()}</Badge>
                      <Badge
                        className={
                          measurementProfile.status === "verified"
                            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                            : "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200"
                        }
                      >
                        {measurementProfile.status.replace("-", " ")}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 gap-3 p-4 bg-muted rounded-lg">
                      {Object.entries(measurementProfile.measurements).map(([key, value]) => (
                        <div key={key} className="flex flex-col">
                          <span className="text-sm capitalize text-muted-foreground">{key.replace(/([A-Z])/g, " $1")}</span>
                          <span className="font-medium">
                            {value} {measurementProfile.unit}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            ≈ {formatConvertedMeasurement(value, measurementProfile.unit)}
                          </span>
                        </div>
                      ))}
                    </div>

                    {measurementAlerts.length > 0 && (
                      <div className="space-y-2">
                        {measurementAlerts.map((alert, index) => (
                          <div key={index} className="p-3 border rounded-md bg-amber-50 dark:bg-amber-950/30">
                            <p className="text-sm font-medium">{alert.message}</p>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="space-y-2">
                      <p className="text-sm font-semibold">Fit suggestions</p>
                      <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                        {fitSuggestions.map((suggestion) => (
                          <li key={suggestion}>{suggestion}</li>
                        ))}
                      </ul>
                    </div>

                    <MeasurementAdjustmentRequest
                      orderId={selectedOrder.id}
                      customerName={selectedOrder.customerName}
                      measurements={measurementProfile.measurements}
                      unit={measurementProfile.unit}
                      onRequestSent={() => console.log("Measurement clarification sent")}
                    />
                  </>
                ) : (
                  <p className="text-sm text-muted-foreground">No measurement profile attached to this order.</p>
                )}
              </div>

              <Separator />

              <div>
                <h3 className="font-bold mb-3">Update Order Status</h3>
                <Select defaultValue={selectedOrder.status}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="confirmed">Confirmed</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="fitting-required">Fitting Required</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={() => setSelectedOrder(null)}>
                  Close
                </Button>
                <Button className="gap-2">
                  <CheckCircle className="h-4 w-4" />
                  Update Status
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
