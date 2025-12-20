/**
 * JSON-LD Schema Validation Script
 * Validates structured data in generated HTML files
 *
 * @module scripts/validate-schema
 */

import { readFile, readdir } from 'node:fs/promises';
import { join } from 'node:path';

interface ValidationResult {
    file: string;
    valid: boolean;
    schemas: number;
    errors: string[];
    warnings: string[];
}

interface SchemaObject {
    '@context'?: string;
    '@type'?: string;
    '@id'?: string;
    [key: string]: unknown;
}

/**
 * Extract JSON-LD scripts from HTML content
 */
function extractJsonLd(html: string): string[] {
    const regex = /<script\s+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
    const matches: string[] = [];
    let match;

    while ((match = regex.exec(html)) !== null) {
        matches.push(match[1].trim());
    }

    return matches;
}

/**
 * Validate a single JSON-LD schema
 */
function validateSchema(jsonString: string): { valid: boolean; errors: string[]; warnings: string[]; schema: SchemaObject | SchemaObject[] | null } {
    const errors: string[] = [];
    const warnings: string[] = [];
    let schema: SchemaObject | SchemaObject[] | null = null;

    try {
        schema = JSON.parse(jsonString);
    } catch (e) {
        errors.push(`Invalid JSON: ${(e as Error).message}`);
        return { valid: false, errors, warnings, schema: null };
    }

    // Handle array of schemas and filter out nulls
    const schemas: SchemaObject[] = (Array.isArray(schema) ? schema : [schema]).filter(
        (s): s is SchemaObject => s !== null && typeof s === 'object'
    );

    for (const s of schemas) {
        // Check required fields
        if (!s['@context']) {
            errors.push(`Missing @context in ${s['@type'] || 'unknown'} schema`);
        } else if (s['@context'] !== 'https://schema.org') {
            warnings.push(`@context should be "https://schema.org", got "${s['@context']}"`);
        }

        if (!s['@type']) {
            errors.push('Missing @type');
        }

        // Type-specific validation
        if (s['@type'] === 'Person') {
            if (!s.name) errors.push('Person schema missing "name"');
            if (!s.url) warnings.push('Person schema missing "url"');
        }

        if (s['@type'] === 'ResearchProject') {
            if (!s.name) errors.push('ResearchProject schema missing "name"');
            if (!s.description) warnings.push('ResearchProject schema missing "description"');
        }

        if (s['@type'] === 'WebPage') {
            if (!s.name) warnings.push('WebPage schema missing "name"');
        }

        if (s['@type'] === 'ContactPage') {
            if (!s.name) warnings.push('ContactPage schema missing "name"');
        }
    }

    return {
        valid: errors.length === 0,
        errors,
        warnings,
        schema,
    };
}

/**
 * Validate all HTML files in a directory
 */
async function validateDirectory(dir: string): Promise<ValidationResult[]> {
    const results: ValidationResult[] = [];

    try {
        const files = await readdir(dir);
        const htmlFiles = files.filter((f) => f.endsWith('.html'));

        for (const file of htmlFiles) {
            const filePath = join(dir, file);
            const content = await readFile(filePath, 'utf-8');
            const jsonLdScripts = extractJsonLd(content);

            const result: ValidationResult = {
                file,
                valid: true,
                schemas: jsonLdScripts.length,
                errors: [],
                warnings: [],
            };

            if (jsonLdScripts.length === 0) {
                result.warnings.push('No JSON-LD schemas found');
            }

            for (const script of jsonLdScripts) {
                const validation = validateSchema(script);
                result.errors.push(...validation.errors);
                result.warnings.push(...validation.warnings);
                if (!validation.valid) {
                    result.valid = false;
                }
            }

            results.push(result);
        }
    } catch (error) {
        console.error(`Error reading directory: ${(error as Error).message}`);
    }

    return results;
}

/**
 * Main validation runner
 */
async function main(): Promise<void> {
    const siteDir = process.argv[2] || '_site';

    console.log('\n📋 JSON-LD Schema Validation\n');
    console.log('='.repeat(50));

    const results = await validateDirectory(siteDir);

    let hasErrors = false;
    let totalSchemas = 0;

    for (const result of results) {
        totalSchemas += result.schemas;
        const status = result.valid ? '✅' : '❌';
        console.log(`\n${status} ${result.file} (${result.schemas} schema(s))`);

        for (const error of result.errors) {
            console.log(`   ❌ ERROR: ${error}`);
            hasErrors = true;
        }

        for (const warning of result.warnings) {
            console.log(`   ⚠️  WARN: ${warning}`);
        }
    }

    console.log('\n' + '='.repeat(50));
    console.log(`📊 Summary: ${results.length} files, ${totalSchemas} schemas`);

    if (hasErrors) {
        console.log('❌ Validation FAILED\n');
        process.exit(1);
    } else {
        console.log('✅ Validation PASSED\n');
        process.exit(0);
    }
}

main().catch(console.error);

export { extractJsonLd, validateSchema, validateDirectory };
