/**
 * keep-alive.js
 * ═══════════════════════════════════════════════
 * سكريبت لإبقاء قاعدة بيانات Supabase حية
 * يمنع الإخماد التلقائي بعد 7 أيام غير نشاط (خطة Free)
 *
 * طريقة التشغيل:
 *   node keep-alive.js
 *
 * جدولة تلقائية (كل 5 أيام بـ cron على Linux/Mac):
 *   0 8 */5 * * cd /path/to/project && node keep-alive.js >> logs/keepalive.log 2>&1
 *
 * على Windows بـ Task Scheduler:
 *   Program: node
 *   Arguments: "D:\path\to\keep-alive.js"
 *   Trigger: كل 5 أيام
 * ═══════════════════════════════════════════════
 */

// ── الإعدادات ──────────────────────────────────────────────
// ضع البيانات مباشرة إذا لم يكن .env متاحاً
const SUPABASE_URL     = process.env.VITE_SUPABASE_URL     || "YOUR_SUPABASE_URL";
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_PUBLISHABLE_KEY || "YOUR_SUPABASE_ANON_KEY";

// الجدول الذي سيُستعلَم منه (أي جدول خفيف)
const PING_TABLE = "homepage_settings";

// ── وظيفة Ping ─────────────────────────────────────────────
async function pingSupabase() {
  const now = new Date().toLocaleString("ar-SA", { timeZone: "Asia/Riyadh" });
  console.log(`[${now}] 🔔 إرسال نبضة إلى Supabase...`);

  const url = `${SUPABASE_URL}/rest/v1/${PING_TABLE}?select=key&limit=1`;

  try {
    const res = await fetch(url, {
      headers: {
        "apikey": SUPABASE_ANON_KEY,
        "Authorization": `Bearer ${SUPABASE_ANON_KEY}`,
        "Content-Type": "application/json",
      },
    });

    if (res.ok) {
      console.log(`[${now}] ✅ نجاح! الاستجابة: ${res.status} | قاعدة البيانات نشطة`);
    } else {
      const body = await res.text();
      console.error(`[${now}] ⚠️  رمز الاستجابة: ${res.status} | ${body}`);
    }
  } catch (err) {
    console.error(`[${now}] ❌ خطأ في الاتصال:`, err.message);
  }
}

// ── تشغيل فوري ─────────────────────────────────────────────
pingSupabase();
