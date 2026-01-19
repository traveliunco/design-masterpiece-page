import { getCountryById } from "@/data/destinations-data";
import CountryTemplate from "@/components/templates/CountryTemplate";

const Philippines = () => {
  const country = getCountryById("philippines");

  if (!country) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-white text-xl">جاري التحميل...</div>
      </div>
    );
  }

  return <CountryTemplate country={country} />;
};

export default Philippines;
