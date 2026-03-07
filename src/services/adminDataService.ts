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

// ✅ withLocalFallback: تُعيد localStorage إذا Supabase أعاد [] أيضاً
async function withLocalFallback<T extends unknown[]>(
  supaFn: () => Promise<T>,
  localFn: () => T,
  label: string
): Promise<T> {
  try {
    const result = await supaFn();
    // إذا Supabase نجح ورجع بيانات → اعتمد عليها
    if (result && result.length > 0) return result;
    // Supabase رجع [] فارغ → جرب localStorage
    const local = localFn();
    if (local && (local as unknown[]).length > 0) {
      console.info(`[Supabase] ${label} Supabase empty → using localStorage`);
      return local;
    }
    return result;
  } catch (err) {
    console.warn(`[Supabase] ${label} error → localStorage:`, (err as Error).message);
    return localFn();
  }
}


export const homepageService = {
  // Hero Slides ✅ يقرأ localStorage عند Supabase فارغ
  async getHeroSlides() {
    return withLocalFallback(
      () => supaFetch<Record<string, unknown>>("homepage_hero_slides"),
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

  // Features ✅
  async getFeatures() {
    return withLocalFallback(
      () => supaFetch<Record<string, unknown>>("homepage_features"),
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

  // Stats ✅
  async getStats() {
    return withLocalFallback(
      () => supaFetch<Record<string, unknown>>("homepage_stats"),
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

  // Testimonials ✅
  async getTestimonials() {
    return withLocalFallback(
      () => supaFetch<Record<string, unknown>>("homepage_testimonials"),
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

// ═══════════ NAV SERVICE ═══════════
const NAV_STORAGE_KEY = "traveliun_nav";

export interface NavLink {
  id: string;
  name: string;
  path: string;
  icon?: string;          // emoji أيقونة
  is_active: boolean;
  order: number;
  hasDropdown?: boolean;
  dropdownKey?: string;   // 'countries' | 'more' (للـ dropdowns الثابتة)
  openInNew?: boolean;    // فتح في تبويب جديد
}

export const defaultNavLinks: NavLink[] = [
  { id: "1", name: "الأولى",      path: "/",            icon: "🏠", is_active: true, order: 1 },
  { id: "2", name: "الدول",       path: "/destinations", icon: "🌍", is_active: true, order: 2, hasDropdown: true, dropdownKey: "countries" },
  { id: "3", name: "شهر العسل",  path: "/honeymoon",   icon: "💑", is_active: true, order: 3 },
  { id: "4", name: "العروض",      path: "/offers",       icon: "🏷️", is_active: true, order: 4 },
  { id: "5", name: "البرامج",     path: "/programs",     icon: "✈️", is_active: true, order: 5 },
  { id: "6", name: "الخدمات",     path: "/services",     icon: "⚙️", is_active: true, order: 6 },
  { id: "7", name: "المزيد",      path: "#",             icon: "📋", is_active: true, order: 7, hasDropdown: true, dropdownKey: "more" },
];

export const navService = {
  getNavLinks(): NavLink[] {
    try {
      const stored = localStorage.getItem(NAV_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as NavLink[];
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch { /* يبقى الافتراضي */ }
    return defaultNavLinks;
  },

  saveNavLinks(links: NavLink[]): void {
    localStorage.setItem(NAV_STORAGE_KEY, JSON.stringify(links));
  },

  resetToDefault(): void {
    localStorage.removeItem(NAV_STORAGE_KEY);
  },
};

// ═══════════ MOBILE HOMEPAGE SERVICE ═══════════
const MOBILE_STORAGE_KEY = "traveliun_mobile_homepage";

export interface MobileDeal {
  id: string;
  title: string;
  subtitle: string;
  gradient: string;
  icon: string;      // emoji
  link: string;
  is_active: boolean;
  order: number;
}

export interface MobileDestination {
  id: string;
  name: string;
  slug: string;
  countrySlug: string;
  country: string;
  image: string;
  price: string;
  rating: number;
  is_active: boolean;
  order: number;
}

export interface MobileQuickAction {
  id: string;
  label: string;
  icon: string;      // emoji
  path: string;
  color: string;    // tailwind gradient class
  is_active: boolean;
  order: number;
}

export interface MobileFeature {
  id: string;
  icon: string;      // emoji
  title: string;
  desc: string;
  is_active: boolean;
  order: number;
}

export interface MobileAppBanner {
  title: string;
  description: string;
  appStoreLabel: string;
  appStoreLink: string;
  playStoreLabel: string;
  playStoreLink: string;
  is_visible: boolean;
}

export interface MobileBottomNavItem {
  id: string;
  icon: string;      // emoji
  label: string;
  path: string;
  is_active: boolean;
  order: number;
}

export interface MobileHomepageData {
  deals: MobileDeal[];
  destinations: MobileDestination[];
  quickActions: MobileQuickAction[];
  features: MobileFeature[];
  appBanner: MobileAppBanner;
  bottomNav: MobileBottomNavItem[];
  heroTitle?: string;
  heroSubtitle?: string;
  searchPlaceholder?: string;
}

export const defaultMobileData: MobileHomepageData = {
  heroTitle: "ترافليون",
  heroSubtitle: "احجز رحلتك بسهولة",
  searchPlaceholder: "إلى أين تريد السفر؟",
  deals: [
    { id: "1", title: "خصم 30% على الفنادق", subtitle: "عروض الشتاء الحصرية", gradient: "from-teal-500 via-emerald-500 to-green-500", icon: "🏨", link: "/offers", is_active: true, order: 1 },
    { id: "2", title: "طيران بأقل الأسعار", subtitle: "وفر حتى 50%", gradient: "from-blue-500 via-cyan-500 to-teal-500", icon: "✈️", link: "/offers", is_active: true, order: 2 },
    { id: "3", title: "باقات شهر العسل", subtitle: "تجربة لا تُنسى", gradient: "from-cyan-500 via-blue-500 to-indigo-500", icon: "💑", link: "/honeymoon", is_active: true, order: 3 },
  ],
  destinations: [
    { id: "1", name: "كوالالمبور", slug: "kuala-lumpur", countrySlug: "malaysia", country: "ماليزيا", image: "https://images.unsplash.com/photo-1596422846543-75c6fc197f07?w=400&h=300&fit=crop", price: "من 2,499 ر.س", rating: 4.8, is_active: true, order: 1 },
    { id: "2", name: "إسطنبول", slug: "istanbul", countrySlug: "turkey", country: "تركيا", image: "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=400&h=300&fit=crop", price: "من 1,899 ر.س", rating: 4.9, is_active: true, order: 2 },
    { id: "3", name: "بانكوك", slug: "bangkok", countrySlug: "thailand", country: "تايلاند", image: "https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=400&h=300&fit=crop", price: "من 2,199 ر.س", rating: 4.7, is_active: true, order: 3 },
    { id: "4", name: "بالي", slug: "bali", countrySlug: "indonesia", country: "إندونيسيا", image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=400&h=300&fit=crop", price: "من 2,899 ر.س", rating: 4.9, is_active: true, order: 4 },
    { id: "5", name: "سنغافورة", slug: "singapore", countrySlug: "singapore", country: "سنغافورة", image: "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=400&h=300&fit=crop", price: "من 3,299 ر.س", rating: 4.8, is_active: true, order: 5 },
  ],
  quickActions: [
    { id: "1", label: "تقسيط", icon: "💳", path: "/tabby", color: "bg-gradient-to-br from-teal-600 to-cyan-500", is_active: true, order: 1 },
    { id: "2", label: "عروض", icon: "🎁", path: "/offers", color: "bg-gradient-to-br from-indigo-500 to-blue-500", is_active: true, order: 2 },
    { id: "3", label: "شهر عسل", icon: "💑", path: "/honeymoon", color: "bg-gradient-to-br from-cyan-600 to-teal-500", is_active: true, order: 3 },
  ],
  features: [
    { id: "1", icon: "🛡️", title: "ضمان أفضل سعر", desc: "أسعار تنافسية", is_active: true, order: 1 },
    { id: "2", icon: "🎧", title: "دعم 24/7", desc: "خدمة متواصلة", is_active: true, order: 2 },
    { id: "3", icon: "⚡", title: "حجز فوري", desc: "تأكيد مباشر", is_active: true, order: 3 },
    { id: "4", icon: "💳", title: "دفع آمن", desc: "حماية كاملة", is_active: true, order: 4 },
  ],
  appBanner: {
    title: "حمّل تطبيق ترافليون",
    description: "احصل على عروض حصرية وإشعارات فورية عبر التطبيق",
    appStoreLabel: "App Store",
    appStoreLink: "#",
    playStoreLabel: "Google Play",
    playStoreLink: "#",
    is_visible: true,
  },
  bottomNav: [
    { id: "1", icon: "🌐", label: "استكشف", path: "/m", is_active: true, order: 1 },
    { id: "2", icon: "✈️", label: "طيران", path: "/amadeus-flights", is_active: true, order: 2 },
    { id: "3", icon: "🏨", label: "فنادق", path: "/hotels", is_active: true, order: 3 },
    { id: "4", icon: "🎁", label: "عروض", path: "/offers", is_active: true, order: 4 },
    { id: "5", icon: "👤", label: "حسابي", path: "/login", is_active: true, order: 5 },
  ],
};

export const mobileHomepageService = {
  getData(): MobileHomepageData {
    try {
      const stored = localStorage.getItem(MOBILE_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as MobileHomepageData;
        // دمج مع الافتراضي لضمان الحقول الجديدة
        return {
          ...defaultMobileData,
          ...parsed,
          appBanner: { ...defaultMobileData.appBanner, ...(parsed.appBanner || {}) },
        };
      }
    } catch { /* يبقى الافتراضي */ }
    return defaultMobileData;
  },

  saveData(data: MobileHomepageData): void {
    localStorage.setItem(MOBILE_STORAGE_KEY, JSON.stringify(data));
  },

  resetToDefault(): void {
    localStorage.removeItem(MOBILE_STORAGE_KEY);
  },
};

// ═══════════ SYSTEM SETTINGS SERVICE ═══════════
const SETTINGS_KEY = "traveliun_system_settings";

export interface FooterLink {
  id: string;
  name: string;
  path: string;
  is_active: boolean;
  order: number;
}

export interface FooterColumn {
  id: string;
  title: string;
  links: FooterLink[];
  is_active: boolean;
  order: number;
}

export interface SocialLink {
  id: string;
  platform: string;    // facebook | instagram | twitter | youtube | tiktok | snapchat
  url: string;
  is_active: boolean;
}

export interface HeaderSettings {
  siteName: string;
  siteNameEn: string;
  showTopBar: boolean;
  topBarText: string;
  topBarPhone: string;
  showSearchBar: boolean;
  showNotificationBell: boolean;
  showLoginButton: boolean;
  showFavoritesButton: boolean;
}

export interface FooterSettings {
  companyDescription: string;
  copyrightText: string;
  columns: FooterColumn[];
  socials: SocialLink[];
  showSocialLinks: boolean;
  showTrustBadges: boolean;
  backgroundColor: string;
}

export interface SystemSettings {
  // معلومات عامة
  siteNameAr: string;
  siteNameEn: string;
  siteDescription: string;
  siteKeywords: string;
  defaultLang: "ar" | "en";
  defaultCurrency: "SAR" | "USD" | "AED";
  // معلومات التواصل
  emailMain: string;
  emailSupport: string;
  phone1: string;
  phone2: string;
  whatsapp: string;
  address: string;
  workingHours: string;
  // منصات التواصل
  facebook: string;
  instagram: string;
  twitter: string;
  youtube: string;
  tiktok: string;
  snapchat: string;
  // الهيدر
  header: HeaderSettings;
  // الفوتر
  footer: FooterSettings;
  // الدفع
  vatEnabled: boolean;
  vatRate: number;
  vatNumber: string;
  tabbyEnabled: boolean;
  tamaraEnabled: boolean;
  stripeEnabled: boolean;
  bankTransferEnabled: boolean;
}

export const defaultSystemSettings: SystemSettings = {
  siteNameAr: "ترافليون للسفر والسياحة",
  siteNameEn: "Traveliun Travel & Tourism",
  siteDescription: "ترافليون للسفر والسياحة - رحلات الأحلام مع خدمة فاخرة وأسعار منافسة",
  siteKeywords: "ترافليون, سفر, سياحة, حجز طيران, فنادق, رحلات",
  defaultLang: "ar",
  defaultCurrency: "SAR",
  emailMain: "booking@traveliun.com",
  emailSupport: "support@traveliun.com",
  phone1: "+966569222111",
  phone2: "",
  whatsapp: "+966569222111",
  address: "المملكة العربية السعودية - المدينة المنورة - الإسكان - شارع الهجرة",
  workingHours: "السبت - الخميس: 9ص - 10م | الجمعة: 2م - 10م",
  facebook: "https://facebook.com/traveliun",
  instagram: "https://instagram.com/traveliun",
  twitter: "https://twitter.com/traveliun",
  youtube: "",
  tiktok: "",
  snapchat: "",
  header: {
    siteName: "ترافليون",
    siteNameEn: "Traveliun",
    showTopBar: false,
    topBarText: "🎉 عروض حصرية لهذا الأسبوع - احجز الآن!",
    topBarPhone: "+966569222111",
    showSearchBar: true,
    showNotificationBell: true,
    showLoginButton: true,
    showFavoritesButton: true,
  },
  footer: {
    companyDescription: "ترافليون للسفر والسياحة - رحلات الأحلام مع خدمة فاخرة وأسعار منافسة. فريق متواجد في ماليزيا وتايلاند وإندونيسيا وتركيا.",
    copyrightText: "جميع الحقوق محفوظة لترافليون",
    showSocialLinks: true,
    showTrustBadges: true,
    backgroundColor: "#1a1a2e",
    socials: [
      { id: "1", platform: "facebook", url: "https://facebook.com/traveliun", is_active: true },
      { id: "2", platform: "instagram", url: "https://instagram.com/traveliun", is_active: true },
      { id: "3", platform: "twitter", url: "https://twitter.com/traveliun", is_active: true },
      { id: "4", platform: "youtube", url: "", is_active: false },
      { id: "5", platform: "tiktok", url: "", is_active: false },
      { id: "6", platform: "snapchat", url: "", is_active: false },
    ],
    columns: [
      {
        id: "1", title: "روابط سريعة", is_active: true, order: 1,
        links: [
          { id: "11", name: "الرئيسية", path: "/", is_active: true, order: 1 },
          { id: "12", name: "الوجهات", path: "/destinations", is_active: true, order: 2 },
          { id: "13", name: "من نحن", path: "/about", is_active: true, order: 3 },
          { id: "14", name: "تواصل معنا", path: "/contact", is_active: true, order: 4 },
          { id: "15", name: "نادي النخبة", path: "/loyalty", is_active: true, order: 5 },
          { id: "16", name: "انضم إلينا", path: "/careers", is_active: true, order: 6 },
        ],
      },
      {
        id: "2", title: "خدماتنا", is_active: true, order: 2,
        links: [
          { id: "21", name: "البرامج السياحية", path: "/programs", is_active: true, order: 1 },
          { id: "22", name: "شهر العسل", path: "/honeymoon", is_active: true, order: 2 },
          { id: "23", name: "العروض", path: "/offers", is_active: true, order: 3 },
          { id: "24", name: "الفنادق", path: "/hotels", is_active: true, order: 4 },
        ],
      },
      {
        id: "3", title: "الدعم", is_active: true, order: 3,
        links: [
          { id: "31", name: "سياسة الخصوصية", path: "/privacy", is_active: true, order: 1 },
          { id: "32", name: "الشروط والأحكام", path: "/terms", is_active: true, order: 2 },
          { id: "33", name: "خريطة الموقع", path: "/sitemap", is_active: true, order: 3 },
          { id: "34", name: "دعم العملاء", path: "/support", is_active: true, order: 4 },
        ],
      },
    ],
  },
  vatEnabled: true,
  vatRate: 15,
  vatNumber: "300000000000003",
  tabbyEnabled: false,
  tamaraEnabled: false,
  stripeEnabled: false,
  bankTransferEnabled: true,
};

export const systemSettingsService = {
  getSettings(): SystemSettings {
    try {
      const stored = localStorage.getItem(SETTINGS_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as SystemSettings;
        return {
          ...defaultSystemSettings,
          ...parsed,
          header: { ...defaultSystemSettings.header, ...(parsed.header || {}) },
          footer: {
            ...defaultSystemSettings.footer,
            ...(parsed.footer || {}),
            socials: parsed.footer?.socials ?? defaultSystemSettings.footer.socials,
            columns: parsed.footer?.columns ?? defaultSystemSettings.footer.columns,
          },
        };
      }
    } catch { /* يبقى الافتراضي */ }
    return defaultSystemSettings;
  },

  saveSettings(settings: SystemSettings): void {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    // إطلاق حدث لتحديث المكونات الأخرى
    window.dispatchEvent(new CustomEvent("system-settings-updated", { detail: settings }));
  },

  resetToDefault(): void {
    localStorage.removeItem(SETTINGS_KEY);
    window.dispatchEvent(new CustomEvent("system-settings-updated", { detail: defaultSystemSettings }));
  },

  // Hook مساعد: أي مكوّن يريد قراءة الاسم / الإعدادات الأساسية
  getSiteName(lang: "ar" | "en" = "ar"): string {
    const s = this.getSettings();
    return lang === "ar" ? s.header.siteName : s.header.siteNameEn;
  },
};



