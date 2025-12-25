"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Search, MoreVertical, CheckCircle, X, Eye, Zap, ShieldCheck } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { getBadgeMeta } from "@/lib/badge-utils"
import { formatDate } from "@/lib/date"
import { formatNaira } from "@/lib/currency"

// Mock data
const MOCK_TAILORS = [
  {
    id: "1",
    businessName: "Lagos Heritage Tailors",
    ownerName: "Aisha Balogun",
    email: "aisha@lagosheritage.ng",
    phone: "+234 802 555 0201",
    location: "Victoria Island, Lagos",
    rating: 4.8,
    totalOrders: 143,
    totalRevenue: 4850000,
    joinedAt: new Date("2024-01-15"),
    status: "approved" as const,
    expressSettings: { enabled: true, expressSlaDays: 3, standardSlaDays: 8, feeRate: 0.25, weeklyCap: 6, weeklyInUse: 4, concurrentCap: 3, concurrentInUse: 2 },
    badges: [
      {
        id: "b1",
        type: "verified",
        label: "Verified",
        description: "Identity & business verified",
        awardedAt: new Date("2024-11-01"),
        status: "active" as const,
        source: "manual" as const,
      },
      {
        id: "b2",
        type: "express-specialist",
        label: "Express Specialist",
        description: "On-time rush track record",
        awardedAt: new Date("2024-12-10"),
        status: "active" as const,
        source: "automated" as const,
      },
    ],
  },
  {
    id: "2",
    businessName: "Ibadan Royal Cuts",
    ownerName: "Kunle Adeyemi",
    email: "kunle@royalcuts.ng",
    phone: "+234 803 555 0202",
    location: "Ibadan, Oyo",
    rating: 0,
    totalOrders: 0,
    totalRevenue: 0,
    joinedAt: new Date("2025-01-16"),
    status: "pending" as const,
    expressSettings: { enabled: false, expressSlaDays: 0, standardSlaDays: 10, feeRate: 0, weeklyCap: 0, weeklyInUse: 0, concurrentCap: 0, concurrentInUse: 0 },
    badges: [
      {
        id: "b3",
        type: "professional",
        label: "Professional Tailor",
        description: "Tenure track after onboarding",
        awardedAt: new Date("2025-01-16"),
        status: "pending" as const,
        source: "automated" as const,
      },
    ],
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
            <div className="flex items-center gap-3 text-sm text-muted-foreground mt-1">
              <span className="flex items-center gap-1">
                <Zap className={`h-4 w-4 ${tailor.expressSettings.enabled ? "text-orange-500" : "text-muted-foreground"}`} />
                {tailor.expressSettings.enabled ? `${tailor.expressSettings.expressSlaDays}-day express • ${tailor.expressSettings.weeklyInUse}/${tailor.expressSettings.weeklyCap} slots` : "Express off"}
              </span>
              <Switch checked={tailor.expressSettings.enabled} aria-label="Toggle express" />
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {tailor.badges.map((badge) => {
                const meta = getBadgeMeta(badge)
                const Icon = meta.icon ?? ShieldCheck
                return (
                  <Badge key={`${tailor.id}-${badge.id}`} className={meta.tone}>
                    <Icon className="h-3.5 w-3.5 mr-1" />
                    {meta.label ?? badge.label}
                  </Badge>
                )
              })}
            </div>
            {tailor.status === "approved" && (
              <div className="flex items-center gap-4 text-sm text-muted-foreground mt-2">
                <span>Rating: {tailor.rating}/5</span>
                <span>{tailor.totalOrders} orders</span>
                <span>{formatNaira(tailor.totalRevenue)} revenue</span>
              </div>
            )}
            <p className="text-sm text-muted-foreground">Joined {formatDate(tailor.joinedAt)}</p>
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
                    <DropdownMenuItem>Award / Revoke Badge</DropdownMenuItem>
                    <DropdownMenuItem>Adjust Express Capacity</DropdownMenuItem>
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
