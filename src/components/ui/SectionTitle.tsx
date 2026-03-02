import { ReactNode } from "react";

interface SectionTitleProps {
  badge?: string;
  badgeIcon?: ReactNode;
  title: string;
  highlight?: string;
  subtitle?: string;
  centered?: boolean;
  dark?: boolean;
}

/**
 * SectionTitle - عنوان القسم الموحد
 */
const SectionTitle = ({
  badge,
  badgeIcon = null,
  title,
  highlight,
  subtitle,
  centered = true,
  dark = false
}: SectionTitleProps) => {
  return (
    <div className={`mb-16 ${centered ? 'text-center' : ''}`}>
      {/* Badge */}
      {badge && (
        <div className={`inline-flex items-center gap-3 ${dark ? 'glass-dark' : 'glass-premium'} rounded-full px-6 py-3 mb-6`}>
          {badgeIcon}
          <span className={`text-sm font-semibold ${dark ? 'text-white/80' : 'text-luxury-navy'}`}>
            {badge}
          </span>
        </div>
      )}

      {/* Title */}
      <h2 className={`text-section mb-6 ${dark ? 'text-white' : 'text-luxury-navy'}`}>
        {title}{" "}
        {highlight && (
          <span className={dark ? 'text-gradient-gold' : 'text-gradient-teal'}>
            {highlight}
          </span>
        )}
      </h2>

      {/* Subtitle */}
      {subtitle && (
        <p className={`text-lg max-w-2xl ${centered ? 'mx-auto' : ''} ${dark ? 'text-white/60' : 'text-muted-foreground'}`}>
          {subtitle}
        </p>
      )}
    </div>
  );
};

export default SectionTitle;
