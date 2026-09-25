import { formatCurrency, formatDate, formatRelativeTime, slugify, truncate, getWhatsAppUrl, cn } from '@/lib/utils';

describe('Utility Functions', () => {
  describe('formatCurrency', () => {
    it('formats cents to dollars correctly', () => {
      expect(formatCurrency(0)).toBe('$0');
      expect(formatCurrency(99)).toBe('$0.99');
      expect(formatCurrency(100)).toBe('$1');
      expect(formatCurrency(999)).toBe('$9.99');
      expect(formatCurrency(10000)).toBe('$100');
    });

    it('handles different currencies', () => {
      expect(formatCurrency(1000, 'EUR')).toBe('€10');
      expect(formatCurrency(1000, 'GBP')).toBe('£10');
    });
  });

  describe('formatDate', () => {
    it('formats date correctly', () => {
      const date = new Date('2024-01-15T10:30:00Z');
      const formatted = formatDate(date);
      expect(formatted).toContain('January');
      expect(formatted).toContain('15');
      expect(formatted).toContain('2024');
    });
  });

  describe('formatRelativeTime', () => {
    it('shows "Just now" for recent times', () => {
      const now = new Date();
      expect(formatRelativeTime(now)).toBe('Just now');
    });

    it('shows minutes for recent past', () => {
      const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
      expect(formatRelativeTime(fiveMinutesAgo)).toBe('5m ago');
    });

    it('shows hours for older times', () => {
      const threeHoursAgo = new Date(Date.now() - 3 * 60 * 60 * 1000);
      expect(formatRelativeTime(threeHoursAgo)).toBe('3h ago');
    });

    it('shows days for older times', () => {
      const twoDaysAgo = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000);
      expect(formatRelativeTime(twoDaysAgo)).toBe('2d ago');
    });
  });

  describe('slugify', () => {
    it('converts text to slug', () => {
      expect(slugify('Hello World')).toBe('hello-world');
      expect(slugify('Test 123!')).toBe('test-123');
      expect(slugify('  Multiple   Spaces  ')).toBe('multiple-spaces');
      expect(slugify('Special@#$Chars')).toBe('specialchars');
    });
  });

  describe('truncate', () => {
    it('truncates long text', () => {
      expect(truncate('Hello World', 8)).toBe('Hello...');
      expect(truncate('Short', 10)).toBe('Short');
      expect(truncate('Exact Length', 12)).toBe('Exact Length');
    });
  });

  describe('getWhatsAppUrl', () => {
    it('generates correct WhatsApp URL', () => {
      expect(getWhatsAppUrl('15551234567')).toBe('https://wa.me/15551234567');
      expect(getWhatsAppUrl('+1 555 123 4567')).toBe('https://wa.me/15551234567');
    });

    it('includes message when provided', () => {
      const url = getWhatsAppUrl('15551234567', 'Hello!');
      expect(url).toContain('text=Hello%21');
    });
  });

  describe('cn (classnames)', () => {
    it('combines class names', () => {
      expect(cn('base', 'extra')).toBe('base extra');
      expect(cn('base', false && 'conditional')).toBe('base');
      expect(cn('base', true && 'conditional')).toBe('base conditional');
    });
  });
});