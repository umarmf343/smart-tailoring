"use client"

import Link from "next/link"
import type React from "react"
import { useMemo, useState } from "react"
import {
  ArrowRight,
  BadgeCheck,
  BarChart3,
  Clock3,
  CreditCard,
  LayoutPanelLeft,
  Menu,
  MessageCircle,
  ShieldCheck,
  Sparkles,
  Scissors,
  Star,
  Users,
  Wallet,
} from "lucide-react"

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Spinner } from "@/components/ui/spinner"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"

const navSections = [
  { value: "overview", label: "Overview", icon: Sparkles, blurb: "A calm, guided workspace shell." },
  { value: "orders", label: "Orders", icon: Clock3, blurb: "Keep the pipeline tidy and mobile-ready." },
  { value: "tailors", label: "Tailors", icon: Scissors, blurb: "Profile, capacity, and reviews at a tap." },
  { value: "payments", label: "Payments", icon: CreditCard, blurb: "Wallets, payouts, and security queues." },
  { value: "reviews", label: "Reviews", icon: Star, blurb: "Social proof with progressive disclosure." },
] as const

type SectionKey = (typeof navSections)[number]["value"]

const defaultSectionTabs: Record<SectionKey, string> = {
  overview: "workspace",
  orders: "details",
  tailors: "profile",
  payments: "wallet",
  reviews: "trust",
}

const heroStats = [
  { label: "Guided flows", value: "6", hint: "Panels grouped into tabs & accordions" },
  { label: "Mobile ready", value: "100%", hint: "Stacked layouts + animated menus" },
  { label: "Focus mode", value: "1 section", hint: "Only one area visible at a time" },
]

const orderTimeline = [
  {
    title: "Measurements locked",
    detail: "Customers confirm sizing and fabric picks with prompt-level hints and validation.",
    accent: "Step 01",
  },
  {
    title: "Fittings scheduled",
    detail: "Calendar slots and locations are attached to the order so tailors cannot miss a beat.",
    accent: "Step 02",
  },
  {
    title: "In-progress review",
    detail: "Approvals, mood boards, and chat all live inside a single collapsible accordion.",
    accent: "Step 03",
  },
  {
    title: "Delivery & payouts",
    detail: "Payments unlock only after courier scans and both parties acknowledge drop-off.",
    accent: "Step 04",
  },
]

const paymentEvents = [
  {
    title: "Wallet top-up",
    detail: "Split balances into materials, service, and gratuity with one swipe on mobile.",
  },
  {
    title: "Escrow release",
    detail: "Platform automatically animates a spinner while approval and fraud checks run.",
  },
  {
    title: "Tailor payout",
    detail: "Admins get a compact ledger with tabs for settlements, holds, and disputes.",
  },
]

export default function HomePage() {
  const [activeSection, setActiveSection] = useState<SectionKey>("overview")
  const [sectionTabs, setSectionTabs] = useState<Record<SectionKey, string>>(() => ({ ...defaultSectionTabs }))
  const [navOpen, setNavOpen] = useState(false)

  const activeBlurb = useMemo(() => navSections.find((section) => section.value === activeSection)?.blurb ?? "", [
    activeSection,
  ])

  const handleSectionChange = (value: SectionKey) => {
    setActiveSection(value)
    setNavOpen(false)
  }

  const handleTabChange = (section: SectionKey, value: string) => {
    setSectionTabs((previous) => ({ ...previous, [section]: value }))
  }

  const renderOverview = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom duration-300">
      <Tabs value={sectionTabs.overview} onValueChange={(value) => handleTabChange("overview", value)}>
        <TabsList className="w-full justify-start overflow-x-auto">
          <TabsTrigger value="workspace">Workspace</TabsTrigger>
          <TabsTrigger value="personas">Personas</TabsTrigger>
          <TabsTrigger value="health">Platform health</TabsTrigger>
        </TabsList>
        <TabsContent value="workspace" className="space-y-3">
          <div className="grid gap-4 lg:grid-cols-3">
            {["One tap per area", "Animated transitions", "No more endless scroll"].map((item) => (
              <Card
                key={item}
                className="border-dashed bg-muted/70 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                <CardHeader>
                  <CardTitle className="text-lg">{item}</CardTitle>
                  <CardDescription className="text-sm text-muted-foreground">
                    Every section slides in with Tailwind motion and hides the others automatically.
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle>Compact workspace</CardTitle>
                <CardDescription>
                  Vertical navigation locks to the left on desktop and transforms into a floating drawer on phones.
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-xl border border-border/70 bg-background p-4 text-sm">
                  <p className="font-semibold">Adaptive nav</p>
                  <p className="text-muted-foreground">Tap the menu on mobile to reveal sections with a slide-in.</p>
                </div>
                <div className="rounded-xl border border-border/70 bg-background p-4 text-sm">
                  <p className="font-semibold">Tap-friendly tabs</p>
                  <p className="text-muted-foreground">Customer, tailor, and admin moments are tucked into tabs.</p>
                </div>
              </CardContent>
            </Card>
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle>Motion defaults</CardTitle>
                <CardDescription>Fade + slide transitions create an app-like feel without extra CSS.</CardDescription>
              </CardHeader>
              <CardContent className="flex items-center gap-3 text-sm text-muted-foreground">
                <Spinner className="text-primary" />
                Loading and state changes animate with Tailwind utilities like
                <code className="rounded bg-muted px-2 py-1">animate-spin</code> and
                <code className="rounded bg-muted px-2 py-1">transition-all</code>.
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="personas" className="space-y-3">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {["Customers", "Tailors", "Admins"].map((persona) => (
              <Card key={persona} className="bg-background/80 shadow-sm">
                <CardHeader className="space-y-2">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Badge variant="secondary" className="rounded-full border border-dashed">
                      <Users className="h-3.5 w-3.5" />
                      Persona
                    </Badge>
                    {persona}
                  </CardTitle>
                  <CardDescription>
                    Dedicated tabs keep each persona focused—payments, reviews, and tasks never overlap.
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="health" className="space-y-4">
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="availability" className="border-border/60">
              <AccordionTrigger className="text-left text-base">Availability & uptime</AccordionTrigger>
              <AccordionContent className="space-y-2 text-sm text-muted-foreground">
                <p>
                  Cards now load lazily as you switch sections so the landing shell stays quick on mobile networks.
                </p>
                <p className="text-foreground">Animations rely on Tailwind utilities—no custom keyframes needed.</p>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="performance" className="border-border/60">
              <AccordionTrigger className="text-left text-base">Performance cues</AccordionTrigger>
              <AccordionContent className="space-y-2 text-sm text-muted-foreground">
                <p>Hover scaling and focus rings highlight interactive elements for both mouse and touch users.</p>
                <p className="text-foreground">Progressive disclosure keeps DOM weight low by hiding inactive panes.</p>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
          <div className="grid gap-3 sm:grid-cols-3">
            {heroStats.map((stat) => (
              <Card key={stat.label} className="bg-muted/50 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-2xl">{stat.value}</CardTitle>
                  <CardDescription>{stat.label}</CardDescription>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">{stat.hint}</CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )

  const renderOrders = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-right duration-300">
      <Tabs value={sectionTabs.orders} onValueChange={(value) => handleTabChange("orders", value)}>
        <TabsList className="w-full justify-start overflow-x-auto">
          <TabsTrigger value="details">Order details</TabsTrigger>
          <TabsTrigger value="reviews">Reviews</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
        </TabsList>
        <TabsContent value="details" className="space-y-4">
          <div className="grid gap-4 lg:grid-cols-[1.3fr_0.7fr]">
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle>Pipeline snapshot</CardTitle>
                <CardDescription>Only one accordion panel opens at a time to keep updates compact.</CardDescription>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible>
                  {orderTimeline.map((item) => (
                    <AccordionItem key={item.title} value={item.title} className="border-border/70">
                      <AccordionTrigger className="text-left">
                        <div className="flex items-center gap-3 text-left">
                          <Badge variant="outline" className="rounded-full border-dashed text-xs">
                            {item.accent}
                          </Badge>
                          <span className="font-medium">{item.title}</span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="space-y-2 text-sm text-muted-foreground">
                        <p>{item.detail}</p>
                        <div className="rounded-lg bg-muted/60 p-3 text-xs text-foreground">
                          Tailwind classes like
                          <code className="mx-1 rounded bg-background px-1.5 py-0.5">transition-all duration-300</code>
                          animate each reveal.
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
            <Card className="shadow-sm">
              <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <CardTitle>Live status</CardTitle>
                  <CardDescription>Hover to see micro-interactions; tap to expand on mobile.</CardDescription>
                </div>
                <Badge variant="secondary" className="gap-1 border-dashed">
                  <LayoutPanelLeft className="h-3.5 w-3.5" />
                  Guided
                </Badge>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-muted-foreground">
                <div className="flex items-center justify-between rounded-xl border border-border/70 bg-background p-3">
                  <div>
                    <p className="text-foreground">Hannah · Silk Suit</p>
                    <p className="text-xs text-muted-foreground">Fitting scheduled · Friday 4:30 PM</p>
                  </div>
                  <Badge className="bg-primary text-primary-foreground">VIP care</Badge>
                </div>
                <div className="flex items-center gap-3 rounded-xl border border-border/70 bg-muted/70 p-3">
                  <Spinner className="text-primary" />
                  <div>
                    <p className="text-foreground">Loading next milestone…</p>
                    <p className="text-xs text-muted-foreground">Animated spinner uses Tailwind <code>animate-spin</code>.</p>
                  </div>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-lg border border-border/70 bg-background p-3 text-foreground">
                    <p className="text-sm font-semibold">Secure approvals</p>
                    <p className="text-xs text-muted-foreground">Messages + files sit behind the timeline accordion.</p>
                  </div>
                  <div className="rounded-lg border border-border/70 bg-background p-3 text-foreground">
                    <p className="text-sm font-semibold">Compact checkout</p>
                    <p className="text-xs text-muted-foreground">Customers toggle payment details via tabs.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="reviews" className="space-y-3">
          <div className="grid gap-4 md:grid-cols-2">
            {["Fabric quality", "Punctuality", "Communication", "Fit satisfaction"].map((item) => (
              <Card key={item} className="border-dashed bg-background/70 shadow-sm">
                <CardHeader className="space-y-1">
                  <CardTitle className="text-lg">{item}</CardTitle>
                  <CardDescription>Summaries stay short; tap for more context.</CardDescription>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  Reviews roll up into a tab instead of stretching down the page.
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="payments" className="space-y-3">
          <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle>Order payments</CardTitle>
                <CardDescription>Wallet, escrow, and tips live in a single compact tab.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-muted-foreground">
                <div className="flex items-center gap-3 rounded-lg border border-border/70 bg-background p-3">
                  <Wallet className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-foreground">Split across milestones</p>
                    <p className="text-xs text-muted-foreground">Deposits, fittings, and delivery approvals animate in.</p>
                  </div>
                </div>
                <Accordion type="single" collapsible>
                  {paymentEvents.map((event) => (
                    <AccordionItem key={event.title} value={event.title} className="border-border/70">
                      <AccordionTrigger className="text-left text-sm font-semibold">{event.title}</AccordionTrigger>
                      <AccordionContent className="text-xs text-muted-foreground">{event.detail}</AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle>Payment status</CardTitle>
                <CardDescription>Hover or tap rows to reveal actions.</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-3 text-sm text-muted-foreground">
                <div className="flex items-center justify-between rounded-lg border border-border/70 bg-muted/60 p-3 transition-all duration-200 hover:-translate-y-0.5 hover:shadow">
                  <div>
                    <p className="text-foreground">Escrow hold</p>
                    <p className="text-xs text-muted-foreground">Release after fitting confirmation.</p>
                  </div>
                  <Badge variant="outline" className="border-dashed">$240</Badge>
                </div>
                <div className="flex items-center justify-between rounded-lg border border-border/70 bg-muted/60 p-3 transition-all duration-200 hover:-translate-y-0.5 hover:shadow">
                  <div>
                    <p className="text-foreground">Tailor payout</p>
                    <p className="text-xs text-muted-foreground">Queued for same-day processing.</p>
                  </div>
                  <Badge variant="outline" className="border-dashed">$460</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )

  const renderTailors = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-left duration-300">
      <Tabs value={sectionTabs.tailors} onValueChange={(value) => handleTabChange("tailors", value)}>
        <TabsList className="w-full justify-start overflow-x-auto">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="capacity">Capacity</TabsTrigger>
          <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
        </TabsList>
        <TabsContent value="profile" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle>Service card</CardTitle>
                <CardDescription>Tap-to-expand panels keep bios short and readable.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-muted-foreground">
                <div className="rounded-lg border border-border/70 bg-background p-3">
                  <p className="text-foreground">Esa Menswear</p>
                  <p className="text-xs text-muted-foreground">Express · 3 day turnaround</p>
                </div>
                <p>Accreditations, locations, and messaging actions live in accordions inside this tab.</p>
              </CardContent>
            </Card>
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle>Contact + safety</CardTitle>
                <CardDescription>Verified badges animate on hover for reassurance.</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-3 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <BadgeCheck className="h-4 w-4 text-primary" />
                  <span>Identity & workshop verified</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-primary" />
                  <span>Secure messaging shielded by platform policies.</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="capacity" className="space-y-4">
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle>Capacity planner</CardTitle>
              <CardDescription>
                Orders, fittings, and pickups stack vertically on mobile; desktop shows them in two columns.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-3 sm:grid-cols-3">
              {["New orders", "Fittings", "Ready for delivery"].map((item) => (
                <div
                  key={item}
                  className="rounded-lg border border-border/70 bg-muted/60 p-3 text-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md"
                >
                  <p className="text-foreground">{item}</p>
                  <p className="text-xs text-muted-foreground">Auto-balanced across the week.</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="portfolio" className="space-y-4">
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle>Showcase</CardTitle>
              <CardDescription>Accordion reveals fabric, lining, and inspiration notes.</CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible>
                {["Evening wear", "Office staples", "Wedding party"].map((category) => (
                  <AccordionItem key={category} value={category} className="border-border/70">
                    <AccordionTrigger className="text-left">{category}</AccordionTrigger>
                    <AccordionContent className="text-sm text-muted-foreground">
                      Cards stack into a carousel on smaller screens and fade on switch.
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )

  const renderPayments = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom duration-300">
      <Tabs value={sectionTabs.payments} onValueChange={(value) => handleTabChange("payments", value)}>
        <TabsList className="w-full justify-start overflow-x-auto">
          <TabsTrigger value="wallet">Wallet</TabsTrigger>
          <TabsTrigger value="payouts">Payouts</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>
        <TabsContent value="wallet" className="space-y-4">
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle>Wallet overview</CardTitle>
              <CardDescription>Collapsible cards declutter currency balances and ledger details.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-lg border border-border/70 bg-background p-3">
                <p className="text-sm font-semibold">Available</p>
                <p className="text-2xl font-bold">$820</p>
                <p className="text-xs text-muted-foreground">Instant spend</p>
              </div>
              <div className="rounded-lg border border-border/70 bg-background p-3">
                <p className="text-sm font-semibold">On hold</p>
                <p className="text-2xl font-bold">$240</p>
                <p className="text-xs text-muted-foreground">Awaiting delivery check</p>
              </div>
              <div className="rounded-lg border border-border/70 bg-background p-3">
                <p className="text-sm font-semibold">Rewards</p>
                <p className="text-2xl font-bold">$65</p>
                <p className="text-xs text-muted-foreground">Loyalty perks</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="payouts" className="space-y-4">
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle>Payout queue</CardTitle>
              <CardDescription>Each payout row animates on hover with a compact action bar.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex flex-wrap items-center gap-3 rounded-lg border border-border/70 bg-muted/60 p-3">
                <Spinner className="text-primary" />
                <div>
                  <p className="text-foreground">Processing tailor settlement</p>
                  <p className="text-xs text-muted-foreground">Queued · slide-in from left when selected</p>
                </div>
              </div>
              <div className="grid gap-3 md:grid-cols-2">
                <div className="rounded-lg border border-border/70 bg-background p-3 transition-all duration-200 hover:-translate-y-1 hover:shadow">
                  <p className="text-sm font-semibold">Esa Menswear</p>
                  <p className="text-xs text-muted-foreground">$460 · arriving today</p>
                </div>
                <div className="rounded-lg border border-border/70 bg-background p-3 transition-all duration-200 hover:-translate-y-1 hover:shadow">
                  <p className="text-sm font-semibold">Greta Atelier</p>
                  <p className="text-xs text-muted-foreground">$320 · bank transfer</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="security" className="space-y-4">
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle>Protection</CardTitle>
              <CardDescription>Tabs and accordions hide sensitive information until requested.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-3 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-primary" />
                <span>PCI-ready checkouts with staged confirmation prompts.</span>
              </div>
              <div className="flex items-center gap-2">
                <MessageCircle className="h-4 w-4 text-primary" />
                <span>Dispute resolution is nested in a dedicated tab.</span>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )

  const renderReviews = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-top duration-300">
      <Tabs value={sectionTabs.reviews} onValueChange={(value) => handleTabChange("reviews", value)}>
        <TabsList className="w-full justify-start overflow-x-auto">
          <TabsTrigger value="trust">Trust markers</TabsTrigger>
          <TabsTrigger value="feedback">Feedback</TabsTrigger>
          <TabsTrigger value="actions">Actions</TabsTrigger>
        </TabsList>
        <TabsContent value="trust" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            {["Verified tailors", "Escrowed payments", "Responsive support"].map((item) => (
              <Card
                key={item}
                className="border-dashed bg-background/80 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
              >
                <CardHeader>
                  <CardTitle className="text-lg">{item}</CardTitle>
                  <CardDescription>Concise badges reduce noise on mobile.</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="feedback" className="space-y-4">
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle>Customer voice</CardTitle>
              <CardDescription>Accordion breaks down the journey without stretching the page.</CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible>
                {["Discovery", "Order creation", "Delivery"].map((stage) => (
                  <AccordionItem key={stage} value={stage} className="border-border/70">
                    <AccordionTrigger className="text-left">{stage}</AccordionTrigger>
                    <AccordionContent className="text-sm text-muted-foreground">
                      Reviews and tips display only when expanded, helping new users stay focused.
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="actions" className="space-y-4">
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle>Follow-ups</CardTitle>
              <CardDescription>Hover effects scale buttons for quick actions.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-3">
              <Button className="transition-all hover:scale-105" variant="secondary">
                Request new review
              </Button>
              <Button className="transition-all hover:scale-105" variant="outline">
                Resolve dispute
              </Button>
              <Button className="transition-all hover:scale-105">
                Share highlight reel
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )

  const sectionContent: Record<SectionKey, React.ReactNode> = {
    overview: renderOverview(),
    orders: renderOrders(),
    tailors: renderTailors(),
    payments: renderPayments(),
    reviews: renderReviews(),
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-background via-white to-muted text-foreground">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-[-10%] h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-primary/10 blur-[140px]" />
        <div className="absolute right-[8%] top-[18%] h-56 w-56 rounded-full bg-secondary/60 blur-3xl" />
        <div className="absolute left-[6%] top-[45%] h-72 w-72 rounded-full bg-muted/80 blur-3xl" />
      </div>

      <header className="sticky top-0 z-20 border-b border-border/60 bg-background/70 backdrop-blur-xl">
        <div className="container mx-auto flex items-center justify-between px-4 py-4">
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <Scissors className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Smart tailoring</p>
              <h1 className="text-lg font-semibold">Haib Tailor</h1>
            </div>
          </div>

          <nav className="hidden items-center gap-2 text-sm font-medium md:flex">
            {navSections.map((section) => (
              <Button
                key={section.value}
                variant={activeSection === section.value ? "secondary" : "ghost"}
                className="rounded-lg px-3 py-2 transition-all hover:scale-105"
                onClick={() => handleSectionChange(section.value)}
              >
                {section.label}
              </Button>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <Link href="/auth/login">
              <Button variant="ghost" className="hover:scale-105">
                Log in
              </Button>
            </Link>
            <Link href="/auth/signup">
              <Button className="gap-2 hover:scale-105">
                Start free
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Button variant="secondary" size="icon" className="md:hidden" onClick={() => setNavOpen(true)}>
              <Menu className="h-4 w-4" />
              <span className="sr-only">Open navigation</span>
            </Button>
          </div>
        </div>
      </header>

      <main className="relative">
        <section className="container mx-auto px-4 pb-12 pt-10 sm:pt-16">
          <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-background/80 px-4 py-2 shadow-sm backdrop-blur animate-in fade-in slide-in-from-top duration-500">
                <Badge variant="secondary" className="inline-flex items-center gap-1 border border-border">
                  <Sparkles className="h-3.5 w-3.5" />
                  New
                </Badge>
                <span className="text-sm text-muted-foreground">Tap to move—sections reveal one at a time.</span>
              </div>

              <div className="space-y-6">
                <h2 className="text-balance text-4xl font-bold leading-tight sm:text-5xl">
                  Progressive disclosure for customers, tailors, and admins.
                </h2>
                <p className="text-lg text-muted-foreground text-pretty">
                  The Haib Tailor experience now opens like an app: a vertical navigation shell, tabbed dashboards, and
                  accordion timelines that keep every flow compact.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <Link href="/orders-system">
                  <Button size="lg" className="gap-2 hover:scale-105">
                    Explore orders
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/auth/signup?role=tailor">
                  <Button size="lg" variant="outline" className="border-dashed hover:-translate-y-0.5">
                    Tailor workspace
                  </Button>
                </Link>
                <Link href="/designs">
                  <Button size="lg" variant="secondary" className="gap-2 hover:-translate-y-0.5">
                    Design gallery
                    <BarChart3 className="h-4 w-4" />
                  </Button>
                </Link>
              </div>

              <div className="grid gap-3 text-sm text-muted-foreground sm:grid-cols-3">
                <div className="flex items-center gap-2 rounded-xl border border-border/60 bg-background/60 px-3 py-2 shadow-sm">
                  <ShieldCheck className="h-4 w-4 text-foreground" />
                  Secure approvals
                </div>
                <div className="flex items-center gap-2 rounded-xl border border-border/60 bg-background/60 px-3 py-2 shadow-sm">
                  <MessageCircle className="h-4 w-4 text-foreground" />
                  Built-in messaging
                </div>
                <div className="flex items-center gap-2 rounded-xl border border-border/60 bg-background/60 px-3 py-2 shadow-sm">
                  <CreditCard className="h-4 w-4 text-foreground" />
                  Wallet & payouts
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="absolute -left-6 -top-6 h-20 w-20 rounded-2xl bg-primary/10 blur-2xl" />
              <div className="absolute -right-8 -bottom-8 h-24 w-24 rounded-2xl bg-secondary/70 blur-3xl" />

              <div className="space-y-4 rounded-3xl border border-border bg-background/80 p-6 shadow-xl backdrop-blur-xl animate-in fade-in slide-in-from-right duration-500">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground">Live preview</p>
                    <p className="text-2xl font-semibold">Guided navigation</p>
                  </div>
                  <Badge className="gap-1 bg-primary text-primary-foreground">
                    <Sparkles className="h-3.5 w-3.5" />
                    App-like
                  </Badge>
                </div>

                <div className="grid gap-3 rounded-2xl bg-muted/70 p-4 sm:grid-cols-2">
                  <div className="rounded-xl border border-border/70 bg-background p-4 shadow-sm">
                    <p className="text-sm text-muted-foreground">Active section</p>
                    <div className="mt-2 flex items-center justify-between">
                      <p className="text-lg font-semibold">{navSections.find((section) => section.value === activeSection)?.label}</p>
                      <Clock3 className="h-5 w-5 text-primary" />
                    </div>
                    <p className="text-xs text-muted-foreground">Only one panel open at a time</p>
                  </div>
                  <div className="rounded-xl border border-border/70 bg-background p-4 shadow-sm">
                    <p className="text-sm text-muted-foreground">Mobile nav</p>
                    <div className="mt-2 flex items-center justify-between">
                      <p className="text-lg font-semibold">Slide-in drawer</p>
                      <Badge variant="outline" className="gap-1 border-dashed">
                        <Star className="h-3.5 w-3.5" />
                        Animated
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">Tap the menu to reveal sections</p>
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-3">
                  {heroStats.map((stat) => (
                    <div
                      key={stat.label}
                      className="rounded-xl border border-border/70 bg-background p-4 shadow-sm animate-in fade-in slide-in-from-bottom duration-500"
                    >
                      <p className="text-sm text-muted-foreground">{stat.label}</p>
                      <p className="text-2xl font-semibold">{stat.value}</p>
                      <p className="text-xs text-muted-foreground">{stat.hint}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="container mx-auto px-4 pb-16">
          <div className="grid gap-6 lg:grid-cols-[320px,1fr]">
            <aside className="space-y-4">
              <Card className="shadow-lg">
                <CardHeader className="space-y-1">
                  <CardTitle className="flex items-center justify-between text-lg">
                    <span>Section navigation</span>
                    <Badge variant="secondary" className="border-dashed">Tap to open</Badge>
                  </CardTitle>
                  <CardDescription>Vertical rail on desktop; collapsible drawer on mobile.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  {navSections.map((section) => (
                    <button
                      key={section.value}
                      onClick={() => handleSectionChange(section.value)}
                      className={cn(
                        "flex w-full items-center justify-between rounded-xl border px-4 py-3 text-left transition-all duration-200",
                        "hover:-translate-y-0.5 hover:shadow",
                        activeSection === section.value
                          ? "border-primary bg-primary/10 text-foreground"
                          : "border-border/70 bg-background text-muted-foreground",
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <section.icon className="h-4 w-4" />
                        <div>
                          <p className="font-medium">{section.label}</p>
                          <p className="text-xs">{section.blurb}</p>
                        </div>
                      </div>
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  ))}
                  <div className="rounded-xl border border-dashed border-primary/60 bg-primary/5 p-3 text-sm text-muted-foreground">
                    On phones, the navigation hides until the menu icon is tapped, then slides in with a fade.
                  </div>
                </CardContent>
              </Card>
              <Card className="shadow-sm">
                <CardHeader>
                  <CardTitle>Micro-interactions</CardTitle>
                  <CardDescription>Hover, focus, and loading states use Tailwind animations.</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="border-dashed">
                      <Clock3 className="h-3.5 w-3.5" />
                      300ms transitions
                    </Badge>
                    <span>Fade + slide on every section swap.</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="gap-1">
                      <LayoutPanelLeft className="h-3.5 w-3.5" />
                      Stacked on mobile
                    </Badge>
                    <span>Cards become full-width columns.</span>
                  </div>
                </CardContent>
              </Card>
            </aside>

            <div className="space-y-4">
              <Card className="shadow-xl">
                <CardHeader className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-2xl">
                      {navSections.find((section) => section.value === activeSection)?.label}
                    </CardTitle>
                    <CardDescription>{activeBlurb}</CardDescription>
                  </div>
                  <div className="flex items-center gap-3">
                    <Button className="gap-2 hover:scale-105" onClick={() => setNavOpen(true)}>
                      <Menu className="h-4 w-4" />
                      Sections
                    </Button>
                    <Badge variant="outline" className="border-dashed">Focused view</Badge>
                  </div>
                </CardHeader>
                <CardContent>{sectionContent[activeSection]}</CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>

      <div
        className={cn(
          "fixed inset-0 z-30 bg-background/80 backdrop-blur-sm transition-opacity duration-300 md:hidden",
          navOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0",
        )}
      >
        <div className="absolute inset-0" onClick={() => setNavOpen(false)} />
        <div className="absolute left-4 right-4 top-16 rounded-3xl border border-border/80 bg-background p-4 shadow-2xl">
          <div className="mb-2 flex items-center justify-between">
            <p className="text-sm font-semibold">Jump to a section</p>
            <Button variant="ghost" size="sm" onClick={() => setNavOpen(false)}>
              Close
            </Button>
          </div>
          <div className="grid gap-2">
            {navSections.map((section) => (
              <button
                key={section.value}
                onClick={() => handleSectionChange(section.value)}
                className={cn(
                  "flex items-center justify-between rounded-xl border px-3 py-2 text-left transition-all duration-200",
                  activeSection === section.value
                    ? "border-primary bg-primary/10 text-foreground"
                    : "border-border/70 bg-muted text-muted-foreground",
                )}
              >
                <div className="flex items-center gap-3">
                  <section.icon className="h-4 w-4" />
                  <div>
                    <p className="text-sm font-semibold">{section.label}</p>
                    <p className="text-xs">{section.blurb}</p>
                  </div>
                </div>
                <ArrowRight className="h-4 w-4" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
