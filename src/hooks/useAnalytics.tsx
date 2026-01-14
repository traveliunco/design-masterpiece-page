/**
 * Hook للتكامل مع Google Analytics 4
 * يتتبع الصفحات والأحداث
 */

import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// معرف Google Analytics - يجب تحديثه بالمعرف الفعلي
const GA_MEASUREMENT_ID = 'G-XXXXXXXXXX';

// تعريف gtag للـ TypeScript
declare global {
    interface Window {
        gtag: (...args: any[]) => void;
        dataLayer: any[];
    }
}

/**
 * تهيئة Google Analytics
 */
export const initGA = () => {
    if (typeof window === 'undefined') return;

    // إضافة script الخاص بـ Google Analytics
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
    document.head.appendChild(script);

    // تهيئة gtag
    window.dataLayer = window.dataLayer || [];
    window.gtag = function gtag() {
        window.dataLayer.push(arguments);
    };
    window.gtag('js', new Date());
    window.gtag('config', GA_MEASUREMENT_ID, {
        page_path: window.location.pathname,
    });
};

/**
 * تتبع مشاهدة الصفحة
 */
export const trackPageView = (path: string, title?: string) => {
    if (typeof window === 'undefined' || !window.gtag) return;

    window.gtag('config', GA_MEASUREMENT_ID, {
        page_path: path,
        page_title: title,
    });
};

/**
 * تتبع حدث مخصص
 */
export const trackEvent = (
    action: string,
    category: string,
    label?: string,
    value?: number
) => {
    if (typeof window === 'undefined' || !window.gtag) return;

    window.gtag('event', action, {
        event_category: category,
        event_label: label,
        value: value,
    });
};

/**
 * أحداث التحويل المحددة مسبقاً
 */
export const trackConversion = {
    // تتبع بدء الحجز
    beginCheckout: (destination: string, price: number) => {
        trackEvent('begin_checkout', 'ecommerce', destination, price);
    },

    // تتبع إكمال الحجز
    purchase: (bookingId: string, destination: string, price: number) => {
        if (typeof window === 'undefined' || !window.gtag) return;

        window.gtag('event', 'purchase', {
            transaction_id: bookingId,
            value: price,
            currency: 'SAR',
            items: [{ item_name: destination }],
        });
    },

    // تتبع إضافة للمفضلة
    addToWishlist: (destination: string) => {
        trackEvent('add_to_wishlist', 'engagement', destination);
    },

    // تتبع مشاركة
    share: (destination: string, method: string) => {
        trackEvent('share', 'engagement', `${destination} via ${method}`);
    },

    // تتبع البحث
    search: (query: string) => {
        trackEvent('search', 'engagement', query);
    },

    // تتبع تسجيل الدخول
    login: (method: string) => {
        trackEvent('login', 'authentication', method);
    },

    // تتبع التسجيل
    signUp: (method: string) => {
        trackEvent('sign_up', 'authentication', method);
    },

    // تتبع النقر على واتساب
    whatsappClick: (source: string) => {
        trackEvent('whatsapp_click', 'contact', source);
    },

    // تتبع تحميل التطبيق
    appDownload: (platform: string) => {
        trackEvent('app_download', 'acquisition', platform);
    },
};

/**
 * Hook لتتبع الصفحات تلقائياً
 */
export const useAnalytics = () => {
    const location = useLocation();

    useEffect(() => {
        trackPageView(location.pathname + location.search, document.title);
    }, [location]);
};

/**
 * Hook مع تهيئة كاملة (استخدمه في App.tsx)
 */
export const useGoogleAnalytics = () => {
    const location = useLocation();

    useEffect(() => {
        // تهيئة GA عند أول تحميل
        initGA();
    }, []);

    useEffect(() => {
        // تتبع تغيير الصفحات
        trackPageView(location.pathname + location.search, document.title);
    }, [location]);
};

export default useAnalytics;
