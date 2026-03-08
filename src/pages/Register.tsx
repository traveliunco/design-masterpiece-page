import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserPlus, Mail, Lock, Eye, EyeOff, User, Phone, ArrowRight, Check } from "lucide-react";
import PageLayout from "@/layouts/PageLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { useIsMobile } from "@/hooks/use-mobile";

const Register = () => {
  const navigate = useNavigate();
  const { signUp, signInWithGoogle } = useAuth();
  const isMobile = useIsMobile();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "", lastName: "", email: "", phone: "", password: "", confirmPassword: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    if (!formData.firstName || !formData.lastName) { toast.error("يرجى إدخال الاسم الكامل"); return false; }
    if (!formData.email) { toast.error("يرجى إدخال البريد الإلكتروني"); return false; }
    if (formData.password.length < 8) { toast.error("كلمة المرور يجب أن تكون 8 أحرف على الأقل"); return false; }
    if (formData.password !== formData.confirmPassword) { toast.error("كلمة المرور غير متطابقة"); return false; }
    if (!acceptTerms) { toast.error("يجب الموافقة على الشروط والأحكام"); return false; }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);
    try {
      const { error } = await signUp(formData.email, formData.password, {
        firstName: formData.firstName, lastName: formData.lastName, phone: formData.phone,
      });
      if (error) {
        toast.error(error.message.includes("already registered") ? "البريد الإلكتروني مسجل بالفعل" : error.message);
        return;
      }
      toast.success("تم إنشاء الحساب بنجاح! يرجى التحقق من بريدك الإلكتروني");
      navigate("/login", { state: { registered: true } });
    } catch { toast.error("حدث خطأ غير متوقع"); } finally { setLoading(false); }
  };

  const handleGoogleSignUp = async () => {
    const { error } = await signInWithGoogle();
    if (error) toast.error(error.message);
  };

  const inputClass = isMobile ? "pr-10 h-12 rounded-xl" : "pr-10";

  const formContent = (
    <>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <Label htmlFor="firstName">الاسم الأول</Label>
            <div className="relative">
              <User className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input id="firstName" name="firstName" placeholder="أحمد" value={formData.firstName} onChange={handleInputChange} className={inputClass} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName">الاسم الأخير</Label>
            <Input id="lastName" name="lastName" placeholder="محمد" value={formData.lastName} onChange={handleInputChange} className={isMobile ? "h-12 rounded-xl" : ""} />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">البريد الإلكتروني</Label>
          <div className="relative">
            <Mail className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input id="email" name="email" type="email" placeholder="your@email.com" value={formData.email} onChange={handleInputChange} className={inputClass} dir="ltr" />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">رقم الجوال (اختياري)</Label>
          <div className="relative">
            <Phone className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input id="phone" name="phone" type="tel" placeholder="+966 5XX XXX XXXX" value={formData.phone} onChange={handleInputChange} className={inputClass} dir="ltr" />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">كلمة المرور</Label>
          <div className="relative">
            <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input id="password" name="password" type={showPassword ? "text" : "password"} placeholder="••••••••" value={formData.password} onChange={handleInputChange} className={`${inputClass} pl-10`} dir="ltr" />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
          <p className="text-xs text-muted-foreground">8 أحرف على الأقل</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword">تأكيد كلمة المرور</Label>
          <div className="relative">
            <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input id="confirmPassword" name="confirmPassword" type="password" placeholder="••••••••" value={formData.confirmPassword} onChange={handleInputChange} className={inputClass} dir="ltr" />
            {formData.confirmPassword && formData.password === formData.confirmPassword && (
              <Check className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-green-500" />
            )}
          </div>
        </div>

        <div className="flex items-start gap-2">
          <Checkbox id="terms" checked={acceptTerms} onCheckedChange={(checked) => setAcceptTerms(checked as boolean)} />
          <label htmlFor="terms" className="text-sm text-muted-foreground">
            أوافق على{" "}<Link to="/terms" className="text-primary hover:underline">الشروط والأحكام</Link>{" "}و{" "}<Link to="/privacy" className="text-primary hover:underline">سياسة الخصوصية</Link>
          </label>
        </div>

        <Button type="submit" className={`w-full ${isMobile ? "h-12 rounded-xl text-base" : ""}`} disabled={loading}>
          {loading ? "جاري إنشاء الحساب..." : (<>إنشاء الحساب<ArrowRight className="w-4 h-4 mr-2" /></>)}
        </Button>
      </form>

      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center"><div className="w-full border-t"></div></div>
        <div className="relative flex justify-center text-xs uppercase"><span className="bg-background px-2 text-muted-foreground">أو</span></div>
      </div>

      <Button type="button" variant="outline" className={`w-full ${isMobile ? "h-12 rounded-xl" : ""}`} onClick={handleGoogleSignUp}>
        <svg className="w-5 h-5 ml-2" viewBox="0 0 24 24">
          <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
          <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
          <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
          <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
        </svg>
        التسجيل بـ Google
      </Button>

      <p className="text-center text-sm text-muted-foreground mt-6">
        لديك حساب بالفعل؟{" "}<Link to="/login" className="text-primary hover:underline font-medium">تسجيل الدخول</Link>
      </p>
    </>
  );

  if (isMobile) {
    return (
      <PageLayout pageTitle="إنشاء حساب">
        <div className="px-5 py-6 flex flex-col items-center">
          <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-4">
            <UserPlus className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-xl font-bold mb-1">إنشاء حساب جديد</h2>
          <p className="text-sm text-muted-foreground mb-6">انضم إلى ترافليون</p>
          <div className="w-full">{formContent}</div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout pageTitle="إنشاء حساب">
      <div className="container py-12 flex items-center justify-center min-h-[80vh]">
        <div className="w-full max-w-lg bg-card rounded-2xl shadow-2xl border-0 p-8">
          <div className="text-center mb-6">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <UserPlus className="w-10 h-10 text-primary" />
            </div>
            <h2 className="text-2xl font-bold">إنشاء حساب جديد</h2>
            <p className="text-muted-foreground">انضم إلى ترافليون واحجز رحلة أحلامك</p>
          </div>
          {formContent}
        </div>
      </div>
    </PageLayout>
  );
};

export default Register;
