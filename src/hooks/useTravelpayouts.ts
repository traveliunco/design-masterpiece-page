import { useQuery } from "@tanstack/react-query";
import {
  getCheapestFlights,
  getPopularDestinations,
  getMonthlyPrices,
  getSpecialOffers,
  searchHotelLocations,
  getHotels,
  CheapestFlightParams,
  HotelSearchParams,
} from "@/services/travelpayouts";

/**
 * Hook to get cheapest flights for a route
 */
export function useCheapestFlights(params: CheapestFlightParams, enabled = true) {
  return useQuery({
    queryKey: ["cheapestFlights", params],
    queryFn: () => getCheapestFlights(params),
    enabled: enabled && !!params.origin,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Hook to get popular destinations from an origin
 */
export function usePopularDestinations(origin: string, enabled = true) {
  return useQuery({
    queryKey: ["popularDestinations", origin],
    queryFn: () => getPopularDestinations(origin),
    enabled: enabled && !!origin,
    staleTime: 30 * 60 * 1000, // 30 minutes
  });
}

/**
 * Hook to get monthly price calendar
 */
export function useMonthlyPrices(
  origin: string,
  destination: string,
  month: string,
  enabled = true
) {
  return useQuery({
    queryKey: ["monthlyPrices", origin, destination, month],
    queryFn: () => getMonthlyPrices(origin, destination, month),
    enabled: enabled && !!origin && !!destination && !!month,
    staleTime: 60 * 60 * 1000, // 1 hour
  });
}

/**
 * Hook to get special flight offers
 */
export function useSpecialOffers(origin: string, enabled = true) {
  return useQuery({
    queryKey: ["specialOffers", origin],
    queryFn: () => getSpecialOffers(origin),
    enabled: enabled && !!origin,
    staleTime: 15 * 60 * 1000, // 15 minutes
  });
}

/**
 * Hook to search hotel locations
 */
export function useHotelLocationSearch(query: string, enabled = true) {
  return useQuery({
    queryKey: ["hotelLocations", query],
    queryFn: () => searchHotelLocations(query),
    enabled: enabled && query.length >= 2,
    staleTime: 60 * 60 * 1000, // 1 hour
  });
}

/**
 * Hook to get hotels by location
 */
export function useHotels(params: HotelSearchParams, enabled = true) {
  return useQuery({
    queryKey: ["hotels", params],
    queryFn: () => getHotels(params),
    enabled: enabled && !!params.locationId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
