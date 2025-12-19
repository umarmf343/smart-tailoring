const { PrismaClient, Prisma } = require("@prisma/client")
const { randomBytes, scryptSync } = require("crypto")

const prisma = new PrismaClient()

const SALT_LENGTH = 16
const KEY_LENGTH = 64

function hashPassword(password) {
  const salt = randomBytes(SALT_LENGTH).toString("hex")
  const derivedKey = scryptSync(password, salt, KEY_LENGTH)
  return `${salt}:${derivedKey.toString("hex")}`
}

async function resetData() {
  await prisma.notification.deleteMany()
  await prisma.message.deleteMany()
  await prisma.payment.deleteMany()
  await prisma.order.deleteMany()
  await prisma.tailorProfile.deleteMany()
  await prisma.customerProfile.deleteMany()
  await prisma.user.deleteMany()
}

async function main() {
  await resetData()

  const passwordHash = hashPassword("password123")

  const customer = await prisma.user.create({
    data: {
      id: "user-customer-001",
      email: "customer@example.com",
      name: "Amira Johnson",
      phone: "+1-202-555-0199",
      role: "CUSTOMER",
      passwordHash,
      customerProfile: {
        create: {
          defaultAddress: "45 Black & White Ave, Metropolis",
          savedMeasurements: JSON.stringify({
            height: 168,
            weight: 65,
            suit: { chest: 96, waist: 78, hips: 98 },
            dress: { bust: 94, waist: 76, hips: 100 },
          }),
          favoriteTailors: JSON.stringify(["user-tailor-001"]),
        },
      },
    },
  })

  const tailor = await prisma.user.create({
    data: {
      id: "user-tailor-001",
      email: "tailor@example.com",
      name: "Master Tailor Co.",
      phone: "+1-202-555-0147",
      role: "TAILOR",
      passwordHash,
      tailorProfile: {
        create: {
          shopName: "Master Tailor Co.",
          bio: "Bespoke suits, dresses, and premium alterations with responsive updates.",
          services: JSON.stringify(["Custom Suit", "Dress Alteration", "Shirt Customization"]),
          serviceArea: JSON.stringify(["Downtown", "Uptown", "City Center"]),
          rating: 4.9,
        },
      },
    },
  })

  const admin = await prisma.user.create({
    data: {
      id: "user-admin-001",
      email: "admin@example.com",
      name: "Platform Admin",
      role: "ADMIN",
      passwordHash,
    },
  })

  const firstOrder = await prisma.order.create({
    data: {
      id: "order-001",
      customerId: customer.id,
      tailorId: tailor.id,
      service: "Custom Suit",
      status: "IN_PROGRESS",
      price: new Prisma.Decimal(450),
      notes: "Charcoal black suit with slim fit silhouette.",
      measurementSet: JSON.stringify({
        jacket: { chest: 96, waist: 80, sleeve: 62 },
        pants: { waist: 80, inseam: 78 },
      }),
      estimatedDelivery: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
      payments: {
        create: [
          {
            id: "payment-001",
            amount: new Prisma.Decimal(200),
            method: "card",
            status: "CAPTURED",
            reference: "PAY-001",
            userId: customer.id,
          },
        ],
      },
      notifications: {
        create: [
          {
            userId: tailor.id,
            type: "order.created",
            message: "New bespoke order from Amira Johnson",
          },
        ],
      },
    },
  })

  const secondOrder = await prisma.order.create({
    data: {
      id: "order-002",
      customerId: customer.id,
      tailorId: tailor.id,
      service: "Dress Alteration",
      status: "READY_FOR_DELIVERY",
      price: new Prisma.Decimal(120),
      notes: "Shorten hem by 1cm and adjust waist.",
      measurementSet: JSON.stringify({
        dress: { bust: 94, waist: 74, hips: 98 },
      }),
      estimatedDelivery: new Date(Date.now() + 1000 * 60 * 60 * 24 * 3),
      payments: {
        create: [
          {
            id: "payment-002",
            amount: new Prisma.Decimal(120),
            method: "wallet",
            status: "CAPTURED",
            reference: "PAY-002",
            userId: customer.id,
          },
        ],
      },
    },
  })

  await prisma.message.createMany({
    data: [
      {
        id: "message-001",
        orderId: firstOrder.id,
        senderId: customer.id,
        content: "Please share progress images before final fitting.",
      },
      {
        id: "message-002",
        orderId: firstOrder.id,
        senderId: tailor.id,
        content: "Pinned shoulders are ready—photos shared in attachments.",
      },
    ],
  })

  await prisma.notification.createMany({
    data: [
      {
        id: "notification-001",
        orderId: firstOrder.id,
        userId: customer.id,
        type: "order.update",
        message: "Your suit is in progress with updated fitting notes.",
      },
      {
        id: "notification-002",
        orderId: secondOrder.id,
        userId: customer.id,
        type: "order.ready",
        message: "Your dress alteration is ready for pickup.",
      },
      {
        id: "notification-003",
        orderId: secondOrder.id,
        userId: admin.id,
        type: "admin.alert",
        message: "High-priority order flagged for SLA review.",
      },
    ],
  })

  console.log("Database seeded with demo users, profiles, orders, and payments.")
}

main()
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
