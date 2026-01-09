# UniVerse Project Rules

These are project-specific rules for the AI assistant working on this codebase.

---

## 📝 Changelog Requirement

**IMPORTANT**: After completing any task that involves code changes, the AI assistant MUST update the `CHANGELOG.md` file in the project root.

### Changelog Format

```markdown
### Added

- **YYYY-MM-DD**: Description of new feature/file

### Changed

- **YYYY-MM-DD**: Description of update

### Fixed

- **YYYY-MM-DD**: Description of bug fix

### Removed

- **YYYY-MM-DD**: Description of deleted item
```

### What to Log

| Action                | Category |
| --------------------- | -------- |
| New file created      | Added    |
| New feature/component | Added    |
| Dependency installed  | Added    |
| Code modified         | Changed  |
| Configuration updated | Changed  |
| Bug fix               | Fixed    |
| Error correction      | Fixed    |
| File deleted          | Removed  |
| Feature deprecated    | Removed  |

---

## 📁 Folder Structure

Refer to:

- `universe-client/src/FOLDER_STRUCTURE.md`
- `universe-server/FOLDER_STRUCTURE.md`

---

## 🛠️ Tech Stack

- **Frontend**: React 19, Vite, Tailwind CSS, Framer Motion, React Three Fiber
- **Backend**: Node.js, Express 5, MongoDB, Mongoose
- **Dev Tools**: ESLint, Nodemon

---

## 🤖 AI Assistant Instructions

When making changes to this project:

1. **Always log changes** to `CHANGELOG.md` after completing tasks
2. **Follow folder structure** - place files in correct directories
3. **Use existing patterns** - match coding style of existing files
4. **Test after changes** - run `npm run dev` to verify no errors
5. **Keep controllers thin** - business logic goes in `/services`
6. **Validate input** - use `/validators` for request validation
