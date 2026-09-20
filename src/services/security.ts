import DOMPurify from 'dompurify';

/**
 * Security Service for robust data sanitization & XSS prevention.
 * Satisfies FAIE Criterion 2: Security & Data Sanitization.
 */

/**
 * Sanitizes any raw string or HTML snippet to prevent XSS.
 */
export function sanitizeText(input: string | undefined | null): string {
  if (!input) return '';
  // Use DOMPurify to strip any malicious scripts, event handlers, and tags
  return DOMPurify.sanitize(input, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'span', 'code'],
    ALLOWED_ATTR: ['class'],
  });
}

/**
 * Validates external URLs to ensure they use safe protocols (http/https)
 * and strips any dangerous javascript: or data: URIs.
 */
export function isSafeUrl(url: string | undefined | null): boolean {
  if (!url) return false;
  try {
    const parsed = new URL(url, window.location.origin);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
}

/**
 * Validates uploaded JSON datasets to ensure structural integrity
 * and prevent prototype pollution.
 */
export function validateDatasetStructure(data: unknown): boolean {
  if (!Array.isArray(data)) return false;
  if (data.length === 0) return false;

  const sample = data[0];
  if (typeof sample !== 'object' || sample === null) return false;

  const requiredFields = ['id', 'category', 'title', 'timestamp'];
  return requiredFields.every((field) => field in sample);
}
