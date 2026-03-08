import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import {
  Package, Plus, Edit, Trash2, Loader2, Search, Eye, EyeOff,
  Plane, Hotel, Car, Shield, Star, Save, X, ArrowLeft
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';

interface PackageRow {
  id: string;
  title_ar: string;
  description_ar: string;
  cover_image: string;
  destination_name_ar: string;
  country_ar: string;
  duration_nights: number;
  base_price_per_person: number;
  includes_flight: boolean;
  includes_hotel: boolean;
  includes_car: boolean;
  includes_insurance: boolean;
  includes_visa: boolean;
  hotel_name_ar: string;
  room_type_ar: string;
  flight_description_ar: string;
  car_description_ar: string;
  highlights: string[];
  badge: string;
  is_featured: boolean;
  is_active: boolean;
  display_order: number;
  destination_id: string | null;
  flight_offer_id: string | null;
  car_rental_id: string | null;
  default_room_id: string | null;
  default_hotel_id: string | null;
}

const emptyPkg: Omit<PackageRow, 'id'> = {
  title_ar: '',
  description_ar: '',
  cover_image: '',
  destination_name_ar: '',
  country_ar: '',
  duration_nights: 5,
  base_price_per_person: 0,
  includes_flight: true,
  includes_hotel: true,
  includes_car: false,
  includes_insurance: false,
  includes_visa: false,
  hotel_name_ar: '',
  room_type_ar: '',
  flight_description_ar: '',
  car_description_ar: '',
  highlights: [],
  badge: '',
  is_featured: false,
  is_active: true,
  display_order: 0,
  destination_id: null,
  flight_offer_id: null,
  car_rental_id: null,
  default_room_id: null,
  default_hotel_id: null,
};

const ReadyPackagesAdmin = () => {
  const [packages, setPackages] = useState<PackageRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [editing, setEditing] = useState<PackageRow | null>(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState<Omit<PackageRow, 'id'>>(emptyPkg);
  const [saving, setSaving] = useState(false);
  const [highlightInput, setHighlightInput] = useState('');

  // Linked data options
  const [hotels, setHotels] = useState<any[]>([]);
  const [rooms, setRooms] = useState<any[]>([]);
  const [flights, setFlights] = useState<any[]>([]);
  const [cars, setCars] = useState<any[]>([]);
  const [destinations, setDestinations] = useState<any[]>([]);

  useEffect(() => {
    loadPackages();
    loadLinkedData();
  }, []);

  const loadPackages = async () => {
    setLoading(true);
    const { data, error } = await (supabase as any)
      .from('ready_packages')
      .select('*')
      .order('display_order');
    if (!error) {
      setPackages((data || []).map((p: any) => ({
        ...p,
        highlights: Array.isArray(p.highlights) ? p.highlights : JSON.parse(p.highlights || '[]'),
      })));
    }
    setLoading(false);
  };

  const loadLinkedData = async () => {
    const [h, f, c, d] = await Promise.all([
      supabase.from('hotels').select('id, name_ar, city_ar, star_rating').eq('is_active', true).order('name_ar'),
      supabase.from('flight_offers').select('id, flight_number, price_adult, airline:airlines(name_ar), origin:airports!flight_offers_origin_airport_id_fkey(city_ar), destination:airports!flight_offers_destination_airport_id_fkey(city_ar)').eq('is_active', true).order('price_adult'),
      supabase.from('car_rentals').select('id, name_ar, price_per_day, category').eq('is_active', true).order('name_ar'),
      supabase.from('destinations').select('id, name_ar, country_ar').eq('is_active', true).order('name_ar'),
    ]);
    setHotels(h.data || []);
    setFlights(f.data || []);
    setCars(c.data || []);
    setDestinations(d.data || []);
  };

  const loadRoomsForHotel = async (hotelId: string) => {
    const { data } = await supabase
      .from('hotel_rooms')
      .select('id, name_ar, price_per_night, bed_type')
      .eq('hotel_id', hotelId)
      .eq('is_active', true)
      .order('price_per_night');
    setRooms(data || []);
  };

  const openCreate = () => {
    setEditing(null);
    setForm({ ...emptyPkg });
    setCreating(true);
    setRooms([]);
  };

  const openEdit = (pkg: PackageRow) => {
    setCreating(false);
    setEditing(pkg);
    setForm({ ...pkg });
    if (pkg.default_hotel_id) loadRoomsForHotel(pkg.default_hotel_id);
    else setRooms([]);
  };

  const closeForm = () => {
    setEditing(null);
    setCreating(false);
  };

  const updateField = (key: string, value: any) => {
    setForm(prev => ({ ...prev, [key]: value }));
    if (key === 'default_hotel_id' && value) {
      loadRoomsForHotel(value);
      setForm(prev => ({ ...prev, default_room_id: null }));
    }
  };

  const addHighlight = () => {
    if (!highlightInput.trim()) return;
    setForm(prev => ({ ...prev, highlights: [...prev.highlights, highlightInput.trim()] }));
    setHighlightInput('');
  };

  const removeHighlight = (i: number) => {
    setForm(prev => ({ ...prev, highlights: prev.highlights.filter((_, idx) => idx !== i) }));
  };

  const handleSave = async () => {
    if (!form.title_ar) { toast.error('يرجى إدخال عنوان البكج'); return; }
    setSaving(true);
    try {
      const payload = {
        ...form,
        highlights: form.highlights,
        destination_id: form.destination_id || null,
        flight_offer_id: form.flight_offer_id || null,
        car_rental_id: form.car_rental_id || null,
        default_room_id: form.default_room_id || null,
        default_hotel_id: form.default_hotel_id || null,
      };

      if (editing) {
        const { error } = await (supabase as any).from('ready_packages').update(payload).eq('id', editing.id);
        if (error) throw error;
        toast.success('تم تحديث البكج بنجاح');
      } else {
        const { error } = await (supabase as any).from('ready_packages').insert(payload);
        if (error) throw error;
        toast.success('تم إنشاء البكج بنجاح');
      }
      closeForm();
      loadPackages();
    } catch (e: any) {
      toast.error(e.message || 'حدث خطأ');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا البكج؟')) return;
    const { error } = await (supabase as any).from('ready_packages').delete().eq('id', id);
    if (error) toast.error('حدث خطأ في الحذف');
    else { toast.success('تم الحذف'); loadPackages(); }
  };

  const toggleActive = async (id: string, current: boolean) => {
    await (supabase as any).from('ready_packages').update({ is_active: !current }).eq('id', id);
    loadPackages();
  };

  const filtered = packages.filter(p =>
    p.title_ar.includes(search) || p.destination_name_ar.includes(search)
  );

  // ========== FORM VIEW ==========
  if (editing || creating) {
    return (
      <div className="space-y-6" dir="rtl">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={closeForm}><ArrowLeft className="w-5 h-5" /></Button>
          <h1 className="text-2xl font-black text-foreground">{editing ? 'تعديل البكج' : 'إنشاء بكج جديد'}</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Basic info */}
          <Card>
            <CardContent className="p-5 space-y-4">
              <h3 className="font-bold text-foreground flex items-center gap-2"><Package className="w-4 h-4 text-primary" /> المعلومات الأساسية</h3>

              <div>
                <Label>عنوان البكج *</Label>
                <Input value={form.title_ar} onChange={e => updateField('title_ar', e.target.value)} placeholder="بكج إسطنبول الساحر" className="mt-1" />
              </div>
              <div>
                <Label>الوصف</Label>
                <Textarea value={form.description_ar} onChange={e => updateField('description_ar', e.target.value)} rows={3} className="mt-1" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>اسم الوجهة</Label>
                  <Input value={form.destination_name_ar} onChange={e => updateField('destination_name_ar', e.target.value)} className="mt-1" />
                </div>
                <div>
                  <Label>الدولة</Label>
                  <Input value={form.country_ar} onChange={e => updateField('country_ar', e.target.value)} className="mt-1" />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <Label>عدد الليالي</Label>
                  <Input type="number" value={form.duration_nights} onChange={e => updateField('duration_nights', +e.target.value)} className="mt-1" />
                </div>
                <div>
                  <Label>السعر الأساسي/فرد</Label>
                  <Input type="number" value={form.base_price_per_person} onChange={e => updateField('base_price_per_person', +e.target.value)} className="mt-1" />
                </div>
                <div>
                  <Label>ترتيب العرض</Label>
                  <Input type="number" value={form.display_order} onChange={e => updateField('display_order', +e.target.value)} className="mt-1" />
                </div>
              </div>
              <div>
                <Label>صورة الغلاف (URL)</Label>
                <Input value={form.cover_image} onChange={e => updateField('cover_image', e.target.value)} className="mt-1" dir="ltr" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>الشارة (Badge)</Label>
                  <Input value={form.badge} onChange={e => updateField('badge', e.target.value)} placeholder="الأكثر مبيعاً" className="mt-1" />
                </div>
                <div className="flex items-center gap-3 pt-6">
                  <Switch checked={form.is_featured} onCheckedChange={v => updateField('is_featured', v)} />
                  <Label>مميز</Label>
                  <Switch checked={form.is_active} onCheckedChange={v => updateField('is_active', v)} />
                  <Label>نشط</Label>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Includes & descriptions */}
          <Card>
            <CardContent className="p-5 space-y-4">
              <h3 className="font-bold text-foreground">يشمل البكج</h3>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { key: 'includes_flight', label: 'طيران', icon: Plane },
                  { key: 'includes_hotel', label: 'فندق', icon: Hotel },
                  { key: 'includes_car', label: 'سيارة', icon: Car },
                  { key: 'includes_insurance', label: 'تأمين', icon: Shield },
                ].map(({ key, label, icon: Icon }) => (
                  <div key={key} className="flex items-center gap-2 p-2 rounded-lg bg-muted/50">
                    <Switch checked={(form as any)[key]} onCheckedChange={v => updateField(key, v)} />
                    <Icon className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">{label}</span>
                  </div>
                ))}
              </div>

              <div>
                <Label>وصف الطيران</Label>
                <Input value={form.flight_description_ar} onChange={e => updateField('flight_description_ar', e.target.value)} className="mt-1" />
              </div>
              <div>
                <Label>اسم الفندق</Label>
                <Input value={form.hotel_name_ar} onChange={e => updateField('hotel_name_ar', e.target.value)} className="mt-1" />
              </div>
              <div>
                <Label>نوع الغرفة</Label>
                <Input value={form.room_type_ar} onChange={e => updateField('room_type_ar', e.target.value)} className="mt-1" />
              </div>
              <div>
                <Label>وصف السيارة</Label>
                <Input value={form.car_description_ar} onChange={e => updateField('car_description_ar', e.target.value)} className="mt-1" />
              </div>

              {/* Highlights */}
              <div>
                <Label>أبرز النشاطات</Label>
                <div className="flex gap-2 mt-1">
                  <Input value={highlightInput} onChange={e => setHighlightInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addHighlight())} placeholder="أضف نشاط..." />
                  <Button type="button" size="sm" onClick={addHighlight}><Plus className="w-4 h-4" /></Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {form.highlights.map((h, i) => (
                    <span key={i} className="bg-primary/10 text-primary text-xs px-2 py-1 rounded-lg flex items-center gap-1">
                      {h}
                      <button onClick={() => removeHighlight(i)}><X className="w-3 h-3" /></button>
                    </span>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Linked data */}
          <Card className="lg:col-span-2">
            <CardContent className="p-5 space-y-4">
              <h3 className="font-bold text-foreground flex items-center gap-2">
                <Star className="w-4 h-4 text-secondary" />
                ربط البكج بالبيانات الفعلية
              </h3>
              <p className="text-xs text-muted-foreground">اختر الفندق والرحلة والسيارة الافتراضية - يمكن للعميل تغييرها عند الحجز</p>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Destination */}
                <div>
                  <Label>الوجهة (Supabase)</Label>
                  <Select value={form.destination_id || 'none'} onValueChange={v => updateField('destination_id', v === 'none' ? null : v)}>
                    <SelectTrigger className="mt-1"><SelectValue placeholder="اختر..." /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">-- بدون --</SelectItem>
                      {destinations.map(d => (
                        <SelectItem key={d.id} value={d.id}>{d.name_ar} - {d.country_ar}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Hotel */}
                <div>
                  <Label>الفندق الافتراضي</Label>
                  <Select value={form.default_hotel_id || 'none'} onValueChange={v => updateField('default_hotel_id', v === 'none' ? null : v)}>
                    <SelectTrigger className="mt-1"><SelectValue placeholder="اختر..." /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">-- بدون --</SelectItem>
                      {hotels.map(h => (
                        <SelectItem key={h.id} value={h.id}>{h.name_ar} ({h.city_ar}) {'⭐'.repeat(h.star_rating || 0)}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Room */}
                <div>
                  <Label>الغرفة الافتراضية</Label>
                  <Select value={form.default_room_id || 'none'} onValueChange={v => updateField('default_room_id', v === 'none' ? null : v)} disabled={!form.default_hotel_id}>
                    <SelectTrigger className="mt-1"><SelectValue placeholder={form.default_hotel_id ? 'اختر...' : 'اختر فندق أولاً'} /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">-- بدون --</SelectItem>
                      {rooms.map(r => (
                        <SelectItem key={r.id} value={r.id}>{r.name_ar} - {r.price_per_night?.toLocaleString()} ر.س/ليلة</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Flight */}
                <div>
                  <Label>رحلة الطيران الافتراضية</Label>
                  <Select value={form.flight_offer_id || 'none'} onValueChange={v => updateField('flight_offer_id', v === 'none' ? null : v)}>
                    <SelectTrigger className="mt-1"><SelectValue placeholder="اختر..." /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">-- بدون --</SelectItem>
                      {flights.map(f => (
                        <SelectItem key={f.id} value={f.id}>
                          {(f.airline as any)?.name_ar || f.flight_number || 'رحلة'} · {(f.origin as any)?.city_ar}→{(f.destination as any)?.city_ar} · {f.price_adult?.toLocaleString()} ر.س
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Car */}
                <div>
                  <Label>السيارة الافتراضية</Label>
                  <Select value={form.car_rental_id || 'none'} onValueChange={v => updateField('car_rental_id', v === 'none' ? null : v)}>
                    <SelectTrigger className="mt-1"><SelectValue placeholder="اختر..." /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">-- بدون --</SelectItem>
                      {cars.map(c => (
                        <SelectItem key={c.id} value={c.id}>{c.name_ar} ({c.category}) - {c.price_per_day?.toLocaleString()} ر.س/يوم</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex gap-3">
          <Button onClick={handleSave} disabled={saving} className="px-8">
            {saving ? <Loader2 className="w-4 h-4 animate-spin ml-2" /> : <Save className="w-4 h-4 ml-2" />}
            {editing ? 'حفظ التعديلات' : 'إنشاء البكج'}
          </Button>
          <Button variant="outline" onClick={closeForm}>إلغاء</Button>
        </div>
      </div>
    );
  }

  // ========== LIST VIEW ==========
  return (
    <div className="space-y-6" dir="rtl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-foreground flex items-center gap-2">
            <Package className="w-6 h-6 text-primary" />
            إدارة البكجات الجاهزة
          </h1>
          <p className="text-sm text-muted-foreground mt-1">{packages.length} بكج</p>
        </div>
        <Button onClick={openCreate} className="gap-2">
          <Plus className="w-4 h-4" />
          إنشاء بكج
        </Button>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="بحث..." className="pr-10" />
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">لا توجد بكجات</div>
      ) : (
        <div className="grid gap-4">
          {filtered.map(pkg => (
            <Card key={pkg.id} className="overflow-hidden">
              <CardContent className="p-0">
                <div className="flex flex-col sm:flex-row">
                  {pkg.cover_image && (
                    <img src={pkg.cover_image} alt="" className="w-full sm:w-40 h-32 object-cover shrink-0" />
                  )}
                  <div className="flex-1 p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-foreground">{pkg.title_ar}</h3>
                          {pkg.badge && <span className="text-[10px] bg-secondary/15 text-secondary px-2 py-0.5 rounded">{pkg.badge}</span>}
                          {!pkg.is_active && <span className="text-[10px] bg-destructive/15 text-destructive px-2 py-0.5 rounded">معطل</span>}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">{pkg.destination_name_ar} · {pkg.country_ar} · {pkg.duration_nights} ليالي</p>
                      </div>
                      <p className="text-lg font-black text-primary">{pkg.base_price_per_person.toLocaleString()} <span className="text-xs font-normal">ر.س</span></p>
                    </div>

                    <div className="flex items-center gap-2 mt-2 flex-wrap">
                      {pkg.includes_flight && <span className="text-[10px] bg-blue-500/10 text-blue-600 px-2 py-0.5 rounded">✈ طيران</span>}
                      {pkg.includes_hotel && <span className="text-[10px] bg-amber-500/10 text-amber-600 px-2 py-0.5 rounded">🏨 فندق</span>}
                      {pkg.includes_car && <span className="text-[10px] bg-emerald-500/10 text-emerald-600 px-2 py-0.5 rounded">🚗 سيارة</span>}
                      {pkg.includes_insurance && <span className="text-[10px] bg-purple-500/10 text-purple-600 px-2 py-0.5 rounded">🛡 تأمين</span>}
                      {pkg.default_hotel_id && <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded">مربوط بفندق</span>}
                      {pkg.flight_offer_id && <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded">مربوط برحلة</span>}
                    </div>

                    <div className="flex items-center gap-2 mt-3">
                      <Button size="sm" variant="outline" onClick={() => openEdit(pkg)} className="gap-1">
                        <Edit className="w-3 h-3" /> تعديل
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => toggleActive(pkg.id, pkg.is_active)}>
                        {pkg.is_active ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                      </Button>
                      <Button size="sm" variant="ghost" className="text-destructive" onClick={() => handleDelete(pkg.id)}>
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReadyPackagesAdmin;
