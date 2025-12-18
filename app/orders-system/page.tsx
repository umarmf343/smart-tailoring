import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import {
  ArrowLeft,
  BarChart3,
  Bell,
  Camera,
  CheckCircle2,
  CreditCard,
  GalleryHorizontal,
  HandCoins,
  History,
  ImageUp,
  Lock,
  AlarmClock,
  AlertTriangle,
  BellRing,
  CalendarClock,
  CircleCheck,
  ClipboardCheck,
  ClipboardList,
  Flag,
  Info,
  Inbox,
  Mail,
  MessageSquare,
  PackageCheck,
  PhoneCall,
  Send,
  Shield,
  ShieldCheck,
  Sparkles,
  TimerReset,
  Timer,
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

const reminderSummary = [
  {
    title: "Tailor timeline",
    steps: ["X hours before deadline reminder", "At deadline prompt", "15m before grace end alert"],
  },
  {
    title: "Customer updates",
    steps: ["Ready for Pickup push/email", "Not Ready with new ETA", "Pickup confirmation receipt"],
  },
  {
    title: "Complaint flow",
    steps: ["Customer submits", "Admin investigates/updates", "Customer receives resolution"],
  },
]

const uiNotes = [
  {
    label: "Dashboard badges",
    detail: "Use color-coded badges for Ready, Not Ready, Delayed, and Grace to keep status scannable.",
  },
  {
    label: "Gentle nudges",
    detail: "Tailor reminders appear as subtle toasts/popovers to avoid interrupting work while staying actionable.",
  },
  {
    label: "Confirmation blocks",
    detail: "When Not Ready is selected, show a mini-form for reason and added days before submitting.",
  },
  {
    label: "Accessibility",
    detail: "Progress tracker supports screen readers; notifications have concise titles and bodies.",
  },
]

export default function OrdersSystemPage() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
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

      <main className="container mx-auto px-4 py-10 space-y-12">
        <section className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 rounded-full border border-border px-3 py-1 text-xs uppercase tracking-wide">
            <Badge variant="outline" className="border-transparent px-0">
              <Sparkles className="h-3 w-3 mr-1" />
              Orders System
            </Badge>
            End-to-end lifecycle for Haib Tailor
          </div>
          <h1 className="text-4xl font-bold leading-tight">Build-ready Orders System blueprint</h1>
          <p className="text-lg text-muted-foreground">
            A complete flow covering customers, tailors, and admins—order placement, real-time tracking, payments,
            messaging, refunds, and analytics—mapped to the Haib Tailor experience.
          </p>
          <div className="flex justify-center gap-3">
            <Link href="/customer/order/new">
              <Button size="lg">Start a Customer Order</Button>
            </Link>
            <Link href="/tailor/dashboard">
              <Button size="lg" variant="outline" className="bg-transparent">
                View Tailor Console
              </Button>
            </Link>
          </div>
        </section>

        <section className="grid lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2">
            <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <CardTitle>Agreed completion time</CardTitle>
                <CardDescription>Customer-tailer negotiation and lock-in</CardDescription>
              </div>
              <Badge variant="secondary">Deadline-aware</Badge>
            </CardHeader>
            <CardContent className="grid sm:grid-cols-3 gap-4">
              {completionTimeFlow.map((block) => (
                <div key={block.title} className="rounded-lg border border-border p-4 h-full">
                  <div className="flex items-center gap-2 mb-2">
                    <block.icon className="h-4 w-4 text-primary" />
                    <p className="font-semibold">{block.title}</p>
                  </div>
                  <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
                    {block.items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Completion guardrails</CardTitle>
              <CardDescription>How deadlines stay reliable</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              {completionGuardrails.map((rule) => (
                <div key={rule.label} className="flex items-start gap-3">
                  <CircleCheck className="h-4 w-4 text-primary mt-1" />
                  <div>
                    <p className="font-semibold text-foreground">{rule.label}</p>
                    <p>{rule.detail}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </section>

        <section className="grid lg:grid-cols-[2fr,1fr] gap-6">
          <Card className="lg:col-span-2">
            <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <CardTitle>Tailor reminders & grace period</CardTitle>
                <CardDescription>Real-time prompts around the agreed time</CardDescription>
              </div>
              <Badge variant="outline">Notifications</Badge>
            </CardHeader>
            <CardContent className="grid md:grid-cols-3 gap-4">
              {tailorReminderPlan.map((item) => (
                <div key={item.title} className="rounded-lg border border-border p-4 h-full">
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
          <Card>
            <CardHeader>
              <CardTitle>Reminder channels</CardTitle>
              <CardDescription>Reach tailors where they work</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <div className="flex items-start gap-3">
                <Bell className="h-4 w-4 text-primary mt-1" />
                <p>In-app toasts with deep links to the order; persistent bell center until acknowledged.</p>
              </div>
              <div className="flex items-start gap-3">
                <Mail className="h-4 w-4 text-primary mt-1" />
                <p>Email reminders include agreed date, grace end, and quick actions.</p>
              </div>
              <div className="flex items-start gap-3">
                <PhoneCall className="h-4 w-4 text-primary mt-1" />
                <p>Optional SMS for urgent deadlines or escalations when grace is nearly exhausted.</p>
              </div>
              <div className="flex items-start gap-3">
                <TimerReset className="h-4 w-4 text-primary mt-1" />
                <p>All reminders log to the audit trail so admins can verify nudges were sent.</p>
              </div>
            </CardContent>
          </Card>
        </section>

        <section className="grid md:grid-cols-2 gap-6">
          {customerOrderFlow.map((block) => (
            <Card key={block.title} className="h-full">
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
        </section>

        <section className="grid lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Status workflow</CardTitle>
                <CardDescription>Shared across customers, tailors, and admins</CardDescription>
              </div>
              <Badge variant="outline">Real-time notifications</Badge>
            </CardHeader>
            <CardContent className="space-y-6">
              {statusWorkflow.map((step, index) => (
                <div key={step.label} className="rounded-lg border border-border p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-primary" />
                      <p className="font-semibold">{index + 1}. {step.label}</p>
                    </div>
                    <Badge variant="secondary">{step.label}</Badge>
                  </div>
                  <div className="mt-3 grid md:grid-cols-2 gap-3 text-sm text-muted-foreground">
                    <div className="p-3 rounded-md bg-muted/60">
                      <p className="text-xs uppercase tracking-wide text-muted-foreground mb-1">Customer</p>
                      <p>{step.customer}</p>
                    </div>
                    <div className="p-3 rounded-md bg-muted/60">
                      <p className="text-xs uppercase tracking-wide text-muted-foreground mb-1">Tailor</p>
                      <p>{step.tailor}</p>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Payment guardrails</CardTitle>
              <CardDescription>Keep payments, invoices, and refunds consistent</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <div className="flex items-start gap-3">
                <CreditCard className="h-4 w-4 text-primary mt-1" />
                <p>
                  Secure gateway integration (Stripe/PayPal) with support for full, deposit, or split payments before
                  completion.
                </p>
              </div>
              <div className="flex items-start gap-3">
                <HandCoins className="h-4 w-4 text-primary mt-1" />
                <p>Automatic invoices and receipts including garment, fabric, measurement set, discounts, and taxes.</p>
              </div>
              <div className="flex items-start gap-3">
                <ShieldCheck className="h-4 w-4 text-primary mt-1" />
                <p>Refunds and cancellations flow through admins/tailors with customer notifications and ledger updates.</p>
              </div>
            </CardContent>
          </Card>
        </section>

        <section className="grid md:grid-cols-3 gap-6">
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Tailor workspace</CardTitle>
              <CardDescription>Tools tailors need to deliver reliably</CardDescription>
            </CardHeader>
            <CardContent className="grid sm:grid-cols-2 gap-4">
              {tailorOps.map((item) => (
                <div key={item.title} className="rounded-lg border border-border p-4">
                  <p className="font-semibold mb-1">{item.title}</p>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </div>
              ))}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Communication</CardTitle>
              <CardDescription>Messaging + notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <div className="flex items-start gap-3">
                <MessageSquare className="h-4 w-4 text-primary mt-1" />
                <p>Contextual messaging threads per order for design clarifications and fitting coordination.</p>
              </div>
              <div className="flex items-start gap-3">
                <Sparkles className="h-4 w-4 text-primary mt-1" />
                <p>Automated notifications on status changes, payment events, measurement updates, and delivery steps.</p>
              </div>
              <div className="flex items-start gap-3">
                <ShieldCheck className="h-4 w-4 text-primary mt-1" />
                <p>Admin-visible history for dispute resolution and SLA monitoring.</p>
              </div>
            </CardContent>
          </Card>
        </section>

        <section className="grid lg:grid-cols-[1.3fr,1fr] gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Customer-facing updates</CardTitle>
              <CardDescription>What customers see in real time</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {customerNotificationPlan.map((item) => (
                <div key={item.status} className="rounded-lg border border-border p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">{item.badge}</Badge>
                      <p className="font-semibold">{item.status}</p>
                    </div>
                    <CircleCheck className="h-4 w-4 text-primary" />
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">{item.description}</p>
                </div>
              ))}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Order status tracker</CardTitle>
              <CardDescription>Customer dashboard states</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              {orderTrackerStages.map((stage, index) => (
                <div key={stage.label} className="rounded-lg border border-border p-3 flex items-start gap-3">
                  <div className="h-8 w-8 flex items-center justify-center rounded-full bg-muted text-xs font-semibold">
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">{stage.label}</p>
                    <p>{stage.detail}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </section>

        <section className="grid lg:grid-cols-[2fr,1fr] gap-6">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Service status images</CardTitle>
              <CardDescription>Customer requests, tailor uploads, and a transparent gallery</CardDescription>
            </CardHeader>
            <CardContent className="grid sm:grid-cols-3 gap-4">
              {serviceImageFlow.map((item) => (
                <div key={item.title} className="rounded-lg border border-border p-4 h-full">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="rounded-full bg-muted p-2 text-muted-foreground">{item.icon}</div>
                    <p className="font-semibold">{item.title}</p>
                  </div>
                  <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
                    {item.items.map((point) => (
                      <li key={point}>{point}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="space-y-1">
              <CardTitle>Notifications & SLAs</CardTitle>
              <CardDescription>Keep both sides informed with deadlines</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {imageNotifications.map((rule) => (
                <div key={rule.title} className="rounded-lg border border-border p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <rule.icon className="h-4 w-4 text-primary" />
                    <p className="font-semibold">{rule.title}</p>
                  </div>
                  <p className="text-sm text-muted-foreground">{rule.description}</p>
                </div>
              ))}
              <div className="rounded-lg border border-primary/30 bg-primary/5 p-4">
                <p className="text-sm font-semibold text-primary mb-1">Timeline expectations</p>
                <p className="text-sm text-muted-foreground">
                  Default SLA: respond to an image request within 24 hours. Escalations: 12-hour warning to the tailor,
                  6-hour admin alert if still pending.
                </p>
              </div>
            </CardContent>
          </Card>
        </section>

        <section className="grid lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Image history & gallery behavior</CardTitle>
              <CardDescription>Timeline across the order lifecycle</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {imageTimeline.map((entry) => (
                <div key={entry.stage} className="rounded-lg border border-border p-4">
                  <div className="flex flex-wrap items-center gap-2 justify-between">
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">{entry.type}</Badge>
                      <p className="font-semibold">{entry.stage}</p>
                    </div>
                    <Badge variant="outline">{entry.due}</Badge>
                  </div>
                  <div className="mt-3 grid sm:grid-cols-[1fr,3fr] gap-3 text-sm text-muted-foreground">
                    <div className="rounded-md bg-muted/60 p-3">
                      <p className="text-xs uppercase tracking-wide mb-1 text-muted-foreground">Owner</p>
                      <p className="font-medium text-foreground">{entry.owner}</p>
                    </div>
                    <div className="rounded-md bg-muted/60 p-3">
                      <p className="text-xs uppercase tracking-wide mb-1 text-muted-foreground">Expectation</p>
                      <p>{entry.detail}</p>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Quality, security, and governance</CardTitle>
              <CardDescription>Privacy-safe, reliable image sharing</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              {imageSafety.map((policy) => (
                <div key={policy.title} className="flex items-start gap-3">
                  <policy.icon className="h-4 w-4 text-primary mt-1" />
                  <div>
                    <p className="font-semibold text-foreground">{policy.title}</p>
                    <p>{policy.description}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </section>

        <section className="grid lg:grid-cols-[1.2fr,1fr] gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Complaint system</CardTitle>
              <CardDescription>Direct line to admins for issues</CardDescription>
            </CardHeader>
            <CardContent className="grid sm:grid-cols-3 gap-4">
              {complaintFlow.map((step) => (
                <div key={step.title} className="rounded-lg border border-border p-4 h-full">
                  <div className="flex items-center gap-2 mb-2">
                    <step.icon className="h-4 w-4 text-primary" />
                    <p className="font-semibold">{step.title}</p>
                  </div>
                  <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
                    {step.points.map((point) => (
                      <li key={point}>{point}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Admin dashboard</CardTitle>
              <CardDescription>Oversight for orders and complaints</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              {adminDashboard.map((item) => (
                <div key={item.label} className="flex items-start gap-3 rounded-lg border border-border p-3">
                  <item.icon className="h-4 w-4 text-primary mt-1" />
                  <div>
                    <p className="font-semibold text-foreground">{item.label}</p>
                    <p>{item.description}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </section>

        <section className="grid lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Admin oversight</CardTitle>
              <CardDescription>Global control of orders, payments, and reviews</CardDescription>
            </CardHeader>
            <CardContent className="grid sm:grid-cols-2 gap-4">
              {adminControls.map((item) => (
                <div key={item.title} className="rounded-lg border border-border p-4">
                  <p className="font-semibold mb-1">{item.title}</p>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </div>
              ))}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Analytics focus</CardTitle>
              <CardDescription>Operational visibility</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <div className="flex items-start gap-3">
                <BarChart3 className="h-4 w-4 text-primary mt-1" />
                <p>Reports on order volume, revenue, commissions, SLAs, and popular garments/fabrics.</p>
              </div>
              <div className="flex items-start gap-3">
                <Timer className="h-4 w-4 text-primary mt-1" />
                <p>Tailor performance metrics: completion time, revisions, satisfaction, and response speed.</p>
              </div>
              <div className="flex items-start gap-3">
                <ShieldCheck className="h-4 w-4 text-primary mt-1" />
                <p>Audit logs for measurements, payments, refunds, and status overrides.</p>
              </div>
            </CardContent>
          </Card>
        </section>

        <section>
          <Card>
            <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <CardTitle>Future improvements</CardTitle>
                <CardDescription>Optional roadmap-ready enhancements</CardDescription>
              </div>
              <Badge variant="secondary">Exploratory</Badge>
            </CardHeader>
            <Separator />
            <CardContent className="pt-6">
              <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
                {futureIdeas.map((idea) => (
                  <li key={idea}>{idea}</li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </section>

        <section className="grid lg:grid-cols-[1.2fr,1fr] gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Reminder & notification summary</CardTitle>
              <CardDescription>End-to-end alert flow</CardDescription>
            </CardHeader>
            <CardContent className="grid sm:grid-cols-3 gap-4">
              {reminderSummary.map((block) => (
                <div key={block.title} className="rounded-lg border border-border p-4 h-full">
                  <p className="font-semibold mb-2 flex items-center gap-2">
                    <Timer className="h-4 w-4 text-primary" />
                    {block.title}
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
                    {block.steps.map((step) => (
                      <li key={step}>{step}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>UI/UX considerations</CardTitle>
              <CardDescription>Keep notifications useful, not noisy</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              {uiNotes.map((note) => (
                <div key={note.label} className="flex items-start gap-3 rounded-lg border border-border p-3">
                  <Info className="h-4 w-4 text-primary mt-1" />
                  <div>
                    <p className="font-semibold text-foreground">{note.label}</p>
                    <p>{note.detail}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  )
}
