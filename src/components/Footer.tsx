import { Link } from "react-router-dom";
import { Phone, Mail, MapPin, Clock, Facebook, Instagram, Twitter } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-charcoal text-white">
      {/* Main Footer */}
      <div className="container py-20 px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16">
          {/* Company Info */}
          <div>
            <div className="mb-8">
              <span className="font-editorial text-4xl text-white">ترافليون</span>
              <span className="text-xs block text-white/40 mt-1 font-modern">Traveliun</span>
            </div>
            <p className="text-white/60 mb-8 leading-relaxed font-modern">
              ترافليون للسفر والسياحة - رحلات الأحلام مع خدمة فاخرة وأسعار منافسة. 
              فريق متواجد في ماليزيا وتايلاند وإندونيسيا وتركيا.
            </p>
            <div className="flex gap-4">
              {[
                { Icon: Facebook, href: "https://facebook.com/traveliun", label: "Facebook" },
                { Icon: Instagram, href: "https://instagram.com/traveliun", label: "Instagram" },
                { Icon: Twitter, href: "https://twitter.com/traveliun", label: "Twitter" },
              ].map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center hover:bg-aurora-indigo transition-colors border border-white/10"
                >
                  <social.Icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-black text-white mb-8 font-modern">روابط سريعة</h3>
            <ul className="space-y-4">
              {[
                { name: "الرئيسية", path: "/" },
                { name: "الوجهات", path: "/destinations" },
                { name: "نادي النخبة", path: "/loyalty" },
                { name: "انضم إلينا", path: "/careers" },
                { name: "من نحن", path: "/about" },
                { name: "تواصل معنا", path: "/contact" },
              ].map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-white/50 hover:text-aurora-indigo transition-colors inline-block font-modern"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-xl font-black text-white mb-8 font-modern">خدماتنا</h3>
            <ul className="space-y-4">
              {[
                { name: "رحلات الطيران", path: "/amadeus-flights" },
                { name: "حجز الفنادق", path: "/hotels" },
                { name: "البرامج السياحية", path: "/programs" },
                { name: "تأجير السيارات", path: "/car-rental" },
                { name: "التأشيرات", path: "/visas" },
                { name: "تأمين السفر", path: "/insurance" },
              ].map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-white/50 hover:text-aurora-indigo transition-colors inline-block font-modern"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & Support */}
          <div>
            <h3 className="text-xl font-black text-white mb-8 font-modern">الدعم والضمان</h3>
            <ul className="space-y-4">
               {[
                { name: "دليل الخدمات", path: "/service-info" },
                { name: "ضمان الجودة", path: "/service-guarantee" },
                { name: "مركز المساعدة", path: "/customer-support" },
                { name: "الدفع عبر تابي", path: "/tabby" },
                { name: "الدفع عبر تمارا", path: "/tamara" },
              ].map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-white/50 hover:text-aurora-indigo transition-colors inline-block font-modern"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/5">
        <div className="container py-8 px-4 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-white/40 text-sm font-modern">
            © {currentYear} ترافليون للسفر والسياحة. جميع الحقوق محفوظة
          </p>
          <div className="flex flex-wrap justify-center gap-8 text-sm">
            <Link to="/sitemap" className="text-white/40 hover:text-aurora-indigo transition-colors font-modern">
              خريطة الموقع
            </Link>
            <Link to="/privacy" className="text-white/40 hover:text-aurora-indigo transition-colors font-modern">
              سياسة الخصوصية
            </Link>
            <Link to="/terms" className="text-white/40 hover:text-aurora-indigo transition-colors font-modern">
              الشروط والأحكام
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;