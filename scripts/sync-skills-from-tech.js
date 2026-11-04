const { createClient } = require('@supabase/supabase-js');

const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) { console.error('missing env'); process.exit(1); }
const supabase = createClient(url, key, { auth: { persistSession: false } });

const groupRules = [
  { group: 'languages', keys: ['c/c++', 'cpp', 'c++', 'c', 'python', 'golang', 'go', 'php', 'javascript', 'typescript', 'java', 'kotlin', 'swift', 'rust', 'ruby', 'dart'] },
  { group: 'frameworks', keys: ['react', 'vue', 'angular', 'next', 'nextjs', 'nuxt', 'svelte', 'express', 'nest', 'laravel', 'django', 'flask', 'fastapi', 'spring', 'rest api', 'graphql', 'html', 'css', 'tailwind', 'bootstrap', 'chakra', 'shadcn'] },
  { group: 'databases', keys: ['sql', 'mysql', 'postgresql', 'postgres', 'sqlite', 'mongodb', 'redis', 'supabase', 'prisma'] },
  { group: 'embedded', keys: ['esp32', 'arduino', 'raspberry', 'microcontroller', 'embedded', 'agv', 'iot'] },
  { group: 'tools', keys: ['git', 'github', 'gitlab', 'docker', 'kubernetes', 'figma', 'postman', 'vscode', 'cloudinary', 'midtrans', 'jwt', 'sensors', 'robotics'] },
];

function classify(name) {
  const n = String(name || '').toLowerCase();
  for (const rule of groupRules) {
    for (const k of rule.keys) {
      if (n.includes(k)) return rule.group;
    }
  }
  return 'tools';
}

function normalize(name) {
  return String(name || '').trim();
}

async function main() {
  // fetch published projects and experiences
  const [{ data: projects }, { data: experiences }, { data: existingSkills }] = await Promise.all([
    supabase.from('projects').select('tech_stack').eq('published', true),
    supabase.from('experiences').select('tech_stack').eq('published', true),
    supabase.from('skills').select('name'),
  ]);

  const existing = new Set((existingSkills || []).map(s => String(s.name).toLowerCase()));
  const collected = new Map();

  const addTech = (tech) => {
    const name = normalize(tech);
    if (!name) return;
    const key = name.toLowerCase();
    if (existing.has(key)) return;
    if (collected.has(key)) return;
    collected.set(key, { name, group: classify(name), published: true, sort_order: 0 });
  };

  for (const p of projects || []) {
    const stack = Array.isArray(p.tech_stack) ? p.tech_stack : [];
    for (const t of stack) addTech(t);
  }
  for (const e of experiences || []) {
    const stack = Array.isArray(e.tech_stack) ? e.tech_stack : [];
    for (const t of stack) addTech(t);
  }

  const toInsert = Array.from(collected.values());
  if (toInsert.length === 0) {
    console.log(JSON.stringify({ inserted: 0, totalSkills: (existingSkills||[]).length }));
    return;
  }

  // assign sort_order at end
  const { data: allSkills } = await supabase.from('skills').select('sort_order').order('sort_order', { ascending: false }).limit(1);
  let nextOrder = allSkills && allSkills[0] && typeof allSkills[0].sort_order === 'number' ? allSkills[0].sort_order + 1 : 100;
  for (let i = 0; i < toInsert.length; i++) {
    toInsert[i].sort_order = nextOrder++;
  }

  const { error } = await supabase.from('skills').insert(toInsert);
  if (error) throw error;

  const { count } = await supabase.from('skills').select('*', { count: 'exact', head: true });
  console.log(JSON.stringify({ inserted: toInsert.length, totalSkills: count }));
}

main().catch(e => { console.error(e.message); process.exit(1); });
