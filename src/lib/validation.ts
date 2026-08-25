/** Lightweight client-side validation. Server rules will mirror these later. */

export type FieldErrors<T extends string> = Partial<Record<T, string>>;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function validateEmail(value: string) {
  if (!value.trim()) return "Email is required.";
  if (!EMAIL_PATTERN.test(value.trim())) return "Enter a valid email address.";
  return undefined;
}

export function validatePassword(value: string) {
  if (!value) return "Password is required.";
  if (value.length < 8) return "Password must be at least 8 characters.";
  return undefined;
}

export function validateName(value: string) {
  if (!value.trim()) return "Full name is required.";
  if (value.trim().length < 2) return "Enter your full name.";
  return undefined;
}

export function validateRequired(value: string, label: string) {
  if (!value.trim()) return `${label} is required.`;
  return undefined;
}

/** 0-4 strength score used by the signup meter. */
export function passwordStrength(value: string) {
  let score = 0;
  if (value.length >= 8) score += 1;
  if (value.length >= 12) score += 1;
  if (/[A-Z]/.test(value) && /[a-z]/.test(value)) score += 1;
  if (/\d/.test(value) || /[^\w\s]/.test(value)) score += 1;
  return Math.min(4, score);
}
