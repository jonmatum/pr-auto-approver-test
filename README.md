# pr-auto-approver-test

Test repository for the [pr-auto-approver](https://github.com/jonmatum/pr-auto-approver) bot — a GitHub App that auto-approves PRs with optional AI code review powered by Amazon Bedrock.

## How It Works

```
Open PR → Bot reviews code with Claude 3.5 Haiku → Approve ✅ or Request Changes ❌
```

- **Clean code** → approved by `jonmatumdev` (satisfies branch protection) → merge
- **Issues found** → inline review comments on exact lines → fix → push → re-review → approve

## Test Scenarios

This repo contains code across multiple technologies:

| Directory | Language | What's Inside |
|-----------|----------|---------------|
| `python/` | Python | Flask API with auth |
| `node/` | Node.js | Express server with security middleware |
| `terraform/` | HCL | AWS S3 bucket with encryption |
| `go/` | Go | HTTP health check server |

## Try It

1. Create a branch: `git checkout -b feat/my-test`
2. Add or modify code
3. Open a PR against `main`
4. Watch the bot review your code in ~10 seconds

## What the Bot Catches

- 🔑 Hardcoded secrets, API keys, passwords
- 💉 SQL/NoSQL injection, command injection
- 🔓 Weak authentication (== instead of bcrypt.compare)
- 📤 Sensitive data in API responses
- 💥 Null/undefined crashes
- 🔐 Weak cryptography

## Related

- [pr-auto-approver](https://github.com/jonmatum/pr-auto-approver) — Bot source code (TypeScript)
- [terraform-aws-pr-auto-approver](https://github.com/jonmatum/terraform-aws-pr-auto-approver) — Terraform module
