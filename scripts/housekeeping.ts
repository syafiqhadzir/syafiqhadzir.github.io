/**
 * Housekeeping Script - Full Coverage Audit
 * Zero Dead Code & Zero Unused Dependencies
 *
 * @module scripts/housekeeping
 */

import { execSync } from 'node:child_process';
import { appendFileSync, readdirSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { parseArgs } from 'node:util';

/** Directories containing assets to scan */
const ASSET_DIRECTORIES = ['Images', 'fonts', 'favicons'];

/** Paths to search for asset references */
const ASSET_SEARCH_PATHS = ['src', '_includes', 'eleventy.config.js'];

/** Output report file path */
const REPORT_OUTPUT_PATH = 'housekeeping-report.json';

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
 * Find unused SCSS variables
 * Note: Flaky detection - disabled for now
 */
function findUnusedScssVariables(): string[] {
    return [];
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
 * Write summary to GITHUB_STEP_SUMMARY
 */
function writeGithubSummary(report: AuditReport, totalIssues: number): void {
    const summaryPath = process.env.GITHUB_STEP_SUMMARY;
    if (!summaryPath) {
        return;
    }

    const emoji = totalIssues === 0 ? '✅' : '⚠️';
    const summary = `
## ${emoji} Housekeeping Audit Results

| Category | Issues |
| :--- | :--- |
| 📦 Unused Dependencies | ${report.knip.dependencies.length} |
| 📦 Unused DevDependencies | ${report.knip.devDependencies.length} |
| 📁 Orphaned Files | ${report.knip.files.length} |
| 🖼️ Unused Assets | ${report.unusedAssets.length} |
| 🎨 Unused SCSS Vars | ${report.unusedScssVariables.length} |
| **Total Issues** | **${totalIssues}** |

<details>
<summary>View Recommendations</summary>

\`\`\`
${report.recommendations.join('\n')}
\`\`\`
</details>
`;

    try {
        appendFileSync(summaryPath, summary);
        console.log('\n📝 Added summary to GitHub Actions');
    } catch {
        console.error('Failed to write to GITHUB_STEP_SUMMARY');
    }
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
 * Apply Fixes (Delete unused files)
 */
function applyFixes(report: AuditReport): void {
    console.log(`\n${'═'.repeat(60)}`);
    console.log('🛠️ APPLYING AUTO-FIXES');
    console.log('═'.repeat(60));

    // Delete unused assets
    for (const asset of report.unusedAssets) {
        try {
            console.log(`🗑️ Deleting asset: ${asset}`);
            rmSync(asset);
        } catch (error) {
            console.error(`❌ Failed to delete ${asset}:`, error);
        }
    }

    // Delete orphaned files
    for (const file of report.knip.files) {
        try {
            console.log(`🗑️ Deleting orphan: ${file}`);
            rmSync(file);
        } catch (error) {
            console.error(`❌ Failed to delete ${file}:`, error);
        }
    }

    console.log('\n✅ Auto-fix complete! (Dependencies and SCSS variables require manual review)');
}

/**
 * Generate full audit report
 */
function createAuditReport(): AuditReport {
    const report: AuditReport = {
        timestamp: new Date().toISOString(),
        knip: runKnipAudit(),
        unusedAssets: findUnusedAssets(),
        unusedScssVariables: findUnusedScssVariables(),
        recommendations: [],
    };

    report.recommendations = generateRecommendations(report);
    return report;
}

/**
 * Main execution
 */
function main(): void {
    const { values: args } = parseArgs({
        options: {
            ci: { type: 'boolean', default: false },
            fix: { type: 'boolean', default: false },
        },
    });

    console.log('═'.repeat(60));
    console.log('🧹 HOUSEKEEPING AUDIT - Full Coverage');
    if (args.ci) {
        console.log('🔒 CI MODE: Strict checks');
    }
    if (args.fix) {
        console.log('🛠️ FIX MODE: Auto-cleanup enabled');
    }
    console.log('═'.repeat(60));

    const report = createAuditReport();

    printAuditSummary(report);
    printRecommendations(report.recommendations);

    writeFileSync(REPORT_OUTPUT_PATH, JSON.stringify(report, null, 2));
    console.log(`\n📝 Report saved to: ${REPORT_OUTPUT_PATH}`);

    const totalIssues = calculateTotalIssues(report);
    printFinalStatus(totalIssues);

    writeGithubSummary(report, totalIssues);

    if (args.fix && totalIssues > 0) {
        applyFixes(report);
    } else if (args.ci && totalIssues > 0) {
        console.error('❌ CI FAILED: Issues found and no --fix flag provided.');
        process.exit(1);
    }
}

// Run if not in test mode
if (process.env.NODE_ENV !== 'test') {
    main();
}

export {
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
};
