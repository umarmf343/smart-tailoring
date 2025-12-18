"use client"

import type { User } from "@/lib/types"
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AdminHeader } from "./admin-header"
import { AdminUsers } from "./admin-users"
import { AdminTailors } from "./admin-tailors"
import { AdminOrders } from "./admin-orders"
import { AdminAnalytics } from "./admin-analytics"
import { AdminReviews } from "./admin-reviews"
import { Users, Package, DollarSign, AlertTriangle } from "lucide-react"
import { MeasurementOversight } from "./measurement-oversight"

interface AdminDashboardProps {
  user: User
}

export function AdminDashboard({ user }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState("overview")

  return (
    <div className="min-h-screen bg-background">
      <AdminHeader user={user} />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage platform operations and analytics</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="customers">Customers</TabsTrigger>
            <TabsTrigger value="tailors">Tailors</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">1,247</div>
                  <p className="text-xs text-muted-foreground">985 customers, 262 tailors</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Active Orders</CardTitle>
                  <Package className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">348</div>
                  <p className="text-xs text-muted-foreground">156 pending approval</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Platform Revenue</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">$89,420</div>
                  <p className="text-xs text-muted-foreground">+15.3% from last month</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Pending Approvals</CardTitle>
                  <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">12</div>
                  <p className="text-xs text-muted-foreground">New tailor applications</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { user: "John Doe", action: "placed an order", time: "2 minutes ago" },
                      { user: "Elite Stitches", action: "completed an order", time: "15 minutes ago" },
                      { user: "Jane Smith", action: "left a review", time: "1 hour ago" },
                      { user: "Heritage Tailors", action: "updated profile", time: "2 hours ago" },
                    ].map((activity, i) => (
                      <div key={i} className="flex items-center gap-3 text-sm">
                        <div className="h-2 w-2 rounded-full bg-primary" />
                        <div className="flex-1">
                          <span className="font-medium">{activity.user}</span> {activity.action}
                        </div>
                        <span className="text-muted-foreground">{activity.time}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Platform Health</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">Order Fulfillment Rate</span>
                        <span className="text-sm font-bold">94%</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div className="bg-green-600 h-2 rounded-full" style={{ width: "94%" }} />
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">Customer Satisfaction</span>
                        <span className="text-sm font-bold">4.7/5</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div className="bg-yellow-500 h-2 rounded-full" style={{ width: "94%" }} />
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">Tailor Response Time</span>
                        <span className="text-sm font-bold">2.3 hrs</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div className="bg-blue-600 h-2 rounded-full" style={{ width: "85%" }} />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <MeasurementOversight />
          </TabsContent>

          <TabsContent value="customers">
            <AdminUsers />
          </TabsContent>

          <TabsContent value="tailors">
            <AdminTailors />
          </TabsContent>

          <TabsContent value="orders">
            <AdminOrders />
          </TabsContent>

          <TabsContent value="reviews">
            <AdminReviews />
          </TabsContent>

          <TabsContent value="analytics">
            <AdminAnalytics />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
