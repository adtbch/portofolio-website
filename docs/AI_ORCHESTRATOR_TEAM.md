# AI Orchestrator Team — Portfolio Adit

## Operating mode

- Autonomous edit/commit/merge after gates pass.
- Stop only for secrets, Supabase/Cloudinary/Vercel actions, or ambiguous product decisions.
- Max 3 implementation agents in parallel.
- No agent edits another agent's scope.
- Every task: branch → implement → typecheck → build → review → merge.
- Placeholder content must use `TODO:` and be listed in the final handoff.

## Team

| Bot | Role | Output |
|---|---|---|
| Dave | PM / orchestrator planner | task cards, dependencies, acceptance criteria |
| DevHermes | implementation | working code in scoped branch |
| Morty | UI/UX reviewer | visual/accessibility findings + fixes proposal |
| Prof-Volt | code reviewer | defect/security/quality gate |
| Anton | usability tester | user-flow findings on running MVP |

## Task graph — MVP

```text
DONE: T01 contracts + Supabase schema
DONE: T02 data layer
DONE: T03 layout/design system
  ├── T04 Hero + About + Skills
  ├── T05 Featured Works + Project Card
  └── T06 Experience + Contact Form
T05 ──> T07 Project Detail
T04 + T05 + T06 + T07 ──> T08 SEO + Analytics
T08 ──> T09 QA responsive/accessibility/performance
T09 ──> T10 review + final build
```

## Task cards

### T04 — Hero, About, Skills
- Scope: `src/components/sections/hero.tsx`, `about.tsx`, `skills.tsx`, shared badges, `src/app/page.tsx` section wiring.
- Input: `siteConfig`, `getSkills`, design tokens, existing layout.
- Requirements: server components; semantic headings; empty skills state; TODO content only where missing; no fake URLs.
- Acceptance: responsive 375px; hero CTA points to `#works`/`#contact`; no overflow; `tsc` + `build` pass.

### T05 — Featured Works
- Scope: `featured-works.tsx`, `project-card.tsx`, `next.config.ts` image remote pattern.
- Input: `getFeaturedProjects`, `Project` type.
- Requirements: 2-col desktop/1-col mobile; `next/image`; fallback cover; tech badges; `/projects/[slug]` links; empty state.
- Acceptance: no raw `<img>`; stable aspect ratio; external links safe; `tsc` + `build` pass.

### T06 — Experience + Contact
- Scope: `experience.tsx`, `contact.tsx`, `contact-form.tsx`, `src/app/actions/contact.ts`.
- Input: zod schema, Supabase client, existing layout.
- Requirements: server action; validation; honeypot; insert-only RLS compatible; no service key in client; no API route.
- Acceptance: inline validation; success/error state; accessible labels; `tsc` + `build` pass.

### T07 — Project Detail
- Scope: `src/app/projects/[slug]/page.tsx`, `not-found.tsx`, optional project-specific shared component.
- Input: `getProjectBySlug`, `getProjects`, Project fields.
- Requirements: static params; metadata; cover/gallery; challenge/solution; conditional live/repo links; 404 unpublished/missing.
- Acceptance: build with empty DB; no crash; external links safe; `tsc` + `build` pass.

### T08 — SEO + Analytics
- Scope: sitemap, robots, OG image, JSON-LD, root analytics integration.
- Input: siteConfig/socials/project queries.
- Requirements: no secret; valid Person JSON-LD; Vercel Analytics only if dependency exists, otherwise add only `@vercel/analytics`.
- Acceptance: build; routes resolve; metadata has no placeholder secrets.

### T09 — QA
- Scope: all UI code, only minimal fixes.
- Checks: 375/768/1024/1280; keyboard focus; Lighthouse target ≥90; no `any`; no `console.log`; broken links; empty states.
- Output: `docs/QA_REPORT.md` with command results, findings, fixes, remaining TODO.

### T10 — Final gate
- Run `npx tsc --noEmit --incremental false`, `npm run build`, `git status --short`.
- Prof-Volt review first; Morty UI review; Anton usability review.
- Merge only when all blockers resolved.

## Agent prompt contract

Every implementation prompt must include: repo path, exact card, allowed files, dependencies, acceptance criteria, verification commands, and explicit out-of-scope. Agent must report files, tests, and TODOs.

## External blockers

- Run migration in Supabase SQL Editor.
- Fill `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`.
- Fill real portfolio content and social URLs.
- Deploy/Vercel credentials stay with Adit.
