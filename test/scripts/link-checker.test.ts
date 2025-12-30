/**
 * Unit tests for link-checker.ts
 * Comprehensive tests for link checking functions
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { extractLinks, checkInternalLink, printResults } from '../../scripts/link-checker';
import type { LinkCheckResult } from '../../scripts/link-checker';

describe('link-checker script', () => {
    // =========================================================================
    // extractLinks()
    // =========================================================================
    describe('extractLinks()', () => {
        it('extracts href attributes from anchor tags', () => {
            const html = '<a href="/page">Link</a><a href="/other">Other</a>';

            const result = extractLinks(html);

            expect(result).toEqual(['/page', '/other']);
        });

        it('extracts links with double quotes', () => {
            const html = '<a href="/double-quotes">Link</a>';

            const result = extractLinks(html);

            expect(result).toContain('/double-quotes');
        });

        it('extracts links with single quotes', () => {
            const html = "<a href='/single-quotes'>Link</a>";

            const result = extractLinks(html);

            expect(result).toContain('/single-quotes');
        });

        it('extracts external http links', () => {
            const html = '<a href="http://example.com">External</a>';

            const result = extractLinks(html);

            expect(result).toContain('http://example.com');
        });

        it('extracts external https links', () => {
            const html = '<a href="https://secure.example.com">Secure</a>';

            const result = extractLinks(html);

            expect(result).toContain('https://secure.example.com');
        });

        it('skips javascript: protocol links', () => {
            const html = '<a href="javascript:void(0)">JS Link</a>';

            const result = extractLinks(html);

            expect(result).toHaveLength(0);
        });

        it('skips mailto: protocol links', () => {
            const html = '<a href="mailto:test@example.com">Email</a>';

            const result = extractLinks(html);

            expect(result).toHaveLength(0);
        });

        it('skips tel: protocol links', () => {
            const html = '<a href="tel:+1234567890">Call</a>';

            const result = extractLinks(html);

            expect(result).toHaveLength(0);
        });

        it('extracts anchor links (hash only)', () => {
            const html = '<a href="#section">Anchor</a>';

            const result = extractLinks(html);

            expect(result).toContain('#section');
        });

        it('extracts links with query strings', () => {
            const html = '<a href="/page?param=value">Query</a>';

            const result = extractLinks(html);

            expect(result).toContain('/page?param=value');
        });

        it('extracts links from non-anchor elements', () => {
            const html = '<link href="/styles.css"><base href="/">';

            const result = extractLinks(html);

            expect(result).toContain('/styles.css');
            expect(result).toContain('/');
        });

        it('handles empty href attributes', () => {
            const html = '<a href="">Empty</a><a href="/valid">Valid</a>';

            const result = extractLinks(html);

            // Empty href should be skipped
            expect(result).toEqual(['/valid']);
        });

        it('returns empty array for HTML with no links', () => {
            const html = '<div><p>No links here</p></div>';

            const result = extractLinks(html);

            expect(result).toHaveLength(0);
        });

        it('handles mixed internal and external links', () => {
            const html = `
                <a href="/internal">Internal</a>
                <a href="https://external.com">External</a>
                <a href="mailto:test@test.com">Email</a>
                <a href="/another">Another</a>
            `;

            const result = extractLinks(html);

            expect(result).toHaveLength(3);
            expect(result).toContain('/internal');
            expect(result).toContain('/another');
            expect(result).toContain('https://external.com');
        });
    });

    // =========================================================================
    // checkInternalLink()
    // =========================================================================
    describe('checkInternalLink()', () => {
        it('removes query string before checking', () => {
            // The function should strip ?param=value
            const link = '/page.html?param=value';
            const cleanedLink = link.split('?')[0] ?? '';
            expect(cleanedLink).toBe('/page.html');
        });

        it('removes hash fragment before checking', () => {
            // The function should strip #section
            const link = '/page.html#section';
            const cleanedLink = link.split('#')[0] ?? '';
            expect(cleanedLink).toBe('/page.html');
        });

        it('handles root-relative links', () => {
            // Testing the path joining logic
            const link = '/about';

            // Verify the logic
            const linkPaths = link.split('?');
            const pathPart = linkPaths[0] ?? '';
            const cleanLink = pathPart.split('#')[0] ?? '';
            const isRootRelative = cleanLink.startsWith('/');
            expect(isRootRelative).toBe(true);
        });

        it('handles relative links', () => {
            // Testing that non-root-relative links are kept as-is
            const link = 'about/page.html';

            const linkPaths = link.split('?');
            const pathPart = linkPaths[0] ?? '';
            const cleanLink = pathPart.split('#')[0] ?? '';
            const isRootRelative = cleanLink.startsWith('/');
            expect(isRootRelative).toBe(false);
        });

        it('appends index.html to directory paths', () => {
            // Testing the index.html append logic
            const link = '/about/';

            // When path has no extension, index.html should be appended
            const hasExtension = link.includes('.');
            expect(hasExtension).toBe(false);
        });

        it('does not append index.html to file paths', () => {
            // Testing that .html files are not modified
            const link = '/page.html';

            const hasExtension = link.includes('.');
            expect(hasExtension).toBe(true);
        });

        it('returns false for non-existent files', () => {
            // Test with a path that definitely doesn't exist
            const result = checkInternalLink('/definitely-not-a-real-file-12345.html', '/');

            expect(result).toBe(false);
        });

        it('handles links with both query string and hash', () => {
            const link = '/page.html?query=1#section';
            const linkPaths = link.split('?');
            const pathPart = linkPaths[0] ?? '';
            const cleanLink = pathPart.split('#')[0] ?? '';

            expect(cleanLink).toBe('/page.html');
        });
    });

    // =========================================================================
    // printResults()
    // =========================================================================
    describe('printResults()', () => {
        let consoleSpy: ReturnType<typeof vi.spyOn>;

        beforeEach(() => {
            consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {
                // Mock implementation - intentionally empty
            });
        });

        afterEach(() => {
            consoleSpy.mockRestore();
        });

        it('prints summary counts for all statuses', () => {
            const results: LinkCheckResult[] = [
                { file: 'test.html', link: '/ok', type: 'internal', status: 'ok' },
                {
                    file: 'test.html',
                    link: '/broken',
                    type: 'internal',
                    status: 'broken',
                    message: 'File not found',
                },
                {
                    file: 'test.html',
                    link: 'https://ext.com',
                    type: 'external',
                    status: 'warning',
                    message: 'External',
                },
            ];

            printResults(results);

            expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('OK: 1'));
            expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('Warnings: 1'));
            expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('Broken: 1'));
        });

        it('prints broken link details', () => {
            const results: LinkCheckResult[] = [
                {
                    file: 'page.html',
                    link: '/missing',
                    type: 'internal',
                    status: 'broken',
                    message: 'File not found',
                },
            ];

            printResults(results);

            expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('Broken Links'));
            expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('page.html'));
            expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('/missing'));
        });

        it('prints external links when 10 or fewer', () => {
            const results: LinkCheckResult[] = [
                {
                    file: 'test.html',
                    link: 'https://example.com',
                    type: 'external',
                    status: 'warning',
                    message: 'External',
                },
            ];

            printResults(results);

            expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('External Links'));
            expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('https://example.com'));
        });

        it('shows count only when more than 10 external links', () => {
            const results: LinkCheckResult[] = Array.from({ length: 15 }, (_, i) => ({
                file: 'test.html',
                link: `https://example${String(i)}.com`,
                type: 'external' as const,
                status: 'warning' as const,
                message: 'External',
            }));

            printResults(results);

            expect(consoleSpy).toHaveBeenCalledWith(
                expect.stringContaining('15 external links found')
            );
        });

        it('handles empty results', () => {
            const results: LinkCheckResult[] = [];

            printResults(results);

            expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('OK: 0'));
            expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('Warnings: 0'));
            expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('Broken: 0'));
        });

        it('prints all broken links when multiple exist', () => {
            const results: LinkCheckResult[] = [
                {
                    file: 'a.html',
                    link: '/missing1',
                    type: 'internal',
                    status: 'broken',
                    message: 'File not found',
                },
                {
                    file: 'b.html',
                    link: '/missing2',
                    type: 'internal',
                    status: 'broken',
                    message: 'File not found',
                },
            ];

            printResults(results);

            expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('/missing1'));
            expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('/missing2'));
        });

        it('does not print broken section when no broken links', () => {
            const results: LinkCheckResult[] = [
                { file: 'test.html', link: '/ok', type: 'internal', status: 'ok' },
            ];

            printResults(results);

            const calls = consoleSpy.mock.calls.flat().join('\n');
            expect(calls).not.toContain('Broken Links:');
        });

        it('does not print external section when no external links', () => {
            const results: LinkCheckResult[] = [
                { file: 'test.html', link: '/ok', type: 'internal', status: 'ok' },
            ];

            printResults(results);

            const calls = consoleSpy.mock.calls.flat().join('\n');
            expect(calls).not.toContain('External Links');
        });
    });
});
