#!/bin/bash
# SonarCloud Log Parser & Error Extractor
# Expert-Level Diagnostic Tool for CI/CD Observability
#
# Purpose: Extract ERROR, WARN, and Security Hotspot entries from verbose Sonar logs
# Output: Markdown-formatted summary with categorized findings
#
# Usage: bash scripts/parse-sonar-log.sh [path-to-log-file]
# Example: bash scripts/parse-sonar-log.sh sonar-analysis.log

set -euo pipefail

# Configuration
readonly LOG_FILE="${1:-sonar-analysis.log}"
readonly OUTPUT_FILE="sonar-errors-summary.md"
readonly TEMP_DIR=$(mktemp -d)

# ANSI Colors for terminal output
readonly RED='\033[0;31m'
readonly YELLOW='\033[1;33m'
readonly GREEN='\033[0;32m'
readonly NC='\033[0m' # No Color

# Cleanup temporary files on exit
trap 'rm -rf "${TEMP_DIR}"' EXIT

# Validate input file exists
if [[ ! -f "${LOG_FILE}" ]]; then
    echo -e "${RED}ERROR: Log file '${LOG_FILE}' not found${NC}" >&2
    exit 1
fi

echo -e "${GREEN}[parse-sonar-log] Analyzing SonarCloud scanner logs...${NC}"

# Extract different categories of issues
echo "[1/5] Extracting ERROR entries..."
grep -n "ERROR" "${LOG_FILE}" > "${TEMP_DIR}/errors.txt" || echo "No errors found"

echo "[2/5] Extracting WARN entries..."
grep -n "WARN" "${LOG_FILE}" > "${TEMP_DIR}/warnings.txt" || echo "No warnings found"

echo "[3/5] Extracting Security Hotspot mentions..."
grep -n -i "security hotspot\|hotspot.*review" "${LOG_FILE}" > "${TEMP_DIR}/hotspots.txt" || echo "No hotspots found"

echo "[4/5] Extracting coverage statistics..."
grep -n -i "coverage\|lcov\|lines.*covered" "${LOG_FILE}" > "${TEMP_DIR}/coverage.txt" || echo "No coverage data found"

echo "[5/5] Extracting file analysis details..."
grep -n "Analysing\|Analyzing" "${LOG_FILE}" > "${TEMP_DIR}/analyzed_files.txt" || echo "No file analysis data found"

# Count findings
readonly ERROR_COUNT=$(wc -l < "${TEMP_DIR}/errors.txt" | tr -d ' ')
readonly WARN_COUNT=$(wc -l < "${TEMP_DIR}/warnings.txt" | tr -d ' ')
readonly HOTSPOT_COUNT=$(wc -l < "${TEMP_DIR}/hotspots.txt" | tr -d ' ')

# Generate Markdown Summary
cat > "${OUTPUT_FILE}" << 'EOF_HEADER'
# SonarCloud Analysis Summary

> **Generated:** $(date -u +"%Y-%m-%d %H:%M:%S UTC")
> **Log File:** $(basename "${LOG_FILE}")

## 📊 Quick Stats

| Category | Count |
|----------|-------|
| Errors | **${ERROR_COUNT}** |
| Warnings | **${WARN_COUNT}** |
| Security Hotspots | **${HOTSPOT_COUNT}** |

---

EOF_HEADER

# Substitute variables in header
sed -i "s|\$(date -u +\"%Y-%m-%d %H:%M:%S UTC\")|$(date -u +"%Y-%m-%d %H:%M:%S UTC")|g" "${OUTPUT_FILE}"
sed -i "s|\$(basename \"\${LOG_FILE}\")|$(basename "${LOG_FILE}")|g" "${OUTPUT_FILE}"
sed -i "s|\${ERROR_COUNT}|${ERROR_COUNT}|g" "${OUTPUT_FILE}"
sed -i "s|\${WARN_COUNT}|${WARN_COUNT}|g" "${OUTPUT_FILE}"
sed -i "s|\${HOTSPOT_COUNT}|${HOTSPOT_COUNT}|g" "${OUTPUT_FILE}"

# Add Errors Section
{
    echo "## ❌ Errors"
    echo ""
    if [[ ${ERROR_COUNT} -eq 0 ]]; then
        echo "✅ No errors detected."
    else
        echo "<details>"
        echo "<summary>Click to expand ${ERROR_COUNT} error(s)</summary>"
        echo ""
        echo "\`\`\`"
        head -n 50 "${TEMP_DIR}/errors.txt" || echo "Unable to read errors"
        if [[ ${ERROR_COUNT} -gt 50 ]]; then
            echo ""
            echo "... (showing first 50 of ${ERROR_COUNT} errors)"
        fi
        echo "\`\`\`"
        echo "</details>"
    fi
    echo ""
} >> "${OUTPUT_FILE}"

# Add Warnings Section
{
    echo "## ⚠️ Warnings"
    echo ""
    if [[ ${WARN_COUNT} -eq 0 ]]; then
        echo "✅ No warnings detected."
    else
        echo "<details>"
        echo "<summary>Click to expand ${WARN_COUNT} warning(s)</summary>"
        echo ""
        echo "\`\`\`"
        head -n 50 "${TEMP_DIR}/warnings.txt" || echo "Unable to read warnings"
        if [[ ${WARN_COUNT} -gt 50 ]]; then
            echo ""
            echo "... (showing first 50 of ${WARN_COUNT} warnings)"
        fi
        echo "\`\`\`"
        echo "</details>"
    fi
    echo ""
} >> "${OUTPUT_FILE}"

# Add Security Hotspots Section
{
    echo "## 🔒 Security Hotspots"
    echo ""
    if [[ ${HOTSPOT_COUNT} -eq 0 ]]; then
        echo "✅ No security hotspots mentioned in logs."
    else
        echo "> [!WARNING]"
        echo "> Security hotspots require manual review in SonarCloud UI."
        echo ""
        echo "<details>"
        echo "<summary>Click to expand ${HOTSPOT_COUNT} hotspot reference(s)</summary>"
        echo ""
        echo "\`\`\`"
        cat "${TEMP_DIR}/hotspots.txt" || echo "Unable to read hotspots"
        echo "\`\`\`"
        echo "</details>"
        
        # Extract specific file mentions for housekeeping.ts and validate-amp.ts
        echo ""
        echo "### Files with Security Hotspots"
        echo ""
        if grep -i "housekeeping.ts\|validate-amp.ts" "${TEMP_DIR}/hotspots.txt" > /dev/null 2>&1; then
            echo "- 🔍 **housekeeping.ts** - Command injection risk mentioned"
            echo "- 🔍 **validate-amp.ts** - Command injection risk mentioned"
        else
            echo "_No specific file references found in log excerpts._"
        fi
    fi
    echo ""
} >> "${OUTPUT_FILE}"

# Add Coverage Analysis Section
{
    echo "## 📈 Coverage Insights"
    echo ""
    if [[ ! -s "${TEMP_DIR}/coverage.txt" ]]; then
        echo "⚠️ No coverage statistics found in logs."
        echo ""
        echo "> [!IMPORTANT]"
        echo "> This may indicate:"
        echo "> - LCOV file was not found by scanner"
        echo "> - Coverage path is misconfigured"
        echo "> - Coverage generation failed before scan"
    else
        echo "<details>"
        echo "<summary>Coverage-related log entries</summary>"
        echo ""
        echo "\`\`\`"
        cat "${TEMP_DIR}/coverage.txt"
        echo "\`\`\`"
        echo "</details>"
        
        # Extract coverage percentage if present
        if grep -oP '\d+\.?\d*%' "${TEMP_DIR}/coverage.txt" > "${TEMP_DIR}/coverage_pct.txt" 2>/dev/null; then
            echo ""
            echo "### Coverage Percentages Found"
            echo ""
            while IFS= read -r pct; do
                echo "- ${pct}"
            done < "${TEMP_DIR}/coverage_pct.txt"
        fi
    fi
    echo ""
} >> "${OUTPUT_FILE}"

# Add File Analysis Section
{
    echo "## 📁 Analyzed Files"
    echo ""
    if [[ ! -s "${TEMP_DIR}/analyzed_files.txt" ]]; then
        echo "⚠️ No file analysis data found."
    else
        readonly FILE_COUNT=$(wc -l < "${TEMP_DIR}/analyzed_files.txt" | tr -d ' ')
        echo "Scanner analyzed **${FILE_COUNT}** file(s)."
        echo ""
        echo "<details>"
        echo "<summary>View analyzed files list</summary>"
        echo ""
        echo "\`\`\`"
        head -n 100 "${TEMP_DIR}/analyzed_files.txt"
        if [[ ${FILE_COUNT} -gt 100 ]]; then
            echo ""
            echo "... (showing first 100 of ${FILE_COUNT} files)"
        fi
        echo "\`\`\`"
        echo "</details>"
    fi
    echo ""
} >> "${OUTPUT_FILE}"

# Add Diagnostic Recommendations
{
    echo "---"
    echo ""
    echo "## 🔧 Diagnostic Recommendations"
    echo ""
    
    if [[ ${ERROR_COUNT} -gt 0 ]]; then
        echo "- ❌ **${ERROR_COUNT} Errors Found** - Review error details above and check scanner configuration"
    fi
    
    if [[ ${HOTSPOT_COUNT} -gt 0 ]]; then
        echo "- 🔒 **${HOTSPOT_COUNT} Security Hotspots** - Review in SonarCloud UI and mark as \"Safe\" or \"Fix\""
    fi
    
    if [[ ! -s "${TEMP_DIR}/coverage.txt" ]]; then
        echo "- 📉 **Coverage Data Missing** - Verify \`coverage/lcov.info\` exists before scan"
        echo "  - Check \`sonar.javascript.lcov.reportPaths\` property"
        echo "  - Ensure \`npm run test:unit:coverage\` runs before \`sonar-scanner\`"
    fi
    
    echo ""
    echo "### Next Steps"
    echo ""
    echo "1. Review the full \`sonar-analysis.log\` for complete context"
    echo "2. Check \`coverage/lcov.info\` for path mapping issues"
    echo "3. Compare scanner's analyzed files with expected source files"
    echo "4. Review SonarCloud UI for visual representation of issues"
    echo ""
} >> "${OUTPUT_FILE}"

# Add footer
{
    echo "---"
    echo ""
    echo "_Generated by \`scripts/parse-sonar-log.sh\`_"
} >> "${OUTPUT_FILE}"

echo -e "${GREEN}✅ Summary generated: ${OUTPUT_FILE}${NC}"
echo -e "${YELLOW}📊 Findings: ${ERROR_COUNT} errors, ${WARN_COUNT} warnings, ${HOTSPOT_COUNT} hotspots${NC}"

# Exit with error code if errors were found
if [[ ${ERROR_COUNT} -gt 0 ]]; then
    exit 1
fi

exit 0
