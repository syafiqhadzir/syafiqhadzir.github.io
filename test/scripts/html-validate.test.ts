/**
 * Unit tests for html-validate.ts
 * Comprehensive tests for HTML validation functions
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
    checkBasicRequirements,
    checkImageAccessibility,
    checkHeadings,
    checkDeprecatedPatterns,
    validateHtml,
    printErrors,
    printWarnings,
    printResults,
} from '../../scripts/html-validate';

describe('html-validate script', () => {
    // =========================================================================
    // checkBasicRequirements()
    // =========================================================================
    describe('checkBasicRequirements()', () => {
        it('returns no errors for valid HTML with all requirements', () => {
            const validHtml = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width">
    <title>Test Page</title>
</head>
<body></body>
</html>`;

            const result = checkBasicRequirements(validHtml);

            expect(result.errors).toHaveLength(0);
            expect(result.warnings).toHaveLength(0);
        });

        it('returns error when DOCTYPE is missing', () => {
            const html = '<html lang="en"><head><title>Test</title></head></html>';

            const result = checkBasicRequirements(html);

            expect(result.errors).toContainEqual({
                message: 'Missing DOCTYPE declaration',
                line: 1,
            });
        });

        it('returns warning when html lang attribute is missing', () => {
            const html = '<!doctype html><html><head><title>Test</title></head></html>';

            const result = checkBasicRequirements(html);

            expect(result.warnings).toContainEqual({
                message: '<html> missing lang attribute',
            });
        });

        it('returns warning when charset meta tag is missing', () => {
            const html = '<!doctype html><html lang="en"><head><title>Test</title></head></html>';

            const result = checkBasicRequirements(html);

            expect(result.warnings).toContainEqual({
                message: 'Missing charset meta tag',
            });
        });

        it('returns warning when viewport meta tag is missing', () => {
            const html =
                '<!doctype html><html lang="en"><head><meta charset="utf-8"><title>Test</title></head></html>';

            const result = checkBasicRequirements(html);

            expect(result.warnings).toContainEqual({
                message: 'Missing viewport meta tag',
            });
        });

        it('returns error when title element is missing', () => {
            const html = '<!doctype html><html lang="en"><head></head></html>';

            const result = checkBasicRequirements(html);

            expect(result.errors).toContainEqual({
                message: 'Missing <title> element',
            });
        });

        it('handles case-insensitive DOCTYPE', () => {
            const html = '<!DOCTYPE HTML><html lang="en"><head><title>Test</title></head></html>';

            const result = checkBasicRequirements(html);

            expect(result.errors.find((e) => e.message.includes('DOCTYPE'))).toBeUndefined();
        });
    });

    // =========================================================================
    // checkImageAccessibility()
    // =========================================================================
    describe('checkImageAccessibility()', () => {
        it('returns no errors when all images have alt attributes', () => {
            const html = '<img src="test.jpg" alt="Test image"><img src="logo.png" alt="">';

            const result = checkImageAccessibility(html);

            expect(result).toHaveLength(0);
        });

        it('returns error for image missing alt attribute', () => {
            const html = '<img src="test.jpg">';

            const result = checkImageAccessibility(html);

            expect(result).toHaveLength(1);
            expect(result[0].message).toBe('<img> missing alt attribute');
        });

        it('includes line number in error', () => {
            const html = '<div>\n<p>\n<img src="test.jpg">\n</p>\n</div>';

            const result = checkImageAccessibility(html);

            expect(result[0].line).toBe(3);
        });

        it('finds multiple images missing alt', () => {
            const html = '<img src="a.jpg"><img src="b.jpg"><img src="c.jpg">';

            const result = checkImageAccessibility(html);

            expect(result).toHaveLength(3);
        });

        it('handles self-closing img tags', () => {
            const html = '<img src="test.jpg" />';

            const result = checkImageAccessibility(html);

            expect(result).toHaveLength(1);
        });

        it('handles images with other attributes but no alt', () => {
            const html = '<img src="test.jpg" class="hero" width="100" height="100">';

            const result = checkImageAccessibility(html);

            expect(result).toHaveLength(1);
        });
    });

    // =========================================================================
    // checkHeadings()
    // =========================================================================
    describe('checkHeadings()', () => {
        it('returns no warnings for exactly one h1', () => {
            const html = '<h1>Main Title</h1><h2>Subtitle</h2>';

            const result = checkHeadings(html);

            expect(result).toHaveLength(0);
        });

        it('returns warning when no h1 element found', () => {
            const html = '<h2>Subtitle</h2><h3>Section</h3>';

            const result = checkHeadings(html);

            expect(result).toContainEqual({
                message: 'No <h1> element found',
            });
        });

        it('returns warning for multiple h1 elements', () => {
            const html = '<h1>First</h1><h1>Second</h1><h1>Third</h1>';

            const result = checkHeadings(html);

            expect(result).toContainEqual({
                message: 'Multiple <h1> elements found (3)',
            });
        });

        it('handles h1 with attributes', () => {
            const html = '<h1 class="title" id="main">Title</h1>';

            const result = checkHeadings(html);

            expect(result).toHaveLength(0);
        });
    });

    // =========================================================================
    // checkDeprecatedPatterns()
    // =========================================================================
    describe('checkDeprecatedPatterns()', () => {
        it('returns no issues for clean HTML', () => {
            const html = '<div><p>Good content</p><a href="/page">Link</a></div>';

            const result = checkDeprecatedPatterns(html);

            expect(result.errors).toHaveLength(0);
            expect(result.warnings).toHaveLength(0);
        });

        it('returns warning for empty link element', () => {
            const html = '<a href="/page"></a>';

            const result = checkDeprecatedPatterns(html);

            expect(result.warnings).toContainEqual({
                message: 'Empty <a> element found',
            });
        });

        it('returns warning for empty link with whitespace', () => {
            const html = '<a href="/page">   </a>';

            const result = checkDeprecatedPatterns(html);

            expect(result.warnings).toContainEqual({
                message: 'Empty <a> element found',
            });
        });

        it('returns error for deprecated center element', () => {
            const html = '<center>Centered text</center>';

            const result = checkDeprecatedPatterns(html);

            expect(result.errors).toContainEqual({
                message: 'Deprecated <center> element found',
            });
        });

        it('returns error for deprecated font element', () => {
            const html = '<font color="red">Red text</font>';

            const result = checkDeprecatedPatterns(html);

            expect(result.errors).toContainEqual({
                message: 'Deprecated <font> element found',
            });
        });

        it('returns error for deprecated strike element', () => {
            const html = '<strike>Strikethrough</strike>';

            const result = checkDeprecatedPatterns(html);

            expect(result.errors).toContainEqual({
                message: 'Deprecated <strike> element found',
            });
        });

        it('returns error for deprecated marquee element', () => {
            const html = '<marquee>Scrolling text</marquee>';

            const result = checkDeprecatedPatterns(html);

            expect(result.errors).toContainEqual({
                message: 'Deprecated <marquee> element found',
            });
        });

        it('returns error for deprecated blink element', () => {
            const html = '<blink>Blinking text</blink>';

            const result = checkDeprecatedPatterns(html);

            expect(result.errors).toContainEqual({
                message: 'Deprecated <blink> element found',
            });
        });

        it('returns warning for excessive inline styles', () => {
            const html = `
                <div style="color: red">1</div>
                <div style="color: blue">2</div>
                <div style="color: green">3</div>
                <div style="color: yellow">4</div>
                <div style="color: purple">5</div>
                <div style="color: orange">6</div>
            `;

            const result = checkDeprecatedPatterns(html);

            expect(result.warnings.find((w) => w.message.includes('inline styles'))).toBeDefined();
        });

        it('does not warn for few inline styles', () => {
            const html = '<div style="color: red">1</div><div style="color: blue">2</div>';

            const result = checkDeprecatedPatterns(html);

            expect(
                result.warnings.find((w) => w.message.includes('inline styles'))
            ).toBeUndefined();
        });
    });

    // =========================================================================
    // validateHtml()
    // =========================================================================
    describe('validateHtml()', () => {
        it('combines all validation checks', () => {
            const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width">
    <title>Test</title>
</head>
<body>
    <h1>Title</h1>
    <img src="test.jpg" alt="Test">
</body>
</html>`;

            const result = validateHtml(html, '/path/to/file.html');

            expect(result.file).toBe('/path/to/file.html');
            expect(result.errors).toHaveLength(0);
            expect(result.warnings).toHaveLength(0);
        });

        it('returns errors from all check functions', () => {
            const html =
                '<html><head></head><body><img src="no-alt.jpg"><font>Bad</font></body></html>';

            const result = validateHtml(html, 'test.html');

            // Should have errors for: missing DOCTYPE, missing title, missing alt, deprecated font
            expect(result.errors.length).toBeGreaterThanOrEqual(3);
        });

        it('returns warnings from all check functions', () => {
            const html = `<!DOCTYPE html>
<html><head><title>Test</title></head>
<body><h2>No H1</h2></body></html>`;

            const result = validateHtml(html, 'test.html');

            // Should have warnings for: missing lang, missing charset, missing viewport, no h1
            expect(result.warnings.length).toBeGreaterThanOrEqual(3);
        });
    });

    // =========================================================================
    // printErrors()
    // =========================================================================
    describe('printErrors()', () => {
        let consoleSpy: ReturnType<typeof vi.spyOn>;

        beforeEach(() => {
            consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {
                // Mock implementation - intentionally empty
            });
        });

        afterEach(() => {
            consoleSpy.mockRestore();
        });

        it('returns count of errors printed', () => {
            const errors = [{ message: 'Error 1' }, { message: 'Error 2' }, { message: 'Error 3' }];

            const count = printErrors(errors);

            expect(count).toBe(3);
        });

        it('prints error message with line number when available', () => {
            const errors = [{ message: 'Test error', line: 42 }];

            printErrors(errors);

            expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('Test error'));
            expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining(':42'));
        });

        it('prints error message without line number when not available', () => {
            const errors = [{ message: 'Test error' }];

            printErrors(errors);

            expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('Test error'));
            expect(consoleSpy).toHaveBeenCalledWith(expect.not.stringContaining(':undefined'));
        });

        it('returns 0 for empty array', () => {
            const count = printErrors([]);

            expect(count).toBe(0);
        });
    });

    // =========================================================================
    // printWarnings()
    // =========================================================================
    describe('printWarnings()', () => {
        let consoleSpy: ReturnType<typeof vi.spyOn>;

        beforeEach(() => {
            consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {
                // Mock implementation - intentionally empty
            });
        });

        afterEach(() => {
            consoleSpy.mockRestore();
        });

        it('returns count of warnings printed', () => {
            const warnings = [{ message: 'Warning 1' }, { message: 'Warning 2' }];

            const count = printWarnings(warnings);

            expect(count).toBe(2);
        });

        it('prints warning with line number when available', () => {
            const warnings = [{ message: 'Test warning', line: 10 }];

            printWarnings(warnings);

            expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('Test warning'));
            expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining(':10'));
        });

        it('returns 0 for empty array', () => {
            const count = printWarnings([]);

            expect(count).toBe(0);
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

        it('prints summary for clean results', () => {
            const results = [
                { file: '/test/file.html', errors: [], warnings: [] },
                { file: '/test/other.html', errors: [], warnings: [] },
            ];

            printResults(results, '/test');

            expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('Files checked: 2'));
            expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('Errors: 0'));
            expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('passed validation'));
        });

        it('prints file details for results with issues', () => {
            const results = [
                {
                    file: '/test/bad.html',
                    errors: [{ message: 'Error' }],
                    warnings: [{ message: 'Warning' }],
                },
            ];

            printResults(results, '/test');

            expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('bad.html'));
        });

        it('skips files with no issues', () => {
            const results = [
                { file: '/test/good.html', errors: [], warnings: [] },
                { file: '/test/bad.html', errors: [{ message: 'Error' }], warnings: [] },
            ];

            printResults(results, '/test');

            // good.html should not appear in detailed output (only in summary count)
            const calls = consoleSpy.mock.calls.flat().join('\n');
            expect(calls).not.toContain('good.html');
            expect(calls).toContain('bad.html');
        });
    });
});
