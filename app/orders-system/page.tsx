"use client"

import Link from "next/link"
import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import {
  AlarmClock,
  AlertTriangle,
  ArrowLeft,
  Award,
  BadgeCheck,
  BarChart3,
  Bell,
  BellRing,
  CalendarClock,
  Camera,
  CircleCheck,
  ClipboardCheck,
  ClipboardList,
  CreditCard,
  GalleryHorizontal,
  History,
  ImageUp,
  Inbox,
  Flag,
  Lock,
  Mail,
  MessageSquare,
  PackageCheck,
  PhoneCall,
  Send,
  Shield,
  ShieldCheck,
  Sparkles,
  Star,
  Timer,
  Zap,
} from "lucide-react"

const customerOrderFlow = [
  {
    title: "Create new order",
    icon: <PackageCheck className="h-5 w-5" />,
    items: [
      "Choose garment type and service (suits, dresses, alterations, pants, shirts).",
      "Attach saved measurements or enter new measurements with garment-aware validation.",
      "Select fabrics from the catalog or upload a custom fabric reference with notes.",
      "Capture customization preferences (designs, trims, colors) with free-form notes.",
    ],
  },
  {
    title: "Order summary & confirmation",
    icon: <ShieldCheck className="h-5 w-5" />,
    items: [
      "Review garment, measurements, fabric, design notes, estimated cost, and ETA.",
      "Lock in a payment method (wallet, card, or split/partial when enabled).",
      "Generate a trackable order ID and send confirmation notifications and email.",
    ],
  },
  {
    title: "Payment & invoices",
    icon: <CreditCard className="h-5 w-5" />,
    items: [
      "Process secure payments (Stripe/PayPal ready) before work starts or with admin-approved partials.",
      "Automatically issue digital invoices/receipts with line-item detail and discounts.",
      "Support refunds or cancellations with customer notification and status rollbacks.",
    ],
  },
  {
    title: "Tracking & history",
    icon: <Timer className="h-5 w-5" />,
    items: [
      "Real-time status updates with email/push alerts on every stage transition.",
      "Persistent order history with reorder/favorite actions.",
      "Feedback and rating capture once the order is delivered.",
    ],
  },
]

const statusWorkflow = [
  {
    label: "Order Placed",
    customer: "Pays (or reserves partial), reviews summary, and gets confirmation.",
    tailor: "Sees the order on the workboard with measurements and fabric context.",
  },
  {
    label: "In Progress",
    customer: "Receives milestone updates and can message the tailor for clarifications.",
    tailor: "Begins work, requests measurement adjustments, and logs fabric/design decisions.",
  },
  {
    label: "Ready for Pickup/Delivery",
    customer: "Confirms pickup or delivery slot; can flag fit issues before handoff.",
    tailor: "Schedules pickup/shipping; attaches invoice and delivery details.",
  },
  {
    label: "Completed",
    customer: "Marks the order received, leaves rating/review, and stores measurements.",
    tailor: "Closes the order, reconciles payments/commissions, and adds to analytics.",
  },
]

const serviceImageFlow = [
  {
    title: "Customer request",
    icon: <Camera className="h-5 w-5" />,
    items: [
      "Request Image button on the order status page is available pre-work, mid-progress, and pre-delivery.",
      "Optional note so customers can ask for specific angles or stages (fabric cutting, stitching, fitting).",
      "Each request is logged with a due-by target (e.g., respond within 24h) and visible to the assigned tailor.",
    ],
  },
  {
    title: "Tailor response",
    icon: <ImageUp className="h-5 w-5" />,
    items: [
      "Upload JPEG/PNG/HEIC with server-side compression, metadata scrubbing, and auto-thumbnailing.",
      "Add captions or context (e.g., “First fitting—sleeves pinned 1cm”) before sending to the customer.",
      "Batch upload is supported so tailors can share fabric choices, in-progress stitching, and final fit in one go.",
    ],
  },
  {
    title: "Customer view",
    icon: <GalleryHorizontal className="h-5 w-5" />,
    items: [
      "Service Status Images gallery shows newest-first uploads with stage tags, timestamps, and captions.",
      "Tap to enlarge with zoom for stitch detail; alt text persists for accessibility; EXIF is stripped for privacy.",
      "Inline feedback box lets customers approve, ask for tweaks, or request another angle directly from the image.",
    ],
  },
]

const imageNotifications = [
  {
    title: "Tailor alerts",
    description:
      "Real-time push/email when a customer requests an image, including the note, due-by target, and order link.",
    icon: Bell,
  },
  {
    title: "Customer alerts",
    description:
      "Push/email when the tailor uploads: “Your tailor sent a progress image”—deep links to the gallery on the order.",
    icon: Mail,
  },
  {
    title: "Admin oversight",
    description:
      "Admins see overdue requests, can nudge or reassign tailors, and can review flagged uploads for quality or policy.",
    icon: ShieldCheck,
  },
]

const imageTimeline = [
  {
    stage: "Fabric confirmation",
    owner: "Tailor",
    detail: "Upload fabric swatch photo before cutting begins; capture both color and texture in good light.",
    type: "Upload",
    due: "Within 12h of request",
  },
  {
    stage: "Stitching in-progress",
    owner: "Customer-requested",
    detail: "Customer taps Request Image with note: “show shoulder seams”; tailor responds with captioned photo.",
    type: "Request ➜ Upload",
    due: "24h SLA to respond",
  },
  {
    stage: "First fitting",
    owner: "Tailor",
    detail: "Share front and side shots with pins visible; invite feedback on sleeve and waist fit.",
    type: "Upload with feedback",
    due: "Before booking fitting",
  },
  {
    stage: "Final confirmation",
    owner: "Customer",
    detail: "Customer zooms, approves, or leaves a comment (e.g., “shorten hem by 0.5cm”) before delivery.",
    type: "Review",
    due: "Customer-driven",
  },
]

const imageSafety = [
  {
    title: "Access control",
    description:
      "Only the assigned tailor, the customer, and limited admins can view; signed URLs with short-lived tokens and role checks.",
    icon: Lock,
  },
  {
    title: "Quality & performance",
    description:
      "Automatic compression, size caps, and responsive formats; blurry uploads can be rejected with helper tips for retake.",
    icon: Sparkles,
  },
  {
    title: "Audit trail",
    description:
      "Track who requested/sent the image, when it was viewed, and whether feedback was provided—exportable for disputes.",
    icon: History,
  },
  {
    title: "Content governance",
    description:
      "Admins can quarantine or replace images that violate policy, with notifications to both parties when action is taken.",
    icon: Shield,
  },
]

const tailorOps = [
  {
    title: "Pipeline & filters",
    description: "Dashboard segmented by status, customer, ETA, and payment readiness.",
  },
  {
    title: "Measurements & accuracy",
    description:
      "Access saved profiles, request clarifications, swap profiles, and log adjustments with audit history.",
  },
  {
    title: "Communication",
    description: "In-app messaging for design clarifications, fitting requests, and progress sharing.",
  },
  {
    title: "Completion & delivery",
    description: "Mark finished, trigger notifications, generate invoices, and coordinate pickup/delivery.",
  },
]

const adminControls = [
  {
    title: "Oversight & interventions",
    description: "View all orders, override statuses, and assign tailors for stalled or bulk jobs.",
  },
  {
    title: "Payments & refunds",
    description: "Monitor gateway health, approve partials, process refunds, and manage commissions.",
  },
  {
    title: "Analytics & alerts",
    description:
      "Generate reports on revenue, service popularity, SLAs, and tailor performance with proactive alerts.",
  },
  {
    title: "Content & policy",
    description: "Moderate reviews, manage notifications, and enforce platform policies on disputes.",
  },
]

const futureIdeas = [
  "Live delivery map tracking for pickups and courier drops.",
  "AI-assisted design suggestions and measurement anomaly detection.",
  "Tailor performance metrics (completion time, satisfaction, rework rate) surfaced to admins.",
]

const completionTimeFlow = [
  {
    title: "Customer proposes date",
    icon: CalendarClock,
    items: [
      "Order form includes preferred completion or delivery date/time with timezone awareness.",
      "Customers can add flexibility notes (e.g., ‘pickup anytime after 5pm’).",
      "Validation warns if the date is too soon for the garment type or queue length.",
    ],
  },
  {
    title: "Tailor reviews & negotiates",
    icon: MessageSquare,
    items: [
      "Tailor sees requested date beside effort estimate and current workload.",
      "If unavailable, tailor proposes an alternative time with a short reason.",
      "In-app thread tracks the negotiation; timestamps show who proposed what and when.",
    ],
  },
  {
    title: "Agreement & lock-in",
    icon: ShieldCheck,
    items: [
      "Once both confirm, the ‘Agreed Delivery Date’ is pinned to the order header.",
      "Notifications go to customer and tailor confirming the locked date/time.",
      "Admins see the agreement in the audit log for SLA monitoring and disputes.",
    ],
  },
]

const completionGuardrails = [
  {
    label: "Deadline math",
    detail: "Stores both absolute time and timezone; converts to customer/tailor local time in UI.",
  },
  {
    label: "Grace period",
    detail: "Configurable 1–2 hour window with reminders 15 minutes before the grace end.",
  },
  {
    label: "Status syncing",
    detail: "Agreed date feeds reminder engine, progress tracker, and admin SLA alerts automatically.",
  },
]

const tailorReminderPlan = [
  {
    title: "Pre-deadline reminder",
    badge: "X hours before",
    icon: BellRing,
    description:
      "Push, email, and optional SMS remind the tailor of the upcoming completion time with the order link and measurements context.",
  },
  {
    title: "Deadline reached",
    badge: "At agreed time",
    icon: AlarmClock,
    description: "Notification prompts the tailor to mark ready or request a delay with a reason and new estimate.",
  },
  {
    title: "Grace period buffer",
    badge: "15m before grace end",
    icon: AlertTriangle,
    description:
      "Gentle alert to update status before the grace window closes; offers quick actions to mark Not Ready or Ready for Pickup.",
  },
]

const customerNotificationPlan = [
  {
    status: "Ready for Pickup",
    description: "Immediate push/email: ‘Your order is ready for pickup!’ with slot scheduling or delivery request CTA.",
    badge: "Real-time",
  },
  {
    status: "Pickup confirmed",
    description: "After customer confirms collection, a receipt-style notification and history log entry are sent.",
    badge: "After handoff",
  },
  {
    status: "Delay notice",
    description:
      "Tailor selects Not Ready, adds reason and extra days; customer sees ‘Not Ready’ status with new estimated date.",
    badge: "If delayed",
  },
  {
    status: "Automatic delay math",
    description: "System can auto-calculate ‘delayed by X days’ messaging when the ETA shifts materially.",
    badge: "Auto",
  },
]

const orderTrackerStages = [
  {
    label: "Order Placed",
    detail: "Payment method locked, measurements attached, and order ID generated.",
  },
  {
    label: "In Progress",
    detail: "Tailor working; customers can message or request images; shows agreed completion date.",
  },
  {
    label: "Ready for Pickup",
    detail: "Completion marked; customer can schedule pickup/delivery and see invoice.",
  },
  {
    label: "Not Ready",
    detail: "Displays delay reason, added days, and updated ETA; keeps prior agreed date for history.",
  },
  {
    label: "Order Picked Up",
    detail: "Customer confirms handoff; final notification and review prompt are triggered.",
  },
]

const complaintFlow = [
  {
    title: "Submit issue",
    icon: Inbox,
    points: [
      "Accessible from the order card with Order ID pre-filled.",
      "Customer chooses a category (Delayed Order, Quality Issue, Payment Problem, etc.).",
      "Text area captures description; optional attachments can be added later.",
    ],
  },
  {
    title: "Admin triage",
    icon: ClipboardList,
    points: [
      "Admins receive instant notification and see the complaint in the Customer Complaints queue.",
      "Timeline shows order status, agreed date, grace usage, and prior messages.",
      "Automated response templates help acknowledge receipt while investigation starts.",
    ],
  },
  {
    title: "Resolution & feedback",
    icon: ClipboardCheck,
    points: [
      "Admin coordinates with customer and tailor, proposes refund/extension/adjustment, and logs resolution.",
      "Customer gets push/email with the resolution summary and can provide feedback on the outcome.",
      "Unresolved items past 24h auto-escalate to a higher-level admin or support lead.",
    ],
  },
]

const adminDashboard = [
  {
    label: "Order health",
    description: "Filter by pending, completed, delayed, or grace-period usage; drill into per-order SLA details.",
    icon: BarChart3,
  },
  {
    label: "Complaints",
    description: "Live queue with statuses (Open, Investigating, Resolved, Escalated) and response timers.",
    icon: Flag,
  },
  {
    label: "Escalation",
    description: "If no resolution within 24h, auto-route to a senior admin with phone/email alert and audit trail.",
    icon: PhoneCall,
  },
  {
    label: "Templates",
    description: "Reusable response templates for delays, refunds, and quality fixes to keep messaging consistent.",
    icon: Send,
  },
]

const expressFeatureHighlights = [
  {
    title: "Express upgrade",
    icon: Zap,
    points: [
      "Customers toggle Express during checkout with instant SLA preview (2–4 days).",
      "Order summary shows surcharge math and the promised-by date before payment is captured.",
    ],
  },
  {
    title: "Premium pricing",
    icon: CreditCard,
    points: [
      "Dynamic fee: 20–30% uplift or minimum fixed fee per garment category.",
      "Line-item breakdown in invoice so customers see base vs. express surcharge.",
    ],
  },
  {
    title: "Trust & visibility",
    icon: CalendarClock,
    points: [
      "Order tracker highlights Express with a lightning badge and countdown to the promise date.",
      "Mid-progress nudges to tailors and real-time alerts to customers on status changes.",
    ],
  },
]

const expressCapacityRules = [
  {
    title: "Capacity guardrails",
    icon: AlarmClock,
    detail: "Tailors set weekly and concurrent express caps; intake auto-blocks when thresholds are hit.",
  },
  {
    title: "Routing",
    icon: Bell,
    detail: "Only tailors with free express slots appear in search/assignment; reassign if risk is detected.",
  },
  {
    title: "Oversight",
    icon: ShieldCheck,
    detail: "Admins view an express queue with SLA risk, can nudge, extend grace, or reassign on behalf of customers.",
  },
]

const badgeCatalog = [
  {
    label: "Professional Tailor",
    description: "6+ months tenure and 100+ successful orders.",
    icon: Award,
  },
  {
    label: "Top-Rated",
    description: "4.5★+ rating with strong review volume.",
    icon: Star,
  },
  {
    label: "Express Specialist",
    description: "On-time express delivery streak with high satisfaction.",
    icon: Zap,
  },
  {
    label: "Verified",
    description: "Identity and skills verified by Haib admins.",
    icon: BadgeCheck,
  },
  {
    label: "Style Specialist",
    description: "Expertise in a niche (bridal, traditional wear, formal suits, etc.).",
    icon: Sparkles,
  },
]

const badgeOperations = [
  {
    title: "Automatic awards",
    detail: "Top-Rated, Professional, and Express Specialist badges unlock via ratings, tenure, and on-time delivery.",
  },
  {
    title: "Manual verification",
    detail: "Verified badge requires admin checks of identity and portfolio before activation.",
  },
  {
    title: "Renewal & expiry",
    detail: "Badges re-evaluate every 6 months; drops in rating or SLA compliance auto-expire until requirements return.",
  },
  {
    title: "Search ranking",
    detail: "Badge weight boosts tailors in search and order selection filters (e.g., express-first, top-rated-first).",
  },
]

export default function OrdersSystemPage() {
  const [activeSection, setActiveSection] = useState("intake")

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border/70 bg-background/80 backdrop-blur">
        <div className="container mx-auto flex items-center justify-between px-4 py-4">
          <Link href="/" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            <span className="text-sm font-medium text-muted-foreground">Back to Home</span>
          </Link>
          <div className="flex items-center gap-2">
            <Link href="/auth/signup?role=customer">
              <Button variant="outline" className="bg-transparent">
                Customer Signup
              </Button>
            </Link>
            <Link href="/auth/signup?role=tailor">
              <Button>Tailor Signup</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto space-y-10 px-4 py-10">
        <Card className="rounded-3xl border-border/80 bg-background/70 shadow-xl">
          <CardHeader className="space-y-4 text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-border px-3 py-1 text-xs uppercase tracking-wide">
              <Badge variant="outline" className="border-transparent px-0 text-primary">
                <Sparkles className="mr-1 h-3 w-3" />
                Orders System
              </Badge>
              Guided console
            </div>
            <div className="space-y-3">
              <CardTitle className="text-4xl font-bold leading-tight">Orders System control room</CardTitle>
              <CardDescription className="text-lg">
                Choose a slice—intake, delivery promises, rich media, or oversight. Each opens in place so you never scroll
                past walls of content.
              </CardDescription>
            </div>
            <div className="flex flex-wrap justify-center gap-3 text-sm text-muted-foreground">
              <span className="rounded-full bg-muted px-3 py-1">Mobile-first tab bar</span>
              <span className="rounded-full bg-muted px-3 py-1">Tailwind animations</span>
              <span className="rounded-full bg-muted px-3 py-1">App-like focus</span>
            </div>
          </CardHeader>

          <CardContent>
            <Tabs value={activeSection} onValueChange={setActiveSection} className="space-y-6">
              <TabsList className="w-full justify-start overflow-x-auto">
                <TabsTrigger value="intake">Intake & Express</TabsTrigger>
                <TabsTrigger value="delivery">Delivery & SLAs</TabsTrigger>
                <TabsTrigger value="media">Media & Approvals</TabsTrigger>
                <TabsTrigger value="admin">Admin & Trust</TabsTrigger>
              </TabsList>

              <TabsContent value="intake" className="space-y-4 animate-in fade-in slide-in-from-bottom duration-500">
                <Accordion type="single" collapsible defaultValue="express">
                  <AccordionItem value="express" className="border-border/60">
                    <AccordionTrigger className="text-left text-lg font-semibold">Express intake blueprint</AccordionTrigger>
                    <AccordionContent>
                      <div className="grid gap-4 lg:grid-cols-[1.4fr_0.6fr]">
                        <Card className="shadow-sm">
                          <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                              <CardTitle>Express service for urgent orders</CardTitle>
                              <CardDescription>Upgrade flow, pricing, and visibility</CardDescription>
                            </div>
                            <Badge className="bg-orange-600 text-white">Express</Badge>
                          </CardHeader>
                          <CardContent className="grid gap-4 md:grid-cols-3">
                            {expressFeatureHighlights.map((item) => (
                              <div key={item.title} className="rounded-lg border border-border/70 bg-background p-4 shadow-sm">
                                <div className="flex items-center gap-2 mb-2">
                                  <item.icon className="h-4 w-4 text-orange-600" />
                                  <p className="font-semibold">{item.title}</p>
                                </div>
                                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                                  {item.points.map((point) => (
                                    <li key={point}>{point}</li>
                                  ))}
                                </ul>
                              </div>
                            ))}
                          </CardContent>
                        </Card>

                        <Card className="shadow-sm">
                          <CardHeader>
                            <CardTitle>Express guardrails</CardTitle>
                            <CardDescription>Capacity, routing, and oversight</CardDescription>
                          </CardHeader>
                          <CardContent className="space-y-3 text-sm text-muted-foreground">
                            {expressCapacityRules.map((rule) => (
                              <div key={rule.title} className="flex items-start gap-3">
                                <rule.icon className="mt-1 h-4 w-4 text-orange-600" />
                                <div>
                                  <p className="font-semibold text-foreground">{rule.title}</p>
                                  <p>{rule.detail}</p>
                                </div>
                              </div>
                            ))}
                            <Separator />
                            <p className="text-xs">Admins can override caps, approve fee waivers, and monitor SLA risk from a dedicated express queue.</p>
                          </CardContent>
                        </Card>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="orders" className="border-border/60">
                    <AccordionTrigger className="text-left text-lg font-semibold">Order intake essentials</AccordionTrigger>
                    <AccordionContent>
                      <div className="grid gap-4 md:grid-cols-2">
                        {customerOrderFlow.map((block) => (
                          <Card key={block.title} className="h-full border-dashed shadow-sm">
                            <CardHeader className="flex flex-row items-start gap-3">
                              <div className="rounded-full bg-muted p-2 text-muted-foreground">{block.icon}</div>
                              <div>
                                <CardTitle>{block.title}</CardTitle>
                                <CardDescription>Customer-side experience</CardDescription>
                              </div>
                            </CardHeader>
                            <CardContent>
                              <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
                                {block.items.map((item) => (
                                  <li key={item}>{item}</li>
                                ))}
                              </ul>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="status" className="border-border/60">
                    <AccordionTrigger className="text-left text-lg font-semibold">Status hand-offs</AccordionTrigger>
                    <AccordionContent>
                      <Card className="shadow-sm">
                        <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                          <div>
                            <CardTitle>Customer ↔ Tailor ↔ Admin</CardTitle>
                            <CardDescription>Each stage shows both perspectives.</CardDescription>
                          </div>
                          <Badge variant="secondary">Timeline</Badge>
                        </CardHeader>
                        <CardContent className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                          {statusWorkflow.map((status) => (
                            <div key={status.label} className="rounded-xl border border-border/70 bg-muted/50 p-4 text-sm">
                              <p className="text-xs font-semibold uppercase text-muted-foreground">{status.label}</p>
                              <p className="mt-2 font-semibold text-foreground">Customer</p>
                              <p className="text-muted-foreground">{status.customer}</p>
                              <p className="mt-2 font-semibold text-foreground">Tailor</p>
                              <p className="text-muted-foreground">{status.tailor}</p>
                            </div>
                          ))}
                        </CardContent>
                      </Card>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </TabsContent>

              <TabsContent value="delivery" className="space-y-4 animate-in fade-in slide-in-from-bottom duration-500">
                <Accordion type="single" collapsible defaultValue="completion">
                  <AccordionItem value="completion" className="border-border/60">
                    <AccordionTrigger className="text-left text-lg font-semibold">Agreed completion time</AccordionTrigger>
                    <AccordionContent>
                      <div className="grid gap-4 lg:grid-cols-3">
                        {completionTimeFlow.map((block) => (
                          <Card key={block.title} className="h-full border-dashed shadow-sm">
                            <CardHeader className="flex items-center gap-2">
                              <block.icon className="h-5 w-5 text-primary" />
                              <CardTitle className="text-lg">{block.title}</CardTitle>
                            </CardHeader>
                            <CardContent>
                              <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
                                {block.items.map((item) => (
                                  <li key={item}>{item}</li>
                                ))}
                              </ul>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                      <div className="mt-4 grid gap-3 sm:grid-cols-3">
                        {completionGuardrails.map((rule) => (
                          <div key={rule.label} className="rounded-xl border border-border/70 bg-muted/50 p-4 text-sm text-muted-foreground">
                            <div className="mb-1 flex items-center gap-2 font-semibold text-foreground">
                              <CircleCheck className="h-4 w-4 text-primary" />
                              {rule.label}
                            </div>
                            {rule.detail}
                          </div>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="reminders" className="border-border/60">
                    <AccordionTrigger className="text-left text-lg font-semibold">Reminder plan</AccordionTrigger>
                    <AccordionContent>
                      <div className="grid gap-4 lg:grid-cols-[1.6fr_0.4fr]">
                        <Card className="shadow-sm">
                          <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                              <CardTitle>Tailor reminders & grace period</CardTitle>
                              <CardDescription>Real-time prompts around the agreed time</CardDescription>
                            </div>
                            <Badge variant="outline">Notifications</Badge>
                          </CardHeader>
                          <CardContent className="grid gap-4 md:grid-cols-3">
                            {tailorReminderPlan.map((item) => (
                              <div key={item.title} className="rounded-lg border border-border/70 bg-background p-4">
                                <div className="flex items-center justify-between mb-2">
                                  <div className="flex items-center gap-2">
                                    <item.icon className="h-4 w-4 text-primary" />
                                    <p className="font-semibold">{item.title}</p>
                                  </div>
                                  <Badge variant="secondary">{item.badge}</Badge>
                                </div>
                                <p className="text-sm text-muted-foreground">{item.description}</p>
                              </div>
                            ))}
                          </CardContent>
                        </Card>

                        <Card className="shadow-sm">
                          <CardHeader>
                            <CardTitle>Reminder channels</CardTitle>
                            <CardDescription>Reach tailors where they work</CardDescription>
                          </CardHeader>
                          <CardContent className="space-y-3 text-sm text-muted-foreground">
                            <div className="flex items-start gap-3">
                              <Bell className="mt-1 h-4 w-4 text-primary" />
                              <p>In-app toasts with deep links to the order; persistent bell center until acknowledged.</p>
                            </div>
                            <div className="flex items-start gap-3">
                              <Mail className="mt-1 h-4 w-4 text-primary" />
                              <p>Email reminders include agreed date, grace end, and quick actions.</p>
                            </div>
                            <div className="flex items-start gap-3">
                              <PhoneCall className="mt-1 h-4 w-4 text-primary" />
                              <p>Optional SMS for urgent deadlines or escalations when grace is nearly exhausted.</p>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="customer" className="border-border/60">
                    <AccordionTrigger className="text-left text-lg font-semibold">Customer notifications</AccordionTrigger>
                    <AccordionContent>
                      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                        {customerNotificationPlan.map((item) => (
                          <Card key={item.status} className="border-dashed shadow-sm">
                            <CardHeader className="space-y-2">
                              <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground">
                                <span>{item.badge}</span>
                                <Badge variant="secondary">Push/Email</Badge>
                              </div>
                              <CardTitle className="text-lg">{item.status}</CardTitle>
                              <CardDescription>{item.description}</CardDescription>
                            </CardHeader>
                          </Card>
                        ))}
                      </div>
                      <div className="mt-4 grid gap-3 sm:grid-cols-5">
                        {orderTrackerStages.map((stage) => (
                          <div key={stage.label} className="rounded-xl border border-border/70 bg-muted/50 p-4 text-sm">
                            <p className="text-xs font-semibold uppercase text-muted-foreground">{stage.label}</p>
                            <p className="text-muted-foreground">{stage.detail}</p>
                          </div>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </TabsContent>

              <TabsContent value="media" className="space-y-4 animate-in fade-in slide-in-from-bottom duration-500">
                <Accordion type="single" collapsible defaultValue="requests">
                  <AccordionItem value="requests" className="border-border/60">
                    <AccordionTrigger className="text-left text-lg font-semibold">Image request loop</AccordionTrigger>
                    <AccordionContent>
                      <div className="grid gap-4 md:grid-cols-3">
                        {serviceImageFlow.map((block) => (
                          <Card key={block.title} className="border-dashed shadow-sm">
                            <CardHeader className="flex items-center gap-2">
                              <div className="rounded-full bg-muted p-2 text-muted-foreground">{block.icon}</div>
                              <CardTitle className="text-lg">{block.title}</CardTitle>
                            </CardHeader>
                            <CardContent>
                              <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
                                {block.items.map((item) => (
                                  <li key={item}>{item}</li>
                                ))}
                              </ul>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="timeline" className="border-border/60">
                    <AccordionTrigger className="text-left text-lg font-semibold">Media timeline</AccordionTrigger>
                    <AccordionContent>
                      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                        {imageTimeline.map((item) => (
                          <div key={item.stage} className="rounded-xl border border-border/70 bg-muted/50 p-4 text-sm text-muted-foreground">
                            <p className="text-xs font-semibold uppercase text-muted-foreground">{item.stage}</p>
                            <p className="font-semibold text-foreground">{item.owner}</p>
                            <p>{item.detail}</p>
                            <p className="mt-2 text-xs">{item.type} · {item.due}</p>
                          </div>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="alerts" className="border-border/60">
                    <AccordionTrigger className="text-left text-lg font-semibold">Alerts & safety</AccordionTrigger>
                    <AccordionContent>
                      <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
                        <Card className="shadow-sm">
                          <CardHeader>
                            <CardTitle>Notification patterns</CardTitle>
                            <CardDescription>Who hears what, and when</CardDescription>
                          </CardHeader>
                          <CardContent className="grid gap-3 sm:grid-cols-3">
                            {imageNotifications.map((note) => (
                              <div key={note.title} className="rounded-lg border border-border/70 bg-background p-4 text-sm">
                                <div className="mb-2 flex items-center gap-2 font-semibold text-foreground">
                                  <note.icon className="h-4 w-4 text-primary" />
                                  {note.title}
                                </div>
                                <p className="text-muted-foreground">{note.description}</p>
                              </div>
                            ))}
                          </CardContent>
                        </Card>

                        <Card className="shadow-sm">
                          <CardHeader>
                            <CardTitle>Safety rails</CardTitle>
                            <CardDescription>Privacy, governance, and performance</CardDescription>
                          </CardHeader>
                          <CardContent className="space-y-3 text-sm text-muted-foreground">
                            {imageSafety.map((item) => (
                              <div key={item.title} className="flex items-start gap-3">
                                <item.icon className="mt-1 h-4 w-4 text-primary" />
                                <div>
                                  <p className="font-semibold text-foreground">{item.title}</p>
                                  <p>{item.description}</p>
                                </div>
                              </div>
                            ))}
                          </CardContent>
                        </Card>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </TabsContent>

              <TabsContent value="admin" className="space-y-4 animate-in fade-in slide-in-from-bottom duration-500">
                <Accordion type="single" collapsible defaultValue="badges">
                  <AccordionItem value="badges" className="border-border/60">
                    <AccordionTrigger className="text-left text-lg font-semibold">Badges & trust</AccordionTrigger>
                    <AccordionContent>
                      <div className="grid gap-4 lg:grid-cols-[1.5fr_0.5fr]">
                        <Card className="shadow-sm">
                          <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                              <CardTitle>Badge system for tailor credibility</CardTitle>
                              <CardDescription>Badges visible on search, profiles, and order selection</CardDescription>
                            </div>
                            <Badge variant="secondary">Trust & Ranking</Badge>
                          </CardHeader>
                          <CardContent className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                            {badgeCatalog.map((badge) => (
                              <div key={badge.label} className="rounded-lg border border-border/70 bg-background p-4">
                                <div className="mb-2 flex items-center gap-2">
                                  <badge.icon className="h-4 w-4 text-primary" />
                                  <p className="font-semibold">{badge.label}</p>
                                </div>
                                <p className="text-sm text-muted-foreground">{badge.description}</p>
                              </div>
                            ))}
                          </CardContent>
                        </Card>

                        <Card className="shadow-sm">
                          <CardHeader>
                            <CardTitle>Badge lifecycle</CardTitle>
                            <CardDescription>How badges unlock and expire</CardDescription>
                          </CardHeader>
                          <CardContent className="space-y-3 text-sm text-muted-foreground">
                            {badgeOperations.map((op) => (
                              <div key={op.title} className="rounded-md border border-border/70 bg-muted/50 p-3">
                                <p className="font-semibold text-foreground">{op.title}</p>
                                <p>{op.detail}</p>
                              </div>
                            ))}
                          </CardContent>
                        </Card>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="admin-console" className="border-border/60">
                    <AccordionTrigger className="text-left text-lg font-semibold">Admin console</AccordionTrigger>
                    <AccordionContent>
                      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        {adminControls.map((item) => (
                          <Card key={item.title} className="border-dashed shadow-sm">
                            <CardHeader className="space-y-2">
                              <CardTitle className="text-lg">{item.title}</CardTitle>
                              <CardDescription>{item.description}</CardDescription>
                            </CardHeader>
                          </Card>
                        ))}
                      </div>

                      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                        {adminDashboard.map((item) => (
                          <div key={item.label} className="rounded-xl border border-border/70 bg-muted/50 p-4 text-sm">
                            <div className="mb-2 flex items-center gap-2 font-semibold text-foreground">
                              <item.icon className="h-4 w-4 text-primary" />
                              {item.label}
                            </div>
                            <p className="text-muted-foreground">{item.description}</p>
                          </div>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="complaints" className="border-border/60">
                    <AccordionTrigger className="text-left text-lg font-semibold">Complaints & future</AccordionTrigger>
                    <AccordionContent>
                      <div className="grid gap-4 lg:grid-cols-[1.3fr_0.7fr]">
                        <Card className="shadow-sm">
                          <CardHeader>
                            <CardTitle>Complaint handling</CardTitle>
                            <CardDescription>Structured triage and resolution</CardDescription>
                          </CardHeader>
                          <CardContent className="grid gap-3 sm:grid-cols-3">
                            {complaintFlow.map((flow) => (
                              <div key={flow.title} className="rounded-lg border border-border/70 bg-background p-4 text-sm">
                                <div className="mb-2 flex items-center gap-2 font-semibold text-foreground">
                                  <flow.icon className="h-4 w-4 text-primary" />
                                  {flow.title}
                                </div>
                                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                                  {flow.points.map((point) => (
                                    <li key={point}>{point}</li>
                                  ))}
                                </ul>
                              </div>
                            ))}
                          </CardContent>
                        </Card>

                        <Card className="shadow-sm">
                          <CardHeader>
                            <CardTitle>In-flight ideas</CardTitle>
                            <CardDescription>Backlog ready for experiments</CardDescription>
                          </CardHeader>
                          <CardContent className="space-y-2 text-sm text-muted-foreground">
                            {futureIdeas.map((idea) => (
                              <div key={idea} className="rounded-md border border-border/70 bg-muted/50 p-3">
                                {idea}
                              </div>
                            ))}
                            <Separator />
                            <div className="rounded-md border border-dashed border-primary/50 bg-primary/5 p-3 text-xs text-primary">
                              Tailor console staples: {tailorOps.map((op) => op.title).join(" · ")}
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <Card className="border-dashed border-primary/40 bg-primary/5 shadow-sm">
          <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle>Ready to explore live?</CardTitle>
              <CardDescription>Use the tab bar above or hop to payments and design galleries.</CardDescription>
            </div>
            <div className="flex flex-wrap gap-2">
              <Link href="/payments">
                <Button variant="outline" className="bg-background">
                  <CreditCard className="mr-2 h-4 w-4" />
                  Payments
                </Button>
              </Link>
              <Link href="/designs">
                <Button variant="secondary">
                  <Sparkles className="mr-2 h-4 w-4" />
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
