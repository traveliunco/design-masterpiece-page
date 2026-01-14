import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Home, Search, ArrowRight } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen">
      <Header />
      
      <div className="flex min-h-[70vh] items-center justify-center bg-muted">
        <div className="container text-center py-20">
          {/* 404 Number */}
          <div className="relative mb-8">
            <h1 className="text-[150px] md:text-[200px] font-bold text-primary/10 leading-none select-none">
              404
            </h1>
            <div className="absolute inset-0 flex items-center justify-center">
              <Search className="w-20 h-20 md:w-32 md:h-32 text-primary/30" />
            </div>
          </div>

          {/* Message */}
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            عذراً! الصفحة غير موجودة
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-md mx-auto">
            يبدو أن الصفحة التي تبحث عنها غير موجودة أو تم نقلها إلى مكان آخر
          </p>

          {/* Actions */}
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/">
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-8 py-6 text-lg">
                <Home className="w-5 h-5 ml-2" />
                العودة للرئيسية
              </Button>
            </Link>
            <Link to="/destinations">
              <Button variant="outline" className="rounded-full px-8 py-6 text-lg">
                استكشف الوجهات
                <ArrowRight className="w-5 h-5 mr-2" />
              </Button>
            </Link>
          </div>

          {/* Help Text */}
          <p className="text-sm text-muted-foreground mt-12">
            هل تحتاج مساعدة؟{" "}
            <a 
              href="https://api.whatsapp.com/send?phone=966569222111" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary hover:underline font-medium"
            >
              تواصل معنا عبر الواتساب
            </a>
          </p>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default NotFound;
