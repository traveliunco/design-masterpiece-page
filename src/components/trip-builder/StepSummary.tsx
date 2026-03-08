import { useState } from 'react';
import { MapPin, Plane, Hotel, Car, Shield, FileCheck, Check, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { TripData } from '@/hooks/useTripBuilder';
import { tripBuilderService } from '@/services/tripBuilderService';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';

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
      toast.success('تم إرسال طلب البكج بنجاح! سنتواصل معك قريباً');
    } catch (err) {
      toast.error('حدث خطأ، يرجى المحاولة مرة أخرى');
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="text-center py-16 space-y-4">
        <div className="w-20 h-20 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
          <Check className="w-10 h-10 text-primary" />
        </div>
        <h2 className="text-2xl font-bold text-foreground">تم إرسال طلبك بنجاح!</h2>
        <p className="text-muted-foreground">سيتواصل معك فريقنا خلال 24 ساعة لتأكيد الحجز</p>
        <p className="text-lg font-bold text-primary">{getTotal().toLocaleString()} ر.س</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-foreground mb-2">ملخص رحلتك</h2>
        <p className="text-muted-foreground">راجع التفاصيل وأكمل بيانات التواصل</p>
      </div>

      {/* Summary cards */}
      <div className="bg-card rounded-xl border border-border p-5 space-y-4">
        <div className="flex items-center gap-3 pb-3 border-b border-border">
          <MapPin className="w-5 h-5 text-primary" />
          <div>
            <p className="font-bold text-foreground">{tripData.destinationName}</p>
            <p className="text-xs text-muted-foreground">
              {tripData.checkInDate && format(tripData.checkInDate, 'PPP', { locale: ar })} — {tripData.checkOutDate && format(tripData.checkOutDate, 'PPP', { locale: ar })}
              {' · '}{getNights()} ليالي · {getTotalPassengers()} مسافرين
            </p>
          </div>
        </div>

        {tripData.flightPrice > 0 && (
          <div className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-2"><Plane className="w-4 h-4 text-primary" /> طيران</span>
            <span className="font-semibold">{(tripData.flightPrice * getTotalPassengers()).toLocaleString()} ر.س</span>
          </div>
        )}
        {tripData.hotelPricePerNight > 0 && (
          <div className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-2"><Hotel className="w-4 h-4 text-primary" /> {tripData.hotelName} - {tripData.roomName}</span>
            <span className="font-semibold">{(tripData.hotelPricePerNight * getNights()).toLocaleString()} ر.س</span>
          </div>
        )}
        {tripData.carRentalPricePerDay > 0 && (
          <div className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-2"><Car className="w-4 h-4 text-primary" /> {tripData.carRentalName}</span>
            <span className="font-semibold">{(tripData.carRentalPricePerDay * getNights()).toLocaleString()} ر.س</span>
          </div>
        )}
        {tripData.selectedActivities.map(a => (
          <div key={a.id} className="flex items-center justify-between text-sm">
            <span>{a.name}</span>
            <span className="font-semibold">{(a.price * getTotalPassengers()).toLocaleString()} ر.س</span>
          </div>
        ))}
        {tripData.extras.insurance && (
          <div className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-2"><Shield className="w-4 h-4 text-primary" /> تأمين سفر</span>
            <span className="font-semibold">{(tripData.extras.insurancePrice * getTotalPassengers()).toLocaleString()} ر.س</span>
          </div>
        )}
        {tripData.extras.visa && (
          <div className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-2"><FileCheck className="w-4 h-4 text-primary" /> خدمة فيزا</span>
            <span className="font-semibold">{(tripData.extras.visaPrice * getTotalPassengers()).toLocaleString()} ر.س</span>
          </div>
        )}

        <div className="pt-3 border-t border-dashed border-border space-y-1">
          <div className="flex justify-between text-sm text-muted-foreground"><span>المجموع الفرعي</span><span>{getSubtotal().toLocaleString()} ر.س</span></div>
          <div className="flex justify-between text-sm text-muted-foreground"><span>الضريبة 15%</span><span>{getTaxes().toLocaleString()} ر.س</span></div>
          <div className="flex justify-between text-xl font-bold text-primary pt-2 border-t border-border"><span>الإجمالي</span><span>{getTotal().toLocaleString()} ر.س</span></div>
        </div>
      </div>

      {/* Contact Form */}
      <div className="bg-card rounded-xl border border-border p-5 space-y-4">
        <h3 className="font-bold text-foreground">بيانات التواصل</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-muted-foreground mb-1 block">الاسم الكامل *</label>
            <Input value={tripData.customerName} onChange={e => updateTrip({ customerName: e.target.value })} placeholder="محمد أحمد" />
          </div>
          <div>
            <label className="text-sm text-muted-foreground mb-1 block">البريد الإلكتروني *</label>
            <Input type="email" value={tripData.customerEmail} onChange={e => updateTrip({ customerEmail: e.target.value })} placeholder="email@example.com" />
          </div>
          <div>
            <label className="text-sm text-muted-foreground mb-1 block">رقم الجوال *</label>
            <Input value={tripData.customerPhone} onChange={e => updateTrip({ customerPhone: e.target.value })} placeholder="+966 5XX XXX XXXX" />
          </div>
        </div>
        <div>
          <label className="text-sm text-muted-foreground mb-1 block">ملاحظات إضافية</label>
          <Textarea value={tripData.notes} onChange={e => updateTrip({ notes: e.target.value })} placeholder="أي طلبات خاصة..." rows={3} />
        </div>
      </div>

      <div className="flex justify-between">
        <Button variant="outline" onClick={onPrev}>السابق</Button>
        <Button onClick={handleSubmit} disabled={submitting} size="lg" className="bg-secondary text-secondary-foreground px-10 text-lg">
          {submitting ? <Loader2 className="w-5 h-5 animate-spin ml-2" /> : null}
          تأكيد الطلب
        </Button>
      </div>
    </div>
  );
};

export default StepSummary;
