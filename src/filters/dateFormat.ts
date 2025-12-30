/**
 * Date Formatting Filters for Eleventy
 * Provides various date formatting utilities for templates
 * @module filters/dateFormat
 */

/** Locale for date formatting */
const LOCALE = 'en-GB';

/** Time constants in milliseconds */
const MS_PER_SECOND = 1000;
const MS_PER_MINUTE = MS_PER_SECOND * 60;
const MS_PER_HOUR = MS_PER_MINUTE * 60;
const MS_PER_DAY = MS_PER_HOUR * 24;

/** Day thresholds for relative time */
const DAYS_PER_WEEK = 7;
const DAYS_PER_MONTH = 30;
const DAYS_PER_YEAR = 365;

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

     
    const formatOptions =
        (DATE_FORMATS as Record<string, Intl.DateTimeFormatOptions>)[format] ?? DATE_FORMATS.long;

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
    const isoString = parsedDate.toISOString();
    return isoString.includes('T') ? (isoString.split('T')[0] ?? isoString) : isoString;
}

/**
 * Format a date as a relative time string (e.g., "2 days ago")
 * @param date - Date to format
 * @returns Relative time string
 * @example
 * relativeDate(new Date(Date.now() - 86400000)) // "yesterday"
 */
/**
 * Helper to handle sub-day relative time
 * @param diffMs - Difference in milliseconds
 * @param rtf - RelativeTimeFormat instance
 * @returns Formatted string or null if not sub-day
 */
function formatSubDayTime(diffMs: number, rtf: Intl.RelativeTimeFormat): string | null {
    const diffHours = Math.floor(diffMs / MS_PER_HOUR);
    if (Math.abs(diffHours) < 1) {
        const diffMinutes = Math.floor(diffMs / MS_PER_MINUTE);
        return rtf.format(-diffMinutes, 'minute');
    }
    return rtf.format(-diffHours, 'hour');
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
    const diffDays = Math.floor(diffMs / MS_PER_DAY);

    const rtf = new Intl.RelativeTimeFormat(LOCALE, { numeric: 'auto' });

    if (Math.abs(diffDays) < 1) {
        return formatSubDayTime(diffMs, rtf) ?? rtf.format(0, 'second');
    }

    if (Math.abs(diffDays) < DAYS_PER_WEEK) {
        return rtf.format(-diffDays, 'day');
    }

    if (Math.abs(diffDays) < DAYS_PER_MONTH) {
        return rtf.format(-Math.floor(diffDays / DAYS_PER_WEEK), 'week');
    }

    if (Math.abs(diffDays) < DAYS_PER_YEAR) {
        return rtf.format(-Math.floor(diffDays / DAYS_PER_MONTH), 'month');
    }

    return rtf.format(-Math.floor(diffDays / DAYS_PER_YEAR), 'year');
}

/**
 * Get the current year (useful for copyright notices)
 * @returns Current year
 */
export function currentYear(): number {
    return new Date().getFullYear();
}
