"use client"

import type { User } from "@/lib/types"
import { CustomerHeader } from "./customer-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle, MessageCircle, Package } from "lucide-react"
import Link from "next/link"

interface OrderConfirmationProps {
  user: User
}

export function OrderConfirmation({ user }: OrderConfirmationProps) {
  return (
    <div className="min-h-screen bg-background">
      <CustomerHeader user={user} />

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <div className="h-16 w-16 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                  <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
                </div>
              </div>
              <CardTitle className="text-2xl">Order Placed Successfully!</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center text-muted-foreground">
                <p>Your order has been sent to the tailor for confirmation.</p>
                <p>You'll receive updates via notifications and messages.</p>
              </div>

              <div className="bg-muted p-6 rounded-lg space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Order Number:</span>
                  <span className="font-medium">ORD-004</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tailor:</span>
                  <span className="font-medium">Master Tailor Co.</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Service:</span>
                  <span className="font-medium">Custom Suit</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Paid:</span>
                  <span className="font-bold text-lg">$450</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Estimated Delivery:</span>
                  <span className="font-medium">February 1, 2025</span>
                </div>
              </div>

              <div className="space-y-3">
                <Link href="/customer/dashboard" className="block">
                  <Button className="w-full gap-2">
                    <Package className="h-4 w-4" />
                    View Order Details
                  </Button>
                </Link>
                <Link href="/messages" className="block">
                  <Button variant="outline" className="w-full gap-2 bg-transparent">
                    <MessageCircle className="h-4 w-4" />
                    Message Tailor
                  </Button>
                </Link>
              </div>

              <div className="text-center text-sm text-muted-foreground">
                <p>Questions about your order?</p>
                <p>Contact the tailor directly through our messaging system.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
