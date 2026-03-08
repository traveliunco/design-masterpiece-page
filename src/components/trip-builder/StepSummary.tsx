import { useState } from 'react';
import { MapPin, Plane, Hotel, Car, Shield, FileCheck, Check, Loader2, ChevronRight, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { TripData } from '@/hooks/useTripBuilder';
import { tripBuilderService } from '@/services/tripBuilderService';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';
import { cn } from '@/lib/utils';

interface Props {
  tripData: TripData;
  updateTrip: (data: Partial<TripData>) => void;
  onPrev: () => void;
  getNights: () => number;
  getTotalPassengers: () => number;
  getSubtotal: () => number;
  getTaxes: () => number;
  getTotal: () => number;
}

const StepSummary = ({ tripData, updateTrip, onPrev, getNights, getTotalPassengers, getSubtotal, getTaxes, getTotal }: Props) => {
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async () => {
    if (!tripData.customerName || !tripData.customerEmail || !tripData.customerPhone) {
      toast.error('يرجى ملء جميع بيانات التواصل');
      return;
    }
    setSubmitting(true);
    try {
      await tripBuilderService.savePackage({
        destination: tripData.destinationName,
        destination_id: tripData.destinationId,
        check_in_date: tripData.checkInDate?.toISOString().split('T')[0],
        check_out_date: tripData.checkOutDate?.toISOString().split('T')[0],
        adults_count: tripData.adultsCount,
        children_count: tripData.childrenCount,
        infants_count: tripData.infantsCount,
        flight_offer_id: tripData.flightOfferId,
        hotel_id: tripData.hotelId,
        room_id: tripData.roomId,
        car_rental_id: tripData.carRentalId,
        selected_activities: tripData.selectedActivities,
        extras: tripData.extras,
        subtotal: getSubtotal(),
        taxes: getTaxes(),
        total_price: getTotal(),
        customer_name: tripData.customerName,
        customer_email: tripData.customerEmail,
        customer_phone: tripData.customerPhone,
        notes: tripData.notes,
        status: 'pending',
        session_id: crypto.randomUUID(),
      });
      setSubmitted(true);
      toast.success('تم إرسال طلب البكج بنجاح!');
    } catch {
      toast.error('حدث خطأ، يرجى المحاولة مرة أخرى');
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="text-center py-20 space-y-5">
        <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
          <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center shadow-lg shadow-primary/30">
            <Check className="w-8 h-8 text-primary-foreground" />
          </div>
        </div>
        <h2 className="text-2xl font-black text-foreground">تم إرسال طلبك بنجاح!</h2>
        <p className="text-muted-foreground">سيتواصل معك فريقنا خلال 24 ساعة لتأكيد الحجز</p>
        <div className="bg-primary/10 rounded-2xl py-4 px-6 inline-block">
          <p className="text-2xl font-black text-primary">{getTotal().toLocaleString()} ر.س</p>
        </div>
      </div>
    );
  }

  const summaryItems = [
    tripData.flightPrice > 0 && {
      icon: Plane, label: 'طيران', color: 'text-blue-500', bg: 'bg-blue-500/10',
      value: (tripData.flightPrice * getTotalPassengers()).toLocaleString()
    },
    tripData.hotelPricePerNight > 0 && {
      icon: Hotel, label: `${tripData.hotelName} - ${tripData.roomName}`, color: 'text-amber-600', bg: 'bg-amber-500/10',
      value: (tripData.hotelPricePerNight * getNights()).toLocaleString()
    },
    tripData.carRentalPricePerDay > 0 && {
      icon: Car, label: tripData.carRentalName, color: 'text-emerald-600', bg: 'bg-emerald-500/10',
      value: (tripData.carRentalPricePerDay * getNights()).toLocaleString()
    },
    tripData.extras.insurance && {
      icon: Shield, label: 'تأمين سفر', color: 'text-purple-500', bg: 'bg-purple-500/10',
      value: (tripData.extras.insurancePrice * getTotalPassengers()).toLocaleString()
    },
    tripData.extras.visa && {
      icon: FileCheck, label: 'خدمة فيزا', color: 'text-indigo-500', bg: 'bg-indigo-500/10',
      value: (tripData.extras.visaPrice * getTotalPassengers()).toLocaleString()
    },
  ].filter(Boolean) as { icon: any; label: string; color: string; bg: string; value: string }[];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-br from-secondary/15 via-primary/5 to-transparent rounded-3xl p-6 text-center">
        <div className="w-14 h-14 mx-auto rounded-2xl bg-secondary/20 flex items-center justify-center mb-3">
          <FileCheck className="w-7 h-7 text-secondary" />
        </div>
        <h2 className="text-xl font-bold text-foreground">ملخص رحلتك</h2>
        <p className="text-sm text-muted-foreground mt-1">راجع التفاصيل وأكمل بيانات التواصل</p>
      </div>

      {/* Trip overview */}
      <div className="bg-card rounded-2xl border border-border overflow-hidden">
        {/* Destination header */}
        <div className="bg-gradient-to-l from-primary/10 to-secondary/10 p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
            <MapPin className="w-5 h-5 text-primary" />
          </div>
          <div className="flex-1">
            <p className="font-bold text-foreground">{tripData.destinationName}</p>
            <p className="text-[11px] text-muted-foreground">
              {tripData.checkInDate && format(tripData.checkInDate, 'dd MMM', { locale: ar })} — {tripData.checkOutDate && format(tripData.checkOutDate, 'dd MMM', { locale: ar })}
              {' · '}{getNights()} ليالي · {getTotalPassengers()} مسافرين
            </p>
          </div>
        </div>

        {/* Items */}
        <div className="p-4 space-y-3">
          {summaryItems.map((item, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className={cn('w-9 h-9 rounded-xl flex items-center justify-center shrink-0', item.bg)}>
                <item.icon className={cn('w-4 h-4', item.color)} />
              </div>
              <span className="flex-1 text-sm text-foreground">{item.label}</span>
              <span className="font-bold text-sm text-foreground">{item.value} ر.س</span>
            </div>
          ))}

          {tripData.selectedActivities.map(a => (
            <div key={a.id} className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-orange-500/10 flex items-center justify-center shrink-0">
                <MapPin className="w-4 h-4 text-orange-500" />
              </div>
              <span className="flex-1 text-sm text-foreground">{a.name}</span>
              <span className="font-bold text-sm text-foreground">{(a.price * getTotalPassengers()).toLocaleString()} ر.س</span>
            </div>
          ))}
        </div>

        {/* Totals */}
        <div className="border-t-2 border-dashed border-border mx-4" />
        <div className="p-4 space-y-2">
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>المجموع الفرعي</span>
            <span>{getSubtotal().toLocaleString()} ر.س</span>
          </div>
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>الضريبة 15%</span>
            <span>{getTaxes().toLocaleString()} ر.س</span>
          </div>
          <div className="flex justify-between items-center pt-3 border-t border-border">
            <span className="font-bold text-lg text-foreground">الإجمالي</span>
            <span className="text-2xl font-black text-primary">{getTotal().toLocaleString()} ر.س</span>
          </div>
        </div>
      </div>

      {/* Contact Form */}
      <div className="bg-card rounded-2xl border border-border p-4 space-y-4">
        <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
          <span className="w-1 h-4 bg-primary rounded-full" />
          بيانات التواصل
        </h3>
        <div className="space-y-3">
          <div>
            <label className="text-[11px] font-medium text-muted-foreground mb-1 block">الاسم الكامل *</label>
            <Input value={tripData.customerName} onChange={e => updateTrip({ customerName: e.target.value })} placeholder="محمد أحمد" className="rounded-xl h-12" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-medium text-muted-foreground mb-1 block">البريد الإلكتروني *</label>
              <Input type="email" value={tripData.customerEmail} onChange={e => updateTrip({ customerEmail: e.target.value })} placeholder="email@example.com" className="rounded-xl h-12" />
            </div>
            <div>
              <label className="text-[11px] font-medium text-muted-foreground mb-1 block">رقم الجوال *</label>
              <Input value={tripData.customerPhone} onChange={e => updateTrip({ customerPhone: e.target.value })} placeholder="+966 5XX" className="rounded-xl h-12" />
            </div>
          </div>
          <div>
            <label className="text-[11px] font-medium text-muted-foreground mb-1 block">ملاحظات إضافية</label>
            <Textarea value={tripData.notes} onChange={e => updateTrip({ notes: e.target.value })} placeholder="أي طلبات خاصة..." rows={3} className="rounded-xl" />
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex gap-3">
        <Button variant="outline" onClick={onPrev} className="rounded-xl h-14 px-5">
          <ChevronRight className="w-4 h-4 ml-1" />
          السابق
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={submitting}
          className="flex-1 rounded-xl h-14 bg-secondary text-secondary-foreground text-base font-black shadow-lg shadow-secondary/25 hover:shadow-xl transition-all"
        >
          {submitting ? <Loader2 className="w-5 h-5 animate-spin ml-2" /> : <Send className="w-5 h-5 ml-2" />}
          تأكيد الطلب
        </Button>
      </div>
    </div>
  );
};

export default StepSummary;
