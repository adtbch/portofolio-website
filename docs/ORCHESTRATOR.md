# Orchestrator Protocol — Portofolio Adit

> Cara menjalankan project ini dengan subagent. Baca bersama `docs/TASKS.md`.

## 1. Peran agent

| Agent | Tugas | Boleh edit kode? |
|---|---|---|
| `dave` | Pecah/refine task card, acceptance criteria | Tidak |
| `devhermes` | Implementasi card | Ya |
| `morty` | Review UI/UX + konsistensi design token | Tidak |
| `prof-volt` | Code review sebelum merge | Tidak |
| `anton` | Usability test hasil build | Tidak |

## 2. Alur per card

```
1. Ambil card dari docs/TASKS.md
2. git checkout -b <branch-dari-card>
3. Subagent implementasi (scope card saja)
4. Subagent jalankan: npx tsc --noEmit && npm run build
5. Kalau gagal → perbaiki di branch yang sama, JANGAN lapor selesai
6. prof-volt review diff (git diff main...HEAD)
7. Orchestrator verifikasi sendiri: git diff --stat, build ulang
8. Merge ke main → card ditandai [x]
```

## 3. Aturan paralel

- Maks **3 subagent** jalan bareng.
- **Serial** kalau file-nya bersinggungan. Dependency graph:

```
CARD 1 ─┬─ CARD 3 ─┐
        ├─ CARD 4 ─┼─ CARD 6 ─ CARD 7 ─ CARD 8 ─ CARD 9
        └─ CARD 5 ─┘
CARD 2 ─┘
```

- CARD 1 dan CARD 2 boleh paralel (file tidak overlap).
- CARD 3, 4, 5 boleh paralel **hanya setelah** 1 dan 2 merged.
- CARD 6 setelah 4. CARD 7 setelah 3–6. CARD 8 & 9 serial.

## 4. Verification gate (WAJIB di orchestrator)

Jangan percaya laporan "selesai" dari subagent. Jalankan sendiri:

```bash
cd "D:/Kerja/Web portofolio/portofolio-adit"
git diff --stat main...HEAD
git checkout <branch> && npx tsc --noEmit && npm run build
git grep -n "SUPABASE_SERVICE_ROLE_KEY" -- src/ | grep -v "lib/supabase/admin"
```

Gate lulus kalau: build exit 0, tsc exit 0, service role key tidak ada di `src/app/` atau `src/components/`.

## 5. Prompt template untuk subagent

```
Kamu implementer di repo: D:\Kerja\Web portofolio\portofolio-adit

Baca dulu:
- docs/TASKS.md → CARD <N>
- src/types/index.ts
- src/config/site.ts

Kerjakan HANYA CARD <N>. Scope ketat: jangan sentuh file lain.
Jangan tambah dependency.

Setelah selesai WAJIB jalankan:
  npx tsc --noEmit
  npm run build

Kalau gagal, perbaiki sendiri sampai lulus. Jangan lapor selesai sebelum keduanya exit 0.

Lapor: file yang diubah, hasil 2 command di atas (exit code + tail output), dan apa yang sengaja tidak dikerjakan.
```

## 6. Konflik merge

Kalau dua branch menyentuh file yang sama: **rebase branch yang lebih baru**, jangan merge dua-duanya. Kalau konflik > 3 file, serahkan ke `agent-merge-conflict-arbiter`.

## 7. Blocker yang harus Adit selesaikan manual

- [ ] Buat project Supabase, jalankan `supabase/migrations/0001_init.sql`
- [ ] Isi `.env.local` (URL, anon key, Cloudinary cloud name + api key/secret)
- [ ] Isi data minimal di Supabase (1 site_settings, 2 project featured, skills)
- [ ] Buat repo GitHub + connect Vercel
- [ ] Isi konten nyata: bio hero, foto, nama project, URL sosial

Secret **jangan** masuk prompt subagent. Subagent hanya baca nama variabel dari `.env.example`.
