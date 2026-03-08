import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Lock, Eye, EyeOff, Check, KeyRound } from "lucide-react";
import PageLayout from "@/layouts/PageLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { useIsMobile } from "@/hooks/use-mobile";

const ResetPassword = () => {
  const navigate = useNavigate();
  const { updatePassword, user } = useAuth();
  const isMobile = useIsMobile();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ password: "", confirmPassword: "" });

  useEffect(() => { if (!user) { /* User should be auto-signed in via reset link */ } }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validatePassword = (password: string) => ({
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
  });

  const passwordChecks = validatePassword(formData.password);
  const isPasswordValid = Object.values(passwordChecks).every(Boolean);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isPasswordValid) { toast.error("كلمة المرور لا تستوفي المتطلبات"); return; }
    if (formData.password !== formData.confirmPassword) { toast.error("كلمة المرور غير متطابقة"); return; }
    setLoading(true);
    try {
      const { error } = await updatePassword(formData.password);
      if (error) { toast.error(error.message); return; }
      toast.success("تم تغيير كلمة المرور بنجاح!");
      navigate("/login");
    } catch { toast.error("حدث خطأ غير متوقع"); } finally { setLoading(false); }
  };

  const inputClass = isMobile ? "pr-10 h-12 rounded-xl" : "pr-10";

  const formContent = (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="password">كلمة المرور الجديدة</Label>
        <div className="relative">
          <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input id="password" name="password" type={showPassword ? "text" : "password"} placeholder="••••••••" value={formData.password} onChange={handleInputChange} className={`${inputClass} pl-10`} dir="ltr" />
          <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>
      </div>

      <div className={`p-3 bg-muted/50 ${isMobile ? "rounded-xl" : "rounded-lg"} space-y-2`}>
        <p className="text-sm font-medium mb-2">متطلبات كلمة المرور:</p>
        {[
          { key: "length", label: "8 أحرف على الأقل" },
          { key: "uppercase", label: "حرف كبير واحد على الأقل" },
          { key: "lowercase", label: "حرف صغير واحد على الأقل" },
          { key: "number", label: "رقم واحد على الأقل" },
        ].map((req) => (
          <div key={req.key} className="flex items-center gap-2 text-sm">
            <div className={`w-4 h-4 rounded-full flex items-center justify-center ${passwordChecks[req.key as keyof typeof passwordChecks] ? "bg-green-500" : "bg-gray-300"}`}>
              {passwordChecks[req.key as keyof typeof passwordChecks] && <Check className="w-3 h-3 text-white" />}
            </div>
            <span className={passwordChecks[req.key as keyof typeof passwordChecks] ? "text-green-600" : "text-muted-foreground"}>{req.label}</span>
          </div>
        ))}
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

      <Button type="submit" className={`w-full ${isMobile ? "h-12 rounded-xl text-base" : ""}`} disabled={loading || !isPasswordValid}>
        {loading ? "جاري التحديث..." : "تحديث كلمة المرور"}
      </Button>
    </form>
  );

  if (isMobile) {
    return (
      <PageLayout pageTitle="تعيين كلمة المرور">
        <div className="px-5 py-6 flex flex-col items-center">
          <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-4">
            <KeyRound className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-xl font-bold mb-1">كلمة مرور جديدة</h2>
          <p className="text-sm text-muted-foreground mb-6">أدخل كلمة المرور الجديدة لحسابك</p>
          <div className="w-full max-w-sm">{formContent}</div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout pageTitle="تعيين كلمة المرور">
      <div className="container py-20 flex items-center justify-center min-h-[80vh]">
        <div className="w-full max-w-md bg-card rounded-2xl shadow-2xl border-0 p-8">
          <div className="text-center mb-6">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <KeyRound className="w-10 h-10 text-primary" />
            </div>
            <h2 className="text-2xl font-bold">تعيين كلمة مرور جديدة</h2>
            <p className="text-muted-foreground">أدخل كلمة المرور الجديدة لحسابك</p>
          </div>
          {formContent}
        </div>
      </div>
    </PageLayout>
  );
};

export default ResetPassword;
