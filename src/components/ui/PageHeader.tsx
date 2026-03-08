import { ReactNode } from "react";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

interface PageHeaderProps {
  title: ReactNode;
  subtitle?: string;
  badge?: string;
  badgeIcon?: ReactNode;
  backgroundImage?: string;
  showBackButton?: boolean;
  backPath?: string;
  children?: ReactNode;
}

const PageHeader = ({
  title,
  subtitle,
  badge,
  badgeIcon,
  backgroundImage,
  showBackButton = false,
  backPath = "/",
  children
}: PageHeaderProps) => {
  return (
    <section className="relative min-h-[30vh] md:min-h-[50vh] flex items-center overflow-hidden bg-luxury-navy pt-4 md:pt-28">
      {backgroundImage && (
        <div className="absolute inset-0">
          <img 
            src={backgroundImage} 
            alt="" 
            className="w-full h-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-luxury-navy/80 via-luxury-navy/70 to-luxury-navy" />
        </div>
      )}
      
      <div className="absolute top-0 right-0 w-[200px] md:w-[400px] h-[200px] md:h-[400px] bg-luxury-teal/10 rounded-full blur-[100px] md:blur-[150px]" />
      <div className="absolute bottom-0 left-0 w-[150px] md:w-[300px] h-[150px] md:h-[300px] bg-luxury-gold/10 rounded-full blur-[80px] md:blur-[100px]" />

      <div className="container px-4 relative z-10 py-8 md:py-16">
        {showBackButton && (
          <Link 
            to={backPath}
            className="hidden md:inline-flex items-center gap-2 text-white/70 hover:text-white mb-8 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>العودة</span>
          </Link>
        )}

        {badge && (
          <div className="inline-flex items-center gap-2 md:gap-3 glass-dark rounded-full px-4 md:px-5 py-2 md:py-2.5 mb-4 md:mb-6">
            {badgeIcon}
            <span className="text-xs md:text-sm font-medium text-white/90">{badge}</span>
          </div>
        )}

        <h1 className="text-2xl md:text-5xl lg:text-6xl font-bold text-white mb-3 md:mb-6 max-w-4xl leading-tight">
          {title}
        </h1>

        {subtitle && (
          <p className="text-sm md:text-xl text-white/70 max-w-2xl leading-relaxed">
            {subtitle}
          </p>
        )}

        {children}
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-10 md:h-20 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
};

export default PageHeader;
