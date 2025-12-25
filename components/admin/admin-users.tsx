"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Search, MoreVertical, Ban, CheckCircle } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { formatDate } from "@/lib/date"
import { formatNaira } from "@/lib/currency"

// Mock data
const MOCK_CUSTOMERS = [
  {
    id: "1",
    name: "Chinedu Okafor",
    email: "chinedu.okafor@example.com",
    phone: "+234 803 555 0101",
    totalOrders: 8,
    totalSpent: 450000,
    joinedAt: new Date("2024-06-15"),
    status: "active" as const,
  },
  {
    id: "2",
    name: "Zainab Bello",
    email: "zainab.bello@example.com",
    phone: "+234 812 555 0102",
    totalOrders: 5,
    totalSpent: 320000,
    joinedAt: new Date("2024-08-20"),
    status: "active" as const,
  },
  {
    id: "3",
    name: "Tolu Adebayo",
    email: "tolu.adebayo@example.com",
    phone: "+234 901 555 0103",
    totalOrders: 12,
    totalSpent: 780000,
    joinedAt: new Date("2024-03-10"),
    status: "active" as const,
  },
]

export function AdminUsers() {
  const [searchQuery, setSearchQuery] = useState("")

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Customer Management</CardTitle>
            <CardDescription>View and manage customer accounts</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search customers..."
                className="pl-10 w-[300px]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {MOCK_CUSTOMERS.map((customer) => (
            <div key={customer.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
              <div className="space-y-1 flex-1">
                <div className="flex items-center gap-3">
                  <p className="font-medium">{customer.name}</p>
                  <Badge variant={customer.status === "active" ? "default" : "secondary"}>{customer.status}</Badge>
                </div>
                <p className="text-sm text-muted-foreground">{customer.email}</p>
                <p className="text-sm text-muted-foreground">{customer.phone}</p>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span>{customer.totalOrders} orders</span>
                  <span>{formatNaira(customer.totalSpent)} spent</span>
                  <span>Joined {formatDate(customer.joinedAt)}</span>
                </div>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline">
                  View Details
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button size="sm" variant="ghost">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      View Orders
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive">
                      <Ban className="h-4 w-4 mr-2" />
                      Suspend Account
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
