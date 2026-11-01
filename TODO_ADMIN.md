# TODO Deployment & Admin Panel — Portofolio Adit

> Sisa pekerjaan berdasarkan keputusan user:
> - **Prisma ORM**: Skip (tetap gunakan Supabase-js direct query agar lebih ringan).
> - **Admin Panel**: Ya, buatkan halaman admin sederhana (auth sederhana + CRUD projects/experiences/skills) di dalam project Next.js.

## Task 1: Supabase Schema & Data Setup (Manual di Supabase)
- [ ] Jalankan SQL migration `supabase/migrations/0001_init.sql` di Supabase SQL Editor.
- [ ] Pastikan tabel (`projects`, `experiences`, `skills`, `certificates`, `socials`, dll.) sudah siap.
- [ ] Input data awal (minimal 2 projects, beberapa skills, dan pengalaman kerja) langsung di Supabase Table Editor.

## Task 2: Admin Panel Implementation (Bot: DevHermes & Morty)
- [ ] **Auth Sederhana**:
  - Buat route `/admin/login` dengan password sederhana (environment variable `ADMIN_PASSWORD` atau secret cookie).
  - Middleware / Route Protection untuk semua halaman `/admin/*`.
- [ ] **Dashboard / Layout Admin**:
  - Layout admin minimalis dengan sidebar/navbar untuk navigasi antar menu (Projects, Experiences, Skills, Certificates).
- [ ] **Halaman CRUD Projects (`/admin/projects`)**:
  - List semua projects dari Supabase.
  - Tombol tambah/edit/hapus project (Judul, slug, deskripsi, kategori, live_url, repo_url, featured, published).
- [ ] **Halaman CRUD Experiences (`/admin/experiences`)**:
  - List, tambah, edit, hapus pengalaman kerja/magang/organisasi.
- [ ] **Halaman CRUD Skills (`/admin/skills`)**:
  - List, tambah, edit, hapus skills dan grouping-nya.

## Task 3: Verifikasi & Build Gate (Bot: Prof-Volt)
- [ ] Jalankan `npx tsc --noEmit --incremental false`
- [ ] Jalankan `npm run build`
- [ ] Perbaiki error jika ada.

## Task 4: Deployment ke Vercel
- [ ] Konfigurasi Environment Variables di Vercel (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `ADMIN_PASSWORD`, Cloudinary vars).
- [ ] Push ke repo GitHub `adtbch/portofolio-website`.
- [ ] Pastikan deployment sukses dan website bisa diakses secara publik.
