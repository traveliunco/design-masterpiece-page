/**
 * useSupabaseKeepAlive.ts
 * ════════════════════════════════════════
 * Hook يُرسل نبضة خفيفة لـ Supabase أثناء فتح الموقع
 * يعمل كل ساعة (3600 ثانية) في الخلفية
 *
 * الاستخدام في App.tsx:
 *   import { useSupabaseKeepAlive } from "@/hooks/useSupabaseKeepAlive";
 *   // داخل مكون App:
 *   useSupabaseKeepAlive();
 * ════════════════════════════════════════
 */
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

const PING_INTERVAL_MS = 60 * 60 * 1000; // كل ساعة

export function useSupabaseKeepAlive() {
  useEffect(() => {
    const ping = async () => {
      try {
        // استعلام خفيف جداً — لا يحمّل أي بيانات ثقيلة
        await (supabase as any)
          .from("homepage_settings")
          .select("key")
          .limit(1);
        console.debug("[KeepAlive] ✅ Supabase نشطة");
      } catch {
        // لا نُظهر خطأ للمستخدم — الـ ping اختياري
        console.debug("[KeepAlive] ⚠️  فشل الاتصال (ليس خطراً)");
      }
    };

    // نبضة متأخرة عند بدء الجلسة (لا تحمّل التطبيق عند الفتح)
    const initialDelay = setTimeout(ping, 30_000);

    // نبضة دورية كل ساعة
    const interval = setInterval(ping, PING_INTERVAL_MS);

    return () => { clearTimeout(initialDelay); clearInterval(interval); };
  }, []);
}
