# TODO Deployment & Admin Panel — Portofolio Adit

> Sisa pekerjaan berdasarkan keputusan user:
> - **Prisma ORM**: Skip (tetap gunakan Supabase-js direct query agar lebih ringan).
> - **Admin Panel**: Ya, buatkan halaman admin sederhana (auth sederhana + CRUD projects/experiences/skills) di dalam project Next.js.

## Audit Keamanan (Prof-Volt) — **SEBELUM DEPLOY WAJIB DIPERBAIKI**
- [x] **CRITICAL**: Fallback password hardcoded `"admin123"` di `src/app/api/admin/auth/route.ts:7`. Hapus fallback, wajib `ADMIN_PASSWORD` di env.
- [x] **CRITICAL**: Server Actions CRUD (projects/experiences/skills) **tidak ada auth check**. Siapa pun bisa call action langsung.
- [x] **HIGH**: Tidak ada middleware/route-level protection. Hanya per-page redirect di dashboard/projects/experiences/skills; layout hanya UI gating.
- [x] **HIGH**: `createServerSupabase(useServiceRole=true)` fallback ke anon key jika service role missing — harus fail-fast.
- [x] **HIGH**: Cookie `admin_session=authenticated` statis tanpa signing/HMAC; mudah dipalsukan.

## Task 1: Supabase Schema & Data Setup (Manual di Supabase)
- [ ] Jalankan SQL migration `supabase/migrations/0001_init.sql` di Supabase SQL Editor.
- [ ] Pastikan tabel (`projects`, `experiences`, `skills`, `certificates`, `socials`, dll.) sudah siap.
- [ ] Input data awal (minimal 2 projects, beberapa skills, dan pengalaman kerja) langsung di Supabase Table Editor.

## Task 2: Admin Panel Hardening (Bot: DevHermes)
- [ ] **Auth API**: Hapus fallback `"admin123"`; return 500 jika `ADMIN_PASSWORD` tidak diset.
- [ ] **Server Actions Auth**: Tambah cek cookie `admin_session===authenticated` di **setiap** server action (`handleSave`, `handleDelete`) di projects/experiences/skills.
- [ ] **Route Protection**: Buat `middleware.ts` di root (atau `src/middleware.ts`) yang melindungi `/admin/:path*` kecuali `/admin/login`; redirect ke login jika cookie tidak valid.
- [ ] **Supabase Client**: Hapus fallback ke anon key di `createServerSupabase(true)`; throw jika `SUPABASE_SERVICE_ROLE_KEY` missing.
- [ ] **Cookie Signing (opsional tapi disarankan)**: Ganti nilai statis dengan JWT/HMAC singkat (mis. `jose` lib) atau setidaknya hash dengan secret env.
- [ ] **Verifikasi Build**: `npx tsc --noEmit --incremental false` && `npm run build` exit 0.

## Task 3: Admin Panel Implementation (Sudah ada, tapi butuh hardening di atas)
- [x] Route `/admin/login` (form password, cek env `ADMIN_PASSWORD`).
- [x] Dashboard `/admin` dengan redirect ke login.
- [x] CRUD Projects, Experiences, Skills (List + Form Add/Edit/Delete) menggunakan Server Actions.
- [x] Layout admin dengan header, nav, logout.

## Task 4: Verifikasi & Build Gate (Bot: Prof-Volt)
- [ ] Jalankan `npx tsc --noEmit --incremental false`
- [ ] Jalankan `npm run build`
- [ ] Perbaiki error jika ada.

## Task 5: Deployment ke Vercel
- [ ] Konfigurasi Environment Variables di Vercel (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `ADMIN_PASSWORD`, `SUPABASE_SERVICE_ROLE_KEY`, Cloudinary vars).
- [ ] Push ke repo GitHub `adtbch/portofolio-website`.
- [ ] Pastikan deployment sukses dan website bisa diakses secara publik.
