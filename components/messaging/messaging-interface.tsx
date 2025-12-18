"use client"

import type React from "react"

import type { User } from "@/lib/types"
import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Search, Send, Paperclip, ImageIcon } from "lucide-react"
import { CustomerHeader } from "@/components/customer/customer-header"
import { TailorHeader } from "@/components/tailor/tailor-header"
import { AdminHeader } from "@/components/admin/admin-header"

interface MessagingInterfaceProps {
  user: User
}

// Mock conversations
const MOCK_CONVERSATIONS = [
  {
    id: "1",
    otherUser: { name: "Master Tailor Co.", role: "tailor" as const },
    lastMessage: "Your suit is ready for the final fitting!",
    lastMessageTime: new Date("2025-01-18T10:30:00"),
    unread: 2,
    orderId: "ORD-001",
  },
  {
    id: "2",
    otherUser: { name: "John Doe", role: "customer" as const },
    lastMessage: "When can I pick up my order?",
    lastMessageTime: new Date("2025-01-18T09:15:00"),
    unread: 0,
    orderId: "ORD-002",
  },
  {
    id: "3",
    otherUser: { name: "Elite Stitches", role: "tailor" as const },
    lastMessage: "I've sent you the fabric samples",
    lastMessageTime: new Date("2025-01-17T16:45:00"),
    unread: 1,
    orderId: "ORD-003",
  },
]

// Mock messages
const MOCK_MESSAGES = [
  {
    id: "1",
    senderId: "other",
    content: "Hi! I've started working on your custom suit order.",
    timestamp: new Date("2025-01-18T09:00:00"),
  },
  {
    id: "2",
    senderId: "me",
    content: "Great! How long do you think it will take?",
    timestamp: new Date("2025-01-18T09:05:00"),
  },
  {
    id: "3",
    senderId: "other",
    content: "I should have it ready in about 2 weeks. I'll need you to come in for a fitting next Monday.",
    timestamp: new Date("2025-01-18T09:10:00"),
  },
  {
    id: "4",
    senderId: "me",
    content: "Perfect! What time works best for you?",
    timestamp: new Date("2025-01-18T09:15:00"),
  },
  {
    id: "5",
    senderId: "other",
    content: "Your suit is ready for the final fitting!",
    timestamp: new Date("2025-01-18T10:30:00"),
  },
]

export function MessagingInterface({ user }: MessagingInterfaceProps) {
  const [selectedConversation, setSelectedConversation] = useState(MOCK_CONVERSATIONS[0])
  const [messageInput, setMessageInput] = useState("")
  const [searchQuery, setSearchQuery] = useState("")

  function sendMessage(e: React.FormEvent) {
    e.preventDefault()
    if (messageInput.trim()) {
      setMessageInput("")
    }
  }

  const Header = user.role === "customer" ? CustomerHeader : user.role === "tailor" ? TailorHeader : AdminHeader

  return (
    <div className="min-h-screen bg-background">
      <Header user={user} />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Messages</h1>
          <p className="text-muted-foreground">Communicate with customers and tailors</p>
        </div>

        <Card>
          <CardContent className="p-0">
            <div className="grid md:grid-cols-3 h-[600px]">
              {/* Conversations List */}
              <div className="border-r border-border">
                <div className="p-4 border-b border-border">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search conversations..."
                      className="pl-10"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>
                <div className="overflow-y-auto h-[calc(600px-73px)]">
                  {MOCK_CONVERSATIONS.map((conversation) => (
                    <button
                      key={conversation.id}
                      onClick={() => setSelectedConversation(conversation)}
                      className={`w-full p-4 flex items-start gap-3 hover:bg-muted transition-colors border-b border-border ${selectedConversation.id === conversation.id ? "bg-muted" : ""}`}
                    >
                      <Avatar>
                        <AvatarFallback>{conversation.otherUser.name[0]}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 text-left">
                        <div className="flex items-center justify-between mb-1">
                          <p className="font-medium text-sm">{conversation.otherUser.name}</p>
                          {conversation.unread > 0 && (
                            <Badge className="h-5 w-5 flex items-center justify-center p-0 text-xs">
                              {conversation.unread}
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground mb-1">Order #{conversation.orderId}</p>
                        <p className="text-sm text-muted-foreground truncate">{conversation.lastMessage}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {conversation.lastMessageTime.toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Messages Area */}
              <div className="col-span-2 flex flex-col">
                {/* Conversation Header */}
                <div className="p-4 border-b border-border">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-bold">{selectedConversation.otherUser.name}</h3>
                      <p className="text-sm text-muted-foreground">Order #{selectedConversation.orderId}</p>
                    </div>
                    <Button size="sm" variant="outline">
                      View Order
                    </Button>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {MOCK_MESSAGES.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.senderId === "me" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[70%] rounded-lg p-3 ${
                          message.senderId === "me" ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"
                        }`}
                      >
                        <p className="text-sm">{message.content}</p>
                        <p
                          className={`text-xs mt-1 ${message.senderId === "me" ? "text-primary-foreground/70" : "text-muted-foreground"}`}
                        >
                          {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Message Input */}
                <div className="p-4 border-t border-border">
                  <form onSubmit={sendMessage} className="flex items-center gap-2">
                    <Button type="button" size="sm" variant="ghost">
                      <Paperclip className="h-4 w-4" />
                    </Button>
                    <Button type="button" size="sm" variant="ghost">
                      <ImageIcon className="h-4 w-4" />
                    </Button>
                    <Input
                      placeholder="Type your message..."
                      value={messageInput}
                      onChange={(e) => setMessageInput(e.target.value)}
                      className="flex-1"
                    />
                    <Button type="submit" size="sm" className="gap-2">
                      <Send className="h-4 w-4" />
                      Send
                    </Button>
                  </form>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
