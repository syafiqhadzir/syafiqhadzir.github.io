# Branch Protection Rules

This document describes the recommended branch protection settings for the `main` branch.

## Required Settings

### Pull Request Reviews

- [x] Require pull request reviews before merging
- [x] Require 1 approval
- [x] Dismiss stale reviews when new commits are pushed
- [x] Require review from Code Owners

### Status Checks

- [x] Require status checks to pass before merging
- [x] Require branches to be up to date before merging

**Required checks:**

| Check       | Workflow            |
| ----------- | ------------------- |
| `build`     | `pr-validation.yml` |
| `lint`      | `pr-validation.yml` |
| `typecheck` | `pr-validation.yml` |
| `test`      | `pr-validation.yml` |

### Restrictions

- [x] Do not allow bypassing the above settings
- [x] Restrict who can push to matching branches
- [ ] Allow force pushes (disabled)
- [ ] Allow deletions (disabled)

## How to Configure

1. Go to **Settings** → **Branches**
2. Click **Add branch protection rule**
3. Enter `main` as the branch name pattern
4. Configure settings as described above
5. Click **Create** or **Save changes**

## Automation

Consider adding a GitHub Actions workflow to verify PR titles follow conventional commits:

```yaml
# Already covered by commitlint in this repo
```

## Related

- [CODEOWNERS](./CODEOWNERS) - Defines code review ownership
- [pr-validation.yml](./workflows/pr-validation.yml) - PR status checks
