/**
 * React Hook للتكامل مع Amadeus API
 * يوفر وظائف البحث عن الطيران والفنادق
 */

import { useState, useCallback } from 'react';
import amadeusService, {
    FlightSearchParams,
    FlightOffer,
    HotelSearchParams,
    HotelOffer,
    Location,
} from '@/services/amadeusService';

// ==================== حالة البحث ====================

interface SearchState<T> {
    data: T[];
    loading: boolean;
    error: string | null;
}

// ==================== Hook البحث عن الطيران ====================

export const useFlightSearch = () => {
    const [state, setState] = useState<SearchState<FlightOffer>>({
        data: [],
        loading: false,
        error: null,
    });

    const search = useCallback(async (params: FlightSearchParams) => {
        setState({ data: [], loading: true, error: null });

        try {
            const results = await amadeusService.flights.search(params);
            setState({ data: results, loading: false, error: null });
            return results;
        } catch (error: any) {
            setState({ data: [], loading: false, error: error.message });
            return [];
        }
    }, []);

    const reset = useCallback(() => {
        setState({ data: [], loading: false, error: null });
    }, []);

    return {
        flights: state.data,
        loading: state.loading,
        error: state.error,
        search,
        reset,
    };
};

// ==================== Hook البحث عن الفنادق ====================

export const useHotelSearch = () => {
    const [state, setState] = useState<SearchState<HotelOffer>>({
        data: [],
        loading: false,
        error: null,
    });

    const search = useCallback(async (params: HotelSearchParams) => {
        setState({ data: [], loading: true, error: null });

        try {
            const results = await amadeusService.hotels.searchOffers(params);
            setState({ data: results, loading: false, error: null });
            return results;
        } catch (error: any) {
            setState({ data: [], loading: false, error: error.message });
            return [];
        }
    }, []);

    const searchByCity = useCallback(async (cityCode: string) => {
        setState({ data: [], loading: true, error: null });

        try {
            const results = await amadeusService.hotels.searchByCity(cityCode);
            setState({ data: results as any, loading: false, error: null });
            return results;
        } catch (error: any) {
            setState({ data: [], loading: false, error: error.message });
            return [];
        }
    }, []);

    const reset = useCallback(() => {
        setState({ data: [], loading: false, error: null });
    }, []);

    return {
        hotels: state.data,
        loading: state.loading,
        error: state.error,
        search,
        searchByCity,
        reset,
    };
};

// ==================== Hook البحث عن المواقع ====================

export const useLocationSearch = () => {
    const [state, setState] = useState<SearchState<Location>>({
        data: [],
        loading: false,
        error: null,
    });

    const search = useCallback(async (keyword: string) => {
        if (keyword.length < 2) {
            setState({ data: [], loading: false, error: null });
            return [];
        }

        setState(prev => ({ ...prev, loading: true, error: null }));

        try {
            const results = await amadeusService.locations.search(keyword);
            setState({ data: results, loading: false, error: null });
            return results;
        } catch (error: any) {
            setState({ data: [], loading: false, error: error.message });
            return [];
        }
    }, []);

    const reset = useCallback(() => {
        setState({ data: [], loading: false, error: null });
    }, []);

    return {
        locations: state.data,
        loading: state.loading,
        error: state.error,
        search,
        reset,
    };
};

// ==================== Hook الوجهات الشائعة ====================

export const usePopularDestinations = () => {
    const [state, setState] = useState<SearchState<any>>({
        data: [],
        loading: false,
        error: null,
    });

    const fetch = useCallback(async (originCityCode: string = 'RUH') => {
        setState({ data: [], loading: true, error: null });

        try {
            const results = await amadeusService.destinations.getPopular(originCityCode);
            setState({ data: results, loading: false, error: null });
            return results;
        } catch (error: any) {
            setState({ data: [], loading: false, error: error.message });
            return [];
        }
    }, []);

    return {
        destinations: state.data,
        loading: state.loading,
        error: state.error,
        fetch,
    };
};

// ==================== تحويل البيانات ====================

/**
 * تحويل مدة الرحلة لصيغة مقروءة
 */
export const formatFlightDuration = (duration: string): string => {
    // PT2H30M -> 2س 30د
    const hours = duration.match(/(\d+)H/)?.[1] || '0';
    const minutes = duration.match(/(\d+)M/)?.[1] || '0';
    return `${hours}س ${minutes}د`;
};

/**
 * تحويل التاريخ والوقت
 */
export const formatFlightTime = (dateTime: string): string => {
    const date = new Date(dateTime);
    return date.toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' });
};

/**
 * تحويل السعر
 */
export const formatPrice = (price: string, currency: string): string => {
    const num = parseFloat(price);
    return new Intl.NumberFormat('ar-SA', {
        style: 'currency',
        currency: currency || 'SAR',
        minimumFractionDigits: 0,
    }).format(num);
};

/**
 * الحصول على اسم شركة الطيران
 */
export const getAirlineName = (code: string): string => {
    const airlines: Record<string, string> = {
        SV: 'الخطوط السعودية',
        XY: 'فلاي ناس',
        F3: 'فلاي أديل',
        EK: 'طيران الإمارات',
        QR: 'الخطوط القطرية',
        EY: 'الاتحاد للطيران',
        TK: 'الخطوط التركية',
        MH: 'الخطوط الماليزية',
        TG: 'الخطوط التايلاندية',
        GA: 'جارودا إندونيسيا',
    };
    return airlines[code] || code;
};

/**
 * الحصول على اسم المدينة
 */
export const getCityName = (code: string): string => {
    const cities: Record<string, string> = {
        RUH: 'الرياض',
        JED: 'جدة',
        DMM: 'الدمام',
        MED: 'المدينة المنورة',
        KUL: 'كوالالمبور',
        BKK: 'بانكوك',
        IST: 'إسطنبول',
        DXB: 'دبي',
        CGK: 'جاكرتا',
        MLE: 'ماليه',
        TBS: 'تبليسي',
        GYD: 'باكو',
    };
    return cities[code] || code;
};

export default {
    useFlightSearch,
    useHotelSearch,
    useLocationSearch,
    usePopularDestinations,
    formatFlightDuration,
    formatFlightTime,
    formatPrice,
    getAirlineName,
    getCityName,
};
