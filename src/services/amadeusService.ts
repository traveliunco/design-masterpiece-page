/**
 * خدمة Amadeus API المحسنة
 * للبحث عن الطيران، إنشاء الحجوزات، واسترجاع التذاكر
 */

// ==================== الإعدادات ====================

const AMADEUS_CONFIG = {
  baseUrl: 'https://test.api.amadeus.com', // Test environment
  apiKey: 'vYuL3AeVBdjbAofkdbxU5qeszpVpCeLi',
  apiSecret: 'qQDKJrQHUCem1XOp',
};

// Token Management
let accessToken: string | null = null;
let tokenExpiry: number = 0;

// ==================== المصادقة ====================

/**
 * الحصول على Access Token
 */
export const getAmadeusToken = async (): Promise<string> => {
  if (accessToken && Date.now() < tokenExpiry) {
    return accessToken;
  }

  try {
    const response = await fetch(`${AMADEUS_CONFIG.baseUrl}/v1/security/oauth2/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'client_credentials',
        client_id: AMADEUS_CONFIG.apiKey,
        client_secret: AMADEUS_CONFIG.apiSecret,
      }),
    });

    if (!response.ok) {
      throw new Error(`Auth failed: ${response.status}`);
    }

    const data = await response.json();
    accessToken = data.access_token;
    tokenExpiry = Date.now() + (data.expires_in - 60) * 1000;

    return accessToken;
  } catch (error) {
    console.error('Amadeus auth error:', error);
    throw error;
  }
};

/**
 * طلب API عام مع GET
 */
const amadeusGet = async (endpoint: string, params?: Record<string, string>) => {
  const token = await getAmadeusToken();
  const url = new URL(`${AMADEUS_CONFIG.baseUrl}${endpoint}`);
  
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.append(key, value);
    });
  }

  const response = await fetch(url.toString(), {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.error?.detail || `Request failed: ${response.status}`);
  }

  return response.json();
};

/**
 * طلب API عام مع POST
 */
const amadeusPost = async (endpoint: string, body: any) => {
  const token = await getAmadeusToken();
  
  const response = await fetch(`${AMADEUS_CONFIG.baseUrl}${endpoint}`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.error?.detail || `Request failed: ${response.status}`);
  }

  return response.json();
};

// ==================== الأنواع ====================

export interface FlightSearchParams {
  originLocationCode: string;
  destinationLocationCode: string;
  departureDate: string;
  returnDate?: string;
  adults: number;
  children?: number;
  infants?: number;
  travelClass?: 'ECONOMY' | 'PREMIUM_ECONOMY' | 'BUSINESS' | 'FIRST';
  nonStop?: boolean;
  currencyCode?: string;
  max?: number;
}

export interface FlightSegment {
  departure: { iataCode: string; terminal?: string; at: string };
  arrival: { iataCode: string; terminal?: string; at: string };
  carrierCode: string;
  number: string;
  aircraft: { code: string };
  operating?: { carrierCode: string };
  duration: string;
  numberOfStops: number;
}

export interface FlightItinerary {
  duration: string;
  segments: FlightSegment[];
}

export interface FlightOffer {
  id: string;
  source: string;
  instantTicketingRequired: boolean;
  nonHomogeneous: boolean;
  oneWay: boolean;
  lastTicketingDate: string;
  numberOfBookableSeats: number;
  itineraries: FlightItinerary[];
  price: {
    currency: string;
    total: string;
    base: string;
    fees?: Array<{ amount: string; type: string }>;
    grandTotal: string;
  };
  pricingOptions: {
    fareType: string[];
    includedCheckedBagsOnly: boolean;
  };
  validatingAirlineCodes: string[];
  travelerPricings: Array<{
    travelerId: string;
    fareOption: string;
    travelerType: string;
    price: { currency: string; total: string; base: string };
    fareDetailsBySegment: Array<{
      segmentId: string;
      cabin: string;
      fareBasis: string;
      class: string;
      includedCheckedBags?: { weight?: number; weightUnit?: string; quantity?: number };
    }>;
  }>;
}

export interface Location {
  type: string;
  subType: string;
  name: string;
  detailedName?: string;
  iataCode: string;
  address?: {
    cityName?: string;
    cityCode?: string;
    countryName?: string;
    countryCode?: string;
  };
  geoCode?: {
    latitude: number;
    longitude: number;
  };
}

export interface TravelerInfo {
  id: string;
  dateOfBirth: string;
  name: {
    firstName: string;
    lastName: string;
  };
  gender: 'MALE' | 'FEMALE';
  contact: {
    emailAddress: string;
    phones: Array<{
      deviceType: 'MOBILE' | 'LANDLINE';
      countryCallingCode: string;
      number: string;
    }>;
  };
  documents?: Array<{
    documentType: 'PASSPORT' | 'IDENTITY_CARD';
    birthPlace?: string;
    issuanceLocation?: string;
    issuanceDate?: string;
    number: string;
    expiryDate: string;
    issuanceCountry: string;
    validityCountry?: string;
    nationality: string;
    holder: boolean;
  }>;
}

export interface BookingRequest {
  flightOffers: FlightOffer[];
  travelers: TravelerInfo[];
  remarks?: {
    general?: Array<{ subType: string; text: string }>;
  };
  ticketingAgreement?: {
    option: string;
    dateTime?: string;
  };
  contacts: Array<{
    addresseeName: { firstName: string; lastName: string };
    companyName?: string;
    purpose: 'STANDARD' | 'INVOICE' | 'EMERGENCY';
    phones: Array<{
      deviceType: 'MOBILE' | 'LANDLINE';
      countryCallingCode: string;
      number: string;
    }>;
    emailAddress: string;
    address?: {
      lines: string[];
      postalCode: string;
      cityName: string;
      countryCode: string;
    };
  }>;
}

export interface BookingConfirmation {
  type: string;
  id: string;
  queuingOfficeId: string;
  associatedRecords: Array<{
    reference: string;
    creationDate: string;
    originSystemCode: string;
    flightOfferId: string;
  }>;
  flightOffers: FlightOffer[];
  travelers: TravelerInfo[];
  ticketingAgreement?: {
    option: string;
  };
}

export interface SeatMapResponse {
  data: Array<{
    type: string;
    id: string;
    departure: { iataCode: string; at: string };
    arrival: { iataCode: string; at: string };
    carrierCode: string;
    number: string;
    aircraft: { code: string };
    class: string;
    decks: Array<{
      deckType: string;
      deckConfiguration: {
        width: number;
        length: number;
        startseatRow: number;
        endSeatRow: number;
        startWingsRow?: number;
        endWingsRow?: number;
        startWingsX?: number;
        endWingsX?: number;
        exitRowsX?: number[];
      };
      seats: Array<{
        cabin: string;
        number: string;
        characteristicsCodes: string[];
        coordinates: { x: number; y: number };
        travelerPricing: Array<{
          travelerId: string;
          seatAvailabilityStatus: string;
          price: { currency: string; total: string };
        }>;
      }>;
      facilities?: Array<{
        code: string;
        column: string;
        row: string;
        position: string;
        coordinates: { x: number; y: number };
      }>;
    }>;
  }>;
}

// ==================== البحث عن الرحلات ====================

/**
 * البحث عن رحلات طيران
 */
export const searchFlights = async (params: FlightSearchParams): Promise<FlightOffer[]> => {
  try {
    const queryParams: Record<string, string> = {
      originLocationCode: params.originLocationCode,
      destinationLocationCode: params.destinationLocationCode,
      departureDate: params.departureDate,
      adults: params.adults.toString(),
      currencyCode: params.currencyCode || 'SAR',
      max: (params.max || 20).toString(),
    };

    if (params.returnDate) {
      queryParams.returnDate = params.returnDate;
    }
    if (params.children) {
      queryParams.children = params.children.toString();
    }
    if (params.infants) {
      queryParams.infants = params.infants.toString();
    }
    if (params.travelClass) {
      queryParams.travelClass = params.travelClass;
    }
    if (params.nonStop) {
      queryParams.nonStop = 'true';
    }

    const data = await amadeusGet('/v2/shopping/flight-offers', queryParams);
    return data.data || [];
  } catch (error) {
    console.error('Flight search error:', error);
    return [];
  }
};

// ==================== التحقق من السعر ====================

/**
 * التحقق من سعر الرحلة قبل الحجز
 */
export const verifyFlightPrice = async (flightOffer: FlightOffer): Promise<FlightOffer | null> => {
  try {
    const response = await amadeusPost('/v1/shopping/flight-offers/pricing', {
      data: {
        type: 'flight-offers-pricing',
        flightOffers: [flightOffer],
      },
    });
    return response.data?.flightOffers?.[0] || null;
  } catch (error) {
    console.error('Price verification error:', error);
    return null;
  }
};

// ==================== إنشاء الحجز ====================

/**
 * إنشاء حجز جديد (Flight Order)
 */
export const createBooking = async (
  flightOffer: FlightOffer,
  travelers: TravelerInfo[],
  contact: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    countryCode: string;
  }
): Promise<BookingConfirmation | null> => {
  try {
    // التحقق من السعر أولاً
    const verifiedOffer = await verifyFlightPrice(flightOffer);
    if (!verifiedOffer) {
      throw new Error('لم يتم التحقق من السعر');
    }

    const bookingRequest: BookingRequest = {
      flightOffers: [verifiedOffer],
      travelers: travelers.map((t, idx) => ({
        ...t,
        id: (idx + 1).toString(),
      })),
      remarks: {
        general: [
          { subType: 'GENERAL_MISCELLANEOUS', text: 'ONLINE BOOKING VIA TRAVELIUN' },
        ],
      },
      ticketingAgreement: {
        option: 'DELAY_TO_QUEUE',
      },
      contacts: [
        {
          addresseeName: {
            firstName: contact.firstName,
            lastName: contact.lastName,
          },
          purpose: 'STANDARD',
          phones: [
            {
              deviceType: 'MOBILE',
              countryCallingCode: contact.countryCode,
              number: contact.phone,
            },
          ],
          emailAddress: contact.email,
        },
      ],
    };

    const response = await amadeusPost('/v1/booking/flight-orders', { data: bookingRequest });
    return response.data;
  } catch (error) {
    console.error('Booking creation error:', error);
    return null;
  }
};

// ==================== استرجاع الحجز ====================

/**
 * استرجاع حجز موجود
 */
export const retrieveBooking = async (orderId: string): Promise<BookingConfirmation | null> => {
  try {
    const response = await amadeusGet(`/v1/booking/flight-orders/${orderId}`);
    return response.data;
  } catch (error) {
    console.error('Booking retrieval error:', error);
    return null;
  }
};

// ==================== إلغاء الحجز ====================

/**
 * إلغاء حجز
 */
export const cancelBooking = async (orderId: string): Promise<boolean> => {
  try {
    const token = await getAmadeusToken();
    const response = await fetch(`${AMADEUS_CONFIG.baseUrl}/v1/booking/flight-orders/${orderId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    return response.ok;
  } catch (error) {
    console.error('Booking cancellation error:', error);
    return false;
  }
};

// ==================== خريطة المقاعد ====================

/**
 * الحصول على خريطة المقاعد
 */
export const getSeatMap = async (flightOffer: FlightOffer): Promise<SeatMapResponse | null> => {
  try {
    const response = await amadeusPost('/v1/shopping/seatmaps', {
      data: [flightOffer],
    });
    return response;
  } catch (error) {
    console.error('Seat map error:', error);
    return null;
  }
};

// ==================== البحث عن المطارات ====================

/**
 * البحث عن المطارات والمدن
 */
export const searchLocations = async (keyword: string): Promise<Location[]> => {
  try {
    const data = await amadeusGet('/v1/reference-data/locations', {
      keyword,
      subType: 'CITY,AIRPORT',
      'page[limit]': '10',
    });
    return data.data || [];
  } catch (error) {
    console.error('Location search error:', error);
    return [];
  }
};

// ==================== معلومات شركات الطيران ====================

export const AIRLINE_INFO: Record<string, { name: string; nameAr: string; logo?: string }> = {
  SV: { name: 'Saudia', nameAr: 'الخطوط السعودية', logo: 'https://images.kiwi.com/airlines/64/SV.png' },
  EK: { name: 'Emirates', nameAr: 'طيران الإمارات', logo: 'https://images.kiwi.com/airlines/64/EK.png' },
  QR: { name: 'Qatar Airways', nameAr: 'الخطوط القطرية', logo: 'https://images.kiwi.com/airlines/64/QR.png' },
  TK: { name: 'Turkish Airlines', nameAr: 'الخطوط التركية', logo: 'https://images.kiwi.com/airlines/64/TK.png' },
  EY: { name: 'Etihad Airways', nameAr: 'الاتحاد للطيران', logo: 'https://images.kiwi.com/airlines/64/EY.png' },
  MS: { name: 'EgyptAir', nameAr: 'مصر للطيران', logo: 'https://images.kiwi.com/airlines/64/MS.png' },
  GF: { name: 'Gulf Air', nameAr: 'طيران الخليج', logo: 'https://images.kiwi.com/airlines/64/GF.png' },
  MH: { name: 'Malaysia Airlines', nameAr: 'الخطوط الماليزية', logo: 'https://images.kiwi.com/airlines/64/MH.png' },
  TG: { name: 'Thai Airways', nameAr: 'الخطوط التايلاندية', logo: 'https://images.kiwi.com/airlines/64/TG.png' },
  BA: { name: 'British Airways', nameAr: 'الخطوط البريطانية', logo: 'https://images.kiwi.com/airlines/64/BA.png' },
  AF: { name: 'Air France', nameAr: 'الخطوط الفرنسية', logo: 'https://images.kiwi.com/airlines/64/AF.png' },
  LH: { name: 'Lufthansa', nameAr: 'لوفتهانزا', logo: 'https://images.kiwi.com/airlines/64/LH.png' },
  FZ: { name: 'Flydubai', nameAr: 'فلاي دبي', logo: 'https://images.kiwi.com/airlines/64/FZ.png' },
  WY: { name: 'Oman Air', nameAr: 'الطيران العماني', logo: 'https://images.kiwi.com/airlines/64/WY.png' },
  KU: { name: 'Kuwait Airways', nameAr: 'الخطوط الكويتية', logo: 'https://images.kiwi.com/airlines/64/KU.png' },
  RJ: { name: 'Royal Jordanian', nameAr: 'الملكية الأردنية', logo: 'https://images.kiwi.com/airlines/64/RJ.png' },
};

/**
 * الحصول على معلومات شركة الطيران
 */
export const getAirlineInfo = (code: string) => {
  return AIRLINE_INFO[code] || { name: code, nameAr: code };
};

// ==================== تصدير الخدمة ====================

export const amadeusService = {
  // المصادقة
  getToken: getAmadeusToken,
  
  // الرحلات
  flights: {
    search: searchFlights,
    verifyPrice: verifyFlightPrice,
    getSeatMap,
  },
  
  // الحجوزات
  bookings: {
    create: createBooking,
    retrieve: retrieveBooking,
    cancel: cancelBooking,
  },
  
  // المواقع
  locations: {
    search: searchLocations,
  },
  
  // شركات الطيران
  airlines: {
    getInfo: getAirlineInfo,
    list: AIRLINE_INFO,
  },
};

export default amadeusService;
