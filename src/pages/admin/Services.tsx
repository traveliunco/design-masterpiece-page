import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Search, Briefcase, Plus, Edit, Trash2, Loader2, RefreshCw,
  Eye, EyeOff, ArrowUpDown, GripVertical
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { servicesService } from "@/services/adminDataService";

export interface Service {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  path: string;
  features: string[];
  emoji: string;
  is_active: boolean;
  order: number;
  created_at: string;
  updated_at: string;
}

// البيانات الافتراضية
const defaultServices: Service[] = [
  { id: "1", title: "البرامج السياحية", description: "برامج سياحية متكاملة مصممة خصيصاً لتناسب احتياجاتك", icon: "MapPin", color: "from-emerald-500 to-teal-600", path: "/programs", features: ["برامج مخصصة", "مرشد سياحي", "نقل مريح", "أماكن مميزة"], emoji: "🗺️", is_active: true, order: 1, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: "2", title: "رحلات شهر العسل", description: "باقات رومانسية مميزة تجعل شهر عسلك تجربة لا تُنسى", icon: "Heart", color: "from-rose-500 to-pink-600", path: "/honeymoon", features: ["تزيين الغرفة", "عشاء رومانسي", "جلسة تصوير", "سبا للزوجين"], emoji: "💑", is_active: true, order: 2, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: "3", title: "العروض الخاصة", description: "عروض وخصومات حصرية على باقات سفر مختارة بعناية", icon: "Tag", color: "from-amber-500 to-orange-600", path: "/offers", features: ["خصم حتى 25%", "عروض محدودة", "باقات شاملة", "دفع مرن"], emoji: "🏷️", is_active: true, order: 3, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: "4", title: "تأجير السيارات", description: "استأجر سيارتك المفضلة واستمتع بحرية التنقل في وجهتك", icon: "Car", color: "from-orange-500 to-red-600", path: "/car-rental", features: ["أحدث الموديلات", "أسعار شاملة", "تأمين كامل", "توصيل مجاني"], emoji: "🚗", is_active: false, order: 4, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: "5", title: "خدمات التأشيرات", description: "نساعدك في إنهاء إجراءات التأشيرة بسرعة وسهولة", icon: "FileText", color: "from-indigo-500 to-purple-600", path: "/visas", features: ["معالجة سريعة", "استشارات مجانية", "متابعة دقيقة", "خدمة VIP"], emoji: "📋", is_active: false, order: 5, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: "6", title: "تأمين السفر", description: "سافر بأمان مع تغطية تأمينية شاملة لجميع حالات الطوارئ", icon: "Shield", color: "from-teal-500 to-cyan-600", path: "/insurance", features: ["تغطية طبية", "فقدان الأمتعة", "إلغاء الرحلة", "إصدار فوري"], emoji: "🛡️", is_active: false, order: 6, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
];

const STORAGE_KEY = "traveliun_services";

export const getServices = (): Service[] => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultServices));
    return defaultServices;
  }
  return JSON.parse(stored);
};

export const saveServices = (services: Service[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(services));
};

const AdminServices = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    setLoading(true);
    try {
      const data = await servicesService.getServices();
      const mapped = (data as any[]).map((s, i) => ({ ...s, order: s.display_order || s.order || i + 1 }));
      setServices(mapped.length > 0 ? mapped.sort((a: any, b: any) => a.order - b.order) : getServices().sort((a, b) => a.order - b.order));
    } catch {
      setServices(getServices().sort((a, b) => a.order - b.order));
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (id: string) => {
    if (!confirm("هل أنت متأكد من حذف هذه الخدمة؟")) return;
    const updated = services.filter(s => s.id !== id);
    saveServices(updated);
    setServices(updated);
    servicesService.deleteService(id).catch(() => {});
    toast.success("تم حذف الخدمة بنجاح");
  };

  const toggleStatus = (id: string) => {
    const svc = services.find(s => s.id === id);
    const updated = services.map(s =>
      s.id === id ? { ...s, is_active: !s.is_active, updated_at: new Date().toISOString() } : s
    );
    saveServices(updated);
    setServices(updated);
    if (svc) servicesService.upsertService({ ...svc, is_active: !svc.is_active }).catch(() => {});
    toast.success("تم تحديث الحالة");
  };

  const moveService = (id: string, direction: "up" | "down") => {
    const idx = services.findIndex(s => s.id === id);
    if ((direction === "up" && idx === 0) || (direction === "down" && idx === services.length - 1)) return;
    const newIdx = direction === "up" ? idx - 1 : idx + 1;
    const reordered = [...services];
    [reordered[idx], reordered[newIdx]] = [reordered[newIdx], reordered[idx]];
    reordered.forEach((s, i) => s.order = i + 1);
    saveServices(reordered);
    setServices(reordered);
  };

  const filteredServices = services.filter(s => {
    const matchesSearch = s.title.includes(searchTerm) || s.description.includes(searchTerm);
    const matchesStatus = statusFilter === "all" || (statusFilter === "active" ? s.is_active : !s.is_active);
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh]">
        <Loader2 className="w-10 h-10 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground">جاري تحميل الخدمات...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Briefcase className="w-7 h-7 text-primary" />
            إدارة الخدمات
          </h1>
          <p className="text-muted-foreground">
            إضافة وتعديل وحذف الخدمات المعروضة ({services.length} خدمة)
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={loadServices} aria-label="تحديث">
            <RefreshCw className="w-4 h-4 ml-2" />
            تحديث
          </Button>
          <Button onClick={() => navigate("/admin/services/new")}>
            <Plus className="w-4 h-4 ml-2" />
            إضافة خدمة جديدة
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-3xl font-bold text-primary">{services.length}</p>
            <p className="text-sm text-muted-foreground">إجمالي الخدمات</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-3xl font-bold text-green-600">
              {services.filter(s => s.is_active).length}
            </p>
            <p className="text-sm text-muted-foreground">نشطة</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-3xl font-bold text-gray-500">
              {services.filter(s => !s.is_active).length}
            </p>
            <p className="text-sm text-muted-foreground">مخفية</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-3xl font-bold text-blue-600">
              {services.reduce((sum, s) => sum + s.features.length, 0)}
            </p>
            <p className="text-sm text-muted-foreground">إجمالي المميزات</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="بحث بالاسم أو الوصف..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pr-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-40">
                <SelectValue placeholder="الحالة" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع الحالات</SelectItem>
                <SelectItem value="active">نشطة</SelectItem>
                <SelectItem value="hidden">مخفية</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Services Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr>
                  <th className="text-right py-4 px-4 text-sm font-medium text-muted-foreground w-10">ترتيب</th>
                  <th className="text-right py-4 px-4 text-sm font-medium text-muted-foreground">الخدمة</th>
                  <th className="text-right py-4 px-4 text-sm font-medium text-muted-foreground">الوصف</th>
                  <th className="text-right py-4 px-4 text-sm font-medium text-muted-foreground">الرابط</th>
                  <th className="text-right py-4 px-4 text-sm font-medium text-muted-foreground">المميزات</th>
                  <th className="text-right py-4 px-4 text-sm font-medium text-muted-foreground">الحالة</th>
                  <th className="text-right py-4 px-4 text-sm font-medium text-muted-foreground">تفعيل</th>
                  <th className="text-right py-4 px-4 text-sm font-medium text-muted-foreground">إجراءات</th>
                </tr>
              </thead>
              <tbody>
                {filteredServices.map((service, idx) => (
                  <tr key={service.id} className="border-b last:border-0 hover:bg-muted/30">
                    <td className="py-4 px-4">
                      <div className="flex flex-col gap-1">
                        <button
                          onClick={() => moveService(service.id, "up")}
                          disabled={idx === 0}
                          className="text-muted-foreground hover:text-primary disabled:opacity-30 transition-colors"
                          aria-label="تحريك لأعلى"
                        >
                          <ArrowUpDown className="w-4 h-4" />
                        </button>
                        <span className="text-xs text-center text-muted-foreground">{service.order}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${service.color} flex items-center justify-center text-white text-lg`}>
                          {service.emoji}
                        </div>
                        <p className="font-bold">{service.title}</p>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <p className="text-sm text-muted-foreground max-w-[200px] truncate">{service.description}</p>
                    </td>
                    <td className="py-4 px-4">
                      <code className="bg-muted px-2 py-1 rounded text-xs font-mono">{service.path}</code>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex flex-wrap gap-1">
                        {service.features.slice(0, 2).map((f, i) => (
                          <span key={i} className="bg-primary/10 text-primary px-2 py-0.5 rounded-full text-xs">{f}</span>
                        ))}
                        {service.features.length > 2 && (
                          <span className="bg-muted px-2 py-0.5 rounded-full text-xs text-muted-foreground">+{service.features.length - 2}</span>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 w-fit ${
                        service.is_active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"
                      }`}>
                        {service.is_active ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                        {service.is_active ? "نشطة" : "مخفية"}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <Switch
                        checked={service.is_active}
                        onCheckedChange={() => toggleStatus(service.id)}
                      />
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon" onClick={() => navigate(`/admin/services/edit/${service.id}`)} aria-label="تعديل">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="text-red-600" onClick={() => handleDelete(service.id)} aria-label="حذف">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredServices.length === 0 && (
            <div className="text-center py-16">
              <Briefcase className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-20" />
              <h3 className="text-xl font-bold mb-2">لا توجد خدمات</h3>
              <p className="text-muted-foreground">أضف خدمة جديدة للبدء</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminServices;
