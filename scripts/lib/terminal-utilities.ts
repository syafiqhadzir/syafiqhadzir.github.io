/**
 * CLI Utilities
 * Shared utilities for CLI scripts
 * @module scripts/lib/cli-utils
 */

/**
 * ANSI color codes for terminal output
 */
export const colors = {
    reset: '\u001B[0m',
    bold: '\u001B[1m',
    dim: '\u001B[2m',

    // Foreground colors
    red: '\u001B[31m',
    green: '\u001B[32m',
    yellow: '\u001B[33m',
    blue: '\u001B[34m',
    magenta: '\u001B[35m',
    cyan: '\u001B[36m',
    white: '\u001B[37m',

    // Background colors
    bgRed: '\u001B[41m',
    bgGreen: '\u001B[42m',
    bgYellow: '\u001B[43m',
} as const;

/**
 * Log with color
 */
export function log(message: string, color: keyof typeof colors = 'reset'): void {
    console.log(`${colors[color]}${message}${colors.reset}`);
}

/**
 * Log success message
 */
export function success(message: string): void {
    console.log(`${colors.green}✓${colors.reset} ${message}`);
}

/**
 * Log error message
 */
export function error(message: string): void {
    console.error(`${colors.red}✗${colors.reset} ${message}`);
}

/**
 * Log warning message
 */
export function warn(message: string): void {
    console.warn(`${colors.yellow}⚠${colors.reset} ${message}`);
}

/**
 * Log info message
 */
export function info(message: string): void {
    console.log(`${colors.blue}ℹ${colors.reset} ${message}`);
}

/**
 * Print a section header
 */
export function header(title: string): void {
    const line = '═'.repeat(60);
    console.log(`\n${colors.cyan}${line}${colors.reset}`);
    console.log(`${colors.bold}${title}${colors.reset}`);
    console.log(`${colors.cyan}${line}${colors.reset}\n`);
}

/**
 * Print a divider
 */
export function divider(): void {
    console.log(`${colors.dim}${'─'.repeat(60)}${colors.reset}`);
}

/**
 * Format bytes to human readable
 */
export function formatBytes(bytes: number): string {
    if (bytes < 1024) {
        return `${bytes} B`;
    }
    if (bytes < 1024 * 1024) {
        return `${(bytes / 1024).toFixed(2)} KB`;
    }
    return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}

/**
 * Format duration in milliseconds
 */
export function formatDuration(ms: number): string {
    if (ms < 1000) {
        return `${ms}ms`;
    }
    return `${(ms / 1000).toFixed(2)}s`;
}

/**
 * Execute with timing
 */
export async function withTiming<T>(label: string, fn: () => T | Promise<T>): Promise<T> {
    const start = Date.now();
    const result = await fn();
    const duration = Date.now() - start;
    info(`${label}: ${formatDuration(duration)}`);
    return result;
}

/**
 * Simple progress indicator for arrays
 */
export function progressLog(current: number, total: number, label: string): void {
    const percent = Math.round((current / total) * 100);
    process.stdout.write(`\r${colors.dim}[${percent}%]${colors.reset} ${label}`);
    if (current === total) {
        console.log();
    }
}
