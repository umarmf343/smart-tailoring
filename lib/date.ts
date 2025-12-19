const DEFAULT_DATE_FORMAT: Intl.DateTimeFormatOptions = {
  month: "short",
  day: "numeric",
  year: "numeric",
}

type DateInput = Date | string | number

export function formatDate(
  dateInput: DateInput,
  options: Intl.DateTimeFormatOptions = DEFAULT_DATE_FORMAT,
  locale = "en-US"
): string {
  const date = dateInput instanceof Date ? dateInput : new Date(dateInput)

  return new Intl.DateTimeFormat(locale, options).format(date)
}
