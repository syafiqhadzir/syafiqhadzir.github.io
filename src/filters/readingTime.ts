/**
 * Reading Time Filter for Eleventy
 * Calculates estimated reading time based on word count
 *
 * @module filters/readingTime
 */

/** Average reading speed in words per minute */
const WORDS_PER_MINUTE = 200;

/** Minimum reading time to display (in minutes) */
const MIN_READING_TIME = 1;

/**
 * Strip HTML tags from content
 *
 * @param {string} content - HTML content
 * @returns {string} Plain text content
 */
function stripHtml(content: string): string {
    return content
        .replace(/<[^>]*>/g, ' ') // Replace HTML tags with space (preserves word boundaries)
        .replace(/&nbsp;/g, ' ') // Replace HTML entities
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .replace(/\s+/g, ' ') // Normalize multiple spaces to single space
        .trim();
}

/**
 * Count words in a string
 *
 * @param {string} content - Text content
 * @returns {number} Word count
 */
export function wordCount(content: string | undefined | null): number {
    if (!content || typeof content !== 'string') {
        return 0;
    }

    const plainText = stripHtml(content);

    // Split by whitespace and filter empty strings
    const words = plainText
        .trim()
        .split(/\s+/)
        .filter((word) => word.length > 0);

    return words.length;
}

/**
 * Calculate reading time in minutes
 *
 * @param {string} content - Text or HTML content
 * @param {number} wordsPerMinute - Reading speed (default: 200)
 * @returns {number} Reading time in minutes (minimum 1)
 *
 * @example
 * readingTimeMinutes('<p>Hello world</p>') // 1
 * readingTimeMinutes(longArticle) // 5
 */
export function readingTimeMinutes(
    content: string | undefined | null,
    wordsPerMinute: number = WORDS_PER_MINUTE
): number {
    const words = wordCount(content);
    const minutes = Math.ceil(words / wordsPerMinute);
    return Math.max(minutes, MIN_READING_TIME);
}

/**
 * Calculate reading time and return formatted string
 *
 * @param {string} content - Text or HTML content
 * @param {object} options - Configuration options
 * @param {number} options.wordsPerMinute - Reading speed (default: 200)
 * @param {string} options.suffix - Suffix text (default: "min read")
 * @returns {string} Formatted reading time string
 *
 * @example
 * readingTime('<p>Hello world</p>') // "1 min read"
 * readingTime(longArticle, { suffix: 'minutes' }) // "5 minutes"
 */
export function readingTime(
    content: string | undefined | null,
    options: { wordsPerMinute?: number; suffix?: string } = {}
): string {
    const { wordsPerMinute = WORDS_PER_MINUTE, suffix = 'min read' } = options;

    const minutes = readingTimeMinutes(content, wordsPerMinute);
    return `${minutes} ${suffix}`;
}

/**
 * Get reading statistics for content
 *
 * @param {string} content - Text or HTML content
 * @returns {object} Statistics object
 */
export function readingStats(content: string | undefined | null): {
    wordCount: number;
    readingTime: number;
    readingTimeFormatted: string;
} {
    const words = wordCount(content);
    const minutes = readingTimeMinutes(content);

    return {
        wordCount: words,
        readingTime: minutes,
        readingTimeFormatted: `${minutes} min read`,
    };
}
