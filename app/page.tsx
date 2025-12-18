import Link from "next/link"
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

          <nav className="hidden items-center gap-3 text-sm font-medium md:flex">
            <Link href="#features" className="rounded-lg px-3 py-2 text-muted-foreground transition hover:text-foreground">
              Features
            </Link>
            <Link href="#workflow" className="rounded-lg px-3 py-2 text-muted-foreground transition hover:text-foreground">
              Workflow
            </Link>
            <Link href="#insights" className="rounded-lg px-3 py-2 text-muted-foreground transition hover:text-foreground">
              Insights
            </Link>
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
        <section className="container mx-auto px-4 pb-16 pt-20 sm:pt-28">
          <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-background/80 px-4 py-2 shadow-sm backdrop-blur">
                <Badge variant="secondary" className="inline-flex items-center gap-1 border border-border">
                  <Sparkles className="h-3.5 w-3.5" />
                  New
                </Badge>
                <span className="text-sm text-muted-foreground">Bespoke experiences, powered by Tailwind</span>
              </div>

              <div className="space-y-6">
                <h2 className="text-balance text-4xl font-bold leading-tight sm:text-5xl">
                  Build a tailor-made journey that feels as crafted as the clothes you deliver.
                </h2>
                <p className="text-lg text-muted-foreground text-pretty">
                  Haib Tailor blends guided onboarding, collaborative workrooms, and clear payments into a single elegant
                  platform. Customers feel cared for, tailors feel organized, and admins see the full story.
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

              <div className="flex flex-wrap gap-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-foreground" />
                  Secure payments & approvals
                </div>
                <div className="flex items-center gap-2">
                  <MessageCircle className="h-4 w-4 text-foreground" />
                  Built-in messaging
                </div>
                <div className="flex items-center gap-2">
                  <CreditCard className="h-4 w-4 text-foreground" />
                  Wallet & payouts
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="absolute -left-6 -top-6 h-20 w-20 rounded-2xl bg-primary/10 blur-2xl" />
              <div className="absolute -right-8 -bottom-8 h-24 w-24 rounded-2xl bg-secondary/70 blur-3xl" />

              <div className="space-y-4 rounded-3xl border border-border bg-background/80 p-6 shadow-xl backdrop-blur-xl">
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
                        4.9
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">Specialist · Suits · Lagos</p>
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-3">
                  <Card className="shadow-sm">
                    <CardHeader className="space-y-1 pb-2">
                      <CardDescription>Progress</CardDescription>
                      <CardTitle className="text-xl">72%</CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm text-muted-foreground">
                      Pattern drafted & fabric sourced
                    </CardContent>
                  </Card>
                  <Card className="shadow-sm">
                    <CardHeader className="space-y-1 pb-2">
                      <CardDescription>Messages</CardDescription>
                      <CardTitle className="text-xl">3 new</CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm text-muted-foreground">
                      Approve lining & lapel stitch
                    </CardContent>
                  </Card>
                  <Card className="shadow-sm">
                    <CardHeader className="space-y-1 pb-2">
                      <CardDescription>Balance</CardDescription>
                      <CardTitle className="text-xl">$420</CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm text-muted-foreground">
                      Milestone payout auto-released
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="container mx-auto px-4 pb-16">
          <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
            <div>
              <Badge variant="outline" className="border-dashed">
                Platform pillars
              </Badge>
              <h3 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">Every role feels effortless</h3>
              <p className="mt-3 max-w-2xl text-muted-foreground">
                Customers, tailors, and admins share the same language: fast updates, clear milestones, and proactive
                nudges that keep the experience memorable.
              </p>
            </div>
            <Link href="/notifications">
              <Button variant="ghost" className="gap-2">
                See notifications flow
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>

          <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {featureHighlights.map((feature) => (
              <Card key={feature.title} className="group relative overflow-hidden border-border/70 shadow-sm">
                <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary via-secondary to-muted" />
                <CardHeader className="space-y-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <feature.icon className="h-5 w-5" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                  <CardDescription className="leading-relaxed">{feature.description}</CardDescription>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  <div className="flex items-center gap-2 text-foreground">
                    <BadgeCheck />
                    <span>White-glove onboarding</span>
                  </div>
                  <div className="mt-2 flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4" />
                    <span>Secure, auditable steps</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section id="workflow" className="container mx-auto px-4 pb-16">
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div className="space-y-4">
              <Badge variant="secondary" className="border border-border/70">
                Designed for flow
              </Badge>
              <h3 className="text-3xl font-semibold sm:text-4xl">From inspiration to delivery, in one clean track</h3>
              <p className="text-muted-foreground">
                Keep everyone aligned with milestone-based orders, contextual chat, and payouts that mirror the craft
                process. The experience feels bespoke even before the first stitch.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link href="/messages">
                  <Button variant="outline" className="gap-2">
                    Open messaging workspace
                    <MessageCircle className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/payments">
                  <Button variant="secondary" className="gap-2">
                    Payment controls
                    <CreditCard className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>

            <div className="grid gap-4 rounded-3xl border border-border/70 bg-background/70 p-6 shadow-xl backdrop-blur">
              {workflowPillars.map((pillar) => (
                <div
                  key={pillar.name}
                  className="group grid gap-3 rounded-2xl border border-border/60 bg-muted/80 px-5 py-4 transition hover:-translate-y-1 hover:border-primary/70 hover:bg-background"
                >
                  <div className="flex items-center justify-between">
                    <div className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold tracking-wider text-primary">
                      {pillar.accent}
                    </div>
                    <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Milestone</span>
                  </div>
                  <div className="space-y-2">
                    <p className="text-lg font-semibold">{pillar.name}</p>
                    <p className="text-sm text-muted-foreground leading-relaxed">{pillar.detail}</p>
                  </div>
                  <div className="flex items-center gap-2 text-sm font-medium text-primary">
                    <ArrowRight className="h-4 w-4" />
                    Preview this journey
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="insights" className="container mx-auto px-4 pb-20">
          <div className="rounded-3xl border border-border/80 bg-gradient-to-r from-background via-muted to-background px-6 py-10 shadow-xl sm:px-10">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div className="max-w-2xl space-y-3">
                <Badge variant="outline" className="border-dashed">
                  Quietly powerful
                </Badge>
                <h3 className="text-3xl font-semibold sm:text-4xl">Operational clarity for every role</h3>
                <p className="text-muted-foreground">
                  Dashboards, notifications, and payouts are stitched together so teams never lose the thread. Your
                  brand voice and motion live inside Tailwind-driven components for a consistent feel.
                </p>
                <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2 rounded-full bg-background px-3 py-1 shadow-sm">
                    <ShieldCheck className="h-4 w-4 text-primary" />
                    Role-based controls
                  </div>
                  <div className="flex items-center gap-2 rounded-full bg-background px-3 py-1 shadow-sm">
                    <CreditCard className="h-4 w-4 text-primary" />
                    Transparent payouts
                  </div>
                  <div className="flex items-center gap-2 rounded-full bg-background px-3 py-1 shadow-sm">
                    <BarChart3 className="h-4 w-4 text-primary" />
                    Live analytics
                  </div>
                </div>
              </div>

              <div className="grid w-full gap-4 sm:grid-cols-3 lg:max-w-xl">
                {stats.map((stat) => (
                  <Card key={stat.label} className="border-border/70 bg-background/80 shadow-md">
                    <CardHeader className="pb-2">
                      <CardDescription>{stat.label}</CardDescription>
                      <CardTitle className="text-3xl">{stat.value}</CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm text-muted-foreground">{stat.hint}</CardContent>
                  </Card>
                ))}
              </div>
            </div>

            <div className="mt-8 flex flex-col gap-4 rounded-2xl border border-border/60 bg-background/60 p-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="space-y-1">
                <p className="text-sm uppercase tracking-[0.18em] text-muted-foreground">Ready to tailor the web?</p>
                <p className="text-lg font-semibold">Launch a branded experience in days with Tailwind patterns.</p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Link href="/auth/signup">
                  <Button className="gap-2">
                    Get started
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/designs">
                  <Button variant="outline">View design gallery</Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-border/60 bg-background/80 py-10 backdrop-blur">
        <div className="container mx-auto flex flex-col gap-6 px-4 md:flex-row md:items-center md:justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-lg font-semibold">
              <Scissors className="h-5 w-5" /> Haib Tailor
            </div>
            <p className="text-sm text-muted-foreground">
              Crafted with Tailwind—giving tailors, customers, and admins a modern place to collaborate.
            </p>
          </div>
          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
            <Link href="/orders-system" className="hover:text-foreground">
              Orders
            </Link>
            <Link href="/payments" className="hover:text-foreground">
              Payments
            </Link>
            <Link href="/notifications" className="hover:text-foreground">
              Notifications
            </Link>
            <Link href="/designs" className="hover:text-foreground">
              Design gallery
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
