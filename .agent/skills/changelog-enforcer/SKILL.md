---
name: changelog-enforcer
description: Enforce changelog hygiene for Codex CLI work. Use when code, config, or deployment behavior is changed and the update must be recorded in CHANGELOG.md before completion.
---

# Changelog Enforcer

Update `CHANGELOG.md` in the same task whenever you change repository files.

## Workflow

1. Identify all code or config changes made in the task.
2. Add a new dated section if the date does not exist yet.
3. Append concise bullets under `Added`, `Changed`, or `Fixed`.
4. Mention concrete impact, not just file names.
5. Keep entries factual and implementation-focused.
6. Avoid duplicating existing bullets.
7. Skip changelog updates only when no files were modified.

## Entry Rules

- Use ISO date headers like `## [YYYY-MM-DD]` when needed.
- Prefer action-first bullets: "Fixed ...", "Added ...", "Changed ...".
- Include deployment/config changes that affect runtime behavior.
- Include safeguards or migration notes if behavior changed in production.
