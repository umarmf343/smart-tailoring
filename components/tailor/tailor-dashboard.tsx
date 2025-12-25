"use client"

import type { User } from "@/lib/types"
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TailorHeader } from "./tailor-header"
import { TailorOrders } from "./tailor-orders"
import { TailorProfile } from "./tailor-profile"
import { TailorAnalytics } from "./tailor-analytics"
import { TailorReviews } from "./tailor-reviews"
import { Package, DollarSign, Star, TrendingUp, Zap, BadgeCheck } from "lucide-react"
import { formatNaira } from "@/lib/currency"

interface TailorDashboardProps {
  user: User
}

export function TailorDashboard({ user }: TailorDashboardProps) {
  const [activeTab, setActiveTab] = useState("overview")

  return (
    <div className="min-h-screen bg-background">
      <TailorHeader user={user} />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Tailor Dashboard</h1>
          <p className="text-muted-foreground">Manage your business and orders</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Active Orders</CardTitle>
                  <Package className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">8</div>
                  <p className="text-xs text-muted-foreground">4 in progress, 4 pending</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{formatNaira(345000)}</div>
                  <p className="text-xs text-muted-foreground">+12% from last month</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
                  <Star className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">4.8</div>
                  <p className="text-xs text-muted-foreground">156 reviews</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Completed Orders</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">143</div>
                  <p className="text-xs text-muted-foreground">All time</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Express Readiness</CardTitle>
                  <Zap className="h-4 w-4 text-orange-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">3 / 5</div>
                  <p className="text-xs text-muted-foreground">Express slots in use this week</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Badges</CardTitle>
                  <BadgeCheck className="h-4 w-4 text-emerald-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">3</div>
                  <p className="text-xs text-muted-foreground">Verified • Express Specialist • Top Rated</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Express & Badge Highlights</CardTitle>
              </CardHeader>
              <CardContent className="grid md:grid-cols-3 gap-4 text-sm text-muted-foreground">
                <div className="p-3 rounded-lg border border-border">
                  <p className="font-semibold text-foreground mb-1">SLA discipline</p>
                  <p>Mid-progress reminders and ready-for-pickup deadlines are enabled for express jobs.</p>
                </div>
                <div className="p-3 rounded-lg border border-border">
                  <p className="font-semibold text-foreground mb-1">Capacity guardrails</p>
                  <p>Auto-block new express intake when weekly or concurrent caps are full.</p>
                </div>
                <div className="p-3 rounded-lg border border-border">
                  <p className="font-semibold text-foreground mb-1">Badge momentum</p>
                  <p>Keep response time & rating high to retain Top-Rated and Express Specialist renewals.</p>
                </div>
              </CardContent>
            </Card>

            <TailorOrders limit={5} />
          </TabsContent>

          <TabsContent value="orders">
            <TailorOrders />
          </TabsContent>

          <TabsContent value="profile">
            <TailorProfile />
          </TabsContent>

          <TabsContent value="reviews">
            <TailorReviews />
          </TabsContent>

          <TabsContent value="analytics">
            <TailorAnalytics />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
