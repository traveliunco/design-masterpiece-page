/**
 * خدمات الرحلات والفنادق - ترافليون
 * نظام محلي قابل للتطوير والربط مع APIs خارجية
 */

import { supabase } from "@/integrations/supabase/client";

// =====================================================
// Types & Interfaces
// =====================================================

export interface Airline {
  id: string;
  name_ar: string;
  name_en: string;
  iata_code: string;
  logo_url?: string;
  country?: string;
  is_active: boolean;
}

export interface Airport {
  id: string;
  name_ar: string;
  name_en: string;
  iata_code: string;
  city_ar: string;
  city_en: string;
  country_ar: string;
  country_en: string;
  country_code?: string;
}

export interface FlightOffer {
  id: string;
  origin_airport_id: string;
  destination_airport_id: string;
  airline_id: string;
  departure_date: string;
  return_date?: string;
  departure_time?: string;
  arrival_time?: string;
  flight_number?: string;
  flight_class: string;
  is_direct: boolean;
  stops_count: number;
  duration_minutes?: number;
  price_adult: number;
  price_child?: number;
  price_infant?: number;
  original_price?: number;
  currency: string;
  available_seats: number;
  is_featured: boolean;
  is_active: boolean;
  baggage_allowance?: string;
  meal_included: boolean;
  notes?: string;
  // Relations
  origin_airport?: Airport;
  destination_airport?: Airport;
  airline?: Airline;
}

export interface Hotel {
  id: string;
  name_ar: string;
  name_en: string;
  city_ar: string;
  city_en: string;
  country_ar: string;
  country_en: string;
  address?: string;
  star_rating: number;
  hotel_type: string;
  description_ar?: string;
  description_en?: string;
  main_image?: string;
  gallery?: unknown;
  amenities?: unknown;
  phone?: string;
  email?: string;
  check_in_time?: string;
  check_out_time?: string;
  rating: number;
  reviews_count: number;
  is_featured: boolean;
  is_active: boolean;
  rooms?: HotelRoom[];
}

export interface HotelRoom {
  id: string;
  hotel_id: string;
  name_ar: string;
  name_en: string;
  room_type: string;
  description_ar?: string;
  description_en?: string;
  max_adults: number;
  max_children: number;
  bed_type?: string;
  room_size_sqm?: number;
  price_per_night: number;
  original_price?: number;
  currency: string;
  includes_breakfast: boolean;
  includes_wifi: boolean;
  amenities?: unknown;
  available_rooms: number;
  images?: unknown;
  is_active: boolean;
}

export interface FlightSearchParams {
  origin?: string;
  destination?: string;
  departure_date?: string;
  return_date?: string;
  flight_class?: string;
  is_direct?: boolean;
  min_price?: number;
  max_price?: number;
  airline_id?: string;
}

export interface HotelSearchParams {
  city?: string;
  country?: string;
  check_in?: string;
  check_out?: string;
  star_rating?: number;
  min_price?: number;
  max_price?: number;
  hotel_type?: string;
  amenities?: string[];
}

export interface FlightBookingData {
  flight_offer_id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  passengers: PassengerInfo[];
  adults_count: number;
  children_count: number;
  infants_count: number;
  special_requests?: string;
}

export interface HotelBookingData {
  hotel_id: string;
  room_id: string;
  check_in_date: string;
  check_out_date: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  adults_count: number;
  children_count: number;
  rooms_count: number;
  special_requests?: string;
}

export interface PassengerInfo {
  type: 'adult' | 'child' | 'infant';
  first_name: string;
  last_name: string;
  passport_number?: string;
  nationality?: string;
  date_of_birth?: string;
}

// =====================================================
// Airports & Airlines Services
// =====================================================

export async function getAirports(): Promise<Airport[]> {
  const { data, error } = await supabase
    .from('airports')
    .select('*')
    .eq('is_active', true)
    .order('city_ar');
  
  if (error) throw error;
  return data || [];
}

export async function getAirlines(): Promise<Airline[]> {
  const { data, error } = await supabase
    .from('airlines')
    .select('*')
    .eq('is_active', true)
    .order('name_ar');
  
  if (error) throw error;
  return data || [];
}

export async function getAirportByCode(iataCode: string): Promise<Airport | null> {
  const { data, error } = await supabase
    .from('airports')
    .select('*')
    .eq('iata_code', iataCode)
    .single();
  
  if (error) return null;
  return data;
}

// =====================================================
// Flight Offers Services
// =====================================================

export async function getFlightOffers(params?: FlightSearchParams): Promise<FlightOffer[]> {
  let query = supabase
    .from('flight_offers')
    .select(`
      *,
      origin_airport:airports!origin_airport_id(*),
      destination_airport:airports!destination_airport_id(*),
      airline:airlines!airline_id(*)
    `)
    .eq('is_active', true)
    .gte('departure_date', new Date().toISOString().split('T')[0])
    .order('price_adult');

  // ✅ إصلاح: PostgREST لا يدعم الفلترة على الـ relations
  // نجلب الـ airport IDs أولاً ثم نفلتر بها
  if (params?.origin) {
    const { data: originAirport } = await supabase
      .from('airports')
      .select('id')
      .eq('iata_code', params.origin)
      .single();
    if (originAirport) {
      query = query.eq('origin_airport_id', originAirport.id);
    }
  }

  if (params?.destination) {
    const { data: destAirport } = await supabase
      .from('airports')
      .select('id')
      .eq('iata_code', params.destination)
      .single();
    if (destAirport) {
      query = query.eq('destination_airport_id', destAirport.id);
    }
  }

  if (params?.departure_date) {
    query = query.eq('departure_date', params.departure_date);
  }
  if (params?.flight_class) {
    query = query.eq('flight_class', params.flight_class);
  }
  if (params?.is_direct !== undefined) {
    query = query.eq('is_direct', params.is_direct);
  }
  if (params?.min_price) {
    query = query.gte('price_adult', params.min_price);
  }
  if (params?.max_price) {
    query = query.lte('price_adult', params.max_price);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data || [];
}

export async function getFeaturedFlights(limit = 8): Promise<FlightOffer[]> {
  const { data, error } = await supabase
    .from('flight_offers')
    .select(`
      *,
      origin_airport:airports!origin_airport_id(*),
      destination_airport:airports!destination_airport_id(*),
      airline:airlines!airline_id(*)
    `)
    .eq('is_active', true)
    .eq('is_featured', true)
    .gte('departure_date', new Date().toISOString().split('T')[0])
    .order('price_adult')
    .limit(limit);

  if (error) throw error;
  return data || [];
}

export async function getFlightOfferById(id: string): Promise<FlightOffer | null> {
  const { data, error } = await supabase
    .from('flight_offers')
    .select(`
      *,
      origin_airport:airports!origin_airport_id(*),
      destination_airport:airports!destination_airport_id(*),
      airline:airlines!airline_id(*)
    `)
    .eq('id', id)
    .single();

  if (error) return null;
  return data;
}

// =====================================================
// Hotels Services
// =====================================================

export async function getHotels(params?: HotelSearchParams): Promise<Hotel[]> {
  let query = supabase
    .from('hotels')
    .select('*')
    .eq('is_active', true)
    .order('rating', { ascending: false });

  if (params?.city) {
    query = query.or(`city_ar.ilike.%${params.city}%,city_en.ilike.%${params.city}%`);
  }
  if (params?.country) {
    query = query.or(`country_ar.ilike.%${params.country}%,country_en.ilike.%${params.country}%`);
  }
  if (params?.star_rating) {
    query = query.eq('star_rating', params.star_rating);
  }
  if (params?.hotel_type) {
    query = query.eq('hotel_type', params.hotel_type);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data || [];
}

export async function getFeaturedHotels(limit = 6): Promise<Hotel[]> {
  const { data, error } = await supabase
    .from('hotels')
    .select('*')
    .eq('is_active', true)
    .eq('is_featured', true)
    .order('rating', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data || [];
}

export async function getHotelById(id: string): Promise<Hotel | null> {
  const { data, error } = await supabase
    .from('hotels')
    .select('*')
    .eq('id', id)
    .single();

  if (error) return null;
  return data;
}

export async function getHotelRooms(hotelId: string): Promise<HotelRoom[]> {
  const { data, error } = await supabase
    .from('hotel_rooms')
    .select('*')
    .eq('hotel_id', hotelId)
    .eq('is_active', true)
    .order('price_per_night');

  if (error) throw error;
  return data || [];
}

export async function getHotelWithRooms(id: string): Promise<Hotel | null> {
  const hotel = await getHotelById(id);
  if (!hotel) return null;

  const rooms = await getHotelRooms(id);
  return { ...hotel, rooms };
}

// =====================================================
// Bookings Services
// =====================================================

function generateBookingReference(prefix: string): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = prefix;
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export async function createFlightBooking(data: FlightBookingData) {
  const flightOffer = await getFlightOfferById(data.flight_offer_id);
  if (!flightOffer) throw new Error('Flight offer not found');

  const basePrice = 
    (data.adults_count * flightOffer.price_adult) +
    (data.children_count * (flightOffer.price_child || flightOffer.price_adult * 0.75)) +
    (data.infants_count * (flightOffer.price_infant || 0));
  
  const taxes = basePrice * 0.15; // 15% VAT
  const totalPrice = basePrice + taxes;

  const booking = {
    pnr: generateBookingReference('TRV-FL-'),
    contact_first_name: data.customer_name.split(' ')[0] || data.customer_name,
    contact_last_name: data.customer_name.split(' ').slice(1).join(' ') || data.customer_name,
    contact_email: data.customer_email,
    contact_phone: data.customer_phone,
    origin_code: flightOffer.origin_airport?.iata_code || '',
    destination_code: flightOffer.destination_airport?.iata_code || '',
    departure_date: flightOffer.departure_date,
    return_date: flightOffer.return_date,
    adults: data.adults_count,
    children: data.children_count,
    infants: data.infants_count,
    total_passengers: data.adults_count + data.children_count + data.infants_count,
    base_price: basePrice,
    taxes: taxes,
    total_price: totalPrice,
    currency: flightOffer.currency || 'SAR',
    notes: data.special_requests,
    status: 'pending',
    payment_status: 'pending',
    flight_offer: {} as any,
  };

  const { data: result, error } = await supabase
    .from('flight_bookings')
    .insert([booking])
    .select()
    .single();

  if (error) throw error;
  return result;
}

export async function createHotelBooking(data: HotelBookingData) {
  const room = await supabase
    .from('hotel_rooms')
    .select('*')
    .eq('id', data.room_id)
    .single();

  if (room.error || !room.data) throw new Error('Room not found');

  const checkIn = new Date(data.check_in_date);
  const checkOut = new Date(data.check_out_date);
  const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));
  
  const subtotal = room.data.price_per_night * nights * data.rooms_count;
  const taxes = subtotal * 0.15;
  const totalPrice = subtotal + taxes;

  const booking = {
    booking_reference: generateBookingReference('TRV-HT-'),
    hotel_id: data.hotel_id,
    room_id: data.room_id,
    customer_name: data.customer_name,
    customer_email: data.customer_email,
    customer_phone: data.customer_phone,
    check_in_date: data.check_in_date,
    check_out_date: data.check_out_date,
    nights_count: nights,
    rooms_count: data.rooms_count,
    adults_count: data.adults_count,
    children_count: data.children_count,
    price_per_night: room.data.price_per_night,
    subtotal: subtotal,
    taxes: taxes,
    total_price: totalPrice,
    currency: room.data.currency,
    special_requests: data.special_requests,
    status: 'pending',
    payment_status: 'pending',
  };

  const { data: result, error } = await supabase
    .from('hotel_bookings')
    .insert([booking])
    .select()
    .single();

  if (error) throw error;
  return result;
}

export async function getFlightBooking(reference: string) {
  const { data, error } = await supabase
    .from('flight_bookings')
    .select('*')
    .eq('pnr', reference)
    .single();

  if (error) return null;
  return data;
}

export async function getHotelBooking(reference: string) {
  const { data, error } = await supabase
    .from('hotel_bookings')
    .select(`
      *,
      hotel:hotels(*),
      room:hotel_rooms(*)
    `)
    .eq('booking_reference', reference)
    .single();

  if (error) return null;
  return data;
}

// =====================================================
// Admin Services
// =====================================================

export async function createFlightOffer(offer: Partial<FlightOffer>) {
  const { id, origin_airport, destination_airport, airline, ...insertData } = offer as FlightOffer;
  const { data, error } = await supabase
    .from('flight_offers')
    .insert([insertData as any])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateFlightOffer(id: string, updates: Partial<FlightOffer>) {
  const { data, error } = await supabase
    .from('flight_offers')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteFlightOffer(id: string) {
  const { error } = await supabase
    .from('flight_offers')
    .update({ is_active: false })
    .eq('id', id);

  if (error) throw error;
}

export async function createHotel(hotel: Partial<Hotel>) {
  const { id, rooms, ...insertData } = hotel as Hotel;
  const { data, error } = await supabase
    .from('hotels')
    .insert([insertData as any])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateHotel(id: string, updates: Partial<Hotel>) {
  const { rooms, ...updateData } = updates as any;
  const { data, error } = await supabase
    .from('hotels')
    .update({ ...updateData, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteHotel(id: string) {
  const { error } = await supabase
    .from('hotels')
    .update({ is_active: false })
    .eq('id', id);

  if (error) throw error;
}

export async function createHotelRoom(room: Partial<HotelRoom>) {
  const { id, ...insertData } = room as HotelRoom;
  const { data, error } = await supabase
    .from('hotel_rooms')
    .insert([insertData as any])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateHotelRoom(id: string, updates: Partial<HotelRoom>) {
  const updateData = { ...updates } as any;
  const { data, error } = await supabase
    .from('hotel_rooms')
    .update({ ...updateData, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// =====================================================
// Statistics (للداشبورد)
// =====================================================

export async function getBookingStats() {
  const [flightBookings, hotelBookings] = await Promise.all([
    supabase.from('flight_bookings').select('id, status, total_price', { count: 'exact' }),
    supabase.from('hotel_bookings').select('id, status, total_price', { count: 'exact' }),
  ]);

  return {
    totalFlightBookings: flightBookings.count || 0,
    totalHotelBookings: hotelBookings.count || 0,
    // يمكن إضافة المزيد من الإحصائيات
  };
}
