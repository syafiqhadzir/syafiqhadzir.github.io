/**
 * Housekeeping Script - Full Coverage Audit
 * Zero Dead Code & Zero Unused Dependencies
 *
 * @module scripts/housekeeping
 */

import { execSync } from 'node:child_process';
import { writeFileSync, readdirSync, statSync, readFileSync } from 'node:fs';
import { join, extname } from 'node:path';

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

/**
 * Run Knip analysis
 */
function runKnipAudit(): KnipResults {
    console.log('\n📦 Running Knip analysis...\n');

    try {
        // Run knip with JSON reporter
        const output = execSync('npx knip --reporter json', {
            encoding: 'utf8',
            maxBuffer: 10 * 1024 * 1024,
        });

        const results = JSON.parse(output);

        return {
            files: results.files || [],
            dependencies: results.dependencies || [],
            devDependencies: results.devDependencies || [],
            unlisted: results.unlisted || [],
            exports: results.exports || [],
            types: results.types || [],
        };
    } catch (error) {
        // Knip exits with code 1 when issues found
        const output = (error as { stdout?: string }).stdout || '{}';
        try {
            const results = JSON.parse(output);
            return {
                files: results.files || [],
                dependencies: results.dependencies || [],
                devDependencies: results.devDependencies || [],
                unlisted: results.unlisted || [],
                exports: results.exports || [],
                types: results.types || [],
            };
        } catch {
            console.log('⚠️ Could not parse Knip output, running text mode...');
            execSync('npx knip', { stdio: 'inherit' });
            return {
                files: [],
                dependencies: [],
                devDependencies: [],
                unlisted: [],
                exports: [],
                types: [],
            };
        }
    }
}

/**
 * Find potentially unused assets
 */
function findUnusedAssets(): string[] {
    console.log('\n🖼️ Scanning for unused assets...\n');

    const assetDirs = ['Images', 'fonts', 'favicons'];
    const assets: string[] = [];

    for (const dir of assetDirs) {
        try {
            const files = readdirSync(dir, { recursive: true });
            for (const file of files) {
                const fullPath = join(dir, file.toString());
                if (statSync(fullPath).isFile()) {
                    assets.push(fullPath);
                }
            }
        } catch {
            // Directory doesn't exist
        }
    }

    // Search for references in templates and source files
    const searchPaths = [
        'src',
        '_includes',
        'eleventy.config.js',
    ];

    const unusedAssets: string[] = [];

    for (const asset of assets) {
        const filename = asset.split(/[/\\]/).pop() || '';
        let found = false;

        for (const searchPath of searchPaths) {
            try {
                const result = execSync(
                    `grep -r "${filename}" ${searchPath} --include="*.njk" --include="*.ts" --include="*.js" --include="*.scss" --include="*.json" 2>/dev/null || true`,
                    { encoding: 'utf8' }
                );
                if (result.trim()) {
                    found = true;
                    break;
                }
            } catch {
                // grep not found or no matches
            }
        }

        if (!found) {
            unusedAssets.push(asset);
        }
    }

    return unusedAssets;
}

/**
 * Find unused SCSS variables
 */
function findUnusedScssVariables(): string[] {
    console.log('\n🎨 Scanning for unused SCSS variables...\n');

    const scssDir = 'src/scss';
    const unusedVars: string[] = [];

    try {
        // Read all SCSS files
        const scssFiles = readdirSync(scssDir)
            .filter(f => f.endsWith('.scss'))
            .map(f => join(scssDir, f));

        const allContent = scssFiles
            .map(f => readFileSync(f, 'utf8'))
            .join('\n');

        // Find variable definitions
        const varDefRegex = /\$([a-z][a-z0-9-]*)\s*:/gi;
        const definedVars = new Set<string>();
        let match;

        while ((match = varDefRegex.exec(allContent)) !== null) {
            definedVars.add(match[1]);
        }

        // Check usage (excluding definition lines)
        for (const varName of definedVars) {
            const usageRegex = new RegExp(`\\$${varName}(?![a-z0-9-])`, 'g');
            const matches = allContent.match(usageRegex) || [];

            // If only 1 match, it's the definition only
            if (matches.length <= 1) {
                unusedVars.push(`$${varName}`);
            }
        }
    } catch {
        // SCSS dir doesn't exist
    }

    return unusedVars;
}

/**
 * Generate recommendations
 */
function generateRecommendations(report: AuditReport): string[] {
    const recommendations: string[] = [];

    if (report.knip.dependencies.length > 0) {
        recommendations.push(
            `🗑️ Run: npm uninstall ${report.knip.dependencies.join(' ')}`
        );
    }

    if (report.knip.devDependencies.length > 0) {
        recommendations.push(
            `🗑️ Run: npm uninstall -D ${report.knip.devDependencies.join(' ')}`
        );
    }

    if (report.knip.files.length > 0) {
        recommendations.push(
            `📁 Review orphaned files: ${report.knip.files.join(', ')}`
        );
    }

    if (report.unusedAssets.length > 0) {
        recommendations.push(
            `🖼️ Review unused assets: ${report.unusedAssets.join(', ')}`
        );
    }

    if (report.unusedScssVariables.length > 0) {
        recommendations.push(
            `🎨 Remove unused SCSS variables: ${report.unusedScssVariables.join(', ')}`
        );
    }

    return recommendations;
}

/**
 * Main execution
 */
async function main(): Promise<void> {
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

    // Print summary
    console.log('\n' + '═'.repeat(60));
    console.log('📊 AUDIT SUMMARY');
    console.log('═'.repeat(60));

    console.log(`\n📦 Unused Dependencies: ${report.knip.dependencies.length}`);
    report.knip.dependencies.forEach(d => console.log(`   - ${d}`));

    console.log(`\n📦 Unused DevDependencies: ${report.knip.devDependencies.length}`);
    report.knip.devDependencies.forEach(d => console.log(`   - ${d}`));

    console.log(`\n📁 Orphaned Files: ${report.knip.files.length}`);
    report.knip.files.forEach(f => console.log(`   - ${f}`));

    console.log(`\n🖼️ Potentially Unused Assets: ${report.unusedAssets.length}`);
    report.unusedAssets.forEach(a => console.log(`   - ${a}`));

    console.log(`\n🎨 Unused SCSS Variables: ${report.unusedScssVariables.length}`);
    report.unusedScssVariables.forEach(v => console.log(`   - ${v}`));

    // Recommendations
    console.log('\n' + '═'.repeat(60));
    console.log('💡 RECOMMENDATIONS');
    console.log('═'.repeat(60));
    report.recommendations.forEach((r, i) => console.log(`${i + 1}. ${r}`));

    // Save report
    const reportPath = 'housekeeping-report.json';
    writeFileSync(reportPath, JSON.stringify(report, null, 2));
    console.log(`\n📝 Report saved to: ${reportPath}`);

    // Summary
    const totalIssues =
        report.knip.dependencies.length +
        report.knip.devDependencies.length +
        report.knip.files.length +
        report.unusedAssets.length +
        report.unusedScssVariables.length;

    console.log('\n' + '═'.repeat(60));
    if (totalIssues === 0) {
        console.log('✅ ZERO DEAD CODE - Repository is clean!');
    } else {
        console.log(`⚠️ ${totalIssues} issues found - Review report before cleanup`);
    }
    console.log('═'.repeat(60) + '\n');
}

// Run if not in test mode
if (process.env.NODE_ENV !== 'test') {
    main().catch(console.error);
}

export { runKnipAudit, findUnusedAssets, findUnusedScssVariables };
