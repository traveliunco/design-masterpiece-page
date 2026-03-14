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
  payment_method: string;
  status: string;
  transaction_id: string | null;
  created_at: string;
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
          user:users(full_name, email)
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
      const { error } = await supabase
        .from("payments")
        .update({ status: status })
        .eq("id", id);

      if (error) throw error;
      loadPayments();
      toast.success("تم تحديث حالة الدفع");
      setSelectedPayment(null);
    } catch (error) {
      toast.error("حدث خطأ في التحديث");
    }
  };

  const filteredPayments = payments.filter((payment) => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = 
      (payment.transaction_id || "").toLowerCase().includes(searchLower) ||
      (payment.booking?.booking_reference || "").toLowerCase().includes(searchLower) ||
      (payment.user?.full_name || "").toLowerCase().includes(searchLower);
    const matchesStatus = statusFilter === "all" || payment.payment_status === statusFilter;
    const matchesMethod = methodFilter === "all" || payment.payment_method === methodFilter;
    return matchesSearch && matchesStatus && matchesMethod;
  });

  const totalAmount = payments.reduce((sum, p) => sum + (p.amount || 0), 0);
  const confirmedAmount = payments.filter(p => p.payment_status === "completed").reduce((sum, p) => sum + (p.amount || 0), 0);

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
        <Button variant="outline" onClick={loadPayments} aria-label="تحديث">
          <RefreshCw className="w-4 h-4 ml-2" />
          تحديث
        </Button>
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
            <p className="text-2xl font-bold text-yellow-600">{payments.filter(p => p.payment_status === "pending").length}</p>
            <p className="text-sm text-muted-foreground">في الانتظار</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <XCircle className="w-8 h-8 text-red-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-red-600">{payments.filter(p => p.payment_status === "failed").length}</p>
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
                        <p className="font-medium">{payment.user?.full_name || "عميل"}</p>
                        <p className="text-xs text-muted-foreground">{payment.user?.email}</p>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-sm font-mono">{payment.booking?.booking_reference || "-"}</td>
                    <td className="py-4 px-4 font-bold text-primary">{payment.amount?.toLocaleString()} ر.س</td>
                    <td className="py-4 px-4 text-sm">{getMethodLabel(payment.payment_method)}</td>
                    <td className="py-4 px-4">{getStatusBadge(payment.payment_status)}</td>
                    <td className="py-4 px-4 text-sm text-muted-foreground">
                      {new Date(payment.created_at).toLocaleDateString("ar-SA")}
                    </td>
                    <td className="py-4 px-4">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        aria-label="عرض التفاصيل"
                        onClick={() => setSelectedPayment(payment)}
                      >
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
                    <p className="font-bold text-primary text-xl">{selectedPayment.amount?.toLocaleString()} ر.س</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">العميل</p>
                    <p className="font-medium">{selectedPayment.user?.full_name || "عميل"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">طريقة الدفع</p>
                    <p>{getMethodLabel(selectedPayment.payment_method)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">الحالة</p>
                    {getStatusBadge(selectedPayment.payment_status)}
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">التاريخ</p>
                    <p>{new Date(selectedPayment.created_at).toLocaleString("ar-SA")}</p>
                  </div>
                </div>

                {selectedPayment.payment_status === "pending" && (
                  <div className="flex gap-2 pt-4 border-t">
                    <Button 
                      className="flex-1" 
                      onClick={() => updatePaymentStatus(selectedPayment.id, "completed")}
                    >
                      <CheckCircle className="w-4 h-4 ml-2" />
                      تأكيد الدفع
                    </Button>
                    <Button 
                      variant="destructive" 
                      className="flex-1"
                      onClick={() => updatePaymentStatus(selectedPayment.id, "failed")}
                    >
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
