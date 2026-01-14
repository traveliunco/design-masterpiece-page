/**
 * مكون Breadcrumbs للتنقل
 * يعرض مسار الصفحات بشكل احترافي
 */

import { Link, useLocation } from "react-router-dom";
import { ChevronLeft, Home } from "lucide-react";
import { cn } from "@/lib/utils";

interface BreadcrumbItem {
    label: string;
    path?: string;
}

interface BreadcrumbsProps {
    items?: BreadcrumbItem[];
    className?: string;
}

// خريطة المسارات للعناوين العربية
const pathLabels: Record<string, string> = {
    "": "الرئيسية",
    destinations: "الوجهات",
    offers: "العروض",
    honeymoon: "شهر العسل",
    booking: "الحجز",
    hotels: "الفنادق",
    flights: "الطيران",
    programs: "البرامج",
    about: "من نحن",
    contact: "اتصل بنا",
    "car-rental": "تأجير السيارات",
    visas: "التأشيرات",
    insurance: "التأمين",
    admin: "لوحة التحكم",
    login: "تسجيل الدخول",
    register: "إنشاء حساب",
};

/**
 * يحول معرف الوجهة إلى اسم عربي
 */
const getDestinationName = (id: string): string => {
    const destinations: Record<string, string> = {
        malaysia: "ماليزيا",
        thailand: "تايلاند",
        turkey: "تركيا",
        indonesia: "إندونيسيا",
        maldives: "المالديف",
        georgia: "جورجيا",
        azerbaijan: "أذربيجان",
    };
    return destinations[id] || id;
};

export const Breadcrumbs = ({ items, className }: BreadcrumbsProps) => {
    const location = useLocation();

    // إذا لم يتم تمرير items، نولدها من المسار الحالي
    const breadcrumbItems = items || generateBreadcrumbs(location.pathname);

    if (breadcrumbItems.length <= 1) return null;

    return (
        <nav
            aria-label="التنقل التفصيلي"
            className={cn(
                "flex items-center gap-2 text-sm text-muted-foreground py-4",
                className
            )}
        >
            <Link
                to="/"
                className="flex items-center gap-1 hover:text-primary transition-colors"
            >
                <Home className="w-4 h-4" />
                <span className="sr-only">الرئيسية</span>
            </Link>

            {breadcrumbItems.map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                    <ChevronLeft className="w-4 h-4 text-muted-foreground/50" />
                    {item.path && index < breadcrumbItems.length - 1 ? (
                        <Link
                            to={item.path}
                            className="hover:text-primary transition-colors"
                        >
                            {item.label}
                        </Link>
                    ) : (
                        <span className="text-foreground font-medium">{item.label}</span>
                    )}
                </div>
            ))}
        </nav>
    );
};

/**
 * يولد breadcrumbs تلقائياً من المسار
 */
function generateBreadcrumbs(pathname: string): BreadcrumbItem[] {
    const segments = pathname.split("/").filter(Boolean);
    const breadcrumbs: BreadcrumbItem[] = [];
    let currentPath = "";

    for (let i = 0; i < segments.length; i++) {
        const segment = segments[i];
        currentPath += `/${segment}`;

        // تحقق من نوع المسار
        if (i === 0) {
            // المستوى الأول - القسم الرئيسي
            breadcrumbs.push({
                label: pathLabels[segment] || segment,
                path: currentPath,
            });
        } else if (segments[0] === "destinations" && i === 1) {
            // صفحة تفاصيل الوجهة
            breadcrumbs.push({
                label: getDestinationName(segment),
                path: currentPath,
            });
        } else {
            // مسارات أخرى
            breadcrumbs.push({
                label: pathLabels[segment] || segment,
                path: currentPath,
            });
        }
    }

    return breadcrumbs;
}

export default Breadcrumbs;
