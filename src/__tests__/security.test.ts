import { describe, it, expect } from 'vitest';
import {
  sanitizeText,
  isSafeUrl,
  validateDatasetStructure,
  hasPrototypePollution,
  sanitizeObject,
} from '../services/security';

describe('Security & Data Sanitization Service (FAIE Parameter 2)', () => {
  it('strips malicious <script> tags and prevents XSS', () => {
    const maliciousInput = 'Hello <script>alert("XSS")</script> World';
    const sanitized = sanitizeText(maliciousInput);
    expect(sanitized).not.toContain('<script>');
    expect(sanitized).not.toContain('alert');
    expect(sanitized).toContain('Hello');
    expect(sanitized).toContain('World');
  });

  it('strips malicious event handlers such as onerror and onclick', () => {
    const maliciousImg = '<img src="x" onerror="stealData()" />';
    const sanitized = sanitizeText(maliciousImg);
    expect(sanitized).not.toContain('onerror');
    expect(sanitized).not.toContain('stealData()');
  });

  it('preserves benign formatting tags like <b> and <code>', () => {
    const safeHtml = 'Receipt for <b>Spotify</b> subscription';
    const sanitized = sanitizeText(safeHtml);
    expect(sanitized).toContain('<b>Spotify</b>');
  });

  it('validates safe HTTP and HTTPS URLs and rejects javascript: schemes', () => {
    expect(isSafeUrl('https://open.spotify.com/track/123')).toBe(true);
    expect(isSafeUrl('http://localhost:5173')).toBe(true);
    expect(isSafeUrl('javascript:alert(1)')).toBe(false);
    expect(isSafeUrl('')).toBe(false);
    expect(isSafeUrl(null)).toBe(false);
  });

  it('validates imported dataset structure and rejects corrupted formats', () => {
    const validData = [
      { id: '1', category: 'music', title: 'Song', timestamp: '2023-01-01' },
    ];
    expect(validateDatasetStructure(validData)).toBe(true);

    const invalidData = [{ unknownField: 'test' }];
    expect(validateDatasetStructure(invalidData)).toBe(false);
    expect(validateDatasetStructure([])).toBe(false);
    expect(validateDatasetStructure('not an array')).toBe(false);
  });

  it('detects and blocks prototype pollution payload keys (__proto__, constructor, prototype)', () => {
    const pollutedJson = JSON.parse('{"__proto__": {"admin": true}, "title": "Innocent"}');
    expect(hasPrototypePollution(pollutedJson)).toBe(true);

    const nestedPolluted = [{ metadata: JSON.parse('{"constructor": {"evil": true}}') }];
    expect(hasPrototypePollution(nestedPolluted)).toBe(true);

    const safeObj = [{ id: '1', category: 'purchase', title: 'Tea', timestamp: '2023-01-01' }];
    expect(hasPrototypePollution(safeObj)).toBe(false);
  });

  it('rejects datasets containing prototype pollution in validateDatasetStructure', () => {
    const pollutedDataset = [
      JSON.parse('{"id": "1", "category": "music", "title": "Song", "timestamp": "2023-01-01", "__proto__": {"polluted": true}}')
    ];
    expect(validateDatasetStructure(pollutedDataset)).toBe(false);
  });

  it('deep-sanitizes objects by removing dangerous prototype keys', () => {
    const rawObj = JSON.parse('{"title": "Safe", "__proto__": {"bad": true}}');
    const sanitized = sanitizeObject(rawObj);
    expect(sanitized.title).toBe('Safe');
    expect(hasPrototypePollution(sanitized)).toBe(false);
  });
});
