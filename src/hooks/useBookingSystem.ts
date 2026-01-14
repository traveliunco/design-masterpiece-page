/**
 * React Query Hooks لنظام الحجوزات
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getAirports,
  getAirlines,
  getFlightOffers,
  getFeaturedFlights,
  getFlightOfferById,
  getHotels,
  getFeaturedHotels,
  getHotelById,
  getHotelRooms,
  getHotelWithRooms,
  createFlightBooking,
  createHotelBooking,
  getFlightBooking,
  getHotelBooking,
  createFlightOffer,
  updateFlightOffer,
  createHotel,
  updateHotel,
  createHotelRoom,
  FlightSearchParams,
  HotelSearchParams,
  FlightBookingData,
  HotelBookingData,
  FlightOffer,
  Hotel,
  HotelRoom,
} from "@/services/bookingSystem";

// =====================================================
// Airports & Airlines Hooks
// =====================================================

export function useAirports() {
  return useQuery({
    queryKey: ["airports"],
    queryFn: getAirports,
    staleTime: 1000 * 60 * 60, // 1 hour
  });
}

export function useAirlines() {
  return useQuery({
    queryKey: ["airlines"],
    queryFn: getAirlines,
    staleTime: 1000 * 60 * 60, // 1 hour
  });
}

// =====================================================
// Flight Offers Hooks
// =====================================================

export function useFlightOffers(params?: FlightSearchParams, enabled = true) {
  return useQuery({
    queryKey: ["flightOffers", params],
    queryFn: () => getFlightOffers(params),
    enabled,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

export function useFeaturedFlights(limit = 8) {
  return useQuery({
    queryKey: ["featuredFlights", limit],
    queryFn: () => getFeaturedFlights(limit),
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
}

export function useFlightOffer(id: string) {
  return useQuery({
    queryKey: ["flightOffer", id],
    queryFn: () => getFlightOfferById(id),
    enabled: !!id,
  });
}

// =====================================================
// Hotels Hooks
// =====================================================

export function useHotels(params?: HotelSearchParams, enabled = true) {
  return useQuery({
    queryKey: ["hotels", params],
    queryFn: () => getHotels(params),
    enabled,
    staleTime: 1000 * 60 * 5,
  });
}

export function useFeaturedHotels(limit = 6) {
  return useQuery({
    queryKey: ["featuredHotels", limit],
    queryFn: () => getFeaturedHotels(limit),
    staleTime: 1000 * 60 * 10,
  });
}

export function useHotel(id: string) {
  return useQuery({
    queryKey: ["hotel", id],
    queryFn: () => getHotelById(id),
    enabled: !!id,
  });
}

export function useHotelRooms(hotelId: string) {
  return useQuery({
    queryKey: ["hotelRooms", hotelId],
    queryFn: () => getHotelRooms(hotelId),
    enabled: !!hotelId,
  });
}

export function useHotelWithRooms(id: string) {
  return useQuery({
    queryKey: ["hotelWithRooms", id],
    queryFn: () => getHotelWithRooms(id),
    enabled: !!id,
  });
}

// =====================================================
// Booking Hooks
// =====================================================

export function useCreateFlightBooking() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: FlightBookingData) => createFlightBooking(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["flightOffers"] });
    },
  });
}

export function useCreateHotelBooking() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: HotelBookingData) => createHotelBooking(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["hotels"] });
      queryClient.invalidateQueries({ queryKey: ["hotelRooms"] });
    },
  });
}

export function useFlightBooking(reference: string) {
  return useQuery({
    queryKey: ["flightBooking", reference],
    queryFn: () => getFlightBooking(reference),
    enabled: !!reference,
  });
}

export function useHotelBooking(reference: string) {
  return useQuery({
    queryKey: ["hotelBooking", reference],
    queryFn: () => getHotelBooking(reference),
    enabled: !!reference,
  });
}

// =====================================================
// Admin Hooks
// =====================================================

export function useCreateFlightOffer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (offer: Partial<FlightOffer>) => createFlightOffer(offer),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["flightOffers"] });
      queryClient.invalidateQueries({ queryKey: ["featuredFlights"] });
    },
  });
}

export function useUpdateFlightOffer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<FlightOffer> }) =>
      updateFlightOffer(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["flightOffers"] });
      queryClient.invalidateQueries({ queryKey: ["featuredFlights"] });
    },
  });
}

export function useCreateHotel() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (hotel: Partial<Hotel>) => createHotel(hotel),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["hotels"] });
      queryClient.invalidateQueries({ queryKey: ["featuredHotels"] });
    },
  });
}

export function useUpdateHotel() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<Hotel> }) =>
      updateHotel(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["hotels"] });
      queryClient.invalidateQueries({ queryKey: ["featuredHotels"] });
    },
  });
}

export function useCreateHotelRoom() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (room: Partial<HotelRoom>) => createHotelRoom(room),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["hotelRooms", variables.hotel_id] });
    },
  });
}
