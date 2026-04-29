import { describe, it, expect } from 'vitest';
import { formatCOP, toggle } from '../utils/format';

describe('formatCOP', () => {
  it('formats exact millions without decimal', () => {
    expect(formatCOP(5_000_000)).toBe('$5M');
  });

  it('formats millions with one decimal', () => {
    expect(formatCOP(1_500_000)).toBe('$1.5M');
  });

  it('formats thousands', () => {
    expect(formatCOP(500_000)).toBe('$500K');
  });

  it('formats sub-thousand amounts', () => {
    expect(formatCOP(500)).toBe('$500');
  });

  it('formats zero', () => {
    expect(formatCOP(0)).toBe('$0');
  });

  it('does not throw when called with undefined at runtime', () => {
    expect(() => (formatCOP as (n: unknown) => string)(undefined)).not.toThrow();
  });
});

describe('toggle', () => {
  it('adds an item not in the list', () => {
    expect(toggle([1, 2], 3)).toContain(3);
  });

  it('removes an item already in the list', () => {
    expect(toggle([1, 2, 3], 2)).not.toContain(2);
  });

  it('returns same other items unchanged', () => {
    const result = toggle([1, 2, 3], 2);
    expect(result).toContain(1);
    expect(result).toContain(3);
  });
});
