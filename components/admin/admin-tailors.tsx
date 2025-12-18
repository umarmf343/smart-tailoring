"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Search, MoreVertical, CheckCircle, X, Eye } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Mock data
const MOCK_TAILORS = [
  {
    id: "1",
    businessName: "Master Tailor Co.",
    ownerName: "James Wilson",
    email: "james@mastertailor.com",
    phone: "+1 555-0201",
    location: "Downtown, New York",
    rating: 4.8,
    totalOrders: 143,
    totalRevenue: 48500,
    joinedAt: new Date("2024-01-15"),
    status: "approved" as const,
  },
  {
    id: "2",
    businessName: "Heritage Tailors",
    ownerName: "Sarah Chen",
    email: "sarah@heritage.com",
    phone: "+1 555-0202",
    location: "Queens, New York",
    rating: 0,
    totalOrders: 0,
    totalRevenue: 0,
    joinedAt: new Date("2025-01-16"),
    status: "pending" as const,
  },
]

export function AdminTailors() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("all")

  const pendingTailors = MOCK_TAILORS.filter((t) => t.status === "pending")
  const approvedTailors = MOCK_TAILORS.filter((t) => t.status === "approved")

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Tailor Management</CardTitle>
            <CardDescription>Approve and manage tailor accounts</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search tailors..."
                className="pl-10 w-[300px]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="all">All Tailors ({MOCK_TAILORS.length})</TabsTrigger>
            <TabsTrigger value="pending">Pending Approval ({pendingTailors.length})</TabsTrigger>
            <TabsTrigger value="approved">Approved ({approvedTailors.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="all">
            <TailorList tailors={MOCK_TAILORS} />
          </TabsContent>

          <TabsContent value="pending">
            <TailorList tailors={pendingTailors} showApprovalActions />
          </TabsContent>

          <TabsContent value="approved">
            <TailorList tailors={approvedTailors} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

function TailorList({ tailors, showApprovalActions }: { tailors: typeof MOCK_TAILORS; showApprovalActions?: boolean }) {
  return (
    <div className="space-y-4">
      {tailors.map((tailor) => (
        <div key={tailor.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
          <div className="space-y-1 flex-1">
            <div className="flex items-center gap-3">
              <p className="font-medium">{tailor.businessName}</p>
              <Badge variant={tailor.status === "approved" ? "default" : "secondary"}>{tailor.status}</Badge>
            </div>
            <p className="text-sm text-muted-foreground">Owner: {tailor.ownerName}</p>
            <p className="text-sm text-muted-foreground">
              {tailor.email} • {tailor.phone}
            </p>
            <p className="text-sm text-muted-foreground">{tailor.location}</p>
            {tailor.status === "approved" && (
              <div className="flex items-center gap-4 text-sm text-muted-foreground mt-2">
                <span>Rating: {tailor.rating}/5</span>
                <span>{tailor.totalOrders} orders</span>
                <span>${tailor.totalRevenue.toLocaleString()} revenue</span>
              </div>
            )}
            <p className="text-sm text-muted-foreground">Joined {tailor.joinedAt.toLocaleDateString()}</p>
          </div>
          <div className="flex gap-2">
            {showApprovalActions ? (
              <>
                <Button size="sm" className="gap-2">
                  <CheckCircle className="h-4 w-4" />
                  Approve
                </Button>
                <Button size="sm" variant="outline" className="gap-2 bg-transparent">
                  <Eye className="h-4 w-4" />
                  Review
                </Button>
                <Button size="sm" variant="destructive" className="gap-2">
                  <X className="h-4 w-4" />
                  Reject
                </Button>
              </>
            ) : (
              <>
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
                    <DropdownMenuItem>View Orders</DropdownMenuItem>
                    <DropdownMenuItem>View Reviews</DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive">Suspend Account</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
