"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { formatDate } from "@/lib/date"
import { Package, Users, Building2, Plus } from "lucide-react"

interface BulkOrder {
  id: string
  companyName: string
  contactPerson: string
  itemType: string
  quantity: number
  status: "pending" | "in-progress" | "completed"
  assignedTailor?: string
  price: number
  createdAt: Date
}

const MOCK_BULK_ORDERS: BulkOrder[] = [
  {
    id: "BULK-001",
    companyName: "Tech Corp Inc.",
    contactPerson: "John Smith",
    itemType: "Corporate Uniforms",
    quantity: 50,
    status: "in-progress",
    assignedTailor: "Master Tailor Co.",
    price: 12500,
    createdAt: new Date("2025-01-15"),
  },
  {
    id: "BULK-002",
    companyName: "Hotel Grand",
    contactPerson: "Sarah Johnson",
    itemType: "Staff Uniforms",
    quantity: 75,
    status: "pending",
    price: 18750,
    createdAt: new Date("2025-01-18"),
  },
]

export function BulkOrderManager() {
  const [orders, setOrders] = useState(MOCK_BULK_ORDERS)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)

  const statusColors = {
    pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
    "in-progress": "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
    completed: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Bulk Orders Management
              </CardTitle>
              <CardDescription>Manage corporate and bulk uniform orders</CardDescription>
            </div>
            <Button onClick={() => setIsCreateDialogOpen(true)} className="gap-2">
              <Plus className="h-4 w-4" />
              Create Bulk Order
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order.id} className="p-4 border border-border rounded-lg">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold">{order.companyName}</h3>
                      <Badge className={statusColors[order.status]}>{order.status}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">Order #{order.id}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-lg">${order.price.toLocaleString()}</p>
                    <p className="text-sm text-muted-foreground">{formatDate(order.createdAt)}</p>
                  </div>
                </div>

                <div className="grid md:grid-cols-4 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Contact Person</p>
                    <p className="font-medium flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      {order.contactPerson}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Item Type</p>
                    <p className="font-medium flex items-center gap-1">
                      <Package className="h-4 w-4" />
                      {order.itemType}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Quantity</p>
                    <p className="font-medium">{order.quantity} units</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Assigned To</p>
                    <p className="font-medium">{order.assignedTailor || "Not assigned"}</p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button size="sm">View Details</Button>
                  {order.status === "pending" && (
                    <Button size="sm" variant="outline" className="bg-transparent">
                      Assign Tailor
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create Bulk Order</DialogTitle>
            <DialogDescription>Add a new corporate or bulk uniform order</DialogDescription>
          </DialogHeader>
          <form className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="companyName">Company Name</Label>
                <Input id="companyName" placeholder="Company Inc." />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contactPerson">Contact Person</Label>
                <Input id="contactPerson" placeholder="John Doe" />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="itemType">Item Type</Label>
                <Input id="itemType" placeholder="Corporate Uniforms" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="quantity">Quantity</Label>
                <Input id="quantity" type="number" placeholder="50" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Order Description</Label>
              <Textarea id="description" rows={3} placeholder="Detailed requirements..." />
            </div>

            <div className="flex gap-2 justify-end">
              <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Create Order</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
