import { useState, useEffect } from "react";
import {
  Search,
  Star,
  Check,
  X,
  Loader2,
  RefreshCw,
  Trash2,
  MessageSquare,
  Send,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Review {
  id: string;
  user_id: string;
  reviewable_id: string;
  reviewable_type: string;
  overall_rating: number;
  title: string | null;
  content: string | null;
  response: string | null;
  responded_at: string | null;
  status: string;
  created_at: string;
  user?: { first_name: string; last_name: string } | null;
}

const AdminReviews = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [ratingFilter, setRatingFilter] = useState("all");
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadReviews();
  }, []);

  const loadReviews = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("reviews")
        .select(`
          *,
          user:users(first_name, last_name)
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setReviews((data || []) as unknown as Review[]);
    } catch (error) {
      console.error("Error loading reviews:", error);
      toast.error("حدث خطأ في تحميل التقييمات");
    } finally {
      setLoading(false);
    }
  };

  const updateReviewStatus = async (id: string, status: string) => {
    try {
      const { error } = await supabase
        .from("reviews")
        .update({ status })
        .eq("id", id);

      if (error) throw error;
      loadReviews();
      toast.success(status === "approved" ? "تم اعتماد التقييم" : "تم رفض التقييم");
    } catch (error) {
      toast.error("حدث خطأ في التحديث");
    }
  };

  const deleteReview = async (id: string) => {
    if (!confirm("هل أنت متأكد من حذف هذا التقييم؟")) return;
    try {
      const { error } = await supabase.from("reviews").delete().eq("id", id);
      if (error) throw error;
      setReviews(prev => prev.filter(r => r.id !== id));
      toast.success("تم حذف التقييم");
    } catch (error) {
      toast.error("حدث خطأ في الحذف");
    }
  };

  const submitReply = async (id: string) => {
    if (!replyText.trim()) return;
    setSubmitting(true);
    try {
      const { error } = await supabase
        .from("reviews")
        .update({
          response: replyText.trim(),
          responded_at: new Date().toISOString(),
        })
        .eq("id", id);

      if (error) throw error;
      setReplyingTo(null);
      setReplyText("");
      loadReviews();
      toast.success("تم إرسال الرد بنجاح");
    } catch (error) {
      toast.error("حدث خطأ في إرسال الرد");
    } finally {
      setSubmitting(false);
    }
  };

  const getReviewableLabel = (type: string) => {
    const labels: Record<string, string> = {
      hotel: "فندق",
      program: "برنامج",
      destination: "وجهة",
      flight: "رحلة",
    };
    return labels[type] || type || "تقييم عام";
  };

  const filteredReviews = reviews.filter((review) => {
    const customerName = review.user ? `${review.user.first_name} ${review.user.last_name}` : "عميل";
    const matchesSearch = customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (review.content || "").toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || review.status === statusFilter;
    const matchesRating = ratingFilter === "all" || review.overall_rating.toString() === ratingFilter;
    return matchesSearch && matchesStatus && matchesRating;
  });

  const avgRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + r.overall_rating, 0) / reviews.length).toFixed(1)
    : "0.0";

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      approved: "bg-green-100 text-green-700",
      pending: "bg-yellow-100 text-yellow-700",
      rejected: "bg-red-100 text-red-700",
    };
    const labels: Record<string, string> = {
      approved: "معتمد",
      pending: "في الانتظار",
      rejected: "مرفوض",
    };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status] || styles.pending}`}>
        {labels[status] || "في الانتظار"}
      </span>
    );
  };

  const renderStars = (rating: number) => (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`w-4 h-4 ${i < rating ? "text-yellow-500 fill-yellow-500" : "text-muted-foreground/30"}`}
        />
      ))}
    </div>
  );

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh]">
        <Loader2 className="w-10 h-10 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground">جاري تحميل التقييمات...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Star className="w-7 h-7 text-primary" />
            إدارة التقييمات
          </h1>
          <p className="text-muted-foreground">
            مراجعة واعتماد تقييمات العملاء ({reviews.length} تقييم)
          </p>
        </div>
        <Button variant="outline" onClick={loadReviews}>
          <RefreshCw className="w-4 h-4 ml-2" />
          تحديث
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Star className="w-6 h-6 text-yellow-500 fill-yellow-500" />
              <span className="text-3xl font-bold">{avgRating}</span>
            </div>
            <p className="text-sm text-muted-foreground">متوسط التقييم</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-3xl font-bold text-green-600">{reviews.filter(r => r.status === "approved").length}</p>
            <p className="text-sm text-muted-foreground">معتمد</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-3xl font-bold text-yellow-600">{reviews.filter(r => r.status === "pending").length}</p>
            <p className="text-sm text-muted-foreground">في الانتظار</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-3xl font-bold text-red-600">{reviews.filter(r => r.status === "rejected").length}</p>
            <p className="text-sm text-muted-foreground">مرفوض</p>
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
                placeholder="بحث بالعميل أو المحتوى..."
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
                <SelectItem value="pending">في الانتظار</SelectItem>
                <SelectItem value="approved">معتمد</SelectItem>
                <SelectItem value="rejected">مرفوض</SelectItem>
              </SelectContent>
            </Select>
            <Select value={ratingFilter} onValueChange={setRatingFilter}>
              <SelectTrigger className="w-full md:w-40">
                <SelectValue placeholder="التقييم" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع التقييمات</SelectItem>
                <SelectItem value="5">5 نجوم</SelectItem>
                <SelectItem value="4">4 نجوم</SelectItem>
                <SelectItem value="3">3 نجوم</SelectItem>
                <SelectItem value="2">2 نجمة</SelectItem>
                <SelectItem value="1">1 نجمة</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Reviews List */}
      <div className="space-y-4">
        {filteredReviews.map((review) => (
          <Card key={review.id}>
            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <span className="font-bold text-primary">
                        {(review.user?.first_name || "ع").charAt(0)}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium">{review.user ? `${review.user.first_name} ${review.user.last_name}` : "عميل"}</p>
                      <p className="text-xs text-muted-foreground">
                        {getReviewableLabel(review.reviewable_type)}
                      </p>
                    </div>
                    {getStatusBadge(review.status)}
                  </div>

                  <div className="flex items-center gap-2 mb-2">
                    {renderStars(review.overall_rating)}
                    <span className="text-sm text-muted-foreground">
                      {new Date(review.created_at).toLocaleDateString("ar-SA")}
                    </span>
                  </div>

                  <h4 className="font-medium mb-1">{review.title || "بدون عنوان"}</h4>
                  <p className="text-sm text-muted-foreground">{review.content}</p>

                  {/* Existing Response */}
                  {review.response && (
                    <div className="mt-3 p-3 bg-primary/5 border border-primary/10 rounded-lg">
                      <p className="text-xs font-medium text-primary mb-1">رد الإدارة:</p>
                      <p className="text-sm">{review.response}</p>
                      {review.responded_at && (
                        <p className="text-xs text-muted-foreground mt-1">
                          {new Date(review.responded_at).toLocaleDateString("ar-SA")}
                        </p>
                      )}
                    </div>
                  )}

                  {/* Reply Form */}
                  {replyingTo === review.id && (
                    <div className="mt-3 space-y-2">
                      <Textarea
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        placeholder="اكتب ردك هنا..."
                        rows={3}
                      />
                      <div className="flex gap-2">
                        <Button size="sm" onClick={() => submitReply(review.id)} disabled={submitting}>
                          <Send className="w-4 h-4 ml-1" />
                          {submitting ? "جاري الإرسال..." : "إرسال الرد"}
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => { setReplyingTo(null); setReplyText(""); }}>
                          إلغاء
                        </Button>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex gap-2 flex-wrap">
                  {review.status === "pending" && (
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-green-600 border-green-600"
                        onClick={() => updateReviewStatus(review.id, "approved")}
                      >
                        <Check className="w-4 h-4 ml-1" />
                        اعتماد
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-600 border-red-600"
                        onClick={() => updateReviewStatus(review.id, "rejected")}
                      >
                        <X className="w-4 h-4 ml-1" />
                        رفض
                      </Button>
                    </>
                  )}
                  {!review.response && replyingTo !== review.id && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => { setReplyingTo(review.id); setReplyText(""); }}
                    >
                      <MessageSquare className="w-4 h-4 ml-1" />
                      رد
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-red-500 hover:text-red-700"
                    onClick={() => deleteReview(review.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {filteredReviews.length === 0 && (
          <div className="text-center py-16">
            <Star className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-20" />
            <h3 className="text-xl font-bold mb-2">لا توجد تقييمات</h3>
            <p className="text-muted-foreground">لم يتم العثور على تقييمات مطابقة</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminReviews;
