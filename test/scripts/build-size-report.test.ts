/**
 * Build Size Report Script Tests
 * @module test/scripts/build-size-report.test
 */
/* eslint-disable sonarjs/no-nested-functions -- Test mocks require nested function definitions */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
    getHtmlFiles,
    getInlinedCssSize,
    formatBytes,
    generateSizeReport,
    printHeader,
    printFileBreakdown,
    findMaxCssFile,
    checkAmpCssLimit,
    getFileSizes,
    main,
} from '../../scripts/build-size-report';
import * as fs from 'node:fs';

vi.mock('node:fs');

describe('build-size-report script', () => {
    describe('formatBytes()', () => {
        it('formats bytes correctly', () => {
            expect(formatBytes(500)).toBe('500B');
            expect(formatBytes(0)).toBe('0B');
            expect(formatBytes(1023)).toBe('1023B');
        });

        it('formats kilobytes correctly', () => {
            expect(formatBytes(1024)).toBe('1.00KB');
            expect(formatBytes(2048)).toBe('2.00KB');
            expect(formatBytes(1536)).toBe('1.50KB');
        });

        it('formats megabytes correctly', () => {
            expect(formatBytes(1024 * 1024)).toBe('1.00MB');
            expect(formatBytes(2.5 * 1024 * 1024)).toBe('2.50MB');
        });

        it('handles edge case at 1KB boundary', () => {
            expect(formatBytes(1024 - 1)).toBe('1023B');
            expect(formatBytes(1024)).toBe('1.00KB');
        });

        it('handles edge case at 1MB boundary', () => {
            expect(formatBytes(1024 * 1024 - 1)).toContain('KB');
            expect(formatBytes(1024 * 1024)).toBe('1.00MB');
        });
    });

    describe('getHtmlFiles()', () => {
        beforeEach(() => {
            vi.resetAllMocks();
        });

        it('returns empty array for non-existent directory', () => {
            vi.mocked(fs.readdirSync).mockImplementation(() => {
                throw new Error('ENOENT');
            });

            const result = getHtmlFiles('nonexistent');

            expect(result).toEqual([]);
        });

        it('finds HTML files in directory', () => {
            vi.mocked(fs.readdirSync).mockReturnValue([
                { name: 'index.html', isDirectory: () => false },
                { name: 'about.html', isDirectory: () => false },
                { name: 'style.css', isDirectory: () => false },
            ] as unknown as ReturnType<typeof fs.readdirSync>);

            const result = getHtmlFiles('_site');

            expect(result).toHaveLength(2);
            expect(result.some((f) => f.includes('index.html'))).toBe(true);
            expect(result.some((f) => f.includes('about.html'))).toBe(true);
        });

        it('recursively finds HTML files in subdirectories', () => {
            vi.mocked(fs.readdirSync).mockImplementation((dir) => {
                const dirStr = dir.toString();
                if (dirStr === '_site') {
                    return [
                        { name: 'index.html', isDirectory: () => false },
                        { name: 'blog', isDirectory: () => true },
                    ] as unknown as ReturnType<typeof fs.readdirSync>;
                }
                if (dirStr.includes('blog')) {
                    return [
                        { name: 'post.html', isDirectory: () => false },
                    ] as unknown as ReturnType<typeof fs.readdirSync>;
                }
                return [] as unknown as ReturnType<typeof fs.readdirSync>;
            });

            const result = getHtmlFiles('_site');

            expect(result).toHaveLength(2);
        });
    });

    describe('getInlinedCssSize()', () => {
        beforeEach(() => {
            vi.resetAllMocks();
        });

        it('returns 0 for non-existent file', () => {
            vi.mocked(fs.readFileSync).mockImplementation(() => {
                throw new Error('ENOENT');
            });

            const result = getInlinedCssSize('nonexistent.html');

            expect(result).toBe(0);
        });

        it('returns 0 when no amp-custom style exists', () => {
            vi.mocked(fs.readFileSync).mockReturnValue(
                '<html><head><style>body{}</style></head></html>'
            );

            const result = getInlinedCssSize('test.html');

            expect(result).toBe(0);
        });

        it('returns correct size for amp-custom CSS', () => {
            const css = 'body { margin: 0; padding: 0; }';
            vi.mocked(fs.readFileSync).mockReturnValue(
                `<html><head><style amp-custom>${css}</style></head></html>`
            );

            const result = getInlinedCssSize('test.html');

            expect(result).toBe(Buffer.byteLength(css, 'utf8'));
        });

        it('handles multi-line CSS', () => {
            const css = `
                body {
                    margin: 0;
                    padding: 0;
                }
                .header {
                    background: #fff;
                }
            `;
            vi.mocked(fs.readFileSync).mockReturnValue(
                `<html><head><style amp-custom>${css}</style></head></html>`
            );

            const result = getInlinedCssSize('test.html');

            expect(result).toBe(Buffer.byteLength(css, 'utf8'));
        });
    });

    describe('generateSizeReport()', () => {
        beforeEach(() => {
            vi.resetAllMocks();
        });

        it('generates report with no files', () => {
            vi.mocked(fs.readdirSync).mockImplementation(() => {
                throw new Error('ENOENT');
            });

            const report = generateSizeReport('nonexistent');

            expect(report.files).toEqual([]);
            expect(report.htmlFiles).toBe(0);
            expect(report.totalSize).toBe(0);
            expect(report.cssInlined).toBe(0);
            expect(report.timestamp).toBeDefined();
        });

        it('generates report with files', () => {
            vi.mocked(fs.readdirSync).mockReturnValue([
                { name: 'index.html', isDirectory: () => false },
            ] as unknown as ReturnType<typeof fs.readdirSync>);

            vi.mocked(fs.statSync).mockReturnValue({
                size: 2048,
            } as fs.Stats);

            vi.mocked(fs.readFileSync).mockReturnValue(
                '<html><head><style amp-custom>body{}</style></head></html>'
            );

            const report = generateSizeReport('_site');

            expect(report.htmlFiles).toBe(1);
            expect(report.totalSize).toBe(2048);
            expect(report.totalSizeKB).toBe('2.00');
            expect(report.files).toHaveLength(1);
            expect(report.cssInlined).toBeGreaterThan(0);
        });

        it('calculates total size across all files', () => {
            vi.mocked(fs.readdirSync).mockReturnValue([
                { name: 'index.html', isDirectory: () => false },
                { name: 'about.html', isDirectory: () => false },
            ] as unknown as ReturnType<typeof fs.readdirSync>);

            vi.mocked(fs.statSync).mockReturnValue({
                size: 1024,
            } as fs.Stats);

            vi.mocked(fs.readFileSync).mockReturnValue('<html><head></head></html>');

            const report = generateSizeReport('_site');

            expect(report.htmlFiles).toBe(2);
            expect(report.totalSize).toBe(2048);
        });
    });

    describe('getFileSizes()', () => {
        beforeEach(() => {
            vi.resetAllMocks();
        });

        it('calculates file sizes correctly', () => {
            vi.mocked(fs.statSync).mockReturnValue({
                size: 1024,
            } as fs.Stats);

            const result = getFileSizes(['file1.html', 'file2.html']);

            expect(result).toHaveLength(2);
            expect(result[0].size).toBe(1024);
            expect(result[0].sizeKB).toBe('1.00');
        });

        it('normalizes file paths', () => {
            vi.mocked(fs.statSync).mockReturnValue({
                size: 512,
            } as fs.Stats);

            const result = getFileSizes([String.raw`path\to\file.html`]);

            expect(result[0].file).toBe('path/to/file.html');
        });
    });

    describe('printHeader()', () => {
        let consoleSpy: ReturnType<typeof vi.spyOn>;

        beforeEach(() => {
            consoleSpy = vi.spyOn(console, 'log').mockImplementation(vi.fn());
        });

        afterEach(() => {
            consoleSpy.mockRestore();
        });

        it('prints report header', () => {
            const report = {
                timestamp: new Date().toISOString(),
                files: [],
                totalSize: 1024,
                totalSizeKB: '1.00',
                htmlFiles: 1,
                cssInlined: 256,
            };

            printHeader('_site', report);

            expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('Build Size Report'));
            expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('_site'));
        });
    });

    describe('printFileBreakdown()', () => {
        let consoleSpy: ReturnType<typeof vi.spyOn>;

        beforeEach(() => {
            vi.resetAllMocks();
            consoleSpy = vi.spyOn(console, 'log').mockImplementation(vi.fn());
        });

        afterEach(() => {
            consoleSpy.mockRestore();
        });

        it('prints file breakdown', () => {
            vi.mocked(fs.readFileSync).mockReturnValue('<html></html>');

            const report = {
                timestamp: new Date().toISOString(),
                files: [{ file: '_site/index.html', size: 1024, sizeKB: '1.00' }],
                totalSize: 1024,
                totalSizeKB: '1.00',
                htmlFiles: 1,
                cssInlined: 0,
            };

            printFileBreakdown(report);

            expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('Per-File Breakdown'));
        });

        it('handles zero-size files', () => {
            vi.mocked(fs.readFileSync).mockReturnValue('<html></html>');

            const report = {
                timestamp: new Date().toISOString(),
                files: [{ file: '_site/empty.html', size: 0, sizeKB: '0.00' }],
                totalSize: 0,
                totalSizeKB: '0.00',
                htmlFiles: 1,
                cssInlined: 0,
            };

            printFileBreakdown(report);

            expect(consoleSpy).toHaveBeenCalled();
        });
    });

    describe('findMaxCssFile()', () => {
        beforeEach(() => {
            vi.resetAllMocks();
        });

        it('finds file with maximum CSS size', () => {
            vi.mocked(fs.readFileSync)
                .mockReturnValueOnce('<style amp-custom>small</style>')
                .mockReturnValueOnce('<style amp-custom>much larger content here</style>');

            const report = {
                timestamp: new Date().toISOString(),
                files: [
                    { file: 'small.html', size: 100, sizeKB: '0.10' },
                    { file: 'large.html', size: 200, sizeKB: '0.20' },
                ],
                totalSize: 300,
                totalSizeKB: '0.29',
                htmlFiles: 2,
                cssInlined: 0,
            };

            const result = findMaxCssFile(report);

            expect(result.file).toBe('large.html');
        });

        it('returns empty for no files', () => {
            const report = {
                timestamp: new Date().toISOString(),
                files: [],
                totalSize: 0,
                totalSizeKB: '0.00',
                htmlFiles: 0,
                cssInlined: 0,
            };

            const result = findMaxCssFile(report);

            expect(result.file).toBe('');
            expect(result.size).toBe(0);
        });
    });

    describe('checkAmpCssLimit()', () => {
        let consoleSpy: ReturnType<typeof vi.spyOn>;
        let exitSpy: ReturnType<typeof vi.spyOn>;

        beforeEach(() => {
            consoleSpy = vi.spyOn(console, 'log').mockImplementation(vi.fn());
            exitSpy = vi.spyOn(process, 'exit').mockImplementation(vi.fn() as never);
        });

        afterEach(() => {
            consoleSpy.mockRestore();
            exitSpy.mockRestore();
        });

        it('passes when CSS is under limit', () => {
            checkAmpCssLimit({ file: 'test.html', size: 1024 });

            expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('AMP CSS Limit'));
            expect(exitSpy).not.toHaveBeenCalled();
        });

        it('exits with 1 when CSS exceeds limit', () => {
            checkAmpCssLimit({ file: 'test.html', size: 80 * 1024 }); // 80KB > 75KB limit

            expect(consoleSpy).toHaveBeenCalledWith(
                expect.stringContaining('AMP CSS LIMIT EXCEEDED')
            );
            expect(exitSpy).toHaveBeenCalledWith(1);
        });
    });

    describe('main()', () => {
        let consoleSpy: ReturnType<typeof vi.spyOn>;
        let exitSpy: ReturnType<typeof vi.spyOn>;
        const originalArgv = process.argv;

        beforeEach(() => {
            vi.resetAllMocks();
            consoleSpy = vi.spyOn(console, 'log').mockImplementation(vi.fn());
            exitSpy = vi.spyOn(process, 'exit').mockImplementation(vi.fn() as never);
        });

        afterEach(() => {
            process.argv = originalArgv;
            consoleSpy.mockRestore();
            exitSpy.mockRestore();
        });

        it('runs successfully with mock files', () => {
            process.argv = ['node', 'script', '_site', '_site/report.json'];

            vi.mocked(fs.readdirSync).mockReturnValue([
                { name: 'index.html', isDirectory: () => false },
            ] as unknown as ReturnType<typeof fs.readdirSync>);

            vi.mocked(fs.statSync).mockReturnValue({
                size: 1024,
            } as fs.Stats);

            vi.mocked(fs.readFileSync).mockReturnValue(
                '<html><head><style amp-custom>body{}</style></head></html>'
            );

            vi.mocked(fs.writeFileSync).mockImplementation(vi.fn());

            main();

            expect(fs.writeFileSync).toHaveBeenCalled();
            expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('Report saved'));
        });
    });
});
