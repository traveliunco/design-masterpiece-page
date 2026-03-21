import { supabase } from '@/integrations/supabase/client';

// Simple in-memory cache with TTL
const cache = new Map<string, { data: any; ts: number }>();
const CACHE_TTL = 5 * 60 * 1000;

function getCached<T>(key: string): T | null {
  const entry = cache.get(key);
  if (entry && Date.now() - entry.ts < CACHE_TTL) return entry.data as T;
  return null;
}

function setCache(key: string, data: any) {
  cache.set(key, { data, ts: Date.now() });
}

export const tripBuilderService = {
  /** Get active destinations (used as countries) */
  async getDestinations() {
    const cached = getCached<any[]>('destinations');
    if (cached) return cached;

    const { data, error } = await supabase
      .from('destinations')
      .select('id, name_ar, name_en, cover_image, country_ar, country_en, slug')
      .eq('is_active', true)
      .order('display_order');
    if (error) throw error;
    const result = data || [];
    setCache('destinations', result);
    return result;
  },

  /** Get airports in a specific country (destination cities) */
  async getAirportsByCountry(countryAr: string) {
    const key = `airports_country_${countryAr}`;
    const cached = getCached<any[]>(key);
    if (cached) return cached;

    const { data, error } = await supabase
      .from('airports')
      .select('id, iata_code, city_ar, city_en, name_ar, name_en, country_ar')
      .eq('is_active', true)
      .eq('country_ar', countryAr);
    if (error) throw error;
    const result = data || [];
    setCache(key, result);
    return result;
  },

  /** Get Saudi origin airports */
  async getOriginAirports() {
    const cached = getCached<any[]>('origin_airports');
    if (cached) return cached;

    const { data, error } = await supabase
      .from('airports')
      .select('id, iata_code, city_ar, city_en, name_ar')
      .eq('is_active', true)
      .ilike('country_ar', '%سعود%');
    if (error) throw error;
    const result = data || [];
    setCache('origin_airports', result);
    return result;
  },

  /** Get flights filtered by origin/destination airports and date */
  async getFlightOffers(params?: {
    originAirportId?: string | null;
    destinationAirportId?: string | null;
    departureDate?: string | null;
  }) {
    const key = `flights_${params?.originAirportId || 'all'}_${params?.destinationAirportId || 'all'}_${params?.departureDate || 'all'}`;
    const cached = getCached<any[]>(key);
    if (cached) return cached;

    let query = supabase
      .from('flight_offers')
      .select('*, airline:airlines(name_ar, logo_url, iata_code), origin:airports!flight_offers_origin_airport_id_fkey(city_ar, city_en, iata_code), destination:airports!flight_offers_destination_airport_id_fkey(city_ar, city_en, iata_code)')
      .eq('is_active', true)
      .gte('departure_date', new Date().toISOString().split('T')[0]);

    if (params?.originAirportId) {
      query = query.eq('origin_airport_id', params.originAirportId);
    }
    if (params?.destinationAirportId) {
      query = query.eq('destination_airport_id', params.destinationAirportId);
    }
    if (params?.departureDate) {
      query = query.eq('departure_date', params.departureDate);
    }

    const { data, error } = await query.order('price_adult').limit(50);
    if (error) throw error;
    const result = data || [];
    setCache(key, result);
    return result;
  },

  /** Get hotels filtered by city name */
  async getHotels(cityAr?: string, countryAr?: string) {
    const key = `hotels_${cityAr || 'all'}_${countryAr || 'all'}`;
    const cached = getCached<any[]>(key);
    if (cached) return cached;

    let query = supabase
      .from('hotels')
      .select('id, name_ar, name_en, city_ar, city_en, star_rating, rating, main_image, country_ar')
      .eq('is_active', true);

    if (cityAr) {
      query = query.eq('city_ar', cityAr);
    } else if (countryAr) {
      query = query.eq('country_ar', countryAr);
    }

    const { data, error } = await query.order('rating', { ascending: false }).limit(30);
    if (error) throw error;
    const result = data || [];
    setCache(key, result);
    return result;
  },

  async getHotelRooms(hotelId: string) {
    const key = `rooms_${hotelId}`;
    const cached = getCached<any[]>(key);
    if (cached) return cached;

    const { data, error } = await supabase
      .from('hotel_rooms')
      .select('*')
      .eq('hotel_id', hotelId)
      .eq('is_active', true)
      .order('price_per_night');
    if (error) throw error;
    const result = data || [];
    setCache(key, result);
    return result;
  },

  /** Get car rentals filtered by city */
  async getCarRentals(cityAr?: string, countryAr?: string) {
    const key = `cars_${cityAr || 'all'}_${countryAr || 'all'}`;
    const cached = getCached<any[]>(key);
    if (cached) return cached;

    let query = supabase
      .from('car_rentals')
      .select('*')
      .eq('is_active', true);

    if (cityAr) {
      query = query.eq('city_ar', cityAr);
    } else if (countryAr) {
      query = query.eq('country_ar', countryAr);
    }

    const { data, error } = await query.order('price_per_day').limit(30);
    if (error) throw error;
    const result = data || [];
    setCache(key, result);
    return result;
  },

  /** Get tour activities filtered by city/country */
  async getTourActivities(cityAr?: string, countryAr?: string) {
    const key = `tours_${cityAr || 'all'}_${countryAr || 'all'}`;
    const cached = getCached<any[]>(key);
    if (cached) return cached;

    let query = supabase
      .from('tour_activities')
      .select('*')
      .eq('is_active', true);

    if (cityAr) {
      query = query.eq('city_ar', cityAr);
    } else if (countryAr) {
      query = query.eq('country_ar', countryAr);
    }

    const { data, error } = await query.order('price_per_person').limit(30);
    if (error) throw error;
    const result = (data || []) as any[];
    setCache(key, result);
    return result;
  },

  async savePackage(packageData: {
    destination?: string;
    destination_id?: string | null;
    country_id?: string | null;
    city_name?: string;
    origin_city?: string;
    check_in_date?: string;
    check_out_date?: string;
    adults_count?: number;
    children_count?: number;
    infants_count?: number;
    flight_offer_id?: string | null;
    hotel_id?: string | null;
    room_id?: string | null;
    car_rental_id?: string | null;
    selected_activities?: any[];
    extras?: any;
    subtotal?: number;
    taxes?: number;
    total_price?: number;
    customer_name?: string;
    customer_email?: string;
    customer_phone?: string;
    notes?: string;
    status?: string;
    session_id?: string;
    user_id?: string | null;
  }) {
    const { data, error } = await supabase
      .from('dynamic_packages')
      .insert(packageData as any)
      .select()
      .single();
    if (error) throw error;
    return data;
  },
};
