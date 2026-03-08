import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { User, Mail, Phone, Globe, Camera, LogOut, Heart, Plane, Settings, ChevronLeft } from "lucide-react";
import PageLayout from "@/layouts/PageLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useSEO } from "@/hooks/useSEO";

interface Profile {
  first_name: string;
  last_name: string;
  phone: string;
  avatar_url: string;
  nationality: string;
  preferred_currency: string;
}

const Account = () => {
  useSEO({ title: "حسابي | ترافليون", description: "إدارة حسابك الشخصي" });

  const navigate = useNavigate();
  const { user, signOut, userRole } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [profile, setProfile] = useState<Profile>({
    first_name: "", last_name: "", phone: "", avatar_url: "", nationality: "", preferred_currency: "SAR",
  });
  const [bookingsCount, setBookingsCount] = useState(0);
  const [favoritesCount, setFavoritesCount] = useState(0);

  useEffect(() => {
    if (!user) { navigate("/login"); return; }
    fetchProfile();
    fetchCounts();
  }, [user]);

  const fetchProfile = async () => {
    if (!user) return;
    setLoading(true);
    const { data } = await supabase.from("profiles").select("*").eq("id", user.id).maybeSingle();
    if (data) {
      setProfile({
        first_name: data.first_name || "",
        last_name: data.last_name || "",
        phone: data.phone || "",
        avatar_url: data.avatar_url || "",
        nationality: data.nationality || "",
        preferred_currency: data.preferred_currency || "SAR",
      });
    } else {
      // Profile doesn't exist yet, use auth metadata
      setProfile(prev => ({
        ...prev,
        first_name: user.user_metadata?.first_name || "",
        last_name: user.user_metadata?.last_name || "",
        phone: user.user_metadata?.phone || "",
      }));
    }
    setLoading(false);
  };

  const fetchCounts = async () => {
    if (!user) return;
    const [bookings, favorites] = await Promise.all([
      supabase.from("flight_bookings").select("id", { count: "exact", head: true }).eq("user_id", user.id),
      supabase.from("user_favorites").select("id", { count: "exact", head: true }).eq("user_id", user.id),
    ]);
    setBookingsCount(bookings.count || 0);
    setFavoritesCount(favorites.count || 0);
  };

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    const { error } = await supabase.from("profiles").upsert({
      id: user.id,
      first_name: profile.first_name,
      last_name: profile.last_name,
      phone: profile.phone,
      nationality: profile.nationality,
      preferred_currency: profile.preferred_currency,
      avatar_url: profile.avatar_url,
    });
    if (error) toast.error("حدث خطأ في حفظ البيانات");
    else toast.success("تم حفظ البيانات بنجاح");
    setSaving(false);
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    setUploading(true);
    const ext = file.name.split(".").pop();
    const filePath = `${user.id}/avatar.${ext}`;
    const { error: uploadError } = await supabase.storage.from("avatars").upload(filePath, file, { upsert: true });
    if (uploadError) { toast.error("خطأ في رفع الصورة"); setUploading(false); return; }
    const { data: { publicUrl } } = supabase.storage.from("avatars").getPublicUrl(filePath);
    setProfile(prev => ({ ...prev, avatar_url: publicUrl }));
    await supabase.from("profiles").upsert({ id: user.id, avatar_url: publicUrl });
    toast.success("تم تحديث الصورة");
    setUploading(false);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const initials = `${profile.first_name?.[0] || ""}${profile.last_name?.[0] || ""}` || "👤";

  if (loading) {
    return (
      <PageLayout pageTitle="حسابي">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout pageTitle="حسابي">
      <div className="container px-4 py-6 md:py-12 max-w-2xl mx-auto">
        {/* Profile Header */}
        <div className="text-center mb-8">
          <div className="relative inline-block">
            <Avatar className="w-24 h-24 md:w-28 md:h-28 border-4 border-primary/20">
              <AvatarImage src={profile.avatar_url} />
              <AvatarFallback className="text-2xl bg-primary/10 text-primary">{initials}</AvatarFallback>
            </Avatar>
            <label className="absolute bottom-0 left-0 w-8 h-8 bg-primary rounded-full flex items-center justify-center cursor-pointer shadow-lg">
              <Camera className="w-4 h-4 text-primary-foreground" />
              <input type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} disabled={uploading} />
            </label>
          </div>
          <h2 className="text-xl font-bold mt-3">{profile.first_name} {profile.last_name}</h2>
          <p className="text-sm text-muted-foreground">{user?.email}</p>
          {userRole && userRole !== "customer" && (
            <span className="inline-block mt-2 px-3 py-1 bg-primary/10 text-primary text-xs rounded-full font-medium">
              {userRole === "admin" ? "مدير" : userRole === "moderator" ? "موظف" : userRole}
            </span>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-8">
          <button onClick={() => navigate("/my-bookings")} className="bg-card rounded-2xl p-4 text-center border shadow-sm hover:shadow-md transition-shadow">
            <Plane className="w-6 h-6 mx-auto mb-2 text-primary" />
            <div className="text-2xl font-bold">{bookingsCount}</div>
            <div className="text-xs text-muted-foreground">حجوزاتي</div>
          </button>
          <button onClick={() => navigate("/destinations")} className="bg-card rounded-2xl p-4 text-center border shadow-sm hover:shadow-md transition-shadow">
            <Heart className="w-6 h-6 mx-auto mb-2 text-red-500" />
            <div className="text-2xl font-bold">{favoritesCount}</div>
            <div className="text-xs text-muted-foreground">المفضلات</div>
          </button>
          {(userRole === "admin" || userRole === "moderator") && (
            <button onClick={() => navigate("/admin")} className="bg-card rounded-2xl p-4 text-center border shadow-sm hover:shadow-md transition-shadow">
              <Settings className="w-6 h-6 mx-auto mb-2 text-muted-foreground" />
              <div className="text-2xl font-bold">⚙️</div>
              <div className="text-xs text-muted-foreground">لوحة التحكم</div>
            </button>
          )}
        </div>

        {/* Tabs */}
        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="w-full grid grid-cols-2">
            <TabsTrigger value="profile">البيانات الشخصية</TabsTrigger>
            <TabsTrigger value="settings">الإعدادات</TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="mt-4">
            <Card>
              <CardContent className="pt-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>الاسم الأول</Label>
                    <div className="relative">
                      <User className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input value={profile.first_name} onChange={e => setProfile(p => ({ ...p, first_name: e.target.value }))} className="pr-9" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>الاسم الأخير</Label>
                    <Input value={profile.last_name} onChange={e => setProfile(p => ({ ...p, last_name: e.target.value }))} />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>البريد الإلكتروني</Label>
                  <div className="relative">
                    <Mail className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input value={user?.email || ""} disabled className="pr-9 bg-muted/50" dir="ltr" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>رقم الجوال</Label>
                  <div className="relative">
                    <Phone className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input value={profile.phone} onChange={e => setProfile(p => ({ ...p, phone: e.target.value }))} className="pr-9" dir="ltr" placeholder="+966 5XX XXX XXXX" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>الجنسية</Label>
                  <div className="relative">
                    <Globe className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input value={profile.nationality} onChange={e => setProfile(p => ({ ...p, nationality: e.target.value }))} className="pr-9" placeholder="سعودي" />
                  </div>
                </div>

                <Button onClick={handleSave} className="w-full" disabled={saving}>
                  {saving ? "جاري الحفظ..." : "حفظ التغييرات"}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="mt-4 space-y-4">
            <Card>
              <CardContent className="pt-6 space-y-4">
                <button onClick={() => navigate("/my-bookings")} className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <Plane className="w-5 h-5 text-primary" />
                    <span className="font-medium">حجوزاتي</span>
                  </div>
                  <ChevronLeft className="w-5 h-5 text-muted-foreground" />
                </button>

                <button onClick={() => navigate("/contact")} className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-primary" />
                    <span className="font-medium">تواصل معنا</span>
                  </div>
                  <ChevronLeft className="w-5 h-5 text-muted-foreground" />
                </button>

                <button onClick={() => navigate("/privacy")} className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <Settings className="w-5 h-5 text-muted-foreground" />
                    <span className="font-medium">الخصوصية والشروط</span>
                  </div>
                  <ChevronLeft className="w-5 h-5 text-muted-foreground" />
                </button>
              </CardContent>
            </Card>

            <Button variant="destructive" className="w-full" onClick={handleSignOut}>
              <LogOut className="w-4 h-4 ml-2" />
              تسجيل الخروج
            </Button>
          </TabsContent>
        </Tabs>
      </div>
    </PageLayout>
  );
};

export default Account;
