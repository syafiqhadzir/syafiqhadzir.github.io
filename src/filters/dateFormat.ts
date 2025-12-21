/**
 * Date Formatting Filters for Eleventy
 * Provides various date formatting utilities for templates
 * @module filters/dateFormat
 */

/** Locale for date formatting */
const LOCALE = 'en-GB';

/**
 * Format options for different date styles
 */
const DATE_FORMATS = {
    long: {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    } as Intl.DateTimeFormatOptions,
    short: {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    } as Intl.DateTimeFormatOptions,
    yearMonth: {
        year: 'numeric',
        month: 'long',
    } as Intl.DateTimeFormatOptions,
    monthDay: {
        month: 'long',
        day: 'numeric',
    } as Intl.DateTimeFormatOptions,
};

/**
 * Parse a date input to a Date object
 * @param date - Date input
 * @returns Parsed Date object
 * @throws {Error} If date is invalid
 */
function parseDate(date: Date | string | number): Date {
    if (date instanceof Date) {
        if (Number.isNaN(date.getTime())) {
            throw new TypeError('Invalid Date object provided');
        }
        return date;
    }

    const parsed = new Date(date);
    if (Number.isNaN(parsed.getTime())) {
        throw new TypeError(`Cannot parse date: ${String(date)}`);
    }
    return parsed;
}

/**
 * Format a date to a human-readable string
 * @param date - Date to format
 * @param format - Format style or custom format
 * @returns Formatted date string
 * @example
 * dateFormat(new Date('2024-01-15'), 'long') // "15 January 2024"
 * dateFormat('2024-01-15', 'short') // "15 Jan 2024"
 */
export function dateFormat(
    date: Date | string | number,
    format: keyof typeof DATE_FORMATS = 'long'
): string {
    const parsedDate = parseDate(date);
    const formatOptions = DATE_FORMATS[format] ?? DATE_FORMATS.long;

    return new Intl.DateTimeFormat(LOCALE, formatOptions).format(parsedDate);
}

/**
 * Format a date to ISO 8601 format (YYYY-MM-DD)
 * Useful for Schema.org structured data and attributes
 * @param date - Date to format
 * @returns ISO formatted date string
 * @example
 * isoDate(new Date('2024-01-15')) // "2024-01-15"
 */
export function isoDate(date: Date | string | number): string {
    const parsedDate = parseDate(date);
    return parsedDate.toISOString().split('T')[0];
}

/**
 * Format a date as a relative time string (e.g., "2 days ago")
 * @param date - Date to format
 * @returns Relative time string
 * @example
 * relativeDate(new Date(Date.now() - 86400000)) // "yesterday"
 */
export function relativeDate(date: Date | string | number): string {
    const parsedDate = parseDate(date);
    const now = new Date();
    const diffMs = now.getTime() - parsedDate.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    const rtf = new Intl.RelativeTimeFormat(LOCALE, { numeric: 'auto' });

    if (Math.abs(diffDays) < 1) {
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
        if (Math.abs(diffHours) < 1) {
            const diffMinutes = Math.floor(diffMs / (1000 * 60));
            return rtf.format(-diffMinutes, 'minute');
        }
        return rtf.format(-diffHours, 'hour');
    }

    if (Math.abs(diffDays) < 7) {
        return rtf.format(-diffDays, 'day');
    }

    if (Math.abs(diffDays) < 30) {
        const diffWeeks = Math.floor(diffDays / 7);
        return rtf.format(-diffWeeks, 'week');
    }

    if (Math.abs(diffDays) < 365) {
        const diffMonths = Math.floor(diffDays / 30);
        return rtf.format(-diffMonths, 'month');
    }

    const diffYears = Math.floor(diffDays / 365);
    return rtf.format(-diffYears, 'year');
}

/**
 * Get the current year (useful for copyright notices)
 * @returns Current year
 */
export function currentYear(): number {
    return new Date().getFullYear();
}
