# Contributing Guide

Thanks for your interest in contributing! Having other people willing to contribute really gives me some motivation with this project.

This project uses **TypeScript**, **Vitest**, **ESLint**, and **GitHub Actions** for CI.  
We keep the `main` (or `stable`) branch always in a working, release-ready state.

---

## 📦 Development Workflow

1. **Fork & Clone**
   ```bash
   git clone https://github.com/cxgdev/scorekeeper.git
   cd scorekeeper
   npm install
   ```

2. **Create a Feature Branch**
   - Name your branch based on what you’re doing:
     - `feature/...` → new features
     - `fix/...` → bug fixes
     - `refactor/...` → code structure changes
     - `chore/...` → tooling/config updates
   ```bash
   git checkout -b feature/my-new-feature
   ```

3. **Make Your Changes**
   - Write code in `src/`
   - If possible, add **unit tests** in `test/unit/`
   - Keep **integration tests** in `test/integration/` (these require real hardware and are not run in CI)

4. **Run Checks Locally**
   ```bash
   npm run lint        # Lint for style & common issues
   npm run typecheck   # TypeScript type checking
   npm run test:unit   # Unit tests only
   ```
   > Integration tests: `npm run test:int` (requires hardware)

5. **Commit & Push**
   ```bash
   git add .
   git commit -m "feat: describe your change"
   git push -u origin feature/my-new-feature
   ```

6. **Open a Pull Request**
   - PR from your feature branch → `main`
   - CI will run lint, typecheck, and unit tests
   - Once CI passes, you can merge

---

## 🧪 Testing

- **Unit tests** (`test/unit/**`)  
  - Run in CI  
  - Should not require hardware

- **Integration tests** (`test/integration/**`)  
  - Require a connected controller  
  - Skipped in CI  
  - Run locally before merging if your change affects hardware interaction

---

## 📝 Commit Message Conventions

Use short, descriptive commit messages.  
Format:
```
<type>: <description>
```
Types:
- `feat:` → new feature
- `fix:` → bug fix
- `refactor:` → code restructure (no behavior change)
- `chore:` → tooling/config change

Example:
```
feat: add typed BooleanField events
fix: correct index offset in Sport.updateFields
```

---

## 📦 Releasing

If you have permission to release:
- Merge PRs into `main`
- Create a **GitHub Release** with a new version tag (`vX.Y.Z`)
- CI will publish to npm automatically (if configured)

---

Happy coding! 🎯
