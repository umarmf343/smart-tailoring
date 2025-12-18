// User Types
export type UserRole = "customer" | "tailor" | "admin"

export interface User {
  id: string
  email: string
  phone: string
  name: string
  role: UserRole
  profileImage?: string
  createdAt: Date
  updatedAt: Date
}

export interface Customer extends User {
  role: "customer"
  address?: string
  measurements: Measurement[]
  savedTailors: string[] // tailor IDs
  wallet: number
}

export interface Tailor extends User {
  role: "tailor"
  businessName: string
  location: {
    address: string
    latitude: number
    longitude: number
  }
  services: string[]
  specialties: string[]
  businessHours: string
  pricing: TailorPricing[]
  rating: number
  reviewCount: number
  approved: boolean
  commission: number
  expressSettings?: TailorExpressSettings
  badges?: TailorBadge[]
}

export interface Admin extends User {
  role: "admin"
  permissions: string[]
}

// Measurement Types
export interface Measurement {
  id: string
  customerId: string
  name: string // e.g., "Formal Suit", "Casual Wear"
  garmentType: "shirt" | "dress" | "pants" | "blazer"
  measurements: {
    chest?: number
    bust?: number
    waist?: number
    hip?: number
    hips?: number
    shoulderWidth?: number
    sleeveLength?: number
    cuffSize?: number
    inseam?: number
    neck?: number
    bicepCircumference?: number
    shirtLength?: number
    dressLength?: number
    armholeCircumference?: number
    thighCircumference?: number
    kneeCircumference?: number
    ankleCircumference?: number
    jacketLength?: number
    // Add more as needed
    [key: string]: number | undefined
  }
  unit: "cm" | "inch"
  status: "draft" | "verified" | "needs-review"
  primary?: boolean
  notes?: string
  lastUsedOrderId?: string
  createdAt: Date
  updatedAt: Date
}

// Order Types
export type OrderStatus =
  | "pending"
  | "confirmed"
  | "in-progress"
  | "fitting-required"
  | "completed"
  | "delivered"
  | "cancelled"

export interface Order {
  id: string
  customerId: string
  tailorId: string
  service: string
  description: string
  measurementId: string
  fabricChoice?: string
  customDesign?: string
  specialInstructions?: string
  status: OrderStatus
  price: number
  expressRequested?: boolean
  expressFee?: number
  expressPromiseAt?: Date
  estimatedDelivery?: Date
  createdAt: Date
  updatedAt: Date
}

// Review Types
export interface Review {
  id: string
  orderId: string
  customerId: string
  tailorId: string
  rating: number
  comment: string
  tailorResponse?: string
  createdAt: Date
}

// Message Types
export interface Message {
  id: string
  senderId: string
  receiverId: string
  orderId?: string
  content: string
  attachments?: string[]
  read: boolean
  createdAt: Date
}

// Payment Types
export interface Payment {
  id: string
  orderId: string
  customerId: string
  tailorId: string
  amount: number
  status: "pending" | "completed" | "refunded" | "failed"
  paymentMethod: string
  transactionId?: string
  createdAt: Date
}

// Tailor Pricing
export interface TailorPricing {
  service: string
  basePrice: number
  description: string
}

// Notification Types
export interface Notification {
  id: string
  userId: string
  type: "order" | "message" | "review" | "system"
  title: string
  message: string
  read: boolean
  link?: string
  createdAt: Date
}

// Promotion Types
export interface Promotion {
  id: string
  code: string
  discountType: "percentage" | "fixed"
  discountValue: number
  minOrderAmount?: number
  maxUses?: number
  usedCount: number
  validFrom: Date
  validUntil: Date
  active: boolean
}

// Dispute Types
export interface Dispute {
  id: string
  orderId: string
  customerId: string
  tailorId: string
  reason: string
  description: string
  status: "open" | "investigating" | "resolved" | "rejected"
  refundAmount?: number
  createdAt: Date
  resolvedAt?: Date
}

// Support Ticket Types
export interface SupportTicket {
  id: string
  userId: string
  category: string
  subject: string
  description: string
  status: "open" | "in-progress" | "resolved" | "closed"
  priority: "low" | "medium" | "high" | "critical"
  responses: SupportResponse[]
  createdAt: Date
  updatedAt: Date
}

export interface SupportResponse {
  id: string
  ticketId: string
  responderId: string
  responderRole: "admin" | "customer" | "tailor"
  message: string
  createdAt: Date
}

// Analytics Types
export interface PlatformAnalytics {
  totalUsers: number
  totalCustomers: number
  totalTailors: number
  totalOrders: number
  totalRevenue: number
  activeOrders: number
  completedOrders: number
  averageOrderValue: number
}

export interface DeliveryOption {
  type: "pickup" | "delivery"
  address?: string
  instructions?: string
  fee?: number
}

export interface ReferralProgram {
  id: string
  userId: string
  referralCode: string
  referredUsers: string[]
  totalEarned: number
  createdAt: Date
}

export interface ServiceArea {
  id: string
  tailorId: string
  zipCode: string
  city: string
  deliveryFee: number
}

// Tailor badge system
export type TailorBadgeType =
  | "professional"
  | "top-rated"
  | "express-specialist"
  | "verified"
  | "style-specialist"

export interface TailorBadge {
  id: string
  type: TailorBadgeType
  label: string
  description: string
  awardedAt: Date
  expiresAt?: Date
  status: "active" | "pending" | "expired"
  source: "automated" | "manual"
  specialty?: string
}

// Express service capacity
export interface TailorExpressSettings {
  enabled: boolean
  expressSlaDays: number
  standardSlaDays: number
  feeRate: number // e.g., 0.2 = 20%
  minimumFee?: number
  weeklyCap: number
  weeklyInUse: number
  concurrentCap: number
  concurrentInUse: number
}
