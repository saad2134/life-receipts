/**
 * Standard formatting utility functions for LifeReceipts.
 */

/**
 * Formats a monetary amount into localized currency (defaults to Indian Rupee INR ₹).
 */
export function formatCurrency(amount?: number, currency = 'INR'): string {
  if (amount === undefined || amount === null) return 'FREE';
  if (amount === 0) return 'FREE';

  if (currency === 'INR') {
    return `₹${amount.toLocaleString('en-IN', {
      minimumFractionDigits: Number.isInteger(amount) ? 0 : 2,
      maximumFractionDigits: 2,
    })}`;
  }

  return `${currency} ${amount.toFixed(2)}`;
}

/**
 * Formats an ISO 8601 timestamp into a clean readable date string.
 * Example: "14 Nov 2023, 02:14 AM"
 */
export function formatReceiptDate(timestampOrStr: string): string {
  if (!timestampOrStr) return '';
  try {
    const d = new Date(timestampOrStr);
    if (isNaN(d.getTime())) return timestampOrStr;

    return d.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  } catch {
    return timestampOrStr;
  }
}

/**
 * Formats a duration in milliseconds into "Xm Ys" or "Xh Ym".
 */
export function formatDurationMs(ms: number): string {
  if (!ms || ms <= 0) return '0s';
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  if (minutes > 0) {
    return `${minutes}m ${seconds > 0 ? `${seconds}s` : ''}`.trim();
  }
  return `${seconds}s`;
}

/**
 * Truncates text with an ellipsis if it exceeds the specified maximum length.
 */
export function truncateText(text: string, maxLength: number): string {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength).trim()}…`;
}
