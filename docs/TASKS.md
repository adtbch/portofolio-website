# Task Cards — Portofolio Adit

> Sumber kebenaran untuk subagent. Satu card = satu branch = satu PR.
> Baseline (FASE 0) sudah selesai: scaffold Next.js 16 + TS + Tailwind v4 + deps + kontrak tipe + SQL schema.

## Aturan umum (berlaku semua card)

- **Baca dulu**: `src/types/index.ts`, `src/config/site.ts`, `supabase/migrations/0001_init.sql`.
- **Verify wajib** sebelum lapor selesai:
  ```bash
  npx tsc --noEmit
  npm run build
  ```
  Kalau gagal → perbaiki sendiri, jangan lapor selesai.
- **Jangan** tambah dependency baru tanpa alasan di card.
- **Jangan** sentuh file di luar `Scope`.
- **Jangan** hardcode secret. Baca dari `process.env.*` sesuai `.env.example`.

---

## CARD 1 — Supabase Client & Data Layer

**Branch**: `feat/data-layer`
**Depends on**: —

**Scope** (boleh disentuh):
- `src/lib/supabase/*.ts`
- `src/lib/queries.ts` (baru)
- `src/types/index.ts` (hanya jika perlu tambah tipe, jangan ubah yang ada)

**Input**: `supabase/migrations/0001_init.sql`, `src/types/index.ts`

**Kerjakan**:
1. `src/lib/queries.ts` — fungsi read-only: `getProjects()`, `getFeaturedProjects()`, `getProjectBySlug(slug)`, `getExperiences()`, `getEducation()`, `getSkills()`, `getSocials()`, `getSiteSettings()`. Semua filter `published = true` + `order('sort_order')`.
2. Fungsi return `Promise<T[]>` bertipe dari `src/types`.
3. Handle error: return `[]` + `console.error`, jangan throw ke page.

**Acceptance**:
- `npx tsc --noEmit` bersih
- Tidak ada `any`
- Setiap fungsi punya tipe return eksplisit

**Out of scope**: UI, server action, admin.

---

## CARD 2 — Layout & Design System

**Branch**: `feat/layout`
**Depends on**: —

**Scope**:
- `src/app/globals.css`
- `src/app/layout.tsx`
- `src/components/layout/{container,header,footer}.tsx`
- `src/components/shared/section-heading.tsx`

**Input**: token warna & typography di `D:\Hermes\Obsidian\01_Projects\Portofolio\00_PRD_Portofolio.md` §3, `src/config/fonts.ts`, `src/config/site.ts`

**Kerjakan**:
1. `globals.css`: CSS variables dark-only (`--background:#0f0f0f`, `--surface:#151515`, `--foreground:#f5f5f7`, `--muted-foreground:#a1a1aa`, `--border:#2a2a2a`, `--accent:#22d3ee`), mapping ke `@theme inline`. Hapus `prefers-color-scheme` block.
2. `layout.tsx`: pakai 3 font dari `config/fonts.ts`, metadata dari `siteConfig`, `lang="id"`.
3. `Header`: nav dari `siteConfig.nav`, sticky, mobile menu (CSS-only atau minimal state).
4. `Footer`: copyright + socials (hardcode dulu dari `config/site.ts`).
5. `SectionHeading`: props `{ index?: string; title: string; description?: string }`.

**Acceptance**:
- Build sukses
- Dark background konsisten, tidak ada white flash
- Header bisa dipakai di 375px tanpa overflow

**Out of scope**: section konten, animasi berat.

---

## CARD 3 — Hero + Skills + About

**Branch**: `feat/sections-top`
**Depends on**: CARD 1 (tipe query), CARD 2 (layout)

**Scope**:
- `src/components/sections/{hero,skills,about}.tsx`
- `src/components/shared/{tech-badge,status-badge}.tsx`
- `src/app/page.tsx` (susun 3 section ini saja)

**Input**: CARD 1 query functions, design token

**Kerjakan**:
1. `Hero`: nama, role, bio, status badge ("Available for work"), 2 CTA (Lihat Portofolio → `#works`, Resume → `siteConfig`), foto opsional.
2. `Skills`: group badge per `SkillGroup`, baca dari `getSkills()`.
3. `About`: 2 kolom (teks + foto), cerita singkat backend + embedded.
4. Semua Server Component. `'use client'` hanya kalau ada interaksi nyata.

**Acceptance**:
- `npm run build` sukses
- Empty state kalau data kosong (jangan crash)
- Semantic HTML (`<section>`, heading hierarki benar)

**Out of scope**: Featured Works, Experience, Contact.

---

## CARD 4 — Featured Works + Project Card

**Branch**: `feat/works`
**Depends on**: CARD 1, CARD 2

**Scope**:
- `src/components/sections/featured-works.tsx`
- `src/components/shared/project-card.tsx`
- `next.config.ts` (tambah `images.remotePatterns` untuk `res.cloudinary.com`)

**Kerjakan**:
1. Grid dari `getFeaturedProjects()` — 2 kolom desktop, 1 kolom mobile.
2. `ProjectCard`: cover (`next/image`, fallback kalau null), title, subtitle, tech badges, link detail.
3. Empty state: "Belum ada project." kalau array kosong.

**Acceptance**:
- Build sukses
- `next/image` dipakai, tidak ada `<img>` mentah
- Card tidak layout-shift saat image load (pakai `sizes` + aspect ratio)

**Out of scope**: halaman detail.

---

## CARD 5 — Experience + Contact Form

**Branch**: `feat/experience-contact`
**Depends on**: CARD 1, CARD 2

**Scope**:
- `src/components/sections/{experience,contact}.tsx`
- `src/components/forms/contact-form.tsx`
- `src/app/actions/contact.ts` (baru)
- `src/lib/validations/contact.ts` (sudah ada, boleh diperbaiki)

**Kerjakan**:
1. `Experience`: timeline dari `getExperiences()`, format `MMM yyyy — Sekarang` kalau `end_date` null.
2. `contact.ts`: server action, `"use server"`, validasi `contactSchema`, honeypot `website` harus kosong, insert ke `contact_messages` via server client, return `{ ok, message }`.
3. `ContactForm`: `use client`, react-hook-form + zodResolver, `useTransition`, toast via `sonner`.
4. Rate limit: minimal 1 pesan per IP per 60 detik — simpelnya cek `contact_messages` count by `ip_address` dalam 1 menit terakhir (best-effort, ponytail comment).

**Acceptance**:
- Build sukses
- Submit kosong → error inline, bukan toast
- Honeypot terisi → gagal silent
- `SUPABASE_SERVICE_ROLE_KEY` tidak dipakai di client bundle

**Out of scope**: admin inbox pesan.

---

## CARD 6 — Project Detail Page

**Branch**: `feat/project-detail`
**Depends on**: CARD 1, CARD 4

**Scope**:
- `src/app/projects/[slug]/page.tsx`
- `src/app/projects/[slug]/not-found.tsx`

**Kerjakan**:
1. `generateStaticParams` dari published projects.
2. `generateMetadata` — title, description, OG image dari `cover_image_url`.
3. Render: back link, title, subtitle, category, tahun, cover, tech badges, challenge, solution, gallery, tombol Live Demo + Repository (kondisional).
4. `notFound()` kalau slug tidak ada / `published = false`.

**Acceptance**:
- Build sukses dan slug ter-generate
- Link eksternal `target="_blank" rel="noopener noreferrer"`
- 404 page ada

**Out of scope**: comment, related projects.

---

## CARD 7 — SEO + Analytics

**Branch**: `feat/seo`
**Depends on**: CARD 3–6

**Scope**:
- `src/app/sitemap.ts`, `src/app/robots.ts`
- `src/app/opengraph-image.tsx`
- `src/app/layout.tsx` (JSON-LD)
- `src/app/(site)/layout.tsx` atau `layout.tsx` (Analytics)

**Kerjakan**:
1. `sitemap.ts`: home + semua project slug.
2. `robots.ts`: allow all, sitemap URL dari `siteConfig.url`.
3. JSON-LD `Person` (name, jobTitle, url, sameAs dari socials).
4. `@vercel/analytics` — `<Analytics />` di root layout.

**Acceptance**:
- `/sitemap.xml` dan `/robots.txt` resolve saat `npm run start`
- JSON-LD valid (test di validator.schema.org manual)

**Out of scope**: GA4, Search Console.

---

## CARD 8 — QA Pass

**Branch**: `fix/qa`
**Depends on**: semua

**Scope**: seluruh `src/`, `package.json` (hanya script)

**Kerjakan**:
1. Responsive check 375 / 768 / 1024 / 1280 (pakai DevTools).
2. Focus visible semua elemen interaktif.
3. Lighthouse mobile ≥ 90 (Performance, Accessibility, Best Practices, SEO).
4. `grep -rn "any" src/` → hilangkan yang tidak perlu.
5. Pastikan tidak ada `console.log` tersisa.

**Acceptance**: semua di atas lulus, screenshot/laporan ditempel di PR body.

---

## CARD 9 — Deploy Vercel

**Branch**: — (langsung main)

**Kerjakan**:
1. Push repo ke GitHub.
2. Import di vercel.com/new.
3. Set env vars (Production + Preview): lihat `.env.example`.
4. Deploy, cek build log.
5. Test production URL: home, 1 project detail, contact form.

**Acceptance**: URL production hidup, form submit masuk ke Supabase.
