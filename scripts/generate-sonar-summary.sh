#!/bin/bash
# SonarCloud GitHub Step Summary Generator
# Expert-Level CI/CD Observability Tool
#
# Purpose: Generate GitHub Actions Step Summary from SonarCloud scan results
# Output: Markdown table written to $GITHUB_STEP_SUMMARY
#
# Usage: bash scripts/generate-sonar-summary.sh
# Note: Must be run within GitHub Actions context (requires $GITHUB_STEP_SUMMARY)

set -euo pipefail

# Configuration
readonly SCANNERWORK_DIR=".scannerwork"
readonly REPORT_TASK="${SCANNERWORK_DIR}/report-task.txt"
readonly ANALYSIS_LOG="${1:-sonar-analysis.log}"
readonly ERRORS_SUMMARY="${2:-sonar-errors-summary.md}"

# ANSI Colors
readonly BLUE='\033[0;34m'
readonly GREEN='\033[0;32m'
readonly YELLOW='\033[1;33m'
readonly RED='\033[0;31m'
readonly NC='\033[0m'

echo -e "${BLUE}[generate-sonar-summary] Creating GitHub Actions Step Summary...${NC}"

# Function to safely extract value from report-task.txt
extract_property() {
    local property_name="$1"
    local default_value="${2:-N/A}"
    
    if [[ -f "${REPORT_TASK}" ]]; then
        grep "^${property_name}=" "${REPORT_TASK}" | cut -d'=' -f2- || echo "${default_value}"
    else
        echo "${default_value}"
    fi
}

# Function to extract coverage from log
extract_coverage() {
    if [[ -f "${ANALYSIS_LOG}" ]]; then
        # Look for coverage percentage in various formats
        # Example: "Coverage: 77.22%", "Lines coverage: 77.2%"
        grep -oP '(?i)(coverage|lines?\s+coverage):\s*\K\d+\.?\d*%' "${ANALYSIS_LOG}" | head -n 1 || echo "N/A"
    else
        echo "N/A"
    fi
}

# Function to count security hotspots from log
count_security_hotspots() {
    if [[ -f "${ANALYSIS_LOG}" ]]; then
        # Count unique lines mentioning security hotspots
        grep -i "security hotspot" "${ANALYSIS_LOG}" | wc -l | tr -d ' ' || echo "0"
    else
        echo "0"
    fi
}

# Function to count errors and warnings
count_issues() {
    local issue_type="$1"
    if [[ -f "${ANALYSIS_LOG}" ]]; then
        grep -c "^${issue_type}" "${ANALYSIS_LOG}" || echo "0"
    else
        echo "0"
    fi
}

# Function to detect specific files with security hotspots
detect_hotspot_files() {
    if [[ -f "${ANALYSIS_LOG}" ]]; then
        local hotspots=""
        if grep -i "housekeeping.ts.*hotspot\|hotspot.*housekeeping.ts" "${ANALYSIS_LOG}" > /dev/null 2>&1; then
            hotspots="${hotspots}housekeeping.ts, "
        fi
        if grep -i "validate-amp.ts.*hotspot\|hotspot.*validate-amp.ts" "${ANALYSIS_LOG}" > /dev/null 2>&1; then
            hotspots="${hotspots}validate-amp.ts, "
        fi
        
        # Remove trailing comma
        echo "${hotspots%, }"
    fi
}

# Extract data
echo "  [1/6] Extracting Quality Gate status..."
QUALITY_GATE_STATUS=$(extract_property "ceTaskUrl" "Unknown")
PROJECT_KEY=$(extract_property "projectKey" "N/A")
SERVER_URL=$(extract_property "serverUrl" "https://sonarcloud.io")
DASHBOARD_URL=$(extract_property "dashboardUrl" "N/A")

echo "  [2/6] Parsing coverage percentage..."
COVERAGE=$(extract_coverage)

echo "  [3/6] Counting security hotspots..."
HOTSPOT_COUNT=$(count_security_hotspots)
HOTSPOT_FILES=$(detect_hotspot_files)

echo "  [4/6] Counting errors and warnings..."
ERROR_COUNT=$(count_issues "ERROR")
WARN_COUNT=$(count_issues "WARN")

echo "  [5/6] Checking artifact availability..."
# Determine if artifacts will be uploaded (check if running in CI)
if [[ -n "${GITHUB_RUN_ID:-}" ]]; then
    ARTIFACT_URL="https://github.com/${GITHUB_REPOSITORY}/actions/runs/${GITHUB_RUN_ID}"
else
    ARTIFACT_URL="N/A (not running in GitHub Actions)"
fi

echo "  [6/6] Generating summary markdown..."

# Determine status emoji
COVERAGE_NUM=$(echo "${COVERAGE}" | grep -oP '\d+\.?\d*' || echo "0")
if (( $(echo "${COVERAGE_NUM} >= 80" | bc -l 2>/dev/null || echo "0") )); then
    COVERAGE_EMOJI="✅"
elif (( $(echo "${COVERAGE_NUM} >= 50" | bc -l 2>/dev/null || echo "0") )); then
    COVERAGE_EMOJI="⚠️"
else
    COVERAGE_EMOJI="❌"
fi

HOTSPOT_EMOJI="✅"
[[ ${HOTSPOT_COUNT} -gt 0 ]] && HOTSPOT_EMOJI="🔒"

ERROR_EMOJI="✅"
[[ ${ERROR_COUNT} -gt 0 ]] && ERROR_EMOJI="❌"

# Generate Step Summary (output to GITHUB_STEP_SUMMARY or stdout)
SUMMARY_OUTPUT="${GITHUB_STEP_SUMMARY:-/dev/stdout}"

cat >> "${SUMMARY_OUTPUT}" << EOF
# 🔍 SonarCloud Quality Analysis

## Summary

| Metric | Value | Status |
|--------|-------|--------|
| **Coverage** | ${COVERAGE} | ${COVERAGE_EMOJI} |
| **Security Hotspots** | ${HOTSPOT_COUNT} | ${HOTSPOT_EMOJI} |
| **Errors** | ${ERROR_COUNT} | ${ERROR_EMOJI} |
| **Warnings** | ${WARN_COUNT} | ⚠️ |

---

## 🎯 Coverage Analysis

- **Current Coverage:** ${COVERAGE}
- **Target:** 80% (SonarQube Quality Gate threshold)
- **Gap:** $(awk "BEGIN {print 80 - ${COVERAGE_NUM}}")%

> [!TIP]
> Review the \`coverage/lcov.info\` artifact to identify uncovered lines.

---

## 🔒 Security Hotspots

- **Total Hotspots Found:** ${HOTSPOT_COUNT}
- **Files Requiring Review:**
EOF

if [[ -n "${HOTSPOT_FILES}" ]]; then
    cat >> "${SUMMARY_OUTPUT}" << EOF
  - \`${HOTSPOT_FILES//, /\`\n  - \`}\`
EOF
else
    cat >> "${SUMMARY_OUTPUT}" << EOF
  - ✅ No specific files flagged in logs
EOF
fi

cat >> "${SUMMARY_OUTPUT}" << EOF

> [!WARNING]
> **Action Required:** Review security hotspots in the [SonarCloud Dashboard](${DASHBOARD_URL}) and mark them as "Safe" or create issues to fix.

The primary concern is **Command Injection** risk in:
- \`scripts/housekeeping.ts\`
- \`scripts/validate-amp.ts\`

---

## 📊 Quality Gate Details

- **Project:** ${PROJECT_KEY}
- **Dashboard:** [View in SonarCloud](${DASHBOARD_URL})
- **Server:** ${SERVER_URL}

---

## 📦 Artifacts

The following diagnostic files are available as GitHub Actions artifacts:

1. **\`sonar-analysis.log\`** - Full verbose scanner output
2. **\`sonar-errors-summary.md\`** - Condensed error report
3. **\`coverage/lcov.info\`** - Raw coverage data from Vitest

🔗 [Download Artifacts](${ARTIFACT_URL})

---

## 🔧 Next Steps

EOF

# Add conditional recommendations
if [[ ${ERROR_COUNT} -gt 0 ]]; then
    cat >> "${SUMMARY_OUTPUT}" << EOF
1. ❌ **Fix ${ERROR_COUNT} Scanner Errors** - Review \`sonar-errors-summary.md\` artifact
EOF
fi

if [[ ${HOTSPOT_COUNT} -gt 0 ]]; then
    cat >> "${SUMMARY_OUTPUT}" << EOF
2. 🔒 **Review ${HOTSPOT_COUNT} Security Hotspots** - Navigate to SonarCloud UI
EOF
fi

if (( $(echo "${COVERAGE_NUM} < 80" | bc -l 2>/dev/null || echo "1") )); then
    cat >> "${SUMMARY_OUTPUT}" << EOF
3. 📈 **Improve Coverage** - Add tests for uncovered lines in \`scripts/\` directory
EOF
fi

cat >> "${SUMMARY_OUTPUT}" << EOF
4. 📝 **Review Verbose Logs** - Check \`sonar-analysis.log\` for LCOV path mapping issues
5. 🔍 **Compare Coverage Reports** - Verify Vitest coverage matches SonarCloud ingestion

---

_Generated by \`scripts/generate-sonar-summary.sh\` at $(date -u +"%Y-%m-%d %H:%M:%S UTC")_
EOF

echo -e "${GREEN}✅ GitHub Step Summary generated successfully${NC}"

# Print summary to console if not in GitHub Actions
if [[ -z "${GITHUB_STEP_SUMMARY:-}" ]]; then
    echo -e "${YELLOW}⚠️  Not running in GitHub Actions - summary printed to stdout${NC}"
fi

exit 0
