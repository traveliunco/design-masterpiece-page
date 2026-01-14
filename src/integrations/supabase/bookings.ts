// =============================================
// Booking API Functions for Supabase
// =============================================

import { supabase } from "./client";
import type { Database } from "./types";

// Types
export type Booking = Database["public"]["Tables"]["bookings"]["Row"];
export type BookingInsert = Database["public"]["Tables"]["bookings"]["Insert"];
export type BookingUpdate = Database["public"]["Tables"]["bookings"]["Update"];

// =============================================
// CREATE - إنشاء حجز جديد
// =============================================
export const createBooking = async (booking: BookingInsert): Promise<Booking> => {
  const { data, error } = await supabase
    .from("bookings")
    .insert([booking])
    .select()
    .single();

  if (error) {
    console.error("Error creating booking:", error);
    throw new Error(error.message);
  }

  return data as Booking;
};

// =============================================
// READ - جلب حجز واحد
// =============================================
export const getBookingById = async (id: string): Promise<Booking | null> => {
  const { data, error } = await supabase
    .from("bookings")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    if (error.code === "PGRST116") return null; // لم يُعثر على الحجز
    console.error("Error fetching booking:", error);
    throw new Error(error.message);
  }

  return data as Booking;
};

// =============================================
// READ - جلب حجز برقم المرجع
// =============================================
export const getBookingByReference = async (reference: string): Promise<Booking | null> => {
  const { data, error } = await supabase
    .from("bookings")
    .select("*")
    .eq("booking_reference", reference)
    .single();

  if (error) {
    if (error.code === "PGRST116") return null;
    console.error("Error fetching booking by reference:", error);
    throw new Error(error.message);
  }

  return data as Booking;
};

// =============================================
// READ - جلب جميع حجوزات المستخدم
// =============================================
export const getUserBookings = async (userId: string): Promise<Booking[]> => {
  const { data, error } = await supabase
    .from("bookings")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching user bookings:", error);
    throw new Error(error.message);
  }

  return (data as Booking[]) || [];
};

// =============================================
// UPDATE - تحديث حجز
// =============================================
export const updateBooking = async (id: string, updates: BookingUpdate): Promise<Booking> => {
  const { data, error } = await supabase
    .from("bookings")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Error updating booking:", error);
    throw new Error(error.message);
  }

  return data as Booking;
};

// =============================================
// UPDATE - تأكيد الحجز
// =============================================
export const confirmBooking = async (id: string): Promise<Booking> => {
  return updateBooking(id, {
    status: "confirmed",
    confirmed_at: new Date().toISOString(),
  });
};

// =============================================
// UPDATE - إلغاء الحجز
// =============================================
export const cancelBooking = async (id: string, reason?: string): Promise<Booking> => {
  return updateBooking(id, {
    status: "cancelled",
    cancellation_reason: reason || null,
    cancelled_at: new Date().toISOString(),
  });
};

// =============================================
// UPDATE - تحديث حالة الدفع
// =============================================
export const updatePaymentStatus = async (
  id: string,
  paymentStatus: Booking["payment_status"]
): Promise<Booking> => {
  const updates: BookingUpdate = {
    payment_status: paymentStatus,
  };

  // إذا تم الدفع بالكامل، نؤكد الحجز تلقائياً
  if (paymentStatus === "paid") {
    updates.status = "confirmed";
    updates.confirmed_at = new Date().toISOString();
  }

  return updateBooking(id, updates);
};

// =============================================
// DELETE - حذف حجز (نادراً ما يُستخدم)
// =============================================
export const deleteBooking = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from("bookings")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Error deleting booking:", error);
    throw new Error(error.message);
  }
};

// =============================================
// HELPER - حساب السعر الإجمالي
// =============================================
export const calculateTotalPrice = (
  basePrice: number,
  adults: number,
  children: number,
  childPrice: number = 0,
  discountPercentage: number = 0
): { subtotal: number; discount: number; total: number } => {
  const adultTotal = basePrice * adults;
  const childTotal = childPrice * children;
  const subtotal = adultTotal + childTotal;
  const discount = (subtotal * discountPercentage) / 100;
  const total = subtotal - discount;

  return { subtotal, discount, total };
};
