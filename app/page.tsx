"use client"

import Link from "next/link"
import { useMemo, useState } from "react"
import {
  ArrowRight,
  BadgeCheck,
  BarChart3,
  Clock3,
  CreditCard,
  MessageCircle,
  ShieldCheck,
  Sparkles,
  Scissors,
  Star,
  Users,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const featureHighlights = [
  {
    title: "Customer-first journeys",
    description:
      "Guided measurement capture, curated tailor discovery, and transparent delivery timelines keep clients confident.",
    icon: Users,
  },
  {
    title: "Tailor workbench",
    description:
      "Smart order pipelines, fabric libraries, and fit notes help tailors operate like modern ateliers.",
    icon: Scissors,
  },
  {
    title: "Admin-grade oversight",
    description:
      "Dispute handling, payouts, and platform analytics provide calm control without slowing teams down.",
    icon: BarChart3,
  },
]

const workflowPillars = [
  {
    name: "Measure & match",
    detail: "Capture sizes, preferences, and inspirations in one guided flow that tailors can action immediately.",
    accent: "01",
  },
  {
    name: "Craft & collaborate",
    detail: "Preview drafts, approve milestones, and chat with tailors without losing thread of the conversation.",
    accent: "02",
  },
  {
    name: "Deliver & delight",
    detail: "Track fittings, shipping, and payments while automated nudges keep everyone on schedule.",
    accent: "03",
  },
]

const stats = [
  { label: "On-time delivery", value: "97%", hint: "Orders hitting promised dates" },
  { label: "Average rating", value: "4.9", hint: "From delighted customers" },
  { label: "Faster approvals", value: "-38%", hint: "Time saved on admin reviews" },
]

const quickRoutes = [
  {
    title: "Orders workspace",
    href: "/orders-system",
    icon: Clock3,
    description: "Track SLAs, express flows, and audit timelines from a single console.",
  },
  {
    title: "Payments console",
    href: "/payments",
    icon: CreditCard,
    description: "Wallets, payouts, and fee visibility with responsive dashboards.",
  },
  {
    title: "Design gallery",
    href: "/designs",
    icon: Sparkles,
    description: "Curated looks customers can bookmark before handing to tailors.",
  },
]

export default function HomePage() {
  const [activeSection, setActiveSection] = useState<string>("features")

  const navSections = useMemo(
    () => [
      { value: "features", label: "Feature board", description: "Surface key capabilities in a focused panel." },
      { value: "workflow", label: "Workflow", description: "Step through the journey without endless scrolling." },
      { value: "insights", label: "Insights", description: "See performance snapshots and trust signals." },
    ],
    [],
  )

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
                className="rounded-lg px-3 py-2"
                onClick={() => setActiveSection(section.value)}
              >
                {section.label}
              </Button>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <Link href="/auth/login">
              <Button variant="ghost">Log in</Button>
            </Link>
            <Link href="/auth/signup">
              <Button className="gap-2">
                Start free
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="relative">
        <section className="container mx-auto px-4 pb-10 pt-16 sm:pt-24">
          <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-background/80 px-4 py-2 shadow-sm backdrop-blur animate-in fade-in slide-in-from-top duration-500">
                <Badge variant="secondary" className="inline-flex items-center gap-1 border border-border">
                  <Sparkles className="h-3.5 w-3.5" />
                  New
                </Badge>
                <span className="text-sm text-muted-foreground">Guided app-style navigation with Tailwind motion</span>
              </div>

              <div className="space-y-6">
                <h2 className="text-balance text-4xl font-bold leading-tight sm:text-5xl">
                  Build a tailor-made journey that feels as crafted as the clothes you deliver.
                </h2>
                <p className="text-lg text-muted-foreground text-pretty">
                  Haib Tailor now opens like a focused workspace. Switch sections with intent, keep attention on the
                  task, and explore flows without endless scrolling.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <Link href="/auth/signup?role=customer">
                  <Button size="lg" className="gap-2">
                    Find your tailor
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/auth/signup?role=tailor">
                  <Button size="lg" variant="outline" className="border-dashed">
                    I craft garments
                  </Button>
                </Link>
                <Link href="/orders-system">
                  <Button size="lg" variant="secondary" className="gap-2">
                    View live orders
                    <Clock3 className="h-4 w-4" />
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
                    <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground">Live orders</p>
                    <p className="text-2xl font-semibold">Hannah · Silk Suit</p>
                  </div>
                  <Badge className="gap-1 bg-primary text-primary-foreground">
                    <Sparkles className="h-3.5 w-3.5" />
                    VIP care
                  </Badge>
                </div>

                <div className="grid gap-3 rounded-2xl bg-muted/70 p-4 sm:grid-cols-2">
                  <div className="rounded-xl border border-border/70 bg-background p-4 shadow-sm">
                    <p className="text-sm text-muted-foreground">Next milestone</p>
                    <div className="mt-2 flex items-center justify-between">
                      <p className="text-lg font-semibold">Fitting scheduled</p>
                      <Clock3 className="h-5 w-5 text-primary" />
                    </div>
                    <p className="text-xs text-muted-foreground">Friday · 4:30 PM</p>
                  </div>
                  <div className="rounded-xl border border-border/70 bg-background p-4 shadow-sm">
                    <p className="text-sm text-muted-foreground">Tailor</p>
                    <div className="mt-2 flex items-center justify-between">
                      <p className="text-lg font-semibold">Esa Menswear</p>
                      <Badge variant="outline" className="gap-1 border-dashed">
                        <Star className="h-3.5 w-3.5" />
                        4.9★
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">Express · 3 day turnaround</p>
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-3">
                  {stats.map((stat) => (
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
          <Card className="rounded-3xl border-border/80 bg-background/70 shadow-xl backdrop-blur-xl">
            <CardHeader className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <div className="space-y-1">
                <CardTitle className="text-2xl">Navigate the experience</CardTitle>
                <CardDescription>
                  Open one panel at a time—no more endless scroll. Everything is tucked behind purposeful clicks.
                </CardDescription>
              </div>
              <TabsList className="w-full justify-start overflow-x-auto lg:w-auto">
                {navSections.map((section) => (
                  <TabsTrigger key={section.value} value={section.value} onClick={() => setActiveSection(section.value)}>
                    {section.label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </CardHeader>
            <CardContent>
              <Tabs value={activeSection} onValueChange={setActiveSection} className="space-y-6">
                <TabsContent value="features" className="space-y-4 animate-in fade-in slide-in-from-bottom duration-500">
                  <div className="grid gap-4 lg:grid-cols-3">
                    {featureHighlights.map((feature, index) => (
                      <Card
                        key={feature.title}
                        className="border-dashed bg-muted/60 shadow-sm transition hover:-translate-y-1 hover:shadow-lg animate-in fade-in slide-in-from-bottom"
                        style={{ animationDelay: `${index * 80}ms` }}
                      >
                        <CardHeader className="space-y-3">
                          <div className="inline-flex w-fit items-center gap-2 rounded-full bg-background px-3 py-1 text-xs font-medium">
                            <feature.icon className="h-4 w-4" />
                            {feature.title}
                          </div>
                          <CardDescription className="text-sm text-muted-foreground">{feature.description}</CardDescription>
                        </CardHeader>
                      </Card>
                    ))}
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <Card className="shadow-sm">
                      <CardHeader>
                        <CardTitle>Customer & tailor shortcuts</CardTitle>
                        <CardDescription>Jump into messaging, orders, or payouts without hunting through the page.</CardDescription>
                      </CardHeader>
                      <CardContent className="grid gap-3 sm:grid-cols-2">
                        {quickRoutes.map((route) => (
                          <Link key={route.title} href={route.href}>
                            <div className="rounded-xl border border-border/70 bg-background/70 p-4 transition hover:-translate-y-1 hover:border-primary hover:shadow-lg">
                              <div className="flex items-center gap-2 text-sm font-semibold">
                                <route.icon className="h-4 w-4 text-primary" />
                                {route.title}
                              </div>
                              <p className="mt-2 text-sm text-muted-foreground">{route.description}</p>
                            </div>
                          </Link>
                        ))}
                      </CardContent>
                    </Card>

                    <Card className="shadow-sm">
                      <CardHeader>
                        <CardTitle>Trusted delivery</CardTitle>
                        <CardDescription>Payment locks, approvals, and SLA friendly reminders in one view.</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-3 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <ShieldCheck className="h-4 w-4 text-primary" />
                          PCI-ready checkouts and wallet splits
                        </div>
                        <div className="flex items-center gap-2">
                          <BadgeCheck className="h-4 w-4 text-primary" />
                          Verified tailors & curated reviews
                        </div>
                        <div className="flex items-center gap-2">
                          <MessageCircle className="h-4 w-4 text-primary" />
                          Embedded chat + approvals inside every step
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="workflow" className="space-y-6 animate-in fade-in slide-in-from-bottom duration-500">
                  <div className="grid gap-4 md:grid-cols-3">
                    {workflowPillars.map((pillar, index) => (
                      <Card
                        key={pillar.name}
                        className="border-dashed bg-background/60 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                        style={{ animationDelay: `${index * 80}ms` }}
                      >
                        <CardHeader className="space-y-3">
                          <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground">
                            <span>{pillar.accent}</span>
                            <Badge variant="outline">Flow</Badge>
                          </div>
                          <CardTitle className="text-lg">{pillar.name}</CardTitle>
                          <CardDescription className="text-sm text-muted-foreground">{pillar.detail}</CardDescription>
                        </CardHeader>
                      </Card>
                    ))}
                  </div>

                  <div className="grid gap-4 lg:grid-cols-[1.4fr_0.6fr]">
                    <Card className="shadow-sm">
                      <CardHeader>
                        <CardTitle>Guided session</CardTitle>
                        <CardDescription>
                          Customers and tailors step through an interactive session instead of scrolling past blocks of
                          text.
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="grid gap-3 sm:grid-cols-2">
                        {stats.map((stat) => (
                          <div key={stat.label} className="rounded-xl border border-border/70 bg-muted/50 p-4">
                            <p className="text-sm text-muted-foreground">{stat.label}</p>
                            <p className="text-2xl font-semibold">{stat.value}</p>
                            <p className="text-xs text-muted-foreground">{stat.hint}</p>
                          </div>
                        ))}
                        <div className="rounded-xl border border-dashed border-primary/50 bg-primary/5 p-4 text-sm text-muted-foreground">
                          Each section now opens with a click—perfect for mobile and tablet navigation.
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="shadow-sm">
                      <CardHeader>
                        <CardTitle>Micro-interactions</CardTitle>
                        <CardDescription>Subtle Tailwind-powered animations keep transitions smooth.</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-3 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <Sparkles className="h-4 w-4 text-primary" />
                          Animate-in panels when switching tabs
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock3 className="h-4 w-4 text-primary" />
                          Sticky nav that becomes a pill bar on mobile
                        </div>
                        <div className="flex items-center gap-2">
                          <MessageCircle className="h-4 w-4 text-primary" />
                          Section summaries remain visible while details stay tucked away
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="insights" className="space-y-6 animate-in fade-in slide-in-from-bottom duration-500">
                  <div className="grid gap-4 lg:grid-cols-3">
                    {stats.map((stat, index) => (
                      <Card
                        key={stat.label}
                        className="border-dashed bg-background/60 shadow-sm"
                        style={{ animationDelay: `${index * 80}ms` }}
                      >
                        <CardHeader>
                          <CardTitle className="text-3xl">{stat.value}</CardTitle>
                          <CardDescription>{stat.label}</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-muted-foreground">{stat.hint}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  <Card className="shadow-sm">
                    <CardHeader>
                      <CardTitle>What changes for you</CardTitle>
                      <CardDescription>
                        A calmer, app-like surface where customers, tailors, and admins can focus on one area at a time.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                      <div className="rounded-xl border border-border/70 bg-muted/60 p-4 text-sm text-muted-foreground">
                        Faster navigation on phones—section tabs snap into a horizontal scroll bar.
                      </div>
                      <div className="rounded-xl border border-border/70 bg-muted/60 p-4 text-sm text-muted-foreground">
                        Animated transitions keep context visible while the next section loads in place.
                      </div>
                      <div className="rounded-xl border border-border/70 bg-muted/60 p-4 text-sm text-muted-foreground">
                        Cards stack neatly on small screens so nothing spills edge-to-edge.
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  )
}
