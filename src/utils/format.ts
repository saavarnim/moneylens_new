
/**
 * Utility functions for formatting values in MoneyLens
 */

/**
 * Format a number as Indian Rupees
 */
export function formatRupee(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Format a date to YYYY-MM-DD format for input fields
 */
export function formatDateForInput(date: Date): string {
  return date.toISOString().split('T')[0];
}

/**
 * Format a time to HH:MM format for input fields
 */
export function formatTimeForInput(date: Date): string {
  return date.toTimeString().slice(0, 5);
}

/**
 * Format a date and time for display
 */
export function formatDateTime(date: Date): string {
  return new Intl.DateTimeFormat('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

/**
 * Calculate percentage and format it
 */
export function formatPercentage(value: number, total: number): string {
  if (total === 0) return '0%';
  return `${Math.round((value / total) * 100)}%`;
}
