"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Eye, MessageCircle, CheckCircle } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface TailorOrdersProps {
  limit?: number
}

// Mock data
const MOCK_ORDERS = [
  {
    id: "ORD-001",
    customerName: "John Doe",
    service: "Custom Suit",
    status: "in-progress" as const,
    price: 450,
    createdAt: new Date("2025-01-10"),
    estimatedDelivery: new Date("2025-01-25"),
    measurements: { chest: 40, waist: 34, shoulder: 18, sleeveLength: 25, inseam: 32 },
  },
  {
    id: "ORD-002",
    customerName: "Jane Smith",
    service: "Dress Alteration",
    status: "pending" as const,
    price: 80,
    createdAt: new Date("2025-01-15"),
    estimatedDelivery: new Date("2025-01-20"),
    measurements: { bust: 36, waist: 28, hips: 38 },
  },
  {
    id: "ORD-003",
    customerName: "Mike Johnson",
    service: "Shirt Customization",
    status: "fitting-required" as const,
    price: 120,
    createdAt: new Date("2025-01-12"),
    estimatedDelivery: new Date("2025-01-22"),
    measurements: { chest: 42, waist: 36, neck: 16, sleeveLength: 34 },
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
  const [statusFilter, setStatusFilter] = useState("all")

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
            {orders.map((order) => (
              <div key={order.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
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
                </div>
                <div className="text-right space-y-2">
                  <p className="font-bold">${order.price}</p>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => setSelectedOrder(order)} className="gap-2">
                      <Eye className="h-4 w-4" />
                      View
                    </Button>
                    <Button size="sm" variant="ghost">
                      <MessageCircle className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Order Details Dialog */}
      <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
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

              <div>
                <h3 className="font-bold mb-3">Customer Measurements</h3>
                <div className="grid grid-cols-2 gap-3 p-4 bg-muted rounded-lg">
                  {Object.entries(selectedOrder.measurements).map(([key, value]) => (
                    <div key={key} className="flex justify-between">
                      <span className="text-sm capitalize">{key.replace(/([A-Z])/g, " $1")}</span>
                      <span className="font-medium">
                        {value} {typeof value === "number" ? "inch" : ""}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

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
