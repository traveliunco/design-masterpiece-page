import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Package, Eye, Search, Filter, RefreshCw, TrendingUp, FileText, Send, CheckCircle2, Plane, Hotel, Car } from "lucide-react";

const statusMap: Record<string, { label: string; color: string; bg: string }> = {
  draft: { label: "مسودة", color: "text-[hsl(220,9%,46%)]", bg: "bg-[hsl(220,14%,96%)] border border-[hsl(220,13%,91%)]" },
  pending: { label: "قيد الانتظار", color: "text-[hsl(217,91%,60%)]", bg: "bg-[hsl(217,91%,60%)]/10 border border-[hsl(217,91%,60%)]/20" },
  submitted: { label: "مرسل", color: "text-[hsl(217,91%,60%)]", bg: "bg-[hsl(217,91%,60%)]/10 border border-[hsl(217,91%,60%)]/20" },
  confirmed: { label: "مؤكد", color: "text-[hsl(222,47%,11%)]", bg: "bg-[hsl(222,47%,11%)]/10 border border-[hsl(222,47%,11%)]/20" },
  cancelled: { label: "ملغي", color: "text-destructive", bg: "bg-destructive/10 border border-destructive/20" },
};

const DynamicPackagesAdmin = () => {
  const queryClient = useQueryClient();
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [search, setSearch] = useState("");
  const [selectedPkg, setSelectedPkg] = useState<any>(null);

  const { data: packages = [], isLoading } = useQuery({
    queryKey: ["admin-dynamic-packages", filterStatus],
    queryFn: async () => {
      let query = supabase
        .from("dynamic_packages")
        .select("*, hotel:hotels(name_ar), flight:flight_offers(flight_number, airline:airlines(name_ar)), car:car_rentals(name_ar)")
        .order("created_at", { ascending: false });
      if (filterStatus !== "all") query = query.eq("status", filterStatus);
      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    },
  });

  const updateStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await supabase.from("dynamic_packages").update({ status }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-dynamic-packages"] });
      toast.success("تم تحديث الحالة");
    },
  });

  const filtered = packages.filter((p: any) => {
    if (!search) return true;
    return (
      p.customer_name?.includes(search) ||
      p.customer_email?.includes(search) ||
      p.destination?.includes(search) ||
      p.city_name?.includes(search)
    );
  });

  const stats = {
    total: packages.length,
    draft: packages.filter((p: any) => p.status === "draft").length,
    submitted: packages.filter((p: any) => p.status === "submitted").length,
    confirmed: packages.filter((p: any) => p.status === "confirmed").length,
  };

  return (
    <div className="space-y-6" dir="rtl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">البكجات الديناميكية</h1>
          <p className="text-muted-foreground text-sm">إدارة الرحلات المخصصة من مصمم الرحلات</p>
        </div>
        <Button
          variant="outline"
          onClick={() => queryClient.invalidateQueries({ queryKey: ["admin-dynamic-packages"] })}
          className="border-[hsl(217,91%,60%)]/30 text-[hsl(217,91%,60%)] hover:bg-[hsl(217,91%,60%)]/10"
        >
          <RefreshCw className="w-4 h-4 ml-2" /> تحديث
        </Button>
      </div>

      {/* Stats Cards - White/Black/Blue theme */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "الإجمالي", value: stats.total, icon: TrendingUp, accent: "border-t-[3px] border-t-[hsl(217,91%,60%)]", iconColor: "text-[hsl(217,91%,60%)]", valueBg: "bg-[hsl(217,91%,60%)]/10" },
          { label: "مسودات", value: stats.draft, icon: FileText, accent: "border-t-[3px] border-t-[hsl(220,9%,46%)]", iconColor: "text-muted-foreground", valueBg: "bg-muted" },
          { label: "مرسلة", value: stats.submitted, icon: Send, accent: "border-t-[3px] border-t-[hsl(222,47%,11%)]", iconColor: "text-foreground", valueBg: "bg-foreground/5" },
          { label: "مؤكدة", value: stats.confirmed, icon: CheckCircle2, accent: "border-t-[3px] border-t-[hsl(217,91%,50%)]", iconColor: "text-[hsl(217,91%,50%)]", valueBg: "bg-[hsl(217,91%,50%)]/10" },
        ].map((s) => (
          <Card key={s.label} className={`bg-card overflow-hidden ${s.accent} shadow-sm hover:shadow-md transition-shadow`}>
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-3">
                <div className={`w-10 h-10 rounded-lg ${s.valueBg} flex items-center justify-center`}>
                  <s.icon className={`w-5 h-5 ${s.iconColor}`} />
                </div>
                <p className="text-3xl font-black text-foreground">{s.value}</p>
              </div>
              <p className="text-sm text-muted-foreground font-medium">{s.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <div className="flex gap-4 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="بحث بالاسم أو الوجهة..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pr-10 border-border focus:border-[hsl(217,91%,60%)] focus:ring-[hsl(217,91%,60%)]/20"
          />
        </div>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-[160px] border-border">
            <Filter className="w-4 h-4 ml-2 text-muted-foreground" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">الكل</SelectItem>
            <SelectItem value="draft">مسودة</SelectItem>
            <SelectItem value="submitted">مرسل</SelectItem>
            <SelectItem value="confirmed">مؤكد</SelectItem>
            <SelectItem value="cancelled">ملغي</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <Card className="bg-card border-border shadow-sm overflow-hidden">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-foreground/[0.03] border-b border-border">
                <TableHead className="text-foreground font-bold">العميل</TableHead>
                <TableHead className="text-foreground font-bold">الوجهة</TableHead>
                <TableHead className="text-foreground font-bold">المدينة</TableHead>
                <TableHead className="text-foreground font-bold">التاريخ</TableHead>
                <TableHead className="text-foreground font-bold">السعر</TableHead>
                <TableHead className="text-foreground font-bold">الحالة</TableHead>
                <TableHead className="text-foreground font-bold">إجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-12">
                    <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-[hsl(217,91%,60%)]" />
                    <p className="text-muted-foreground">جاري التحميل...</p>
                  </TableCell>
                </TableRow>
              ) : filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-12">
                    <Package className="w-10 h-10 mx-auto mb-3 text-muted-foreground/40" />
                    <p className="text-muted-foreground font-medium">لا توجد بكجات</p>
                    <p className="text-xs text-muted-foreground/60 mt-1">ستظهر هنا عند إنشاء بكجات من مصمم الرحلات</p>
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((pkg: any) => (
                  <TableRow key={pkg.id} className="hover:bg-[hsl(217,91%,60%)]/[0.02] transition-colors border-b border-border/50">
                    <TableCell>
                      <div>
                        <p className="font-semibold text-foreground">{pkg.customer_name || "غير محدد"}</p>
                        <p className="text-xs text-muted-foreground">{pkg.customer_email}</p>
                      </div>
                    </TableCell>
                    <TableCell className="text-foreground">{pkg.destination || "-"}</TableCell>
                    <TableCell className="text-foreground">{pkg.city_name || "-"}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{pkg.check_in_date || "-"}</TableCell>
                    <TableCell className="font-bold text-[hsl(217,91%,60%)]">{pkg.total_price?.toLocaleString()} ر.س</TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${statusMap[pkg.status]?.bg || ""} ${statusMap[pkg.status]?.color || ""}`}>
                        {statusMap[pkg.status]?.label || pkg.status}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2 items-center">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setSelectedPkg(pkg)}
                          className="text-[hsl(217,91%,60%)] hover:bg-[hsl(217,91%,60%)]/10"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Select value={pkg.status} onValueChange={(v) => updateStatus.mutate({ id: pkg.id, status: v })}>
                          <SelectTrigger className="w-[100px] h-8 text-xs border-border">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="draft">مسودة</SelectItem>
                            <SelectItem value="submitted">مرسل</SelectItem>
                            <SelectItem value="confirmed">مؤكد</SelectItem>
                            <SelectItem value="cancelled">ملغي</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Detail Dialog */}
      <Dialog open={!!selectedPkg} onOpenChange={() => setSelectedPkg(null)}>
        <DialogContent className="max-w-lg bg-card" dir="rtl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-foreground">
              <div className="w-8 h-8 rounded-lg bg-[hsl(217,91%,60%)]/10 flex items-center justify-center">
                <Package className="w-4 h-4 text-[hsl(217,91%,60%)]" />
              </div>
              تفاصيل البكج
            </DialogTitle>
          </DialogHeader>
          {selectedPkg && (
            <div className="space-y-4 text-sm">
              {/* Customer Info */}
              <div className="bg-foreground/[0.02] rounded-xl p-4 border border-border/50">
                <p className="text-xs font-bold text-muted-foreground mb-3 uppercase tracking-wider">معلومات العميل</p>
                <div className="grid grid-cols-2 gap-3">
                  <div><span className="text-muted-foreground text-xs">العميل:</span><br /><strong className="text-foreground">{selectedPkg.customer_name || "-"}</strong></div>
                  <div><span className="text-muted-foreground text-xs">الهاتف:</span><br /><strong className="text-foreground">{selectedPkg.customer_phone || "-"}</strong></div>
                  <div className="col-span-2"><span className="text-muted-foreground text-xs">البريد:</span><br /><strong className="text-foreground">{selectedPkg.customer_email || "-"}</strong></div>
                </div>
              </div>

              {/* Trip Info */}
              <div className="bg-[hsl(217,91%,60%)]/[0.03] rounded-xl p-4 border border-[hsl(217,91%,60%)]/10">
                <p className="text-xs font-bold text-[hsl(217,91%,60%)] mb-3 uppercase tracking-wider">تفاصيل الرحلة</p>
                <div className="grid grid-cols-2 gap-3">
                  <div><span className="text-muted-foreground text-xs">الوجهة:</span><br /><strong className="text-foreground">{selectedPkg.destination}</strong></div>
                  <div><span className="text-muted-foreground text-xs">المدينة:</span><br /><strong className="text-foreground">{selectedPkg.city_name || "-"}</strong></div>
                  <div><span className="text-muted-foreground text-xs">المغادرة من:</span><br /><strong className="text-foreground">{selectedPkg.origin_city || "الرياض"}</strong></div>
                  <div><span className="text-muted-foreground text-xs">البالغين/الأطفال:</span><br /><strong className="text-foreground">{selectedPkg.adults_count} / {selectedPkg.children_count || 0}</strong></div>
                  <div><span className="text-muted-foreground text-xs">تسجيل الدخول:</span><br /><strong className="text-foreground">{selectedPkg.check_in_date || "-"}</strong></div>
                  <div><span className="text-muted-foreground text-xs">تسجيل الخروج:</span><br /><strong className="text-foreground">{selectedPkg.check_out_date || "-"}</strong></div>
                </div>
              </div>

              {/* Services */}
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-card rounded-xl p-3 border border-border text-center">
                  <Hotel className="w-5 h-5 mx-auto mb-1 text-[hsl(217,91%,60%)]" />
                  <p className="text-[10px] text-muted-foreground">الفندق</p>
                  <p className="text-xs font-bold text-foreground mt-1">{selectedPkg.hotel?.name_ar || "لم يُحدد"}</p>
                </div>
                <div className="bg-card rounded-xl p-3 border border-border text-center">
                  <Plane className="w-5 h-5 mx-auto mb-1 text-foreground" />
                  <p className="text-[10px] text-muted-foreground">الطيران</p>
                  <p className="text-xs font-bold text-foreground mt-1">{selectedPkg.flight?.airline?.name_ar || "لم يُحدد"}</p>
                </div>
                <div className="bg-card rounded-xl p-3 border border-border text-center">
                  <Car className="w-5 h-5 mx-auto mb-1 text-muted-foreground" />
                  <p className="text-[10px] text-muted-foreground">السيارة</p>
                  <p className="text-xs font-bold text-foreground mt-1">{selectedPkg.car?.name_ar || "لم يُحدد"}</p>
                </div>
              </div>

              {/* Pricing */}
              <div className="bg-foreground rounded-xl p-4 text-card">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-card/60 text-xs">المجموع الفرعي</span>
                  <span className="font-semibold">{selectedPkg.subtotal?.toLocaleString()} ر.س</span>
                </div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-card/60 text-xs">الضرائب</span>
                  <span className="font-semibold">{selectedPkg.taxes?.toLocaleString()} ر.س</span>
                </div>
                <div className="border-t border-card/20 pt-3 flex items-center justify-between">
                  <span className="font-bold">الإجمالي</span>
                  <span className="text-xl font-black">{selectedPkg.total_price?.toLocaleString()} ر.س</span>
                </div>
              </div>

              {selectedPkg.notes && (
                <div className="bg-muted rounded-xl p-3">
                  <p className="text-xs text-muted-foreground font-bold mb-1">ملاحظات:</p>
                  <p className="text-foreground text-sm">{selectedPkg.notes}</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DynamicPackagesAdmin;
