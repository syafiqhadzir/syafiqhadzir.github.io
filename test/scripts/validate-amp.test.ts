/**
 * AMP HTML Validator Script Tests
 * @module test/scripts/validate-amp.test
 */
/* eslint-disable sonarjs/no-nested-functions -- Test mocks require nested function definitions */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
    shouldSkipDirectory,
    findHtmlFiles,
    formatValidationError,
    isAmpDocument,
    validateFile,
    directoryExists,
    validateFiles,
} from '../../scripts/validate-amp';
import * as fs from 'node:fs';
import path from 'node:path';

vi.mock('node:fs');

describe('validate-amp script', () => {
    describe('shouldSkipDirectory()', () => {
        it('returns true for node_modules', () => {
            expect(shouldSkipDirectory('node_modules')).toBe(true);
        });

        it('returns true for .git', () => {
            expect(shouldSkipDirectory('.git')).toBe(true);
        });

        it('returns true for .cache', () => {
            expect(shouldSkipDirectory('.cache')).toBe(true);
        });

        it('returns false for regular directories', () => {
            expect(shouldSkipDirectory('src')).toBe(false);
            expect(shouldSkipDirectory('pages')).toBe(false);
            expect(shouldSkipDirectory('_site')).toBe(false);
        });
    });

    describe('isAmpDocument()', () => {
        it('detects AMP document with ⚡ symbol', () => {
            const html = '<html ⚡><head></head><body></body></html>';
            expect(isAmpDocument(html)).toBe(true);
        });

        it('detects AMP document with amp attribute', () => {
            const html = '<html amp><head></head><body></body></html>';
            expect(isAmpDocument(html)).toBe(true);
        });

        it('detects AMP document with amp in attributes', () => {
            const html = '<html lang="en" amp><head></head><body></body></html>';
            expect(isAmpDocument(html)).toBe(true);
        });

        it('returns false for non-AMP document', () => {
            const html = '<html><head></head><body></body></html>';
            expect(isAmpDocument(html)).toBe(false);
        });

        it('returns false for empty string', () => {
            expect(isAmpDocument('')).toBe(false);
        });

        it('returns false when amp is in content but not html tag', () => {
            const html = '<html><head></head><body>This is my amp project</body></html>';
            expect(isAmpDocument(html)).toBe(false);
        });
    });

    describe('formatValidationError()', () => {
        it('formats ERROR severity correctly', () => {
            const error = {
                severity: 'ERROR' as const,
                line: 10,
                col: 5,
                message: 'Missing required attribute',
                code: 'MANDATORY_ATTR_MISSING',
            };

            const result = formatValidationError(error);

            expect(result).toContain('❌ ERROR');
            expect(result).toContain('10:5');
            expect(result).toContain('Missing required attribute');
        });

        it('formats WARNING severity correctly', () => {
            const error = {
                severity: 'WARNING' as const,
                line: 25,
                col: 1,
                message: 'Deprecated element',
                code: 'DEPRECATED_TAG',
            };

            const result = formatValidationError(error);

            expect(result).toContain('⚠️ WARNING');
            expect(result).toContain('25:1');
            expect(result).toContain('Deprecated element');
        });
    });

    describe('directoryExists()', () => {
        beforeEach(() => {
            vi.resetAllMocks();
        });

        it('returns true when directory exists', () => {
            vi.mocked(fs.statSync).mockReturnValue({} as fs.Stats);

            expect(directoryExists('_site')).toBe(true);
        });

        it('returns false when directory does not exist', () => {
            vi.mocked(fs.statSync).mockImplementation(() => {
                throw new Error('ENOENT');
            });

            expect(directoryExists('nonexistent')).toBe(false);
        });
    });

    describe('findHtmlFiles()', () => {
        beforeEach(() => {
            vi.resetAllMocks();
        });

        it('finds HTML files in a flat directory', () => {
            vi.mocked(fs.readdirSync).mockReturnValue([
                'index.html',
                'about.html',
                'style.css',
            ] as unknown as ReturnType<typeof fs.readdirSync>);

            vi.mocked(fs.statSync).mockImplementation((filePath: fs.PathLike) => {
                const pathStr = filePath.toString();
                if (pathStr.endsWith('.html') || pathStr.endsWith('.css')) {
                    return { isDirectory: () => false } as fs.Stats;
                }
                return { isDirectory: () => false } as fs.Stats;
            });

            const result = findHtmlFiles('test-dir');

            expect(result).toHaveLength(2);
            expect(result).toContain(path.join('test-dir', 'index.html'));
            expect(result).toContain(path.join('test-dir', 'about.html'));
        });

        it('skips ignored directories', () => {
            vi.mocked(fs.readdirSync).mockReturnValue([
                'index.html',
                'node_modules',
            ] as unknown as ReturnType<typeof fs.readdirSync>);

            vi.mocked(fs.statSync).mockImplementation((filePath: fs.PathLike) => {
                const pathStr = filePath.toString();
                if (pathStr.includes('node_modules')) {
                    return { isDirectory: () => true } as fs.Stats;
                }
                return { isDirectory: () => false } as fs.Stats;
            });

            const result = findHtmlFiles('test-dir');

            expect(result).toHaveLength(1);
            expect(result).toContain(path.join('test-dir', 'index.html'));
        });

        it('recursively searches subdirectories', () => {
            vi.mocked(fs.readdirSync).mockImplementation((dir: fs.PathLike) => {
                const dirStr = dir.toString();
                if (dirStr === 'test-dir') {
                    return ['subdir', 'index.html'] as unknown as ReturnType<typeof fs.readdirSync>;
                }
                if (dirStr.includes('subdir')) {
                    return ['page.html'] as unknown as ReturnType<typeof fs.readdirSync>;
                }
                return [] as unknown as ReturnType<typeof fs.readdirSync>;
            });

            vi.mocked(fs.statSync).mockImplementation((filePath: fs.PathLike) => {
                const pathStr = filePath.toString();
                if (pathStr.endsWith('subdir')) {
                    return { isDirectory: () => true } as fs.Stats;
                }
                return { isDirectory: () => false } as fs.Stats;
            });

            const result = findHtmlFiles('test-dir');

            expect(result).toHaveLength(2);
        });
    });

    describe('validateFile()', () => {
        const mockValidator = {
            validateString: vi.fn(),
        };

        beforeEach(() => {
            vi.resetAllMocks();
        });

        it('returns PASS for non-AMP files', () => {
            vi.mocked(fs.readFileSync).mockReturnValue('<html><head></head><body></body></html>');

            const result = validateFile(mockValidator, 'test.html');

            expect(result.result.status).toBe('PASS');
            expect(result.result.errors).toHaveLength(0);
            expect(mockValidator.validateString).not.toHaveBeenCalled();
        });

        it('validates AMP files using validator', () => {
            vi.mocked(fs.readFileSync).mockReturnValue(
                '<html ⚡><head></head><body></body></html>'
            );
            mockValidator.validateString.mockReturnValue({
                status: 'PASS',
                errors: [],
            });

            const result = validateFile(mockValidator, 'test.html');

            expect(mockValidator.validateString).toHaveBeenCalled();
            expect(result.result.status).toBe('PASS');
        });

        it('returns validation errors for invalid AMP', () => {
            vi.mocked(fs.readFileSync).mockReturnValue(
                '<html ⚡><head></head><body></body></html>'
            );
            mockValidator.validateString.mockReturnValue({
                status: 'FAIL',
                errors: [
                    {
                        severity: 'ERROR',
                        line: 1,
                        col: 1,
                        message: 'Missing required AMP boilerplate',
                        code: 'MISSING_BOILERPLATE',
                    },
                ],
            });

            const result = validateFile(mockValidator, 'test.html');

            expect(result.result.status).toBe('FAIL');
            expect(result.result.errors).toHaveLength(1);
        });
    });

    describe('validateFiles()', () => {
        const mockValidator = {
            validateString: vi.fn(),
        };

        let consoleSpy: ReturnType<typeof vi.spyOn>;
        let exitSpy: ReturnType<typeof vi.spyOn>;

        beforeEach(() => {
            vi.resetAllMocks();
            consoleSpy = vi.spyOn(console, 'log').mockImplementation(vi.fn());
            exitSpy = vi.spyOn(process, 'exit').mockImplementation(vi.fn() as never);
        });

        afterEach(() => {
            consoleSpy.mockRestore();
            exitSpy.mockRestore();
        });

        it('exits with 0 when all files pass', () => {
            vi.mocked(fs.readFileSync).mockReturnValue(
                '<html ⚡><head></head><body></body></html>'
            );
            mockValidator.validateString.mockReturnValue({
                status: 'PASS',
                errors: [],
            });

            validateFiles(mockValidator, ['test.html']);

            expect(exitSpy).toHaveBeenCalledWith(0);
            expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('All files passed'));
        });

        it('exits with 1 when files fail', () => {
            vi.mocked(fs.readFileSync).mockReturnValue(
                '<html ⚡><head></head><body></body></html>'
            );
            mockValidator.validateString.mockReturnValue({
                status: 'FAIL',
                errors: [
                    {
                        severity: 'ERROR',
                        line: 1,
                        col: 1,
                        message: 'Error',
                        code: 'ERR',
                    },
                ],
            });

            validateFiles(mockValidator, ['test.html']);

            expect(exitSpy).toHaveBeenCalledWith(1);
            expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('FAIL'));
        });

        it('prints validation summary', () => {
            vi.mocked(fs.readFileSync).mockReturnValue('<html><head></head><body></body></html>');

            validateFiles(mockValidator, ['test1.html', 'test2.html']);

            expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('VALIDATION SUMMARY'));
        });

        it('handles mixed pass/fail results', () => {
            vi.mocked(fs.readFileSync)
                .mockReturnValueOnce('<html><head></head><body></body></html>') // non-AMP, passes
                .mockReturnValueOnce('<html ⚡><head></head><body></body></html>'); // AMP

            mockValidator.validateString.mockReturnValue({
                status: 'FAIL',
                errors: [
                    {
                        severity: 'ERROR',
                        line: 1,
                        col: 1,
                        message: 'Error',
                        code: 'ERR',
                    },
                ],
            });

            validateFiles(mockValidator, ['pass.html', 'fail.html']);

            expect(exitSpy).toHaveBeenCalledWith(1);
        });

        it('filters only ERROR severity for failure report', () => {
            vi.mocked(fs.readFileSync).mockReturnValue(
                '<html ⚡><head></head><body></body></html>'
            );
            mockValidator.validateString.mockReturnValue({
                status: 'FAIL',
                errors: [
                    {
                        severity: 'ERROR',
                        line: 1,
                        col: 1,
                        message: 'Error message',
                        code: 'ERR',
                    },
                    {
                        severity: 'WARNING',
                        line: 2,
                        col: 1,
                        message: 'Warning message',
                        code: 'WARN',
                    },
                ],
            });

            validateFiles(mockValidator, ['test.html']);

            // Both should be logged
            expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('ERROR'));
            expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('WARNING'));
        });
    });
});
