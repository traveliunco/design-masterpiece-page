import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Lock, Eye, EyeOff, Check, KeyRound } from "lucide-react";
import Nav3D from "@/components/Nav3D";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

const ResetPassword = () => {
  const navigate = useNavigate();
  const { updatePassword, user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });

  useEffect(() => {
    // Check if user came from password reset link
    if (!user) {
      // User should be automatically signed in via the reset link
      // If not, they'll be redirected
    }
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validatePassword = (password: string) => {
    const checks = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
    };
    return checks;
  };

  const passwordChecks = validatePassword(formData.password);
  const isPasswordValid = Object.values(passwordChecks).every(Boolean);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isPasswordValid) {
      toast.error("كلمة المرور لا تستوفي المتطلبات");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error("كلمة المرور غير متطابقة");
      return;
    }

    setLoading(true);
    try {
      const { error } = await updatePassword(formData.password);

      if (error) {
        toast.error(error.message);
        return;
      }

      toast.success("تم تغيير كلمة المرور بنجاح!");
      navigate("/login");
    } catch (error) {
      toast.error("حدث خطأ غير متوقع");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      <Nav3D />

      <div className="container py-20 flex items-center justify-center min-h-[80vh]">
        <Card className="w-full max-w-md shadow-2xl border-0">
          <CardHeader className="text-center pb-2">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <KeyRound className="w-10 h-10 text-primary" />
            </div>
            <CardTitle className="text-2xl font-bold">تعيين كلمة مرور جديدة</CardTitle>
            <CardDescription>
              أدخل كلمة المرور الجديدة لحسابك
            </CardDescription>
          </CardHeader>

          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Password */}
              <div className="space-y-2">
                <Label htmlFor="password">كلمة المرور الجديدة</Label>
                <div className="relative">
                  <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="pr-10 pl-10"
                    dir="ltr"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Password Requirements */}
              <div className="p-3 bg-muted/50 rounded-lg space-y-2">
                <p className="text-sm font-medium mb-2">متطلبات كلمة المرور:</p>
                {[
                  { key: "length", label: "8 أحرف على الأقل" },
                  { key: "uppercase", label: "حرف كبير واحد على الأقل" },
                  { key: "lowercase", label: "حرف صغير واحد على الأقل" },
                  { key: "number", label: "رقم واحد على الأقل" },
                ].map((req) => (
                  <div key={req.key} className="flex items-center gap-2 text-sm">
                    <div className={`w-4 h-4 rounded-full flex items-center justify-center ${
                      passwordChecks[req.key as keyof typeof passwordChecks]
                        ? "bg-green-500"
                        : "bg-gray-300"
                    }`}>
                      {passwordChecks[req.key as keyof typeof passwordChecks] && (
                        <Check className="w-3 h-3 text-white" />
                      )}
                    </div>
                    <span className={passwordChecks[req.key as keyof typeof passwordChecks]
                      ? "text-green-600"
                      : "text-muted-foreground"
                    }>
                      {req.label}
                    </span>
                  </div>
                ))}
              </div>

              {/* Confirm Password */}
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">تأكيد كلمة المرور</Label>
                <div className="relative">
                  <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className="pr-10"
                    dir="ltr"
                  />
                  {formData.confirmPassword && formData.password === formData.confirmPassword && (
                    <Check className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-green-500" />
                  )}
                </div>
              </div>

              {/* Submit Button */}
              <Button 
                type="submit" 
                className="w-full" 
                disabled={loading || !isPasswordValid}
              >
                {loading ? "جاري التحديث..." : "تحديث كلمة المرور"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      <Footer />
    </div>
  );
};

export default ResetPassword;
