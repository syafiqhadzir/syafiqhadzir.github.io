/**
 * Housekeeping Script - Full Coverage Audit
 * Zero Dead Code & Zero Unused Dependencies
 *
 * @module scripts/housekeeping
 */

import { execSync } from 'node:child_process';
import { readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

/** Directories containing assets to scan */
const ASSET_DIRECTORIES = ['Images', 'fonts', 'favicons'];

/** Paths to search for asset references */
const ASSET_SEARCH_PATHS = ['src', '_includes', 'eleventy.config.js'];

/** SCSS source directory */
const SCSS_DIRECTORY = 'src/scss';

/** Output report file path */
const REPORT_OUTPUT_PATH = 'housekeeping-report.json';

/** SCSS variable definition pattern */
const SCSS_VARIABLE_DEFINITION_PATTERN = /\$([a-z][a-z0-9-]*)\s*:/gi;

interface AuditReport {
    timestamp: string;
    knip: KnipResults;
    unusedAssets: string[];
    unusedScssVariables: string[];
    recommendations: string[];
}

interface KnipResults {
    files: string[];
    dependencies: string[];
    devDependencies: string[];
    unlisted: string[];
    exports: string[];
    types: string[];
}

interface KnipJsonOutput {
    files?: string[];
    dependencies?: string[];
    devDependencies?: string[];
    unlisted?: string[];
    exports?: string[];
    types?: string[];
}

/**
 * Create empty Knip results
 */
function createEmptyKnipResults(): KnipResults {
    return {
        files: [],
        dependencies: [],
        devDependencies: [],
        unlisted: [],
        exports: [],
        types: [],
    };
}

/**
 * Parse Knip JSON output safely
 */
function parseKnipOutput(output: string): KnipResults {
    try {
        const results = JSON.parse(output) as KnipJsonOutput;
        return {
            files: results.files ?? [],
            dependencies: results.dependencies ?? [],
            devDependencies: results.devDependencies ?? [],
            unlisted: results.unlisted ?? [],
            exports: results.exports ?? [],
            types: results.types ?? [],
        };
    } catch {
        return createEmptyKnipResults();
    }
}

/**
 * Run Knip analysis
 */
function runKnipAudit(): KnipResults {
    console.log('\n📦 Running Knip analysis...\n');

    try {
        const output = execSync('npx knip --reporter json', {
            encoding: 'utf8',
            maxBuffer: 10 * 1024 * 1024,
        });
        return parseKnipOutput(output);
    } catch (execError: unknown) {
        // Knip exits with code 1 when issues found
        const errorWithOutput = execError as { stdout?: string };
        const output = errorWithOutput.stdout ?? '{}';
        const parsed = parseKnipOutput(output);

        if (parsed.files.length === 0 && parsed.dependencies.length === 0) {
            console.log('⚠️ Could not parse Knip output, running text mode...');
            execSync('npx knip', { stdio: 'inherit' });
        }

        return parsed;
    }
}

/**
 * Get all files in asset directories
 */
function collectAssetFiles(): string[] {
    const assets: string[] = [];

    for (const directory of ASSET_DIRECTORIES) {
        try {
            const files = readdirSync(directory, { recursive: true });
            for (const file of files) {
                const fullPath = join(directory, file.toString());
                if (statSync(fullPath).isFile()) {
                    assets.push(fullPath);
                }
            }
        } catch {
            // Directory doesn't exist - skip
        }
    }

    return assets;
}

/**
 * Extract filename from path
 */
function extractFilename(assetPath: string): string {
    return assetPath.split(/[/\\]/).pop() ?? '';
}

/**
 * Check if asset is referenced in search paths
 */
function isAssetReferenced(filename: string): boolean {
    for (const searchPath of ASSET_SEARCH_PATHS) {
        try {
            const grepCommand = `grep -r "${filename}" ${searchPath} --include="*.njk" --include="*.ts" --include="*.js" --include="*.scss" --include="*.json" 2>/dev/null || true`;
            const result = execSync(grepCommand, { encoding: 'utf8' });
            if (result.trim().length > 0) {
                return true;
            }
        } catch {
            // grep not found or error - continue
        }
    }
    return false;
}

/**
 * Find potentially unused assets
 */
function findUnusedAssets(): string[] {
    console.log('\n🖼️ Scanning for unused assets...\n');

    const assets = collectAssetFiles();
    const unusedAssets: string[] = [];

    for (const asset of assets) {
        const filename = extractFilename(asset);
        if (filename && !isAssetReferenced(filename)) {
            unusedAssets.push(asset);
        }
    }

    return unusedAssets;
}

/**
 * Read all SCSS files content
 */
function readScssContent(): string {
    try {
        const scssFiles = readdirSync(SCSS_DIRECTORY)
            .filter((fileName) => fileName.endsWith('.scss'))
            .map((fileName) => join(SCSS_DIRECTORY, fileName));

        return scssFiles.map((filePath) => readFileSync(filePath, 'utf8')).join('\n');
    } catch {
        return '';
    }
}

/**
 * Extract defined SCSS variable names
 */
function extractScssVariableNames(content: string): Set<string> {
    const definedVariables = new Set<string>();
    let match: RegExpExecArray | null;

    // Reset regex state
    SCSS_VARIABLE_DEFINITION_PATTERN.lastIndex = 0;

    while ((match = SCSS_VARIABLE_DEFINITION_PATTERN.exec(content)) !== null) {
        if (match[1]) {
            definedVariables.add(match[1]);
        }
    }

    return definedVariables;
}

/**
 * Check if SCSS variable is used more than once (definition + usage)
 */
function isScssVariableUsed(variableName: string, content: string): boolean {
    const usagePattern = new RegExp(String.raw`\$${variableName}(?![a-z0-9-])`, 'g');
    let matchCount = 0;
    while (usagePattern.exec(content) !== null) {
        matchCount++;
        if (matchCount > 1) {
            return true;
        }
    }
    return false;
}

/**
 * Find unused SCSS variables
 */
function findUnusedScssVariables(): string[] {
    console.log('\n🎨 Scanning for unused SCSS variables...\n');

    const content = readScssContent();
    if (content.length === 0) {
        return [];
    }

    const definedVariables = extractScssVariableNames(content);
    const unusedVariables: string[] = [];

    for (const variableName of definedVariables) {
        if (!isScssVariableUsed(variableName, content)) {
            unusedVariables.push(`$${variableName}`);
        }
    }

    return unusedVariables;
}

/**
 * Generate recommendations based on audit report
 */
function generateRecommendations(report: AuditReport): string[] {
    const recommendations: string[] = [];

    if (report.knip.dependencies.length > 0) {
        recommendations.push(`🗑️ Run: npm uninstall ${report.knip.dependencies.join(' ')}`);
    }

    if (report.knip.devDependencies.length > 0) {
        recommendations.push(`🗑️ Run: npm uninstall -D ${report.knip.devDependencies.join(' ')}`);
    }

    if (report.knip.files.length > 0) {
        recommendations.push(`📁 Review orphaned files: ${report.knip.files.join(', ')}`);
    }

    if (report.unusedAssets.length > 0) {
        recommendations.push(`🖼️ Review unused assets: ${report.unusedAssets.join(', ')}`);
    }

    if (report.unusedScssVariables.length > 0) {
        recommendations.push(
            `🎨 Remove unused SCSS variables: ${report.unusedScssVariables.join(', ')}`
        );
    }

    return recommendations;
}

/**
 * Print audit section with items
 */
function printAuditSection(title: string, items: string[]): void {
    console.log(`\n${title}: ${items.length}`);
    for (const item of items) {
        console.log(`   - ${item}`);
    }
}

/**
 * Print audit summary
 */
function printAuditSummary(report: AuditReport): void {
    console.log(`\n${'═'.repeat(60)}`);
    console.log('📊 AUDIT SUMMARY');
    console.log('═'.repeat(60));

    printAuditSection('📦 Unused Dependencies', report.knip.dependencies);
    printAuditSection('📦 Unused DevDependencies', report.knip.devDependencies);
    printAuditSection('📁 Orphaned Files', report.knip.files);
    printAuditSection('🖼️ Potentially Unused Assets', report.unusedAssets);
    printAuditSection('🎨 Unused SCSS Variables', report.unusedScssVariables);
}

/**
 * Print recommendations
 */
function printRecommendations(recommendations: string[]): void {
    console.log(`\n${'═'.repeat(60)}`);
    console.log('💡 RECOMMENDATIONS');
    console.log('═'.repeat(60));
    for (const [index, recommendation] of recommendations.entries()) {
        console.log(`${index + 1}. ${recommendation}`);
    }
}

/**
 * Calculate total issues count
 */
function calculateTotalIssues(report: AuditReport): number {
    return (
        report.knip.dependencies.length +
        report.knip.devDependencies.length +
        report.knip.files.length +
        report.unusedAssets.length +
        report.unusedScssVariables.length
    );
}

/**
 * Print final status
 */
function printFinalStatus(totalIssues: number): void {
    console.log(`\n${'═'.repeat(60)}`);
    if (totalIssues === 0) {
        console.log('✅ ZERO DEAD CODE - Repository is clean!');
    } else {
        console.log(`⚠️ ${totalIssues} issues found - Review report before cleanup`);
    }
    console.log(`${'═'.repeat(60)}\n`);
}

/**
 * Main execution
 */
function main(): void {
    console.log('═'.repeat(60));
    console.log('🧹 HOUSEKEEPING AUDIT - Full Coverage');
    console.log('═'.repeat(60));

    const report: AuditReport = {
        timestamp: new Date().toISOString(),
        knip: runKnipAudit(),
        unusedAssets: findUnusedAssets(),
        unusedScssVariables: findUnusedScssVariables(),
        recommendations: [],
    };

    report.recommendations = generateRecommendations(report);

    printAuditSummary(report);
    printRecommendations(report.recommendations);

    writeFileSync(REPORT_OUTPUT_PATH, JSON.stringify(report, null, 2));
    console.log(`\n📝 Report saved to: ${REPORT_OUTPUT_PATH}`);

    const totalIssues = calculateTotalIssues(report);
    printFinalStatus(totalIssues);
}

// Run if not in test mode
if (process.env.NODE_ENV !== 'test') {
    main();
}

export { runKnipAudit, findUnusedAssets, findUnusedScssVariables };
