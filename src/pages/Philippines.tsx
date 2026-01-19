import { useNavigate } from 'react-router-dom';
import { getCountryById } from '../data/southeast-asia';
import CountryMap from '../components/CountryMap';
import CityCard from '../components/CityCard';
import Nav3D from '../components/Nav3D';
import PremiumFooter from '../components/PremiumFooter';
import MobileNav from '../components/MobileNav';
import { Helmet } from 'react-helmet';

export default function Philippines() {
  const navigate = useNavigate();
  const country = getCountryById('philippines');

  if (!country) {
    return <div>Country not found</div>;
  }

  return (
    <>
      <Helmet>
        <title>{country.nameAr} - السياحة في {country.nameAr} | ترافليون</title>
        <meta name="description" content={country.description} />
        <meta property="og:title" content={`${country.nameAr} - السياحة في ${country.nameAr}`} />
        <meta property="og:description" content={country.description} />
        <meta property="og:image" content={country.coverImage} />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900">
        <Nav3D />
        <MobileNav />
        
        {/* Hero Section */}
        <div className="relative h-[60vh] overflow-hidden">
          <img 
            src={country.coverImage} 
            alt={country.nameAr}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-8 md:p-16">
            <div className="container mx-auto">
              <div className="flex items-center gap-4 mb-4">
                <span className="text-6xl">{country.flag}</span>
                <h1 className="text-4xl md:text-6xl font-bold text-white">
                  {country.nameAr}
                </h1>
              </div>
              <p className="text-xl text-white/90 max-w-2xl">
                {country.description}
              </p>
            </div>
          </div>
        </div>

        {/* Info Cards */}
        <div className="container mx-auto px-4 py-8 -mt-16 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { label: 'العملة', value: country.currency, icon: '💰' },
              { label: 'اللغة', value: country.language, icon: '🗣️' },
              { label: 'التأشيرة', value: country.visa, icon: '✈️' },
              { label: 'أفضل موسم', value: country.bestSeason, icon: '🌞' },
              { label: 'المناخ', value: country.climate, icon: '🌡️' },
              { label: 'الميزانية اليومية', value: country.budget, icon: '💵' }
            ].map((item, index) => (
              <div 
                key={index}
                className="bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20 hover:bg-white/20 transition-all"
              >
                <div className="text-3xl mb-2">{item.icon}</div>
                <div className="text-white/60 text-sm mb-1">{item.label}</div>
                <div className="text-white font-semibold text-sm">{item.value}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Map Section */}
        <div className="container mx-auto px-4 py-12">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">
            أشهر المدن السياحية
          </h2>
          <CountryMap country={country} />
        </div>

        {/* Cities Grid */}
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {country.cities.map((city) => (
              <div
                key={city.id}
                onClick={() => navigate(`/country/${country.id}/city/${city.id}`)}
                className="cursor-pointer"
              >
                <CityCard city={city} />
              </div>
            ))}
          </div>
        </div>

        <PremiumFooter />
      </div>
    </>
  );
}
