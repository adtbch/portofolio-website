#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';

const root = path.resolve(process.cwd());
const cvPath = path.join(root, 'docs', 'cv-extracted-data.json');
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !key) {
  console.error('missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}
const supabase = createClient(url, key, { auth: { persistSession: false } });

const cv = JSON.parse(fs.readFileSync(cvPath, 'utf8'));

async function upsert(table, rows, conflict) {
  if (!rows?.length) return;
  const { error } = await supabase.from(table).upsert(rows, { onConflict: conflict });
  if (error) throw error;
  console.log('upserted', table, rows.length);
}

async function main() {
  if (cv.skills?.length) {
    await upsert('skills', cv.skills.map(s => ({ name: s.name, group: s.group, sort_order: s.sort_order ?? 0, published: s.published ?? true })), 'name');
  }
  if (cv.experiences?.length) {
    await upsert('experiences', cv.experiences.map((e,i)=>({
      company: e.company,
      role: e.role,
      type: e.type || null,
      location: e.location || null,
      start_date: e.start_date,
      end_date: e.end_date || null,
      description: e.description || null,
      tech_stack: e.tech_stack || null,
      sort_order: e.sort_order ?? i,
      published: e.published ?? true
    })), 'company,role,start_date');
  }
  if (cv.projects?.length) {
    await upsert('projects', cv.projects.map((p,i)=>({
      slug: p.slug,
      title: p.title,
      subtitle: p.subtitle || null,
      category: p.category || null,
      description: p.description || null,
      content: p.content || null,
      tech_stack: p.tech_stack || null,
      featured: p.featured ?? false,
      published: p.published ?? true,
      sort_order: p.sort_order ?? i,
      live_url: p.live_url || null,
      repo_url: p.repo_url || null
    })), 'slug');
  }
  if (cv.certificates?.length) {
    await upsert('certificates', cv.certificates.map((c,i)=>({
      title: c.title,
      issuer: c.issuer,
      issued_at: c.issued_at || null,
      credential_url: c.credential_url || null,
      image_url: c.image_url || null,
      sort_order: c.sort_order ?? i,
      published: c.published ?? true
    })), 'title,issuer');
  }
  console.log('done');
}

main().catch(e=>{ console.error(e.message); process.exit(1); });
