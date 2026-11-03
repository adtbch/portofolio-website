import { SectionHeading } from "@/components/shared/section-heading";
import { Container } from "@/components/layout/container";
import { getSkills } from "@/lib/queries";
import SkillsClient from "./skills-client";

export default async function Skills() {
  const skills = await getSkills();
  return (
    <section id="skills" className="py-16 sm:py-24">
      <Container>
        <SectionHeading
          index="06"
          title="Keahlian"
          description="Teknologi dan alat yang dikuasai."
        />
        <SkillsClient skills={skills} />
      </Container>
    </section>
  );
}
