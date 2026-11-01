# ORCHESTRATOR PLAN — Portofolio Adit (Local First)

> Berdasarkan hasil breakdown 4 bot. Fokus implementasi per-tahap dengan gate otomatis (test lulus -> lanjut). Prisma di-skip, pakai Supabase-js + Cloudinary. Target lokal dulu, Vercel nanti. Data diekstrak dari CV, bukan dibuat fiktif.

## Team & Role
| Bot | Role | Scope |
|---|---|---|
| Dave | PM/Tech Lead | Orkestrasi, dependency graph, gate |
| DevHermes | Implementer (Backend/Data/Admin) | Supabase schema, env, queries, admin hardening/CRUD, build |
| Morty | UI/UX | Layout, responsive, empty/loading/error, a11y, Bahasa Indonesia |
| Prof-Volt | Reviewer/Security | RLS, auth, CRUD authz, secrets, validation, build gate, smoke test |
| Anton | Data Extractor | Ekstraksi CV ke format portfolio (skills/exp/projects/certs) |

## Dependency Graph
```text
P0: ENV + SUPABASE (1-4) -> BUILD_VERIFY (5)
P1: EXTRACT_CV (ANTON) -> SEED_DATA (DEV) -> PUBLIC_UI_VERIFY (MORTY)
P2: ADMIN_HARDEN_VERIFIED (DONE) + CRUD_FIX_IF_ANY (PROF) -> ADMIN_SMOKE_TEST
P3: UI_POLISH (MORTY/DEV) -> A11Y/RESPONSIVE/INDO_COPY (MORTY+DEV) -> FINAL_GATE (PROF)
```

## Task Breakdown

### FASE 0: Setup Lokal (DevHermes) — PRIORITAS
| ID | Task | Dep | Scope | Acceptance | Gate | Commit |
|---|---|---|---|---|---|---|
| ORCH-00-ENV | Buat/konfirmasi `.env.local` | - | `.env.local` | Semua env Supabase/Cloudinary/ADMIN ada | `npm run dev` tanpa warning env | `chore: configure local env for supabase and cloudinary` |
| ORCH-00-SCHEMA | Jalankan migration Supabase | ORCH-00-ENV | `supabase/migrations/0001_init.sql` | Tabel + RLS ada | SQL test via Supabase | `chore: initialize Supabase schema and enable RLS` |
| ORCH-00-CLOUD | Verifikasi Cloudinary | ORCH-00-ENV | `src/lib/cloudinary/utils.ts` | Upload test sukses & URL valid | Script upload test | `chore: add Cloudinary env vars and verify upload utility` |

### FASE 1: Ekstraksi Data CV (Anton) — PARALEL
| ID | Task | Dep | Scope | Acceptance | Gate | Commit |
|---|---|---|---|---|---|---|
| ORCH-01-EXTRACT | Ekstraksi CV ke mapping portfolio | ORCH-00-SCHEMA | Plan output JSON (skills, experiences, projects, certificates, profile) | Semua sumber dari PDF, bagian tidak jelas ditandai `[PERLU_KONFIRMASI]` | Review Prof-Volt | `docs: extract cv data mapping for portfolio` |

### FASE 2: Seed Data (DevHermes) — SETELAH EXTRACT
| ID | Task | Dep | Scope | Acceptance | Gate | Commit |
|---|---|---|---|---|---|---|
| ORCH-02-SEED | Isi Supabase sesuai hasil ekstraksi | ORCH-01-EXTRACT | Supabase tables | skills/exp/projects/certs terisi, published=true, experience.type terisi | `src/lib/queries.ts` fetch di node/repl tanpa error | `chore: seed supabase from cv extracted data` |
| ORCH-02-SOCIALS | Samakan socials dengan site.ts | ORCH-02-SEED | `src/config/site.ts` + Supabase `socials` | Konsisten | Render di halaman | `chore: align socials config with data` |

### FASE 3: Build & Runtime Lokal (DevHermes)
| ID | Task | Dep | Scope | Acceptance | Gate | Commit |
|---|---|---|---|---|---|---|
| ORCH-03-BUILD | Build lokal | ORCH-02-SEED | - | tsc + build sukses | `npx tsc --noEmit --incremental false && npm run build` exit 0 | `chore: verify local build with seeded data` |
| ORCH-03-SMOKE | Smoke test lokal | ORCH-03-BUILD | `/`, `/projects/[slug]` | Halaman tampil, gambar/links berfungsi | Browser/manual check | `test: local smoke test public pages` |

### FASE 4: UI Polish (Morty + DevHermes)
| ID | Task | Dep | Scope | Acceptance | Gate | Commit |
|---|---|---|---|---|---|---|
| ORCH-04-EMPTY | Empty/loading/error states | ORCH-03-SMOKE | Sections + Admin | State konsisten Bahasa Indonesia | Manual check | `fix: add empty/loading/error states` |
| ORCH-04-RESP | Responsive QA | ORCH-04-EMPTY | Semua halaman | 375/768/1024/1280 OK | Checklist Morty | `fix: responsive adjustments` |
| ORCH-04-A11Y | A11y check | ORCH-04-RESP | Nav/forms/links/images | Keyboard navigable, alt text, contrast | Lighthouse/axe check | `fix: accessibility improvements` |
| ORCH-04-COPY | Finalisasi copy Indonesia | ORCH-04-A11Y | Seluruh UI | Konsisten tanpa terjemahan kaku | Morty review | `content: finalize indonesian copy` |

### FASE 5: Security Gate (Prof-Volt) — FINAL
| ID | Task | Dep | Scope | Acceptance | Gate | Commit |
|---|---|---|---|---|---|---|
| ORCH-05-SEC | Audit final | ORCH-04-COPY + Admin ready | RLS, auth, CRUD, secrets, middleware | Semua CRITICAL/HIGH ditutup | Prof-Volt approval | `security: admin hardening verified` |
| ORCH-05-LOCAL | Local readiness check | ORCH-05-SEC | End-to-end | Public + Admin aman lokal | Smoke test lengkap | `chore: local deployment readiness` |

## Orchestrator Rules
- Hanya implementasi jika gate lulus
- DevHermes/ Morty boleh edit source sesuai scope
- Prof-Volt hanya review/gate
- Anton hanya planning/data mapping
- Dave koordinasi, mencegah parallel conflict
- Data fiktif dilarang
- Setiap selesai task: commit sesuai pesan + `tsc` + `build` (jika ada file edit)
- Jika aksi eksternal/destruktif -> minta approval
- Lanjut otomatis jika test lulus

## Next Action
Jalankan **FASE 0 + FASE 1 paralel**:
- DevHermes: ORCH-00-ENV, ORCH-00-SCHEMA, ORCH-00-CLOUD
- Anton: ORCH-01-EXTRACT (baca CV penuh)
- Prof-Volt standby untuk review seed/schema
- Morty standby untuk UI polish

Buat task card terperinci untuk masing-masing bot lalu dispatch dengan `delegate_task`.