# SonarCloud Diagnostic Scripts

> **Expert-level diagnostic tools for CI/CD observability**

[🏠 Home](../README.md) / [📚 Docs](../docs/README.md) / Scripts

## Scripts

### `parse-sonar-log.sh`

Extracts and categorizes issues from verbose SonarCloud scanner logs.

**Usage:**

```bash
bash scripts/parse-sonar-log.sh [log-file]
```

**Input:** `sonar-analysis.log` (default)

**Output:** `sonar-errors-summary.md` containing:

- Errors, warnings, and security hotspots
- Coverage analysis insights
- File analysis breakdown
- Diagnostic recommendations

**Exit Code:**

- `0` if no errors found
- `1` if errors detected

### `generate-sonar-summary.sh`

Generates GitHub Actions Step Summary from scan results.

**Usage:**

```bash
bash scripts/generate-sonar-summary.sh [log-file] [errors-summary]
```

**Input:**

- `sonar-analysis.log` (arg 1, default)
- `sonar-errors-summary.md` (arg 2, default)
- `.scannerwork/report-task.txt` (auto-detected)

**Output:** Markdown written to `$GITHUB_STEP_SUMMARY` (or stdout)

**Contains:**

- Coverage percentage vs target
- Security hotspots count
- Quality Gate status
- Links to artifacts
- Next steps recommendations

## Local Testing

### Test Parse Script

```bash
# Create mock log
echo "ERROR: Sample error" > test.log
echo "WARN: Sample warning" >> test.log
echo "Security Hotspot found" >> test.log

# Run parser
bash scripts/parse-sonar-log.sh test.log

# Review output
cat sonar-errors-summary.md
```

### Test Summary Generator

```bash
# Mock environment (required for GitHub Actions context)
export GITHUB_STEP_SUMMARY="test-summary.md"
export GITHUB_RUN_ID="12345"
export GITHUB_REPOSITORY="user/repo"

# Run generator
bash scripts/generate-sonar-summary.sh test.log sonar-errors-summary.md

# Review output
cat test-summary.md
```

## CI Integration

Both scripts are integrated into `.github/workflows/nightly-quality.yml`:

1. **Pre-Scan Diagnostics** - Validates coverage file exists
2. **Verbose Scanner** - Captures detailed logs
3. **Parse Errors** - Runs `parse-sonar-log.sh`
4. **Generate Summary** - Runs `generate-sonar-summary.sh`
5. **Upload Artifacts** - Saves logs and summaries

## Requirements

- Bash 4.0+
- Standard Unix utilities: `grep`, `sed`, `awk`, `gzip`, `stat`
- GitHub Actions environment for summary generation

## Maintenance

### Updating Error Patterns

Edit `parse-sonar-log.sh` to adjust grep patterns:

```bash
# Current patterns
grep -n "ERROR" "${LOG_FILE}"
grep -n "WARN" "${LOG_FILE}"
grep -n -i "security hotspot" "${LOG_FILE}"

# Add new patterns as needed
grep -n "CRITICAL" "${LOG_FILE}"
```

### Customizing Summary Output

Edit `generate-sonar-summary.sh` to modify the markdown template:

```bash
cat >> "${SUMMARY_OUTPUT}" << EOF
# Your custom markdown here
EOF
```

## Troubleshooting

### Script Permission Denied

```bash
chmod +x scripts/parse-sonar-log.sh
chmod +x scripts/generate-sonar-summary.sh
```

### Grep Not Finding Patterns

- Ensure log file uses UTF-8 encoding
- Check for CRLF line endings (Windows)
- Use `cat -A` to view hidden characters

### Empty Summary Generated

- Verify `GITHUB_STEP_SUMMARY` environment variable is set
- Check script has write permissions
- Review workflow logs for error messages

## Best Practices

1. **Always run in CI** - Scripts are designed for GitHub Actions
2. **Review compressed logs** - Decompress with `gunzip` before analyzing
3. **Update patterns regularly** - SonarCloud may change log format
4. **Test locally first** - Use mock data before committing changes

## Related Documentation

- **[Development Guide](../docs/development/README.md)** - Development workflows
- **[SonarCloud Observability](../docs/development/SONARCLOUD.md)** - Full guide
- **[Contributing](../CONTRIBUTING.md)** - Contribution guidelines

## References

- [SonarCloud Documentation](https://docs.sonarcloud.io/)
- [GitHub Actions Workflow Commands](https://docs.github.com/en/actions/using-workflows/workflow-commands-for-github-actions)
- [Bash Best Practices](https://google.github.io/styleguide/shellguide.html)

[↑ Back to Top](#sonarcloud-diagnostic-scripts)
