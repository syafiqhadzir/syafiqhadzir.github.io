/**
 * Application-wide Constants
 * Centralized location for all magic numbers and common values
 * @module config/constants
 */

/**
 * Image scaling factors for responsive images
 * Used by imageOptimizer for generating multiple resolution variants
 */
export const IMAGE_SCALES = {
    /** Base resolution (1x) */
    BASE: 1,
    /** Retina displays (1.5x for iPad, etc.) */
    RETINA: 1.5,
    /** High-DPI displays (2x for MacBook, iPhone, etc.) */
    RETINA_2X: 2,
} as const;

/**
 * CSS size limits as per AMP specification
 * @see https://amp.dev/documentation/guides-and-tutorials/learn/spec/amphtml/#maximum-size
 */
export const CSS_LIMITS = {
    /** Maximum CSS size in bytes (75KB per AMP spec) */
    MAX_SIZE_BYTES: 75 * 1024,
    /** Maximum CSS size in kilobytes */
    MAX_SIZE_KB: 75,
} as const;

/**
 * Time-related constants
 * Used for reading time calculations and date formatting
 */
export const TIME = {
    /** Seconds in a minute */
    SECONDS_PER_MINUTE: 60,
    /** Minutes in an hour */
    MINUTES_PER_HOUR: 60,
    /** Hours in a day */
    HOURS_PER_DAY: 24,
    /** Days in a year (approximate) */
    DAYS_PER_YEAR: 365,
    /** Average words per minute reading speed */
    WORDS_PER_MINUTE: 200,
} as const;

/**
 * Common numeric values used throughout the application
 */
export const COMMON = {
    /** Full percentage value */
    PERCENTAGE_MAX: 100,
    /** First element index */
    ARRAY_FIRST: 0,
    /** Second element index */
    ARRAY_SECOND: 1,
    /** Decimal precision for calculations */
    DECIMAL_PRECISION: 2,
    /** Decimal precision for percentages */
    PERCENTAGE_PRECISION: 1,
    /** Kilobyte conversion factor */
    BYTES_PER_KB: 1024,
} as const;

/**
 * Browser targets for CSS/JS compilation
 * Matches browserslist configuration
 */
export const BROWSER_TARGETS = {
    /** Minimum Chrome version */
    CHROME_MIN: 2,
    /** Minimum Firefox version */
    FIREFOX_MIN: 2,
    /** Minimum Safari version */
    SAFARI_MIN: 2,
    /** Minimum Edge version */
    EDGE_MIN: 2,
    /** Minimum iOS version */
    IOS_MIN: 14,
    /** Minimum Android version */
    ANDROID_MIN: 10,
} as const;

/**
 * Complexity thresholds for code quality
 * Used by linters and code analysis tools
 */
export const COMPLEXITY_LIMITS = {
    /** Maximum cognitive complexity per function */
    COGNITIVE_COMPLEXITY: 12,
    /** Maximum function length in lines */
    MAX_FUNCTION_LINES: 75,
    /** Maximum statements per function */
    MAX_STATEMENTS: 25,
    /** Maximum nesting depth */
    MAX_DEPTH: 4,
    /** Maximum function parameters */
    MAX_PARAMS: 5,
    /** Maximum nested callbacks */
    MAX_NESTED_CALLBACKS: 3,
} as const;

/**
 * CSS/SCSS constraints
 * Used by Stylelint configuration
 */
export const CSS_CONSTRAINTS = {
    /** Maximum nesting depth in SCSS */
    MAX_NESTING_DEPTH: 3,
    /** Maximum ID selectors per rule */
    MAX_ID_SELECTORS: 1,
    /** Maximum class selectors per rule */
    MAX_CLASS_SELECTORS: 3,
    /** Maximum compound selectors */
    MAX_COMPOUND_SELECTORS: 3,
    /** Decimal precision for CSS values */
    NUMBER_PRECISION: 4,
} as const;
