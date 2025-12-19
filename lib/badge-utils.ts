import { Award, BadgeCheck, ShieldCheck, Sparkles, Star, Zap } from "lucide-react"
import type { TailorBadge, TailorBadgeType } from "./types"
import { formatDate } from "./date"

export const BADGE_META: Record<
  TailorBadgeType,
  { label: string; description: string; icon: typeof Award; tone: string }
> = {
  professional: {
    label: "Professional Tailor",
    description: "Tenure-backed credibility and consistent order quality.",
    icon: Award,
    tone: "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-100",
  },
  "top-rated": {
    label: "Top-Rated",
    description: "4.5★+ rating with strong review volume.",
    icon: Star,
    tone: "bg-yellow-100 text-yellow-900 dark:bg-yellow-900 dark:text-yellow-100",
  },
  "express-specialist": {
    label: "Express Specialist",
    description: "Delivers rush orders on-time with high satisfaction.",
    icon: Zap,
    tone: "bg-orange-100 text-orange-900 dark:bg-orange-900 dark:text-orange-100",
  },
  verified: {
    label: "Verified",
    description: "Identity and skills verified by the Haib team.",
    icon: ShieldCheck,
    tone: "bg-emerald-100 text-emerald-900 dark:bg-emerald-900 dark:text-emerald-100",
  },
  "style-specialist": {
    label: "Style Specialist",
    description: "Recognized expertise for a specific category or style.",
    icon: Sparkles,
    tone: "bg-blue-100 text-blue-900 dark:bg-blue-900 dark:text-blue-100",
  },
}

export function getBadgeMeta(badge: TailorBadge) {
  return {
    ...badge,
    ...(BADGE_META[badge.type] ?? {}),
  }
}

export function formatBadgeStatus(status: TailorBadge["status"], expiresAt?: Date) {
  if (status === "expired") return "Expired"
  if (status === "pending") return "Pending review"
  if (expiresAt) return `Active • renews ${formatDate(expiresAt)}`
  return "Active"
}
