import { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, ArrowRight, ArrowLeft, KeyRound } from "lucide-react";
import PageLayout from "@/layouts/PageLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

const ForgotPassword = () => {
  const { resetPassword } = useAuth();
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

  return (
    <PageLayout pageTitle="استعادة كلمة المرور">
      <div className="container py-8 md:py-20 flex items-center justify-center min-h-[70vh] md:min-h-[80vh]">
        <Card className="w-full max-w-md shadow-2xl border-0">
          <CardHeader className="text-center pb-2">
            <div className="w-16 h-16 md:w-20 md:h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <KeyRound className="w-8 h-8 md:w-10 md:h-10 text-primary" />
            </div>
            <CardTitle className="text-xl md:text-2xl font-bold">
              {sent ? "تحقق من بريدك" : "استعادة كلمة المرور"}
            </CardTitle>
            <CardDescription>
              {sent ? "تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني" : "أدخل بريدك الإلكتروني وسنرسل لك رابط إعادة التعيين"}
            </CardDescription>
          </CardHeader>

          <CardContent className="pt-6">
            {sent ? (
              <div className="space-y-6">
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-center">
                  <Mail className="w-12 h-12 text-green-600 mx-auto mb-3" />
                  <p className="text-green-800 font-medium">تم إرسال البريد بنجاح!</p>
                  <p className="text-green-600 text-sm mt-1">تحقق من صندوق الوارد أو البريد غير المرغوب فيه</p>
                </div>
                <div className="space-y-3">
                  <Button variant="outline" className="w-full" onClick={() => setSent(false)}>إعادة الإرسال</Button>
                  <Link to="/login" className="block">
                    <Button variant="ghost" className="w-full"><ArrowRight className="w-4 h-4 ml-2" />العودة لتسجيل الدخول</Button>
                  </Link>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">البريد الإلكتروني</Label>
                  <div className="relative">
                    <Mail className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input id="email" type="email" placeholder="your@email.com" value={email} onChange={(e) => setEmail(e.target.value)} className="pr-10" dir="ltr" />
                  </div>
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "جاري الإرسال..." : (<>إرسال رابط الاستعادة<ArrowLeft className="w-4 h-4 mr-2" /></>)}
                </Button>
                <Link to="/login" className="block">
                  <Button variant="ghost" className="w-full"><ArrowRight className="w-4 h-4 ml-2" />العودة لتسجيل الدخول</Button>
                </Link>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
};

export default ForgotPassword;
