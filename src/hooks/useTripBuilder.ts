import { useState, useCallback } from 'react';

export interface TripData {
  // Step 1 - Destination
  destinationId: string | null;
  destinationName: string;
  countryName: string;
  cityName: string;
  destinationAirportId: string | null;
  originAirportId: string | null;
  originCityName: string;
  checkInDate: Date | null;
  checkOutDate: Date | null;
  adultsCount: number;
  childrenCount: number;
  infantsCount: number;
  // Step 2 - Flight
  flightOfferId: string | null;
  flightDetails: any | null;
  flightPrice: number;
  // Step 3 - Hotel
  hotelId: string | null;
  hotelName: string;
  roomId: string | null;
  roomName: string;
  hotelPricePerNight: number;
  // Step 4 - Car Rental
  carRentalId: string | null;
  carRentalName: string;
  carRentalPricePerDay: number;
  carWithDriver: boolean;
  // Step 5 - Extras
  selectedActivities: { id: string; name: string; price: number }[];
  extras: {
    insurance: boolean;
    visa: boolean;
    insurancePrice: number;
    visaPrice: number;
  };
  // Step 6 - Summary
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  notes: string;
}

const initialTripData: TripData = {
  destinationId: null,
  destinationName: '',
  countryName: '',
  cityName: '',
  destinationAirportId: null,
  originAirportId: null,
  originCityName: 'الرياض',
  checkInDate: null,
  checkOutDate: null,
  adultsCount: 1,
  childrenCount: 0,
  infantsCount: 0,
  flightOfferId: null,
  flightDetails: null,
  flightPrice: 0,
  hotelId: null,
  hotelName: '',
  roomId: null,
  roomName: '',
  hotelPricePerNight: 0,
  carRentalId: null,
  carRentalName: '',
  carRentalPricePerDay: 0,
  carWithDriver: false,
  selectedActivities: [],
  extras: { insurance: false, visa: false, insurancePrice: 150, visaPrice: 300 },
  customerName: '',
  customerEmail: '',
  customerPhone: '',
  notes: '',
};

export const useTripBuilder = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [tripData, setTripData] = useState<TripData>(initialTripData);

  const totalSteps = 6;

  const updateTrip = useCallback((partial: Partial<TripData>) => {
    setTripData(prev => ({ ...prev, ...partial }));
  }, []);

  const nextStep = useCallback(() => {
    setCurrentStep(prev => Math.min(prev + 1, totalSteps - 1));
  }, []);

  const prevStep = useCallback(() => {
    setCurrentStep(prev => Math.max(prev - 1, 0));
  }, []);

  const goToStep = useCallback((step: number) => {
    setCurrentStep(Math.max(0, Math.min(step, totalSteps - 1)));
  }, []);

  const getNights = useCallback(() => {
    if (!tripData.checkInDate || !tripData.checkOutDate) return 0;
    const diff = tripData.checkOutDate.getTime() - tripData.checkInDate.getTime();
    return Math.max(1, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  }, [tripData.checkInDate, tripData.checkOutDate]);

  const getTotalPassengers = useCallback(() => {
    return tripData.adultsCount + tripData.childrenCount;
  }, [tripData.adultsCount, tripData.childrenCount]);

  const getSubtotal = useCallback(() => {
    const nights = getNights();
    let total = 0;
    total += tripData.flightPrice * getTotalPassengers();
    total += tripData.hotelPricePerNight * nights;
    total += tripData.carRentalPricePerDay * nights;
    total += tripData.selectedActivities.reduce((sum, a) => sum + a.price * getTotalPassengers(), 0);
    if (tripData.extras.insurance) total += tripData.extras.insurancePrice * getTotalPassengers();
    if (tripData.extras.visa) total += tripData.extras.visaPrice * getTotalPassengers();
    return total;
  }, [tripData, getNights, getTotalPassengers]);

  const getTaxes = useCallback(() => getSubtotal() * 0.15, [getSubtotal]);
  const getTotal = useCallback(() => getSubtotal() + getTaxes(), [getSubtotal, getTaxes]);

  const reset = useCallback(() => {
    setTripData(initialTripData);
    setCurrentStep(0);
  }, []);

  return {
    currentStep, totalSteps, tripData,
    updateTrip, nextStep, prevStep, goToStep, reset,
    getNights, getTotalPassengers, getSubtotal, getTaxes, getTotal,
  };
};
