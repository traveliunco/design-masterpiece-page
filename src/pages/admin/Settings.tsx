import { useState } from "react";
import {
  Settings,
  Globe,
  Mail,
  Phone,
  MapPin,
  CreditCard,
  Bell,
  Shield,
  Palette,
  Save,
  Upload,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { toast } from "sonner";

const AdminSettings = () => {
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setSaving(false);
    toast.success("تم حفظ الإعدادات بنجاح");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Settings className="w-7 h-7 text-primary" />
            الإعدادات
          </h1>
          <p className="text-muted-foreground">
            إدارة إعدادات الموقع والنظام
          </p>
        </div>
        <Button onClick={handleSave} disabled={saving}>
          <Save className="w-4 h-4 ml-2" />
          {saving ? "جاري الحفظ..." : "حفظ التغييرات"}
        </Button>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid grid-cols-2 md:grid-cols-5 gap-2 h-auto p-1">
          <TabsTrigger value="general" className="gap-2">
            <Globe className="w-4 h-4" />
            <span className="hidden md:inline">عام</span>
          </TabsTrigger>
          <TabsTrigger value="contact" className="gap-2">
            <Phone className="w-4 h-4" />
            <span className="hidden md:inline">التواصل</span>
          </TabsTrigger>
          <TabsTrigger value="payment" className="gap-2">
            <CreditCard className="w-4 h-4" />
            <span className="hidden md:inline">الدفع</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="gap-2">
            <Bell className="w-4 h-4" />
            <span className="hidden md:inline">الإشعارات</span>
          </TabsTrigger>
          <TabsTrigger value="appearance" className="gap-2">
            <Palette className="w-4 h-4" />
            <span className="hidden md:inline">المظهر</span>
          </TabsTrigger>
        </TabsList>

        {/* General Settings */}
        <TabsContent value="general">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>معلومات الموقع</CardTitle>
                <CardDescription>المعلومات الأساسية للموقع</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>اسم الموقع (عربي)</Label>
                    <Input defaultValue="ترافليون للسفر والسياحة" />
                  </div>
                  <div className="space-y-2">
                    <Label>اسم الموقع (إنجليزي)</Label>
                    <Input defaultValue="Traveliun Travel & Tourism" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>وصف الموقع</Label>
                  <Textarea 
                    defaultValue="ترافليون للسفر والسياحة - رحلات الأحلام مع خدمة فاخرة وأسعار منافسة"
                    rows={3}
                  />
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>اللغة الافتراضية</Label>
                    <Select defaultValue="ar">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ar">العربية</SelectItem>
                        <SelectItem value="en">English</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>العملة الافتراضية</Label>
                    <Select defaultValue="SAR">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="SAR">ريال سعودي (SAR)</SelectItem>
                        <SelectItem value="USD">دولار أمريكي (USD)</SelectItem>
                        <SelectItem value="AED">درهم إماراتي (AED)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>الشعار والأيقونة</CardTitle>
                <CardDescription>شعار الموقع وأيقونة المتصفح</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>الشعار الرئيسي</Label>
                    <div className="border-2 border-dashed rounded-lg p-6 text-center">
                      <Upload className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
                      <p className="text-sm text-muted-foreground">اسحب الصورة هنا أو</p>
                      <Button variant="link" className="p-0">اختر ملف</Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>أيقونة الموقع (Favicon)</Label>
                    <div className="border-2 border-dashed rounded-lg p-6 text-center">
                      <Upload className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
                      <p className="text-sm text-muted-foreground">اسحب الصورة هنا أو</p>
                      <Button variant="link" className="p-0">اختر ملف</Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Contact Settings */}
        <TabsContent value="contact">
          <Card>
            <CardHeader>
              <CardTitle>معلومات التواصل</CardTitle>
              <CardDescription>بيانات الاتصال التي تظهر في الموقع</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>البريد الإلكتروني الرئيسي</Label>
                  <Input type="email" defaultValue="booking@traveliun.com" />
                </div>
                <div className="space-y-2">
                  <Label>بريد الدعم الفني</Label>
                  <Input type="email" defaultValue="support@traveliun.com" />
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>رقم الهاتف الرئيسي</Label>
                  <Input type="tel" defaultValue="+966569222111" dir="ltr" />
                </div>
                <div className="space-y-2">
                  <Label>رقم الواتساب</Label>
                  <Input type="tel" defaultValue="+966569222111" dir="ltr" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>العنوان</Label>
                <Textarea 
                  defaultValue="المملكة العربية السعودية - المدينة المنورة - الإسكان - شارع الهجرة"
                  rows={2}
                />
              </div>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>رابط فيسبوك</Label>
                  <Input defaultValue="https://facebook.com/traveliun" dir="ltr" />
                </div>
                <div className="space-y-2">
                  <Label>رابط إنستغرام</Label>
                  <Input defaultValue="https://instagram.com/traveliun" dir="ltr" />
                </div>
                <div className="space-y-2">
                  <Label>رابط تويتر</Label>
                  <Input defaultValue="https://twitter.com/traveliun" dir="ltr" />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Payment Settings */}
        <TabsContent value="payment">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>بوابات الدفع</CardTitle>
                <CardDescription>إعدادات بوابات الدفع الإلكتروني</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Stripe */}
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <span className="font-bold text-blue-600">S</span>
                    </div>
                    <div>
                      <p className="font-medium">Stripe</p>
                      <p className="text-sm text-muted-foreground">بطاقات ائتمان دولية</p>
                    </div>
                  </div>
                  <Switch defaultChecked />
                </div>

                {/* Moyasar */}
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                      <span className="font-bold text-purple-600">M</span>
                    </div>
                    <div>
                      <p className="font-medium">Moyasar</p>
                      <p className="text-sm text-muted-foreground">مدى وApple Pay</p>
                    </div>
                  </div>
                  <Switch defaultChecked />
                </div>

                {/* Tabby */}
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                      <span className="font-bold text-green-600">T</span>
                    </div>
                    <div>
                      <p className="font-medium">Tabby</p>
                      <p className="text-sm text-muted-foreground">الدفع بالتقسيط</p>
                    </div>
                  </div>
                  <Switch />
                </div>

                {/* Bank Transfer */}
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                      <span className="font-bold text-gray-600">B</span>
                    </div>
                    <div>
                      <p className="font-medium">تحويل بنكي</p>
                      <p className="text-sm text-muted-foreground">تحويل مباشر</p>
                    </div>
                  </div>
                  <Switch defaultChecked />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>إعدادات الضرائب</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">تفعيل ضريبة القيمة المضافة</p>
                    <p className="text-sm text-muted-foreground">إضافة 15% ضريبة على جميع الحجوزات</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>نسبة الضريبة (%)</Label>
                    <Input type="number" defaultValue="15" />
                  </div>
                  <div className="space-y-2">
                    <Label>الرقم الضريبي</Label>
                    <Input defaultValue="300000000000003" dir="ltr" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Notifications Settings */}
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>إشعارات البريد الإلكتروني</CardTitle>
              <CardDescription>تحديد الإشعارات التي يتم إرسالها</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { title: "حجز جديد", desc: "إرسال إشعار عند استلام حجز جديد", enabled: true },
                { title: "تأكيد الحجز", desc: "إرسال تأكيد للعميل بعد تأكيد الحجز", enabled: true },
                { title: "إتمام الدفع", desc: "إرسال إيصال بعد إتمام الدفع", enabled: true },
                { title: "تذكير بالرحلة", desc: "تذكير العميل قبل موعد الرحلة بيومين", enabled: true },
                { title: "طلب تقييم", desc: "طلب تقييم من العميل بعد انتهاء الرحلة", enabled: false },
                { title: "رسالة جديدة", desc: "إشعار عند استلام رسالة من نموذج التواصل", enabled: true },
              ].map((item, index) => (
                <div key={index} className="flex items-center justify-between py-3 border-b last:border-0">
                  <div>
                    <p className="font-medium">{item.title}</p>
                    <p className="text-sm text-muted-foreground">{item.desc}</p>
                  </div>
                  <Switch defaultChecked={item.enabled} />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Appearance Settings */}
        <TabsContent value="appearance">
          <Card>
            <CardHeader>
              <CardTitle>المظهر والألوان</CardTitle>
              <CardDescription>تخصيص مظهر الموقع</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>اللون الرئيسي</Label>
                  <div className="flex gap-2">
                    <Input type="color" defaultValue="#0d9488" className="w-12 h-10 p-1" />
                    <Input defaultValue="#0d9488" dir="ltr" className="flex-1" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>اللون الثانوي</Label>
                  <div className="flex gap-2">
                    <Input type="color" defaultValue="#d4a574" className="w-12 h-10 p-1" />
                    <Input defaultValue="#d4a574" dir="ltr" className="flex-1" />
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <Label>نوع الخط</Label>
                <Select defaultValue="cairo">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cairo">Cairo</SelectItem>
                    <SelectItem value="tajawal">Tajawal</SelectItem>
                    <SelectItem value="almarai">Almarai</SelectItem>
                    <SelectItem value="ibm-plex-arabic">IBM Plex Arabic</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-medium">الوضع الداكن</p>
                    <p className="text-sm text-muted-foreground">تفعيل الوضع الداكن للموقع</p>
                  </div>
                  <Switch />
                </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminSettings;
