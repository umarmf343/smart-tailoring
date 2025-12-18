import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const signature = request.headers.get("stripe-signature")

    if (!signature) {
      return NextResponse.json({ error: "Missing signature" }, { status: 400 })
    }

    // Verify webhook signature (in production, use Stripe SDK)
    // const event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET)

    const event = JSON.parse(body)

    // Handle different event types
    switch (event.type) {
      case "payment_intent.succeeded":
        console.log("[v0] Payment succeeded:", event.data.object)
        // Update order status in database
        break

      case "payment_intent.payment_failed":
        console.log("[v0] Payment failed:", event.data.object)
        // Handle failed payment
        break

      default:
        console.log("[v0] Unhandled event type:", event.type)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    return NextResponse.json({ error: "Webhook error" }, { status: 400 })
  }
}
