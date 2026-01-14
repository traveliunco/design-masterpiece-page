import { ReactNode } from "react";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

interface ContentCardProps {
  image?: string;
  badge?: string;
  badgeColor?: "gold" | "teal" | "red" | "green";
  title: string;
  description?: string;
  price?: string;
  priceLabel?: string;
  originalPrice?: string;
  duration?: string;
  rating?: number;
  href?: string;
  featured?: boolean;
  children?: ReactNode;
  className?: string;
}

/**
 * ContentCard - بطاقة المحتوى الموحدة
 */
const ContentCard = ({
  image,
  badge,
  badgeColor = "teal",
  title,
  description,
  price,
  priceLabel = "ابتداءً من",
  originalPrice,
  duration,
  rating,
  href,
  featured = false,
  children,
  className
}: ContentCardProps) => {
  const badgeColors = {
    gold: "bg-luxury-gold text-luxury-navy",
    teal: "bg-luxury-teal text-white",
    red: "bg-red-500 text-white",
    green: "bg-green-500 text-white"
  };

  const CardWrapper = href ? Link : "div";
  const wrapperProps = href ? { to: href } : {};

  return (
    <CardWrapper
      {...wrapperProps as any}
      className={cn(
        "group card-3d overflow-hidden block",
        featured && "md:col-span-2",
        className
      )}
    >
      {/* Image Section */}
      {image && (
        <div className="relative h-48 overflow-hidden">
          <img 
            src={image} 
            alt={title}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-luxury-navy/80 to-transparent" />
          
          {/* Badge */}
          {badge && (
            <div className={cn(
              "absolute top-4 right-4 rounded-full px-4 py-1 text-xs font-bold",
              badgeColors[badgeColor]
            )}>
              {badge}
            </div>
          )}
          
          {/* Rating */}
          {rating && (
            <div className="absolute top-4 left-4 glass-dark rounded-full px-3 py-1 flex items-center gap-1">
              <span className="text-luxury-gold">★</span>
              <span className="text-white text-xs font-bold">{rating}</span>
            </div>
          )}

          {/* Duration */}
          {duration && (
            <div className="absolute bottom-4 right-4 glass-dark rounded-lg px-3 py-1">
              <span className="text-white text-xs">{duration}</span>
            </div>
          )}
        </div>
      )}
      
      {/* Content Section */}
      <div className="p-6">
        <h3 className="text-title text-luxury-navy mb-2 group-hover:text-luxury-teal transition-colors">
          {title}
        </h3>
        
        {description && (
          <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
            {description}
          </p>
        )}

        {/* Custom Children */}
        {children}
        
        {/* Price Section */}
        {price && (
          <div className="flex items-center justify-between pt-4 border-t border-border">
            <div>
              <span className="text-muted-foreground text-xs">{priceLabel}</span>
              <div className="flex items-center gap-2">
                {originalPrice && (
                  <span className="text-muted-foreground line-through text-sm">{originalPrice}</span>
                )}
                <span className="text-luxury-teal font-bold text-lg">{price} ر.س</span>
              </div>
            </div>
            
            {href && (
              <div className="flex items-center gap-1 text-luxury-teal text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                <span>المزيد</span>
                <ArrowLeft className="w-4 h-4" />
              </div>
            )}
          </div>
        )}
      </div>
    </CardWrapper>
  );
};

export default ContentCard;
