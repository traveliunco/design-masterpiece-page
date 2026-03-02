import { Link } from "react-router-dom";
import { Phone, Mail, MapPin, Facebook, Instagram, Twitter, Linkedin, Plane } from "lucide-react";

const PremiumFooter = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    services: [
      { name: "حجز طيران", path: "/amadeus-flights" },
      { name: "فنادق ومنتجعات", path: "/hotels" },
      { name: "برامج سياحية", path: "/programs" },
      // { name: "تأجير سيارات", path: "/car-rental" }, /* HIDDEN */
      // { name: "تأشيرات", path: "/visas" }, /* HIDDEN */
      // { name: "تأمين سفر", path: "/insurance" }, /* HIDDEN */
    ],
    company: [
      { name: "من نحن", path: "/about" },
      { name: "تواصل معنا", path: "/contact" },
      { name: "نادي النخبة", path: "/loyalty" },
      { name: "الوظائف", path: "/careers" },
      { name: "المدونة", path: "/blog" },
    ],
    support: [
      { name: "مركز المساعدة", path: "/customer-support" },
      { name: "ضمان الجودة", path: "/service-guarantee" },
      { name: "تابي", path: "/tabby" },
      { name: "تمارا", path: "/tamara" },
    ],
  };

  const socialLinks = [
    { Icon: Facebook, href: "https://facebook.com/traveliun", label: "Facebook" },
    { Icon: Instagram, href: "https://instagram.com/traveliun", label: "Instagram" },
    { Icon: Twitter, href: "https://twitter.com/traveliun", label: "Twitter" },
    { Icon: Linkedin, href: "https://linkedin.com/company/traveliun", label: "LinkedIn" },
  ];

  return (
    <footer className="bg-gradient-to-b from-luxury-navy to-[#0a1628] text-white relative overflow-hidden pb-24 md:pb-0">
      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-luxury-teal/10 rounded-full blur-[200px]" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-luxury-gold/10 rounded-full blur-[150px]" />
      
      {/* Main Footer */}
      <div className="container px-4 py-20 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-3 mb-6">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-luxury-teal to-emerald-600 flex items-center justify-center shadow-glow-teal">
                <Plane className="w-7 h-7 text-white" />
              </div>
              <div>
                <span className="text-3xl font-bold text-white">ترافليون</span>
                <span className="text-xs block text-white/50 tracking-[0.3em]">TRAVELIUN</span>
              </div>
            </Link>
            
            <p className="text-white/60 mb-8 leading-relaxed max-w-md">
              شركة سعودية رائدة في مجال السياحة والسفر. نقدم خدمات متميزة وتجارب لا تُنسى منذ عام ٢٠١٨.
            </p>

            {/* Contact Info */}
            <div className="space-y-4 mb-8">
              <a href="tel:+966569222111" className="flex items-center gap-3 text-white/70 hover:text-luxury-gold transition-colors">
                <Phone className="w-5 h-5" />
                <span>+966 56 922 2111</span>
              </a>
              <a href="mailto:info@traveliun.com" className="flex items-center gap-3 text-white/70 hover:text-luxury-gold transition-colors">
                <Mail className="w-5 h-5" />
                <span>info@traveliun.com</span>
              </a>
              <div className="flex items-center gap-3 text-white/70">
                <MapPin className="w-5 h-5" />
                <span>الرياض، المملكة العربية السعودية</span>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="w-12 h-12 rounded-xl glass-button flex items-center justify-center hover:bg-luxury-teal hover:border-luxury-teal transition-all"
                >
                  <social.Icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-bold text-white mb-6">خدماتنا</h3>
            <ul className="space-y-3">
              {footerLinks.services.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-white/60 hover:text-luxury-gold transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-lg font-bold text-white mb-6">الشركة</h3>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-white/60 hover:text-luxury-gold transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-lg font-bold text-white mb-6">الدعم</h3>
            <ul className="space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-white/60 hover:text-luxury-gold transition-colors"
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
      <div className="border-t border-white/10">
        <div className="container px-4 py-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-white/50 text-sm text-center md:text-right">
            © {currentYear} ترافليون للسفر والسياحة. جميع الحقوق محفوظة.
          </p>
          <div className="flex flex-wrap justify-center gap-6 text-sm">
            <Link to="/privacy" className="text-white/50 hover:text-luxury-gold transition-colors">
              سياسة الخصوصية
            </Link>
            <Link to="/terms" className="text-white/50 hover:text-luxury-gold transition-colors">
              الشروط والأحكام
            </Link>
            <Link to="/sitemap" className="text-white/50 hover:text-luxury-gold transition-colors">
              خريطة الموقع
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default PremiumFooter;
