"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { formatDate } from "@/lib/date"
import { formatNaira } from "@/lib/currency"
import { Eye, RefreshCw } from "lucide-react"
import Link from "next/link"

interface OrderHistoryProps {
  limit?: number
}

// Mock data
const MOCK_ORDERS = [
  {
    id: "ORD-001",
    tailorName: "Lagos Heritage Tailors",
    service: "Agbada Set",
    status: "in-progress" as const,
    price: 180000,
    createdAt: new Date("2025-01-10"),
    estimatedDelivery: new Date("2025-01-25"),
  },
  {
    id: "ORD-002",
    tailorName: "Abuja Threadworks",
    service: "Senator Suit",
    status: "completed" as const,
    price: 125000,
    createdAt: new Date("2025-01-05"),
  },
  {
    id: "ORD-003",
    tailorName: "Enugu Stitch House",
    service: "Buba & Wrapper",
    status: "delivered" as const,
    price: 98000,
    createdAt: new Date("2024-12-28"),
  },
]

const statusColors = {
  pending: "bg-muted text-muted-foreground",
  confirmed: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  "in-progress": "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  "fitting-required": "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
  completed: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  delivered: "bg-primary text-primary-foreground",
  cancelled: "bg-destructive text-destructive-foreground",
}

export function OrderHistory({ limit }: OrderHistoryProps) {
  const orders = limit ? MOCK_ORDERS.slice(0, limit) : MOCK_ORDERS

  function handleReorder(orderId: string) {
    const order = MOCK_ORDERS.find((o) => o.id === orderId)
    if (order && (order.status === "completed" || order.status === "delivered")) {
      window.location.href = `/customer/order/new?tailorId=${order.tailorName}&reorder=${orderId}`
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Order History</CardTitle>
        <CardDescription>View and track your tailoring orders</CardDescription>
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
                <p className="text-sm text-muted-foreground">{order.tailorName}</p>
                <p className="text-sm text-muted-foreground">
                  Order #{order.id} • {formatDate(order.createdAt)}
                </p>
              </div>
              <div className="text-right space-y-2">
                <p className="font-bold">{formatNaira(order.price)}</p>
                <div className="flex gap-2">
                  <Link href={`/customer/order/${order.id}`}>
                    <Button size="sm" variant="outline" className="gap-2 bg-transparent">
                      <Eye className="h-4 w-4" />
                      View
                    </Button>
                  </Link>
                  {(order.status === "completed" || order.status === "delivered") && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="gap-2 bg-transparent"
                      onClick={() => handleReorder(order.id)}
                    >
                      <RefreshCw className="h-4 w-4" />
                      Reorder
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
