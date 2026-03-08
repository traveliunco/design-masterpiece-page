
ALTER TABLE public.ready_packages 
  ADD COLUMN IF NOT EXISTS flight_offer_id uuid REFERENCES public.flight_offers(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS car_rental_id uuid REFERENCES public.car_rentals(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS default_room_id uuid REFERENCES public.hotel_rooms(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS default_hotel_id uuid REFERENCES public.hotels(id) ON DELETE SET NULL;
