"use client"

import type { User } from "@/lib/types"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CustomerHeader } from "./customer-header"
import { OrderHistory } from "./order-history"
import { MeasurementManager } from "./measurement-manager"
import { SavedTailors } from "./saved-tailors"
import { WalletManager } from "./wallet-manager"
import { Search, Package, Ruler, Users, Wallet } from "lucide-react"
import Link from "next/link"
import { MEASUREMENT_LIBRARY, generateMeasurementAlerts } from "@/lib/measurement-system"
import { formatNaira } from "@/lib/currency"

interface CustomerDashboardProps {
  user: User
}

export function CustomerDashboard({ user }: CustomerDashboardProps) {
  const [activeTab, setActiveTab] = useState("overview")
  const measurementProfiles = MEASUREMENT_LIBRARY
  const verifiedProfiles = measurementProfiles.filter((profile) => profile.status === "verified").length
  const flaggedProfiles = measurementProfiles.filter((profile) => generateMeasurementAlerts(profile).length > 0).length

  return (
    <div className="min-h-screen bg-background">
      <CustomerHeader user={user} />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Welcome back, {user.name}</h1>
          <p className="text-muted-foreground">Manage your orders, measurements, and find tailors</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="measurements">Measurements</TabsTrigger>
            <TabsTrigger value="tailors">Saved Tailors</TabsTrigger>
            <TabsTrigger value="wallet">Wallet</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Active Orders</CardTitle>
                  <Package className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">3</div>
                  <p className="text-xs text-muted-foreground">2 in progress</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Measurements</CardTitle>
                  <Ruler className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{measurementProfiles.length}</div>
                  <p className="text-xs text-muted-foreground">
                    {verifiedProfiles} verified • {flaggedProfiles} flagged for review
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Saved Tailors</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">5</div>
                  <p className="text-xs text-muted-foreground">Favorites</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Wallet Balance</CardTitle>
                  <Wallet className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{formatNaira(250000)}</div>
                  <p className="text-xs text-muted-foreground">Available funds</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Get started with your next order</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-4">
                <Link href="/customer/search">
                  <Button className="gap-2">
                    <Search className="h-4 w-4" />
                    Find Tailors
                  </Button>
                </Link>
                <Link href="/customer/measurements">
                  <Button variant="outline" className="gap-2 bg-transparent">
                    <Ruler className="h-4 w-4" />
                    Add Measurements
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <OrderHistory limit={5} />
          </TabsContent>

          <TabsContent value="orders">
            <OrderHistory />
          </TabsContent>

          <TabsContent value="measurements">
            <MeasurementManager />
          </TabsContent>

          <TabsContent value="tailors">
            <SavedTailors />
          </TabsContent>

          <TabsContent value="wallet">
            <WalletManager />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
