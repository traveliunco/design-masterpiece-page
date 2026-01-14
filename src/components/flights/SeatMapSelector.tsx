import { useState } from "react";
import { X, Check, User, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Seat {
  id: string;
  row: number;
  column: string;
  type: "standard" | "extra_legroom" | "exit" | "window" | "aisle" | "middle";
  available: boolean;
  price: number;
  selected?: boolean;
}

interface SeatMapSelectorProps {
  passengers: number;
  onConfirm: (seats: Seat[]) => void;
  onClose: () => void;
}

const SeatMapSelector = ({ passengers, onConfirm, onClose }: SeatMapSelectorProps) => {
  const columns = ["A", "B", "C", "", "D", "E", "F"];
  const rows = Array.from({ length: 30 }, (_, i) => i + 1);
  
  // Generate mock seats
  const generateSeats = (): Seat[] => {
    const seats: Seat[] = [];
    rows.forEach(row => {
      columns.forEach(col => {
        if (col === "") return;
        const isExit = row === 12 || row === 13;
        const isExtraLegroom = row <= 3;
        const isWindow = col === "A" || col === "F";
        const isAisle = col === "C" || col === "D";
        
        seats.push({
          id: `${row}${col}`,
          row,
          column: col,
          type: isExit ? "exit" : isExtraLegroom ? "extra_legroom" : isWindow ? "window" : isAisle ? "aisle" : "middle",
          available: Math.random() > 0.3,
          price: isExit ? 100 : isExtraLegroom ? 75 : isWindow ? 50 : isAisle ? 40 : 25,
        });
      });
    });
    return seats;
  };

  const [seats] = useState<Seat[]>(generateSeats);
  const [selectedSeats, setSelectedSeats] = useState<Seat[]>([]);

  const toggleSeat = (seat: Seat) => {
    if (!seat.available) return;
    
    const isSelected = selectedSeats.find(s => s.id === seat.id);
    if (isSelected) {
      setSelectedSeats(prev => prev.filter(s => s.id !== seat.id));
    } else if (selectedSeats.length < passengers) {
      setSelectedSeats(prev => [...prev, seat]);
    }
  };

  const getSeatColor = (seat: Seat) => {
    if (selectedSeats.find(s => s.id === seat.id)) return "bg-luxury-teal text-white";
    if (!seat.available) return "bg-gray-300 cursor-not-allowed";
    if (seat.type === "exit") return "bg-red-100 hover:bg-red-200 text-red-700";
    if (seat.type === "extra_legroom") return "bg-purple-100 hover:bg-purple-200 text-purple-700";
    if (seat.type === "window") return "bg-blue-100 hover:bg-blue-200 text-blue-700";
    if (seat.type === "aisle") return "bg-green-100 hover:bg-green-200 text-green-700";
    return "bg-gray-100 hover:bg-gray-200 text-gray-700";
  };

  const totalPrice = selectedSeats.reduce((sum, s) => sum + s.price, 0);

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[200] flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="p-6 border-b flex items-center justify-between bg-gradient-to-r from-luxury-navy to-[#0a3d5c]">
          <div className="text-white">
            <h3 className="text-2xl font-bold">اختيار المقاعد</h3>
            <p className="text-white/70">اختر {passengers} مقعد للمسافرين</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-full text-white">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex">
          {/* Seat Map */}
          <div className="flex-1 p-6 overflow-y-auto max-h-[60vh]">
            {/* Aircraft Front */}
            <div className="text-center mb-6">
              <div className="inline-block bg-gray-200 rounded-t-full px-12 py-4 text-gray-500 font-medium">
                مقدمة الطائرة ✈️
              </div>
            </div>

            {/* Seats Grid */}
            <div className="flex flex-col items-center gap-1">
              {/* Column Headers */}
              <div className="flex gap-1 mb-2">
                {columns.map((col, i) => (
                  <div key={i} className={cn("w-10 h-10 flex items-center justify-center font-bold text-gray-500", col === "" && "w-8")}>
                    {col}
                  </div>
                ))}
              </div>

              {/* Rows */}
              {rows.map(row => (
                <div key={row} className="flex gap-1 items-center">
                  {columns.map((col, i) => {
                    if (col === "") return <div key={i} className="w-8 text-center text-sm text-gray-400">{row}</div>;
                    
                    const seat = seats.find(s => s.row === row && s.column === col);
                    if (!seat) return null;

                    return (
                      <button
                        key={seat.id}
                        onClick={() => toggleSeat(seat)}
                        disabled={!seat.available}
                        className={cn(
                          "w-10 h-10 rounded-lg text-xs font-bold transition-all",
                          getSeatColor(seat),
                          seat.available && "cursor-pointer hover:scale-110"
                        )}
                        title={`${seat.id} - ${seat.price} ر.س`}
                      >
                        {selectedSeats.find(s => s.id === seat.id) ? <Check className="w-4 h-4 mx-auto" /> : seat.id}
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>

            {/* Exit Row Indicator */}
            <div className="flex items-center justify-center gap-2 my-4 text-red-600 text-sm">
              <AlertCircle className="w-4 h-4" />
              <span>صفوف الطوارئ (12-13)</span>
            </div>
          </div>

          {/* Legend & Summary */}
          <div className="w-72 border-r bg-gray-50 p-6">
            <h4 className="font-bold mb-4">دليل المقاعد</h4>
            
            <div className="space-y-3 mb-6">
              {[
                { color: "bg-purple-100", label: "مساحة إضافية للأرجل", price: "75" },
                { color: "bg-red-100", label: "مخرج طوارئ", price: "100" },
                { color: "bg-blue-100", label: "نافذة", price: "50" },
                { color: "bg-green-100", label: "ممر", price: "40" },
                { color: "bg-gray-100", label: "وسط", price: "25" },
                { color: "bg-gray-300", label: "محجوز", price: "-" },
                { color: "bg-luxury-teal", label: "اختيارك", price: "-" },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className={cn("w-8 h-8 rounded-lg", item.color)} />
                  <span className="text-sm flex-1">{item.label}</span>
                  {item.price !== "-" && <span className="text-xs text-gray-500">{item.price} ر.س</span>}
                </div>
              ))}
            </div>

            <hr className="my-4" />

            {/* Selected Seats */}
            <h4 className="font-bold mb-3">المقاعد المختارة ({selectedSeats.length}/{passengers})</h4>
            
            {selectedSeats.length > 0 ? (
              <div className="space-y-2 mb-4">
                {selectedSeats.map((seat, i) => (
                  <div key={seat.id} className="flex items-center gap-3 bg-white rounded-lg p-2">
                    <User className="w-5 h-5 text-luxury-teal" />
                    <span className="font-bold">{seat.id}</span>
                    <span className="text-sm text-gray-500 flex-1">{seat.type === "window" ? "نافذة" : seat.type === "aisle" ? "ممر" : seat.type === "exit" ? "طوارئ" : "عادي"}</span>
                    <span className="font-bold text-luxury-teal">{seat.price} ر.س</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm mb-4">لم تختر أي مقعد بعد</p>
            )}

            <div className="bg-luxury-teal/10 rounded-xl p-4 mb-4">
              <div className="flex justify-between text-lg font-bold">
                <span>الإجمالي</span>
                <span className="text-luxury-teal">{totalPrice} ر.س</span>
              </div>
            </div>

            <Button
              onClick={() => onConfirm(selectedSeats)}
              disabled={selectedSeats.length !== passengers}
              className="w-full bg-luxury-teal"
            >
              تأكيد الاختيار
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeatMapSelector;
