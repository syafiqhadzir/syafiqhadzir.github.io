/**
 * Build Size Report Script
 * Compares file sizes before/after optimization
 *
 * @module scripts/build-size-report
 */

import { readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { extname, join } from 'node:path';

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

const BYTES_PER_KB = 1024;
const BYTES_PER_MB = 1024 * 1024;
const AMP_CSS_LIMIT_KB = 75;

/**
 * Get all HTML files from a directory recursively
 */
function getHtmlFiles(directory: string): string[] {
    const files: string[] = [];

    try {
        const entries = readdirSync(directory, { withFileTypes: true });

        for (const entry of entries) {
            const fullPath = join(directory, entry.name);
            if (entry.isDirectory()) {
                files.push(...getHtmlFiles(fullPath));
            } else if (extname(entry.name) === '.html') {
                files.push(fullPath);
            }
        }
    } catch {
        // Directory doesn't exist - return empty array
    }

    return files;
}

/**
 * Calculate file sizes for a list of files
 */
function getFileSizes(files: string[]): FileStats[] {
    return files.map((file) => {
        const stats = statSync(file);
        return {
            file: file.replaceAll('\\', '/'),
            size: stats.size,
            sizeKB: (stats.size / BYTES_PER_KB).toFixed(2),
        };
    });
}

/**
 * Extract inlined CSS size from an HTML file
 */
function getInlinedCssSize(htmlPath: string): number {
    try {
        const content = readFileSync(htmlPath, 'utf8');
        const ampCustomMatch = /<style amp-custom>([\s\S]*?)<\/style>/i.exec(content);
        if (ampCustomMatch?.[1]) {
            return Buffer.byteLength(ampCustomMatch[1], 'utf8');
        }
    } catch {
        // File read error - return 0
    }
    return 0;
}

/**
 * Generate size report for build output
 */
function generateSizeReport(buildDirectory: string): SizeReport {
    const htmlFiles = getHtmlFiles(buildDirectory);
    const fileStats = getFileSizes(htmlFiles);

    const totalSize = fileStats.reduce((sum, fileData) => sum + fileData.size, 0);
    const totalCssSize = htmlFiles.reduce((sum, filePath) => sum + getInlinedCssSize(filePath), 0);

    return {
        timestamp: new Date().toISOString(),
        files: fileStats,
        totalSize,
        totalSizeKB: (totalSize / BYTES_PER_KB).toFixed(2),
        htmlFiles: htmlFiles.length,
        cssInlined: totalCssSize,
    };
}

/**
 * Format bytes to human readable string
 */
function formatBytes(bytes: number): string {
    if (bytes < BYTES_PER_KB) {
        return `${bytes}B`;
    }
    if (bytes < BYTES_PER_MB) {
        return `${(bytes / BYTES_PER_KB).toFixed(2)}KB`;
    }
    return `${(bytes / BYTES_PER_MB).toFixed(2)}MB`;
}

/**
 * Print report header
 */
function printHeader(buildDirectory: string, report: SizeReport): void {
    console.log('\n📊 Build Size Report\n');
    console.log('='.repeat(60));
    console.log(`\n📁 Build Directory: ${buildDirectory}`);
    console.log(`📄 HTML Files: ${report.htmlFiles}`);
    console.log(`📦 Total Size: ${formatBytes(report.totalSize)}`);
    console.log(`🎨 Inlined CSS: ${formatBytes(report.cssInlined)}`);
}

/**
 * Print per-file breakdown
 */
function printFileBreakdown(report: SizeReport): void {
    console.log('\n📋 Per-File Breakdown:\n');

    for (const fileData of report.files) {
        const cssSize = getInlinedCssSize(fileData.file);
        const cssPercent = fileData.size > 0 ? ((cssSize / fileData.size) * 100).toFixed(1) : '0';
        const fileName = fileData.file.split('/').pop() ?? fileData.file;
        console.log(`  ${fileName}`);
        console.log(
            `    └─ Size: ${fileData.sizeKB}KB (CSS: ${formatBytes(cssSize)} = ${cssPercent}%)`
        );
    }
}

/**
 * Find the file with maximum CSS size
 */
function findMaxCssFile(report: SizeReport): { file: string; size: number } {
    return report.files.reduce(
        (max, fileData) => {
            const cssSize = getInlinedCssSize(fileData.file);
            return cssSize > max.size ? { file: fileData.file, size: cssSize } : max;
        },
        { file: '', size: 0 }
    );
}

/**
 * Check AMP CSS limit and exit if exceeded
 */
function checkAmpCssLimit(maxCssFile: { file: string; size: number }): void {
    console.log(`\n${'='.repeat(60)}`);

    const limitBytes = AMP_CSS_LIMIT_KB * BYTES_PER_KB;
    if (maxCssFile.size > limitBytes) {
        console.log('\n❌ AMP CSS LIMIT EXCEEDED!');
        console.log(
            `   ${maxCssFile.file}: ${formatBytes(maxCssFile.size)} > ${AMP_CSS_LIMIT_KB}KB`
        );
        process.exit(1);
    } else {
        console.log(`\n✅ AMP CSS Limit: ${formatBytes(maxCssFile.size)} / ${AMP_CSS_LIMIT_KB}KB`);
    }
}

/**
 * Main execution
 */
function main(): void {
    const buildDirectory = process.argv[2] ?? '_site';
    const outputFile = process.argv[3] ?? '_site/size-report.json';

    const report = generateSizeReport(buildDirectory);

    printHeader(buildDirectory, report);
    printFileBreakdown(report);

    const maxCssFile = findMaxCssFile(report);
    checkAmpCssLimit(maxCssFile);

    writeFileSync(outputFile, JSON.stringify(report, null, 2));
    console.log(`\n📝 Report saved to: ${outputFile}\n`);
}

// Run if not in test mode
if (process.env.NODE_ENV !== 'test') {
    main();
}

export {
    generateSizeReport,
    getHtmlFiles,
    getInlinedCssSize,
    formatBytes,
    printHeader,
    printFileBreakdown,
    findMaxCssFile,
    checkAmpCssLimit,
    getFileSizes,
    main,
};
