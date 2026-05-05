export function getStrength(pw) {
  if (!pw) return 0;
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  return score;
}

export const BUSINESS_TYPES = [
  "Retail / Toko",
  "F&B / Kuliner",
  "Jasa / Servis",
  "Manufaktur",
  "Perdagangan",
  "Lainnya"
];

export const FIELD_ERROR_MAP = {
  email: "email",
  password: "password",
  company_name: "companyName",
};