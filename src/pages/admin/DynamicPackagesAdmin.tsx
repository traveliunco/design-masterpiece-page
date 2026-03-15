import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Package, Eye, Search, Filter, RefreshCw } from "lucide-react";

const statusMap: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  draft: { label: "مسودة", variant: "secondary" },
  submitted: { label: "مرسل", variant: "default" },
  confirmed: { label: "مؤكد", variant: "outline" },
  cancelled: { label: "ملغي", variant: "destructive" },
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">البكجات الديناميكية</h1>
          <p className="text-muted-foreground">إدارة الرحلات المخصصة من مصمم الرحلات</p>
        </div>
        <Button variant="outline" onClick={() => queryClient.invalidateQueries({ queryKey: ["admin-dynamic-packages"] })}>
          <RefreshCw className="w-4 h-4 ml-2" /> تحديث
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "الإجمالي", value: stats.total, color: "bg-primary/10 text-primary" },
          { label: "مسودات", value: stats.draft, color: "bg-muted text-muted-foreground" },
          { label: "مرسلة", value: stats.submitted, color: "bg-blue-500/10 text-blue-600" },
          { label: "مؤكدة", value: stats.confirmed, color: "bg-green-500/10 text-green-600" },
        ].map((s) => (
          <Card key={s.label}>
            <CardContent className="p-4 text-center">
              <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
              <p className="text-sm text-muted-foreground">{s.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <div className="flex gap-4 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="بحث بالاسم أو الوجهة..." value={search} onChange={(e) => setSearch(e.target.value)} className="pr-10" />
        </div>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-[160px]">
            <Filter className="w-4 h-4 ml-2" />
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
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>العميل</TableHead>
                <TableHead>الوجهة</TableHead>
                <TableHead>المدينة</TableHead>
                <TableHead>التاريخ</TableHead>
                <TableHead>السعر</TableHead>
                <TableHead>الحالة</TableHead>
                <TableHead>إجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow><TableCell colSpan={7} className="text-center py-8">جاري التحميل...</TableCell></TableRow>
              ) : filtered.length === 0 ? (
                <TableRow><TableCell colSpan={7} className="text-center py-8 text-muted-foreground">لا توجد بكجات</TableCell></TableRow>
              ) : (
                filtered.map((pkg: any) => (
                  <TableRow key={pkg.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{pkg.customer_name || "غير محدد"}</p>
                        <p className="text-xs text-muted-foreground">{pkg.customer_email}</p>
                      </div>
                    </TableCell>
                    <TableCell>{pkg.destination || "-"}</TableCell>
                    <TableCell>{pkg.city_name || "-"}</TableCell>
                    <TableCell className="text-sm">{pkg.check_in_date || "-"}</TableCell>
                    <TableCell className="font-semibold">{pkg.total_price?.toLocaleString()} ر.س</TableCell>
                    <TableCell>
                      <Badge variant={statusMap[pkg.status]?.variant || "secondary"}>
                        {statusMap[pkg.status]?.label || pkg.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button size="sm" variant="ghost" onClick={() => setSelectedPkg(pkg)}>
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Select value={pkg.status} onValueChange={(v) => updateStatus.mutate({ id: pkg.id, status: v })}>
                          <SelectTrigger className="w-[100px] h-8 text-xs">
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
        <DialogContent className="max-w-lg" dir="rtl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Package className="w-5 h-5" /> تفاصيل البكج
            </DialogTitle>
          </DialogHeader>
          {selectedPkg && (
            <div className="space-y-3 text-sm">
              <div className="grid grid-cols-2 gap-3">
                <div><span className="text-muted-foreground">العميل:</span> <strong>{selectedPkg.customer_name || "-"}</strong></div>
                <div><span className="text-muted-foreground">الهاتف:</span> <strong>{selectedPkg.customer_phone || "-"}</strong></div>
                <div><span className="text-muted-foreground">البريد:</span> <strong>{selectedPkg.customer_email || "-"}</strong></div>
                <div><span className="text-muted-foreground">الوجهة:</span> <strong>{selectedPkg.destination}</strong></div>
                <div><span className="text-muted-foreground">المدينة:</span> <strong>{selectedPkg.city_name || "-"}</strong></div>
                <div><span className="text-muted-foreground">المغادرة من:</span> <strong>{selectedPkg.origin_city || "الرياض"}</strong></div>
                <div><span className="text-muted-foreground">تسجيل الدخول:</span> <strong>{selectedPkg.check_in_date || "-"}</strong></div>
                <div><span className="text-muted-foreground">تسجيل الخروج:</span> <strong>{selectedPkg.check_out_date || "-"}</strong></div>
                <div><span className="text-muted-foreground">البالغين:</span> <strong>{selectedPkg.adults_count}</strong></div>
                <div><span className="text-muted-foreground">الأطفال:</span> <strong>{selectedPkg.children_count}</strong></div>
              </div>
              <hr />
              <div className="grid grid-cols-2 gap-3">
                <div><span className="text-muted-foreground">الفندق:</span> <strong>{selectedPkg.hotel?.name_ar || "لم يُحدد"}</strong></div>
                <div><span className="text-muted-foreground">الطيران:</span> <strong>{selectedPkg.flight?.airline?.name_ar || "لم يُحدد"} {selectedPkg.flight?.flight_number || ""}</strong></div>
                <div><span className="text-muted-foreground">السيارة:</span> <strong>{selectedPkg.car?.name_ar || "لم يُحدد"}</strong></div>
              </div>
              <hr />
              <div className="grid grid-cols-3 gap-3">
                <div><span className="text-muted-foreground">المجموع الفرعي:</span> <strong>{selectedPkg.subtotal?.toLocaleString()} ر.س</strong></div>
                <div><span className="text-muted-foreground">الضرائب:</span> <strong>{selectedPkg.taxes?.toLocaleString()} ر.س</strong></div>
                <div><span className="text-muted-foreground">الإجمالي:</span> <strong className="text-primary">{selectedPkg.total_price?.toLocaleString()} ر.س</strong></div>
              </div>
              {selectedPkg.notes && (
                <>
                  <hr />
                  <div><span className="text-muted-foreground">ملاحظات:</span> <p>{selectedPkg.notes}</p></div>
                </>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DynamicPackagesAdmin;
