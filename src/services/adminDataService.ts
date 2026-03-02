/**
 * Traveliun Admin Data Service
 * واجهة موحدة للتعامل مع Supabase مع fallback لـ localStorage
 * إذا فشل الاتصال بالجدول في Supabase (لأنه لم يُنشأ بعد)، يعود لـ localStorage
 */
import { supabase } from "@/integrations/supabase/client";

// ═══════════ Generic Helper ═══════════
async function supaFetch<T>(table: string, orderBy = "display_order"): Promise<T[]> {
  const { data, error } = await (supabase as any)
    .from(table)
    .select("*")
    .order(orderBy, { ascending: true });
  if (error) throw error;
  return (data || []) as T[];
}

async function supaInsert<T>(table: string, row: Partial<T>): Promise<T> {
  const { data, error } = await (supabase as any)
    .from(table)
    .insert(row)
    .select()
    .single();
  if (error) throw error;
  return data as T;
}

async function supaUpdate<T>(table: string, id: string, updates: Partial<T>): Promise<T> {
  const { data, error } = await (supabase as any)
    .from(table)
    .update(updates)
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data as T;
}

async function supaDelete(table: string, id: string): Promise<void> {
  const { error } = await (supabase as any)
    .from(table)
    .delete()
    .eq("id", id);
  if (error) throw error;
}

async function supaUpsertSettings(pairs: Record<string, string>): Promise<void> {
  const rows = Object.entries(pairs).map(([key, value]) => ({ key, value, updated_at: new Date().toISOString() }));
  const { error } = await (supabase as any)
    .from("homepage_settings")
    .upsert(rows, { onConflict: "key" });
  if (error) throw error;
}

async function supaGetSettings(): Promise<Record<string, string>> {
  const { data, error } = await (supabase as any)
    .from("homepage_settings")
    .select("*");
  if (error) throw error;
  const result: Record<string, string> = {};
  (data || []).forEach((row: any) => { result[row.key] = row.value; });
  return result;
}

// ═══════════ Service with Fallback ═══════════
function withFallback<T>(
  supaFn: () => Promise<T>,
  localFn: () => T,
  label: string
): Promise<T> {
  return supaFn().catch((err) => {
    console.warn(`[Supabase] ${label} fallback to localStorage:`, err.message);
    return localFn();
  });
}

// ═══════════ HOMEPAGE SERVICE ═══════════
export const homepageService = {
  // Hero Slides
  async getHeroSlides() {
    return withFallback(
      () => supaFetch("homepage_hero_slides"),
      () => { const d = JSON.parse(localStorage.getItem("traveliun_homepage") || "{}"); return d.heroSlides || []; },
      "heroSlides.get"
    );
  },
  async upsertHeroSlide(slide: any) {
    try {
      const { id, order, ...rest } = slide;
      const row = { ...rest, display_order: order || 0 };
      if (id && !id.match(/^\d+$/)) {
        return await supaUpdate("homepage_hero_slides", id, row);
      }
      return await supaInsert("homepage_hero_slides", row);
    } catch (err) {
      console.warn("[Supabase] heroSlide.upsert fallback:", (err as any).message);
      return null; // caller handles localStorage
    }
  },
  async deleteHeroSlide(id: string) {
    try { await supaDelete("homepage_hero_slides", id); } catch { /* fallback */ }
  },

  // Features
  async getFeatures() {
    return withFallback(
      () => supaFetch("homepage_features"),
      () => { const d = JSON.parse(localStorage.getItem("traveliun_homepage") || "{}"); return d.features || []; },
      "features.get"
    );
  },
  async upsertFeature(f: any) {
    try {
      const { id, order, ...rest } = f;
      const row = { ...rest, display_order: order || 0 };
      if (id && !id.match(/^\d+$/)) return await supaUpdate("homepage_features", id, row);
      return await supaInsert("homepage_features", row);
    } catch { return null; }
  },
  async deleteFeature(id: string) {
    try { await supaDelete("homepage_features", id); } catch { /* fallback */ }
  },

  // Stats
  async getStats() {
    return withFallback(
      () => supaFetch("homepage_stats"),
      () => { const d = JSON.parse(localStorage.getItem("traveliun_homepage") || "{}"); return d.stats || []; },
      "stats.get"
    );
  },
  async upsertStat(s: any) {
    try {
      const { id, order, ...rest } = s;
      const row = { ...rest, display_order: order || 0 };
      if (id && !id.match(/^\d+$/)) return await supaUpdate("homepage_stats", id, row);
      return await supaInsert("homepage_stats", row);
    } catch { return null; }
  },
  async deleteStat(id: string) {
    try { await supaDelete("homepage_stats", id); } catch { /* fallback */ }
  },

  // Testimonials
  async getTestimonials() {
    return withFallback(
      () => supaFetch("homepage_testimonials"),
      () => { const d = JSON.parse(localStorage.getItem("traveliun_homepage") || "{}"); return d.testimonials || []; },
      "testimonials.get"
    );
  },
  async upsertTestimonial(t: any) {
    try {
      const { id, order, ...rest } = t;
      const row = { ...rest, display_order: order || 0 };
      if (id && !id.match(/^\d+$/)) return await supaUpdate("homepage_testimonials", id, row);
      return await supaInsert("homepage_testimonials", row);
    } catch { return null; }
  },
  async deleteTestimonial(id: string) {
    try { await supaDelete("homepage_testimonials", id); } catch { /* fallback */ }
  },

  // CTA Settings
  async getCTASettings() {
    return withFallback(
      async () => {
        const settings = await supaGetSettings();
        return {
          title: settings.cta_title || "جاهز تبدأ",
          highlight: settings.cta_highlight || "رحلتك",
          description: settings.cta_description || "",
          whatsappNumber: settings.cta_whatsapp_number || "966569222111",
          phoneNumber: settings.cta_phone_number || "966569222111",
          workingHours: settings.cta_working_hours || "نعمل على مدار الساعة 24/7",
        };
      },
      () => { const d = JSON.parse(localStorage.getItem("traveliun_homepage") || "{}"); return d.cta || {}; },
      "cta.get"
    );
  },
  async saveCTASettings(cta: any) {
    try {
      await supaUpsertSettings({
        cta_title: cta.title,
        cta_highlight: cta.highlight,
        cta_description: cta.description,
        cta_whatsapp_number: cta.whatsappNumber,
        cta_phone_number: cta.phoneNumber,
        cta_working_hours: cta.workingHours,
      });
    } catch { /* fallback */ }
  },
};

// ═══════════ HONEYMOON SERVICE ═══════════
export const honeymoonService = {
  async getPackages() {
    return withFallback(
      () => supaFetch("honeymoon_packages"),
      () => { const d = JSON.parse(localStorage.getItem("traveliun_honeymoon") || "{}"); return d.packages || []; },
      "honeymoon.packages.get"
    );
  },
  async upsertPackage(p: any) {
    try {
      const { id, order, ...rest } = p;
      const row = { ...rest, display_order: order || 0 };
      if (id && !id.match(/^\d+$/)) return await supaUpdate("honeymoon_packages", id, row);
      return await supaInsert("honeymoon_packages", row);
    } catch { return null; }
  },
  async deletePackage(id: string) {
    try { await supaDelete("honeymoon_packages", id); } catch { /* fallback */ }
  },

  async getFeatures() {
    return withFallback(
      () => supaFetch("honeymoon_features"),
      () => { const d = JSON.parse(localStorage.getItem("traveliun_honeymoon") || "{}"); return d.features || []; },
      "honeymoon.features.get"
    );
  },
  async upsertFeature(f: any) {
    try {
      const { id, order, ...rest } = f;
      const row = { ...rest, display_order: order || 0 };
      if (id && !id.match(/^\d+$/)) return await supaUpdate("honeymoon_features", id, row);
      return await supaInsert("honeymoon_features", row);
    } catch { return null; }
  },
  async deleteFeature(id: string) {
    try { await supaDelete("honeymoon_features", id); } catch { /* fallback */ }
  },

  async getTestimonials() {
    return withFallback(
      () => supaFetch("honeymoon_testimonials"),
      () => { const d = JSON.parse(localStorage.getItem("traveliun_honeymoon") || "{}"); return d.testimonials || []; },
      "honeymoon.testimonials.get"
    );
  },
  async upsertTestimonial(t: any) {
    try {
      const { id, order, ...rest } = t;
      const row = { ...rest, display_order: order || 0 };
      if (id && !id.match(/^\d+$/)) return await supaUpdate("honeymoon_testimonials", id, row);
      return await supaInsert("honeymoon_testimonials", row);
    } catch { return null; }
  },
  async deleteTestimonial(id: string) {
    try { await supaDelete("honeymoon_testimonials", id); } catch { /* fallback */ }
  },
};

// ═══════════ SERVICES SERVICE ═══════════
export const servicesService = {
  async getServices() {
    return withFallback(
      () => supaFetch("services"),
      () => JSON.parse(localStorage.getItem("traveliun_services") || "[]"),
      "services.get"
    );
  },
  async upsertService(s: any) {
    try {
      const { id, order, ...rest } = s;
      const row = { ...rest, display_order: order || 0 };
      if (id && !id.match(/^\d+$/)) return await supaUpdate("services", id, row);
      return await supaInsert("services", row);
    } catch { return null; }
  },
  async deleteService(id: string) {
    try { await supaDelete("services", id); } catch { /* fallback */ }
  },
};

// ═══════════ BLOG SERVICE ═══════════
export const blogService = {
  async getArticles() {
    return withFallback(
      () => supaFetch("blog_articles"),
      () => JSON.parse(localStorage.getItem("traveliun_blog") || "[]"),
      "blog.get"
    );
  },
  async upsertArticle(a: any) {
    try {
      const { id, order, ...rest } = a;
      const row = { ...rest, display_order: order || 0 };
      if (id && !id.match(/^\d+$/)) return await supaUpdate("blog_articles", id, row);
      return await supaInsert("blog_articles", row);
    } catch { return null; }
  },
  async deleteArticle(id: string) {
    try { await supaDelete("blog_articles", id); } catch { /* fallback */ }
  },
  async incrementViews(id: string) {
    try {
      const { data } = await (supabase as any)
        .from("blog_articles")
        .select("views")
        .eq("id", id)
        .single();
      if (data) {
        await supaUpdate("blog_articles", id, { views: (data.views || 0) + 1 });
      }
    } catch { /* ignore */ }
  },
};
