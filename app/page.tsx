"use client"

import Link from "next/link"
import {
  ArrowRight,
  BadgeCheck,
  BarChart3,
  Clock3,
  MessageCircle,
  Scissors,
  ShieldCheck,
  Sparkles,
  Star,
  Users,
  Wallet,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { formatNaira } from "@/lib/currency"

const heroStats = [
  { label: "Requests resolved", value: "92%", hint: "Handled inside the product, not by WhatsApp" },
  { label: "Average rollout", value: "10 days", hint: "Launch Lagos-to-Abuja with payments and reviews" },
  { label: "Customer CSAT", value: "4.8/5", hint: "Guided flows keep fittings on track" },
]

const featurePillars = [
  {
    title: "Single, guided experience",
    description: "Vertical navigation, tabs, and timelines live in the app so customers never bounce around.",
    points: ["Mobile-first layouts", "Aso-ebi ready prompts", "Built-in success states"],
  },
  {
    title: "Tailor-first operations",
    description: "Capacity, pickup windows, and workshop verification ship as ready-made components.",
    points: ["Smart capacity blocks", "Verified atelier badges", "Portfolio-ready cards"],
  },
  {
    title: "Payments with trust",
    description: "Wallet, escrow, tips, and dispute guards are included—no extra plug-ins needed.",
    points: ["Wallet + holds", "Proof-before-payout", "Clear audit trails"],
  },
]

const personaPanels = [
  {
    value: "customers",
    label: "Customers",
    eyebrow: "Always know what happens next",
    summary: "Guided order creation, scheduled fittings, and status nudges reduce drop-off.",
    bullets: [
      "Accordion timelines with one step open at a time",
      "Saved measurements and fabric choices ready for reorders",
      "In-app chat with file drops for inspiration shots",
    ],
    accent: "Zero wandering pages—everything stays in the flow.",
  },
  {
    value: "tailors",
    label: "Tailors",
    eyebrow: "Operate with confidence",
    summary: "Capacity planning, pickup notes, and portfolio updates are native to the workspace.",
    bullets: [
      "Capacity boards for new orders, fittings, and deliveries",
      "Verified identity and workshop shields surfaced automatically",
      "Portfolio and reviews refresh without leaving the console",
    ],
    accent: "Fewer admin tabs, more time at the bench.",
  },
  {
    value: "admins",
    label: "Admins",
    eyebrow: "Guardrails built in",
    summary: "Escrow, payouts, and dispute resolution are streamlined so finance and support stay aligned.",
    bullets: [
      "Wallets with holds, releases, and rewards in one place",
      "Fraud and safety markers on every order before payout",
      "Compact ledgers and audit trails ready for export",
    ],
    accent: "Peace of mind without extra dashboards.",
  },
]

const deliveryMoments = [
  {
    title: "Capture intent",
    detail: "Lead magnets, quiz flows, and ready-to-go measurement prompts live inside the app shell.",
    icon: Sparkles,
  },
  {
    title: "Guide the build",
    detail: "Orders progress through milestones—fabric locks, fitting slots, approvals—one tap at a time.",
    icon: Clock3,
  },
  {
    title: "Deliver & celebrate",
    detail: "Drop-offs trigger payout rules, review requests, and highlight reels customers can share.",
    icon: Star,
  },
]

const trustSignals = [
  {
    title: "Payments that feel safe",
    description: "Escrow, holds, and split balances are default. Customers see exactly when funds move.",
    icon: Wallet,
  },
  {
    title: "Proof before payout",
    description: "Delivery scans, approval prompts, and secure chat keep both sides protected.",
    icon: ShieldCheck,
  },
  {
    title: "Support without chaos",
    description: "Admins get ledgers, dispute actions, and messaging in one view—no ticket ping-pong.",
    icon: MessageCircle,
  },
]

export default function HomePage() {
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

          <nav className="hidden items-center gap-6 text-sm font-medium md:flex">
            <Link href="#product" className="transition-colors hover:text-foreground">
              Product
            </Link>
            <Link href="#workflows" className="transition-colors hover:text-foreground">
              Workflows
            </Link>
            <Link href="#trust" className="transition-colors hover:text-foreground">
              Trust & payments
            </Link>
            <Link href="#cta" className="transition-colors hover:text-foreground">
              Pricing
            </Link>
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
          </div>
        </div>
      </header>

      <main className="relative">
        <section className="container mx-auto grid gap-10 px-4 pb-12 pt-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-background/80 px-4 py-2 shadow-sm backdrop-blur animate-in fade-in slide-in-from-top duration-500">
              <Badge variant="secondary" className="inline-flex items-center gap-1 border border-border">
                <Sparkles className="h-3.5 w-3.5" />
                New
              </Badge>
              <span className="text-sm text-muted-foreground">A marketing-grade story, rebuilt around the product.</span>
            </div>

            <div className="space-y-6">
              <h2 className="text-balance text-4xl font-bold leading-tight sm:text-5xl">
                Nigerian tailoring journeys—without the clutter.
              </h2>
              <p className="text-lg text-muted-foreground text-pretty">
                Haib Tailor keeps discovery, ordering, messaging, and payouts in one guided workspace. From agbada to
                aso-ebi, every milestone is already mapped.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Link href="/auth/signup">
                <Button size="lg" className="gap-2 hover:scale-105">
                  Launch the workspace
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/orders-system">
                <Button size="lg" variant="outline" className="border-dashed hover:-translate-y-0.5">
                  See live orders
                </Button>
              </Link>
              <Link href="/designs">
                <Button size="lg" variant="secondary" className="gap-2 hover:-translate-y-0.5">
                  Browse designs
                  <BarChart3 className="h-4 w-4" />
                </Button>
              </Link>
            </div>

            <div className="grid gap-3 text-sm text-muted-foreground sm:grid-cols-3">
              <div className="flex items-center gap-2 rounded-xl border border-border/60 bg-background/60 px-3 py-2 shadow-sm">
                <ShieldCheck className="h-4 w-4 text-foreground" />
                Approvals built in
              </div>
              <div className="flex items-center gap-2 rounded-xl border border-border/60 bg-background/60 px-3 py-2 shadow-sm">
                <MessageCircle className="h-4 w-4 text-foreground" />
                Guided messaging
              </div>
              <div className="flex items-center gap-2 rounded-xl border border-border/60 bg-background/60 px-3 py-2 shadow-sm">
                <Wallet className="h-4 w-4 text-foreground" />
                Wallet + payouts
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -left-6 -top-6 h-20 w-20 rounded-2xl bg-primary/10 blur-2xl" />
            <div className="absolute -right-8 -bottom-8 h-24 w-24 rounded-2xl bg-secondary/70 blur-3xl" />

            <div className="space-y-4 rounded-3xl border border-border bg-background/80 p-6 shadow-xl backdrop-blur-xl animate-in fade-in slide-in-from-right duration-500">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground">Product snapshot</p>
                  <p className="text-2xl font-semibold">Everything sits inside the app</p>
                </div>
                <Badge className="gap-1 bg-primary text-primary-foreground">
                  <BadgeCheck className="h-3.5 w-3.5" />
                  Launch-ready
                </Badge>
              </div>

              <div className="grid gap-3 rounded-2xl bg-muted/70 p-4 sm:grid-cols-2">
                <div className="rounded-xl border border-border/70 bg-background p-4 shadow-sm">
                  <p className="text-sm text-muted-foreground">Navigation</p>
                  <div className="mt-2 flex items-center justify-between">
                    <p className="text-lg font-semibold">Vertical & tabbed</p>
                    <Clock3 className="h-5 w-5 text-primary" />
                  </div>
                  <p className="text-xs text-muted-foreground">Opens just one area at a time.</p>
                </div>
                <div className="rounded-xl border border-border/70 bg-background p-4 shadow-sm">
                  <p className="text-sm text-muted-foreground">Mobile feel</p>
                  <div className="mt-2 flex items-center justify-between">
                    <p className="text-lg font-semibold">App-like drawer</p>
                    <Badge variant="outline" className="gap-1 border-dashed">
                      <Star className="h-3.5 w-3.5" />
                      Smooth
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">Guides users without extra pages.</p>
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
        </section>

        <section className="container mx-auto px-4 pb-16">
            <div className="mb-6 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
              <Badge variant="outline" className="border-dashed">
                Trusted by Nigerian ateliers
              </Badge>
              <div className="flex flex-wrap items-center gap-4 text-foreground/70">
                <span>Eko Menswear</span>
                <span>Abuja Atelier</span>
                <span>Adire House</span>
                <span>Velvet Row</span>
              </div>
            </div>

          <div id="product" className="space-y-8">
            <div className="space-y-2">
              <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground">Why this landing is calmer</p>
              <h3 className="text-3xl font-semibold sm:text-4xl">Marketing that points to a ready product.</h3>
              <p className="text-lg text-muted-foreground text-pretty">
                We moved feature clutter into the actual app experience. What remains is a clear promise: a guided
                tailoring workspace with the flows already built.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              {featurePillars.map((pillar) => (
                <Card key={pillar.title} className="h-full border-dashed bg-background/80 shadow-sm">
                  <CardHeader className="space-y-2">
                    <CardTitle className="flex items-center gap-2 text-xl">
                      <Sparkles className="h-4 w-4 text-primary" />
                      {pillar.title}
                    </CardTitle>
                    <CardDescription className="text-base text-muted-foreground">{pillar.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm text-muted-foreground">
                    {pillar.points.map((point) => (
                      <div key={point} className="flex items-center gap-2">
                        <BadgeCheck className="h-4 w-4 text-primary" />
                        <span>{point}</span>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section id="workflows" className="container mx-auto px-4 pb-16">
          <div className="grid gap-6 lg:grid-cols-[360px,1fr] lg:items-start">
            <div className="space-y-3">
              <Badge variant="secondary" className="border border-border">
                Personas we guide
              </Badge>
              <h3 className="text-3xl font-semibold">Built-in workflows for every side of tailoring.</h3>
              <p className="text-base text-muted-foreground text-pretty">
                Choose a persona to see what ships inside the product. Each view uses tabs, accordions, and guided
                prompts to keep people on track.
              </p>
            </div>

            <Card className="shadow-lg">
              <CardHeader className="pb-0">
                <CardTitle className="text-xl">Live slices from the app</CardTitle>
                <CardDescription>Preview the flows without scrolling forever.</CardDescription>
              </CardHeader>
              <CardContent className="pt-4">
                <Tabs defaultValue="customers" className="space-y-4">
                  <TabsList className="w-full justify-start overflow-x-auto">
                    {personaPanels.map((panel) => (
                      <TabsTrigger key={panel.value} value={panel.value} className="capitalize">
                        {panel.label}
                      </TabsTrigger>
                    ))}
                  </TabsList>

                  {personaPanels.map((panel) => (
                    <TabsContent key={panel.value} value={panel.value} className="space-y-3">
                      <Card className="border-border/70 bg-muted/50 shadow-sm">
                        <CardHeader className="space-y-1">
                          <Badge variant="outline" className="w-fit border-dashed text-xs uppercase tracking-wide">
                            {panel.eyebrow}
                          </Badge>
                          <CardTitle className="text-xl">{panel.label}</CardTitle>
                          <CardDescription className="text-base text-muted-foreground">{panel.summary}</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-2 text-sm text-muted-foreground">
                          {panel.bullets.map((bullet) => (
                            <div key={bullet} className="flex items-start gap-2">
                              <ArrowRight className="mt-1 h-4 w-4 text-primary" />
                              <span>{bullet}</span>
                            </div>
                          ))}
                          <div className="mt-2 rounded-lg bg-background/80 p-3 text-xs text-foreground">
                            {panel.accent}
                          </div>
                        </CardContent>
                      </Card>
                    </TabsContent>
                  ))}
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="container mx-auto px-4 pb-16">
          <div className="grid gap-6 lg:grid-cols-[1fr_360px] lg:items-center">
            <div className="space-y-4">
              <div className="space-y-2">
                <Badge variant="outline" className="border-dashed">Customer journey</Badge>
                <h3 className="text-3xl font-semibold">From intent to celebration.</h3>
                <p className="text-base text-muted-foreground">
                  The landing page is short because the journey lives in the product. Each milestone is a guided card
                  with the next action ready.
                </p>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                {deliveryMoments.map((moment) => (
                  <Card key={moment.title} className="border-border/70 bg-background/80 shadow-sm">
                    <CardHeader className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <moment.icon className="h-4 w-4 text-primary" />
                        Step
                      </div>
                      <CardTitle className="text-lg">{moment.title}</CardTitle>
                      <CardDescription className="text-sm text-muted-foreground">{moment.detail}</CardDescription>
                    </CardHeader>
                  </Card>
                ))}
              </div>
            </div>

            <Card className="bg-gradient-to-br from-background to-muted/70 shadow-xl">
              <CardHeader className="space-y-3">
                <CardTitle className="text-2xl">A calmer, clearer promise</CardTitle>
                <CardDescription className="text-base text-muted-foreground">
                  No more laundry list of UI pieces on the landing page. The experience is ready inside the app shell.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-primary" />
                  Lead capture converts because the next tap is obvious.
                </div>
                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4 text-primary" />
                  Reviews, highlight reels, and upsells are built-in prompts.
                </div>
                <div className="flex items-center gap-2">
                  <Scissors className="h-4 w-4 text-primary" />
                  Tailors get a workspace that mirrors their craft, not a marketing page.
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        <section id="trust" className="container mx-auto px-4 pb-16">
          <div className="space-y-2">
            <Badge variant="secondary" className="border border-border">
              Trust & payments
            </Badge>
            <h3 className="text-3xl font-semibold sm:text-4xl">Confidence is part of the release.</h3>
            <p className="text-lg text-muted-foreground text-pretty">
              Safety cues, payout controls, and messaging guardrails are product features—not paragraphs on a site. Your
              team launches with them today.
            </p>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {trustSignals.map((signal) => (
              <Card key={signal.title} className="h-full border-dashed bg-background/80 shadow-sm">
                <CardHeader className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <signal.icon className="h-4 w-4 text-primary" />
                    Included
                  </div>
                  <CardTitle className="text-xl">{signal.title}</CardTitle>
                  <CardDescription className="text-sm text-muted-foreground">{signal.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>

          <Card className="mt-6 border-border/70 bg-muted/60 shadow-sm">
            <CardContent className="grid gap-4 p-6 sm:grid-cols-2 sm:items-center">
              <div className="space-y-2">
                <Badge variant="outline" className="border-dashed">Payment clarity</Badge>
                <h4 className="text-2xl font-semibold">Wallet, escrow, and tips—live today.</h4>
                <p className="text-sm text-muted-foreground">
                  Customers see when holds release, tailors see when payouts land, and admins see the full trail. All of
                  it sits in the product you launch.
                </p>
              </div>
              <div className="grid gap-2 text-sm text-muted-foreground">
                <div className="flex items-center justify-between rounded-lg border border-border/70 bg-background p-3">
                  <span>Escrow hold · Delivery verified</span>
                  <Badge variant="outline" className="border-dashed">{formatNaira(240000)}</Badge>
                </div>
                <div className="flex items-center justify-between rounded-lg border border-border/70 bg-background p-3">
                  <span>Tailor payout · Same day</span>
                  <Badge variant="secondary" className="gap-1">
                    <ShieldCheck className="h-3.5 w-3.5" />
                    Protected
                  </Badge>
                </div>
                <div className="flex items-center justify-between rounded-lg border border-border/70 bg-background p-3">
                  <span>Tips + loyalty unlocked</span>
                  <Badge variant="outline" className="border-dashed">{formatNaira(15000)}</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        <section className="container mx-auto px-4 pb-20">
          <Card className="bg-gradient-to-br from-primary/10 via-background to-muted shadow-xl" id="cta">
            <CardContent className="grid gap-6 p-8 sm:grid-cols-[1.2fr_0.8fr] sm:items-center">
              <div className="space-y-3">
                <Badge variant="secondary" className="border border-border">Launch ready</Badge>
                <h3 className="text-3xl font-semibold">Let the product do the heavy lifting.</h3>
                <p className="text-base text-muted-foreground">
                  A marketing story that fits on one page because every promised element is already built inside Haib
                  Tailor. Turn it on, invite your tailors, and start collecting wins.
                </p>
                <div className="flex flex-wrap items-center gap-3">
                  <Link href="/auth/signup">
                    <Button size="lg" className="gap-2 hover:scale-105">
                      Start free
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href="/auth/login">
                    <Button size="lg" variant="outline" className="border-dashed hover:-translate-y-0.5">
                      View workspace
                    </Button>
                  </Link>
                </div>
              </div>

              <div className="space-y-3 rounded-2xl border border-border/70 bg-background/70 p-5 text-sm text-muted-foreground">
                <div className="flex items-center gap-2 text-foreground">
                  <BadgeCheck className="h-4 w-4 text-primary" />
                  No extra design sprints—flows are done.
                </div>
                <div className="flex items-center gap-2 text-foreground">
                  <Star className="h-4 w-4 text-primary" />
                  App-like navigation ready for mobile.
                </div>
                <div className="flex items-center gap-2 text-foreground">
                  <MessageCircle className="h-4 w-4 text-primary" />
                  Messaging, reviews, and payments stay in one place.
                </div>
                <div className="flex items-center gap-2 text-foreground">
                  <ShieldCheck className="h-4 w-4 text-primary" />
                  Trust cues you can ship today.
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  )
}
