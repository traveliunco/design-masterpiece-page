import { Link } from 'react-router-dom';
import { MapPin, Clock, Thermometer, Hotel, Star, X, ArrowLeft, Sparkles } from 'lucide-react';
import { City, Country } from '@/data/southeast-asia';

interface CityCardProps {
  city: City;
  country: Country;
  onClose: () => void;
  onBack: () => void;
}

export default function CityCard({ city, country, onClose, onBack }: CityCardProps) {
  return (
    <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl overflow-hidden border border-white/20 animate-in slide-in-from-right duration-300">
      {/* Header Image */}
      <div className="relative h-48">
        <img
          src={city.image}
          alt={city.nameAr}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
        
        {/* Buttons */}
        <div className="absolute top-3 left-3 flex gap-2">
          <button
            onClick={onBack}
            className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/40 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/40 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        
        {/* Rating Badge */}
        <div className="absolute top-3 right-3 flex items-center gap-1 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full">
          <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
          <span className="text-xs font-bold text-gray-800">4.9</span>
        </div>
        
        {/* City Name */}
        <div className="absolute bottom-4 right-4 text-right">
          <h3 className="text-2xl font-bold text-white mb-1">{city.nameAr}</h3>
          <p className="text-white/70 text-sm flex items-center gap-1 justify-end">
            <MapPin className="w-3 h-3" />
            {country.nameAr}
          </p>
        </div>
      </div>
      
      {/* Content */}
      <div className="p-5 space-y-4">
        {/* Description */}
        <p className="text-gray-600 text-sm leading-relaxed">
          {city.description}
        </p>
        
        {/* Quick Info Grid */}
        <div className="grid grid-cols-3 gap-2">
          <QuickInfo 
            icon={Clock} 
            label="أفضل وقت" 
            value={city.bestTime} 
          />
          <QuickInfo 
            icon={Thermometer} 
            label="الطقس" 
            value={typeof city.averageTemp === 'string' ? city.averageTemp : city.averageTemp.summer} 
          />
          <QuickInfo 
            icon={Hotel} 
            label="السكن" 
            value={typeof city.accommodation === 'string' ? city.accommodation.split(' ')[0] : city.accommodation.budget} 
          />
        </div>
        
        {/* Highlights */}
        <div>
          <h4 className="text-sm font-bold text-gray-800 mb-2 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-teal-500" />
            أبرز المعالم
          </h4>
          <div className="flex flex-wrap gap-1">
            {city.highlights.slice(0, 4).map((highlight, idx) => (
              <span
                key={idx}
                className="text-xs bg-teal-50 text-teal-700 px-2 py-1 rounded-full border border-teal-100"
              >
                {highlight}
              </span>
            ))}
          </div>
        </div>
        
        {/* Attractions Preview */}
        <div>
          <h4 className="text-sm font-bold text-gray-800 mb-2">
            الأماكن السياحية ({Array.isArray(city.attractions) ? city.attractions.length : 0})
          </h4>
          <div className="space-y-1 max-h-32 overflow-y-auto custom-scrollbar">
            {(Array.isArray(city.attractions) ? city.attractions.slice(0, 5) : []).map((attraction, idx) => (
              <div
                key={idx}
                className="flex items-center gap-2 text-sm text-gray-600 py-1"
              >
                <span className="w-1.5 h-1.5 bg-teal-400 rounded-full" />
                <span>{typeof attraction === 'string' ? attraction : (attraction as any).nameAr}</span>
              </div>
            ))}
          </div>
        </div>
        
        {/* Action Button */}
        <Link
          to={`/country/${country.id}/city/${city.id}`}
          className="block w-full py-3 text-center bg-gradient-to-r from-teal-500 to-cyan-500 text-white rounded-xl font-bold hover:from-teal-400 hover:to-cyan-400 transition-all shadow-lg shadow-teal-500/20"
        >
          اكتشف {city.nameAr}
        </Link>
      </div>
    </div>
  );
}

function QuickInfo({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <div className="text-center p-2 bg-gray-50 rounded-lg">
      <Icon className="w-4 h-4 text-teal-500 mx-auto mb-1" />
      <p className="text-[10px] text-gray-400">{label}</p>
      <p className="text-xs font-bold text-gray-700 truncate">{value}</p>
    </div>
  );
}
