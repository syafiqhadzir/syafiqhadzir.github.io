# SonarCloud Observability Implementation - User Guide

> **Complete guide for using expert-level SonarCloud observability features**

[🏠 Home](../../README.md) / [📚 Docs](../README.md) / [Development](README.md) / SonarCloud
Observability

## Quick Navigation

- [Overview](#overview)
- [What's New](#whats-new)
- [Accessing Artifacts](#accessing-artifacts)
- [Debugging Coverage Gap](#debugging-the-coverage-gap)
- [Security Hotspots](#security-hotspots---command-injection)
- [Troubleshooting](#troubleshooting)

---

## Overview

This guide explains how to use the new expert-level SonarCloud observability features implemented in
the `nightly-quality.yml` workflow.

## What's New

### 1. **Verbose Scanner Logs**

The workflow now captures complete SonarCloud scanner output with verbose diagnostics enabled.

**Location:** Available as artifact `sonar-analysis.log.gz` (compressed)

**Contains:**

- Detailed file analysis traces
- LCOV path resolution details
- Coverage ingestion diagnostics
- Security hotspot detection logs
- Quality Gate evaluation details

### 2. **Error Summary Report**

Automatically generated markdown summary of all issues found during the scan.

**Location:** Available as artifact `sonar-errors-summary.md`

**Contains:**

- Count of errors, warnings, and security hotspots
- Categorized issue listings
- Coverage analysis insights
- File analysis breakdown
- Diagnostic recommendations

### 3. **GitHub Step Summary**

Interactive summary displayed directly in the GitHub Actions UI.

**Location:** Actions run summary page

**Contains:**

- Coverage percentage vs target (80%)
- Security hotspots count by file
- Links to uploaded artifacts
- Next steps recommendations

### 4. **Coverage Debugging**

Pre-scan diagnostics verify coverage file existence and path mapping.

**Features:**

- Validates `coverage/lcov.info` exists before scan
- Displays file size and preview
- Verifies source directory structure
- Exits early if coverage is missing

## Accessing Artifacts

After each workflow run:

1. Go to the Actions tab in your repository
2. Click on the latest "Nightly Quality" run
3. Scroll to the bottom to find **Artifacts**
4. Download `sonarcloud-diagnostics` (contains all diagnostic files)

**Artifact Contents:**

- `sonar-analysis.log.gz` - Full verbose scanner output (compressed)
- `sonar-errors-summary.md` - Condensed error report
- `coverage/lcov.info` - Raw Vitest coverage data
- `.scannerwork/report-task.txt` - Scan metadata
- `.scannerwork/scanner-dump.txt` - Scanner property dump

**Retention:** 14 days

## Debugging the "Coverage Gap"

Your current issue: **77.22% coverage vs 80% target**

### Step-by-Step Debugging

1. **Download the artifacts** from the latest workflow run

2. **Decompress the verbose log:**

   ```bash
   gunzip sonar-analysis.log.gz
   ```

3. **Search for LCOV ingestion:**

   ```bash
   grep -i "lcov" sonar-analysis.log
   grep -i "coverage" sonar-analysis.log
   ```

4. **Identify analyzed files:**

   ```bash
   grep "Analysing" sonar-analysis.log | grep -E "(scripts|src)"
   ```

5. **Compare with Vitest coverage:**
   - Open `coverage/lcov.info`
   - Check which files are listed
   - Compare paths with what Sonar analyzed

### Common Issues & Fixes

#### Issue 1: Files Excluded from Coverage

**Symptom:** Vitest reports 80%+ but Sonar shows 77.22%

**Diagnosis:**

```bash
grep "EXCLUDED" sonar-analysis.log | grep scripts
```

**Fix:** Review `sonar.coverage.exclusions` in `sonar-project.properties` - ensure `scripts/` is not
excluded if you want it covered.

#### Issue 2: Path Mapping Mismatch

**Symptom:** Sonar can't match LCOV paths to source files

**Diagnosis:** Look for warnings like:

```
WARN: Could not resolve path for file: scripts/housekeeping.ts
```

**Fix:** Adjust `sonar.javascript.lcov.reportPaths` to use relative path or verify working
directory.

#### Issue 3: Missing Tests

**Symptom:** Specific lines show as uncovered

**Diagnosis:** Check the "Scanner Context" in verbose logs for exact line numbers.

**Fix:** Add unit tests for the uncovered lines.

## Security Hotspots - Command Injection

Your current issue: **6 Security Hotspots in `scripts/`**

### Files Affected

- `scripts/housekeeping.ts`
- `scripts/validate-amp.ts`

### What Are They?

SonarCloud flags potential **Command Injection** vulnerabilities where:

- User input could be passed to shell commands
- Unsanitized strings are used in `child_process.exec()`

### How to Review

1. **Download `sonar-errors-summary.md`** from artifacts
2. Look for the "Security Hotspots" section
3. Review the specific code lines mentioned

### Resolution Options

**Option A: Mark as "Safe" (if false positive)**

1. Go to SonarCloud UI → Security Hotspots
2. Review each hotspot
3. If the input is trusted/sanitized, mark as "Safe"
4. Add comment explaining why it's safe

**Option B: Fix the vulnerability**

1. Sanitize all inputs before passing to shell
2. Use parameterized commands instead of string interpolation
3. Validate/whitelist allowed values

Example fix:

```typescript
// Before (flagged as hotspot)
const cmd = `docker exec ${containerName} ls`;
exec(cmd);

// After (safer)
const { execFile } = require('child_process');
execFile('docker', ['exec', containerName, 'ls']);
```

## Secret Masking

The workflow automatically masks `SONAR_TOKEN` in all logs using GitHub's `::add-mask::` directive.

**Verification:**

- Check any uploaded artifacts
- `SONAR_TOKEN` should appear as `***` if accidentally included

## Log Volume Management

**Compression:** Logs are compressed with `gzip` (typically 90% reduction)

**Truncation:** If compressed log exceeds 50MB, it's truncated to prevent artifact limit issues

**Monitoring:**

```bash
# After workflow completes, check artifact size
# GitHub UI shows artifact size
# If consistently near 50MB, consider reducing verbosity
```

## Best Practices

### For Regular Runs

1. Review the GitHub Step Summary first (fastest)
2. If issues found, download `sonar-errors-summary.md`
3. Only download full logs for deep debugging

### For Coverage Gaps

1. Compare Vitest coverage report with Sonar's
2. Use verbose logs to identify path mismatches
3. Ensure all source files are properly configured

### For Security Hotspots

1. Review in SonarCloud UI (visual, easier)
2. Use artifacts for offline review
3. Document decisions in SonarCloud comments

## Troubleshooting

### Workflow fails at "Pre-Scan Diagnostics"

**Cause:** `coverage/lcov.info` not found

**Fix:** Ensure `npm run sonar:prepare` runs successfully (includes `npm run test:unit:coverage`)

### No artifacts uploaded

**Cause:** Workflow cancelled or artifact upload failed

**Fix:** Check workflow logs for `upload-artifact` errors

### Step Summary empty

**Cause:** Script execution failed or `GITHUB_STEP_SUMMARY` not writable

**Fix:** Review workflow logs for script errors

## Advanced: Scanner Property Dump

The workflow generates `.scannerwork/scanner-dump.txt` which contains all resolved properties.

**Use Case:** Debug property inheritance and overrides

**Example:**

```bash
# View all resolved Sonar properties
cat .scannerwork/scanner-dump.txt | grep "sonar.javascript"
```

This shows exactly what values the scanner used, resolving any confusion about CLI overrides vs
properties file.

## Support

If you encounter issues:

1. Check the GitHub Step Summary for high-level overview
2. Review `sonar-errors-summary.md` for categorized issues
3. Search `sonar-analysis.log` for specific error messages
4. Compare LCOV file paths with Sonar's analyzed files

For persistent issues, export the relevant log sections when asking for help.

---

## Related Documentation

- **[Development Guide](README.md)** - Development setup and workflows
- **[Testing Guide](TESTING.md)** - Testing requirements and strategies
- **[Quick Reference](../quick-reference/SONARCLOUD.md)** - SonarCloud quick commands
- **[Scripts README](../../scripts/README.md)** - Diagnostic script documentation

---

**Last Updated:** 2025-12-23 **Workflow Version:** Expert-Level Observability v1.0

[↑ Back to Top](#sonarcloud-observability-implementation---user-guide)
