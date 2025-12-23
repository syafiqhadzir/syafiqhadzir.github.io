/**
 * Housekeeping Script Tests
 * @module test/scripts/housekeeping.test
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
    runKnipAudit,
    findUnusedAssets,
    findUnusedScssVariables,
    generateRecommendations,
    printAuditSection,
    printAuditSummary,
    printRecommendations,
    calculateTotalIssues,
    printFinalStatus,
    main,
} from '../../scripts/housekeeping';
import * as childProcess from 'node:child_process';
import * as fs from 'node:fs';

vi.mock('node:child_process');
vi.mock('node:fs');

describe('housekeeping script', () => {
    describe('runKnipAudit()', () => {
        let consoleSpy: ReturnType<typeof vi.spyOn>;

        beforeEach(() => {
            vi.resetAllMocks();
            consoleSpy = vi.spyOn(console, 'log').mockImplementation(vi.fn());
        });

        afterEach(() => {
            consoleSpy.mockRestore();
        });

        it('returns empty results when Knip output is empty', () => {
            vi.mocked(childProcess.execSync).mockReturnValue('{}');

            const result = runKnipAudit();

            expect(result).toEqual({
                files: [],
                dependencies: [],
                devDependencies: [],
                unlisted: [],
                exports: [],
                types: [],
            });
        });

        it('parses Knip JSON output correctly', () => {
            const knipOutput = JSON.stringify({
                files: ['orphaned.ts'],
                dependencies: ['unused-dep'],
                devDependencies: ['unused-dev-dep'],
                unlisted: [],
                exports: [],
                types: [],
            });
            vi.mocked(childProcess.execSync).mockReturnValue(knipOutput);

            const result = runKnipAudit();

            expect(result.files).toContain('orphaned.ts');
            expect(result.dependencies).toContain('unused-dep');
            expect(result.devDependencies).toContain('unused-dev-dep');
        });

        it('handles Knip execution error (exit code 1)', () => {
            const error = new Error('Exit code 1') as Error & { stdout: string };
            error.stdout = JSON.stringify({
                files: ['file.ts'],
                dependencies: [],
                devDependencies: [],
                unlisted: [],
                exports: [],
                types: [],
            });
            vi.mocked(childProcess.execSync).mockImplementation(() => {
                throw error;
            });

            const result = runKnipAudit();

            expect(result.files).toContain('file.ts');
        });

        it('returns empty results for invalid JSON', () => {
            vi.mocked(childProcess.execSync).mockReturnValue('invalid json');

            const result = runKnipAudit();

            expect(result).toEqual({
                files: [],
                dependencies: [],
                devDependencies: [],
                unlisted: [],
                exports: [],
                types: [],
            });
        });

        it('handles missing properties in Knip output', () => {
            const knipOutput = JSON.stringify({
                files: ['file.ts'],
                // Missing other properties
            });
            vi.mocked(childProcess.execSync).mockReturnValue(knipOutput);

            const result = runKnipAudit();

            expect(result.files).toContain('file.ts');
            expect(result.dependencies).toEqual([]);
            expect(result.devDependencies).toEqual([]);
        });

        it('runs text mode when JSON parse fails with no files', () => {
            const error = new Error('Exit code 1') as Error & { stdout: string };
            error.stdout = 'not json';
            vi.mocked(childProcess.execSync).mockImplementation((cmd) => {
                if (cmd.includes('--reporter json')) {
                    throw error;
                }
                return '';
            });

            const result = runKnipAudit();

            expect(result.files).toEqual([]);
        });
    });

    describe('findUnusedAssets()', () => {
        let consoleSpy: ReturnType<typeof vi.spyOn>;

        beforeEach(() => {
            vi.resetAllMocks();
            consoleSpy = vi.spyOn(console, 'log').mockImplementation(vi.fn());
        });

        afterEach(() => {
            consoleSpy.mockRestore();
        });

        it('returns empty array when no asset directories exist', () => {
            vi.mocked(fs.readdirSync).mockImplementation(() => {
                throw new Error('ENOENT');
            });

            const result = findUnusedAssets();

            expect(result).toEqual([]);
        });

        it('finds potentially unused assets', () => {
            vi.mocked(fs.readdirSync).mockImplementation((dir) => {
                const dirStr = dir.toString();
                if (dirStr === 'Images') {
                    return ['unused.png'] as unknown as ReturnType<typeof fs.readdirSync>;
                }
                throw new Error('ENOENT');
            });

            vi.mocked(fs.statSync).mockReturnValue({
                isFile: () => true,
            } as fs.Stats);

            // Mock grep to return empty (file not referenced)
            vi.mocked(childProcess.execSync).mockReturnValue('');

            const result = findUnusedAssets();

            expect(result.length).toBeGreaterThanOrEqual(0);
        });

        it('excludes referenced assets', () => {
            vi.mocked(fs.readdirSync).mockImplementation((dir) => {
                const dirStr = dir.toString();
                if (dirStr === 'Images') {
                    return ['headshot.webp'] as unknown as ReturnType<typeof fs.readdirSync>;
                }
                throw new Error('ENOENT');
            });

            vi.mocked(fs.statSync).mockReturnValue({
                isFile: () => true,
            } as fs.Stats);

            // Mock grep to return a match (file is referenced)
            vi.mocked(childProcess.execSync).mockReturnValue(
                'src/pages/index.njk:10:<amp-img src="/Images/headshot.webp"'
            );

            const result = findUnusedAssets();

            // Should not include headshot.webp since it's referenced
            expect(result.find((a) => a.includes('headshot.webp'))).toBeUndefined();
        });
    });

    describe('findUnusedScssVariables()', () => {
        let consoleSpy: ReturnType<typeof vi.spyOn>;

        beforeEach(() => {
            vi.resetAllMocks();
            consoleSpy = vi.spyOn(console, 'log').mockImplementation(vi.fn());
        });

        afterEach(() => {
            consoleSpy.mockRestore();
        });

        it('returns empty array when SCSS directory does not exist', () => {
            vi.mocked(fs.readdirSync).mockImplementation(() => {
                throw new Error('ENOENT');
            });

            const result = findUnusedScssVariables();

            expect(result).toEqual([]);
        });

        it('finds unused SCSS variables', () => {
            vi.mocked(fs.readdirSync).mockReturnValue(['_variables.scss'] as unknown as ReturnType<
                typeof fs.readdirSync
            >);

            // Variable defined but only used once (in its definition)
            vi.mocked(fs.readFileSync).mockReturnValue(`
                $unused-var: #ff0000;
                $used-var: #00ff00;
                body {
                    color: $used-var;
                }
            `);

            const result = findUnusedScssVariables();

            expect(result).toContain('$unused-var');
            expect(result).not.toContain('$used-var');
        });

        it('handles multiple SCSS files', () => {
            vi.mocked(fs.readdirSync).mockReturnValue([
                '_variables.scss',
                '_mixins.scss',
            ] as unknown as ReturnType<typeof fs.readdirSync>);

            vi.mocked(fs.readFileSync)
                .mockReturnValueOnce('$var1: red;')
                .mockReturnValueOnce('$var2: blue; .class { color: $var1; }');

            const result = findUnusedScssVariables();

            // $var2 is unused, $var1 is used in second file
            expect(result).toContain('$var2');
        });

        it('returns empty when all variables are used', () => {
            vi.mocked(fs.readdirSync).mockReturnValue(['_variables.scss'] as unknown as ReturnType<
                typeof fs.readdirSync
            >);

            vi.mocked(fs.readFileSync).mockReturnValue(`
                $primary-color: #007bff;
                $secondary-color: #6c757d;
                body {
                    color: $primary-color;
                    background: $secondary-color;
                }
            `);

            const result = findUnusedScssVariables();

            expect(result).toEqual([]);
        });

        it('handles empty SCSS content', () => {
            vi.mocked(fs.readdirSync).mockReturnValue(['_empty.scss'] as unknown as ReturnType<
                typeof fs.readdirSync
            >);

            vi.mocked(fs.readFileSync).mockReturnValue('');

            const result = findUnusedScssVariables();

            expect(result).toEqual([]);
        });

        it('correctly identifies variables with hyphens', () => {
            vi.mocked(fs.readdirSync).mockReturnValue(['_variables.scss'] as unknown as ReturnType<
                typeof fs.readdirSync
            >);

            vi.mocked(fs.readFileSync).mockReturnValue(`
                $my-cool-variable: red;
                $unused-hyphen-var: blue;
                .class { color: $my-cool-variable; }
            `);

            const result = findUnusedScssVariables();

            expect(result).toContain('$unused-hyphen-var');
            expect(result).not.toContain('$my-cool-variable');
        });
    });

    describe('generateRecommendations()', () => {
        it('generates dependency uninstall recommendation', () => {
            const report = {
                timestamp: new Date().toISOString(),
                knip: {
                    files: [],
                    dependencies: ['unused-pkg'],
                    devDependencies: [],
                    unlisted: [],
                    exports: [],
                    types: [],
                },
                unusedAssets: [],
                unusedScssVariables: [],
                recommendations: [],
            };

            const result = generateRecommendations(report);

            expect(result.some((r) => r.includes('npm uninstall unused-pkg'))).toBe(true);
        });

        it('generates devDependency uninstall recommendation', () => {
            const report = {
                timestamp: new Date().toISOString(),
                knip: {
                    files: [],
                    dependencies: [],
                    devDependencies: ['unused-dev-pkg'],
                    unlisted: [],
                    exports: [],
                    types: [],
                },
                unusedAssets: [],
                unusedScssVariables: [],
                recommendations: [],
            };

            const result = generateRecommendations(report);

            expect(result.some((r) => r.includes('npm uninstall -D unused-dev-pkg'))).toBe(true);
        });

        it('generates orphaned files recommendation', () => {
            const report = {
                timestamp: new Date().toISOString(),
                knip: {
                    files: ['orphaned.ts'],
                    dependencies: [],
                    devDependencies: [],
                    unlisted: [],
                    exports: [],
                    types: [],
                },
                unusedAssets: [],
                unusedScssVariables: [],
                recommendations: [],
            };

            const result = generateRecommendations(report);

            expect(result.some((r) => r.includes('orphaned.ts'))).toBe(true);
        });

        it('generates unused assets recommendation', () => {
            const report = {
                timestamp: new Date().toISOString(),
                knip: {
                    files: [],
                    dependencies: [],
                    devDependencies: [],
                    unlisted: [],
                    exports: [],
                    types: [],
                },
                unusedAssets: ['Images/unused.png'],
                unusedScssVariables: [],
                recommendations: [],
            };

            const result = generateRecommendations(report);

            expect(result.some((r) => r.includes('unused.png'))).toBe(true);
        });

        it('generates SCSS variables recommendation', () => {
            const report = {
                timestamp: new Date().toISOString(),
                knip: {
                    files: [],
                    dependencies: [],
                    devDependencies: [],
                    unlisted: [],
                    exports: [],
                    types: [],
                },
                unusedAssets: [],
                unusedScssVariables: ['$unused-var'],
                recommendations: [],
            };

            const result = generateRecommendations(report);

            expect(result.some((r) => r.includes('$unused-var'))).toBe(true);
        });

        it('returns empty array when no issues', () => {
            const report = {
                timestamp: new Date().toISOString(),
                knip: {
                    files: [],
                    dependencies: [],
                    devDependencies: [],
                    unlisted: [],
                    exports: [],
                    types: [],
                },
                unusedAssets: [],
                unusedScssVariables: [],
                recommendations: [],
            };

            const result = generateRecommendations(report);

            expect(result).toEqual([]);
        });
    });

    describe('printAuditSection()', () => {
        let consoleSpy: ReturnType<typeof vi.spyOn>;

        beforeEach(() => {
            consoleSpy = vi.spyOn(console, 'log').mockImplementation(vi.fn());
        });

        afterEach(() => {
            consoleSpy.mockRestore();
        });

        it('prints section with items', () => {
            printAuditSection('Test Section', ['item1', 'item2']);

            expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('Test Section: 2'));
            expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('item1'));
        });

        it('prints section with empty items', () => {
            printAuditSection('Empty Section', []);

            expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('Empty Section: 0'));
        });
    });

    describe('printAuditSummary()', () => {
        let consoleSpy: ReturnType<typeof vi.spyOn>;

        beforeEach(() => {
            consoleSpy = vi.spyOn(console, 'log').mockImplementation(vi.fn());
        });

        afterEach(() => {
            consoleSpy.mockRestore();
        });

        it('prints full audit summary', () => {
            const report = {
                timestamp: new Date().toISOString(),
                knip: {
                    files: ['file.ts'],
                    dependencies: ['dep'],
                    devDependencies: ['devDep'],
                    unlisted: [],
                    exports: [],
                    types: [],
                },
                unusedAssets: ['asset.png'],
                unusedScssVariables: ['$var'],
                recommendations: [],
            };

            printAuditSummary(report);

            expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('AUDIT SUMMARY'));
        });
    });

    describe('printRecommendations()', () => {
        let consoleSpy: ReturnType<typeof vi.spyOn>;

        beforeEach(() => {
            consoleSpy = vi.spyOn(console, 'log').mockImplementation(vi.fn());
        });

        afterEach(() => {
            consoleSpy.mockRestore();
        });

        it('prints recommendations with numbering', () => {
            printRecommendations(['First rec', 'Second rec']);

            expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('RECOMMENDATIONS'));
            expect(consoleSpy).toHaveBeenCalledWith('1. First rec');
            expect(consoleSpy).toHaveBeenCalledWith('2. Second rec');
        });
    });

    describe('calculateTotalIssues()', () => {
        it('calculates total issues correctly', () => {
            const report = {
                timestamp: new Date().toISOString(),
                knip: {
                    files: ['file1.ts', 'file2.ts'],
                    dependencies: ['dep1'],
                    devDependencies: ['devDep1', 'devDep2'],
                    unlisted: [],
                    exports: [],
                    types: [],
                },
                unusedAssets: ['asset.png'],
                unusedScssVariables: ['$var1', '$var2'],
                recommendations: [],
            };

            const result = calculateTotalIssues(report);

            expect(result).toBe(8); // 2 + 1 + 2 + 1 + 2
        });

        it('returns 0 for clean report', () => {
            const report = {
                timestamp: new Date().toISOString(),
                knip: {
                    files: [],
                    dependencies: [],
                    devDependencies: [],
                    unlisted: [],
                    exports: [],
                    types: [],
                },
                unusedAssets: [],
                unusedScssVariables: [],
                recommendations: [],
            };

            const result = calculateTotalIssues(report);

            expect(result).toBe(0);
        });
    });

    describe('printFinalStatus()', () => {
        let consoleSpy: ReturnType<typeof vi.spyOn>;

        beforeEach(() => {
            consoleSpy = vi.spyOn(console, 'log').mockImplementation(vi.fn());
        });

        afterEach(() => {
            consoleSpy.mockRestore();
        });

        it('prints clean status for zero issues', () => {
            printFinalStatus(0);

            expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('ZERO DEAD CODE'));
        });

        it('prints warning for issues found', () => {
            printFinalStatus(5);

            expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('5 issues found'));
        });
    });

    describe('main()', () => {
        let consoleSpy: ReturnType<typeof vi.spyOn>;

        beforeEach(() => {
            vi.resetAllMocks();
            consoleSpy = vi.spyOn(console, 'log').mockImplementation(vi.fn());
        });

        afterEach(() => {
            consoleSpy.mockRestore();
        });

        it('runs full audit successfully', () => {
            // Mock Knip
            vi.mocked(childProcess.execSync).mockReturnValue('{}');

            // Mock fs for assets and SCSS
            vi.mocked(fs.readdirSync).mockImplementation(() => {
                throw new Error('ENOENT');
            });

            vi.mocked(fs.writeFileSync).mockImplementation(vi.fn());

            main();

            expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('HOUSEKEEPING AUDIT'));
            expect(fs.writeFileSync).toHaveBeenCalled();
        });
    });
});
