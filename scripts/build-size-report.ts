/**
 * Build Size Report Script
 * Compares file sizes before/after optimization
 *
 * @module scripts/build-size-report
 */

import { readdirSync, statSync, readFileSync, writeFileSync } from 'node:fs';
import { join, extname } from 'node:path';

interface FileStats {
    file: string;
    size: number;
    sizeKB: string;
}

interface SizeReport {
    timestamp: string;
    files: FileStats[];
    totalSize: number;
    totalSizeKB: string;
    htmlFiles: number;
    cssInlined: number;
}

/**
 * Get all HTML files from a directory
 */
function getHtmlFiles(dir: string): string[] {
    const files: string[] = [];

    try {
        const entries = readdirSync(dir, { withFileTypes: true });

        for (const entry of entries) {
            const fullPath = join(dir, entry.name);
            if (entry.isDirectory()) {
                files.push(...getHtmlFiles(fullPath));
            } else if (extname(entry.name) === '.html') {
                files.push(fullPath);
            }
        }
    } catch {
        // Directory doesn't exist
    }

    return files;
}

/**
 * Calculate file sizes
 */
function getFileSizes(files: string[]): FileStats[] {
    return files.map(file => {
        const stats = statSync(file);
        return {
            file: file.replace(/\\/g, '/'),
            size: stats.size,
            sizeKB: (stats.size / 1024).toFixed(2),
        };
    });
}

/**
 * Extract inlined CSS size from HTML
 */
function getInlinedCssSize(htmlPath: string): number {
    try {
        const content = readFileSync(htmlPath, 'utf8');
        const ampCustomMatch = /<style amp-custom>([\s\S]*?)<\/style>/i.exec(content);
        if (ampCustomMatch) {
            return Buffer.byteLength(ampCustomMatch[1], 'utf8');
        }
    } catch {
        // File read error
    }
    return 0;
}

/**
 * Generate size report for build output
 */
function generateSizeReport(buildDir: string): SizeReport {
    const htmlFiles = getHtmlFiles(buildDir);
    const fileStats = getFileSizes(htmlFiles);

    const totalSize = fileStats.reduce((sum, f) => sum + f.size, 0);
    const totalCssSize = htmlFiles.reduce((sum, f) => sum + getInlinedCssSize(f), 0);

    return {
        timestamp: new Date().toISOString(),
        files: fileStats,
        totalSize,
        totalSizeKB: (totalSize / 1024).toFixed(2),
        htmlFiles: htmlFiles.length,
        cssInlined: totalCssSize,
    };
}

/**
 * Compare two size reports
 */
function compareSizeReports(
    before: SizeReport,
    after: SizeReport
): {
    totalSavings: number;
    totalSavingsKB: string;
    savingsPercent: number;
    perFileSavings: Array<{
        file: string;
        before: number;
        after: number;
        savings: number;
        savingsPercent: number;
    }>;
} {
    const totalSavings = before.totalSize - after.totalSize;
    const savingsPercent = before.totalSize > 0
        ? (totalSavings / before.totalSize) * 100
        : 0;

    const perFileSavings = after.files.map(afterFile => {
        const beforeFile = before.files.find(f => f.file === afterFile.file);
        const beforeSize = beforeFile?.size ?? afterFile.size;
        const fileSavings = beforeSize - afterFile.size;
        const fileSavingsPercent = beforeSize > 0
            ? (fileSavings / beforeSize) * 100
            : 0;

        return {
            file: afterFile.file.split('/').pop() || afterFile.file,
            before: beforeSize,
            after: afterFile.size,
            savings: fileSavings,
            savingsPercent: fileSavingsPercent,
        };
    });

    return {
        totalSavings,
        totalSavingsKB: (totalSavings / 1024).toFixed(2),
        savingsPercent,
        perFileSavings,
    };
}

/**
 * Format bytes to human readable
 */
function formatBytes(bytes: number): string {
    if (bytes < 1024) return `${bytes}B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)}KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)}MB`;
}

/**
 * Main execution
 */
async function main(): Promise<void> {
    const buildDir = process.argv[2] || '_site';
    const outputFile = process.argv[3] || '_site/size-report.json';

    console.log('\n📊 Build Size Report\n');
    console.log('='.repeat(60));

    const report = generateSizeReport(buildDir);

    console.log(`\n📁 Build Directory: ${buildDir}`);
    console.log(`📄 HTML Files: ${report.htmlFiles}`);
    console.log(`📦 Total Size: ${formatBytes(report.totalSize)}`);
    console.log(`🎨 Inlined CSS: ${formatBytes(report.cssInlined)}`);

    console.log('\n📋 Per-File Breakdown:\n');

    for (const file of report.files) {
        const cssSize = getInlinedCssSize(file.file);
        const cssPercent = file.size > 0 ? ((cssSize / file.size) * 100).toFixed(1) : '0';
        console.log(`  ${file.file.split('/').pop()}`);
        console.log(`    └─ Size: ${file.sizeKB}KB (CSS: ${formatBytes(cssSize)} = ${cssPercent}%)`);
    }

    // AMP CSS limit check
    const maxCssFile = report.files.reduce((max, f) => {
        const css = getInlinedCssSize(f.file);
        return css > max.size ? { file: f.file, size: css } : max;
    }, { file: '', size: 0 });

    console.log('\n' + '='.repeat(60));

    if (maxCssFile.size > 75 * 1024) {
        console.log(`\n❌ AMP CSS LIMIT EXCEEDED!`);
        console.log(`   ${maxCssFile.file}: ${formatBytes(maxCssFile.size)} > 75KB`);
        process.exit(1);
    } else {
        console.log(`\n✅ AMP CSS Limit: ${formatBytes(maxCssFile.size)} / 75KB`);
    }

    // Save report
    writeFileSync(outputFile, JSON.stringify(report, null, 2));
    console.log(`\n📝 Report saved to: ${outputFile}\n`);
}

// Run if not in test mode
if (process.env.NODE_ENV !== 'test') {
    main().catch(console.error);
}

export {
    generateSizeReport,
    compareSizeReports,
    getHtmlFiles,
    getInlinedCssSize,
    formatBytes,
};
