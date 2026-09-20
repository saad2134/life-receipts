import { describe, it, expect } from 'vitest';
import { sanitizeText, isSafeUrl, validateDatasetStructure } from '../services/security';

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
});
