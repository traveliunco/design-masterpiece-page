import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

/**
 * Hook للحفاظ على اتصال Supabase نشط ومنع توقف قاعدة البيانات
 * 
 * النظام المتكامل للـ Keep-Alive:
 * 
 * 1. Client-Side (هذا الـ Hook):
 *    - يعمل كل 5 دقائق من متصفح المستخدم
 *    - نشط فقط عندما يكون المستخدم متصل بالموقع
 *    - يضمن استجابة سريعة للمستخدمين النشطين
 * 
 * 2. Server-Side (Edge Function + Cron):
 *    - Edge Function: supabase/functions/keep-alive/index.ts
 *    - Cron Job: يعمل يومياً الساعة 6:00 صباحاً UTC
 *    - يضمن عدم توقف قاعدة البيانات حتى بدون مستخدمين
 * 
 * لا يوجد تعارض - النظامان يكملان بعضهما للحماية الكاملة
 */
export const useSupabaseKeepAlive = () => {
  useEffect(() => {
    // دالة للتحقق من الاتصال
    const pingSupabase = async () => {
      try {
        // استعلام بسيط للحفاظ على الاتصال نشط
        const { error } = await supabase
          .from('destinations')
          .select('id')
          .limit(1)
          .single();
        
        if (error && error.code !== 'PGRST116') {
          // PGRST116 = no rows returned (مقبول)
          console.warn('Supabase keep-alive ping failed:', error.message);
        } else {
          console.log('✅ Supabase keep-alive ping successful');
        }
      } catch (error) {
        console.error('Supabase keep-alive error:', error);
      }
    };

    // Ping فوري عند التحميل
    pingSupabase();

    // Ping كل 5 دقائق (300000 ms)
    const interval = setInterval(pingSupabase, 5 * 60 * 1000);

    // التنظيف عند إزالة المكون
    return () => {
      clearInterval(interval);
    };
  }, []);
};

export default useSupabaseKeepAlive;
