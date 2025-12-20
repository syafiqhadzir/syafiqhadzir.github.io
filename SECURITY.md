# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 2.x     | :white_check_mark: |
| < 2.0   | :x:                |

## Reporting a Vulnerability

If you discover a security vulnerability, please report it responsibly:

1. **Do NOT** open a public GitHub issue
2. Email: [syafiqhadzir@live.com.my](mailto:syafiqhadzir@live.com.my)
3. Include:
   - Description of the vulnerability
   - Steps to reproduce
   - Potential impact
   - Suggested fix (if any)

## Response Timeline

- **Acknowledgment**: Within 48 hours
- **Initial Assessment**: Within 7 days
- **Resolution**: Depends on severity

## Security Measures

This project implements the following security practices:

### Content Security Policy
- Strict CSP headers in `_headers` file
- Restricted script sources to AMP CDN only

### Dependency Management
- Automated updates via Dependabot
- Security overrides for known vulnerabilities
- Regular `npm audit` checks in CI

### CI/CD Security
- All secrets managed via GitHub Secrets
- No hardcoded credentials
- Minimal permissions in workflows

## Known Security Considerations

- **AMP Runtime**: Third-party scripts from `cdn.ampproject.org` are required
- **Google Analytics**: Data sent to Google for analytics purposes

## Recognition

Security researchers who responsibly disclose vulnerabilities will be acknowledged in this file (with permission).

---

Thank you for helping keep this project secure! 🔒
