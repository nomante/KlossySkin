export const currencySymbols: Record<string, string> = {
  USD: '$',
  EUR: '€',
  GBP: '£',
  NGN: '₦',
  GHS: '₵',
};

export function getCurrencySymbol(currency?: string): string {
  if (!currency) return '$';
  return currencySymbols[currency] || '$';
}
