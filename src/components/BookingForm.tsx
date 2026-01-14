import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { CalendarIcon, Loader2, Users, Phone, Mail, User, CheckCircle2 } from "lucide-react";
import { format } from "date-fns";
import { ar } from "date-fns/locale";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const formSchema = z.object({
  fullName: z.string().min(3, "الاسم يجب أن يكون 3 أحرف على الأقل"),
  email: z.string().email("البريد الإلكتروني غير صحيح"),
  phone: z.string().min(10, "رقم الهاتف غير صحيح"),
  date: z.date({
    required_error: "يرجى اختيار تاريخ السفر",
  }),
  adults: z.string().min(1, "يرجى تحديد عدد البالغين"),
  children: z.string().default("0"),
});

interface BookingFormProps {
  destinationName: string;
  adultPrice: number;
  childPrice?: number;
  onSuccess?: () => void;
}

export const BookingForm = ({ destinationName, adultPrice, childPrice, onSuccess }: BookingFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  // Default child price is 70% of adult price if not provided
  const effectiveChildPrice = childPrice || Math.round(adultPrice * 0.7);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      adults: "2",
      children: "0",
    },
  });

  // Watch for changes to calculate total
  const watchedAdults = parseInt(form.watch("adults") || "0");
  const watchedChildren = parseInt(form.watch("children") || "0");
  const subtotal = (watchedAdults * adultPrice) + (watchedChildren * effectiveChildPrice);
  const taxes = subtotal * 0.15;
  const serviceFee = 50;
  const totalAmount = subtotal + taxes + serviceFee;

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();

      const bookingData = {
        booking_reference: `TRV-${Math.random().toString(36).substring(2, 9).toUpperCase()}`,
        user_id: user?.id || null,
        booking_type: "direct_request",
        check_in_date: format(values.date, "yyyy-MM-dd"),
        check_out_date: format(values.date, "yyyy-MM-dd"), 
        adults_count: parseInt(values.adults),
        children_count: parseInt(values.children),
        infants_count: 0,
        subtotal: subtotal,
        discount_amount: 0,
        taxes: taxes,
        service_fee: serviceFee,
        total_amount: totalAmount,
        currency: "SAR",
        promo_discount: 0,
        points_earned: 0,
        points_redeemed: 0,
        points_value: 0,
        status: "pending",
        payment_status: "pending",
        special_requests: `وجهة الطلب: ${destinationName}`,
        internal_notes: `سعر البالغ: ${adultPrice}, سعر الطفل: ${effectiveChildPrice}`,
        source: "website_direct",
      };

      const { error } = await supabase.from("bookings").insert(bookingData);

      if (error) throw error;

      setIsSuccess(true);
      toast.success("تم إرسال طلب الحجز بنجاح! سيتواصل معك فريقنا قريباً.");
      if (onSuccess) onSuccess();
    } catch (error: any) {
      console.error("Booking error:", error);
      toast.error("حدث خطأ أثناء إرسال الطلب. يرجى المحاولة مرة أخرى.");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isSuccess) {
    return (
      <div className="text-center py-12 px-6 bg-green-50/50 rounded-3xl border border-green-100 animate-in fade-in zoom-in duration-500">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-10 h-10 text-green-600" />
        </div>
        <h3 className="text-2xl font-bold text-green-800 mb-2">شكراً لثقتك بنا!</h3>
        <p className="text-green-700/80 mb-8 leading-relaxed">
          لقد استلمنا طلب حجزك لرحلة <span className="font-bold">{destinationName}</span>. 
          سيقوم مستشار السفر الخاص بنا بالتواصل معك خلال 24 ساعة لتأكيد التفاصيل.
        </p>
        <Button 
          variant="outline" 
          onClick={() => {
            setIsSuccess(false);
            form.reset();
          }}
          className="rounded-full px-8"
        >
          إرسال طلب آخر
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-card glass-morphism p-8 rounded-[2.5rem] shadow-2xl border border-white/20">
      <div className="mb-8 overflow-hidden">
        <h3 className="text-2xl font-bold mb-2">طلب حجز مباشر</h3>
        <p className="text-muted-foreground text-sm">أدخل بياناتك وسنقوم بترتيب كل شيء لك</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          <FormField
            control={form.control}
            name="fullName"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs font-bold uppercase tracking-widest text-muted-foreground">الاسم الكامل</FormLabel>
                <FormControl>
                  <div className="relative">
                    <User className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary/50" />
                    <Input placeholder="أدخل اسمك الثلاثي" className="pr-10 h-12 bg-muted/30 border-none rounded-xl focus:ring-2 focus:ring-primary/20" {...field} />
                  </div>
                </FormControl>
                <FormMessage className="text-[10px]" />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-bold uppercase tracking-widest text-muted-foreground">البريد الإلكتروني</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Mail className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary/50" />
                      <Input placeholder="example@mail.com" className="pr-10 h-12 bg-muted/30 border-none rounded-xl focus:ring-2 focus:ring-primary/20" {...field} />
                    </div>
                  </FormControl>
                  <FormMessage className="text-[10px]" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-bold uppercase tracking-widest text-muted-foreground">رقم الجوال</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Phone className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary/50" />
                      <Input placeholder="05xxxxxxxx" className="pr-10 h-12 bg-muted/30 border-none rounded-xl focus:ring-2 focus:ring-primary/20 text-left" {...field} />
                    </div>
                  </FormControl>
                  <FormMessage className="text-[10px]" />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel className="text-xs font-bold uppercase tracking-widest text-muted-foreground">تاريخ السفر المتوقع</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pr-10 h-12 text-right font-normal bg-muted/30 border-none rounded-xl hover:bg-muted/50",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary/50" />
                          {field.value ? (
                            format(field.value, "PPP", { locale: ar })
                          ) : (
                            <span>اختر التاريخ</span>
                          )}
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) =>
                          date < new Date() || date < new Date("1900-01-01")
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage className="text-[10px]" />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-2">
              <FormField
                control={form.control}
                name="adults"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-bold uppercase tracking-widest text-muted-foreground">بالغين</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Users className="absolute right-3 top-1/2 -translate-y-1/2 w-3 h-3 text-primary/50" />
                        <Input type="number" min="1" className="pr-8 h-12 bg-muted/30 border-none rounded-xl focus:ring-2 focus:ring-primary/20" {...field} />
                      </div>
                    </FormControl>
                    <FormMessage className="text-[10px]" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="children"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-bold uppercase tracking-widest text-muted-foreground">أطفال</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Users className="absolute right-3 top-1/2 -translate-y-1/2 w-3 h-3 text-primary/50" />
                        <Input type="number" min="0" className="pr-8 h-12 bg-muted/30 border-none rounded-xl focus:ring-2 focus:ring-primary/20" {...field} />
                      </div>
                    </FormControl>
                    <FormMessage className="text-[10px]" />
                  </FormItem>
                )}
              />
            </div>
          </div>
          
          {/* Price Breakdown Display */}
          <div className="bg-primary/5 rounded-2xl p-6 border border-primary/10 space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">البالغين ({watchedAdults} × {adultPrice.toLocaleString()})</span>
              <span className="font-bold">{(watchedAdults * adultPrice).toLocaleString()} ر.س</span>
            </div>
            {watchedChildren > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">الأطفال ({watchedChildren} × {effectiveChildPrice.toLocaleString()})</span>
                <span className="font-bold">{(watchedChildren * effectiveChildPrice).toLocaleString()} ر.س</span>
              </div>
            )}
            <div className="pt-3 border-t border-primary/10 flex justify-between items-center">
              <span className="font-bold text-foreground">الإجمالي التقريبي</span>
              <div className="text-right">
                <span className="text-2xl font-black text-primary">{totalAmount.toLocaleString()}</span>
                <span className="text-xs font-bold text-primary mr-1">ر.س</span>
              </div>
            </div>
          </div>

          <Button 
            type="submit" 
            className="w-full h-14 bg-gradient-to-r from-primary to-teal-800 text-white font-bold rounded-2xl shadow-xl shadow-primary/20 hover:shadow-primary/40 transition-all hover:-translate-y-1"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                جاري إرسال طلبك...
              </>
            ) : (
              "تأكيد طلب الحجز"
            )}
          </Button>
          
          <p className="text-[10px] text-center text-muted-foreground mt-4">
            بإرسال هذا الطلب، أنت توافق على شروط الخدمة وسياسة الخصوصية الخاصة بنا
          </p>
        </form>
      </Form>
    </div>
  );
};

export default BookingForm;
