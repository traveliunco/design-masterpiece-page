/**
 * صفحة إدارة عروض الرحلات - لوحة التحكم
 */

import { useState, useEffect } from "react";
import {
  Plane,
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  Filter,
  Calendar,
  Star,
  Loader2,
  ArrowUpDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface FlightOffer {
  id: string;
  origin_airport_id: string;
  destination_airport_id: string;
  airline_id: string;
  departure_date: string;
  return_date?: string;
  departure_time?: string;
  arrival_time?: string;
  flight_number?: string;
  flight_class: string;
  is_direct: boolean;
  stops_count: number;
  duration_minutes?: number;
  price_adult: number;
  price_child?: number;
  price_infant?: number;
  original_price?: number;
  currency: string;
  available_seats: number;
  is_featured: boolean;
  is_active: boolean;
  baggage_allowance?: string;
  meal_included: boolean;
  notes?: string;
  origin_airport?: any;
  destination_airport?: any;
  airline?: any;
}

interface Airport {
  id: string;
  name_ar: string;
  iata_code: string;
  city_ar: string;
}

interface Airline {
  id: string;
  name_ar: string;
  iata_code: string;
}

const AdminFlights = () => {
  const [flights, setFlights] = useState<FlightOffer[]>([]);
  const [airports, setAirports] = useState<Airport[]>([]);
  const [airlines, setAirlines] = useState<Airline[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingFlight, setEditingFlight] = useState<FlightOffer | null>(null);

  const [formData, setFormData] = useState({
    origin_airport_id: "",
    destination_airport_id: "",
    airline_id: "",
    departure_date: "",
    return_date: "",
    departure_time: "",
    arrival_time: "",
    flight_number: "",
    flight_class: "economy",
    is_direct: true,
    stops_count: 0,
    duration_minutes: 0,
    price_adult: 0,
    price_child: 0,
    price_infant: 0,
    original_price: 0,
    available_seats: 10,
    is_featured: false,
    is_active: true,
    baggage_allowance: "23 kg",
    meal_included: false,
    notes: "",
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      // Load flights
      const { data: flightsData } = await supabase
        .from("flight_offers")
        .select(`
          *,
          origin_airport:airports!origin_airport_id(id, name_ar, iata_code, city_ar),
          destination_airport:airports!destination_airport_id(id, name_ar, iata_code, city_ar),
          airline:airlines!airline_id(id, name_ar, iata_code)
        `)
        .order("departure_date", { ascending: true });

      // Load airports
      const { data: airportsData } = await supabase
        .from("airports")
        .select("id, name_ar, iata_code, city_ar")
        .eq("is_active", true)
        .order("city_ar");

      // Load airlines
      const { data: airlinesData } = await supabase
        .from("airlines")
        .select("id, name_ar, iata_code")
        .eq("is_active", true)
        .order("name_ar");

      if (flightsData) setFlights(flightsData);
      if (airportsData) setAirports(airportsData);
      if (airlinesData) setAirlines(airlinesData);
    } catch (error) {
      console.error("Error loading data:", error);
      toast.error("حدث خطأ في تحميل البيانات");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!formData.origin_airport_id || !formData.destination_airport_id || !formData.departure_date || !formData.price_adult) {
      toast.error("يرجى ملء الحقول المطلوبة");
      return;
    }

    setSaving(true);
    try {
      const data = {
        ...formData,
        price_adult: parseFloat(formData.price_adult.toString()),
        price_child: formData.price_child ? parseFloat(formData.price_child.toString()) : null,
        price_infant: formData.price_infant ? parseFloat(formData.price_infant.toString()) : null,
        original_price: formData.original_price ? parseFloat(formData.original_price.toString()) : null,
        duration_minutes: formData.duration_minutes || null,
        stops_count: formData.is_direct ? 0 : formData.stops_count,
      };

      if (editingFlight) {
        const { error } = await supabase
          .from("flight_offers")
          .update({ ...data, updated_at: new Date().toISOString() })
          .eq("id", editingFlight.id);

        if (error) throw error;
        toast.success("تم تحديث العرض بنجاح");
      } else {
        const { error } = await supabase
          .from("flight_offers")
          .insert(data);

        if (error) throw error;
        toast.success("تم إضافة العرض بنجاح");
      }

      setIsDialogOpen(false);
      resetForm();
      loadData();
    } catch (error: any) {
      console.error("Error saving:", error);
      toast.error(error.message || "حدث خطأ");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("هل أنت متأكد من حذف هذا العرض؟")) return;

    try {
      const { error } = await supabase
        .from("flight_offers")
        .update({ is_active: false })
        .eq("id", id);

      if (error) throw error;
      toast.success("تم حذف العرض");
      loadData();
    } catch (error) {
      toast.error("حدث خطأ في الحذف");
    }
  };

  const handleEdit = (flight: FlightOffer) => {
    setEditingFlight(flight);
    setFormData({
      origin_airport_id: flight.origin_airport_id || "",
      destination_airport_id: flight.destination_airport_id || "",
      airline_id: flight.airline_id || "",
      departure_date: flight.departure_date || "",
      return_date: flight.return_date || "",
      departure_time: flight.departure_time || "",
      arrival_time: flight.arrival_time || "",
      flight_number: flight.flight_number || "",
      flight_class: flight.flight_class || "economy",
      is_direct: flight.is_direct ?? true,
      stops_count: flight.stops_count || 0,
      duration_minutes: flight.duration_minutes || 0,
      price_adult: flight.price_adult || 0,
      price_child: flight.price_child || 0,
      price_infant: flight.price_infant || 0,
      original_price: flight.original_price || 0,
      available_seats: flight.available_seats || 10,
      is_featured: flight.is_featured ?? false,
      is_active: flight.is_active ?? true,
      baggage_allowance: flight.baggage_allowance || "23 kg",
      meal_included: flight.meal_included ?? false,
      notes: flight.notes || "",
    });
    setIsDialogOpen(true);
  };

  const resetForm = () => {
    setEditingFlight(null);
    setFormData({
      origin_airport_id: "",
      destination_airport_id: "",
      airline_id: "",
      departure_date: "",
      return_date: "",
      departure_time: "",
      arrival_time: "",
      flight_number: "",
      flight_class: "economy",
      is_direct: true,
      stops_count: 0,
      duration_minutes: 0,
      price_adult: 0,
      price_child: 0,
      price_infant: 0,
      original_price: 0,
      available_seats: 10,
      is_featured: false,
      is_active: true,
      baggage_allowance: "23 kg",
      meal_included: false,
      notes: "",
    });
  };

  const filteredFlights = flights.filter((f) => {
    if (!searchQuery) return true;
    const search = searchQuery.toLowerCase();
    return (
      f.origin_airport?.city_ar?.toLowerCase().includes(search) ||
      f.destination_airport?.city_ar?.toLowerCase().includes(search) ||
      f.airline?.name_ar?.toLowerCase().includes(search) ||
      f.flight_number?.toLowerCase().includes(search)
    );
  });

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("ar-SA", {
      style: "currency",
      currency: "SAR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Plane className="w-6 h-6 text-primary" />
            عروض الرحلات
          </h1>
          <p className="text-muted-foreground">إدارة عروض رحلات الطيران</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="w-4 h-4 ml-2" />
              إضافة عرض
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingFlight ? "تعديل العرض" : "إضافة عرض جديد"}</DialogTitle>
              <DialogDescription>أدخل تفاصيل عرض الرحلة</DialogDescription>
            </DialogHeader>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Origin */}
              <div className="space-y-2">
                <Label>مطار المغادرة *</Label>
                <Select value={formData.origin_airport_id} onValueChange={(v) => setFormData({ ...formData, origin_airport_id: v })}>
                  <SelectTrigger><SelectValue placeholder="اختر المطار" /></SelectTrigger>
                  <SelectContent>
                    {airports.map((a) => (
                      <SelectItem key={a.id} value={a.id}>
                        {a.iata_code} - {a.city_ar}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Destination */}
              <div className="space-y-2">
                <Label>مطار الوصول *</Label>
                <Select value={formData.destination_airport_id} onValueChange={(v) => setFormData({ ...formData, destination_airport_id: v })}>
                  <SelectTrigger><SelectValue placeholder="اختر المطار" /></SelectTrigger>
                  <SelectContent>
                    {airports.map((a) => (
                      <SelectItem key={a.id} value={a.id}>
                        {a.iata_code} - {a.city_ar}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Airline */}
              <div className="space-y-2">
                <Label>شركة الطيران</Label>
                <Select value={formData.airline_id} onValueChange={(v) => setFormData({ ...formData, airline_id: v })}>
                  <SelectTrigger><SelectValue placeholder="اختر الشركة" /></SelectTrigger>
                  <SelectContent>
                    {airlines.map((a) => (
                      <SelectItem key={a.id} value={a.id}>
                        {a.name_ar} ({a.iata_code})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Flight Number */}
              <div className="space-y-2">
                <Label>رقم الرحلة</Label>
                <Input
                  value={formData.flight_number}
                  onChange={(e) => setFormData({ ...formData, flight_number: e.target.value })}
                  placeholder="SV 123"
                />
              </div>

              {/* Departure Date */}
              <div className="space-y-2">
                <Label>تاريخ المغادرة *</Label>
                <Input
                  type="date"
                  value={formData.departure_date}
                  onChange={(e) => setFormData({ ...formData, departure_date: e.target.value })}
                />
              </div>

              {/* Return Date */}
              <div className="space-y-2">
                <Label>تاريخ العودة</Label>
                <Input
                  type="date"
                  value={formData.return_date}
                  onChange={(e) => setFormData({ ...formData, return_date: e.target.value })}
                />
              </div>

              {/* Times */}
              <div className="space-y-2">
                <Label>وقت المغادرة</Label>
                <Input
                  type="time"
                  value={formData.departure_time}
                  onChange={(e) => setFormData({ ...formData, departure_time: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label>وقت الوصول</Label>
                <Input
                  type="time"
                  value={formData.arrival_time}
                  onChange={(e) => setFormData({ ...formData, arrival_time: e.target.value })}
                />
              </div>

              {/* Class */}
              <div className="space-y-2">
                <Label>درجة السفر</Label>
                <Select value={formData.flight_class} onValueChange={(v) => setFormData({ ...formData, flight_class: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="economy">الدرجة السياحية</SelectItem>
                    <SelectItem value="business">درجة رجال الأعمال</SelectItem>
                    <SelectItem value="first">الدرجة الأولى</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Duration */}
              <div className="space-y-2">
                <Label>مدة الرحلة (دقائق)</Label>
                <Input
                  type="number"
                  value={formData.duration_minutes}
                  onChange={(e) => setFormData({ ...formData, duration_minutes: parseInt(e.target.value) || 0 })}
                />
              </div>

              {/* Prices */}
              <div className="space-y-2">
                <Label>سعر البالغ *</Label>
                <Input
                  type="number"
                  value={formData.price_adult}
                  onChange={(e) => setFormData({ ...formData, price_adult: parseFloat(e.target.value) || 0 })}
                />
              </div>

              <div className="space-y-2">
                <Label>سعر الطفل</Label>
                <Input
                  type="number"
                  value={formData.price_child}
                  onChange={(e) => setFormData({ ...formData, price_child: parseFloat(e.target.value) || 0 })}
                />
              </div>

              {/* Available Seats */}
              <div className="space-y-2">
                <Label>المقاعد المتاحة</Label>
                <Input
                  type="number"
                  value={formData.available_seats}
                  onChange={(e) => setFormData({ ...formData, available_seats: parseInt(e.target.value) || 0 })}
                />
              </div>

              {/* Baggage */}
              <div className="space-y-2">
                <Label>الأمتعة المسموحة</Label>
                <Input
                  value={formData.baggage_allowance}
                  onChange={(e) => setFormData({ ...formData, baggage_allowance: e.target.value })}
                  placeholder="23 kg"
                />
              </div>

              {/* Switches */}
              <div className="col-span-2 flex flex-wrap gap-6 pt-4 border-t">
                <div className="flex items-center gap-2">
                  <Switch
                    id="direct"
                    checked={formData.is_direct}
                    onCheckedChange={(v) => setFormData({ ...formData, is_direct: v })}
                  />
                  <Label htmlFor="direct">رحلة مباشرة</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    id="meal"
                    checked={formData.meal_included}
                    onCheckedChange={(v) => setFormData({ ...formData, meal_included: v })}
                  />
                  <Label htmlFor="meal">وجبة مشمولة</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    id="featured"
                    checked={formData.is_featured}
                    onCheckedChange={(v) => setFormData({ ...formData, is_featured: v })}
                  />
                  <Label htmlFor="featured">عرض مميز</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    id="active"
                    checked={formData.is_active}
                    onCheckedChange={(v) => setFormData({ ...formData, is_active: v })}
                  />
                  <Label htmlFor="active">نشط</Label>
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>إلغاء</Button>
              <Button onClick={handleSave} disabled={saving}>
                {saving ? <Loader2 className="w-4 h-4 animate-spin ml-2" /> : null}
                {editingFlight ? "تحديث" : "إضافة"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{flights.filter(f => f.is_active).length}</div>
            <p className="text-sm text-muted-foreground">العروض النشطة</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{flights.filter(f => f.is_featured).length}</div>
            <p className="text-sm text-muted-foreground">العروض المميزة</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{airports.length}</div>
            <p className="text-sm text-muted-foreground">المطارات</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{airlines.length}</div>
            <p className="text-sm text-muted-foreground">شركات الطيران</p>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="بحث عن رحلة..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pr-10"
        />
      </div>

      {/* Table */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>المسار</TableHead>
              <TableHead>التاريخ</TableHead>
              <TableHead>الشركة</TableHead>
              <TableHead>السعر</TableHead>
              <TableHead>الحالة</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredFlights.map((flight) => (
              <TableRow key={flight.id}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{flight.origin_airport?.iata_code}</Badge>
                    <span>→</span>
                    <Badge variant="outline">{flight.destination_airport?.iata_code}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {flight.origin_airport?.city_ar} - {flight.destination_airport?.city_ar}
                  </p>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    {flight.departure_date}
                  </div>
                </TableCell>
                <TableCell>{flight.airline?.name_ar || "-"}</TableCell>
                <TableCell>
                  <span className="font-bold text-primary">{formatPrice(flight.price_adult)}</span>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {flight.is_featured && <Badge className="bg-yellow-500">مميز</Badge>}
                    {flight.is_active ? (
                      <Badge className="bg-green-500">نشط</Badge>
                    ) : (
                      <Badge variant="secondary">غير نشط</Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" onClick={() => handleEdit(flight)} title="تعديل">
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleDelete(flight.id)} title="حذف">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {filteredFlights.length === 0 && (
          <div className="text-center py-12">
            <Plane className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">لا توجد عروض رحلات</p>
          </div>
        )}
      </Card>
    </div>
  );
};

export default AdminFlights;
