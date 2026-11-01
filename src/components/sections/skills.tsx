import { Container } from "@/components/layout/container";
import { SectionHeading } from "@/components/shared/section-heading";
import { TechBadge } from "@/components/shared/tech-badge";
import { getSkills } from "@/lib/queries";

export default async function Skills() {
  const skills = await getSkills();

  const grouped = skills.reduce<Record<string, typeof skills>>((acc, skill) => {
    const key = skill.group;
    if (!acc[key]) acc[key] = [];
    acc[key].push(skill);
    return acc;
  }, {});

  const groupOrder: Array<keyof typeof grouped> = [
    "languages",
    "frameworks",
    "databases",
    "tools",
    "others",
  ];

  return (
    <section id="skills" className="py-12 sm:py-16 lg:py-20">
      <Container className="flex flex-col gap-8">
        <SectionHeading index="03" title="Keahlian" />
        {skills.length === 0 ? (
          <div className="border border-border bg-surface p-6 text-center">
            <p className="text-sm text-muted-foreground">
              {/* TODO: Tambahkan skill ke database (skills table) agar tampil di sini. */}
              Belum ada data keahlian tersedia.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-8">
            {groupOrder.map((group) => {
              const items = grouped[group];
              if (!items || items.length === 0) return null;
              return (
                <div key={group} className="flex flex-col gap-4">
                  <h3 className="font-heading text-lg sm:text-xl font-semibold text-foreground capitalize">
                    {group === "languages" ? "Bahasa" : group === "frameworks" ? "Kerangka Kerja" : group === "databases" ? "Basis Data" : group === "tools" ? "Alat" : group === "others" ? "Lainnya" : group}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {items.map((skill) => (
                      <TechBadge key={skill.id} label={skill.name} />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Container>
    </section>
  );
}
