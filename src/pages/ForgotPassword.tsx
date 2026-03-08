import { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, ArrowRight, ArrowLeft, KeyRound } from "lucide-react";
import PageLayout from "@/layouts/PageLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { useIsMobile } from "@/hooks/use-mobile";

const ForgotPassword = () => {
  const { resetPassword } = useAuth();
  const isMobile = useIsMobile();
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [email, setEmail] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) { toast.error("يرجى إدخال البريد الإلكتروني"); return; }
    setLoading(true);
    try {
      const { error } = await resetPassword(email);
      if (error) { toast.error(error.message); return; }
      setSent(true);
      toast.success("تم إرسال رابط إعادة التعيين");
    } catch { toast.error("حدث خطأ غير متوقع"); } finally { setLoading(false); }
  };

  const content = sent ? (
    <div className="space-y-6">
      <div className="p-4 bg-green-50 border border-green-200 rounded-2xl text-center">
        <Mail className="w-12 h-12 text-green-600 mx-auto mb-3" />
        <p className="text-green-800 font-medium">تم إرسال البريد بنجاح!</p>
        <p className="text-green-600 text-sm mt-1">تحقق من صندوق الوارد أو البريد غير المرغوب فيه</p>
      </div>
      <div className="space-y-3">
        <Button variant="outline" className={`w-full ${isMobile ? "h-12 rounded-xl" : ""}`} onClick={() => setSent(false)}>إعادة الإرسال</Button>
        <Link to="/login" className="block">
          <Button variant="ghost" className={`w-full ${isMobile ? "h-12 rounded-xl" : ""}`}><ArrowRight className="w-4 h-4 ml-2" />العودة لتسجيل الدخول</Button>
        </Link>
      </div>
    </div>
  ) : (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">البريد الإلكتروني</Label>
        <div className="relative">
          <Mail className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input id="email" type="email" placeholder="your@email.com" value={email} onChange={(e) => setEmail(e.target.value)} className={`pr-10 ${isMobile ? "h-12 rounded-xl" : ""}`} dir="ltr" />
        </div>
      </div>
      <Button type="submit" className={`w-full ${isMobile ? "h-12 rounded-xl text-base" : ""}`} disabled={loading}>
        {loading ? "جاري الإرسال..." : (<>إرسال رابط الاستعادة<ArrowLeft className="w-4 h-4 mr-2" /></>)}
      </Button>
      <Link to="/login" className="block">
        <Button variant="ghost" className={`w-full ${isMobile ? "h-12 rounded-xl" : ""}`}><ArrowRight className="w-4 h-4 ml-2" />العودة لتسجيل الدخول</Button>
      </Link>
    </form>
  );

  if (isMobile) {
    return (
      <PageLayout pageTitle="استعادة كلمة المرور">
        <div className="px-5 py-6 flex flex-col items-center">
          <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-4">
            <KeyRound className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-xl font-bold mb-1">{sent ? "تحقق من بريدك" : "استعادة كلمة المرور"}</h2>
          <p className="text-sm text-muted-foreground mb-6 text-center">
            {sent ? "تم إرسال رابط إعادة تعيين كلمة المرور" : "أدخل بريدك الإلكتروني وسنرسل لك رابط إعادة التعيين"}
          </p>
          <div className="w-full max-w-sm">{content}</div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout pageTitle="استعادة كلمة المرور">
      <div className="container py-20 flex items-center justify-center min-h-[80vh]">
        <div className="w-full max-w-md bg-card rounded-2xl shadow-2xl border-0 p-8">
          <div className="text-center mb-6">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <KeyRound className="w-10 h-10 text-primary" />
            </div>
            <h2 className="text-2xl font-bold">{sent ? "تحقق من بريدك" : "استعادة كلمة المرور"}</h2>
            <p className="text-muted-foreground">
              {sent ? "تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني" : "أدخل بريدك الإلكتروني وسنرسل لك رابط إعادة التعيين"}
            </p>
          </div>
          {content}
        </div>
      </div>
    </PageLayout>
  );
};

export default ForgotPassword;
