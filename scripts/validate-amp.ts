#!/usr/bin/env npx ts-node

/**
 * AMP HTML Validator Script
 * Post-build validation for all generated HTML files
 *
 * @module scripts/validate-amp
 */

import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, extname } from 'node:path';

// Type definitions for amphtml-validator
interface ValidatorResult {
    status: 'PASS' | 'FAIL';
    errors: ValidationError[];
}

interface ValidationError {
    severity: 'ERROR' | 'WARNING';
    line: number;
    col: number;
    message: string;
    specUrl?: string;
    code: string;
}

interface Validator {
    validateString(html: string): ValidatorResult;
}

/**
 * Recursively find all HTML files in a directory
 */
function findHtmlFiles(dir: string): string[] {
    const files: string[] = [];

    function walk(currentDir: string): void {
        const entries = readdirSync(currentDir);

        for (const entry of entries) {
            const fullPath = join(currentDir, entry);
            const stat = statSync(fullPath);

            if (stat.isDirectory()) {
                // Skip common directories
                if (!['node_modules', '.git', '.cache'].includes(entry)) {
                    walk(fullPath);
                }
            } else if (extname(entry).toLowerCase() === '.html') {
                files.push(fullPath);
            }
        }
    }

    walk(dir);
    return files;
}

/**
 * Format validation errors for console output
 */
function formatError(file: string, error: ValidationError): string {
    const severity = error.severity === 'ERROR' ? '❌ ERROR' : '⚠️ WARNING';
    const location = `${error.line}:${error.col}`;
    return `  ${severity} at ${location}: ${error.message}`;
}

/**
 * Validate a single HTML file
 */
async function validateFile(
    validator: Validator,
    filePath: string
): Promise<{ file: string; result: ValidatorResult }> {
    const html = readFileSync(filePath, 'utf-8');

    // Check if file is AMP
    if (!/<html\s+[^>]*(\bamp\b|⚡)/i.test(html)) {
        return { file: filePath, result: { status: 'PASS', errors: [] } };
    }

    const result = validator.validateString(html);
    return { file: filePath, result };
}

/**
 * Main validation function
 */
async function main(): Promise<void> {
    console.log('🔍 AMP HTML Validator\n');

    // Dynamic import of amphtml-validator
    // @ts-expect-error - amphtml-validator lacks proper ESM type exports
    const amphtmlValidator = await import('amphtml-validator');
    const validator = await amphtmlValidator.getInstance();

    // Get directory to validate (default: current directory or _site)
    const targetDir = process.argv[2] || '_site';

    // Check if directory exists
    try {
        statSync(targetDir);
    } catch {
        // If _site doesn't exist, validate root HTML files
        console.log(`Directory "${targetDir}" not found, validating root HTML files...\n`);
        const htmlFiles = findHtmlFiles('.');
        await validateFiles(validator, htmlFiles);
        return;
    }

    console.log(`Validating HTML files in: ${targetDir}\n`);

    const htmlFiles = findHtmlFiles(targetDir);

    if (htmlFiles.length === 0) {
        console.log('No HTML files found to validate.');
        process.exit(0);
    }

    await validateFiles(validator, htmlFiles);
}

/**
 * Validate multiple files and report results
 */
async function validateFiles(validator: Validator, files: string[]): Promise<void> {
    console.log(`Found ${files.length} HTML file(s) to validate\n`);

    let passCount = 0;
    let failCount = 0;
    const failures: Array<{ file: string; errors: ValidationError[] }> = [];

    for (const file of files) {
        const { result } = await validateFile(validator, file);

        if (result.status === 'PASS') {
            console.log(`✅ PASS: ${file}`);
            passCount++;
        } else {
            console.log(`❌ FAIL: ${file}`);
            failCount++;

            // Store failures for detailed report
            failures.push({
                file,
                errors: result.errors.filter((e) => e.severity === 'ERROR'),
            });

            // Show errors inline
            for (const error of result.errors) {
                console.log(formatError(file, error));
            }
        }
    }

    // Summary
    console.log('\n' + '='.repeat(50));
    console.log('VALIDATION SUMMARY');
    console.log('='.repeat(50));
    console.log(`Total Files:  ${files.length}`);
    console.log(`Passed:       ${passCount}`);
    console.log(`Failed:       ${failCount}`);
    console.log('='.repeat(50));

    if (failCount > 0) {
        console.log('\n❌ AMP Validation FAILED');
        console.log('\nFailed files:');
        for (const failure of failures) {
            console.log(`  - ${failure.file} (${failure.errors.length} error(s))`);
        }
        process.exit(1);
    } else {
        console.log('\n✅ All files passed AMP validation!');
        process.exit(0);
    }
}

// Run main function
main().catch((error) => {
    console.error('Validation script error:', error.message);
    process.exit(1);
});
