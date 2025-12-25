"use client"

import Link from "next/link"
import { useState } from "react"
import {
  Activity,
  AlertTriangle,
  ArrowLeft,
  Ban,
  BarChart3,
  BellRing,
  BookCheck,
  CalendarClock,
  CheckCircle2,
  CreditCard,
  FileLock2,
  HandCoins,
  Layers,
  Lock,
  Mail,
  PieChart,
  ReceiptText,
  RefreshCw,
  Scale,
  Shield,
  Sparkles,
  Split,
  Timer,
  TrendingUp,
  Wallet,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"
import { formatNaira } from "@/lib/currency"

const paymentMethods = [
  {
    title: "Cards",
    description: "Visa, MasterCard, Verve with 3D Secure auth and tokenized reuse.",
    icon: CreditCard,
    tags: ["Instant auth", "Chargeback aware"],
  },
  {
    title: "Bank transfer",
    description: "Dedicated virtual accounts and inline transfer instructions.",
    icon: RefreshCw,
    tags: ["Auto-reconcile", "Paystack/Flutterwave"],
  },
  {
    title: "USSD & mobile money",
    description: "USSD prompts, mobile wallets, and telco confirmations.",
    icon: Wallet,
    tags: ["Low-bandwidth", "Fallback friendly"],
  },
  {
    title: "QR & POS",
    description: "Paystack/Flutterwave QR codes with scannable receipts.",
    icon: Split,
    tags: ["Face-to-face", "Instant receipts"],
  },
  {
    title: "Wallet balance",
    description: "Platform wallet for top-ups, refunds, and partial payments.",
    icon: HandCoins,
    tags: ["Split-friendly", "Refund ready"],
  },
]

const paymentFlow = [
  {
    title: "Payment request",
    detail: "Customer sees garment total, taxes, and gateway fees before authorizing.",
    icon: CheckCircle2,
    highlight: "Customer places order ➜ price locked ➜ payment prompt.",
  },
  {
    title: "Gateway authorization",
    detail: "Secure card/transfer entry through Paystack or Flutterwave with OTP or bank auth.",
    icon: Shield,
    highlight: "PCI-DSS handled by gateway; platform never stores card data.",
  },
  {
    title: "Confirmation & receipts",
    detail: "Webhook confirms success; email/SMS receipts and order confirmation are sent.",
    icon: Mail,
    highlight: "Admin + tailor notified instantly, status updates the order.",
  },
  {
    title: "Fee calculation",
    detail: "Gateway fees, platform commissions, and split instructions calculated.",
    icon: PieChart,
    highlight: "Visible fee breakdown so the customer knows the exact debit.",
  },
]

const payoutModels = [
  {
    label: "Base payout",
    amount: "₦120,000",
    detail: "Tailor base after gateway fee (1.5%) and platform commission (10%).",
  },
  {
    label: "Split tailoring",
    amount: "₦70,000 / ₦50,000",
    detail: "Two-tailor split with role-based allocations and shared fee coverage.",
  },
  {
    label: "Commission reserve",
    amount: "₦15,000",
    detail: "Commission and operational buffer retained before payout runs.",
  },
]

const payoutSchedule = [
  { schedule: "Daily", promise: "Paid same-day once order hits Ready/Completed." },
  { schedule: "Weekly", promise: "Friday bulk payout with statement attached." },
  { schedule: "Monthly", promise: "Month-end reconciliation for high-volume shops." },
]

const trackingStatuses = [
  {
    title: "Incoming",
    detail: "Customer payment authorized; funds held while work starts.",
    badge: "Gateway confirmed",
  },
  {
    title: "Pending payout",
    detail: "Commission applied, fraud checks passed, queued for disbursement.",
    badge: "Queue",
  },
  {
    title: "Paid",
    detail: "Bank transfer or mobile wallet success; receipt emailed to tailor.",
    badge: "Settled",
  },
  {
    title: "Refund/Dispute",
    detail: "Admin handles reversals; tailor notified of clawback impact.",
    badge: "Action needed",
  },
]

const adminControls = [
  {
    title: "Commission & fees",
    detail: "Set flat or tiered commissions per tailor, garment, or campaign.",
    icon: Layers,
  },
  {
    title: "Approvals & holds",
    detail: "Approve large payouts, place fraud holds, and release funds in one click.",
    icon: BookCheck,
  },
  {
    title: "Reporting",
    detail: "Revenue, commissions, payout SLA, refunds, and exception exports.",
    icon: BarChart3,
  },
  {
    title: "Dispute desk",
    detail: "Audit trail for failed payments, refunds, and tailor payout claims.",
    icon: Ban,
  },
]

const notifications = [
  {
    title: "Instant alerts",
    detail: "Customer receives receipt; tailor and admin get confirmation with payout ETA.",
    icon: BellRing,
  },
  {
    title: "Scheduled reminders",
    detail: "Weekly payout reminders and settlement summaries for tailors.",
    icon: CalendarClock,
  },
  {
    title: "Failures & retries",
    detail: "Failed or pending transfers retried with clear guidance to the tailor.",
    icon: AlertTriangle,
  },
]

const resilience = [
  {
    title: "Fallback routes",
    detail: "Switch gateways or retry USSD/transfer automatically if a method is down.",
  },
  {
    title: "Webhook validation",
    detail: "Signatures checked before order status changes; mismatches trigger automatic holds.",
  },
  {
    title: "Audit & export",
    detail: "Charge, split, payout, and refund logs exportable for finance reviews.",
  },
]

const compliance = [
  {
    title: "PCI-DSS by design",
    detail: "Paystack/Flutterwave host all payment forms; platform avoids card storage.",
    icon: Lock,
  },
  {
    title: "Privacy & access control",
    detail: "Scoped access for customers, tailors, and admins with signed URLs for statements.",
    icon: Shield,
  },
  {
    title: "Fraud prevention",
    detail: "Email confirmations, optional 2FA on high-value orders, and anomaly alerts.",
    icon: Sparkles,
  },
]

const feeExamples = [
  {
    scenario: "Checkout — customer pays ₦100,000",
    customerPays: formatNaira(100000),
    adminFee: `${formatNaira(10000)} (10%) auto-deducted`,
    tailorGets: formatNaira(90000),
    note: "Split payment routes the fee to the platform subaccount at charge time.",
  },
  {
    scenario: "Tailor withdraws ₦90,000 earnings",
    customerPays: formatNaira(90000),
    adminFee: `${formatNaira(9000)} (10%) held on payout`,
    tailorGets: formatNaira(81000),
    note: "Withdrawal engine re-applies the platform fee before initiating the transfer.",
  },
  {
    scenario: "Escrow release for ₦250,000 job",
    customerPays: formatNaira(250000),
    adminFee: `${formatNaira(25000)} (10%)`,
    tailorGets: formatNaira(225000),
    note: "Escrow unlock verifies the original fee and nets the tailor automatically.",
  },
]

const checkoutGuardrails = [
  {
    title: "Frozen totals",
    detail: "Order amount + admin fee + gateway fees are read-only in the payment modal; edits re-trigger approval.",
  },
  {
    title: "Inline receipts",
    detail: "Receipts show garment price, platform fee, and transaction fee so disputes are simplified.",
  },
  {
    title: "Webhook verification",
    detail: "Webhook signatures confirm the charged amount matches the locked total before order status updates.",
  },
]

const payoutChartConfig = {
  earnings: {
    label: "Tailor earnings",
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig

const payoutChartData = [
  { day: "Mon", earnings: 120 },
  { day: "Tue", earnings: 180 },
  { day: "Wed", earnings: 160 },
  { day: "Thu", earnings: 240 },
  { day: "Fri", earnings: 320 },
  { day: "Sat", earnings: 280 },
  { day: "Sun", earnings: 200 },
]

export default function PaymentsPage() {
  const [activeTab, setActiveTab] = useState("checkout")

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/40">
      <header className="border-b border-border/80 bg-background/70 backdrop-blur">
        <div className="container mx-auto flex items-center justify-between px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-primary/10 p-2">
              <HandCoins className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Payments</p>
              <h1 className="text-xl font-semibold">Tailor Payment System</h1>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="gap-1">
              <Sparkles className="h-4 w-4" />
              App-like navigation
            </Badge>
            <Link href="/">
              <Button variant="ghost" size="sm" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back home
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 pb-16 pt-8">
        <Card className="rounded-3xl border-border/70 bg-background/70 shadow-xl">
          <CardHeader className="space-y-3 text-center">
            <Badge className="mx-auto w-fit gap-2" variant="secondary">
              <Activity className="h-4 w-4" />
              Guided workspace
            </Badge>
            <CardTitle className="text-3xl leading-tight">Collect, reconcile, and pay out with intent</CardTitle>
            <CardDescription className="text-lg">
              Pick a tab to open the slice you need—checkout, payouts, or compliance—without wading through a long page.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              <TabsList className="w-full justify-start overflow-x-auto">
                <TabsTrigger value="checkout">Checkout & fees</TabsTrigger>
                <TabsTrigger value="payouts">Payouts & tracking</TabsTrigger>
                <TabsTrigger value="compliance">Compliance & safety</TabsTrigger>
              </TabsList>

              <TabsContent value="checkout" className="space-y-6 animate-in fade-in slide-in-from-bottom duration-500">
                <Card className="shadow-sm">
                  <CardHeader className="space-y-2">
                    <CardTitle>Payment methods</CardTitle>
                    <CardDescription>Compact list with tags—tap to expand on mobile.</CardDescription>
                  </CardHeader>
                  <CardContent className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {paymentMethods.map((method) => (
                      <div
                        key={method.title}
                        className="rounded-xl border border-border/70 bg-muted/50 p-4 transition hover:-translate-y-1 hover:shadow-lg"
                      >
                        <div className="flex items-center gap-2 text-sm font-semibold">
                          <method.icon className="h-4 w-4 text-primary" />
                          {method.title}
                        </div>
                        <p className="mt-2 text-sm text-muted-foreground">{method.description}</p>
                        <div className="mt-3 flex flex-wrap gap-2">
                          {method.tags.map((tag) => (
                            <Badge key={tag} variant="outline">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <div className="grid gap-4 lg:grid-cols-[1.4fr_0.6fr]">
                  <Card className="shadow-sm">
                    <CardHeader>
                      <CardTitle>Payment flow</CardTitle>
                      <CardDescription>Inline steps with fee clarity and confirmations.</CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-3 md:grid-cols-2">
                      {paymentFlow.map((step) => (
                        <div key={step.title} className="rounded-lg border border-border/70 bg-background/80 p-4">
                          <div className="flex items-center gap-2">
                            <span className="rounded-full bg-primary/10 p-2">
                              <step.icon className="h-5 w-5 text-primary" />
                            </span>
                            <p className="font-semibold">{step.title}</p>
                          </div>
                          <p className="text-sm text-muted-foreground">{step.detail}</p>
                          <Badge variant="outline" className="mt-2 w-fit">
                            {step.highlight}
                          </Badge>
                        </div>
                      ))}
                    </CardContent>
                  </Card>

                  <Card className="shadow-sm">
                    <CardHeader>
                      <CardTitle>Immutable totals</CardTitle>
                      <CardDescription>Nothing moves unless it passes verification.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3 text-sm text-muted-foreground">
                      {checkoutGuardrails.map((item) => (
                        <div key={item.title} className="rounded-lg border border-border/70 bg-muted/60 p-3">
                          <p className="font-semibold text-foreground">{item.title}</p>
                          <p>{item.detail}</p>
                        </div>
                      ))}
                      <div className="rounded-lg border border-dashed border-primary/40 bg-primary/5 p-3 text-primary">
                        Fees + totals are locked before hitting the gateway; webhooks re-confirm the math before status changes.
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Card className="shadow-sm">
                  <CardHeader>
                    <CardTitle>Admin fee math</CardTitle>
                    <CardDescription>Clear breakdown across checkout, escrow, and withdrawals.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="overflow-hidden rounded-lg border border-border/70 bg-muted/50">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Scenario</TableHead>
                            <TableHead>Admin fee</TableHead>
                            <TableHead>Tailor receives</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {feeExamples.map((example) => (
                            <TableRow key={example.scenario}>
                              <TableCell className="font-medium">
                                <div className="flex flex-col">
                                  <span>{example.scenario}</span>
                                  <span className="text-xs text-muted-foreground">Customer pays {example.customerPays}</span>
                                </div>
                              </TableCell>
                              <TableCell className="text-muted-foreground">{example.adminFee}</TableCell>
                              <TableCell>
                                <div className="flex flex-col">
                                  <span className="font-semibold text-foreground">{example.tailorGets}</span>
                                  <span className="text-xs text-muted-foreground">{example.note}</span>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                    <div className="grid gap-3 md:grid-cols-3">
                      {payoutSchedule.map((item) => (
                        <div key={item.schedule} className="rounded-lg border border-border/70 bg-background/80 p-3 text-sm">
                          <div className="flex items-center justify-between">
                            <p className="font-semibold">{item.schedule}</p>
                            <Badge variant="outline">Payout</Badge>
                          </div>
                          <p className="text-muted-foreground">{item.promise}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="payouts" className="space-y-6 animate-in fade-in slide-in-from-bottom duration-500">
                <div className="grid gap-4 lg:grid-cols-[1.3fr_0.7fr]">
                  <Card className="shadow-sm">
                    <CardHeader>
                      <CardTitle>Payout momentum</CardTitle>
                      <CardDescription>Example weekly trend with SLA badges.</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ChartContainer config={payoutChartConfig} className="h-[220px] w-full rounded-lg border border-border/70">
                        <BarChart data={payoutChartData} margin={{ left: 12, right: 12 }}>
                          <CartesianGrid vertical={false} strokeDasharray="3 3" />
                          <XAxis dataKey="day" tickLine={false} axisLine={false} />
                          <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                          <Bar dataKey="earnings" radius={6} fill="var(--color-earnings)" />
                        </BarChart>
                      </ChartContainer>
                      <div className="mt-4 flex flex-wrap gap-2">
                        <Badge variant="secondary" className="gap-1">
                          <Timer className="h-4 w-4" />
                          24h payout SLA
                        </Badge>
                        <Badge variant="secondary" className="gap-1">
                          <Split className="h-4 w-4" />
                          Splits auto-applied
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="shadow-sm">
                    <CardHeader>
                      <CardTitle>Tracking states</CardTitle>
                      <CardDescription>Each stage is a card—open what you need.</CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-3 sm:grid-cols-2">
                      {trackingStatuses.map((status) => (
                        <div key={status.title} className="rounded-lg border border-border/70 bg-muted/50 p-3 text-sm">
                          <div className="flex items-center justify-between">
                            <p className="font-semibold">{status.title}</p>
                            <Badge variant="outline">{status.badge}</Badge>
                          </div>
                          <p className="text-muted-foreground">{status.detail}</p>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </div>

                <Card className="shadow-sm">
                  <CardHeader>
                    <CardTitle>Admin console</CardTitle>
                    <CardDescription>Approvals, holds, reporting, and dispute handling.</CardDescription>
                  </CardHeader>
                  <CardContent className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    {adminControls.map((item) => (
                      <div key={item.title} className="rounded-lg border border-border/70 bg-background/80 p-4 text-sm">
                        <div className="mb-2 flex items-center gap-2 font-semibold text-foreground">
                          <item.icon className="h-4 w-4 text-primary" />
                          {item.title}
                        </div>
                        <p className="text-muted-foreground">{item.detail}</p>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <Card className="shadow-sm">
                  <CardHeader>
                    <CardTitle>Notifications & nudges</CardTitle>
                    <CardDescription>Multi-channel updates keep payouts predictable.</CardDescription>
                  </CardHeader>
                  <CardContent className="grid gap-3 sm:grid-cols-3">
                    {notifications.map((item) => (
                      <div key={item.title} className="rounded-lg border border-border/70 bg-muted/50 p-3 text-sm">
                        <div className="mb-2 flex items-center gap-2 font-semibold text-foreground">
                          <item.icon className="h-4 w-4 text-primary" />
                          {item.title}
                        </div>
                        <p className="text-muted-foreground">{item.detail}</p>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="compliance" className="space-y-6 animate-in fade-in slide-in-from-bottom duration-500">
                <Card className="shadow-sm">
                  <CardHeader>
                    <CardTitle>Compliance guardrails</CardTitle>
                    <CardDescription>Security and fraud prevention baked into the flow.</CardDescription>
                  </CardHeader>
                  <CardContent className="grid gap-3 md:grid-cols-3">
                    {compliance.map((item) => (
                      <div key={item.title} className="rounded-lg border border-border/70 bg-muted/50 p-4 text-sm">
                        <div className="mb-2 flex items-center gap-2 font-semibold text-foreground">
                          <item.icon className="h-4 w-4 text-primary" />
                          {item.title}
                        </div>
                        <p className="text-muted-foreground">{item.detail}</p>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <Card className="shadow-sm">
                  <CardHeader>
                    <CardTitle>Resilience playbook</CardTitle>
                    <CardDescription>Fallbacks, validation, and exports when things wobble.</CardDescription>
                  </CardHeader>
                  <CardContent className="grid gap-3 md:grid-cols-3">
                    {resilience.map((item) => (
                      <div key={item.title} className="rounded-lg border border-border/70 bg-background/80 p-3 text-sm">
                        <p className="font-semibold text-foreground">{item.title}</p>
                        <p className="text-muted-foreground">{item.detail}</p>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <Card className="shadow-sm border-dashed border-primary/40 bg-primary/5">
                  <CardHeader>
                    <CardTitle>Off-platform deterrence</CardTitle>
                    <CardDescription>Visibility, math, and policy to keep payments inside.</CardDescription>
                  </CardHeader>
                  <CardContent className="grid gap-3 lg:grid-cols-3">
                    <div className="rounded-lg border border-border/70 bg-background/80 p-3 text-sm">
                      <div className="mb-2 flex items-center gap-2 font-semibold text-foreground">
                        <ReceiptText className="h-4 w-4 text-primary" />
                        Transparent invoices
                      </div>
                      <p className="text-muted-foreground">Receipts display garment, platform fee, and gateway fee so disputes use the same math.</p>
                    </div>
                    <div className="rounded-lg border border-border/70 bg-background/80 p-3 text-sm">
                      <div className="mb-2 flex items-center gap-2 font-semibold text-foreground">
                        <Scale className="h-4 w-4 text-primary" />
                        Policy-backed
                      </div>
                      <p className="text-muted-foreground">Terms + monitoring keep cash detours from slipping through.</p>
                    </div>
                    <div className="rounded-lg border border-border/70 bg-background/80 p-3 text-sm">
                      <div className="mb-2 flex items-center gap-2 font-semibold text-foreground">
                        <TrendingUp className="h-4 w-4 text-primary" />
                        Incentivized compliance
                      </div>
                      <p className="text-muted-foreground">Prompt payouts and boosted visibility for tailors who stay on-platform.</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <Separator className="my-10" />

        <Card className="border-dashed border-primary/40 bg-primary/5 shadow-sm">
          <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle>Hop to orders or designs</CardTitle>
              <CardDescription>Keep the experience compact—jump sections without scrolling.</CardDescription>
            </div>
            <div className="flex flex-wrap gap-2">
              <Link href="/orders-system">
                <Button variant="outline" className="bg-background">
                  Orders console
                </Button>
              </Link>
              <Link href="/designs">
                <Button variant="secondary" className="gap-2">
                  <Sparkles className="h-4 w-4" />
                  Design gallery
                </Button>
              </Link>
            </div>
          </CardHeader>
        </Card>
      </main>
    </div>
  )
}
