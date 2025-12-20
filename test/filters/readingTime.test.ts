/**
 * Unit Tests for Reading Time Filter
 *
 * @module test/filters/readingTime.test
 */

import { describe, it, expect } from 'vitest';
import {
    wordCount,
    readingTime,
    readingTimeMinutes,
    readingStats,
} from '../../src/filters/readingTime';

describe('readingTime filter', () => {
    describe('wordCount()', () => {
        it('counts words in plain text', () => {
            const text = 'Hello world this is a test';
            expect(wordCount(text)).toBe(6);
        });

        it('counts words in HTML content', () => {
            const html = '<p>Hello <strong>world</strong> this is a test</p>';
            expect(wordCount(html)).toBe(6);
        });

        it('returns 0 for empty string', () => {
            expect(wordCount('')).toBe(0);
        });

        it('returns 0 for null', () => {
            expect(wordCount(null)).toBe(0);
        });

        it('returns 0 for undefined', () => {
            expect(wordCount(undefined)).toBe(0);
        });

        it('handles multiple whitespace characters', () => {
            const text = 'Hello   world\n\nthis\tis   a test';
            expect(wordCount(text)).toBe(6);
        });

        it('handles HTML entities', () => {
            const html = '<p>Hello&nbsp;world &amp; test</p>';
            const count = wordCount(html);
            expect(count).toBeGreaterThanOrEqual(3);
        });

        it('handles nested HTML tags', () => {
            const html = '<div><p><span>Hello</span> <em>world</em></p></div>';
            expect(wordCount(html)).toBe(2);
        });

        it('handles self-closing tags', () => {
            const html = 'Hello<br/>world';
            expect(wordCount(html)).toBe(2);
        });
    });

    describe('readingTimeMinutes()', () => {
        it('returns 1 for short content', () => {
            const text = 'Hello world';
            expect(readingTimeMinutes(text)).toBe(1);
        });

        it('calculates correct time for 200-word content', () => {
            const words = Array(200).fill('word').join(' ');
            expect(readingTimeMinutes(words)).toBe(1);
        });

        it('calculates correct time for 400-word content', () => {
            const words = Array(400).fill('word').join(' ');
            expect(readingTimeMinutes(words)).toBe(2);
        });

        it('calculates correct time for 1000-word content', () => {
            const words = Array(1000).fill('word').join(' ');
            expect(readingTimeMinutes(words)).toBe(5);
        });

        it('rounds up to nearest minute', () => {
            const words = Array(250).fill('word').join(' ');
            expect(readingTimeMinutes(words)).toBe(2);
        });

        it('uses custom words per minute', () => {
            const words = Array(300).fill('word').join(' ');
            expect(readingTimeMinutes(words, 100)).toBe(3);
        });

        it('returns minimum 1 minute for empty content', () => {
            expect(readingTimeMinutes('')).toBe(1);
        });

        it('handles null content', () => {
            expect(readingTimeMinutes(null)).toBe(1);
        });
    });

    describe('readingTime()', () => {
        it('returns formatted reading time with default suffix', () => {
            const text = 'Hello world';
            expect(readingTime(text)).toBe('1 min read');
        });

        it('returns correct time for longer content', () => {
            const words = Array(1000).fill('word').join(' ');
            expect(readingTime(words)).toBe('5 min read');
        });

        it('uses custom suffix', () => {
            const text = 'Hello world';
            expect(readingTime(text, { suffix: 'minutes' })).toBe('1 minutes');
        });

        it('uses custom words per minute', () => {
            const words = Array(300).fill('word').join(' ');
            expect(readingTime(words, { wordsPerMinute: 100 })).toBe('3 min read');
        });

        it('uses both custom options', () => {
            const words = Array(500).fill('word').join(' ');
            const result = readingTime(words, {
                wordsPerMinute: 100,
                suffix: 'min',
            });
            expect(result).toBe('5 min');
        });
    });

    describe('readingStats()', () => {
        it('returns complete statistics object', () => {
            const words = Array(450).fill('word').join(' ');
            const stats = readingStats(words);

            expect(stats).toHaveProperty('wordCount');
            expect(stats).toHaveProperty('readingTime');
            expect(stats).toHaveProperty('readingTimeFormatted');
        });

        it('returns correct word count', () => {
            const text = 'one two three four five';
            const stats = readingStats(text);
            expect(stats.wordCount).toBe(5);
        });

        it('returns correct reading time', () => {
            const words = Array(600).fill('word').join(' ');
            const stats = readingStats(words);
            expect(stats.readingTime).toBe(3);
        });

        it('returns formatted reading time', () => {
            const words = Array(400).fill('word').join(' ');
            const stats = readingStats(words);
            expect(stats.readingTimeFormatted).toBe('2 min read');
        });

        it('handles empty content', () => {
            const stats = readingStats('');
            expect(stats.wordCount).toBe(0);
            expect(stats.readingTime).toBe(1);
            expect(stats.readingTimeFormatted).toBe('1 min read');
        });

        it('handles HTML content', () => {
            const html = '<p>Word</p>'.repeat(100);
            const stats = readingStats(html);
            expect(stats.wordCount).toBe(100);
        });
    });
});
