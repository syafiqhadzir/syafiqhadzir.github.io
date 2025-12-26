#!/usr/bin/env npx ts-node
/**
 * HTML Validator Script
 * Validates HTML files for common issues
 *
 * Usage: npx ts-node scripts/html-validate.ts [directory]
 */

import { readdirSync, readFileSync, statSync } from 'node:fs';
import { extname, join, relative } from 'node:path';

export interface ValidationResult {
    file: string;
    errors: ValidationError[];
    warnings: ValidationWarning[];
}

export interface ValidationError {
    message: string;
    line?: number;
}

export interface ValidationWarning {
    message: string;
    line?: number;
}

/**
 * Get all HTML files recursively
 * @param directory - Directory to search
 * @returns Array of HTML file paths
 */
export function getHtmlFiles(directory: string): string[] {
    const files: string[] = [];

    const entries = readdirSync(directory);
    for (const entry of entries) {
        const fullPath = join(directory, entry);
        const stat = statSync(fullPath);

        if (stat.isDirectory()) {
            files.push(...getHtmlFiles(fullPath));
        } else if (extname(entry) === '.html') {
            files.push(fullPath);
        }
    }

    return files;
}

/**
 * Check for basic HTML requirements
 * @param content - HTML content
 * @returns Errors and warnings
 */
export function checkBasicRequirements(content: string): {
    errors: ValidationError[];
    warnings: ValidationWarning[];
} {
    const errors: ValidationError[] = [];
    const warnings: ValidationWarning[] = [];

    // Check for doctype
    if (!content.toLowerCase().startsWith('<!doctype html>')) {
        errors.push({ message: 'Missing DOCTYPE declaration', line: 1 });
    }

    // Check for html lang attribute
    const htmlMatch = /<html[^>]*>/i.exec(content);
    if (htmlMatch && !htmlMatch[0].includes('lang=')) {
        warnings.push({ message: '<html> missing lang attribute' });
    }

    // Check for charset meta tag
    if (!content.includes('charset=')) {
        warnings.push({ message: 'Missing charset meta tag' });
    }

    // Check for viewport meta tag
    if (!content.includes('viewport')) {
        warnings.push({ message: 'Missing viewport meta tag' });
    }

    // Check for title tag
    if (!/<title[^>]*>/.test(content)) {
        errors.push({ message: 'Missing <title> element' });
    }

    return { errors, warnings };
}

/**
 * Check for image accessibility
 * @param content - HTML content
 * @returns Errors for missing alt attributes
 */
export function checkImageAccessibility(content: string): ValidationError[] {
    const errors: ValidationError[] = [];
    const imgRegex = /<img[^>]*>/gi;
    let imgMatch: RegExpExecArray | null;

    while ((imgMatch = imgRegex.exec(content)) !== null) {
        if (!imgMatch[0].includes('alt=')) {
            const line = content.slice(0, Math.max(0, imgMatch.index)).split('\n').length;
            errors.push({ message: '<img> missing alt attribute', line });
        }
    }

    return errors;
}

/**
 * Check heading structure
 * @param content - HTML content
 * @returns Warnings for heading issues
 */
export function checkHeadings(content: string): ValidationWarning[] {
    const warnings: ValidationWarning[] = [];
    const h1Count = (content.match(/<h1[^>]*>/gi) ?? []).length;

    if (h1Count === 0) {
        warnings.push({ message: 'No <h1> element found' });
    } else if (h1Count > 1) {
        warnings.push({ message: `Multiple <h1> elements found (${h1Count})` });
    }

    return warnings;
}

/**
 * Check for deprecated elements and patterns
 * @param content - HTML content
 * @returns Errors and warnings
 */
export function checkDeprecatedPatterns(content: string): {
    errors: ValidationError[];
    warnings: ValidationWarning[];
} {
    const errors: ValidationError[] = [];
    const warnings: ValidationWarning[] = [];

    // Check for empty links
    const emptyLinkRegex = /<a[^>]*>\s*<\/a>/gi;
    if (emptyLinkRegex.test(content)) {
        warnings.push({ message: 'Empty <a> element found' });
    }

    // Check for deprecated elements
    const deprecatedElements = ['center', 'font', 'strike', 'marquee', 'blink'];
    for (const element of deprecatedElements) {
        const regex = new RegExp(`<${element}[^>]*>`, 'gi');
        if (regex.test(content)) {
            errors.push({ message: `Deprecated <${element}> element found` });
        }
    }

    // Check for inline styles (warning for AMP)
    const inlineStyleCount = (content.match(/style=["'][^"']+["']/gi) ?? []).length;
    if (inlineStyleCount > 5) {
        warnings.push({ message: `Many inline styles found (${inlineStyleCount})` });
    }

    return { errors, warnings };
}

/**
 * Validate HTML content
 * @param content - HTML content to validate
 * @param filePath - Path to the file
 * @returns Validation result
 */
export function validateHtml(content: string, filePath: string): ValidationResult {
    const basicChecks = checkBasicRequirements(content);
    const imageErrors = checkImageAccessibility(content);
    const headingWarnings = checkHeadings(content);
    const deprecatedChecks = checkDeprecatedPatterns(content);

    return {
        file: filePath,
        errors: [...basicChecks.errors, ...imageErrors, ...deprecatedChecks.errors],
        warnings: [...basicChecks.warnings, ...headingWarnings, ...deprecatedChecks.warnings],
    };
}

/**
 * Print error details
 * @param errors - Array of errors
 * @returns Count of errors printed
 */
export function printErrors(errors: ValidationError[]): number {
    let count = 0;
    for (const error of errors) {
        const lineInfo = error.line ? `:${error.line}` : '';
        console.log(`  ❌ ${error.message}${lineInfo}`);
        count++;
    }
    return count;
}

/**
 * Print warning details
 * @param warnings - Array of warnings
 * @returns Count of warnings printed
 */
export function printWarnings(warnings: ValidationWarning[]): number {
    let count = 0;
    for (const warning of warnings) {
        const lineInfo = warning.line ? `:${warning.line}` : '';
        console.log(`  ⚠️  ${warning.message}${lineInfo}`);
        count++;
    }
    return count;
}

/**
 * Print validation results
 * @param results - Array of validation results
 * @param baseDirectory - Base directory for relative paths
 */
export function printResults(results: ValidationResult[], baseDirectory: string): void {
    let totalErrors = 0;
    let totalWarnings = 0;

    console.log('\n📋 HTML Validation Results\n');

    for (const result of results) {
        if (result.errors.length > 0 || result.warnings.length > 0) {
            const relativePath = relative(baseDirectory, result.file);
            console.log(`\n📄 ${relativePath}`);
            totalErrors += printErrors(result.errors);
            totalWarnings += printWarnings(result.warnings);
        }
    }

    console.log('\n📊 Summary');
    console.log(`  Files checked: ${results.length}`);
    console.log(`  Errors: ${totalErrors}`);
    console.log(`  Warnings: ${totalWarnings}`);

    if (totalErrors === 0 && totalWarnings === 0) {
        console.log('\n✅ All HTML files passed validation!\n');
    }
}

/**
 * Main execution function
 * @param directory - Directory to validate
 * @returns Exit code (0 for success, 1 for errors)
 */
export function main(directory: string): number {
    try {
        const htmlFiles = getHtmlFiles(directory);
        console.log(`\n🔍 Validating ${htmlFiles.length} HTML files in ${directory}...\n`);

        const results: ValidationResult[] = [];
        for (const file of htmlFiles) {
            const content = readFileSync(file, 'utf8');
            results.push(validateHtml(content, file));
        }

        printResults(results, directory);

        const totalErrors = results.reduce((sum, r) => sum + r.errors.length, 0);
        return totalErrors > 0 ? 1 : 0;
    } catch (error: unknown) {
        console.error('Error:', (error as Error).message);
        return 1;
    }
}

// Only run main when executed directly (not when imported for testing)
// Check if this file is being run directly
const isMainModule = process.argv[1]?.includes('html-validate');
if (isMainModule) {
    const directory = process.argv[2] ?? '_site';
    process.exit(main(directory));
}
