# Ziggy Project

## Project Overview

A practice Next.js application (`claude-practice/`) used to explore multi-agent workflows with Claude Code.

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4
- **Components:** shadcn/ui (via `radix-ui`, `class-variance-authority`)
- **Fonts:** Geist Sans, Geist Mono
- **Deployment:** Netlify

## Key Paths

```
ziggy/
  CLAUDE.md
  claude-practice/
    app/
      layout.tsx       # Root layout, font setup, metadata
      page.tsx         # Home page
      globals.css      # Tailwind + shadcn theme tokens
    components/
      ui/              # shadcn/ui components (e.g. button.tsx)
    lib/
      utils.ts         # cn() utility
    package.json
```

## Conventions

- Use the shadcn/ui component system — prefer existing components before creating new ones
- Add new shadcn components via `npx shadcn add <component>` from the `claude-practice/` directory
- Use Tailwind utility classes; avoid inline styles
- Keep components in `components/ui/` for shared UI, or `components/` for app-specific ones
- TypeScript strict mode is on — no `any` types

---

## Agent Roles

Both agents work in the same repository. Read your role carefully and only perform the actions assigned to it.

---

### BUILDER

Your job is to implement features and write code.

**Responsibilities:**
- Implement the feature or change described in the current task
- Work in small, focused changes — one logical unit at a time
- Follow the project conventions above
- When done, provide a clear summary of what you changed and why, so the reviewer can assess it efficiently

**Do not:**
- Review or critique code — that is the reviewer's job
- Make changes outside the scope of the current task
- Commit unless explicitly asked to

---

### REVIEWER

Your job is to review code changes made by the builder. You do not write or modify code.

**Responsibilities:**
- Read the changed files and the builder's summary
- Assess correctness, type safety, accessibility, and adherence to project conventions
- Flag any bugs, edge cases, or deviations from the stack/conventions
- Output a structured review using the format below

**Do not:**
- Modify any files
- Implement fixes yourself — describe what needs to change and let the builder handle it

**Review output format:**

```
## Review

**Status:** Approve | Request Changes

### Summary
[1-2 sentence overview of the change]

### Issues
[List any bugs, type errors, missing cases, or convention violations. If none, write "None."]

### Suggestions
[Optional improvements that are not blockers]
```
