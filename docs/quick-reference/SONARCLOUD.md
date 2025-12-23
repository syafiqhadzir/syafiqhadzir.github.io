# SonarCloud Observability - Quick Reference

> **Fast access to common SonarCloud debugging commands and workflows**

[🏠 Home](../../README.md) / [📚 Docs](../README.md) / [Quick Reference](README.md) / SonarCloud

> [!TIP] For detailed explanations, see the
> [full SonarCloud Observability Guide](../development/SONARCLOUD.md).

---

## Files Created/Modified

### Scripts Created

- `scripts/parse-sonar-log.sh` - Extracts errors from verbose logs → `sonar-errors-summary.md`
- `scripts/generate-sonar-summary.sh` - Generates GitHub step summary

### Documentation

- `docs/SONARCLOUD_OBSERVABILITY.md` - User guide
- `scripts/README.md` - Script documentation

### Modified

- `.github/workflows/nightly-quality.yml` - Enhanced with observability pipeline
- `sonar-project.properties` - Added verbose diagnostic configuration

## Quick Commands

### Local Testing

```bash
# Test log parser
bash scripts/parse-sonar-log.sh test.log

# Test summary generator
export GITHUB_STEP_SUMMARY="test.md"
bash scripts/generate-sonar-summary.sh test.log
```

### Debugging Coverage Gap

```bash
# Download and decompress logs
gunzip sonar-analysis.log.gz

# Find LCOV processing
grep -i "lcov" sonar-analysis.log

# Check excluded files
grep "EXCLUDED" sonar-analysis.log | grep scripts
```

## Next Actions

1. **Trigger workflow**: Go to Actions → Nightly Quality → Run workflow
2. **Review artifacts**: Download `sonarcloud-diagnostics` after run
3. **Debug coverage**: Use verbose logs to identify LCOV path issues
4. **Review hotspots**: Check `sonar-errors-summary.md` for security findings

## Support

Full documentation: `docs/SONARCLOUD_OBSERVABILITY.md`
