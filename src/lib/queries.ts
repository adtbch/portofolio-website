import { unstable_noStore as noStore } from "next/cache";
import { createServerSupabase } from "@/lib/supabase/server";
import type {
  Project,
  Experience,
  Education,
  Skill,
  Certificate,
  Social,
  HeroSettings,
} from "@/types";

export async function getProjects(): Promise<Project[]> {
  try {
    const supabase = createServerSupabase();
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .eq("published", true)
      .order("sort_order", { ascending: true });

    if (error) {
      console.error("Error fetching projects:", error);
      return [];
    }
    return (data as Project[]) || [];
  } catch (err) {
    console.error("Unexpected error fetching projects:", err);
    return [];
  }
}

export async function getFeaturedProjects(): Promise<Project[]> {
  try {
    const supabase = createServerSupabase();
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .eq("published", true)
      .eq("featured", true)
      .order("sort_order", { ascending: true });

    if (error) {
      console.error("Error fetching featured projects:", error);
      return [];
    }
    return (data as Project[]) || [];
  } catch (err) {
    console.error("Unexpected error fetching featured projects:", err);
    return [];
  }
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  try {
    const supabase = createServerSupabase();
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .eq("slug", slug)
      .eq("published", true)
      .single();

    if (error) {
      console.error(`Error fetching project by slug (${slug}):`, error);
      return null;
    }
    return (data as Project) || null;
  } catch (err) {
    console.error(`Unexpected error fetching project by slug (${slug}):`, err);
    return null;
  }
}

export async function getExperiences(): Promise<Experience[]> {
  try {
    const supabase = createServerSupabase();
    const { data, error } = await supabase
      .from("experiences")
      .select(`
        *,
        projects:projects!experience_id (
          id, slug, title, subtitle, category, description, cover_image_url, gallery, images, tech_stack
        )
      `)
      .eq("published", true)
      .order("sort_order", { ascending: true });

    if (error) {
      console.error("Error fetching experiences:", error);
      return [];
    }
    return (data as Experience[]) || [];
  } catch (err) {
    console.error("Unexpected error fetching experiences:", err);
    return [];
  }
}

export async function getEducation(): Promise<Education[]> {
  try {
    const supabase = createServerSupabase();
    const { data, error } = await supabase
      .from("education")
      .select("*")
      .eq("published", true)
      .order("sort_order", { ascending: true });

    if (error) {
      console.error("Error fetching education:", error);
      return [];
    }
    return (data as Education[]) || [];
  } catch (err) {
    console.error("Unexpected error fetching education:", err);
    return [];
  }
}

export async function getSkills(): Promise<Skill[]> {
  try {
    const supabase = createServerSupabase();
    const { data, error } = await supabase
      .from("skills")
      .select("*")
      .eq("published", true)
      .order("sort_order", { ascending: true });

    if (error) {
      console.error("Error fetching skills:", error);
      return [];
    }
    return (data as Skill[]) || [];
  } catch (err) {
    console.error("Unexpected error fetching skills:", err);
    return [];
  }
}

export async function getCertificates(): Promise<Certificate[]> {
  try {
    const supabase = createServerSupabase();
    const { data, error } = await supabase
      .from("certificates")
      .select("*")
      .eq("published", true)
      .order("sort_order", { ascending: true });

    if (error) {
      console.error("Error fetching certificates:", error);
      return [];
    }
    return (data as Certificate[]) || [];
  } catch (err) {
    console.error("Unexpected error fetching certificates:", err);
    return [];
  }
}

export async function getSocials(): Promise<Social[]> {
  try {
    const supabase = createServerSupabase();
    const { data, error } = await supabase
      .from("socials")
      .select("*")
      .eq("published", true)
      .order("sort_order", { ascending: true });

    if (error) {
      console.error("Error fetching socials:", error);
      return [];
    }
    return (data as Social[]) || [];
  } catch (err) {
    console.error("Unexpected error fetching socials:", err);
    return [];
  }
}

export async function getSiteSettings(): Promise<Record<string, string>> {
  try {
    const supabase = createServerSupabase();
    const { data, error } = await supabase
      .from("site_settings")
      .select("key, value");

    if (error) {
      console.error("Error fetching site settings:", error);
      return {};
    }

    const settings: Record<string, string> = {};
    if (data) {
      for (const item of data as { key: string; value: string }[]) {
        if (item.key && typeof item.value === "string") {
          settings[item.key] = item.value;
        }
      }
    }
    return settings;
  } catch (err) {
    console.error("Unexpected error fetching site settings:", err);
    return {};
  }
}

export async function getHeroSettings(): Promise<HeroSettings | null> {
  noStore();
  try {
    const supabase = createServerSupabase(true); // Use service role to bypass RLS for published content
    const { data, error } = await supabase
      .from("hero_settings")
      .select("*")
      .eq("published", true)
      .order("sort_order", { ascending: true })
      .limit(1)
      .single();

    if (error) {
      console.error("Error fetching hero settings:", error);
      return null;
    }
    return (data as HeroSettings) || null;
  } catch (err) {
    console.error("Unexpected error fetching hero settings:", err);
    return null;
  }
}
