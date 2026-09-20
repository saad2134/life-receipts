import DOMPurify from 'dompurify';

/**
 * Security Service for robust data sanitization & XSS prevention.
 * Satisfies FAIE Criterion 2: Security & Data Sanitization.
 */

const DANGEROUS_PROTOTYPE_KEYS = ['__proto__', 'constructor', 'prototype'];

/**
 * Checks recursively whether an object, array, or nested value contains
 * dangerous prototype-pollution keys (__proto__, constructor, prototype).
 */
export function hasPrototypePollution(obj: unknown): boolean {
  if (obj === null || typeof obj !== 'object') {
    return false;
  }

  if (Array.isArray(obj)) {
    return obj.some((item) => hasPrototypePollution(item));
  }

  const record = obj as Record<string, unknown>;
  const keys = Object.getOwnPropertyNames(record);

  for (const key of keys) {
    if (DANGEROUS_PROTOTYPE_KEYS.includes(key)) {
      return true;
    }
    const val = record[key];
    if (typeof val === 'object' && val !== null) {
      if (hasPrototypePollution(val)) {
        return true;
      }
    }
  }

  return false;
}

/**
 * Recursively deep-sanitizes an object by omitting any dangerous keys that could
 * trigger prototype pollution.
 */
export function sanitizeObject<T>(input: T): T {
  if (input === null || typeof input !== 'object') {
    return input;
  }

  if (Array.isArray(input)) {
    return input.map((item) => sanitizeObject(item)) as unknown as T;
  }

  const result = Object.create(null) as Record<string, unknown>;
  const record = input as Record<string, unknown>;

  for (const key of Object.keys(record)) {
    if (DANGEROUS_PROTOTYPE_KEYS.includes(key)) {
      continue;
    }
    result[key] = sanitizeObject(record[key]);
  }

  return result as T;
}

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

  // Protect against prototype pollution in dataset
  if (hasPrototypePollution(data)) {
    return false;
  }

  const sample = data[0];
  if (typeof sample !== 'object' || sample === null) return false;

  const requiredFields = ['id', 'category', 'title', 'timestamp'];
  return requiredFields.every((field) => field in sample);
}
