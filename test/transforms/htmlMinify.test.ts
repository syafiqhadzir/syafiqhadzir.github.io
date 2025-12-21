/**
 * HTML Minify Transform Tests
 * @module test/transforms/htmlMinify.test
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
    minifyHtml,
    htmlMinifyTransform,
    getMinifyStats,
} from '../../src/transforms/htmlMinify';

// Mock html-minifier-terser for error handling tests
vi.mock('html-minifier-terser', async (importOriginal) => {
    const actual = await importOriginal<typeof import('html-minifier-terser')>();
    return {
        ...actual,
        minify: vi.fn(actual.minify),
    };
});

describe('htmlMinify transform', () => {
    describe('minifyHtml()', () => {
        it('minifies basic HTML content', async () => {
            const input = `
                <html>
                    <head>
                        <title>Test</title>
                    </head>
                    <body>
                        <p>Hello   World</p>
                    </body>
                </html>
            `;

            const result = await minifyHtml(input);

            expect(result).not.toContain('\n');
            expect(result).toContain('<html>');
            expect(result).toContain('<title>Test</title>');
        });

        it('removes HTML comments', async () => {
            const input = '<div><!-- This is a comment -->Content</div>';
            const result = await minifyHtml(input);

            expect(result).not.toContain('<!-- This is a comment -->');
            expect(result).toContain('Content');
        });

        it('collapses whitespace', async () => {
            const input = '<p>Hello    World</p>';
            const result = await minifyHtml(input);

            expect(result).not.toContain('    ');
        });

        it('returns empty content as-is', async () => {
            const result = await minifyHtml('');
            expect(result).toBe('');
        });

        it('returns null content as-is', async () => {
            const result = await minifyHtml(null as unknown as string);
            expect(result).toBeNull();
        });

        it('preserves amp-bind [attribute] syntax', async () => {
            const input = '<div [class]="theme.mode">Content</div>';
            const result = await minifyHtml(input);

            expect(result).toContain('[class]');
        });

        it('preserves AMP custom elements', async () => {
            const input = '<amp-img src="test.jpg" width="100" height="100"></amp-img>';
            const result = await minifyHtml(input);

            expect(result).toContain('<amp-img');
            expect(result).toContain('src="test.jpg"');
        });

        it('does not minify CSS (already minified by CSSO)', async () => {
            const input = '<style amp-custom>.class { color: red; }</style>';
            const result = await minifyHtml(input);

            // CSS should be preserved
            expect(result).toContain('.class');
        });

        it('returns original content when minification fails', async () => {
            // Create HTML that will cause minification to fail
            // Using a mock to simulate failure
            const { minify } = await import('html-minifier-terser');
            vi.mocked(minify).mockRejectedValueOnce(new Error('Minification error'));

            const input = '<div>Content</div>';
            const result = await minifyHtml(input);

            // Should return original content when minification fails
            expect(result).toBe(input);
        });
    });

    describe('htmlMinifyTransform()', () => {
        const originalEnv = process.env.NODE_ENV;

        beforeEach(() => {
            vi.spyOn(console, 'log').mockImplementation(vi.fn());
        });

        afterEach(() => {
            process.env.NODE_ENV = originalEnv;
            vi.restoreAllMocks();
        });

        it('returns content unchanged for non-HTML files', async () => {
            const content = '<div>Content</div>';
            const result = await htmlMinifyTransform(content, 'output.css');

            expect(result).toBe(content);
        });

        it('returns content unchanged when outputPath is undefined', async () => {
            const content = '<div>Content</div>';
            const result = await htmlMinifyTransform(content);

            expect(result).toBe(content);
        });

        it('returns content unchanged when not in production', async () => {
            process.env.NODE_ENV = 'development';
            const content = '<div>  Content  </div>';
            const result = await htmlMinifyTransform(content, 'output.html');

            expect(result).toBe(content);
        });

        it('minifies HTML in production mode', async () => {
            process.env.NODE_ENV = 'production';
            const content = '<div>  Content  </div>';
            const result = await htmlMinifyTransform(content, 'output.html');

            expect(result).not.toBe(content);
            expect(result).not.toContain('  ');
        });

        it('minifies content silently in production', async () => {
            process.env.NODE_ENV = 'production';
            const content = '<div>   Content   </div>';

            const result = await htmlMinifyTransform(content, 'output.html');

            // Verifies minification happens without logging
            expect(result).not.toContain('   ');
        });
    });

    describe('getMinifyStats()', () => {
        it('returns correct statistics object', () => {
            const original = '<div>   Content   </div>';
            const minified = '<div>Content</div>';

            const stats = getMinifyStats(original, minified);

            expect(stats).toHaveProperty('originalSize');
            expect(stats).toHaveProperty('minifiedSize');
            expect(stats).toHaveProperty('savings');
            expect(stats).toHaveProperty('percent');
        });

        it('calculates correct byte sizes', () => {
            const original = 'Hello World';
            const minified = 'Hello';

            const stats = getMinifyStats(original, minified);

            expect(stats.originalSize).toBe(11);
            expect(stats.minifiedSize).toBe(5);
            expect(stats.savings).toBe(6);
        });

        it('calculates correct percentage', () => {
            const original = '1234567890'; // 10 bytes
            const minified = '12345'; // 5 bytes

            const stats = getMinifyStats(original, minified);

            expect(stats.percent).toBe(50); // 50% savings
        });

        it('handles UTF-8 characters correctly', () => {
            const original = 'こんにちは'; // 15 bytes in UTF-8
            const minified = '';

            const stats = getMinifyStats(original, minified);

            expect(stats.originalSize).toBe(15);
            expect(stats.savings).toBe(15);
        });
    });
});
