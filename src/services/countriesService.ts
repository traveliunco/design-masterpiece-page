import { supabase } from "@/integrations/supabase/client";

// ========================
// Types
// ========================

export interface TourCity {
  id: string;
  country_id: string;
  name_ar: string;
  name_en: string;
  description?: string;
  image?: string;
  best_time?: string;
  average_temp?: string;
  accommodation?: string;
  coordinates_lat?: number;
  coordinates_lng?: number;
  attractions?: string[];
  highlights?: string[];
  is_active?: boolean;
  display_order?: number;
  created_at?: string;
  updated_at?: string;
}

export interface TourCountry {
  id: string;
  name_ar: string;
  name_en: string;
  description?: string;
  cover_image?: string;
  flag_emoji?: string;
  currency?: string;
  language?: string;
  visa?: string;
  best_season?: string;
  trip_duration?: string;
  climate?: string;
  budget?: string;
  coordinates_lat?: number;
  coordinates_lng?: number;
  highlights?: string[];
  is_active?: boolean;
  display_order?: number;
  created_at?: string;
  updated_at?: string;
  cities?: TourCity[];
}

// ========================
// Countries CRUD
// ========================

export const getCountries = async (): Promise<TourCountry[]> => {
  const { data, error } = await supabase
    .from("tour_countries")
    .select("*")
    .eq("is_active", true)
    .order("display_order", { ascending: true });

  if (error) {
    console.error("Error fetching countries:", error);
    return [];
  }
  return data || [];
};

export const getAllCountriesAdmin = async (): Promise<TourCountry[]> => {
  const { data, error } = await supabase
    .from("tour_countries")
    .select("*")
    .order("display_order", { ascending: true });

  if (error) {
    console.error("Error fetching countries:", error);
    return [];
  }
  return data || [];
};

export const getCountryById = async (id: string): Promise<TourCountry | null> => {
  const { data: country, error: countryError } = await supabase
    .from("tour_countries")
    .select("*")
    .eq("id", id)
    .single();

  if (countryError || !country) return null;

  const { data: cities } = await supabase
    .from("tour_cities")
    .select("*")
    .eq("country_id", id)
    .eq("is_active", true)
    .order("display_order", { ascending: true });

  return { ...country, cities: cities || [] };
};

export const createCountry = async (
  country: Omit<TourCountry, "created_at" | "updated_at">
): Promise<TourCountry | null> => {
  const { data, error } = await supabase
    .from("tour_countries")
    .insert(country)
    .select()
    .single();

  if (error) {
    console.error("Error creating country:", error);
    throw error;
  }
  return data;
};

export const updateCountry = async (
  id: string,
  updates: Partial<TourCountry>
): Promise<TourCountry | null> => {
  const { data, error } = await supabase
    .from("tour_countries")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Error updating country:", error);
    throw error;
  }
  return data;
};

export const deleteCountry = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from("tour_countries")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Error deleting country:", error);
    throw error;
  }
};

// ========================
// Cities CRUD
// ========================

export const getCitiesByCountry = async (countryId: string): Promise<TourCity[]> => {
  const { data, error } = await supabase
    .from("tour_cities")
    .select("*")
    .eq("country_id", countryId)
    .order("display_order", { ascending: true });

  if (error) {
    console.error("Error fetching cities:", error);
    return [];
  }
  return data || [];
};

export const getAllCitiesAdmin = async (): Promise<TourCity[]> => {
  const { data, error } = await supabase
    .from("tour_cities")
    .select("*")
    .order("country_id", { ascending: true })
    .order("display_order", { ascending: true });

  if (error) {
    console.error("Error fetching cities:", error);
    return [];
  }
  return data || [];
};

export const createCity = async (
  city: Omit<TourCity, "created_at" | "updated_at">
): Promise<TourCity | null> => {
  const { data, error } = await supabase
    .from("tour_cities")
    .insert(city)
    .select()
    .single();

  if (error) {
    console.error("Error creating city:", error);
    throw error;
  }
  return data;
};

export const updateCity = async (
  cityId: string,
  countryId: string,
  updates: Partial<TourCity>
): Promise<TourCity | null> => {
  const { data, error } = await supabase
    .from("tour_cities")
    .update(updates)
    .eq("id", cityId)
    .eq("country_id", countryId)
    .select()
    .single();

  if (error) {
    console.error("Error updating city:", error);
    throw error;
  }
  return data;
};

export const deleteCity = async (cityId: string, countryId: string): Promise<void> => {
  const { error } = await supabase
    .from("tour_cities")
    .delete()
    .eq("id", cityId)
    .eq("country_id", countryId);

  if (error) {
    console.error("Error deleting city:", error);
    throw error;
  }
};

// ========================
// Seed: نقل البيانات المحلية إلى Supabase
// ========================

export const seedCountriesToSupabase = async (countries: any[]): Promise<{
  success: number;
  errors: string[];
}> => {
  const results = { success: 0, errors: [] as string[] };

  for (const country of countries) {
    try {
      // إدراج الدولة
      const countryData = {
        id: country.id,
        name_ar: country.nameAr,
        name_en: country.nameEn,
        description: country.description,
        cover_image: country.coverImage,
        currency: country.currency,
        language: country.language,
        visa: country.visa,
        best_season: country.bestSeason,
        trip_duration: country.tripDuration,
        climate: country.climate,
        budget: country.budget,
        coordinates_lat: country.coordinates?.lat,
        coordinates_lng: country.coordinates?.lng,
        highlights: country.highlights || [],
        is_active: true,
        display_order: 0,
      };

      const { error: countryError } = await supabase
        .from("tour_countries")
        .upsert(countryData);

      if (countryError) {
        results.errors.push(`❌ ${country.nameAr}: ${countryError.message}`);
        continue;
      }

      // إدراج مدن الدولة
      if (country.cities?.length) {
        const citiesData = country.cities.map((city: any, index: number) => ({
          id: city.id,
          country_id: country.id,
          name_ar: city.nameAr,
          name_en: city.nameEn,
          description: city.description,
          image: city.image,
          best_time: city.bestTime || city.bestTimeToVisit,
          average_temp:
            typeof city.averageTemp === "string"
              ? city.averageTemp
              : `${city.averageTemp?.summer || ""} / ${city.averageTemp?.winter || ""}`,
          accommodation:
            typeof city.accommodation === "string"
              ? city.accommodation
              : `${city.accommodation?.budget || ""} - ${city.accommodation?.midRange || ""} - ${city.accommodation?.luxury || ""}`,
          coordinates_lat: city.coordinates?.lat,
          coordinates_lng: city.coordinates?.lng,
          attractions: (city.attractions || []).map((a: any) =>
            typeof a === "string" ? a : a.nameAr || ""
          ),
          highlights: city.highlights || [],
          is_active: true,
          display_order: index,
        }));

        const { error: citiesError } = await supabase
          .from("tour_cities")
          .upsert(citiesData);

        if (citiesError) {
          results.errors.push(`⚠️ مدن ${country.nameAr}: ${citiesError.message}`);
        }
      }

      results.success++;
    } catch (err: any) {
      results.errors.push(`❌ ${country.nameAr}: ${err.message}`);
    }
  }

  return results;
};
