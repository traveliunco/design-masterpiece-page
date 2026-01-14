/**
 * صفحة إعدادات الذكاء الاصطناعي - لوحة التحكم
 */

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Bot,
  Save,
  Plus,
  Trash2,
  Edit,
  Search,
  MessageSquare,
  Database,
  Settings,
  Loader2,
  Check,
  X,
  Brain,
  FileText,
  MessageCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import {
  getAISettings,
  updateAISettings,
  getKnowledge,
  addKnowledge,
  updateKnowledge,
  deleteKnowledge,
  getAllConversations,
  getConversationStats,
  type AISettings,
  type AIKnowledge,
  type Conversation,
} from "@/services/aiService";

const categories = [
  { id: "general", name: "عام", icon: "📋" },
  { id: "destinations", name: "الوجهات", icon: "🌍" },
  { id: "services", name: "الخدمات", icon: "✈️" },
  { id: "policies", name: "السياسات", icon: "📜" },
  { id: "offers", name: "العروض", icon: "🏷️" },
  { id: "faq", name: "الأسئلة الشائعة", icon: "❓" },
];

const AdminAISettings = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("settings");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Settings state
  const [settings, setSettings] = useState<AISettings | null>(null);

  // Knowledge state
  const [knowledge, setKnowledge] = useState<AIKnowledge[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [editingKnowledge, setEditingKnowledge] = useState<AIKnowledge | null>(null);
  const [isKnowledgeDialogOpen, setIsKnowledgeDialogOpen] = useState(false);
  const [newKnowledge, setNewKnowledge] = useState({
    title: "",
    category: "general",
    content: "",
    keywords: "",
    priority: 0,
  });

  // Conversations state
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [stats, setStats] = useState({ total: 0, today: 0 });

  // Load data
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [settingsData, knowledgeData, conversationsData, statsData] = await Promise.all([
        getAISettings(),
        getKnowledge(),
        getAllConversations(),
        getConversationStats(),
      ]);

      if (settingsData) setSettings(settingsData);
      setKnowledge(knowledgeData);
      setConversations(conversationsData);
      setStats(statsData);
    } catch (error) {
      console.error("Error loading data:", error);
      toast.error("حدث خطأ في تحميل البيانات");
    } finally {
      setLoading(false);
    }
  };

  // Save settings
  const handleSaveSettings = async () => {
    if (!settings) return;
    setSaving(true);
    try {
      await updateAISettings(settings);
      toast.success("تم حفظ الإعدادات بنجاح");
    } catch (error) {
      toast.error("حدث خطأ في حفظ الإعدادات");
    } finally {
      setSaving(false);
    }
  };

  // Add/Update knowledge
  const handleSaveKnowledge = async () => {
    setSaving(true);
    try {
      const data = {
        title: newKnowledge.title,
        category: newKnowledge.category,
        content: newKnowledge.content,
        keywords: newKnowledge.keywords.split(",").map((k) => k.trim()),
        priority: newKnowledge.priority,
      };

      if (editingKnowledge) {
        await updateKnowledge(editingKnowledge.id, data);
        toast.success("تم تحديث المعلومة بنجاح");
      } else {
        await addKnowledge(data);
        toast.success("تم إضافة المعلومة بنجاح");
      }

      setIsKnowledgeDialogOpen(false);
      setEditingKnowledge(null);
      setNewKnowledge({ title: "", category: "general", content: "", keywords: "", priority: 0 });
      loadData();
    } catch (error) {
      toast.error("حدث خطأ في حفظ المعلومة");
    } finally {
      setSaving(false);
    }
  };

  // Delete knowledge
  const handleDeleteKnowledge = async (id: string) => {
    if (!confirm("هل أنت متأكد من حذف هذه المعلومة؟")) return;
    try {
      await deleteKnowledge(id);
      toast.success("تم حذف المعلومة بنجاح");
      loadData();
    } catch (error) {
      toast.error("حدث خطأ في حذف المعلومة");
    }
  };

  // Filter knowledge
  const filteredKnowledge = knowledge.filter((item) => {
    if (selectedCategory !== "all" && item.category !== selectedCategory) return false;
    if (searchQuery && !item.title.includes(searchQuery) && !item.content.includes(searchQuery)) return false;
    return true;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Bot className="w-6 h-6 text-primary" />
            إعدادات الذكاء الاصطناعي
          </h1>
          <p className="text-muted-foreground">إدارة مساعد ترافليون الذكي</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">الحالة:</span>
            {settings?.is_enabled ? (
              <Badge className="bg-green-500">مُفعّل</Badge>
            ) : (
              <Badge variant="secondary">معطّل</Badge>
            )}
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary/10 rounded-xl">
                <MessageCircle className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.total}</p>
                <p className="text-sm text-muted-foreground">إجمالي المحادثات</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 rounded-xl">
                <MessageSquare className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.today}</p>
                <p className="text-sm text-muted-foreground">محادثات اليوم</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-xl">
                <Database className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{knowledge.length}</p>
                <p className="text-sm text-muted-foreground">قاعدة المعرفة</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3 max-w-md">
          <TabsTrigger value="settings" className="gap-2">
            <Settings className="w-4 h-4" />
            الإعدادات
          </TabsTrigger>
          <TabsTrigger value="knowledge" className="gap-2">
            <Brain className="w-4 h-4" />
            قاعدة المعرفة
          </TabsTrigger>
          <TabsTrigger value="conversations" className="gap-2">
            <MessageSquare className="w-4 h-4" />
            المحادثات
          </TabsTrigger>
        </TabsList>

        {/* Settings Tab */}
        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>الإعدادات العامة</CardTitle>
              <CardDescription>تحكم في سلوك ومظهر المساعد الذكي</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Enable/Disable */}
              <div className="flex items-center justify-between">
                <div>
                  <Label>تفعيل المساعد الذكي</Label>
                  <p className="text-sm text-muted-foreground">إظهار ويدجت الدردشة في الموقع</p>
                </div>
                <Switch
                  checked={settings?.is_enabled || false}
                  onCheckedChange={(checked) => setSettings((s) => s ? { ...s, is_enabled: checked } : null)}
                />
              </div>

              {/* Welcome Message */}
              <div className="space-y-2">
                <Label>رسالة الترحيب</Label>
                <Textarea
                  value={settings?.welcome_message || ""}
                  onChange={(e) => setSettings((s) => s ? { ...s, welcome_message: e.target.value } : null)}
                  rows={4}
                  placeholder="الرسالة التي تظهر عند فتح الدردشة..."
                />
              </div>

              {/* System Prompt */}
              <div className="space-y-2">
                <Label>التعليمات النظامية (System Prompt)</Label>
                <Textarea
                  value={settings?.system_prompt || ""}
                  onChange={(e) => setSettings((s) => s ? { ...s, system_prompt: e.target.value } : null)}
                  rows={10}
                  placeholder="التعليمات التي توجه سلوك الذكاء الاصطناعي..."
                />
                <p className="text-xs text-muted-foreground">
                  هذه التعليمات تحدد شخصية ومعرفة المساعد الذكي
                </p>
              </div>

              {/* Model Settings */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>النموذج</Label>
                  <Select
                    value={settings?.model || "deepseek-chat"}
                    onValueChange={(v) => setSettings((s) => s ? { ...s, model: v } : null)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="deepseek-chat">DeepSeek Chat</SelectItem>
                      <SelectItem value="deepseek-coder">DeepSeek Coder</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>درجة الإبداع (Temperature)</Label>
                  <Input
                    type="number"
                    min="0"
                    max="1"
                    step="0.1"
                    value={settings?.temperature || 0.7}
                    onChange={(e) => setSettings((s) => s ? { ...s, temperature: parseFloat(e.target.value) } : null)}
                  />
                </div>

                <div className="space-y-2">
                  <Label>الحد الأقصى للكلمات</Label>
                  <Input
                    type="number"
                    min="100"
                    max="4000"
                    value={settings?.max_tokens || 1000}
                    onChange={(e) => setSettings((s) => s ? { ...s, max_tokens: parseInt(e.target.value) } : null)}
                  />
                </div>
              </div>

              {/* Widget Settings */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>لون الويدجت</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      type="color"
                      value={settings?.widget_color || "#0B4D3C"}
                      onChange={(e) => setSettings((s) => s ? { ...s, widget_color: e.target.value } : null)}
                      className="w-20 h-10"
                    />
                    <Input
                      value={settings?.widget_color || "#0B4D3C"}
                      onChange={(e) => setSettings((s) => s ? { ...s, widget_color: e.target.value } : null)}
                      className="flex-1"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>موضع الويدجت</Label>
                  <Select
                    value={settings?.widget_position || "bottom-right"}
                    onValueChange={(v) => setSettings((s) => s ? { ...s, widget_position: v } : null)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="bottom-right">أسفل يمين</SelectItem>
                      <SelectItem value="bottom-left">أسفل يسار</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button onClick={handleSaveSettings} disabled={saving}>
                {saving ? (
                  <Loader2 className="w-4 h-4 ml-2 animate-spin" />
                ) : (
                  <Save className="w-4 h-4 ml-2" />
                )}
                حفظ الإعدادات
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Knowledge Tab */}
        <TabsContent value="knowledge" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>قاعدة المعرفة</CardTitle>
                <CardDescription>المعلومات التي يستخدمها المساعد للإجابة</CardDescription>
              </div>
              <Dialog open={isKnowledgeDialogOpen} onOpenChange={setIsKnowledgeDialogOpen}>
                <DialogTrigger asChild>
                  <Button
                    onClick={() => {
                      setEditingKnowledge(null);
                      setNewKnowledge({ title: "", category: "general", content: "", keywords: "", priority: 0 });
                    }}
                  >
                    <Plus className="w-4 h-4 ml-2" />
                    إضافة معلومة
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>{editingKnowledge ? "تعديل المعلومة" : "إضافة معلومة جديدة"}</DialogTitle>
                    <DialogDescription>أضف معلومات لتحسين إجابات المساعد الذكي</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>العنوان</Label>
                        <Input
                          value={newKnowledge.title}
                          onChange={(e) => setNewKnowledge((k) => ({ ...k, title: e.target.value }))}
                          placeholder="مثال: معلومات عن ماليزيا"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>التصنيف</Label>
                        <Select
                          value={newKnowledge.category}
                          onValueChange={(v) => setNewKnowledge((k) => ({ ...k, category: v }))}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {categories.map((cat) => (
                              <SelectItem key={cat.id} value={cat.id}>
                                {cat.icon} {cat.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>المحتوى</Label>
                      <Textarea
                        value={newKnowledge.content}
                        onChange={(e) => setNewKnowledge((k) => ({ ...k, content: e.target.value }))}
                        rows={6}
                        placeholder="المعلومات التفصيلية..."
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>الكلمات المفتاحية (مفصولة بفاصلة)</Label>
                      <Input
                        value={newKnowledge.keywords}
                        onChange={(e) => setNewKnowledge((k) => ({ ...k, keywords: e.target.value }))}
                        placeholder="ماليزيا، كوالالمبور، آسيا"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsKnowledgeDialogOpen(false)}>
                      إلغاء
                    </Button>
                    <Button onClick={handleSaveKnowledge} disabled={saving}>
                      {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : "حفظ"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              {/* Filters */}
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="بحث..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pr-10"
                  />
                </div>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="التصنيف" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">جميع التصنيفات</SelectItem>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.icon} {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Table */}
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>العنوان</TableHead>
                    <TableHead>التصنيف</TableHead>
                    <TableHead>الأولوية</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredKnowledge.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{item.title}</p>
                          <p className="text-sm text-muted-foreground line-clamp-1">
                            {item.content}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">
                          {categories.find((c) => c.id === item.category)?.icon}{" "}
                          {categories.find((c) => c.id === item.category)?.name}
                        </Badge>
                      </TableCell>
                      <TableCell>{item.priority === 0 ? "عادي" : item.priority === 1 ? "مهم" : "عاجل"}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              setEditingKnowledge(item);
                              setNewKnowledge({
                                title: item.title,
                                category: item.category,
                                content: item.content,
                                keywords: item.keywords?.join(", ") || "",
                                priority: item.priority,
                              });
                              setIsKnowledgeDialogOpen(true);
                            }}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-destructive"
                            onClick={() => handleDeleteKnowledge(item.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {filteredKnowledge.length === 0 && (
                <div className="text-center py-12">
                  <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">لا توجد معلومات</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Conversations Tab */}
        <TabsContent value="conversations">
          <Card>
            <CardHeader>
              <CardTitle>سجل المحادثات</CardTitle>
              <CardDescription>مراجعة محادثات الزوار مع المساعد الذكي</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>المعرف</TableHead>
                    <TableHead>عدد الرسائل</TableHead>
                    <TableHead>الحالة</TableHead>
                    <TableHead>التاريخ</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {conversations.slice(0, 20).map((conv) => (
                    <TableRow key={conv.id}>
                      <TableCell className="font-mono text-sm">
                        {conv.session_id.slice(0, 20)}...
                      </TableCell>
                      <TableCell>{conv.messages?.length || 0}</TableCell>
                      <TableCell>
                        <Badge variant={conv.status === "active" ? "default" : "secondary"}>
                          {conv.status === "active" ? "نشط" : conv.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {new Date(conv.created_at).toLocaleDateString("ar-SA")}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {conversations.length === 0 && (
                <div className="text-center py-12">
                  <MessageSquare className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">لا توجد محادثات بعد</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminAISettings;
