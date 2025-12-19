import { type NextRequest, NextResponse } from "next/server"
import { z } from "zod"

import { prisma } from "@/lib/prisma"

const createOrderSchema = z.object({
  customerId: z.string().min(1),
  tailorId: z.string().min(1),
  service: z.string().min(1),
  status: z.string().optional(),
  price: z.number().nonnegative(),
  notes: z.string().optional(),
  measurementSet: z.record(z.unknown()).optional(),
  estimatedDelivery: z.string().datetime().optional(),
})

const statusLookup: Record<string, string> = {
  pending: "PENDING",
  confirmed: "CONFIRMED",
  "in-progress": "IN_PROGRESS",
  "fitting-required": "FITTING_REQUIRED",
  "ready-for-delivery": "READY_FOR_DELIVERY",
  completed: "COMPLETED",
  delivered: "DELIVERED",
  cancelled: "CANCELLED",
}

const responseStatusLookup: Record<string, string> = {
  PENDING: "pending",
  CONFIRMED: "confirmed",
  IN_PROGRESS: "in-progress",
  FITTING_REQUIRED: "fitting-required",
  READY_FOR_DELIVERY: "ready-for-delivery",
  COMPLETED: "completed",
  DELIVERED: "delivered",
  CANCELLED: "cancelled",
}

function parseStatus(status: string | null) {
  if (!status) return undefined
  return statusLookup[status.toLowerCase()] ?? undefined
}

function serializeOrder(order: Awaited<ReturnType<typeof prisma.order.findFirst>>) {
  if (!order) return order
  let parsedMeasurements: unknown = null

  if (order.measurementSet) {
    try {
      parsedMeasurements = JSON.parse(order.measurementSet)
    } catch {
      parsedMeasurements = order.measurementSet
    }
  }

  return {
    ...order,
    price: Number(order.price),
    measurementSet: parsedMeasurements,
    status: responseStatusLookup[order.status] ?? order.status,
    payments: order.payments?.map((payment) => ({
      ...payment,
      amount: Number(payment.amount),
    })),
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")
    const role = searchParams.get("role")
    const status = parseStatus(searchParams.get("status"))

    const where = {
      ...(status ? { status } : {}),
      ...(userId && role === "customer" ? { customerId: userId } : {}),
      ...(userId && role === "tailor" ? { tailorId: userId } : {}),
    }

    const orders = await prisma.order.findMany({
      where,
      include: {
        customer: { select: { id: true, name: true, email: true } },
        tailor: { select: { id: true, name: true, email: true } },
        payments: true,
      },
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json({ success: true, orders: orders.map(serializeOrder) })
  } catch (error) {
    console.error("[ORDERS_GET]", error)
    return NextResponse.json({ success: false, error: "Failed to fetch orders" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const parsed = createOrderSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json({ success: false, error: parsed.error.flatten() }, { status: 400 })
    }

    const { customerId, tailorId, service, price, notes, measurementSet, estimatedDelivery, status } = parsed.data

    const [customer, tailor] = await Promise.all([
      prisma.user.findUnique({ where: { id: customerId } }),
      prisma.user.findUnique({ where: { id: tailorId } }),
    ])

    if (!customer || !tailor) {
      return NextResponse.json({ success: false, error: "Customer or tailor not found" }, { status: 404 })
    }

    const order = await prisma.order.create({
      data: {
        customerId,
        tailorId,
        service,
        price,
        notes,
        measurementSet: measurementSet ? JSON.stringify(measurementSet) : null,
        estimatedDelivery: estimatedDelivery ? new Date(estimatedDelivery) : null,
        status: status ? parseStatus(status) ?? status.toUpperCase() : "PENDING",
      },
      include: {
        customer: { select: { id: true, name: true, email: true } },
        tailor: { select: { id: true, name: true, email: true } },
        payments: true,
      },
    })

    return NextResponse.json({ success: true, order: serializeOrder(order) }, { status: 201 })
  } catch (error) {
    console.error("[ORDERS_POST]", error)
    return NextResponse.json({ success: false, error: "Failed to create order" }, { status: 500 })
  }
}
