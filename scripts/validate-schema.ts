/**
 * JSON-LD Schema Validation Script
 * Validates structured data in generated HTML files
 *
 * @module scripts/validate-schema
 */

import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';

/** Expected schema.org context URL */
const SCHEMA_ORG_CONTEXT = 'https://schema.org';

/** JSON-LD script extraction pattern */
const JSON_LD_PATTERN = /<script\s+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;

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
    name?: unknown;
    url?: unknown;
    description?: unknown;
    [key: string]: unknown;
}

interface SchemaValidationResult {
    valid: boolean;
    errors: string[];
    warnings: string[];
    schema: SchemaObject | SchemaObject[] | null;
}

/**
 * Extract JSON-LD scripts from HTML content
 */
function extractJsonLd(htmlContent: string): string[] {
    const matches: string[] = [];
    let match: RegExpExecArray | null;

    // Reset regex state for each call
    JSON_LD_PATTERN.lastIndex = 0;

    while ((match = JSON_LD_PATTERN.exec(htmlContent)) !== null) {
        if (match[1]) {
            matches.push(match[1].trim());
        }
    }

    return matches;
}

/**
 * Parse JSON string safely
 */
function parseJsonSafely(jsonString: string): { data: unknown; error: string | null } {
    try {
        return { data: JSON.parse(jsonString) as unknown, error: null };
    } catch (parseError) {
        const errorMessage = parseError instanceof Error ? parseError.message : String(parseError);
        return { data: null, error: `Invalid JSON: ${errorMessage}` };
    }
}

/**
 * Convert parsed JSON to schema array
 */
function toSchemaArray(data: unknown): SchemaObject[] {
    if (Array.isArray(data)) {
        return data.filter(
            (item): item is SchemaObject => item !== null && typeof item === 'object'
        );
    }
    if (data !== null && typeof data === 'object') {
        return [data as SchemaObject];
    }
    return [];
}

/**
 * Validate schema context
 */
function validateSchemaContext(schema: SchemaObject, errors: string[], warnings: string[]): void {
    const schemaType = typeof schema['@type'] === 'string' ? schema['@type'] : 'unknown';

    if (schema['@context'] === undefined) {
        errors.push(`Missing @context in ${schemaType} schema`);
    } else if (schema['@context'] !== SCHEMA_ORG_CONTEXT) {
        warnings.push(
            `@context should be "${SCHEMA_ORG_CONTEXT}", got "${String(schema['@context'])}"`
        );
    }

    if (schema['@type'] === undefined) {
        errors.push('Missing @type');
    }
}

/**
 * Validate Person schema fields
 */
function validatePersonSchema(schema: SchemaObject, errors: string[], warnings: string[]): void {
    if (schema.name === undefined) {
        errors.push('Person schema missing "name"');
    }
    if (schema.url === undefined) {
        warnings.push('Person schema missing "url"');
    }
}

/**
 * Validate ResearchProject schema fields
 */
function validateResearchProjectSchema(
    schema: SchemaObject,
    errors: string[],
    warnings: string[]
): void {
    if (schema.name === undefined) {
        errors.push('ResearchProject schema missing "name"');
    }
    if (schema.description === undefined) {
        warnings.push('ResearchProject schema missing "description"');
    }
}

/**
 * Validate type-specific schema requirements
 */
function validateSchemaType(schema: SchemaObject, errors: string[], warnings: string[]): void {
    const schemaType = schema['@type'];

    switch (schemaType) {
        case 'Person': {
            validatePersonSchema(schema, errors, warnings);
            break;
        }
        case 'ResearchProject': {
            validateResearchProjectSchema(schema, errors, warnings);
            break;
        }
        case 'WebPage':
        case 'ContactPage': {
            if (schema.name === undefined) {
                warnings.push(`${schemaType} schema missing "name"`);
            }
            break;
        }
    }
}

/**
 * Validate a single JSON-LD schema
 */
function validateSchema(jsonString: string): SchemaValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    const { data, error } = parseJsonSafely(jsonString);

    if (error !== null) {
        errors.push(error);
        return { valid: false, errors, warnings, schema: null };
    }

    const schemas = toSchemaArray(data);

    for (const schema of schemas) {
        validateSchemaContext(schema, errors, warnings);
        validateSchemaType(schema, errors, warnings);
    }

    return {
        valid: errors.length === 0,
        errors,
        warnings,
        schema: data as SchemaObject | SchemaObject[] | null,
    };
}

/**
 * Validate a single HTML file
 */
function validateHtmlFile(fileName: string, htmlContent: string): ValidationResult {
    const jsonLdScripts = extractJsonLd(htmlContent);

    const result: ValidationResult = {
        file: fileName,
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

    return result;
}

/**
 * Validate all HTML files in a directory
 */
async function validateDirectory(directory: string): Promise<ValidationResult[]> {
    const results: ValidationResult[] = [];

    try {
        const files = await readdir(directory);
        const htmlFiles = files.filter((fileName) => fileName.endsWith('.html'));

        for (const fileName of htmlFiles) {
            const filePath = join(directory, fileName);
            const content = await readFile(filePath, 'utf8');
            results.push(validateHtmlFile(fileName, content));
        }
    } catch (readError) {
        const errorMessage = readError instanceof Error ? readError.message : String(readError);
        console.error(`Error reading directory: ${errorMessage}`);
    }

    return results;
}

/**
 * Print validation results
 */
function printResults(results: ValidationResult[]): { hasErrors: boolean; totalSchemas: number } {
    let hasErrors = false;
    let totalSchemas = 0;

    for (const result of results) {
        totalSchemas += result.schemas;
        const status = result.valid ? '✅' : '❌';
        console.log(`\n${status} ${result.file} (${result.schemas} schema(s))`);

        for (const validationError of result.errors) {
            console.log(`   ❌ ERROR: ${validationError}`);
            hasErrors = true;
        }

        for (const warning of result.warnings) {
            console.log(`   ⚠️  WARN: ${warning}`);
        }
    }

    return { hasErrors, totalSchemas };
}

/**
 * Main validation runner
 */
async function main(): Promise<void> {
    const siteDirectory = process.argv[2] ?? '_site';

    console.log('\n📋 JSON-LD Schema Validation\n');
    console.log('='.repeat(50));

    const results = await validateDirectory(siteDirectory);
    const { hasErrors, totalSchemas } = printResults(results);

    console.log(`\n${'='.repeat(50)}`);
    console.log(`📊 Summary: ${results.length} files, ${totalSchemas} schemas`);

    if (hasErrors) {
        console.log('❌ Validation FAILED\n');
        process.exit(1);
    } else {
        console.log('✅ Validation PASSED\n');
        process.exit(0);
    }
}

if (process.env.NODE_ENV !== 'test') {
    main().catch((error: unknown) => {
        const errorMessage = error instanceof Error ? error.message : String(error);
        console.error(errorMessage);
    });
}

export { extractJsonLd, validateSchema, validateDirectory, main };
