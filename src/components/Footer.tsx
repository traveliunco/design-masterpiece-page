import { Link } from "react-router-dom";
import { Phone, Mail, MapPin, Clock, Facebook, Instagram, Twitter, ShieldCheck, Youtube, Linkedin } from "lucide-react";
import { systemSettingsService } from "@/services/adminDataService";
import { useSystemSettings } from "@/hooks/useSystemSettings";

const getSocialIcon = (platform: string) => {
  switch (platform.toLowerCase()) {
    case 'facebook': return Facebook;
    case 'instagram': return Instagram;
    case 'twitter': return Twitter;
    case 'youtube': return Youtube;
    case 'linkedin': return Linkedin;
    default: return MapPin; // fallback
  }
};

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const sysSettings = useSystemSettings();

  const { footer, header } = sysSettings;
  const activeSocials = footer.socials.filter(s => s.is_active);
  const activeColumns = footer.columns.filter(c => c.is_active).sort((a, b) => a.order - b.order);

  return (
    <footer className="text-white" style={{ backgroundColor: footer.backgroundColor || "#1a1a2e" }}>
      {/* Main Footer */}
      <div className="container py-20 px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16">
          {/* Company Info */}
          <div>
            <div className="mb-8">
              <span className="font-editorial text-4xl text-white">{header.siteName || "ترافليون"}</span>
              <span className="text-xs block text-white/40 mt-1 font-modern uppercase tracking-widest">{header.siteNameEn || "Traveliun"}</span>
            </div>
            <p className="text-white/60 mb-8 leading-relaxed font-modern">
              {footer.companyDescription}
            </p>
            {footer.showSocialLinks && activeSocials.length > 0 && (
              <div className="flex gap-4 flex-wrap">
                {activeSocials.map((social) => {
                  const Icon = getSocialIcon(social.platform);
                  return (
                    <a
                      key={social.id}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={social.platform}
                      className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors border border-white/10"
                    >
                      <Icon className="w-4 h-4" />
                    </a>
                  );
                })}
              </div>
            )}
          </div>

          {/* Dynamic Columns */}
          {activeColumns.map(col => (
            <div key={col.id}>
              <h3 className="text-xl font-black text-white mb-8 font-modern">{col.title}</h3>
              <ul className="space-y-4">
                {col.links.filter(l => l.is_active).sort((a,b) => a.order - b.order).map(link => (
                  <li key={link.id}>
                    <Link
                      to={link.path}
                      className="text-white/50 hover:text-white transition-colors inline-block font-modern"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/5">
        <div className="container py-8 px-4 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-white/40 text-sm font-modern">
            © {currentYear} {footer.copyrightText || "جميع الحقوق محفوظة"}
          </p>
          <div className="flex flex-wrap justify-center gap-8 text-sm">
            {footer.showTrustBadges && (
              <div className="flex items-center gap-2 opacity-70">
                {sysSettings.stripeEnabled && <span className="font-bold text-blue-300">Stripe</span>}
                {sysSettings.tabbyEnabled && <span className="font-bold text-green-300">Tabby</span>}
                {sysSettings.tamaraEnabled && <span className="font-bold text-orange-300">Tamara</span>}
              </div>
            )}
            
            <Link
              to="/admin"
              className="text-white/15 hover:text-white/50 transition-colors font-modern flex items-center gap-1 ml-4"
              title="لوحة التحكم"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>الإدارة</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;