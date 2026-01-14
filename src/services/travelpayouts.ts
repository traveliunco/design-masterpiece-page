/**
 * Travelpayouts API Service
 * 
 * Documentation: https://support.travelpayouts.com/hc/en-us/articles/203956163
 * 
 * Available APIs:
 * - Flights Data API
 * - Hotels Data API
 * - Car Rentals API
 * - Train Tickets API
 */

const API_TOKEN = import.meta.env.VITE_TRAVELPAYOUTS_API_TOKEN;
const PARTNER_ID = import.meta.env.VITE_TRAVELPAYOUTS_PARTNER_ID;

// Base URLs for different APIs
const BASE_URLS = {
  flights: "https://api.travelpayouts.com/v1",
  flightsData: "https://api.travelpayouts.com/data/en/cities.json",
  hotprice: "https://api.travelpayouts.com/v2/prices",
  hotels: "https://engine.hotellook.com/api/v2",
  hotelSearch: "https://yasen.hotellook.com/tp/public/widget_location_dump.json",
};

// Types
export interface FlightPrice {
  origin: string;
  destination: string;
  departure_at: string;
  return_at: string;
  price: number;
  airline: string;
  flight_number: number;
  expires_at: string;
}

export interface HotelLocation {
  id: string;
  cityId: number;
  name: string;
  fullName: string;
  location: {
    lat: number;
    lon: number;
  };
  locationId: number;
  countryCode: string;
  countryName: string;
  iata: string[];
  hotelsCount: number;
}

export interface Hotel {
  id: number;
  name: string;
  stars: number;
  priceFrom: number;
  photoCount: number;
  rating: number;
  address: string;
  location: {
    lat: number;
    lon: number;
  };
}

export interface CheapestFlightParams {
  origin: string; // IATA code (e.g., "JED" for Jeddah)
  destination?: string; // IATA code
  departure_at?: string; // YYYY-MM or YYYY-MM-DD
  return_at?: string;
  one_way?: boolean;
  direct?: boolean;
  currency?: string;
  limit?: number;
}

export interface HotelSearchParams {
  locationId: number;
  checkIn: string; // YYYY-MM-DD
  checkOut: string;
  adults: number;
  children?: number;
  limit?: number;
  currency?: string;
}

// Helper function for API calls
async function fetchAPI<T>(url: string, params?: Record<string, string | number | boolean>): Promise<T> {
  const searchParams = new URLSearchParams();
  
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        searchParams.append(key, String(value));
      }
    });
  }
  
  // Add token to all requests
  searchParams.append("token", API_TOKEN);
  
  const fullUrl = `${url}?${searchParams.toString()}`;
  
  const response = await fetch(fullUrl);
  
  if (!response.ok) {
    throw new Error(`API Error: ${response.status} ${response.statusText}`);
  }
  
  return response.json();
}

// ==================== FLIGHTS API ====================

/**
 * Get cheapest flight prices for a route
 */
export async function getCheapestFlights(params: CheapestFlightParams): Promise<{ data: FlightPrice[] }> {
  return fetchAPI(`${BASE_URLS.hotprice}/latest`, {
    origin: params.origin,
    destination: params.destination || "",
    departure_at: params.departure_at || "",
    return_at: params.return_at || "",
    one_way: params.one_way || false,
    direct: params.direct || false,
    currency: params.currency || "SAR",
    limit: params.limit || 30,
  });
}

/**
 * Get direct flight prices
 */
export async function getDirectFlights(origin: string, destination: string): Promise<{ data: FlightPrice[] }> {
  return getCheapestFlights({
    origin,
    destination,
    direct: true,
  });
}

/**
 * Get popular destinations from origin
 */
export async function getPopularDestinations(origin: string): Promise<{ data: Record<string, FlightPrice[]> }> {
  return fetchAPI(`${BASE_URLS.flights}/prices/cheap`, {
    origin,
    currency: "SAR",
  });
}

/**
 * Get monthly prices calendar
 */
export async function getMonthlyPrices(
  origin: string,
  destination: string,
  month: string // YYYY-MM
): Promise<{ data: Record<string, number> }> {
  return fetchAPI(`${BASE_URLS.hotprice}/month-matrix`, {
    origin,
    destination,
    month,
    currency: "SAR",
  });
}

/**
 * Get special offers (deals)
 */
export async function getSpecialOffers(origin: string): Promise<{ data: FlightPrice[] }> {
  return fetchAPI(`${BASE_URLS.flights}/prices/special`, {
    origin,
    currency: "SAR",
  });
}

// ==================== HOTELS API ====================

/**
 * Search hotel locations by query
 */
export async function searchHotelLocations(query: string, lang = "en"): Promise<HotelLocation[]> {
  const response = await fetch(
    `${BASE_URLS.hotelSearch}?query=${encodeURIComponent(query)}&lang=${lang}`
  );
  return response.json();
}

/**
 * Get hotels by location ID
 */
export async function getHotels(params: HotelSearchParams): Promise<{ hotels: Hotel[] }> {
  return fetchAPI(`${BASE_URLS.hotels}/lookup.json`, {
    query: String(params.locationId),
    lookFor: "hotel",
    limit: params.limit || 10,
    token: API_TOKEN,
  });
}

/**
 * Get hotel details
 */
export async function getHotelDetails(hotelId: number): Promise<Hotel> {
  const result = await fetchAPI<{ hotels: Hotel[] }>(`${BASE_URLS.hotels}/lookup.json`, {
    query: String(hotelId),
    lookFor: "hotel",
    limit: 1,
  });
  return result.hotels[0];
}

/**
 * Generate affiliate link for flights
 */
export function generateFlightLink(
  origin: string,
  destination: string,
  departDate: string,
  returnDate?: string
): string {
  const baseUrl = "https://www.aviasales.com/search";
  const route = returnDate
    ? `${origin}${departDate.replace(/-/g, "")}${destination}${returnDate.replace(/-/g, "")}`
    : `${origin}${departDate.replace(/-/g, "")}${destination}1`;
  
  return `${baseUrl}/${route}?marker=${PARTNER_ID}`;
}

/**
 * Generate affiliate link for hotels
 */
export function generateHotelLink(
  locationId: number,
  checkIn: string,
  checkOut: string
): string {
  return `https://search.hotellook.com/?locationId=${locationId}&checkIn=${checkIn}&checkOut=${checkOut}&marker=${PARTNER_ID}`;
}

// ==================== IATA CODES ====================

// Common Saudi Arabia and destination IATA codes
export const IATA_CODES = {
  // Saudi Arabia
  JED: { name: "جدة", nameEn: "Jeddah" },
  RUH: { name: "الرياض", nameEn: "Riyadh" },
  DMM: { name: "الدمام", nameEn: "Dammam" },
  MED: { name: "المدينة المنورة", nameEn: "Medina" },
  
  // Popular destinations
  KUL: { name: "كوالالمبور", nameEn: "Kuala Lumpur" },
  BKK: { name: "بانكوك", nameEn: "Bangkok" },
  IST: { name: "اسطنبول", nameEn: "Istanbul" },
  DXB: { name: "دبي", nameEn: "Dubai" },
  CAI: { name: "القاهرة", nameEn: "Cairo" },
  MLE: { name: "مالي (المالديف)", nameEn: "Male (Maldives)" },
  CGK: { name: "جاكرتا", nameEn: "Jakarta" },
  DPS: { name: "بالي", nameEn: "Bali" },
  TBS: { name: "تبليسي", nameEn: "Tbilisi" },
  ADB: { name: "إزمير", nameEn: "Izmir" },
  AYT: { name: "أنطاليا", nameEn: "Antalya" },
};

export default {
  getCheapestFlights,
  getDirectFlights,
  getPopularDestinations,
  getMonthlyPrices,
  getSpecialOffers,
  searchHotelLocations,
  getHotels,
  getHotelDetails,
  generateFlightLink,
  generateHotelLink,
  IATA_CODES,
};
