"use client";
import { useState } from "react";
import type { SkillGroup, Skill } from "@/types";

const FILTERS = [
  { key: "all", label: "SEMUA" },
  { key: "languages", label: "PEMROGRAMAN" },
  { key: "frameworks", label: "FRAMEWORK" },
  { key: "databases", label: "BASIS DATA" },
  { key: "tools", label: "TOOLS" },
  { key: "embedded", label: "EMBEDDED" },
];

const GROUP_LABELS: Record<string, string> = {
  languages: "PEMROGRAMAN",
  frameworks: "FRAMEWORK",
  databases: "BASIS DATA",
  tools: "TOOLS",
  embedded: "EMBEDDED",
};

export default function SkillsClient({ skills }: { skills: Skill[] }) {
  const [active, setActive] = useState('all');
  const filteredSkills = active === 'all' ? skills : skills.filter(s => s.group === active);

  return (
    <div>
      <div className="mb-6 flex flex-wrap gap-2">
        {FILTERS.map(f => (
          <button
            key={f.key}
            onClick={() => setActive(f.key)}
            className={`px-4 py-2 rounded text-sm transition-colors ${active === f.key ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-muted/80'}`}
          >
            {f.label}
          </button>
        ))}
      </div>
      {filteredSkills.length === 0 ? (
        <div className="border border-border bg-surface p-6 text-center">
          <p className="text-sm text-muted-foreground">Belum ada data keahlian yang ditampilkan.</p>
        </div>
      ) : (
        <div className="grid gap-8 md:grid-cols-2">
          {active === 'all' ? (
            <div className="flex flex-wrap gap-2 md:col-span-2">
              {filteredSkills.map(skill => (
                <SkillCard key={skill.id} skill={skill} />
              ))}
            </div>
          ) : (
            FILTERS.filter(f => f.key !== 'all').map(f => {
              const groupSkills = filteredSkills.filter(s => s.group === f.key);
              if (groupSkills.length === 0) return null;
              return (
                <div key={f.key} className="rounded-lg border border-border bg-surface p-4">
                  <h3 className="mb-3 text-sm font-medium text-foreground">{GROUP_LABELS[f.key as SkillGroup]}</h3>
                  <div className="flex flex-wrap gap-2">
                    {groupSkills.map(skill => (
                      <SkillCard key={skill.id} skill={skill} />
                    ))}
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}

function SkillCard({ skill }: { skill: Skill }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-border px-2.5 py-1 text-xs text-foreground transition-colors hover:border-accent/50 hover:bg-accent/5">
      {skill.icon_url && (
        <img src={skill.icon_url} alt={skill.name} className="h-4 w-4 object-contain" />
      )}
      <span>{skill.name}</span>
    </span>
  );
}
