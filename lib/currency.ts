export function formatNaira(amount: number, maximumFractionDigits = 0) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits,
  }).format(amount)
}
