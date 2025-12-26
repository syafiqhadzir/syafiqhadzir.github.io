import { spawnSync } from 'node:child_process';

/**
 * Production Build Script
 * Sets NODE_ENV to production and runs the build pipeline
 */

// Set production environment
process.env.NODE_ENV = 'production';

/**
 * Execute a command synchronously
 * @param command - Command to run
 * @param inputArguments - Arguments
 */
function runCommand(command: string, inputArguments: readonly string[]): void {
    const result = spawnSync(command, inputArguments, {
        stdio: 'inherit',
        shell: true,
    });

    if (result.status !== 0) {
        throw new Error(
            `Command failed: ${command} ${inputArguments.join(' ')}\nExit code: ${result.status ?? 'unknown'}`
        );
    }
}

try {
    console.log('🚀 Starting Production Build...');

    // 1. Compile TS
    console.log('Compiling TypeScript...');
    runCommand('npm', ['run', 'compile:ts']);

    // 2. Run Eleventy
    console.log('Running Eleventy...');
    runCommand('npx', ['eleventy']);

    console.log('✅ Build Complete!');
} catch (error) {
    console.error('❌ Build Failed:', error instanceof Error ? error.message : String(error));
    process.exit(1);
}
