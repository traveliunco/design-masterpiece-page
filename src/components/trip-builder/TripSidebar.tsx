import { MapPin, Plane, Hotel, Car, Sparkles, Shield, FileCheck, X } from 'lucide-react';
import { TripData } from '@/hooks/useTripBuilder';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';

interface TripSidebarProps {
  tripData: TripData;
  getNights: () => number;
  getTotalPassengers: () => number;
  getSubtotal: () => number;
  getTaxes: () => number;
  getTotal: () => number;
}

const TripSidebar = ({ tripData, getNights, getTotalPassengers, getSubtotal, getTaxes, getTotal }: TripSidebarProps) => {
  const nights = getNights();
  const passengers = getTotalPassengers();

  return (
    <div className="bg-card rounded-2xl border border-border p-5 sticky top-24 shadow-lg">
      <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
        <Sparkles className="w-5 h-5 text-secondary" />
        ملخص رحلتك
      </h3>

      <div className="space-y-3 text-sm">
        {tripData.destinationName && (
          <div className="flex items-center justify-between py-2 border-b border-border">
            <span className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="w-4 h-4" /> {tripData.destinationName}
            </span>
            {tripData.checkInDate && (
              <span className="text-xs text-muted-foreground">
                {nights} ليالي
              </span>
            )}
          </div>
        )}

        {tripData.flightPrice > 0 && (
          <div className="flex items-center justify-between py-2 border-b border-border">
            <span className="flex items-center gap-2 text-muted-foreground">
              <Plane className="w-4 h-4" /> طيران
            </span>
            <span className="font-semibold text-foreground">{(tripData.flightPrice * passengers).toLocaleString()} ر.س</span>
          </div>
        )}

        {tripData.hotelPricePerNight > 0 && (
          <div className="flex items-center justify-between py-2 border-b border-border">
            <span className="flex items-center gap-2 text-muted-foreground">
              <Hotel className="w-4 h-4" /> {tripData.hotelName || 'فندق'}
            </span>
            <span className="font-semibold text-foreground">{(tripData.hotelPricePerNight * nights).toLocaleString()} ر.س</span>
          </div>
        )}

        {tripData.carRentalPricePerDay > 0 && (
          <div className="flex items-center justify-between py-2 border-b border-border">
            <span className="flex items-center gap-2 text-muted-foreground">
              <Car className="w-4 h-4" /> {tripData.carRentalName || 'سيارة'}
            </span>
            <span className="font-semibold text-foreground">{(tripData.carRentalPricePerDay * nights).toLocaleString()} ر.س</span>
          </div>
        )}

        {tripData.selectedActivities.map(act => (
          <div key={act.id} className="flex items-center justify-between py-1.5 border-b border-border">
            <span className="text-muted-foreground text-xs">{act.name}</span>
            <span className="font-semibold text-foreground text-xs">{(act.price * passengers).toLocaleString()} ر.س</span>
          </div>
        ))}

        {tripData.extras.insurance && (
          <div className="flex items-center justify-between py-1.5 border-b border-border">
            <span className="flex items-center gap-2 text-muted-foreground text-xs"><Shield className="w-3 h-3" /> تأمين سفر</span>
            <span className="font-semibold text-foreground text-xs">{(tripData.extras.insurancePrice * passengers).toLocaleString()} ر.س</span>
          </div>
        )}

        {tripData.extras.visa && (
          <div className="flex items-center justify-between py-1.5 border-b border-border">
            <span className="flex items-center gap-2 text-muted-foreground text-xs"><FileCheck className="w-3 h-3" /> خدمة فيزا</span>
            <span className="font-semibold text-foreground text-xs">{(tripData.extras.visaPrice * passengers).toLocaleString()} ر.س</span>
          </div>
        )}
      </div>

      {getSubtotal() > 0 && (
        <div className="mt-4 pt-4 border-t-2 border-dashed border-border space-y-2">
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>المجموع الفرعي</span>
            <span>{getSubtotal().toLocaleString()} ر.س</span>
          </div>
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>الضريبة (15%)</span>
            <span>{getTaxes().toLocaleString()} ر.س</span>
          </div>
          <div className="flex justify-between text-lg font-bold text-primary pt-2 border-t border-border">
            <span>الإجمالي</span>
            <span>{getTotal().toLocaleString()} ر.س</span>
          </div>
        </div>
      )}

      {getSubtotal() === 0 && (
        <p className="text-center text-muted-foreground text-sm mt-6">ابدأ باختيار وجهتك لبناء رحلتك</p>
      )}
    </div>
  );
};

export default TripSidebar;
