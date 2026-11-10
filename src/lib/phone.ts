/**
 * Brings a phone number to the one format the backend stores: 10 digits, no +91, spaces,
 * dashes or leading 0. Mirrors the backend rule, so the form can check before sending.
 */
export function normalizePhone(value: string): string {
  let digits = value.replace(/[\s\-()]/g, '')
  if (digits.startsWith('+91')) digits = digits.slice(3)
  else if (digits.startsWith('91') && digits.length === 12) digits = digits.slice(2)
  else if (digits.startsWith('0') && digits.length === 11) digits = digits.slice(1)
  return digits
}

export function isValidPhone(value: string): boolean {
  return /^[6-9]\d{9}$/.test(normalizePhone(value))
}

export function isValidEmail(value: string): boolean {
  return /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(value.trim())
}
