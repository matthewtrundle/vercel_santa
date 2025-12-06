import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { cn, generateSessionId, formatDate, sleep } from './utils';

describe('cn', () => {
  it('merges class names correctly', () => {
    expect(cn('foo', 'bar')).toBe('foo bar');
  });

  it('handles conditional classes', () => {
    expect(cn('base', true && 'included', false && 'excluded')).toBe('base included');
  });

  it('merges tailwind classes correctly', () => {
    expect(cn('px-2 py-1', 'px-4')).toBe('py-1 px-4');
  });

  it('handles arrays of classes', () => {
    expect(cn(['foo', 'bar'])).toBe('foo bar');
  });

  it('handles undefined and null values', () => {
    expect(cn('foo', undefined, null, 'bar')).toBe('foo bar');
  });

  it('handles empty inputs', () => {
    expect(cn()).toBe('');
  });
});

describe('generateSessionId', () => {
  it('generates a string starting with session_', () => {
    const id = generateSessionId();
    expect(id).toMatch(/^session_/);
  });

  it('includes a timestamp', () => {
    const before = Date.now();
    const id = generateSessionId();
    const after = Date.now();

    const timestampPart = id.split('_')[1];
    const timestamp = parseInt(timestampPart, 10);

    expect(timestamp).toBeGreaterThanOrEqual(before);
    expect(timestamp).toBeLessThanOrEqual(after);
  });

  it('includes a random suffix', () => {
    const id = generateSessionId();
    const parts = id.split('_');
    expect(parts[2]).toMatch(/^[a-z0-9]+$/);
  });

  it('generates unique ids', () => {
    const ids = new Set(Array.from({ length: 100 }, () => generateSessionId()));
    expect(ids.size).toBe(100);
  });
});

describe('formatDate', () => {
  it('formats a date correctly', () => {
    // Use explicit UTC time to avoid timezone issues
    const date = new Date(Date.UTC(2024, 11, 25, 12, 0, 0)); // Dec 25, 2024
    const formatted = formatDate(date);
    expect(formatted).toContain('December');
    expect(formatted).toContain('2024');
  });

  it('handles different months', () => {
    const date = new Date(Date.UTC(2024, 0, 15, 12, 0, 0)); // Jan 15, 2024
    const formatted = formatDate(date);
    expect(formatted).toContain('January');
    expect(formatted).toContain('2024');
  });

  it('handles single-digit days correctly', () => {
    const date = new Date(Date.UTC(2024, 2, 5, 12, 0, 0)); // Mar 5, 2024
    const formatted = formatDate(date);
    expect(formatted).toContain('March');
    expect(formatted).toContain('2024');
  });
});

describe('sleep', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('resolves after the specified time', async () => {
    const promise = sleep(1000);

    vi.advanceTimersByTime(999);
    expect(vi.getTimerCount()).toBe(1);

    vi.advanceTimersByTime(1);
    await promise;
    expect(vi.getTimerCount()).toBe(0);
  });

  it('returns a promise', () => {
    const result = sleep(100);
    expect(result).toBeInstanceOf(Promise);
  });
});
