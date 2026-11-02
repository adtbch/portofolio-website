const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) { console.error('missing env'); process.exit(1); }
const supabase = createClient(url, key, { auth: { persistSession: false } });
const data = JSON.parse(fs.readFileSync('D:/Kerja/Web portofolio/portofolio-adit/docs/cv-extracted-data.json', 'utf8'));

async function main() {
  const results = {};

  for (const s of data.skills) {
    const { data: ex } = await supabase.from('skills').select('*').eq('name', s.name).limit(1);
    if (ex && ex.length > 0) {
      const { error } = await supabase.from('skills').update({ group: s.group, sort_order: s.sort_order, published: s.published }).eq('id', ex[0].id);
      if (error) throw error;
    } else {
      const { error } = await supabase.from('skills').insert([{ name: s.name, group: s.group, sort_order: s.sort_order, published: s.published }]);
      if (error) throw error;
    }
  }
  results.skills = (await supabase.from('skills').select('*', { count: 'exact', head: true })).count;

  for (const e of data.experiences) {
    const { data: ex } = await supabase.from('experiences').select('*').eq('company', e.company).eq('role', e.role).eq('start_date', e.start_date).limit(1);
    const row = { company: e.company, role: e.role, type: e.type, location: e.location, start_date: e.start_date, end_date: e.end_date, description: e.description, tech_stack: e.tech_stack, sort_order: e.sort_order, published: e.published };
    if (ex && ex.length > 0) {
      const { error } = await supabase.from('experiences').update(row).eq('id', ex[0].id);
      if (error) throw error;
    } else {
      const { error } = await supabase.from('experiences').insert([row]);
      if (error) throw error;
    }
  }
  results.experiences = (await supabase.from('experiences').select('*', { count: 'exact', head: true })).count;

  for (const p of data.projects) {
    const { data: ex } = await supabase.from('projects').select('*').eq('slug', p.slug).limit(1);
    const row = { slug: p.slug, title: p.title, subtitle: p.subtitle, category: p.category, description: p.description, tech_stack: p.tech_stack, featured: p.featured, published: p.published, sort_order: p.sort_order, live_url: p.live_url, repo_url: p.repo_url };
    if (ex && ex.length > 0) {
      const { error } = await supabase.from('projects').update(row).eq('id', ex[0].id);
      if (error) throw error;
    } else {
      const { error } = await supabase.from('projects').insert([row]);
      if (error) throw error;
    }
  }
  results.projects = (await supabase.from('projects').select('*', { count: 'exact', head: true })).count;

  for (const c of data.certificates) {
    const { data: ex } = await supabase.from('certificates').select('*').eq('title', c.title).eq('issuer', c.issuer).limit(1);
    const row = { title: c.title, issuer: c.issuer, issued_at: c.issued_at, credential_url: c.credential_url, sort_order: c.sort_order, published: c.published };
    if (ex && ex.length > 0) {
      const { error } = await supabase.from('certificates').update(row).eq('id', ex[0].id);
      if (error) throw error;
    } else {
      const { error } = await supabase.from('certificates').insert([row]);
      if (error) throw error;
    }
  }
  results.certificates = (await supabase.from('certificates').select('*', { count: 'exact', head: true })).count;

  if (data.profile?.website) {
    const { data: ex } = await supabase.from('socials').select('*').eq('platform', 'linkedin').eq('url', data.profile.website).limit(1);
    const row = { platform: 'linkedin', label: 'LinkedIn', url: data.profile.website, sort_order: 1, published: true };
    if (ex && ex.length > 0) {
      const { error } = await supabase.from('socials').update(row).eq('id', ex[0].id);
      if (error) throw error;
    } else {
      const { error } = await supabase.from('socials').insert([row]);
      if (error) throw error;
    }
  }
  results.socials = (await supabase.from('socials').select('*', { count: 'exact', head: true })).count;

  console.log(JSON.stringify(results));
}

main().catch(e => { console.error(e.message); process.exit(1); });
