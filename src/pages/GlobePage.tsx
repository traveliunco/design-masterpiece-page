import { useState, lazy, Suspense } from 'react';
import { Globe, Search, Plane, MapPin, Info, X, Star } from 'lucide-react';
import { Country, City, southeastAsiaCountries } from '@/data/southeast-asia';
import { Airport, saudiAirports, internationalAirports } from '@/data/airports';
import { calculateDistance } from '@/utils/distanceUtils';
import Nav3D from '@/components/Nav3D';
import PremiumFooter from '@/components/PremiumFooter';
import CountryCard from '@/components/globe/CountryCard';
import CityCard from '@/components/globe/CityCard';
import { cn } from '@/lib/utils';

// Lazy load the 3D globe for performance
const Globe3D = lazy(() => import('@/components/globe/Globe3D'));

export default function GlobePage() {
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const [selectedCity, setSelectedCity] = useState<City | null>(null);
  const [selectedAirport, setSelectedAirport] = useState<Airport | null>(null);
  const [selectedDestination, setSelectedDestination] = useState<{ lat: number; lng: number } | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showInfo, setShowInfo] = useState(true);

  const handleCountrySelect = (country: Country | null) => {
    setSelectedCountry(country);
    setSelectedCity(null);
    if (country) {
      setSelectedDestination(country.coordinates);
    }
  };

  const handleCitySelect = (city: City | null, country: Country | null) => {
    setSelectedCity(city);
    if (city) {
      setSelectedDestination(city.coordinates);
    }
  };

  const handleFlightSelect = (from: Airport, to: Airport) => {
    setSelectedAirport(from);
    setSelectedDestination({ lat: to.lat, lng: to.lng });
  };

  const handleCloseCards = () => {
    setSelectedCountry(null);
    setSelectedCity(null);
  };

  const handleBackToCountry = () => {
    setSelectedCity(null);
  };

  // البحث في الدول والمدن
  const filteredCountries = southeastAsiaCountries.filter(country => 
    country.nameAr.includes(searchQuery) || 
    country.nameEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
    country.cities.some(city => 
      city.nameAr.includes(searchQuery) || 
      city.nameEn.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  return (
    <div className="min-h-screen bg-slate-900">
      <Nav3D />
      
      <main className="pt-20">
        {/* Hero Header with Inline Distance Calculator */}
        <section className="relative py-3 px-4 border-b border-white/10">
          <div className="container relative z-10 flex items-center justify-between gap-4 flex-wrap">
            {/* Title */}
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-teal-500/20 rounded-full flex items-center justify-center">
                <Globe className="w-4 h-4 text-teal-400" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-white">
                  استكشف <span className="text-teal-400">وجهاتنا</span>
                </h1>
              </div>
            </div>
            
            {/* Inline Distance Calculator */}
            <div className="flex items-center gap-2 bg-white/5 backdrop-blur-sm rounded-lg p-2 border border-white/10 flex-1 max-w-xl">
              <Plane className="w-4 h-4 text-teal-400" />
              <select
                value={selectedAirport?.code || 'RUH'}
                onChange={(e) => {
                  const airport = saudiAirports.find(a => a.code === e.target.value);
                  if (airport) setSelectedAirport(airport);
                }}
                className="bg-transparent text-white text-sm border-none focus:outline-none cursor-pointer"
              >
                {saudiAirports.map(a => (
                  <option key={a.code} value={a.code} className="bg-slate-800">{a.city}</option>
                ))}
              </select>
              <span className="text-white/30">→</span>
              <select
                value=""
                onChange={(e) => {
                  const airport = internationalAirports.find(a => a.code === e.target.value);
                  if (airport && selectedAirport) {
                    setSelectedDestination({ lat: airport.lat, lng: airport.lng });
                    handleFlightSelect(selectedAirport, airport);
                  }
                }}
                className="bg-transparent text-white text-sm border-none focus:outline-none cursor-pointer flex-1"
              >
                <option value="" className="bg-slate-800">اختر الوجهة...</option>
                {internationalAirports.map(a => (
                  <option key={a.code} value={a.code} className="bg-slate-800">{a.city}</option>
                ))}
              </select>
              {selectedDestination && selectedAirport && (
                <span className="text-teal-400 text-xs font-bold whitespace-nowrap">
                  {Math.round(calculateDistance(selectedAirport.lat, selectedAirport.lng, selectedDestination.lat, selectedDestination.lng))} كم
                </span>
              )}
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="container px-4 pb-12">
          <div className="grid lg:grid-cols-4 gap-4">
            {/* Sidebar - Compact */}
            <div className="lg:col-span-1 space-y-3 order-2 lg:order-1">
              {/* Search - Compact */}
              <div className="relative">
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="ابحث..."
                  className="w-full pr-9 pl-3 py-2 text-sm bg-white/10 backdrop-blur-sm border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-teal-500 transition-colors"
                />
              </div>

              {/* Countries List - Compact */}
              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-3 border border-white/10">
                <h3 className="text-white text-sm font-bold mb-2 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-teal-400" />
                  الوجهات ({filteredCountries.length})
                </h3>
                <div className="space-y-1 max-h-40 overflow-y-auto custom-scrollbar">
                  {filteredCountries.map((country) => (
                    <button
                      key={country.id}
                      onClick={() => handleCountrySelect(country)}
                      className={cn(
                        "w-full flex items-center gap-2 p-2 rounded-lg transition-all text-right",
                        selectedCountry?.id === country.id
                          ? "bg-teal-500/30 border border-teal-500/50"
                          : "bg-white/5 hover:bg-white/10 border border-transparent"
                      )}
                    >
                      <span className="text-base">
                        {country.id === 'malaysia' ? '🇲🇾' : 
                         country.id === 'thailand' ? '🇹🇭' : 
                         country.id === 'indonesia' ? '🇮🇩' :
                         country.id === 'vietnam' ? '🇻🇳' :
                         country.id === 'philippines' ? '🇵🇭' :
                         country.id === 'singapore' ? '🇸🇬' :
                         country.id === 'turkey' ? '🇹🇷' : '🌍'}
                      </span>
                      <div className="flex-1">
                        <p className="font-bold text-white text-xs">{country.nameAr}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Globe Area - Takes 3/4 of screen */}
            <div className="lg:col-span-3 order-1 lg:order-2">
              <div className="relative">
                {/* 3D Globe - Larger and more prominent */}
                <div className="aspect-[16/10] lg:aspect-[16/9] rounded-2xl overflow-hidden border border-white/10 shadow-2xl shadow-teal-500/10">
                  <Suspense fallback={
                    <div className="w-full h-full flex items-center justify-center bg-slate-800">
                      <div className="text-center">
                        <div className="w-16 h-16 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                        <p className="text-white/60">جاري تحميل الكرة الأرضية...</p>
                      </div>
                    </div>
                  }>
                    <Globe3D
                      onCountrySelect={handleCountrySelect}
                      onCitySelect={handleCitySelect}
                      selectedAirport={selectedAirport}
                      selectedDestination={selectedDestination}
                    />
                  </Suspense>
                </div>

                {/* Info Panel */}
                {showInfo && (
                  <div className="absolute top-4 left-4 bg-slate-800/90 backdrop-blur-sm rounded-lg p-3 text-white/80 text-sm max-w-xs border border-white/10">
                    <button 
                      onClick={() => setShowInfo(false)}
                      className="absolute top-2 left-2 text-white/50 hover:text-white"
                    >
                      <X className="w-4 h-4" />
                    </button>
                    <div className="flex items-start gap-2">
                      <Info className="w-4 h-4 text-teal-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-bold mb-1">كيفية الاستخدام:</p>
                        <ul className="text-xs space-y-1 text-white/60">
                          <li>• اسحب للتدوير</li>
                          <li>• اضغط على النقاط لعرض التفاصيل</li>
                          <li>• استخدم العجلة للتكبير</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                )}

                {/* Selected Country/City Card */}
                {selectedCountry && !selectedCity && (
                  <div className="absolute top-4 right-4 w-80 max-h-[calc(100%-2rem)] overflow-y-auto">
                    <CountryCard
                      country={selectedCountry}
                      onClose={handleCloseCards}
                      onCitySelect={(city) => handleCitySelect(city, selectedCountry)}
                    />
                  </div>
                )}

                {selectedCity && selectedCountry && (
                  <div className="absolute top-4 right-4 w-80 max-h-[calc(100%-2rem)] overflow-y-auto">
                    <CityCard
                      city={selectedCity}
                      country={selectedCountry}
                      onClose={handleCloseCards}
                      onBack={handleBackToCountry}
                    />
                  </div>
                )}
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-4 gap-4 mt-6">
                {[
                  { icon: Globe, label: 'دول', value: southeastAsiaCountries.length },
                  { icon: MapPin, label: 'مدن', value: southeastAsiaCountries.reduce((acc, c) => acc + c.cities.length, 0) },
                  { icon: Plane, label: 'مطارات', value: '20+' },
                  { icon: Star, label: 'برامج', value: '100+' },
                ].map((stat, idx) => (
                  <div key={idx} className="bg-white/5 backdrop-blur-sm rounded-xl p-4 text-center border border-white/10">
                    <stat.icon className="w-6 h-6 text-teal-400 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-white">{stat.value}</p>
                    <p className="text-xs text-gray-400">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>

      <PremiumFooter />
    </div>
  );
}
