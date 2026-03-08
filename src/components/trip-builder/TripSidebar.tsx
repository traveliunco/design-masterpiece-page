import { MapPin, Plane, Hotel, Car, Sparkles, Shield, FileCheck } from 'lucide-react';
import { TripData } from '@/hooks/useTripBuilder';
import { cn } from '@/lib/utils';

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

  const items = [
    tripData.destinationName && {
      icon: MapPin, color: 'text-primary', bg: 'bg-primary/10',
      label: tripData.destinationName, value: nights > 0 ? `${nights} ليالي` : ''
    },
    tripData.flightPrice > 0 && {
      icon: Plane, color: 'text-blue-500', bg: 'bg-blue-500/10',
      label: 'طيران', value: `${(tripData.flightPrice * passengers).toLocaleString()} ر.س`
    },
    tripData.hotelPricePerNight > 0 && {
      icon: Hotel, color: 'text-amber-600', bg: 'bg-amber-500/10',
      label: tripData.hotelName || 'فندق', value: `${(tripData.hotelPricePerNight * nights).toLocaleString()} ر.س`
    },
    tripData.carRentalPricePerDay > 0 && {
      icon: Car, color: 'text-emerald-600', bg: 'bg-emerald-500/10',
      label: tripData.carRentalName || 'سيارة', value: `${(tripData.carRentalPricePerDay * nights).toLocaleString()} ر.س`
    },
    tripData.extras.insurance && {
      icon: Shield, color: 'text-purple-500', bg: 'bg-purple-500/10',
      label: 'تأمين سفر', value: `${(tripData.extras.insurancePrice * passengers).toLocaleString()} ر.س`
    },
    tripData.extras.visa && {
      icon: FileCheck, color: 'text-indigo-500', bg: 'bg-indigo-500/10',
      label: 'خدمة فيزا', value: `${(tripData.extras.visaPrice * passengers).toLocaleString()} ر.س`
    },
  ].filter(Boolean) as { icon: any; color: string; bg: string; label: string; value: string }[];

  return (
    <div className="bg-card rounded-3xl border border-border p-5 sticky top-24 shadow-xl shadow-black/5">
      <h3 className="text-base font-black text-foreground mb-5 flex items-center gap-2">
        <div className="w-8 h-8 rounded-xl bg-secondary/15 flex items-center justify-center">
          <Sparkles className="w-4 h-4 text-secondary" />
        </div>
        ملخص رحلتك
      </h3>

      {items.length === 0 ? (
        <div className="text-center py-8">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-muted flex items-center justify-center mb-3">
            <MapPin className="w-6 h-6 text-muted-foreground" />
          </div>
          <p className="text-muted-foreground text-sm">ابدأ باختيار وجهتك</p>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((item, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className={cn('w-8 h-8 rounded-xl flex items-center justify-center shrink-0', item.bg)}>
                <item.icon className={cn('w-4 h-4', item.color)} />
              </div>
              <span className="flex-1 text-sm text-foreground truncate">{item.label}</span>
              <span className="text-xs font-bold text-muted-foreground shrink-0">{item.value}</span>
            </div>
          ))}

          {tripData.selectedActivities.map(act => (
            <div key={act.id} className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-orange-500/10 flex items-center justify-center shrink-0">
                <MapPin className="w-4 h-4 text-orange-500" />
              </div>
              <span className="flex-1 text-sm text-foreground truncate">{act.name}</span>
              <span className="text-xs font-bold text-muted-foreground shrink-0">{(act.price * passengers).toLocaleString()} ر.س</span>
            </div>
          ))}
        </div>
      )}

      {getSubtotal() > 0 && (
        <div className="mt-5 pt-4 border-t-2 border-dashed border-border space-y-2">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>المجموع الفرعي</span>
            <span>{getSubtotal().toLocaleString()} ر.س</span>
          </div>
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>الضريبة (15%)</span>
            <span>{getTaxes().toLocaleString()} ر.س</span>
          </div>
          <div className="bg-gradient-to-l from-primary/10 to-secondary/10 rounded-xl p-3 mt-3">
            <div className="flex justify-between items-center">
              <span className="font-bold text-sm text-foreground">الإجمالي</span>
              <span className="text-xl font-black text-primary">{getTotal().toLocaleString()} ر.س</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TripSidebar;
