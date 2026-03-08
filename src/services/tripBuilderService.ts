import { supabase } from '@/integrations/supabase/client';

export const tripBuilderService = {
  async getDestinations() {
    const { data, error } = await supabase
      .from('destinations')
      .select('id, name_ar, name_en, cover_image, country_ar, country_en, slug')
      .eq('is_active', true)
      .order('display_order');
    if (error) throw error;
    return data || [];
  },

  async getFlightOffers(destinationCity?: string) {
    let query = supabase
      .from('flight_offers')
      .select('*, airline:airlines(*), origin:airports!flight_offers_origin_airport_id_fkey(*), destination:airports!flight_offers_destination_airport_id_fkey(*)')
      .eq('is_active', true)
      .gte('departure_date', new Date().toISOString().split('T')[0]);
    const { data, error } = await query.order('price_adult');
    if (error) throw error;
    return data || [];
  },

  async getHotels(city?: string) {
    let query = supabase
      .from('hotels')
      .select('id, name_ar, name_en, city_ar, city_en, star_rating, rating, main_image, country_ar')
      .eq('is_active', true);
    if (city) query = query.ilike('city_en', `%${city}%`);
    const { data, error } = await query.order('rating', { ascending: false });
    if (error) throw error;
    return data || [];
  },

  async getHotelRooms(hotelId: string) {
    const { data, error } = await supabase
      .from('hotel_rooms')
      .select('*')
      .eq('hotel_id', hotelId)
      .eq('is_active', true)
      .order('price_per_night');
    if (error) throw error;
    return data || [];
  },

  async getCarRentals(city?: string) {
    let query = supabase
      .from('car_rentals' as any)
      .select('*')
      .eq('is_active', true);
    if (city) query = query.ilike('city_en', `%${city}%`);
    const { data, error } = await query.order('price_per_day');
    if (error) throw error;
    return (data || []) as any[];
  },

  async getTourActivities(city?: string) {
    let query = supabase
      .from('tour_activities' as any)
      .select('*')
      .eq('is_active', true);
    if (city) query = query.ilike('city_en', `%${city}%`);
    const { data, error } = await query.order('price_per_person');
    if (error) throw error;
    return (data || []) as any[];
  },

  async savePackage(packageData: any) {
    const { data, error } = await supabase
      .from('dynamic_packages' as any)
      .insert(packageData)
      .select()
      .single();
    if (error) throw error;
    return data;
  },
};
