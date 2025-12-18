"use client"

import type { User } from "@/lib/types"
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Bell, Check, Trash2, Package, MessageSquare, Star, AlertCircle } from "lucide-react"
import { CustomerHeader } from "@/components/customer/customer-header"
import { TailorHeader } from "@/components/tailor/tailor-header"
import { AdminHeader } from "@/components/admin/admin-header"

interface NotificationsCenterProps {
  user: User
}

const MOCK_NOTIFICATIONS = [
  {
    id: "1",
    type: "order" as const,
    title: "Order Status Update",
    message: "Your order ORD-001 is now in progress",
    read: false,
    link: "/customer/order/ORD-001",
    createdAt: new Date("2025-01-18T10:30:00"),
  },
  {
    id: "2",
    type: "message" as const,
    title: "New Message",
    message: "Master Tailor Co. sent you a message",
    read: false,
    link: "/messages",
    createdAt: new Date("2025-01-18T09:15:00"),
  },
  {
    id: "3",
    type: "review" as const,
    title: "Review Request",
    message: "Please review your completed order ORD-002",
    read: true,
    link: "/customer/order/ORD-002",
    createdAt: new Date("2025-01-17T14:20:00"),
  },
  {
    id: "4",
    type: "system" as const,
    title: "Welcome to Haib Tailor",
    message: "Complete your profile to get started",
    read: true,
    link: "/customer/profile",
    createdAt: new Date("2025-01-15T08:00:00"),
  },
]

export function NotificationsCenter({ user }: NotificationsCenterProps) {
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS)
  const [filter, setFilter] = useState<"all" | "unread">("all")

  const Header = user.role === "customer" ? CustomerHeader : user.role === "tailor" ? TailorHeader : AdminHeader

  const filteredNotifications = notifications.filter((n) => (filter === "unread" ? !n.read : true))

  const unreadCount = notifications.filter((n) => !n.read).length

  function markAsRead(id: string) {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)))
  }

  function markAllAsRead() {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
  }

  function deleteNotification(id: string) {
    setNotifications((prev) => prev.filter((n) => n.id !== id))
  }

  function getIcon(type: string) {
    switch (type) {
      case "order":
        return <Package className="h-5 w-5" />
      case "message":
        return <MessageSquare className="h-5 w-5" />
      case "review":
        return <Star className="h-5 w-5" />
      case "system":
        return <AlertCircle className="h-5 w-5" />
      default:
        return <Bell className="h-5 w-5" />
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Header user={user} />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Notifications</h1>
            <p className="text-muted-foreground">Stay updated with your orders and messages</p>
          </div>
          {unreadCount > 0 && (
            <Button onClick={markAllAsRead} variant="outline">
              <Check className="h-4 w-4 mr-2" />
              Mark all as read
            </Button>
          )}
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                All Notifications
                {unreadCount > 0 && (
                  <Badge variant="default" className="ml-2">
                    {unreadCount} new
                  </Badge>
                )}
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs value={filter} onValueChange={(v) => setFilter(v as "all" | "unread")}>
              <TabsList className="mb-4">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="unread">
                  Unread {unreadCount > 0 && <Badge className="ml-2">{unreadCount}</Badge>}
                </TabsTrigger>
              </TabsList>

              <TabsContent value={filter} className="space-y-2">
                {filteredNotifications.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <Bell className="h-12 w-12 mx-auto mb-3 opacity-20" />
                    <p>No notifications to display</p>
                  </div>
                ) : (
                  filteredNotifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`flex items-start gap-4 p-4 rounded-lg border ${!notification.read ? "bg-muted/50 border-primary/20" : "border-border"}`}
                    >
                      <div className={`p-2 rounded-full ${!notification.read ? "bg-primary/10" : "bg-muted"}`}>
                        {getIcon(notification.type)}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-medium">{notification.title}</h4>
                              {!notification.read && <Badge variant="default">New</Badge>}
                            </div>
                            <p className="text-sm text-muted-foreground mb-2">{notification.message}</p>
                            <p className="text-xs text-muted-foreground">{notification.createdAt.toLocaleString()}</p>
                          </div>

                          <div className="flex items-center gap-2">
                            {!notification.read && (
                              <Button size="sm" variant="ghost" onClick={() => markAsRead(notification.id)}>
                                <Check className="h-4 w-4" />
                              </Button>
                            )}
                            <Button size="sm" variant="ghost" onClick={() => deleteNotification(notification.id)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>

                        {notification.link && (
                          <Button size="sm" variant="outline" className="mt-2 bg-transparent">
                            View Details
                          </Button>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
