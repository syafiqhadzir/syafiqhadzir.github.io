/* eslint-disable unicorn/no-process-exit */
import { rmSync } from 'node:fs';
import path from 'node:path';

/**
 * Native Node.js replacement for rimraf
 * Usage: node scripts/clean.js <path1> <path2> ...
 */

const arguments_ = process.argv.slice(2);

if (arguments_.length === 0) {
    console.log('Nothing to clean.');
    process.exit(0);
}

console.log('🧹 Cleaning paths...');

let hasErrors = false;

for (const directory of arguments_) {
    try {
        const absolutePath = path.resolve(process.cwd(), directory);
        rmSync(absolutePath, { recursive: true, force: true });
        console.log(`   ✓ ${directory}`);
    } catch (error) {
        console.error(
            `   ✗ Error cleaning ${directory}:`,
            error instanceof Error ? error.message : String(error)
        );
        hasErrors = true;
    }
}

if (hasErrors) {
    process.exit(1);
}
