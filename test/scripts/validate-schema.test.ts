/**
 * JSON-LD Schema Validation Script Tests
 * @module test/scripts/validate-schema.test
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
    extractJsonLd,
    validateSchema,
    validateDirectory,
    main,
} from '../../scripts/validate-schema';
import * as fs from 'node:fs/promises';

vi.mock('node:fs/promises');

describe('validate-schema script', () => {
    describe('extractJsonLd()', () => {
        it('extracts single JSON-LD script from HTML', () => {
            const html = `
                <html>
                <head>
                    <script type="application/ld+json">
                    {"@context": "https://schema.org", "@type": "Person"}
                    </script>
                </head>
                </html>
            `;

            const result = extractJsonLd(html);

            expect(result).toHaveLength(1);
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            expect(result[0]!).toContain('@context');
        });

        it('extracts multiple JSON-LD scripts from HTML', () => {
            const html = `
                <script type="application/ld+json">{"@type": "Person"}</script>
                <script type="application/ld+json">{"@type": "WebPage"}</script>
            `;

            const result = extractJsonLd(html);

            expect(result).toHaveLength(2);
        });

        it('returns empty array when no JSON-LD found', () => {
            const html = '<html><head></head></html>';

            const result = extractJsonLd(html);

            expect(result).toEqual([]);
        });

        it('handles single quotes in script tag', () => {
            const html = `<script type='application/ld+json'>{"@type": "Test"}</script>`;

            const result = extractJsonLd(html);

            expect(result).toHaveLength(1);
        });

        it('handles complex nested JSON-LD', () => {
            const html = `
                <script type="application/ld+json">
                {
                    "@context": "https://schema.org",
                    "@type": "Person",
                    "worksFor": {
                        "@type": "Organization",
                        "name": "Test Company"
                    }
                }
                </script>
            `;

            const result = extractJsonLd(html);

            expect(result).toHaveLength(1);
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            expect(result[0]!).toContain('worksFor');
        });
    });

    describe('validateSchema()', () => {
        it('validates valid Person schema', () => {
            const json = JSON.stringify({
                '@context': 'https://schema.org',
                '@type': 'Person',
                name: 'John Doe',
                url: 'https://example.com',
            });

            const result = validateSchema(json);

            expect(result.valid).toBe(true);
            expect(result.errors).toHaveLength(0);
        });

        it('returns error for missing @context', () => {
            const json = JSON.stringify({
                '@type': 'Person',
                name: 'John Doe',
            });

            const result = validateSchema(json);

            expect(result.valid).toBe(false);
            expect(result.errors).toContain('Missing @context in Person schema');
        });

        it('returns error for missing @type', () => {
            const json = JSON.stringify({
                '@context': 'https://schema.org',
                name: 'John Doe',
            });

            const result = validateSchema(json);

            expect(result.valid).toBe(false);
            expect(result.errors).toContain('Missing @type');
        });

        it('returns warning for wrong @context URL', () => {
            const json = JSON.stringify({
                '@context': 'http://schema.org',
                '@type': 'Person',
                name: 'John Doe',
            });

            const result = validateSchema(json);

            expect(result.valid).toBe(true);
            expect(result.warnings.length).toBeGreaterThan(0);
        });

        it('returns error for invalid JSON', () => {
            const json = '{ invalid json }';

            const result = validateSchema(json);

            expect(result.valid).toBe(false);
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            expect(result.errors[0]!).toContain('Invalid JSON');
        });

        it('validates Person schema - requires name', () => {
            const json = JSON.stringify({
                '@context': 'https://schema.org',
                '@type': 'Person',
            });

            const result = validateSchema(json);

            expect(result.valid).toBe(false);
            expect(result.errors).toContain('Person schema missing "name"');
        });

        it('warns when Person schema missing url', () => {
            const json = JSON.stringify({
                '@context': 'https://schema.org',
                '@type': 'Person',
                name: 'John Doe',
            });

            const result = validateSchema(json);

            expect(result.warnings).toContain('Person schema missing "url"');
        });

        it('validates ResearchProject schema', () => {
            const json = JSON.stringify({
                '@context': 'https://schema.org',
                '@type': 'ResearchProject',
                name: 'Test Project',
                description: 'A test research project',
            });

            const result = validateSchema(json);

            expect(result.valid).toBe(true);
        });

        it('returns error when ResearchProject missing name', () => {
            const json = JSON.stringify({
                '@context': 'https://schema.org',
                '@type': 'ResearchProject',
            });

            const result = validateSchema(json);

            expect(result.errors).toContain('ResearchProject schema missing "name"');
        });

        it('validates WebPage schema', () => {
            const json = JSON.stringify({
                '@context': 'https://schema.org',
                '@type': 'WebPage',
                name: 'Test Page',
            });

            const result = validateSchema(json);

            expect(result.valid).toBe(true);
        });

        it('warns when WebPage missing name', () => {
            const json = JSON.stringify({
                '@context': 'https://schema.org',
                '@type': 'WebPage',
            });

            const result = validateSchema(json);

            expect(result.warnings).toContain('WebPage schema missing "name"');
        });

        it('validates ContactPage schema', () => {
            const json = JSON.stringify({
                '@context': 'https://schema.org',
                '@type': 'ContactPage',
                name: 'Contact Us',
            });

            const result = validateSchema(json);

            expect(result.valid).toBe(true);
        });

        it('warns when ContactPage missing name', () => {
            const json = JSON.stringify({
                '@context': 'https://schema.org',
                '@type': 'ContactPage',
            });

            const result = validateSchema(json);

            expect(result.warnings).toContain('ContactPage schema missing "name"');
        });

        it('handles array of schemas', () => {
            const json = JSON.stringify([
                {
                    '@context': 'https://schema.org',
                    '@type': 'Person',
                    name: 'John Doe',
                    url: 'https://example.com',
                },
                {
                    '@context': 'https://schema.org',
                    '@type': 'WebPage',
                    name: 'Test Page',
                },
            ]);

            const result = validateSchema(json);

            expect(result.valid).toBe(true);
            expect(result.schema).toBeInstanceOf(Array);
        });

        it('filters out null values in array', () => {
            const json = JSON.stringify([
                null,
                {
                    '@context': 'https://schema.org',
                    '@type': 'Person',
                    name: 'John Doe',
                    url: 'https://example.com',
                },
            ]);

            const result = validateSchema(json);

            // Should still be valid because null is filtered
            expect(result.valid).toBe(true);
        });
    });

    describe('validateDirectory()', () => {
        beforeEach(() => {
            vi.spyOn(console, 'error').mockImplementation(vi.fn());
        });

        afterEach(() => {
            vi.restoreAllMocks();
        });

        it('returns empty array for non-existent directory', async () => {
            const result = await validateDirectory('/non/existent/path');

            expect(result).toEqual([]);
            expect(console.error).toHaveBeenCalled();
        });

        it('adds warning when HTML file has no JSON-LD schemas', async () => {
            // Mock fs to return HTML without JSON-LD
            vi.mocked(fs.readdir).mockResolvedValue(['empty.html'] as any);
            vi.mocked(fs.readFile).mockResolvedValue(
                '<html><head></head><body>No schemas here</body></html>'
            );

            const result = await validateDirectory('_site');

            expect(result).toHaveLength(1);
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            expect(result[0]!.warnings).toContain('No JSON-LD schemas found');
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            expect(result[0]!.schemas).toBe(0);
        });
    });

    describe('main()', () => {
        let exitSpy: ReturnType<typeof vi.spyOn>;
        let logSpy: ReturnType<typeof vi.spyOn>;
        const originalArgv = process.argv;
        beforeEach(() => {
            exitSpy = vi.spyOn(process, 'exit').mockImplementation(vi.fn() as any);
            logSpy = vi.spyOn(console, 'log').mockImplementation(vi.fn());
        });

        afterEach(() => {
            process.argv = originalArgv;
            vi.restoreAllMocks();
        });

        it('exits with 0 when validation passes', async () => {
            // Mock fs success
            vi.mocked(fs.readdir).mockResolvedValue(['index.html'] as any);
            vi.mocked(fs.readFile).mockResolvedValue(`
                <script type="application/ld+json">
                {
                    "@context": "https://schema.org",
                    "@type": "WebPage",
                    "name": "Test Page"
                }
                </script>
            `);

            // Mock process.argv
            process.argv = ['node', 'script', '_site'];

            await main();

            expect(exitSpy).toHaveBeenCalledWith(0);
            expect(logSpy).toHaveBeenCalledWith(expect.stringContaining('Validation PASSED'));
        });

        it('exits with 1 when validation fails', async () => {
            // Mock fs failure (invalid schema)
            vi.mocked(fs.readdir).mockResolvedValue(['index.html'] as any);
            vi.mocked(fs.readFile).mockResolvedValue(`
                <script type="application/ld+json">
                {
                    "@context": "https://schema.org",
                    "@type": "Person"
                }
                </script>
            `);

            await main();

            expect(exitSpy).toHaveBeenCalledWith(1);
            expect(logSpy).toHaveBeenCalledWith(expect.stringContaining('Validation FAILED'));
        });
    });
});
