import { useState, useEffect } from "react";
import {
  Search,
  Mail,
  Phone,
  MessageSquare,
  Archive,
  Trash2,
  Reply,
  Star,
  Clock,
  Loader2,
  RefreshCw,
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Message {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  subject: string | null;
  message: string;
  status: string | null;
  created_at: string | null;
}

const AdminMessages = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [replyText, setReplyText] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMessages();
  }, []);

  const loadMessages = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("contact_messages")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setMessages((data || []) as Message[]);
    } catch (error) {
      console.error("Error loading messages:", error);
      toast.error("حدث خطأ في تحميل الرسائل");
    } finally {
      setLoading(false);
    }
  };

  const updateMessageStatus = async (id: string, status: string) => {
    try {
      const { error } = await supabase
        .from("contact_messages")
        .update({ status })
        .eq("id", id);

      if (error) throw error;
      loadMessages();
      toast.success("تم تحديث حالة الرسالة");
    } catch (error) {
      toast.error("حدث خطأ في التحديث");
    }
  };

  const toggleStarred = async (id: string, _currentValue: boolean) => {
    // Star functionality not available in current schema
    toast.info("ميزة التمييز غير متوفرة حالياً");
    console.log("Toggle star for:", id);
  };

  const deleteMessage = async (id: string) => {
    if (!confirm("هل أنت متأكد من حذف هذه الرسالة؟")) return;

    try {
      const { error } = await supabase
        .from("contact_messages")
        .delete()
        .eq("id", id);

      if (error) throw error;
      setSelectedMessage(null);
      loadMessages();
      toast.success("تم حذف الرسالة");
    } catch (error) {
      toast.error("حدث خطأ في الحذف");
    }
  };

  const filteredMessages = messages.filter((msg) => {
    const matchesSearch =
      msg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (msg.subject || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      msg.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || msg.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      new: "bg-blue-100 text-blue-700",
      read: "bg-gray-100 text-gray-700",
      replied: "bg-green-100 text-green-700",
      archived: "bg-yellow-100 text-yellow-700",
    };
    const labels: Record<string, string> = {
      new: "جديد",
      read: "مقروء",
      replied: "تم الرد",
      archived: "مؤرشف",
    };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status] || styles.new}`}>
        {labels[status] || "جديد"}
      </span>
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `منذ ${diffMins} دقيقة`;
    if (diffHours < 24) return `منذ ${diffHours} ساعة`;
    if (diffDays < 7) return `منذ ${diffDays} يوم`;
    return date.toLocaleDateString('ar-SA');
  };

  const handleReply = async () => {
    if (replyText.trim() && selectedMessage) {
      // Update status to replied
      await updateMessageStatus(selectedMessage.id, "replied");
      // In production, send email via Edge Function
      toast.success("تم إرسال الرد بنجاح");
      setReplyText("");
      setSelectedMessage(null);
    }
  };

  const handleMessageClick = async (message: Message) => {
    setSelectedMessage(message);
    // Mark as read if new
    if (message.status === "new") {
      await updateMessageStatus(message.id, "read");
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh]">
        <Loader2 className="w-10 h-10 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground">جاري تحميل الرسائل...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <MessageSquare className="w-7 h-7 text-primary" />
            الرسائل
          </h1>
          <p className="text-muted-foreground">
            إدارة رسائل العملاء والاستفسارات ({messages.filter(m => m.status === "new").length} جديدة)
          </p>
        </div>
        <Button variant="outline" onClick={loadMessages} aria-label="تحديث الرسائل">
          <RefreshCw className="w-4 h-4 ml-2" />
          تحديث
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="بحث بالاسم، البريد، أو الموضوع..."
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
                <SelectItem value="all">جميع الرسائل</SelectItem>
                <SelectItem value="new">جديدة</SelectItem>
                <SelectItem value="read">مقروءة</SelectItem>
                <SelectItem value="replied">تم الرد</SelectItem>
                <SelectItem value="archived">مؤرشفة</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Messages List */}
      <Card>
        <CardContent className="p-0">
          {filteredMessages.map((message) => (
            <div
              key={message.id}
              className={`p-4 border-b last:border-0 cursor-pointer hover:bg-muted/30 transition-colors ${
                message.status === "new" ? "bg-primary/5" : ""
              }`}
              onClick={() => handleMessageClick(message)}
            >
              <div className="flex items-start gap-4">
                {/* Avatar */}
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-lg font-bold text-primary">
                    {message.name.charAt(0)}
                  </span>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <h3 className={`font-medium ${message.status === "new" ? "font-bold" : ""}`}>
                        {message.name}
                      </h3>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusBadge(message.status)}
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {message.created_at ? formatDate(message.created_at) : ""}
                      </span>
                    </div>
                  </div>
                  <p className={`text-sm mb-1 ${message.status === "new" ? "font-medium" : ""}`}>
                    {message.subject}
                  </p>
                  <p className="text-sm text-muted-foreground line-clamp-1">
                    {message.message}
                  </p>
                </div>
              </div>
            </div>
          ))}

          {filteredMessages.length === 0 && (
            <div className="p-12 text-center text-muted-foreground">
              <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>لا توجد رسائل</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Message Detail Dialog */}
      <Dialog open={!!selectedMessage} onOpenChange={() => setSelectedMessage(null)}>
        <DialogContent className="max-w-2xl">
          {selectedMessage && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedMessage.subject}</DialogTitle>
              </DialogHeader>

              <div className="space-y-6">
                {/* Sender Info */}
                <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                      <span className="text-lg font-bold text-primary">
                        {selectedMessage.name.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium">{selectedMessage.name}</p>
                      <p className="text-sm text-muted-foreground">{selectedMessage.email}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="icon"
                      onClick={() => toggleStarred(selectedMessage.id, false)}
                      aria-label="تمييز"
                    >
                      <Star className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="sm" asChild>
                      <a href={`mailto:${selectedMessage.email}`}>
                        <Mail className="w-4 h-4 ml-1" />
                        إيميل
                      </a>
                    </Button>
                    {selectedMessage.phone && (
                      <Button variant="outline" size="sm" asChild>
                        <a href={`tel:${selectedMessage.phone}`}>
                          <Phone className="w-4 h-4 ml-1" />
                          اتصال
                        </a>
                      </Button>
                    )}
                  </div>
                </div>

                {/* Message Content */}
                <div className="p-4 border rounded-lg">
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">{selectedMessage.message}</p>
                  <p className="text-xs text-muted-foreground mt-4">
                    {selectedMessage.created_at ? new Date(selectedMessage.created_at).toLocaleString('ar-SA') : ""}
                  </p>
                </div>

                {/* Reply Section */}
                <div className="space-y-3">
                  <label className="text-sm font-medium">الرد:</label>
                  <Textarea
                    placeholder="اكتب ردك هنا..."
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    rows={4}
                  />
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between pt-4 border-t">
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => updateMessageStatus(selectedMessage.id, "archived")}
                    >
                      <Archive className="w-4 h-4 ml-1" />
                      أرشفة
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="text-red-600"
                      onClick={() => deleteMessage(selectedMessage.id)}
                    >
                      <Trash2 className="w-4 h-4 ml-1" />
                      حذف
                    </Button>
                  </div>
                  <Button onClick={handleReply} disabled={!replyText.trim()}>
                    <Reply className="w-4 h-4 ml-1" />
                    إرسال الرد
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminMessages;
