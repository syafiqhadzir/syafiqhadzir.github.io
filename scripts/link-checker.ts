#!/usr/bin/env npx ts-node
/* eslint-disable sonarjs/code-eval -- False positive: this file checks for 'javascript:' protocol strings, not executing code */
/**
 * Link Checker Script
 * Validates all internal and external links in the built site
 *
 * Usage: npx ts-node scripts/link-checker.ts [directory]
 */

import { readdirSync, readFileSync, statSync } from 'node:fs';
import { extname, join } from 'node:path';

export interface LinkCheckResult {
    file: string;
    link: string;
    type: 'internal' | 'external';
    status: 'ok' | 'broken' | 'warning';
    message?: string;
}

/**
 * Extract all links from HTML content
 * @param html - HTML content to extract links from
 * @returns Array of extracted links
 */
export function extractLinks(html: string): string[] {
    const linkRegex = /href=["']([^"']+)["']/g;
    const links: string[] = [];
    let match: RegExpExecArray | null;

    // Protocols to skip during link extraction (these are non-navigable links)
    const ignoredProtocols = ['javascript:', 'mailto:', 'tel:'];

    while ((match = linkRegex.exec(html)) !== null) {
        const href = match[1];
        // Skip empty links and links with ignored protocols
        const shouldSkip = !href || ignoredProtocols.some((protocol) => href.startsWith(protocol));
        if (!shouldSkip) {
            links.push(href);
        }
    }

    return links;
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
 * Check if internal link exists
 * @param link - Link to check
 * @param baseDirectory - Base directory for resolution
 * @returns Whether the link exists
 */
export function checkInternalLink(link: string, baseDirectory: string): boolean {
    // Remove query string and hash
    const linkWithoutQuery = link.split('?')[0] ?? '';
    const cleanLink = linkWithoutQuery.split('#')[0] ?? '';

    // Handle root-relative links
    let targetPath = cleanLink.startsWith('/') ? join(baseDirectory, cleanLink) : cleanLink;

    // Check for index.html
    if (!extname(targetPath)) {
        targetPath = join(targetPath, 'index.html');
    }

    try {
        statSync(targetPath);
        return true;
    } catch {
        return false;
    }
}

/**
 * Process a single link for validation
 * @param link - Link to check
 * @param file - Source file
 * @param directory - Base directory
 * @returns Link check result or null if skipped
 */
function processLink(link: string, file: string, directory: string): LinkCheckResult | null {
    const isExternal = link.startsWith('http://') || link.startsWith('https://');
    const isAnchor = link.startsWith('#');

    if (isAnchor) {
        return null;
    }

    if (isExternal) {
        return {
            file,
            link,
            type: 'external',
            status: 'warning',
            message: 'External link - verify manually',
        };
    }

    const exists = checkInternalLink(link, directory);
    return {
        file,
        link,
        type: 'internal',
        status: exists ? 'ok' : 'broken',
        message: exists ? undefined : 'File not found',
    };
}

/**
 * Main link checker function
 * @param directory - Directory containing built site
 * @returns Array of link check results
 */
export function checkLinks(directory: string): LinkCheckResult[] {
    const results: LinkCheckResult[] = [];
    const htmlFiles = getHtmlFiles(directory);

    console.log(`\n🔍 Checking links in ${htmlFiles.length} HTML files...\n`);

    for (const file of htmlFiles) {
        const content = readFileSync(file, 'utf8');
        const links = extractLinks(content);

        for (const link of links) {
            const result = processLink(link, file, directory);
            if (result) {
                results.push(result);
            }
        }
    }

    return results;
}

/**
 * Print results summary
 * @param results - Array of link check results
 */
export function printResults(results: LinkCheckResult[]): void {
    const broken = results.filter((r) => r.status === 'broken');
    const warnings = results.filter((r) => r.status === 'warning');
    const ok = results.filter((r) => r.status === 'ok');

    console.log('\n📊 Link Check Results\n');
    console.log(`✅ OK: ${ok.length}`);
    console.log(`⚠️  Warnings: ${warnings.length}`);
    console.log(`❌ Broken: ${broken.length}`);

    if (broken.length > 0) {
        console.log('\n❌ Broken Links:\n');
        for (const result of broken) {
            console.log(`  ${result.file}`);
            console.log(`    → ${result.link}`);
            console.log(`    ${result.message}\n`);
        }
    }

    if (warnings.length > 0 && warnings.length <= 10) {
        console.log('\n⚠️  External Links (verify manually):\n');
        for (const result of warnings) {
            console.log(`  ${result.link}`);
        }
    } else if (warnings.length > 10) {
        console.log(`\n⚠️  ${warnings.length} external links found (not shown)`);
    }
}

/**
 * Main execution function
 * @param directory - Directory to check
 * @returns Exit code (0 for success, 1 for broken links)
 */
export function main(directory: string): number {
    const results = checkLinks(directory);
    printResults(results);
    const broken = results.filter((r) => r.status === 'broken');
    return broken.length > 0 ? 1 : 0;
}

// Only run main when executed directly (not when imported for testing)
const mainFile = process.argv[1];
 
const isMainModule = (mainFile ?? '').includes('link-checker');
if (isMainModule) {
    const directoryArgument = process.argv[2] ?? '_site';
    process.exit(main(directoryArgument));
}
