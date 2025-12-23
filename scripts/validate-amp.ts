#!/usr/bin/env npx ts-node

/**
 * AMP HTML Validator Script
 * Post-build validation for all generated HTML files
 *
 * @module scripts/validate-amp
 */

import { readdirSync, readFileSync, statSync } from 'node:fs';
import { extname, join } from 'node:path';

/** Directories to skip during file scanning */
const IGNORED_DIRECTORIES = new Set(['node_modules', '.git', '.cache']);

/** AMP pattern to detect AMP HTML files */
const AMP_HTML_PATTERN = /<html\s+[^>]*(\bamp\b|⚡)/i;

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

interface FileValidationResult {
    file: string;
    result: ValidatorResult;
}

interface ValidationFailure {
    file: string;
    errors: ValidationError[];
}

/**
 * Check if a directory should be skipped during file scanning
 */
function shouldSkipDirectory(directoryName: string): boolean {
    return IGNORED_DIRECTORIES.has(directoryName);
}

/**
 * Recursively find all HTML files in a directory
 */
function findHtmlFiles(directory: string): string[] {
    const files: string[] = [];
    const entries = readdirSync(directory);

    for (const entry of entries) {
        const fullPath = join(directory, entry);
        const stat = statSync(fullPath);

        if (stat.isDirectory() && !shouldSkipDirectory(entry)) {
            files.push(...findHtmlFiles(fullPath));
        } else if (extname(entry).toLowerCase() === '.html') {
            files.push(fullPath);
        }
    }

    return files;
}

/**
 * Format validation error for console output
 */
function formatValidationError(validationError: ValidationError): string {
    const severity = validationError.severity === 'ERROR' ? '❌ ERROR' : '⚠️ WARNING';
    const location = `${validationError.line}:${validationError.col}`;
    return `  ${severity} at ${location}: ${validationError.message}`;
}

/**
 * Check if HTML content is an AMP document
 */
function isAmpDocument(htmlContent: string): boolean {
    return AMP_HTML_PATTERN.test(htmlContent);
}

/**
 * Validate a single HTML file
 */
function validateFile(validator: Validator, filePath: string): FileValidationResult {
    const htmlContent = readFileSync(filePath, 'utf8');

    if (!isAmpDocument(htmlContent)) {
        return { file: filePath, result: { status: 'PASS', errors: [] } };
    }

    const result = validator.validateString(htmlContent);
    return { file: filePath, result };
}

/**
 * Check if the target directory exists
 */
function directoryExists(targetDirectory: string): boolean {
    try {
        statSync(targetDirectory);
        return true;
    } catch {
        return false;
    }
}

/**
 * Print validation summary
 */
function printValidationSummary(totalFiles: number, passCount: number, failCount: number): void {
    console.log(`\n${'='.repeat(50)}`);
    console.log('VALIDATION SUMMARY');
    console.log('='.repeat(50));
    console.log(`Total Files:  ${totalFiles}`);
    console.log(`Passed:       ${passCount}`);
    console.log(`Failed:       ${failCount}`);
    console.log('='.repeat(50));
}

/**
 * Print failed files report
 */
function printFailedFiles(failures: ValidationFailure[]): void {
    console.log('\n❌ AMP Validation FAILED');
    console.log('\nFailed files:');
    for (const failure of failures) {
        console.log(`  - ${failure.file} (${failure.errors.length} error(s))`);
    }
}

/**
 * Validate multiple files and report results
 */
function validateFiles(validator: Validator, files: string[]): void {
    console.log(`Found ${files.length} HTML file(s) to validate\n`);

    let passCount = 0;
    let failCount = 0;
    const failures: ValidationFailure[] = [];

    for (const file of files) {
        const { result } = validateFile(validator, file);

        if (result.status === 'PASS') {
            console.log(`✅ PASS: ${file}`);
            passCount++;
        } else {
            console.log(`❌ FAIL: ${file}`);
            failCount++;

            failures.push({
                file,
                errors: result.errors.filter((error) => error.severity === 'ERROR'),
            });

            for (const validationError of result.errors) {
                console.log(formatValidationError(validationError));
            }
        }
    }

    printValidationSummary(files.length, passCount, failCount);

    if (failCount > 0) {
        printFailedFiles(failures);
        process.exit(1);
    } else {
        console.log('\n✅ All files passed AMP validation!');
        process.exit(0);
    }
}

/**
 * Main validation function
 */
async function main(): Promise<void> {
    console.log('🔍 AMP HTML Validator\n');

    // Dynamic import of amphtml-validator
    // @ts-expect-error - amphtml-validator lacks proper ESM type exports
    const amphtmlValidator = await import('amphtml-validator');
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    const validator = (await amphtmlValidator.getInstance()) as Validator;

    const targetDirectory = process.argv[2] ?? '_site';

    if (!directoryExists(targetDirectory)) {
        console.log(`Directory "${targetDirectory}" not found, validating root HTML files...\n`);
        const htmlFiles = findHtmlFiles('.');
        validateFiles(validator, htmlFiles);
        return;
    }

    console.log(`Validating HTML files in: ${targetDirectory}\n`);

    const htmlFiles = findHtmlFiles(targetDirectory);

    if (htmlFiles.length === 0) {
        console.log('No HTML files found to validate.');
        process.exit(0);
    }

    validateFiles(validator, htmlFiles);
}

// Run main function only when not in test mode
if (process.env.NODE_ENV !== 'test') {
    main().catch((error: unknown) => {
        const errorMessage = error instanceof Error ? error.message : String(error);
        console.error('Validation script error:', errorMessage);
        process.exit(1);
    });
}

export {
    shouldSkipDirectory,
    findHtmlFiles,
    formatValidationError,
    isAmpDocument,
    validateFile,
    directoryExists,
    validateFiles,
    main,
};
