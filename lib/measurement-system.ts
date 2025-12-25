import type { Measurement } from "./types"

export type MeasurementUnit = "inch" | "cm"
export type GarmentType = "shirt" | "dress" | "pants" | "blazer" | "agbada" | "kaftan" | "senator" | "buba" | "iro"
export type MeasurementStatus = "verified" | "needs-review" | "draft"

export interface MeasurementFieldDefinition {
  key: string
  label: string
  helper: string
  garmentTypes: GarmentType[]
  typicalRange?: { min: number; max: number }
}

export interface MeasurementAlert {
  level: "warning" | "info"
  message: string
  fields: string[]
}

export const MEASUREMENT_FIELDS: MeasurementFieldDefinition[] = [
  {
    key: "chest",
    label: "Chest circumference",
    helper: "Measure around the fullest part of the chest, under the arms.",
    garmentTypes: ["shirt", "blazer", "agbada", "kaftan", "senator"],
    typicalRange: { min: 28, max: 60 },
  },
  {
    key: "bust",
    label: "Bust circumference",
    helper: "Wrap the tape around the fullest part of the bust.",
    garmentTypes: ["dress", "buba"],
    typicalRange: { min: 28, max: 58 },
  },
  {
    key: "waist",
    label: "Waist circumference",
    helper: "Measure at the natural waistline; keep the tape snug.",
    garmentTypes: ["shirt", "dress", "pants", "blazer", "agbada", "kaftan", "senator", "buba", "iro"],
    typicalRange: { min: 22, max: 60 },
  },
  {
    key: "hip",
    label: "Hip circumference",
    helper: "Measure around the fullest part of the hips.",
    garmentTypes: ["dress", "pants", "shirt", "agbada", "kaftan", "senator", "buba", "iro"],
    typicalRange: { min: 30, max: 65 },
  },
  {
    key: "shoulderWidth",
    label: "Shoulder width",
    helper: "Measure from shoulder bone to shoulder bone across the back.",
    garmentTypes: ["shirt", "dress", "blazer", "agbada", "kaftan", "senator", "buba"],
    typicalRange: { min: 13, max: 24 },
  },
  {
    key: "sleeveLength",
    label: "Sleeve length",
    helper: "From shoulder seam to wrist, with elbow slightly bent.",
    garmentTypes: ["shirt", "dress", "blazer", "agbada", "kaftan", "senator", "buba"],
    typicalRange: { min: 20, max: 39 },
  },
  {
    key: "neck",
    label: "Neck circumference",
    helper: "Measure around the base of the neck where collars sit.",
    garmentTypes: ["shirt", "blazer", "senator", "kaftan"],
    typicalRange: { min: 12, max: 22 },
  },
  {
    key: "cuffSize",
    label: "Cuff size",
    helper: "Wrap the tape around the wrist bone for cuffs.",
    garmentTypes: ["shirt", "blazer", "kaftan", "senator", "agbada"],
    typicalRange: { min: 6, max: 14 },
  },
  {
    key: "shirtLength",
    label: "Shirt length",
    helper: "Measure from shoulder seam near the neck to the desired shirt hem.",
    garmentTypes: ["shirt"],
    typicalRange: { min: 22, max: 38 },
  },
  {
    key: "bicepCircumference",
    label: "Bicep circumference",
    helper: "Measure around the fullest part of the upper arm.",
    garmentTypes: ["shirt", "blazer", "agbada", "kaftan", "senator"],
    typicalRange: { min: 9, max: 22 },
  },
  {
    key: "dressLength",
    label: "Dress length",
    helper: "From the top of the shoulder to the desired hem.",
    garmentTypes: ["dress"],
    typicalRange: { min: 30, max: 70 },
  },
  {
    key: "armholeCircumference",
    label: "Armhole circumference",
    helper: "Wrap tape around the arm where it meets the shoulder.",
    garmentTypes: ["dress", "blazer", "agbada", "kaftan", "senator", "buba"],
    typicalRange: { min: 14, max: 25 },
  },
  {
    key: "inseam",
    label: "Inseam",
    helper: "From crotch to ankle bone along the inside leg.",
    garmentTypes: ["pants", "senator", "kaftan"],
    typicalRange: { min: 24, max: 38 },
  },
  {
    key: "thighCircumference",
    label: "Thigh circumference",
    helper: "Measure around the fullest part of the thigh.",
    garmentTypes: ["pants", "senator", "kaftan"],
    typicalRange: { min: 16, max: 32 },
  },
  {
    key: "kneeCircumference",
    label: "Knee circumference",
    helper: "Wrap tape around the knee cap with a slight bend.",
    garmentTypes: ["pants", "senator", "kaftan"],
    typicalRange: { min: 12, max: 24 },
  },
  {
    key: "ankleCircumference",
    label: "Ankle circumference",
    helper: "Measure just above the ankle bone.",
    garmentTypes: ["pants", "senator", "kaftan"],
    typicalRange: { min: 7, max: 16 },
  },
  {
    key: "jacketLength",
    label: "Jacket length",
    helper: "From the base of the neck to desired jacket hem.",
    garmentTypes: ["blazer"],
    typicalRange: { min: 24, max: 36 },
  },
  {
    key: "agbadaLength",
    label: "Agbada length",
    helper: "From shoulder to desired flowing hem, usually around mid-calf.",
    garmentTypes: ["agbada"],
    typicalRange: { min: 45, max: 70 },
  },
  {
    key: "kaftanLength",
    label: "Kaftan length",
    helper: "Measure from shoulder to the hem of the kaftan top.",
    garmentTypes: ["kaftan", "senator"],
    typicalRange: { min: 30, max: 50 },
  },
  {
    key: "senatorLength",
    label: "Senator top length",
    helper: "From shoulder seam to just below the hip for senator tops.",
    garmentTypes: ["senator"],
    typicalRange: { min: 30, max: 55 },
  },
  {
    key: "bubaLength",
    label: "Buba length",
    helper: "Measure from shoulder to desired buba hemline.",
    garmentTypes: ["buba"],
    typicalRange: { min: 18, max: 32 },
  },
  {
    key: "wrapperLength",
    label: "Wrapper length",
    helper: "Measure from waist to desired wrapper hem.",
    garmentTypes: ["iro"],
    typicalRange: { min: 35, max: 50 },
  },
  {
    key: "neckDepth",
    label: "Neck depth",
    helper: "Measure from the base of the neck to preferred neckline depth.",
    garmentTypes: ["agbada", "kaftan", "senator", "buba"],
    typicalRange: { min: 2, max: 10 },
  },
  {
    key: "capCircumference",
    label: "Cap circumference",
    helper: "Measure around the head for fila or cap sizing.",
    garmentTypes: ["agbada", "senator", "kaftan"],
    typicalRange: { min: 20, max: 26 },
  },
]

export const MEASUREMENT_LIBRARY: Measurement[] = [
  {
    id: "ms-agbada-classic",
    customerId: "customer-1",
    name: "Agbada Classic",
    garmentType: "agbada",
    measurements: {
      chest: 40,
      waist: 34,
      shoulderWidth: 18.25,
      sleeveLength: 25.5,
      bicepCircumference: 14.8,
      agbadaLength: 60,
      hip: 38,
      neckDepth: 4,
    },
    unit: "inch",
    status: "verified",
    primary: true,
    notes: "Verified during last fitting; includes extra allowance for flowing sleeves.",
    createdAt: new Date("2024-12-01"),
    updatedAt: new Date("2025-01-05"),
    lastUsedOrderId: "ORD-2104",
  },
  {
    id: "ms-buba-wrapper",
    customerId: "customer-1",
    name: "Buba & Wrapper Set",
    garmentType: "buba",
    measurements: {
      bust: 92,
      waist: 70,
      hip: 98,
      shoulderWidth: 39,
      sleeveLength: 56,
      bubaLength: 60,
      armholeCircumference: 42,
      wrapperLength: 105,
    },
    unit: "cm",
    status: "needs-review",
    primary: false,
    notes: "Customer asked for extra drape for aso-ebi fabric.",
    createdAt: new Date("2025-01-02"),
    updatedAt: new Date("2025-01-12"),
    lastUsedOrderId: "ORD-2180",
  },
  {
    id: "ms-senator-set",
    customerId: "customer-1",
    name: "Senator Suit",
    garmentType: "senator",
    measurements: {
      chest: 39,
      waist: 33,
      hip: 38,
      shoulderWidth: 18,
      sleeveLength: 25,
      kaftanLength: 40,
      neck: 15,
      inseam: 32,
      thighCircumference: 21,
      kneeCircumference: 15,
      ankleCircumference: 9,
    },
    unit: "inch",
    status: "draft",
    primary: false,
    notes: "Self-taken; tailor should verify neck depth and trouser hem.",
    createdAt: new Date("2025-01-15"),
    updatedAt: new Date("2025-01-18"),
  },
]

export function getFieldsForGarment(garmentType: GarmentType) {
  return MEASUREMENT_FIELDS.filter((field) => field.garmentTypes.includes(garmentType))
}

export function convertMeasurementValue(value: number, fromUnit: MeasurementUnit, toUnit: MeasurementUnit) {
  if (fromUnit === toUnit) return value
  const factor = 2.54
  return fromUnit === "inch" ? value * factor : value / factor
}

export function formatConvertedMeasurement(value: number, fromUnit: MeasurementUnit) {
  const toUnit = fromUnit === "inch" ? "cm" : "inch"
  const converted = convertMeasurementValue(value, fromUnit, toUnit)
  return `${converted.toFixed(1)} ${toUnit}`
}

export function generateMeasurementAlerts(profile: Measurement): MeasurementAlert[] {
  const alerts: MeasurementAlert[] = []
  const values = profile.measurements
  const chestLike = values.chest ?? values.bust
  const { waist, hip } = values

  if (chestLike && waist && waist > chestLike + 4) {
    alerts.push({
      level: "warning",
      message: "Waist is significantly larger than chest/bust. Confirm ease and fit preference.",
      fields: ["waist", "chest"],
    })
  }

  if (hip && waist && hip - waist > 8) {
    alerts.push({
      level: "info",
      message: "Pronounced waist-to-hip difference detected. Consider A-line or high-waist styling.",
      fields: ["hip", "waist"],
    })
  }

  Object.entries(values).forEach(([key, value]) => {
    if (typeof value !== "number") return
    const def = MEASUREMENT_FIELDS.find((field) => field.key === key)
    if (!def?.typicalRange) return
    if (value < def.typicalRange.min || value > def.typicalRange.max) {
      alerts.push({
        level: "warning",
        message: `${def.label} is outside the typical range for our patterns. Please confirm the input.`,
        fields: [key],
      })
    }
  })

  return alerts
}

export function getFitSuggestions(profile: Measurement) {
  const suggestions: string[] = []
  const values = profile.measurements
  const chestLike = values.chest ?? values.bust
  const { waist, hip, shoulderWidth, sleeveLength } = values

  if (chestLike && waist && chestLike - waist >= 6) {
    suggestions.push("Taper the waist and consider a structured side seam for a tailored silhouette.")
  }

  if (hip && waist && hip - waist >= 8) {
    suggestions.push("Use A-line or high-waisted cuts to balance waist-to-hip ratio.")
  }

  if (shoulderWidth && sleeveLength && sleeveLength / shoulderWidth > 1.6) {
    suggestions.push("Verify sleeve length against shoulder to avoid over-length sleeves.")
  }

  if (!suggestions.length) {
    suggestions.push("Measurements look balanced. Proceed with a classic tailored fit.")
  }

  return suggestions
}

export function describeGarmentType(garmentType: GarmentType) {
  switch (garmentType) {
    case "shirt":
      return "Shirt / Top"
    case "dress":
      return "Dress"
    case "pants":
      return "Pants"
    case "blazer":
      return "Suit / Blazer"
    case "agbada":
      return "Agbada Set"
    case "kaftan":
      return "Kaftan"
    case "senator":
      return "Senator Suit"
    case "buba":
      return "Buba"
    case "iro":
      return "Iro / Wrapper"
    default:
      return "Garment"
  }
}
