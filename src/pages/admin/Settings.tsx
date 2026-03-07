import { useState, useEffect } from "react";
import {
  Settings, Globe, Phone, CreditCard, Bell, Palette, 
  Save, Upload, Layout, Layers, Plus, Trash, ArrowUp, ArrowDown
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { systemSettingsService, SystemSettings, defaultSystemSettings, FooterColumn, SocialLink } from "@/services/adminDataService";

const AdminSettings = () => {
  const [saving, setSaving] = useState(false);
  const [data, setData] = useState<SystemSettings>(defaultSystemSettings);

  useEffect(() => {
    setData(systemSettingsService.getSettings());
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      systemSettingsService.saveSettings(data);
      toast.success("تم حفظ الإعدادات بنجاح");
    } catch (e) {
      toast.error("حدث خطأ أثناء الحفظ");
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    if (confirm("هل أنت متأكد من استعادة الإعدادات الافتراضية؟")) {
      systemSettingsService.resetToDefault();
      setData(systemSettingsService.getSettings());
      toast.success("تم استعادة الإعدادات الافتراضية");
    }
  };

  // مساعدات التحديث
  const updateMain = (key: keyof SystemSettings, val: any) => setData(p => ({ ...p, [key]: val }));
  const updateHeader = (key: keyof SystemSettings["header"], val: any) => setData(p => ({ ...p, header: { ...p.header, [key]: val } }));
  const updateFooter = (key: keyof SystemSettings["footer"], val: any) => setData(p => ({ ...p, footer: { ...p.footer, [key]: val } }));

  // أعمدة الفوتر
  const addFooterColumn = () => {
    const newCol: FooterColumn = {
      id: Date.now().toString(),
      title: "عمود جديد",
      links: [],
      is_active: true,
      order: data.footer.columns.length + 1
    };
    updateFooter("columns", [...data.footer.columns, newCol]);
  };

  const removeFooterColumn = (colId: string) => {
    updateFooter("columns", data.footer.columns.filter(c => c.id !== colId));
  };

  const addFooterLink = (colId: string) => {
    updateFooter("columns", data.footer.columns.map(c => {
      if (c.id === colId) {
        return {
          ...c,
          links: [...c.links, { id: Date.now().toString(), name: "رابط جديد", path: "/", is_active: true, order: c.links.length + 1 }]
        };
      }
      return c;
    }));
  };

  const updateFooterCol = (colId: string, title: string) => {
    updateFooter("columns", data.footer.columns.map(c => c.id === colId ? { ...c, title } : c));
  };

  const updateFooterLink = (colId: string, linkId: string, key: string, val: any) => {
    updateFooter("columns", data.footer.columns.map(c => {
      if (c.id === colId) {
        return { ...c, links: c.links.map(l => l.id === linkId ? { ...l, [key]: val } : l) };
      }
      return c;
    }));
  };

  const removeFooterLink = (colId: string, linkId: string) => {
    updateFooter("columns", data.footer.columns.map(c => {
      if (c.id === colId) {
        return { ...c, links: c.links.filter(l => l.id !== linkId) };
      }
      return c;
    }));
  };

  const updateSocialLink = (id: string, url: string, is_active: boolean) => {
    updateFooter("socials", data.footer.socials.map(s => s.id === id ? { ...s, url, is_active } : s));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Settings className="w-7 h-7 text-primary" />
            النظام والإعدادات
          </h1>
          <p className="text-muted-foreground">
            إدارة إعدادات الموقع، الهيدر، الفوتر والنظام.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleReset} disabled={saving}>
            استعادة الافتراضي
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            <Save className="w-4 h-4 ml-2" />
            {saving ? "جاري الحفظ..." : "حفظ التغييرات"}
          </Button>
        </div>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid grid-cols-2 md:grid-cols-7 gap-2 h-auto p-1">
          <TabsTrigger value="general" className="gap-2"><Globe className="w-4 h-4" /><span>عام</span></TabsTrigger>
          <TabsTrigger value="header" className="gap-2"><Layout className="w-4 h-4" /><span>الهيدر</span></TabsTrigger>
          <TabsTrigger value="footer" className="gap-2"><Layers className="w-4 h-4" /><span>الفوتر</span></TabsTrigger>
          <TabsTrigger value="contact" className="gap-2"><Phone className="w-4 h-4" /><span>التواصل</span></TabsTrigger>
          <TabsTrigger value="payment" className="gap-2"><CreditCard className="w-4 h-4" /><span>الدفع</span></TabsTrigger>
          <TabsTrigger value="appearance" className="gap-2"><Palette className="w-4 h-4" /><span>المظهر</span></TabsTrigger>
        </TabsList>

        {/* 1. General Settings */}
        <TabsContent value="general">
          <div className="grid gap-6">
            <Card>
              <CardHeader><CardTitle>معلومات الموقع</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>اسم الموقع (عربي)</Label>
                    <Input value={data.siteNameAr} onChange={e => updateMain('siteNameAr', e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>اسم الموقع (إنجليزي)</Label>
                    <Input value={data.siteNameEn} onChange={e => updateMain('siteNameEn', e.target.value)} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>وصف الموقع للـ SEO</Label>
                  <Textarea value={data.siteDescription} onChange={e => updateMain('siteDescription', e.target.value)} rows={2} />
                </div>
                <div className="space-y-2">
                  <Label>الكلمات المفتاحية (Keywords)</Label>
                  <Input value={data.siteKeywords} onChange={e => updateMain('siteKeywords', e.target.value)} />
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>اللغة الافتراضية</Label>
                    <Select value={data.defaultLang} onValueChange={v => updateMain('defaultLang', v)}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ar">العربية</SelectItem>
                        <SelectItem value="en">English</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>العملة الافتراضية</Label>
                    <Select value={data.defaultCurrency} onValueChange={v => updateMain('defaultCurrency', v)}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
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
          </div>
        </TabsContent>

        {/* 2. Header */}
        <TabsContent value="header">
          <div className="grid gap-6">
            <Card>
              <CardHeader><CardTitle>تخصيص الهيدر (الشريط العلوي)</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>الاسم المعروض في الهيدر (عربي)</Label>
                    <Input value={data.header.siteName} onChange={e => updateHeader('siteName', e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>الاسم المعروض يالهيدر (إنجليزي)</Label>
                    <Input value={data.header.siteNameEn} onChange={e => updateHeader('siteNameEn', e.target.value)} />
                  </div>
                </div>
                
                <div className="space-y-4 border p-4 rounded-lg bg-slate-50">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold">تفعيل شريط الإعلانات العلوي (Top Bar)</p>
                      <p className="text-sm text-muted-foreground">شريط صغير أعلى القائمة الرئيسية</p>
                    </div>
                    <Switch checked={data.header.showTopBar} onCheckedChange={v => updateHeader('showTopBar', v)} />
                  </div>
                  {data.header.showTopBar && (
                    <div className="grid md:grid-cols-2 gap-4 mt-2">
                      <div className="space-y-2">
                        <Label>نص الشريط العلوي</Label>
                        <Input value={data.header.topBarText} onChange={e => updateHeader('topBarText', e.target.value)} />
                      </div>
                      <div className="space-y-2">
                        <Label>رقم التواصل بالشريط</Label>
                        <Input value={data.header.topBarPhone} onChange={e => updateHeader('topBarPhone', e.target.value)} dir="ltr" />
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-4 border p-4 rounded-lg">
                  <h3 className="font-semibold mb-2">أيقونات الهيدر</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="flex items-center justify-between">
                      <Label>زر البحث</Label>
                      <Switch checked={data.header.showSearchBar} onCheckedChange={v => updateHeader('showSearchBar', v)} />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label>زر الإشعارات</Label>
                      <Switch checked={data.header.showNotificationBell} onCheckedChange={v => updateHeader('showNotificationBell', v)} />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label>زر الدخول/الحساب</Label>
                      <Switch checked={data.header.showLoginButton} onCheckedChange={v => updateHeader('showLoginButton', v)} />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label>زر المفضلة</Label>
                      <Switch checked={data.header.showFavoritesButton} onCheckedChange={v => updateHeader('showFavoritesButton', v)} />
                    </div>
                  </div>
                </div>

              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* 3. Footer */}
        <TabsContent value="footer">
          <div className="grid gap-6">
            <Card>
              <CardHeader><CardTitle>الإعدادات العامة للفوتر</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>وصف الشركة في الفوتر</Label>
                  <Textarea value={data.footer.companyDescription} onChange={e => updateFooter('companyDescription', e.target.value)} rows={3} />
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>نص حقوق النشر (Copyright)</Label>
                    <Input value={data.footer.copyrightText} onChange={e => updateFooter('copyrightText', e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>لون خلفية الفوتر (سداسي HEX)</Label>
                    <div className="flex gap-2">
                      <Input type="color" value={data.footer.backgroundColor} onChange={e => updateFooter('backgroundColor', e.target.value)} className="w-12 h-10 p-1" />
                      <Input value={data.footer.backgroundColor} onChange={e => updateFooter('backgroundColor', e.target.value)} dir="ltr" />
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-6 mt-2">
                  <div className="flex items-center gap-2">
                    <Switch checked={data.footer.showSocialLinks} onCheckedChange={v => updateFooter('showSocialLinks', v)} />
                    <Label>إظهار أيقونات التواصل الاجتماعي</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch checked={data.footer.showTrustBadges} onCheckedChange={v => updateFooter('showTrustBadges', v)} />
                    <Label>إظهار بطاقات الدفع الآمن</Label>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>أعمدة وروابط الفوتر</span>
                  <Button variant="outline" size="sm" onClick={addFooterColumn}>
                    <Plus className="w-4 h-4 ml-1" /> إضافة عمود جديد
                  </Button>
                </CardTitle>
                <CardDescription>أضف أو عدّل القوائم المعروضة في الجزء السفلي من الموقع.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {data.footer.columns.map(col => (
                  <div key={col.id} className="border p-4 rounded-lg bg-slate-50 relative">
                    <Button variant="destructive" size="icon" className="absolute top-4 left-4 h-8 w-8" onClick={() => removeFooterColumn(col.id)}>
                      <Trash className="w-4 h-4" />
                    </Button>
                    <div className="mb-4 space-y-2 max-w-sm">
                      <Label>عنوان العمود</Label>
                      <Input value={col.title} onChange={e => updateFooterCol(col.id, e.target.value)} />
                    </div>
                    
                    <div className="space-y-3">
                      <Label>الروابط</Label>
                      {col.links.map(link => (
                        <div key={link.id} className="flex items-center gap-2 bg-white p-2 border rounded-md">
                          <Switch checked={link.is_active} onCheckedChange={v => updateFooterLink(col.id, link.id, 'is_active', v)} />
                          <Input value={link.name} onChange={e => updateFooterLink(col.id, link.id, 'name', e.target.value)} placeholder="اسم الرابط" />
                          <Input value={link.path} onChange={e => updateFooterLink(col.id, link.id, 'path', e.target.value)} placeholder="المسار /link" dir="ltr" />
                          <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-700" onClick={() => removeFooterLink(col.id, link.id)}>
                            <Trash className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                      <Button variant="ghost" size="sm" className="w-full border-dashed border-2" onClick={() => addFooterLink(col.id)}>
                        <Plus className="w-4 h-4 ml-1" /> إضافة رابط
                      </Button>
                    </div>
                  </div>
                ))}
                {data.footer.columns.length === 0 && <p className="text-center text-muted-foreground py-4">لا توجد أعمدة حالياً</p>}
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle>روابط التواصل الاجتماعي</CardTitle></CardHeader>
              <CardContent className="grid md:grid-cols-2 gap-4">
                {data.footer.socials.map(social => (
                  <div key={social.id} className="flex items-center gap-2 p-2 border rounded-lg">
                    <Switch checked={social.is_active} onCheckedChange={v => updateSocialLink(social.id, social.url, v)} />
                    <Label className="w-20 capitalize">{social.platform}</Label>
                    <Input value={social.url} onChange={e => updateSocialLink(social.id, e.target.value, social.is_active)} dir="ltr" placeholder="https://" className="flex-1" disabled={!social.is_active} />
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* 4. Contact Settings */}
        <TabsContent value="contact">
          <Card>
            <CardHeader><CardTitle>معلومات التواصل والدعم</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>البريد الإلكتروني الرئيسي</Label>
                  <Input value={data.emailMain} onChange={e => updateMain('emailMain', e.target.value)} dir="ltr" />
                </div>
                <div className="space-y-2">
                  <Label>بريد الدعم الفني</Label>
                  <Input value={data.emailSupport} onChange={e => updateMain('emailSupport', e.target.value)} dir="ltr" />
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>رقم الهاتف الأول</Label>
                  <Input value={data.phone1} onChange={e => updateMain('phone1', e.target.value)} dir="ltr" />
                </div>
                <div className="space-y-2">
                  <Label>رقم تطبيق الواتساب</Label>
                  <Input value={data.whatsapp} onChange={e => updateMain('whatsapp', e.target.value)} dir="ltr" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>عنوان المقر</Label>
                <Textarea value={data.address} onChange={e => updateMain('address', e.target.value)} rows={2} />
              </div>
              <div className="space-y-2">
                <Label>أوقات العمل</Label>
                <Input value={data.workingHours} onChange={e => updateMain('workingHours', e.target.value)} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 5. Payment */}
        <TabsContent value="payment">
          <Card>
            <CardHeader><CardTitle>بوابات الدفع والضرائب</CardTitle></CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">الضرائب (VAT)</h3>
                  <div className="flex items-center gap-2">
                    <Switch checked={data.vatEnabled} onCheckedChange={v => updateMain('vatEnabled', v)} />
                    <Label>تفعيل ضريبة القيمة المضافة</Label>
                  </div>
                  {data.vatEnabled && (
                    <>
                      <div className="space-y-2">
                        <Label>نسبة الضريبة (%)</Label>
                        <Input type="number" value={data.vatRate} onChange={e => updateMain('vatRate', Number(e.target.value))} />
                      </div>
                      <div className="space-y-2">
                        <Label>الرقم الضريبي</Label>
                        <Input value={data.vatNumber} onChange={e => updateMain('vatNumber', e.target.value)} dir="ltr" />
                      </div>
                    </>
                  )}
                </div>
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">وسائل الدفع</h3>
                  <div className="flex items-center gap-2">
                    <Switch checked={data.bankTransferEnabled} onCheckedChange={v => updateMain('bankTransferEnabled', v)} />
                    <Label>تفعيل التحويل البنكي</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch checked={data.stripeEnabled} onCheckedChange={v => updateMain('stripeEnabled', v)} />
                    <Label>تفعيل الدفع بالبطاقات المباشر (Stripe)</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch checked={data.tabbyEnabled} onCheckedChange={v => updateMain('tabbyEnabled', v)} />
                    <Label>تفعيل تقسيط تابي (Tabby)</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch checked={data.tamaraEnabled} onCheckedChange={v => updateMain('tamaraEnabled', v)} />
                    <Label>تفعيل تقسيط تمارا (Tamara)</Label>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* 6. Appearance */}
        <TabsContent value="appearance">
          <Card>
            <CardHeader><CardTitle>تعليمات المظهر</CardTitle></CardHeader>
            <CardContent>
              <p className="text-muted-foreground">خيارات الألوان الرئيسية (Primary/Secondary) مدمجة في ملفات CSS (Tailwind) للحفاظ على أعلى أداء للتطبيق. سيتم توفير خيارات إضافية للمظهر لاحقاً إذا استدعت الحاجة.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminSettings;
