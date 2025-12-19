"use client"

import Link from "next/link"
import { useState } from "react"
import { Scissors, ArrowLeft, BookmarkCheck, Palette, Smartphone } from "lucide-react"

import { DesignGallery } from "@/components/design-gallery"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"

const savedLooks = [
  {
    title: "Boardroom staple",
    note: "Navy two-piece with soft shoulders and peak lapels",
    badge: "Formal",
  },
  {
    title: "Weekend set",
    note: "Breathable linen co-ord with coconut buttons",
    badge: "Casual",
  },
]

const inspirationKits = [
  {
    label: "Palette swaps",
    description: "Invite the tailor to propose color stories on top of your selected design cards.",
  },
  {
    label: "Mobile ready",
    description: "Tap-to-expand cards keep the gallery compact on phones while preserving detail shots.",
  },
  {
    label: "Feedback loops",
    description: "Bookmark, react, and send to your chat thread without leaving the gallery shell.",
  },
]

export default function DesignsPage() {
  const [activeView, setActiveView] = useState("templates")

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border/70 bg-background/80 backdrop-blur">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-3">
            <Link href="/" className="flex items-center gap-2">
              <Scissors className="h-6 w-6" />
              <span className="text-xl font-bold">Haib Tailor</span>
            </Link>
            <Link href="/customer/dashboard">
              <Button variant="outline" className="gap-2 bg-transparent">
                <ArrowLeft className="h-4 w-4" />
                Back to Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Card className="rounded-3xl border-border/80 bg-background/70 shadow-xl">
          <CardHeader className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="space-y-1">
              <CardTitle className="text-3xl">Design space</CardTitle>
              <CardDescription>Toggle between templates, your saved looks, and quick inspiration tools.</CardDescription>
            </div>
            <TabsList className="w-full justify-start overflow-x-auto md:w-auto">
              <TabsTrigger value="templates" onClick={() => setActiveView("templates")}>
                Templates
              </TabsTrigger>
              <TabsTrigger value="saved" onClick={() => setActiveView("saved")}>
                Saved looks
              </TabsTrigger>
              <TabsTrigger value="kits" onClick={() => setActiveView("kits")}>
                Inspiration kits
              </TabsTrigger>
            </TabsList>
          </CardHeader>

          <CardContent>
            <Tabs value={activeView} onValueChange={setActiveView} className="space-y-6">
              <TabsContent value="templates" className="space-y-4 animate-in fade-in slide-in-from-bottom duration-500">
                <div className="rounded-2xl border border-dashed border-primary/40 bg-primary/5 p-4 text-sm text-muted-foreground">
                  Tap into the gallery without overwhelming the page—cards open within this workspace for a calm, app-like
                  feel on mobile.
                </div>
                <DesignGallery />
              </TabsContent>

              <TabsContent value="saved" className="space-y-4 animate-in fade-in slide-in-from-bottom duration-500">
                <div className="grid gap-4 sm:grid-cols-2">
                  {savedLooks.map((look) => (
                    <Card key={look.title} className="border-dashed shadow-sm">
                      <CardHeader className="flex items-center justify-between">
                        <div className="space-y-1">
                          <CardTitle className="text-lg">{look.title}</CardTitle>
                          <CardDescription>{look.note}</CardDescription>
                        </div>
                        <Badge variant="secondary">{look.badge}</Badge>
                      </CardHeader>
                      <CardContent className="flex flex-wrap gap-2 text-sm text-muted-foreground">
                        <span className="rounded-full bg-muted px-3 py-1">Pinned</span>
                        <span className="rounded-full bg-muted px-3 py-1">Share to chat</span>
                        <span className="rounded-full bg-muted px-3 py-1">Send to tailor</span>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="kits" className="space-y-4 animate-in fade-in slide-in-from-bottom duration-500">
                <div className="grid gap-4 md:grid-cols-3">
                  {inspirationKits.map((kit, index) => (
                    <Card
                      key={kit.label}
                      className="h-full border-dashed bg-muted/60 shadow-sm"
                      style={{ animationDelay: `${index * 80}ms` }}
                    >
                      <CardHeader>
                        <div className="flex items-center gap-2 text-sm font-semibold">
                          {index === 0 ? <Palette className="h-4 w-4 text-primary" /> : null}
                          {index === 1 ? <Smartphone className="h-4 w-4 text-primary" /> : null}
                          {index === 2 ? <BookmarkCheck className="h-4 w-4 text-primary" /> : null}
                          <span>{kit.label}</span>
                        </div>
                        <CardDescription>{kit.description}</CardDescription>
                      </CardHeader>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
