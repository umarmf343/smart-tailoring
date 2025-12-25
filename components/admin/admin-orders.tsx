"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { formatDate } from "@/lib/date"
import { formatNaira } from "@/lib/currency"
import { Search, Eye } from "lucide-react"

// Mock data
const MOCK_ORDERS = [
  {
    id: "ORD-001",
    customerName: "Chinedu Okafor",
    tailorName: "Lagos Heritage Tailors",
    service: "Agbada Set",
    status: "in-progress" as const,
    price: 180000,
    commission: 18000,
    createdAt: new Date("2025-01-10"),
  },
  {
    id: "ORD-002",
    customerName: "Zainab Bello",
    tailorName: "Abuja Threadworks",
    service: "Buba & Wrapper",
    status: "completed" as const,
    price: 110000,
    commission: 11000,
    createdAt: new Date("2025-01-05"),
  },
  {
    id: "ORD-003",
    customerName: "Tolu Adebayo",
    tailorName: "Enugu Stitch House",
    service: "Senator Suit",
    status: "pending" as const,
    price: 125000,
    commission: 12500,
    createdAt: new Date("2025-01-15"),
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

export function AdminOrders() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Order Management</CardTitle>
            <CardDescription>Monitor and manage all platform orders</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search orders..."
                className="pl-10 w-[250px]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {MOCK_ORDERS.map((order) => (
            <div key={order.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
              <div className="space-y-1 flex-1">
                <div className="flex items-center gap-3">
                  <p className="font-medium">Order #{order.id}</p>
                  <Badge className={statusColors[order.status]}>{order.status.replace("-", " ")}</Badge>
                </div>
                <p className="text-sm">
                  <span className="text-muted-foreground">Service:</span> {order.service}
                </p>
                <p className="text-sm">
                  <span className="text-muted-foreground">Customer:</span> {order.customerName}
                </p>
                <p className="text-sm">
                  <span className="text-muted-foreground">Tailor:</span> {order.tailorName}
                </p>
                <p className="text-sm text-muted-foreground">Placed {formatDate(order.createdAt)}</p>
              </div>
              <div className="text-right space-y-2">
                <div>
                  <p className="text-sm text-muted-foreground">Order Total</p>
                  <p className="font-bold">{formatNaira(order.price)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Commission</p>
                  <p className="font-medium text-green-600">{formatNaira(order.commission)}</p>
                </div>
                <Button size="sm" variant="outline" className="gap-2 mt-2 bg-transparent">
                  <Eye className="h-4 w-4" />
                  View Details
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
