import { Link } from 'react-router-dom';
import { MapPin, Globe, Calendar, CreditCard, Users, X, ChevronLeft } from 'lucide-react';
import { Country, City } from '@/data/southeast-asia';
import { cn } from '@/lib/utils';

interface CountryCardProps {
  country: Country;
  onClose: () => void;
  onCitySelect: (city: City) => void;
}

export default function CountryCard({ country, onClose, onCitySelect }: CountryCardProps) {
  const getFlag = (id: string) => {
    const flags: Record<string, string> = {
      'malaysia': '🇲🇾', 'thailand': '🇹🇭', 'indonesia': '🇮🇩',
      'singapore': '🇸🇬', 'vietnam': '🇻🇳', 'philippines': '🇵🇭', 'turkey': '🇹🇷'
    };
    return flags[id] || '🌍';
  };

  return (
    <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl overflow-hidden border border-white/20 animate-in slide-in-from-right duration-300">
      {/* Header Image */}
      <div className="relative h-40">
        <img
          src={country.coverImage}
          alt={country.nameAr}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 left-3 w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/40 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
        
        {/* Country Flag & Name */}
        <div className="absolute bottom-4 right-4 text-right">
          <div className="flex items-center gap-2 justify-end mb-1">
            <span className="text-2xl">{getFlag(country.id)}</span>
            <h3 className="text-2xl font-bold text-white">{country.nameAr}</h3>
          </div>
          <p className="text-white/70 text-sm">{country.nameEn}</p>
        </div>
      </div>
      
      {/* Content */}
      <div className="p-5 space-y-4">
        {/* Description */}
        <p className="text-gray-600 text-sm leading-relaxed">
          {country.description}
        </p>
        
        {/* Quick Info */}
        <div className="grid grid-cols-2 gap-3">
          <InfoBadge icon={CreditCard} label="العملة" value={country.currency.split(' ')[0]} />
          <InfoBadge icon={Globe} label="اللغة" value={country.language.split(' ')[0]} />
          <InfoBadge icon={Calendar} label="أفضل وقت" value={country.bestSeason} />
          <InfoBadge icon={Users} label="الفيزا" value={country.visa.split(' ')[0]} />
        </div>
        
        {/* Cities List */}
        <div>
          <h4 className="text-sm font-bold text-gray-800 mb-3 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-teal-500" />
            المدن السياحية ({country.cities.length})
          </h4>
          <div className="space-y-2 max-h-48 overflow-y-auto custom-scrollbar">
            {country.cities.map((city) => (
              <button
                key={city.id}
                onClick={() => onCitySelect(city)}
                className="w-full flex items-center gap-3 p-3 rounded-xl bg-gray-50 hover:bg-teal-50 border border-transparent hover:border-teal-200 transition-all group text-right"
              >
                <img
                  src={city.image}
                  alt={city.nameAr}
                  className="w-12 h-12 rounded-lg object-cover"
                />
                <div className="flex-1">
                  <p className="font-bold text-gray-800 group-hover:text-teal-600 transition-colors text-sm">
                    {city.nameAr}
                  </p>
                  <p className="text-xs text-gray-500">{city.nameEn}</p>
                </div>
                <ChevronLeft className="w-4 h-4 text-gray-400 group-hover:text-teal-500 transition-colors" />
              </button>
            ))}
          </div>
        </div>
        
        {/* Action Button */}
        <Link
          to={`/country/${country.id}`}
          className="block w-full py-3 text-center bg-gradient-to-r from-teal-500 to-cyan-500 text-white rounded-xl font-bold hover:from-teal-400 hover:to-cyan-400 transition-all shadow-lg shadow-teal-500/20"
        >
          استكشف {country.nameAr}
        </Link>
      </div>
    </div>
  );
}

function InfoBadge({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
      <Icon className="w-4 h-4 text-teal-500" />
      <div className="text-right">
        <p className="text-[10px] text-gray-400">{label}</p>
        <p className="text-xs font-bold text-gray-700">{value}</p>
      </div>
    </div>
  );
}
