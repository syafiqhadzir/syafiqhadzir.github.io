import { spawnSync } from 'node:child_process';

/**
 * Production Build Script
 * Sets NODE_ENV to production and runs the build pipeline
 */

// Set production environment
process.env.NODE_ENV = 'production';

/**
 * Get current timestamp for logging
 */
function getTimestamp(): string {
    return new Date().toISOString();
}

/**
 * Execute a command synchronously with enhanced logging
 * @param name - Human-readable name of the step
 * @param command - Command to run
 * @param inputArguments - Arguments
 */
function runStep(name: string, command: string, inputArguments: readonly string[]): void {
    console.log(`\n[${getTimestamp()}] ⏩ STEP: ${name}`);
    console.log(`[${getTimestamp()}] 💻 Executing: ${command} ${inputArguments.join(' ')}`);

    const result = spawnSync(command, inputArguments, {
        stdio: 'inherit',
        shell: true,
    });

    if (result.status !== 0) {
        console.error(`\n[${getTimestamp()}] ❌ ERROR: ${name} failed!`);
        throw new Error(`Step "${name}" failed with exit code: ${result.status ?? 'unknown'}`);
    }

    console.log(`[${getTimestamp()}] ✅ SUCCESS: ${name} completed.`);
}

try {
    console.log('═'.repeat(60));
    console.log(`🚀 PRODUCTION BUILD START - ${getTimestamp()}`);
    console.log('═'.repeat(60));

    // 1. Compile TS
    runStep('TypeScript Compilation', 'npm', ['run', 'compile:ts']);

    // 2. Run Eleventy
    runStep('Eleventy SSG Build', 'npx', ['eleventy']);

    console.log(`\n${'═'.repeat(60)}`);
    console.log(`✅ ALL STEPS COMPLETED SUCCESSFULLY - ${getTimestamp()}`);
    console.log('═'.repeat(60));
} catch (error) {
    console.error(`\n${'═'.repeat(60)}`);
    console.error(`💥 CRITICAL BUILD FAILURE - ${getTimestamp()}`);
    console.error(`Details: ${error instanceof Error ? error.message : String(error)}`);
    console.error('═'.repeat(60));
    process.exit(1);
}
