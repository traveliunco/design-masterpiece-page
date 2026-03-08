import { supabase } from '@/integrations/supabase/client';

// Simple in-memory cache with TTL
const cache = new Map<string, { data: any; ts: number }>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

function getCached<T>(key: string): T | null {
  const entry = cache.get(key);
  if (entry && Date.now() - entry.ts < CACHE_TTL) return entry.data as T;
  return null;
}

function setCache(key: string, data: any) {
  cache.set(key, { data, ts: Date.now() });
}

export const tripBuilderService = {
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

  async getFlightOffers(destinationCity?: string) {
    const key = `flights_${destinationCity || 'all'}`;
    const cached = getCached<any[]>(key);
    if (cached) return cached;

    let query = supabase
      .from('flight_offers')
      .select('*, airline:airlines(name_ar, logo_url, iata_code), origin:airports!flight_offers_origin_airport_id_fkey(city_ar, city_en, iata_code), destination:airports!flight_offers_destination_airport_id_fkey(city_ar, city_en, iata_code)')
      .eq('is_active', true)
      .gte('departure_date', new Date().toISOString().split('T')[0]);
    const { data, error } = await query.order('price_adult').limit(50);
    if (error) throw error;
    const result = data || [];
    setCache(key, result);
    return result;
  },

  async getHotels(city?: string) {
    const key = `hotels_${city || 'all'}`;
    const cached = getCached<any[]>(key);
    if (cached) return cached;

    let query = supabase
      .from('hotels')
      .select('id, name_ar, name_en, city_ar, city_en, star_rating, rating, main_image, country_ar')
      .eq('is_active', true);
    if (city) query = query.ilike('city_en', `%${city}%`);
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

  async getCarRentals(city?: string) {
    const key = `cars_${city || 'all'}`;
    const cached = getCached<any[]>(key);
    if (cached) return cached;

    let query = supabase
      .from('car_rentals')
      .select('*')
      .eq('is_active', true);
    if (city) query = query.ilike('city_en', `%${city}%`);
    const { data, error } = await query.order('price_per_day').limit(30);
    if (error) throw error;
    const result = data || [];
    setCache(key, result);
    return result;
  },

  async getTourActivities(city?: string) {
    const key = `tours_${city || 'all'}`;
    const cached = getCached<any[]>(key);
    if (cached) return cached;

    let query = supabase
      .from('tour_activities' as any)
      .select('*')
      .eq('is_active', true);
    if (city) query = query.ilike('city_en', `%${city}%`);
    const { data, error } = await query.order('price_per_person').limit(30);
    if (error) throw error;
    const result = (data || []) as any[];
    setCache(key, result);
    return result;
  },

  async savePackage(packageData: {
    destination?: string;
    destination_id?: string;
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
  }) {
    const { data, error } = await supabase
      .from('dynamic_packages')
      .insert(packageData)
      .select()
      .single();
    if (error) throw error;
    return data;
  },
};
