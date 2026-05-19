# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Status

Active development. Full-stack monorepo — React/Vite client + Express/Node server.

## Commands

- `npm run dev` — start both client (`:5173`) and server (`:3001`) via concurrently
- `npm run build` — build client and server

Run from the repo root for all commands.

## Architecture

```
/client   React 18 + Vite + TypeScript + Tailwind CSS
/server   Express + TypeScript (ts-node-dev in dev)
```

**Data flow:** Upload (multer) → fileExtractor (pdf-parse / mammoth) → Claude API (claudeParser) → EditForm (React state) → generate route (Puppeteer PDF / docx) → download

**Client state:** Single `ResumeData` useState in App.tsx passed as props — no external state lib.

**ATS scoring:** Pure client-side heuristics in `useAtsScore.ts` (no API calls).

## Key conventions

- `ResumeData` canonical type lives in `client/src/types/resume.ts`
- Server mirrors the same type inline (no shared package)
- Tailwind utility classes throughout; no CSS modules
- Claude model: `claude-sonnet-4-20250514`
- PDF generation: Puppeteer (headless Chrome) — server-side only
- DOCX generation: `docx` npm package — server-side only
- `.env` lives at repo root; server loads it via dotenv with `path: ../../.env`

# CLAUDE.md

Behavioral guidelines to reduce common LLM coding mistakes. Merge with project-specific instructions as needed.

**Tradeoff:** These guidelines bias toward caution over speed. For trivial tasks, use judgment.

## 1. Think Before Coding

**Don't assume. Don't hide confusion. Surface tradeoffs.**

Before implementing:
- State your assumptions explicitly. If uncertain, ask.
- If multiple interpretations exist, present them - don't pick silently.
- If a simpler approach exists, say so. Push back when warranted.
- If something is unclear, stop. Name what's confusing. Ask.

## 2. Simplicity First

**Minimum code that solves the problem. Nothing speculative.**

- No features beyond what was asked.
- No abstractions for single-use code.
- No "flexibility" or "configurability" that wasn't requested.
- No error handling for impossible scenarios.
- If you write 200 lines and it could be 50, rewrite it.

Ask yourself: "Would a senior engineer say this is overcomplicated?" If yes, simplify.

## 3. Surgical Changes

**Touch only what you must. Clean up only your own mess.**

When editing existing code:
- Don't "improve" adjacent code, comments, or formatting.
- Don't refactor things that aren't broken.
- Match existing style, even if you'd do it differently.
- If you notice unrelated dead code, mention it - don't delete it.

When your changes create orphans:
- Remove imports/variables/functions that YOUR changes made unused.
- Don't remove pre-existing dead code unless asked.

The test: Every changed line should trace directly to the user's request.

## 4. Goal-Driven Execution

**Define success criteria. Loop until verified.**

Transform tasks into verifiable goals:
- "Add validation" → "Write tests for invalid inputs, then make them pass"
- "Fix the bug" → "Write a test that reproduces it, then make it pass"
- "Refactor X" → "Ensure tests pass before and after"

For multi-step tasks, state a brief plan:
```
1. [Step] → verify: [check]
2. [Step] → verify: [check]
3. [Step] → verify: [check]
```

Strong success criteria let you loop independently. Weak criteria ("make it work") require constant clarification.

---

**These guidelines are working if:** fewer unnecessary changes in diffs, fewer rewrites due to overcomplication, and clarifying questions come before implementation rather than after mistakes.
