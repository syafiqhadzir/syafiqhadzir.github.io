/**
 * Type declarations for amphtml-validator
 * @see https://www.npmjs.com/package/amphtml-validator
 */

declare module 'amphtml-validator' {
    export interface ValidationError {
        severity: 'ERROR' | 'WARNING';
        line: number;
        col: number;
        message: string;
        specUrl?: string;
        code: string;
        category?: string;
    }

    export interface ValidationResult {
        status: 'PASS' | 'FAIL';
        errors: ValidationError[];
    }

    export interface Validator {
        validateString(html: string): ValidationResult;
    }

    export function getInstance(): Promise<Validator>;
    export function newInstance(htmlFormat?: string): Promise<Validator>;
}
