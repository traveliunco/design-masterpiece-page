import { useState, useEffect } from "react";
import {
  Search,
  CreditCard,
  Eye,
  Download,
  RefreshCw,
  Loader2,
  CheckCircle,
  XCircle,
  Clock,
  DollarSign,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Payment {
  id: string;
  booking_id: string;
  user_id: string;
  amount: number;
  currency: string;
  payment_method: string;
  gateway: string | null;
  status: string;
  transaction_id: string | null;
  card_last_four: string | null;
  card_brand: string | null;
  failure_reason: string | null;
  is_installment: boolean | null;
  installment_plan: any | null;
  installments_count: number | null;
  refund_amount: number | null;
  refund_reason: string | null;
  refunded_at: string | null;
  created_at: string;
  completed_at: string | null;
  booking?: { booking_reference: string } | null;
  user?: { first_name: string; last_name: string; email: string } | null;
}

const AdminPayments = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [methodFilter, setMethodFilter] = useState("all");
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);

  useEffect(() => {
    loadPayments();
  }, []);

  const loadPayments = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("payments")
        .select(`
          *,
          booking:bookings(booking_reference),
          user:users(first_name, last_name, email)
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setPayments((data || []) as unknown as Payment[]);
    } catch (error) {
      console.error("Error loading payments:", error);
      toast.error("حدث خطأ في تحميل المدفوعات");
    } finally {
      setLoading(false);
    }
  };

  const updatePaymentStatus = async (id: string, status: string) => {
    try {
      const updateData: any = { status };
      if (status === "completed") updateData.completed_at = new Date().toISOString();
      const { error } = await supabase.from("payments").update(updateData).eq("id", id);
      if (error) throw error;
      loadPayments();
      toast.success("تم تحديث حالة الدفع");
      setSelectedPayment(null);
    } catch (error) {
      toast.error("حدث خطأ في التحديث");
    }
  };

  const exportCSV = () => {
    const rows = [
      ["رقم العملية", "العميل", "البريد", "رقم الحجز", "المبلغ", "العملة", "طريقة الدفع", "الحالة", "التاريخ", "سبب الفشل"],
      ...payments.map(p => [
        p.transaction_id || p.id.slice(0, 8),
        p.user ? `${p.user.first_name} ${p.user.last_name}` : "عميل",
        p.user?.email || "",
        p.booking?.booking_reference || "-",
        p.amount?.toString() || "0",
        p.currency || "SAR",
        p.payment_method,
        p.status || "pending",
        new Date(p.created_at).toLocaleDateString("ar-SA"),
        p.failure_reason || "",
      ]),
    ];
    const csv = rows.map(r => r.map(c => `"${c}"`).join(",")).join("\n");
    const blob = new Blob(["\ufeff" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `payments-${new Date().toISOString().split("T")[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    toast.success("تم تصدير المدفوعات");
  };

  const filteredPayments = payments.filter((payment) => {
    const searchLower = searchTerm.toLowerCase();
    const userName = payment.user ? `${payment.user.first_name} ${payment.user.last_name}` : "";
    const matchesSearch =
      (payment.transaction_id || "").toLowerCase().includes(searchLower) ||
      (payment.booking?.booking_reference || "").toLowerCase().includes(searchLower) ||
      userName.toLowerCase().includes(searchLower);
    const matchesStatus = statusFilter === "all" || payment.status === statusFilter;
    const matchesMethod = methodFilter === "all" || payment.payment_method === methodFilter;
    return matchesSearch && matchesStatus && matchesMethod;
  });

  const totalAmount = payments.reduce((sum, p) => sum + (Number(p.amount) || 0), 0);
  const confirmedAmount = payments.filter(p => p.status === "completed").reduce((sum, p) => sum + (Number(p.amount) || 0), 0);

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      completed: "bg-green-100 text-green-700",
      pending: "bg-yellow-100 text-yellow-700",
      failed: "bg-red-100 text-red-700",
      refunded: "bg-gray-100 text-gray-700",
    };
    const labels: Record<string, string> = {
      completed: "مكتمل",
      pending: "في الانتظار",
      failed: "فشل",
      refunded: "مسترد",
    };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status] || styles.pending}`}>
        {labels[status] || status}
      </span>
    );
  };

  const getMethodLabel = (method: string) => {
    const labels: Record<string, string> = {
      credit_card: "بطاقة ائتمان",
      bank_transfer: "تحويل بنكي",
      cash: "نقدي",
      tabby: "Tabby",
      tamara: "Tamara",
      apple_pay: "Apple Pay",
    };
    return labels[method] || method;
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh]">
        <Loader2 className="w-10 h-10 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground">جاري تحميل المدفوعات...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <CreditCard className="w-7 h-7 text-primary" />
            إدارة المدفوعات
          </h1>
          <p className="text-muted-foreground">
            تتبع وإدارة جميع المعاملات المالية ({payments.length} عملية)
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={loadPayments}>
            <RefreshCw className="w-4 h-4 ml-2" />
            تحديث
          </Button>
          <Button variant="outline" onClick={exportCSV}>
            <Download className="w-4 h-4 ml-2" />
            تصدير CSV
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <DollarSign className="w-8 h-8 text-primary mx-auto mb-2" />
            <p className="text-2xl font-bold">{totalAmount.toLocaleString()}</p>
            <p className="text-sm text-muted-foreground">إجمالي المعاملات</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-green-600">{confirmedAmount.toLocaleString()}</p>
            <p className="text-sm text-muted-foreground">مؤكد</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Clock className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-yellow-600">{payments.filter(p => p.status === "pending").length}</p>
            <p className="text-sm text-muted-foreground">في الانتظار</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <XCircle className="w-8 h-8 text-red-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-red-600">{payments.filter(p => p.status === "failed").length}</p>
            <p className="text-sm text-muted-foreground">فشل</p>
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
                placeholder="بحث برقم العملية أو الحجز..."
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
                <SelectItem value="completed">مكتمل</SelectItem>
                <SelectItem value="pending">في الانتظار</SelectItem>
                <SelectItem value="failed">فشل</SelectItem>
                <SelectItem value="refunded">مسترد</SelectItem>
              </SelectContent>
            </Select>
            <Select value={methodFilter} onValueChange={setMethodFilter}>
              <SelectTrigger className="w-full md:w-40">
                <SelectValue placeholder="طريقة الدفع" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع الطرق</SelectItem>
                <SelectItem value="credit_card">بطاقة ائتمان</SelectItem>
                <SelectItem value="bank_transfer">تحويل بنكي</SelectItem>
                <SelectItem value="cash">نقدي</SelectItem>
                <SelectItem value="tabby">Tabby</SelectItem>
                <SelectItem value="tamara">Tamara</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Payments Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr>
                  <th className="text-right py-4 px-4 text-sm font-medium text-muted-foreground">رقم العملية</th>
                  <th className="text-right py-4 px-4 text-sm font-medium text-muted-foreground">العميل</th>
                  <th className="text-right py-4 px-4 text-sm font-medium text-muted-foreground">رقم الحجز</th>
                  <th className="text-right py-4 px-4 text-sm font-medium text-muted-foreground">المبلغ</th>
                  <th className="text-right py-4 px-4 text-sm font-medium text-muted-foreground">طريقة الدفع</th>
                  <th className="text-right py-4 px-4 text-sm font-medium text-muted-foreground">الحالة</th>
                  <th className="text-right py-4 px-4 text-sm font-medium text-muted-foreground">التاريخ</th>
                  <th className="text-right py-4 px-4 text-sm font-medium text-muted-foreground">إجراء</th>
                </tr>
              </thead>
              <tbody>
                {filteredPayments.map((payment) => (
                  <tr key={payment.id} className="border-b last:border-0 hover:bg-muted/30">
                    <td className="py-4 px-4 text-sm font-mono">{payment.transaction_id || payment.id.slice(0, 8)}</td>
                    <td className="py-4 px-4">
                      <div>
                        <p className="font-medium">{payment.user ? `${payment.user.first_name} ${payment.user.last_name}` : "عميل"}</p>
                        <p className="text-xs text-muted-foreground">{payment.user?.email}</p>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-sm font-mono">{payment.booking?.booking_reference || "-"}</td>
                    <td className="py-4 px-4 font-bold text-primary">{Number(payment.amount)?.toLocaleString()} ر.س</td>
                    <td className="py-4 px-4 text-sm">
                      {getMethodLabel(payment.payment_method)}
                      {payment.is_installment && (
                        <span className="block text-xs text-muted-foreground">تقسيط ({payment.installments_count || "?"} أقساط)</span>
                      )}
                    </td>
                    <td className="py-4 px-4">
                      {getStatusBadge(payment.status || "pending")}
                      {payment.status === "failed" && payment.failure_reason && (
                        <p className="text-xs text-red-500 mt-1">{payment.failure_reason}</p>
                      )}
                    </td>
                    <td className="py-4 px-4 text-sm text-muted-foreground">
                      {new Date(payment.created_at).toLocaleDateString("ar-SA")}
                    </td>
                    <td className="py-4 px-4">
                      <Button variant="ghost" size="icon" onClick={() => setSelectedPayment(payment)}>
                        <Eye className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredPayments.length === 0 && (
            <div className="text-center py-16">
              <CreditCard className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-20" />
              <h3 className="text-xl font-bold mb-2">لا توجد مدفوعات</h3>
              <p className="text-muted-foreground">جرب بحث أو فلتر مختلف</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Payment Detail Dialog */}
      <Dialog open={!!selectedPayment} onOpenChange={() => setSelectedPayment(null)}>
        <DialogContent className="max-w-lg">
          {selectedPayment && (
            <>
              <DialogHeader>
                <DialogTitle>تفاصيل المعاملة</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">رقم العملية</p>
                    <p className="font-mono font-medium">{selectedPayment.transaction_id || selectedPayment.id.slice(0, 8)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">المبلغ</p>
                    <p className="font-bold text-primary text-xl">{Number(selectedPayment.amount)?.toLocaleString()} {selectedPayment.currency || "ر.س"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">العميل</p>
                    <p className="font-medium">{selectedPayment.user ? `${selectedPayment.user.first_name} ${selectedPayment.user.last_name}` : "عميل"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">طريقة الدفع</p>
                    <p>{getMethodLabel(selectedPayment.payment_method)}</p>
                    {selectedPayment.card_brand && (
                      <p className="text-xs text-muted-foreground">{selectedPayment.card_brand} •••• {selectedPayment.card_last_four}</p>
                    )}
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">الحالة</p>
                    {getStatusBadge(selectedPayment.status || "pending")}
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">التاريخ</p>
                    <p>{new Date(selectedPayment.created_at).toLocaleString("ar-SA")}</p>
                  </div>
                  {selectedPayment.gateway && (
                    <div>
                      <p className="text-sm text-muted-foreground">البوابة</p>
                      <p>{selectedPayment.gateway}</p>
                    </div>
                  )}
                </div>

                {/* Installment info */}
                {selectedPayment.is_installment && (
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm font-medium text-blue-700 mb-1">تقسيط</p>
                    <p className="text-sm">عدد الأقساط: {selectedPayment.installments_count || "-"}</p>
                  </div>
                )}

                {/* Failure reason */}
                {selectedPayment.status === "failed" && selectedPayment.failure_reason && (
                  <div className="p-3 bg-red-50 rounded-lg">
                    <p className="text-sm font-medium text-red-700 mb-1">سبب الفشل</p>
                    <p className="text-sm text-red-600">{selectedPayment.failure_reason}</p>
                  </div>
                )}

                {/* Refund info */}
                {selectedPayment.refunded_at && (
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm font-medium text-gray-700 mb-1">استرداد</p>
                    <p className="text-sm">المبلغ: {Number(selectedPayment.refund_amount)?.toLocaleString()} {selectedPayment.currency || "ر.س"}</p>
                    {selectedPayment.refund_reason && <p className="text-sm">السبب: {selectedPayment.refund_reason}</p>}
                  </div>
                )}

                {selectedPayment.status === "pending" && (
                  <div className="flex gap-2 pt-4 border-t">
                    <Button className="flex-1" onClick={() => updatePaymentStatus(selectedPayment.id, "completed")}>
                      <CheckCircle className="w-4 h-4 ml-2" />
                      تأكيد الدفع
                    </Button>
                    <Button variant="destructive" className="flex-1" onClick={() => updatePaymentStatus(selectedPayment.id, "failed")}>
                      <XCircle className="w-4 h-4 ml-2" />
                      رفض
                    </Button>
                  </div>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminPayments;
