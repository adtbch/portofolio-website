# CHECKLIST UI POLISH (FASE 4)

Target: Siap dijalankan setelah data ter-seed (ORCH-02).

## 1. ORCH-04-EMPTY (Empty / Loading / Error States)
- [ ] Section Projects: Tampilkan state kosong (Belum ada proyek) jika data kosong.
- [ ] Section Experience: Tampilkan state kosong jika riwayat kosong.
- [ ] Section Skills: Tampilkan state kosong jika skill kosong.
- [ ] Admin Dashboard: Loading spinner standar, error message deskriptif dalam Bahasa Indonesia.
- [ ] Skeletons untuk komponen async saat fetching.

## 2. ORCH-04-RESP (Responsive QA)
- [ ] Mobile (375px): Cek overflow horizontal, ukuran font, padding section, touch targets min 48px.
- [ ] Tablet (768px): Grid 2 kolom, layout navigasi/hamburger menu.
- [ ] Laptop/Desktop (1024px / 1280px+): Max-width kontainer, spacing konsisten token Tailwind.

## 3. ORCH-04-A11Y (Accessibility & Anti-Slop)
- [ ] Navigasi keyboard (Focus ring jelas, tab order benar).
- [ ] Atribut `alt` pada semua gambar/avatar/project screenshot.
- [ ] Kontras warna teks vs background memenuhi standar WCAG AA.
- [ ] Hapus artefak "AI slop" (gradient berlebihan, glow berlebih, font tidak konsisten).

## 4. ORCH-04-COPY (Copywriting Bahasa Indonesia)
- [ ] Judul section, tombol, badge, dan empty state berbahasa Indonesia baku/profesional.
- [ ] Tidak ada terjemahan kaku / literal mesin.
- [ ] Konsistensi tone (Profesional, clean, tech-minimalist).
