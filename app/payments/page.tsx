'use client'

import Link from "next/link"
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
  FileWarning,
  Fingerprint,
  HandCoins,
  HeartHandshake,
  Layers,
  Lock,
  Mail,
  PieChart,
  QrCode,
  ReceiptText,
  RefreshCw,
  Repeat,
  Scale,
  Shield,
  Siren,
  Sparkles,
  Split,
  Timer,
  TrendingUp,
  Workflow,
  Wallet,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"

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
    icon: Repeat,
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
    icon: QrCode,
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
    detail: "Gateway fees (1.5–3%), platform commissions, and split instructions calculated.",
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
    icon: FileWarning,
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
    title: "Failed transactions",
    detail: "Customer prompted to retry or switch method; tailor flagged that payment is pending.",
  },
  {
    title: "Refunds & reversals",
    detail: "Admin issues refunds through gateway, with order rollbacks and notifications.",
  },
  {
    title: "Disputes",
    detail: "Evidence capture, admin resolution, and payout adjustments with audit history.",
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

const feeIntegrity = [
  {
    title: "Locked admin fee",
    detail: "Platform fee is injected into checkout and cannot be removed by either customer or tailor.",
    badge: "Required",
  },
  {
    title: "Gateway split",
    detail: "Paystack/Flutterwave split payments route the admin fee to the platform subaccount at charge time.",
    badge: "No bypass",
  },
  {
    title: "Net preview",
    detail: "Tailors see their net after fees before accepting work, mirroring the customer-facing breakdown.",
    badge: "Transparent",
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

const offPlatformPrevention = [
  {
    title: "In-app only",
    detail: "Messaging, design uploads, and approvals stay in-app so customers and tailors cannot swap external payment links.",
    badge: "No external links",
  },
  {
    title: "Policy enforcement",
    detail: "Terms of Service highlights fee bypass consequences; repeated attempts trigger account holds.",
    badge: "Escalations",
  },
  {
    title: "Keyword guardrails",
    detail: "Mentions of cash/bank details in chat raise admin reviews and guidance nudges to stay on-platform.",
    badge: "Safe comms",
  },
]

const auditAndAlerts = [
  {
    title: "Audit trail",
    detail: "Charge, split, webhook, payout, and refund events are timestamped with actor and gateway references.",
  },
  {
    title: "Anomaly alerts",
    detail: "Alerts fire when tailors attempt direct payments, customers adjust totals, or payouts deviate from rules.",
  },
  {
    title: "Exportable logs",
    detail: "Admins download CSV/JSON for disputes or reconciliation, backed by signed URLs for security.",
  },
]

const incentivePrograms = [
  {
    title: "Loyalty for compliance",
    detail: "Customers earn points or discounts after successful on-platform payments over time.",
    badge: "+Rewards",
  },
  {
    title: "Tailor reliability score",
    detail: "Tailors who always accept on-platform payments gain boosted visibility and quicker payouts.",
    badge: "+Visibility",
  },
  {
    title: "Graduated penalties",
    detail: "Warnings, temporary holds, then suspensions apply for repeated bypass attempts.",
    badge: "Fair but firm",
  },
]

const apiBlueprint = [
  {
    title: "Fee calculation API",
    detail: "Backend computes garment total, platform fee, and gateway fee before generating Paystack/Flutterwave links.",
  },
  {
    title: "Split instruction",
    detail: "Subaccount codes and split ratios are attached to the charge request; settlement follows the blueprint automatically.",
  },
  {
    title: "Secure confirmations",
    detail: "Webhook handlers verify signatures, compare expected vs. charged amounts, and unlock order state transitions.",
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

const feeExamples = [
  {
    scenario: "Checkout — customer pays $100",
    customerPays: "$100",
    adminFee: "$10 (10%) auto-deducted",
    tailorGets: "$90",
    note: "Split payment routes the fee to the platform subaccount at charge time.",
  },
  {
    scenario: "Tailor withdraws $90 earnings",
    customerPays: "$90",
    adminFee: "$9 (10%) held on payout",
    tailorGets: "$81",
    note: "Withdrawal engine re-applies the platform fee before initiating the transfer.",
  },
  {
    scenario: "Escrow release for $250 job",
    customerPays: "$250",
    adminFee: "$25 (10%)",
    tailorGets: "$225",
    note: "Escrow unlock verifies the original fee and nets the tailor automatically.",
  },
]

const enforcementPolicies = [
  {
    title: "Locked admin fee",
    detail: "10% platform fee is injected into checkout payloads and removed only by admin policy updates.",
    badge: "Mandatory",
  },
  {
    title: "Withdrawal netting",
    detail: "Payouts recompute commissions on current balance so tailors cannot skip the fee at cash-out.",
    badge: "At payout",
  },
  {
    title: "Immutable invoices",
    detail: "Receipts show garment price, platform fee, and tailor net so disputes reference the same math.",
    badge: "Audit ready",
  },
]

const tosControls = [
  {
    title: "TOS & contracts",
    detail: "Order acceptance binds customers and tailors to platform-only payments with clear penalties.",
    badge: "Binding",
  },
  {
    title: "Anti-circumvention",
    detail: "Chat filters block bank details or external links; attempts trigger warnings and holds.",
    badge: "No side deals",
  },
  {
    title: "Admin interventions",
    detail: "Repeated bypass attempts escalate from nudges to temporary holds to account suspension.",
    badge: "Escalation",
  },
]

const monitoringControls = [
  {
    title: "Real-time flags",
    detail: "Payment monitor detects amount deltas, cash keywords, and offline receipts; orders pause until reviewed.",
    icon: Siren,
  },
  {
    title: "Evidence & audit trail",
    detail: "Webhook events, payout runs, and chat warnings are timestamped for dispute resolution.",
    icon: FileWarning,
  },
  {
    title: "Automatic holds",
    detail: "If webhook totals differ from the locked checkout, payouts halt and admins get alerted instantly.",
    icon: Lock,
  },
]

const alertEscalations = [
  {
    stage: "Warning",
    detail: "First external-payment attempt sends in-app + email notice with guidance to complete checkout on-platform.",
  },
  {
    stage: "Temporary hold",
    detail: "Repeat violations freeze order progress and payouts until the admin reviews documentation.",
  },
  {
    stage: "Account action",
    detail: "Persistent bypassing leads to suspension or monetary penalties per the Terms of Service.",
  },
]

const escrowSteps = [
  {
    title: "Payment captured",
    detail: "Customer pays into escrow; totals include admin fee and gateway fee.",
  },
  {
    title: "Work completed",
    detail: "Customer approves delivery; system re-validates against original charge and fee signature.",
  },
  {
    title: "Release & net",
    detail: "Escrow releases funds, auto-deducts the 10% platform fee, and pays the tailor the net amount.",
  },
]

export default function PaymentsPage() {
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
              Paystack & Flutterwave ready
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
        <section className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
          <Card className="border-primary/20 shadow-lg shadow-primary/5">
            <CardHeader>
              <Badge className="w-fit gap-2" variant="secondary">
                <Activity className="h-4 w-4" />
                Real-time tracking
              </Badge>
              <CardTitle className="text-3xl leading-tight">
                Collect payments, pay tailors fast, and keep everyone informed.
              </CardTitle>
              <CardDescription className="text-base">
                One-time payments, splits, commissions, and transaction fees are handled in one place with instant
                notifications and exportable statements.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              <div className="rounded-lg border border-border bg-muted/40 p-4">
                <p className="text-sm text-muted-foreground">Customer checkout</p>
                <p className="text-2xl font-semibold">Multi-method with fee clarity</p>
                <p className="text-sm text-muted-foreground">
                  Cards, transfers, USSD, QR, and wallet options exposed with clear fees before authorization.
                </p>
              </div>
              <div className="rounded-lg border border-border bg-muted/40 p-4">
                <p className="text-sm text-muted-foreground">Tailor payouts</p>
                <p className="text-2xl font-semibold">Scheduled & auditable</p>
                <p className="text-sm text-muted-foreground">
                  Daily, weekly, or monthly disbursements with receipts, splits, and commission deductions.
                </p>
              </div>
              <div className="rounded-lg border border-border bg-muted/40 p-4">
                <p className="text-sm text-muted-foreground">Admin visibility</p>
                <p className="text-2xl font-semibold">Oversight & approvals</p>
                <p className="text-sm text-muted-foreground">
                  Central dashboard for payment status, commission changes, refunds, and dispute handling.
                </p>
              </div>
              <div className="rounded-lg border border-border bg-muted/40 p-4">
                <p className="text-sm text-muted-foreground">Receipts & alerts</p>
                <p className="text-2xl font-semibold">Email + SMS + push</p>
                <p className="text-sm text-muted-foreground">
                  Every stage confirmed to customer and tailor with SLA reminders and retry notices.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-primary/20 shadow-lg shadow-primary/5">
            <CardHeader>
              <Badge variant="outline" className="w-fit gap-2">
                <TrendingUp className="h-4 w-4" />
                Tailor earnings glance
              </Badge>
              <CardTitle className="text-2xl">Weekly payout momentum</CardTitle>
              <CardDescription>Example payout trend including completed and queued transfers.</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={payoutChartConfig}
                className="h-[240px] w-full rounded-lg border border-border bg-muted/40"
              >
                <BarChart data={payoutChartData} margin={{ left: 12, right: 12 }}>
                  <CartesianGrid vertical={false} strokeDasharray="3 3" />
                  <XAxis dataKey="day" tickLine={false} axisLine={false} />
                  <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                  <Bar dataKey="earnings" radius={6} fill="var(--color-earnings)" />
                </BarChart>
              </ChartContainer>
              <div className="mt-4 flex flex-wrap gap-3">
                <Badge variant="secondary" className="gap-1">
                  <Timer className="h-4 w-4" />
                  SLA <span className="font-semibold text-foreground">under 24h</span> to pay tailors
                </Badge>
                <Badge variant="secondary" className="gap-1">
                  <Split className="h-4 w-4" />
                  Splits & commissions applied automatically
                </Badge>
              </div>
            </CardContent>
          </Card>
        </section>

        <section className="mt-6 grid gap-6 lg:grid-cols-[1.3fr_1fr]">
          <Card className="border-primary/30 shadow-lg shadow-primary/10">
            <CardHeader className="space-y-3">
              <Badge variant="secondary" className="gap-2">
                <Scale className="h-4 w-4" />
                Auto-fee enforcement
              </Badge>
              <CardTitle className="text-2xl">Admin fee on every charge and payout</CardTitle>
              <CardDescription>
                Checkout, escrow release, and tailor withdrawals always deduct the platform fee so it cannot be
                bypassed.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="overflow-hidden rounded-lg border border-border bg-muted/40">
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
                {enforcementPolicies.map((item) => (
                  <div key={item.title} className="rounded-lg border border-border bg-background/70 p-3">
                    <div className="flex items-center justify-between">
                      <p className="font-semibold">{item.title}</p>
                      <Badge variant="outline">{item.badge}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{item.detail}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="h-full border-border/80">
            <CardHeader className="space-y-3">
              <Badge variant="outline" className="w-fit gap-2">
                <FileLock2 className="h-4 w-4" />
                Terms & enforcement
              </Badge>
              <CardTitle className="text-xl">Bound to platform payments</CardTitle>
              <CardDescription>
                Clear Terms of Service, binding contracts, and automated holds keep transactions inside the platform.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {tosControls.map((item) => (
                <div key={item.title} className="rounded-lg border border-border bg-muted/40 p-3">
                  <div className="flex items-center justify-between">
                    <p className="font-semibold">{item.title}</p>
                    <Badge variant="secondary">{item.badge}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{item.detail}</p>
                </div>
              ))}
              <div className="rounded-lg border border-dashed border-primary/40 bg-primary/5 p-3">
                <p className="text-sm font-semibold text-primary">Binding acceptance</p>
                <p className="text-sm text-muted-foreground">
                  Customers and tailors must accept platform-only payments before work starts; order progress halts if
                  off-platform behavior is detected.
                </p>
              </div>
            </CardContent>
          </Card>
        </section>

        <Separator className="my-10" />

        <section className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
          <Card className="border-primary/30 shadow-lg shadow-primary/10">
            <CardHeader className="space-y-3">
              <Badge variant="secondary" className="gap-2">
                <FileLock2 className="h-4 w-4" />
                Admin fee integrity
              </Badge>
              <CardTitle className="text-2xl">Transparent, non-bypassable fees</CardTitle>
              <CardDescription>
                The admin service fee is injected into every checkout and routed via Paystack/Flutterwave splits so no
                one can bypass the platform cut.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-3 md:grid-cols-3">
              {feeIntegrity.map((item) => (
                <div key={item.title} className="rounded-lg border border-border bg-muted/40 p-3">
                  <div className="flex items-center justify-between">
                    <p className="font-semibold">{item.title}</p>
                    <Badge variant="outline">{item.badge}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{item.detail}</p>
                </div>
              ))}
              <div className="md:col-span-3 rounded-lg border border-dashed border-primary/40 bg-primary/5 p-4">
                <div className="flex items-center gap-2">
                  <Fingerprint className="h-4 w-4 text-primary" />
                  <p className="text-sm font-semibold text-primary">Gateway-confirmed truth</p>
                </div>
                <p className="text-sm text-muted-foreground">
                  Fee amounts are computed server-side, signed, and echoed back by the gateway webhook to prevent client
                  tampering.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="space-y-3">
              <Badge variant="outline" className="w-fit gap-2">
                <ReceiptText className="h-4 w-4" />
                Checkout guardrails
              </Badge>
              <CardTitle className="text-xl">Locked totals and receipts</CardTitle>
              <CardDescription>Customers and tailors see immutable totals before payment authorization.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {checkoutGuardrails.map((item) => (
                <div key={item.title} className="rounded-lg border border-border bg-muted/40 p-3">
                  <p className="font-semibold">{item.title}</p>
                  <p className="text-sm text-muted-foreground">{item.detail}</p>
                </div>
              ))}
              <div className="rounded-lg border border-primary/30 bg-primary/5 p-3">
                <p className="text-sm font-semibold text-primary">Show the math</p>
                <p className="text-sm text-muted-foreground">
                  Order amount + admin fee + gateway fee are line items so customers know exactly why they are paying
                  the total shown.
                </p>
              </div>
            </CardContent>
          </Card>
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Badge variant="secondary" className="gap-2">
                <CreditCard className="h-4 w-4" />
                Customer checkout
              </Badge>
              <p className="text-sm text-muted-foreground">
                One-time payments with transparent gateway fees and receipts.
              </p>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {paymentMethods.map((method) => (
                <Card key={method.title} className="h-full">
                  <CardHeader className="space-y-2">
                    <div className="flex items-center gap-2">
                      <method.icon className="h-5 w-5 text-primary" />
                      <CardTitle className="text-lg">{method.title}</CardTitle>
                    </div>
                    <CardDescription>{method.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex flex-wrap gap-2">
                    {method.tags.map((tag) => (
                      <Badge key={tag} variant="outline">
                        {tag}
                      </Badge>
                    ))}
                  </CardContent>
                </Card>
              ))}
            </div>
            <Card className="border-dashed border-primary/30 bg-primary/5">
              <CardHeader className="space-y-2">
                <div className="flex items-center gap-2">
                  <Timer className="h-5 w-5 text-primary" />
                  <CardTitle className="text-xl">Payment flow</CardTitle>
                </div>
                <CardDescription>What the customer experiences from order creation to confirmation.</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-3 md:grid-cols-2">
                {paymentFlow.map((step) => (
                  <div key={step.title} className="rounded-lg border border-border bg-background/80 p-3 shadow-sm">
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
          </div>

          <Card className="h-full">
            <CardHeader>
              <Badge variant="outline" className="w-fit gap-2">
                <PieChart className="h-4 w-4" />
                Fees & splits
              </Badge>
              <CardTitle>Live fee visibility</CardTitle>
              <CardDescription>
                Customer sees gateway fees, platform commission, and tailor share before confirming the payment.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {payoutModels.map((payout) => (
                <div key={payout.label} className="rounded-lg border border-border bg-muted/40 p-3">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">{payout.label}</p>
                    <Badge variant="secondary">{payout.amount}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{payout.detail}</p>
                </div>
              ))}
              <div className="rounded-lg border border-dashed border-primary/40 bg-primary/5 p-4">
                <p className="text-sm font-semibold text-primary">Transparent checkout</p>
                <p className="text-sm text-muted-foreground">
                  Show total debit, transaction fees, and tailor take-home so customers know exactly who gets paid and
                  when.
                </p>
              </div>
            </CardContent>
          </Card>
        </section>

        <Separator className="my-10" />

        <section className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
          <Card className="border-border/80">
            <CardHeader className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
              <div>
                <Badge variant="secondary" className="gap-2">
                  <HandCoins className="h-4 w-4" />
                  Tailor payouts
                </Badge>
                <CardTitle className="mt-2 text-2xl">Commission-aware disbursements</CardTitle>
                <CardDescription>Automatic calculations with admin oversight before funds leave the platform.</CardDescription>
              </div>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline">Daily / Weekly / Monthly</Badge>
                <Badge variant="outline">Bank transfer or mobile wallet</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Schedule</TableHead>
                    <TableHead>Promise</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {payoutSchedule.map((row) => (
                    <TableRow key={row.schedule}>
                      <TableCell className="font-medium">{row.schedule}</TableCell>
                      <TableCell className="text-muted-foreground">{row.promise}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <div className="grid gap-3 md:grid-cols-3">
                <div className="rounded-lg border border-border bg-muted/40 p-3">
                  <p className="text-sm font-semibold">Auto statements</p>
                  <p className="text-sm text-muted-foreground">
                    Tailors receive payout PDFs with earnings, commissions, and fees.
                  </p>
                </div>
                <div className="rounded-lg border border-border bg-muted/40 p-3">
                  <p className="text-sm font-semibold">Split-ready</p>
                  <p className="text-sm text-muted-foreground">
                    Multiple tailors can be paid per order with role-based percentages.
                  </p>
                </div>
                <div className="rounded-lg border border-border bg-muted/40 p-3">
                  <p className="text-sm font-semibold">Transfer tracking</p>
                  <p className="text-sm text-muted-foreground">
                    Settlement reference, gateway status, and ETA visible to admin & tailor.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="h-full border-border/80">
            <CardHeader>
              <Badge variant="outline" className="w-fit gap-2">
                <Activity className="h-4 w-4" />
                Status tracking
              </Badge>
              <CardTitle>Customer ➜ Tailor visibility</CardTitle>
              <CardDescription>
                Each order exposes where the money is, how fees were applied, and when payout happens.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {trackingStatuses.map((status) => (
                <div key={status.title} className="rounded-lg border border-border bg-muted/40 p-3">
                  <div className="flex items-center justify-between">
                    <p className="font-semibold">{status.title}</p>
                    <Badge variant="secondary">{status.badge}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{status.detail}</p>
                </div>
              ))}
              <div className="rounded-lg border border-primary/30 bg-primary/5 p-3">
                <p className="text-sm font-semibold text-primary">Order timeline</p>
                <p className="text-sm text-muted-foreground">
                  Timestamped events for charge, confirmation, commission, payout queued, and payout settled keep both
                  customer and tailor aligned.
                </p>
              </div>
            </CardContent>
          </Card>
        </section>

        <Separator className="my-10" />

        <section className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
          <Card className="border-border/80">
            <CardHeader className="space-y-3">
              <Badge variant="secondary" className="gap-2">
                <Shield className="h-4 w-4" />
                Off-platform prevention
              </Badge>
              <CardTitle className="text-2xl">Keep payments inside the platform</CardTitle>
              <CardDescription>
                Messaging and collaboration are designed to discourage cash or side deals while keeping admins informed.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-3 md:grid-cols-3">
              {offPlatformPrevention.map((item) => (
                <div key={item.title} className="rounded-lg border border-border bg-muted/40 p-3">
                  <div className="flex items-center justify-between">
                    <p className="font-semibold">{item.title}</p>
                    <Badge variant="outline">{item.badge}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{item.detail}</p>
                </div>
              ))}
              <div className="md:col-span-3 rounded-lg border border-primary/30 bg-primary/5 p-3">
                <div className="flex items-center gap-2">
                  <Ban className="h-4 w-4 text-primary" />
                  <p className="text-sm font-semibold text-primary">No external payments</p>
                </div>
                <p className="text-sm text-muted-foreground">
                  Off-platform payment attempts pause order progress until admins review and guide both parties back to
                  Paystack/Flutterwave checkout.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="h-full">
            <CardHeader>
              <Badge variant="outline" className="w-fit gap-2">
                <BarChart3 className="h-4 w-4" />
                Audit & alerts
              </Badge>
              <CardTitle>Every payment has a paper trail</CardTitle>
              <CardDescription>Admins have the evidence needed to intervene fast.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {auditAndAlerts.map((item) => (
                <div key={item.title} className="rounded-lg border border-border bg-muted/40 p-3">
                  <p className="font-semibold">{item.title}</p>
                  <p className="text-sm text-muted-foreground">{item.detail}</p>
                </div>
              ))}
              <div className="rounded-lg border border-dashed border-primary/40 bg-primary/5 p-3">
                <div className="flex items-center gap-2">
                  <Siren className="h-4 w-4 text-primary" />
                  <p className="text-sm font-semibold text-primary">Real-time nudge</p>
                </div>
                <p className="text-sm text-muted-foreground">
                  Tailors and customers receive alerts if totals shift or if payouts are held for compliance, keeping
                  everyone aligned.
                </p>
              </div>
            </CardContent>
          </Card>
        </section>

        <Separator className="my-10" />

        <section className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
          <Card>
            <CardHeader className="space-y-3">
              <Badge variant="secondary" className="gap-2">
                <Siren className="h-4 w-4" />
                Monitoring & alerts
              </Badge>
              <CardTitle className="text-2xl">Detect and block fee bypass attempts</CardTitle>
              <CardDescription>
                Real-time signals pause risky orders, keep payouts on hold, and alert admins before money moves.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-3 md:grid-cols-3">
                {monitoringControls.map((item) => (
                  <div key={item.title} className="rounded-lg border border-border bg-muted/40 p-3">
                    <div className="flex items-center gap-2">
                      <item.icon className="h-5 w-5 text-primary" />
                      <p className="font-semibold">{item.title}</p>
                    </div>
                    <p className="text-sm text-muted-foreground">{item.detail}</p>
                  </div>
                ))}
              </div>
              <div className="rounded-lg border border-primary/30 bg-primary/5 p-4">
                <p className="text-sm font-semibold text-primary">Escalation ladder</p>
                <ol className="mt-2 space-y-2 text-sm text-muted-foreground">
                  {alertEscalations.map((alert) => (
                    <li key={alert.stage}>
                      <span className="font-semibold text-foreground">{alert.stage}:</span> {alert.detail}
                    </li>
                  ))}
                </ol>
              </div>
            </CardContent>
          </Card>

          <Card className="h-full">
            <CardHeader className="space-y-3">
              <Badge variant="outline" className="w-fit gap-2">
                <Shield className="h-4 w-4" />
                Escrow & releases
              </Badge>
              <CardTitle>Secure payouts with auto deductions</CardTitle>
              <CardDescription>
                Funds stay in escrow until completion; release automatically recomputes and deducts the admin fee.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {escrowSteps.map((step, index) => (
                <div key={step.title} className="rounded-lg border border-border bg-muted/40 p-3">
                  <div className="flex items-center justify-between">
                    <p className="font-semibold">{step.title}</p>
                    <Badge variant="secondary">Step {index + 1}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{step.detail}</p>
                </div>
              ))}
              <div className="rounded-lg border border-dashed border-primary/40 bg-primary/5 p-3">
                <p className="text-sm font-semibold text-primary">Fee integrity on release</p>
                <p className="text-sm text-muted-foreground">
                  Escrow release compares gateway webhook amounts to locked checkout totals, netting the tailor after
                  confirming the platform fee and gateway fee match.
                </p>
              </div>
            </CardContent>
          </Card>
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
          <Card>
            <CardHeader className="space-y-3">
              <Badge variant="secondary" className="gap-2">
                <Sparkles className="h-4 w-4" />
                Admin controls
              </Badge>
              <CardTitle className="text-2xl">Oversight for commissions, payouts, and disputes</CardTitle>
              <CardDescription>Centralized dashboard to monitor inflows, outflows, and exceptions.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              {adminControls.map((item) => (
                <div key={item.title} className="rounded-lg border border-border bg-muted/40 p-3">
                  <div className="flex items-center gap-2">
                    <item.icon className="h-5 w-5 text-primary" />
                    <p className="font-semibold">{item.title}</p>
                  </div>
                  <p className="text-sm text-muted-foreground">{item.detail}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="h-full">
            <CardHeader>
              <Badge variant="outline" className="w-fit gap-2">
                <BellRing className="h-4 w-4" />
                Notifications & reminders
              </Badge>
              <CardTitle>Real-time & scheduled comms</CardTitle>
              <CardDescription>Push, email, and SMS keep customers, tailors, and admins aligned.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {notifications.map((item) => (
                <div key={item.title} className="rounded-lg border border-border bg-muted/40 p-3">
                  <div className="flex items-center gap-2">
                    <item.icon className="h-5 w-5 text-primary" />
                    <p className="font-semibold">{item.title}</p>
                  </div>
                  <p className="text-sm text-muted-foreground">{item.detail}</p>
                </div>
              ))}
              <div className="rounded-lg border border-dashed border-primary/40 bg-primary/5 p-3">
                <p className="text-sm font-semibold text-primary">SLA awareness</p>
                <p className="text-sm text-muted-foreground">
                  Tailors see countdowns to payout windows; admins see delays with nudges and retry options.
                </p>
              </div>
            </CardContent>
          </Card>
        </section>

        <Separator className="my-10" />

        <section className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
          <Card className="border-border/80">
            <CardHeader className="space-y-3">
              <Badge variant="secondary" className="gap-2">
                <RefreshCw className="h-4 w-4" />
                Issue handling
              </Badge>
              <CardTitle className="text-2xl">Payment issue resolution & support</CardTitle>
              <CardDescription>
                Failed transactions, refunds, and disputes have guided paths and notifications to every role.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-3 md:grid-cols-3">
              {resilience.map((item) => (
                <div key={item.title} className="rounded-lg border border-border bg-muted/40 p-3">
                  <p className="font-semibold">{item.title}</p>
                  <p className="text-sm text-muted-foreground">{item.detail}</p>
                </div>
              ))}
              <div className="md:col-span-3 rounded-lg border border-dashed border-primary/40 bg-primary/5 p-3">
                <p className="text-sm font-semibold text-primary">Refund tracking</p>
                <p className="text-sm text-muted-foreground">
                  Status for initiated, processing, and completed refunds with alerts to both customer and tailor.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="h-full border-border/80">
            <CardHeader>
              <Badge variant="outline" className="w-fit gap-2">
                <Lock className="h-4 w-4" />
                Security & UX
              </Badge>
              <CardTitle>Security, compliance, and thoughtful UX</CardTitle>
              <CardDescription>Designed like Uber payouts: safe, clear, and fast.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {compliance.map((item) => (
                <div key={item.title} className="rounded-lg border border-border bg-muted/40 p-3">
                  <div className="flex items-center gap-2">
                    <item.icon className="h-5 w-5 text-primary" />
                    <p className="font-semibold">{item.title}</p>
                  </div>
                  <p className="text-sm text-muted-foreground">{item.detail}</p>
                </div>
              ))}
              <div className="rounded-lg border border-primary/30 bg-primary/5 p-3">
                <div className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-primary" />
                  <p className="font-semibold text-primary">UI/UX polish</p>
                </div>
                <p className="text-sm text-muted-foreground">
                  Clear payment breakdowns, progress indicators during processing, and confirmation screens with order
                  details keep customers confident and tailors informed.
                </p>
              </div>
            </CardContent>
          </Card>
        </section>

        <Separator className="my-10" />

        <section className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
          <Card className="border-border/80">
            <CardHeader className="space-y-3">
              <Badge variant="secondary" className="gap-2">
                <Workflow className="h-4 w-4" />
                Gateway blueprint
              </Badge>
              <CardTitle className="text-2xl">API-first fee enforcement</CardTitle>
              <CardDescription>How Paystack and Flutterwave stay in sync with platform rules.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {apiBlueprint.map((item) => (
                <div key={item.title} className="rounded-lg border border-border bg-muted/40 p-3">
                  <p className="font-semibold">{item.title}</p>
                  <p className="text-sm text-muted-foreground">{item.detail}</p>
                </div>
              ))}
              <div className="rounded-lg border border-primary/30 bg-primary/5 p-3">
                <p className="text-sm font-semibold text-primary">Webhook safety</p>
                <p className="text-sm text-muted-foreground">
                  Signatures and idempotency keys prevent replay attacks and guarantee that only verified payments move
                  orders forward.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="h-full">
            <CardHeader>
              <Badge variant="outline" className="w-fit gap-2">
                <HeartHandshake className="h-4 w-4" />
                Incentives
              </Badge>
              <CardTitle>Rewards for doing it right</CardTitle>
              <CardDescription>Compliance is encouraged with perks and discouraged with time-bound holds.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {incentivePrograms.map((item) => (
                <div key={item.title} className="rounded-lg border border-border bg-muted/40 p-3">
                  <div className="flex items-center justify-between">
                    <p className="font-semibold">{item.title}</p>
                    <Badge variant="secondary">{item.badge}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{item.detail}</p>
                </div>
              ))}
              <div className="rounded-lg border border-dashed border-primary/40 bg-primary/5 p-3">
                <p className="text-sm font-semibold text-primary">Fair outcomes</p>
                <p className="text-sm text-muted-foreground">
                  Penalties escalate gradually with clear communication, ensuring the platform stays trusted without
                  surprising loyal users.
                </p>
              </div>
            </CardContent>
          </Card>
        </section>

        <section className="rounded-2xl border border-primary/30 bg-primary/5 p-6">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="space-y-1">
              <p className="text-sm uppercase tracking-[0.2em] text-primary">Payment outcomes</p>
              <h2 className="text-2xl font-semibold">Built for reliability, transparency, and fast payouts</h2>
              <p className="text-sm text-muted-foreground max-w-3xl">
                Every role—customer, tailor, and admin—can see where money is, what fees applied, and when funds will
                arrive. Paystack and Flutterwave gateways keep transactions secure while the platform handles clarity,
                splits, commissions, and notifications.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary" className="gap-1">
                <Shield className="h-4 w-4" />
                PCI-DSS handled by gateway
              </Badge>
              <Badge variant="secondary" className="gap-1">
                <Timer className="h-4 w-4" />
                Payout SLA monitored
              </Badge>
              <Badge variant="secondary" className="gap-1">
                <Sparkles className="h-4 w-4" />
                Uber-inspired experience
              </Badge>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
