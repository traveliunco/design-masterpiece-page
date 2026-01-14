import { useEffect } from 'react';

interface SEOProps {
    title: string;
    description?: string;
    keywords?: string;
    image?: string;
    url?: string;
}

/**
 * مكون SEO لتحسين محركات البحث
 * يقوم بتحديث عنوان الصفحة والوصف تلقائياً
 */
export const useSEO = ({
    title,
    description = 'ترافليون - أفضل شركة سياحة سعودية. احجز رحلتك الآن مع أفضل العروض والأسعار.',
    keywords = 'سياحة, سفر, حجز فنادق, تذاكر طيران, برامج سياحية, ترافليون, السعودية',
    image = '/og-image.jpg',
    url = 'https://traveliun.com',
}: SEOProps) => {
    useEffect(() => {
        // تحديث عنوان الصفحة
        document.title = `${title} | ترافليون`;

        // تحديث الوصف
        const metaDescription = document.querySelector('meta[name="description"]');
        if (metaDescription) {
            metaDescription.setAttribute('content', description);
        }

        // تحديث الكلمات المفتاحية
        const metaKeywords = document.querySelector('meta[name="keywords"]');
        if (metaKeywords) {
            metaKeywords.setAttribute('content', keywords);
        }

        // Open Graph
        const ogTitle = document.querySelector('meta[property="og:title"]');
        if (ogTitle) ogTitle.setAttribute('content', `${title} | ترافليون`);

        const ogDescription = document.querySelector('meta[property="og:description"]');
        if (ogDescription) ogDescription.setAttribute('content', description);

        const ogImage = document.querySelector('meta[property="og:image"]');
        if (ogImage) ogImage.setAttribute('content', image);

        const ogUrl = document.querySelector('meta[property="og:url"]');
        if (ogUrl) ogUrl.setAttribute('content', url);

        // Twitter Cards
        const twitterTitle = document.querySelector('meta[name="twitter:title"]');
        if (twitterTitle) twitterTitle.setAttribute('content', `${title} | ترافليون`);

        const twitterDescription = document.querySelector('meta[name="twitter:description"]');
        if (twitterDescription) twitterDescription.setAttribute('content', description);

    }, [title, description, keywords, image, url]);
};

export default useSEO;
