/**
 * Unit Tests for Date Formatting Filters
 * @module test/filters/dateFormat.test
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { dateFormat, isoDate, relativeDate, currentYear } from '../../src/filters/dateFormat';

describe('dateFormat filter', () => {
    describe('dateFormat()', () => {
        it('formats Date object with long format (default)', () => {
            const date = new Date('2024-01-15');
            const result = dateFormat(date);
            expect(result).toContain('January');
            expect(result).toContain('2024');
        });

        it('formats string date with long format', () => {
            const result = dateFormat('2024-06-20');
            expect(result).toContain('June');
            expect(result).toContain('2024');
        });

        it('formats date with short format', () => {
            const date = new Date('2024-12-25');
            const result = dateFormat(date, 'short');
            expect(result).toContain('Dec');
            expect(result).toContain('2024');
        });

        it('formats date with yearMonth format', () => {
            const date = new Date('2024-03-10');
            const result = dateFormat(date, 'yearMonth');
            expect(result).toContain('March');
            expect(result).toContain('2024');
            expect(result).not.toContain('10');
        });

        it('formats date with monthDay format', () => {
            const date = new Date('2024-07-04');
            const result = dateFormat(date, 'monthDay');
            expect(result).toContain('July');
            expect(result).not.toContain('2024');
        });

        it('throws error for invalid Date object', () => {
            const invalidDate = new Date('invalid');
            expect(() => dateFormat(invalidDate)).toThrow('Invalid Date object provided');
        });

        it('throws error for invalid date string', () => {
            expect(() => dateFormat('not-a-date')).toThrow('Cannot parse date');
        });

        it('handles timestamp number', () => {
            const timestamp = Date.parse('2024-10-31');
            const result = dateFormat(timestamp);
            expect(result).toContain('October');
            expect(result).toContain('2024');
        });
    });

    describe('isoDate()', () => {
        it('formats Date object to ISO format', () => {
            const date = new Date('2024-01-15T12:00:00Z');
            const result = isoDate(date);
            expect(result).toBe('2024-01-15');
        });

        it('formats string date to ISO format', () => {
            const result = isoDate('2024-12-25');
            expect(result).toBe('2024-12-25');
        });

        it('formats timestamp to ISO format', () => {
            const timestamp = Date.UTC(2024, 5, 15); // June 15, 2024
            const result = isoDate(timestamp);
            expect(result).toBe('2024-06-15');
        });

        it('throws error for invalid date', () => {
            expect(() => isoDate('invalid')).toThrow('Cannot parse date');
        });
    });

    describe('relativeDate()', () => {
        let now: Date;

        beforeEach(() => {
            now = new Date();
        });

        it('returns relative time for yesterday', () => {
            const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
            const result = relativeDate(yesterday);
            expect(result.toLowerCase()).toContain('yesterday');
        });

        it('returns relative time for days ago', () => {
            const threeDaysAgo = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000);
            const result = relativeDate(threeDaysAgo);
            expect(result).toContain('3');
            expect(result.toLowerCase()).toContain('day');
        });

        it('returns relative time for weeks ago', () => {
            const twoWeeksAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);
            const result = relativeDate(twoWeeksAgo);
            expect(result).toContain('2');
            expect(result.toLowerCase()).toContain('week');
        });

        it('returns relative time for months ago', () => {
            const twoMonthsAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);
            const result = relativeDate(twoMonthsAgo);
            expect(result).toContain('2');
            expect(result.toLowerCase()).toContain('month');
        });

        it('returns relative time for years ago', () => {
            const twoYearsAgo = new Date(now.getTime() - 730 * 24 * 60 * 60 * 1000);
            const result = relativeDate(twoYearsAgo);
            expect(result).toContain('2');
            expect(result.toLowerCase()).toContain('year');
        });

        it('returns relative time for hours ago', () => {
            const twoHoursAgo = new Date(now.getTime() - 2 * 60 * 60 * 1000);
            const result = relativeDate(twoHoursAgo);
            expect(result).toContain('2');
            expect(result.toLowerCase()).toContain('hour');
        });

        it('returns relative time for minutes ago', () => {
            const fiveMinutesAgo = new Date(now.getTime() - 5 * 60 * 1000);
            const result = relativeDate(fiveMinutesAgo);
            expect(result).toContain('5');
            expect(result.toLowerCase()).toContain('minute');
        });
    });

    describe('currentYear()', () => {
        it('returns the current year', () => {
            const result = currentYear();
            expect(result).toBe(new Date().getFullYear());
        });

        it('returns a four-digit number', () => {
            const result = currentYear();
            expect(result).toBeGreaterThanOrEqual(2024);
            expect(result).toBeLessThan(3000);
        });
    });
});
