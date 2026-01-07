# 🛡️ Security Policy

## Supported Versions

Only the latest `main` branch and the latest production deployment are currently supported with
security updates.

|      Version      | Supported |
| :---------------: | :-------: |
|       Main        |    ✅     |
| Production (`v*`) |    ✅     |
|    Older Tags     |    ❌     |

## 🐛 Reporting a Vulnerability

We take security seriously. If you discover a vulnerability, please follow these steps:

1.  **Do NOT open a public issue.** This gives potential attackers a window to exploit the
    vulnerability before a fix is ready.
2.  **Email** the details to [syafiqhadzir@live.com.my](mailto:syafiqhadzir@live.com.my).
3.  Include as much detail as possible:
    - Description of the vulnerability.
    - Steps to reproduce.
    - Potential impact.
    - Any Proof of Concept (PoC) code.

### Response Timeline

- **Acknowledgment:** We will acknowledge your report within 48 hours.
- **Assessment:** We will assess the severity and impact within 1 week.
- **Resolution:** We aim to release a fix for critical vulnerabilities within 2 weeks of assessment.

## 🔐 Security Measures

This project implements several security best practices:

- **Content Security Policy (CSP):** Strictly enforced headers in `_headers`.
- **Dependency Scanning:** `npm audit` and Snyk/SonarCloud analysis.
- **Static Analysis:** `eslint-plugin-security` to detect unsafe code patterns.
- **XSS Protection:** Output escaping in Nunjucks templates.
- **Permissions Policy:** Restricting browser features (camera, mic, etc.).

## 🚫 Out of Scope

The following are generally strictly out of scope:

- Attacks requiring physical access to the user's device.
- Social engineering attacks against users.
- Denial of Service (DoS) attacks (mitigated by Cloudflare).

Thank you for helping keep our project safe!
