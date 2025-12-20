/**
 * Unit Tests for CSS Guard Transform
 *
 * @module test/transforms/cssGuard.test
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
    cssGuard,
    extractAmpCustomCSS,
    checkCssSize,
    getCssStats,
} from '../../src/transforms/cssGuard';

describe('cssGuard transform', () => {
    // Silence console.log during tests
    beforeEach(() => {
        vi.spyOn(console, 'log').mockImplementation(() => { });
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    describe('extractAmpCustomCSS()', () => {
        it('extracts CSS from style amp-custom tag', () => {
            const html = `
                <html>
                <head>
                    <style amp-custom>
                        body { color: red; }
                    </style>
                </head>
                </html>
            `;
            const css = extractAmpCustomCSS(html);
            expect(css).toContain('body');
            expect(css).toContain('color: red');
        });

        it('returns null if no amp-custom style found', () => {
            const html = '<html><head></head></html>';
            expect(extractAmpCustomCSS(html)).toBeNull();
        });

        it('handles style tag with additional attributes', () => {
            const html = '<style amp-custom type="text/css">body{}</style>';
            const css = extractAmpCustomCSS(html);
            expect(css).toBe('body{}');
        });

        it('extracts multiline CSS', () => {
            const html = `
                <style amp-custom>
                    .class1 { color: red; }
                    .class2 { color: blue; }
                    @media (min-width: 600px) {
                        .class3 { display: block; }
                    }
                </style>
            `;
            const css = extractAmpCustomCSS(html);
            expect(css).toContain('.class1');
            expect(css).toContain('.class2');
            expect(css).toContain('@media');
        });
    });

    describe('checkCssSize()', () => {
        it('returns valid for CSS under limit', () => {
            const css = 'body { color: red; }';
            const result = checkCssSize(css, 1024);
            expect(result.valid).toBe(true);
            expect(result.error).toBeUndefined();
        });

        it('returns invalid for CSS over limit', () => {
            const css = 'a'.repeat(1025);
            const result = checkCssSize(css, 1024);
            expect(result.valid).toBe(false);
            expect(result.error).toContain('exceeds');
        });

        it('calculates correct byte size', () => {
            const css = 'a'.repeat(100);
            const result = checkCssSize(css, 1024);
            expect(result.sizeBytes).toBe(100);
        });

        it('formats size in KB', () => {
            const css = 'a'.repeat(2048);
            const result = checkCssSize(css);
            expect(result.sizeKB).toBe('2.00KB');
        });

        it('handles UTF-8 characters correctly', () => {
            const css = '/* こんにちは */'; // Japanese characters
            const result = checkCssSize(css);
            // UTF-8 characters take more than 1 byte
            expect(result.sizeBytes).toBeGreaterThan(css.length);
        });

        it('uses default 75KB limit', () => {
            const css = 'a'.repeat(75 * 1024 + 1);
            const result = checkCssSize(css);
            expect(result.valid).toBe(false);
            expect(result.maxBytes).toBe(75 * 1024);
        });

        it('uses custom max bytes', () => {
            const css = 'a'.repeat(100);
            const result = checkCssSize(css, 50);
            expect(result.valid).toBe(false);
            expect(result.maxBytes).toBe(50);
        });
    });

    describe('cssGuard()', () => {
        it('passes through content without amp-custom style', () => {
            const html = '<html><head></head><body></body></html>';
            expect(cssGuard(html)).toBe(html);
        });

        it('passes through valid CSS under limit', () => {
            const html = `
                <html>
                <head>
                    <style amp-custom>body { color: red; }</style>
                </head>
                </html>
            `;
            expect(cssGuard(html)).toBe(html);
        });

        it('throws error for CSS over limit', () => {
            const largeCSS = 'a'.repeat(76 * 1024);
            const html = `<style amp-custom>${largeCSS}</style>`;

            expect(() => cssGuard(html)).toThrow('BUILD FAILED');
            expect(() => cssGuard(html)).toThrow('exceeds');
        });

        it('uses custom max size', () => {
            const css = 'a'.repeat(100);
            const html = `<style amp-custom>${css}</style>`;

            // Should pass with 1KB limit
            expect(cssGuard(html, 1024)).toBe(html);

            // Should fail with 50 byte limit
            expect(() => cssGuard(html, 50)).toThrow('BUILD FAILED');
        });

        it('handles empty content', () => {
            expect(cssGuard('')).toBe('');
        });

        it('logs CSS size', () => {
            const html = '<style amp-custom>body{}</style>';
            cssGuard(html);
            expect(console.log).toHaveBeenCalledWith(
                expect.stringContaining('[CSS Guard]')
            );
        });

        it('includes helpful tips in error message', () => {
            const largeCSS = 'a'.repeat(76 * 1024);
            const html = `<style amp-custom>${largeCSS}</style>`;

            try {
                cssGuard(html);
            } catch (error) {
                expect((error as Error).message).toContain('Remove unused styles');
                expect((error as Error).message).toContain('CSSO');
            }
        });
    });

    describe('getCssStats()', () => {
        it('returns complete stats object', () => {
            const html = '<style amp-custom>body { color: red; }</style>';
            const stats = getCssStats(html);

            expect(stats).toHaveProperty('valid');
            expect(stats).toHaveProperty('sizeBytes');
            expect(stats).toHaveProperty('sizeKB');
            expect(stats).toHaveProperty('maxBytes');
            expect(stats).toHaveProperty('percentage');
        });

        it('calculates correct percentage', () => {
            const css = 'a'.repeat(7500); // ~10% of 75KB
            const html = `<style amp-custom>${css}</style>`;
            const stats = getCssStats(html);

            const expectedPercentage = (7500 / (75 * 1024)) * 100;
            expect(parseFloat(stats.percentage)).toBeCloseTo(expectedPercentage, 0);
        });

        it('handles missing amp-custom style', () => {
            const html = '<html></html>';
            const stats = getCssStats(html);

            expect(stats.sizeBytes).toBe(0);
            expect(stats.valid).toBe(true);
            expect(stats.percentage).toBe('0.0%');
        });

        it('uses custom max bytes for percentage', () => {
            const css = 'a'.repeat(500);
            const html = `<style amp-custom>${css}</style>`;
            const stats = getCssStats(html, 1000);

            expect(parseFloat(stats.percentage)).toBeCloseTo(50.0, 0);
        });
    });
});
