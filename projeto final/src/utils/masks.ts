/**
 * Formats a raw number or numeric string as BRL Currency (e.g. 1250.50 -> R$ 1.250,50)
 */
export const formatCurrency = (value: number | string): string => {
  const numericValue = typeof value === 'string' ? parseFloat(value) : value;
  if (isNaN(numericValue)) return 'R$ 0,00';
  
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(numericValue);
};

/**
 * Format raw input characters to currency format as the user types (e.g., "1250" -> "12,50" -> "R$ 12,50")
 */
export const maskCurrency = (value: string): string => {
  // Remove anything that is not a digit
  const digitsOnly = value.replace(/\D/g, '');
  if (!digitsOnly) return '';

  const amount = parseFloat(digitsOnly) / 100;
  
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(amount);
};

/**
 * Parses a masked BRL currency string back to a float (e.g. "R$ 1.250,50" -> 1250.5)
 */
export const parseCurrencyToNumber = (maskedValue: string): number => {
  if (!maskedValue) return 0;
  
  // Keep only digits and the last comma (or dot)
  const cleaned = maskedValue
    .replace(/[^\d,]/g, '') // remove currency symbols and dots
    .replace(',', '.');     // swap comma to dot for parsing
    
  const parsed = parseFloat(cleaned);
  return isNaN(parsed) ? 0 : parsed;
};

/**
 * Generates a unique UUID-like string
 */
export const generateUUID = (): string => {
  if (typeof window !== 'undefined' && window.crypto && typeof window.crypto.randomUUID === 'function') {
    return window.crypto.randomUUID();
  }
  
  // Fallback UUID generator
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};
