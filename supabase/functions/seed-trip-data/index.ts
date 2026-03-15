import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const sb = createClient(supabaseUrl, serviceKey);

    const results: Record<string, number> = {};

    // ===== Airport IDs =====
    const airports = {
      RUH: "d038b227-60d9-4204-a0a7-a4ff414ee2c1",
      JED: "69309f41-fd35-4a78-a5bd-c9c050f6224f",
      KUL: "7b1ff2d5-df4e-4855-97ae-6d23b02345af",
      BKK: "a1a287c8-6c51-498e-952a-d5ffb124b142",
      DPS: "5e4e8da8-c0c8-45ce-b90a-587167de13a3",
      IST: "5a947fdf-677d-4746-a489-394c5c9df932",
      TBS: "0b2cc61d-073e-44c9-8ca8-fb319196c785",
      MLE: "e6a0ee14-d71e-4c89-bcca-b16059589dfc",
    };

    // ===== Airline IDs =====
    const airlines = {
      SV: "dcbbf994-6b48-450f-946a-11c8b7742117",
      XY: "2782570a-d46d-469a-96aa-3534cd53c3da",
      EK: "24de873a-1051-49a8-9c49-fa4fbba0bac8",
      TK: "874cb536-ea16-4360-9385-02093e07bf64",
      MH: "6af5399e-49c6-4635-8de0-e9a3508108f2",
      AK: "2692a7e7-6c30-445c-baad-db0bfa27a3a5",
    };

    // ===== 1. HOTELS =====
    const hotels = [
      // ماليزيا - كوالالمبور
      { name_ar: "فندق ماندارين أورينتال كوالالمبور", name_en: "Mandarin Oriental Kuala Lumpur", city_ar: "كوالالمبور", city_en: "Kuala Lumpur", country_ar: "ماليزيا", country_en: "Malaysia", star_rating: 5, rating: 4.8, main_image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800", hotel_type: "hotel", description_ar: "فندق فاخر يطل على برجي بتروناس التوأم" },
      { name_ar: "فندق هيلتون كوالالمبور", name_en: "Hilton Kuala Lumpur", city_ar: "كوالالمبور", city_en: "Kuala Lumpur", country_ar: "ماليزيا", country_en: "Malaysia", star_rating: 5, rating: 4.6, main_image: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800", hotel_type: "hotel", description_ar: "فندق راقي في قلب المدينة" },
      // تايلاند - بانكوك
      { name_ar: "فندق شانغريلا بانكوك", name_en: "Shangri-La Bangkok", city_ar: "بانكوك", city_en: "Bangkok", country_ar: "تايلاند", country_en: "Thailand", star_rating: 5, rating: 4.7, main_image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800", hotel_type: "hotel", description_ar: "فندق فخم على ضفاف نهر تشاو فرايا" },
      { name_ar: "فندق نوفوتيل بانكوك", name_en: "Novotel Bangkok", city_ar: "بانكوك", city_en: "Bangkok", country_ar: "تايلاند", country_en: "Thailand", star_rating: 4, rating: 4.3, main_image: "https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=800", hotel_type: "hotel", description_ar: "فندق عصري في منطقة سيام" },
      // إندونيسيا - بالي
      { name_ar: "منتجع سانت ريجيس بالي", name_en: "St. Regis Bali Resort", city_ar: "بالي", city_en: "Bali", country_ar: "إندونيسيا", country_en: "Indonesia", star_rating: 5, rating: 4.9, main_image: "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800", hotel_type: "resort", description_ar: "منتجع فاخر على شاطئ نوسا دوا" },
      { name_ar: "فندق آليلا أوبود", name_en: "Alila Ubud", city_ar: "بالي", city_en: "Bali", country_ar: "إندونيسيا", country_en: "Indonesia", star_rating: 5, rating: 4.7, main_image: "https://images.unsplash.com/photo-1540541338287-41700207dee6?w=800", hotel_type: "resort", description_ar: "منتجع استوائي وسط غابات أوبود" },
      // تركيا - اسطنبول
      { name_ar: "فندق رافلز اسطنبول", name_en: "Raffles Istanbul", city_ar: "اسطنبول", city_en: "Istanbul", country_ar: "تركيا", country_en: "Turkey", star_rating: 5, rating: 4.8, main_image: "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=800", hotel_type: "hotel", description_ar: "فندق فاخر يجمع بين الأصالة والحداثة" },
      { name_ar: "فندق ماريوت اسطنبول", name_en: "Marriott Istanbul", city_ar: "اسطنبول", city_en: "Istanbul", country_ar: "تركيا", country_en: "Turkey", star_rating: 5, rating: 4.5, main_image: "https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800", hotel_type: "hotel", description_ar: "فندق أنيق بإطلالة على البوسفور" },
      { name_ar: "فندق هوليداي إن تقسيم", name_en: "Holiday Inn Taksim", city_ar: "اسطنبول", city_en: "Istanbul", country_ar: "تركيا", country_en: "Turkey", star_rating: 4, rating: 4.2, main_image: "https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800", hotel_type: "hotel", description_ar: "فندق في قلب منطقة تقسيم" },
      // جورجيا - تبليسي
      { name_ar: "فندق رومز تبليسي", name_en: "Rooms Hotel Tbilisi", city_ar: "تبليسي", city_en: "Tbilisi", country_ar: "جورجيا", country_en: "Georgia", star_rating: 5, rating: 4.6, main_image: "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800", hotel_type: "hotel", description_ar: "فندق بوتيكي أنيق في قلب تبليسي" },
      { name_ar: "فندق هوليداي إن تبليسي", name_en: "Holiday Inn Tbilisi", city_ar: "تبليسي", city_en: "Tbilisi", country_ar: "جورجيا", country_en: "Georgia", star_rating: 4, rating: 4.1, main_image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800", hotel_type: "hotel", description_ar: "فندق مريح بموقع مركزي" },
      // المالديف - ماليه
      { name_ar: "منتجع والدورف أستوريا المالديف", name_en: "Waldorf Astoria Maldives", city_ar: "ماليه", city_en: "Male", country_ar: "المالديف", country_en: "Maldives", star_rating: 5, rating: 4.9, main_image: "https://images.unsplash.com/photo-1573843981267-be1999ff37cd?w=800", hotel_type: "resort", description_ar: "فيلات فوق الماء مع مسبح خاص" },
      { name_ar: "منتجع أنانتارا المالديف", name_en: "Anantara Maldives", city_ar: "ماليه", city_en: "Male", country_ar: "المالديف", country_en: "Maldives", star_rating: 5, rating: 4.8, main_image: "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=800", hotel_type: "resort", description_ar: "منتجع استوائي على جزيرة خاصة" },
    ];

    const { data: insertedHotels, error: hotelsErr } = await sb.from("hotels").insert(hotels).select("id, name_en, city_en");
    if (hotelsErr) throw new Error(`Hotels: ${hotelsErr.message}`);
    results.hotels = insertedHotels?.length || 0;

    // ===== 2. HOTEL ROOMS =====
    const rooms: any[] = [];
    for (const hotel of insertedHotels || []) {
      rooms.push(
        { hotel_id: hotel.id, name_ar: "غرفة قياسية", name_en: "Standard Room", room_type: "standard", price_per_night: hotel.city_en === "Male" ? 1200 : 350, max_adults: 2, max_children: 1, includes_breakfast: true, bed_type: "king" },
        { hotel_id: hotel.id, name_ar: "غرفة ديلوكس", name_en: "Deluxe Room", room_type: "deluxe", price_per_night: hotel.city_en === "Male" ? 2000 : 550, max_adults: 2, max_children: 2, includes_breakfast: true, bed_type: "king" },
        { hotel_id: hotel.id, name_ar: "جناح عائلي", name_en: "Family Suite", room_type: "suite", price_per_night: hotel.city_en === "Male" ? 3500 : 900, max_adults: 3, max_children: 2, includes_breakfast: true, bed_type: "twin" }
      );
    }
    const { error: roomsErr } = await sb.from("hotel_rooms").insert(rooms);
    if (roomsErr) throw new Error(`Rooms: ${roomsErr.message}`);
    results.hotel_rooms = rooms.length;

    // ===== 3. FLIGHT OFFERS =====
    const today = new Date();
    const futureDate = (days: number) => {
      const d = new Date(today);
      d.setDate(d.getDate() + days);
      return d.toISOString().split("T")[0];
    };

    const flights = [
      // الرياض → كوالالمبور
      { origin_airport_id: airports.RUH, destination_airport_id: airports.KUL, airline_id: airlines.MH, flight_number: "MH151", departure_date: futureDate(14), departure_time: "02:30", arrival_time: "14:45", duration_minutes: 495, price_adult: 1850, price_child: 1400, price_infant: 300, flight_class: "economy", is_direct: true, baggage_allowance: "30 kg" },
      { origin_airport_id: airports.RUH, destination_airport_id: airports.KUL, airline_id: airlines.SV, flight_number: "SV841", departure_date: futureDate(14), departure_time: "08:00", arrival_time: "20:30", duration_minutes: 510, price_adult: 2100, price_child: 1600, price_infant: 350, flight_class: "economy", is_direct: true },
      { origin_airport_id: airports.JED, destination_airport_id: airports.KUL, airline_id: airlines.AK, flight_number: "AK235", departure_date: futureDate(14), departure_time: "23:55", arrival_time: "13:20", duration_minutes: 565, price_adult: 1500, price_child: 1100, price_infant: 250, flight_class: "economy", is_direct: true },
      // الرياض → بانكوك
      { origin_airport_id: airports.RUH, destination_airport_id: airports.BKK, airline_id: airlines.SV, flight_number: "SV846", departure_date: futureDate(21), departure_time: "01:15", arrival_time: "13:00", duration_minutes: 465, price_adult: 2200, price_child: 1700, price_infant: 400, flight_class: "economy", is_direct: true },
      { origin_airport_id: airports.JED, destination_airport_id: airports.BKK, airline_id: airlines.EK, flight_number: "EK382", departure_date: futureDate(21), departure_time: "03:30", arrival_time: "18:45", duration_minutes: 555, price_adult: 2500, price_child: 1900, price_infant: 450, flight_class: "economy", is_direct: false, stops_count: 1 },
      // الرياض → بالي
      { origin_airport_id: airports.RUH, destination_airport_id: airports.DPS, airline_id: airlines.SV, flight_number: "SV871", departure_date: futureDate(30), departure_time: "22:00", arrival_time: "14:30", duration_minutes: 630, price_adult: 2800, price_child: 2100, price_infant: 500, flight_class: "economy", is_direct: false, stops_count: 1 },
      { origin_airport_id: airports.JED, destination_airport_id: airports.DPS, airline_id: airlines.MH, flight_number: "MH710", departure_date: futureDate(30), departure_time: "18:00", arrival_time: "12:00", duration_minutes: 720, price_adult: 2600, price_child: 2000, price_infant: 450, flight_class: "economy", is_direct: false, stops_count: 1 },
      // الرياض → اسطنبول
      { origin_airport_id: airports.RUH, destination_airport_id: airports.IST, airline_id: airlines.TK, flight_number: "TK143", departure_date: futureDate(10), departure_time: "07:30", arrival_time: "12:00", duration_minutes: 270, price_adult: 1400, price_child: 1050, price_infant: 200, flight_class: "economy", is_direct: true },
      { origin_airport_id: airports.RUH, destination_airport_id: airports.IST, airline_id: airlines.SV, flight_number: "SV261", departure_date: futureDate(10), departure_time: "14:00", arrival_time: "18:15", duration_minutes: 255, price_adult: 1600, price_child: 1200, price_infant: 250, flight_class: "economy", is_direct: true },
      { origin_airport_id: airports.JED, destination_airport_id: airports.IST, airline_id: airlines.TK, flight_number: "TK127", departure_date: futureDate(10), departure_time: "09:00", arrival_time: "13:45", duration_minutes: 285, price_adult: 1350, price_child: 1000, price_infant: 200, flight_class: "economy", is_direct: true },
      // الرياض → تبليسي
      { origin_airport_id: airports.RUH, destination_airport_id: airports.TBS, airline_id: airlines.SV, flight_number: "SV175", departure_date: futureDate(15), departure_time: "06:00", arrival_time: "10:30", duration_minutes: 270, price_adult: 1200, price_child: 900, price_infant: 180, flight_class: "economy", is_direct: true },
      { origin_airport_id: airports.JED, destination_airport_id: airports.TBS, airline_id: airlines.TK, flight_number: "TK759", departure_date: futureDate(15), departure_time: "11:00", arrival_time: "19:00", duration_minutes: 360, price_adult: 1350, price_child: 1000, price_infant: 200, flight_class: "economy", is_direct: false, stops_count: 1 },
      // الرياض → ماليه (المالديف)
      { origin_airport_id: airports.RUH, destination_airport_id: airports.MLE, airline_id: airlines.SV, flight_number: "SV789", departure_date: futureDate(20), departure_time: "03:00", arrival_time: "10:30", duration_minutes: 330, price_adult: 2400, price_child: 1800, price_infant: 400, flight_class: "economy", is_direct: true },
      { origin_airport_id: airports.JED, destination_airport_id: airports.MLE, airline_id: airlines.EK, flight_number: "EK651", departure_date: futureDate(20), departure_time: "08:00", arrival_time: "19:30", duration_minutes: 450, price_adult: 2800, price_child: 2100, price_infant: 500, flight_class: "economy", is_direct: false, stops_count: 1 },
      // بزنس كلاس
      { origin_airport_id: airports.RUH, destination_airport_id: airports.IST, airline_id: airlines.TK, flight_number: "TK143", departure_date: futureDate(10), departure_time: "07:30", arrival_time: "12:00", duration_minutes: 270, price_adult: 5500, price_child: 4200, price_infant: 800, flight_class: "business", is_direct: true, meal_included: true, baggage_allowance: "40 kg" },
      { origin_airport_id: airports.RUH, destination_airport_id: airports.KUL, airline_id: airlines.MH, flight_number: "MH151", departure_date: futureDate(14), departure_time: "02:30", arrival_time: "14:45", duration_minutes: 495, price_adult: 6200, price_child: 4700, price_infant: 900, flight_class: "business", is_direct: true, meal_included: true, baggage_allowance: "40 kg" },
      { origin_airport_id: airports.RUH, destination_airport_id: airports.MLE, airline_id: airlines.SV, flight_number: "SV789", departure_date: futureDate(20), departure_time: "03:00", arrival_time: "10:30", duration_minutes: 330, price_adult: 7500, price_child: 5600, price_infant: 1000, flight_class: "business", is_direct: true, meal_included: true, baggage_allowance: "40 kg" },
    ];

    const { error: flightsErr } = await sb.from("flight_offers").insert(flights);
    if (flightsErr) throw new Error(`Flights: ${flightsErr.message}`);
    results.flight_offers = flights.length;

    // ===== 4. CAR RENTALS =====
    const cars = [
      { name_ar: "تويوتا كامري", name_en: "Toyota Camry", city_ar: "كوالالمبور", city_en: "Kuala Lumpur", country_ar: "ماليزيا", country_en: "Malaysia", price_per_day: 120, price_with_driver: 200, category: "sedan", seats: 5, bags: 3, transmission: "automatic" },
      { name_ar: "هوندا سيتي", name_en: "Honda City", city_ar: "بانكوك", city_en: "Bangkok", country_ar: "تايلاند", country_en: "Thailand", price_per_day: 100, price_with_driver: 180, category: "sedan", seats: 5, bags: 2, transmission: "automatic" },
      { name_ar: "تويوتا أفانزا", name_en: "Toyota Avanza", city_ar: "بانكوك", city_en: "Bangkok", country_ar: "تايلاند", country_en: "Thailand", price_per_day: 150, price_with_driver: 230, category: "suv", seats: 7, bags: 4, transmission: "automatic" },
      { name_ar: "ميتسوبيشي إكسباندر", name_en: "Mitsubishi Xpander", city_ar: "بالي", city_en: "Bali", country_ar: "إندونيسيا", country_en: "Indonesia", price_per_day: 90, price_with_driver: 160, category: "suv", seats: 7, bags: 3, transmission: "automatic" },
      { name_ar: "مرسيدس E-Class", name_en: "Mercedes E-Class", city_ar: "اسطنبول", city_en: "Istanbul", country_ar: "تركيا", country_en: "Turkey", price_per_day: 250, price_with_driver: 380, category: "luxury", seats: 5, bags: 3, transmission: "automatic" },
      { name_ar: "فولكسفاغن جولف", name_en: "Volkswagen Golf", city_ar: "اسطنبول", city_en: "Istanbul", country_ar: "تركيا", country_en: "Turkey", price_per_day: 130, price_with_driver: 210, category: "sedan", seats: 5, bags: 2, transmission: "automatic" },
      { name_ar: "هيونداي توسان", name_en: "Hyundai Tucson", city_ar: "تبليسي", city_en: "Tbilisi", country_ar: "جورجيا", country_en: "Georgia", price_per_day: 80, price_with_driver: 140, category: "suv", seats: 5, bags: 3, transmission: "automatic" },
      { name_ar: "تويوتا لاند كروزر", name_en: "Toyota Land Cruiser", city_ar: "تبليسي", city_en: "Tbilisi", country_ar: "جورجيا", country_en: "Georgia", price_per_day: 180, price_with_driver: 280, category: "suv", seats: 7, bags: 4, transmission: "automatic" },
      { name_ar: "نيسان صني", name_en: "Nissan Sunny", city_ar: "كوالالمبور", city_en: "Kuala Lumpur", country_ar: "ماليزيا", country_en: "Malaysia", price_per_day: 80, price_with_driver: 150, category: "economy", seats: 5, bags: 2, transmission: "automatic" },
      { name_ar: "تويوتا فورتشنر", name_en: "Toyota Fortuner", city_ar: "بالي", city_en: "Bali", country_ar: "إندونيسيا", country_en: "Indonesia", price_per_day: 140, price_with_driver: 220, category: "suv", seats: 7, bags: 4, transmission: "automatic" },
    ];

    const { error: carsErr } = await sb.from("car_rentals").insert(cars);
    if (carsErr) throw new Error(`Cars: ${carsErr.message}`);
    results.car_rentals = cars.length;

    // ===== 5. TOUR ACTIVITIES (additional) =====
    const activities = [
      { name_ar: "جولة معابد بانكوك", name_en: "Bangkok Temples Tour", description_ar: "زيارة المعبد الذهبي ومعبد الفجر ومعبد بوذا الزمردي", city_ar: "بانكوك", city_en: "Bangkok", country_ar: "تايلاند", country_en: "Thailand", price_per_person: 150, duration_hours: 6, category: "ثقافة", image_url: "https://images.unsplash.com/photo-1563492065599-3520f775eeed?w=800" },
      { name_ar: "كهوف باتو وجنتنج هايلاندز", name_en: "Batu Caves & Genting", description_ar: "زيارة كهوف باتو الشهيرة ومرتفعات جنتنج", city_ar: "كوالالمبور", city_en: "Kuala Lumpur", country_ar: "ماليزيا", country_en: "Malaysia", price_per_person: 120, duration_hours: 8, category: "مغامرة", image_url: "https://images.unsplash.com/photo-1596422846543-75c6fc197f07?w=800" },
      { name_ar: "غوص في الحاجز المرجاني", name_en: "Coral Reef Diving", description_ar: "تجربة غوص مع مدرب في الشعاب المرجانية", city_ar: "ماليه", city_en: "Male", country_ar: "المالديف", country_en: "Maldives", price_per_person: 350, duration_hours: 4, category: "مغامرة", image_url: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800" },
      { name_ar: "رحلة كازبيجي الجبلية", name_en: "Kazbegi Mountain Trip", description_ar: "رحلة يوم كامل لجبال القوقاز وكنيسة جيرجيتي", city_ar: "تبليسي", city_en: "Tbilisi", country_ar: "جورجيا", country_en: "Georgia", price_per_person: 100, duration_hours: 10, category: "طبيعة", image_url: "https://images.unsplash.com/photo-1565008576549-57569a49371d?w=800" },
      { name_ar: "جولة البوسفور البحرية", name_en: "Bosphorus Cruise", description_ar: "رحلة بحرية ممتعة في مضيق البوسفور", city_ar: "اسطنبول", city_en: "Istanbul", country_ar: "تركيا", country_en: "Turkey", price_per_person: 80, duration_hours: 3, category: "ترفيه", image_url: "https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?w=800" },
      { name_ar: "جولة مدارج الأرز في أوبود", name_en: "Ubud Rice Terraces Tour", description_ar: "زيارة مدارج الأرز الشهيرة ومعبد تيرتا إمبول", city_ar: "بالي", city_en: "Bali", country_ar: "إندونيسيا", country_en: "Indonesia", price_per_person: 90, duration_hours: 7, category: "طبيعة", image_url: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800" },
      { name_ar: "جولة الأسواق التاريخية", name_en: "Grand Bazaar Tour", description_ar: "جولة في البازار الكبير والبازار المصري", city_ar: "اسطنبول", city_en: "Istanbul", country_ar: "تركيا", country_en: "Turkey", price_per_person: 60, duration_hours: 4, category: "ثقافة", image_url: "https://images.unsplash.com/photo-1558383409-91a3e2e77e13?w=800" },
      { name_ar: "رحلة غروب الشمس بالدولفين", name_en: "Dolphin Sunset Cruise", description_ar: "مشاهدة الدلافين مع غروب الشمس", city_ar: "ماليه", city_en: "Male", country_ar: "المالديف", country_en: "Maldives", price_per_person: 200, duration_hours: 3, category: "ترفيه", image_url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800" },
    ];

    const { error: activitiesErr } = await sb.from("tour_activities").insert(activities);
    if (activitiesErr) throw new Error(`Activities: ${activitiesErr.message}`);
    results.tour_activities = activities.length;

    return new Response(JSON.stringify({ success: true, results }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
