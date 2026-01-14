/**
 * ويدجت الذكاء الاصطناعي - ترافليون
 * مساعد سفر ذكي يعمل بـ DeepSeek
 */

import { useState, useEffect, useRef } from "react";
import {
  MessageCircle,
  X,
  Send,
  Loader2,
  Bot,
  User,
  Minimize2,
  Maximize2,
  Phone,
  ThumbsUp,
  ThumbsDown,
  RotateCcw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { chat, getAISettings, type Message, type AISettings } from "@/services/aiService";

// Generate unique session ID
const getSessionId = () => {
  let sessionId = localStorage.getItem("ai_session_id");
  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem("ai_session_id", sessionId);
  }
  return sessionId;
};

interface ChatMessage extends Message {
  id: string;
  timestamp: Date;
  isLoading?: boolean;
}

const AIChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [settings, setSettings] = useState<AISettings | null>(null);
  const [sessionId] = useState(getSessionId);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Load settings
  useEffect(() => {
    const loadSettings = async () => {
      const data = await getAISettings();
      if (data) {
        setSettings(data);
      }
    };
    loadSettings();
  }, []);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  // Add welcome message when opened for first time
  useEffect(() => {
    if (isOpen && messages.length === 0 && settings?.welcome_message) {
      setMessages([
        {
          id: "welcome",
          role: "assistant",
          content: settings.welcome_message,
          timestamp: new Date(),
        },
      ]);
    }
  }, [isOpen, settings, messages.length]);

  const handleSend = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: `user_${Date.now()}`,
      role: "user",
      content: inputValue.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    // Add loading message
    const loadingId = `loading_${Date.now()}`;
    setMessages((prev) => [
      ...prev,
      {
        id: loadingId,
        role: "assistant",
        content: "",
        timestamp: new Date(),
        isLoading: true,
      },
    ]);

    try {
      const { reply } = await chat(userMessage.content, sessionId);

      // Replace loading message with actual response
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === loadingId
            ? {
                ...msg,
                content: reply,
                isLoading: false,
              }
            : msg
        )
      );
    } catch (error) {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === loadingId
            ? {
                ...msg,
                content: "عذراً، حدث خطأ. يرجى المحاولة مرة أخرى.",
                isLoading: false,
              }
            : msg
        )
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleReset = () => {
    localStorage.removeItem("ai_session_id");
    setMessages([]);
    if (settings?.welcome_message) {
      setMessages([
        {
          id: "welcome",
          role: "assistant",
          content: settings.welcome_message,
          timestamp: new Date(),
        },
      ]);
    }
  };

  // Quick replies
  const quickReplies = [
    "ما هي أفضل الوجهات السياحية؟",
    "أريد حجز رحلة طيران",
    "ما هي البرامج السياحية المتاحة؟",
    "كيف يمكنني التواصل معكم؟",
  ];

  if (!settings?.is_enabled) return null;

  return (
    <>
      {/* Chat Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed z-50 transition-all duration-300 ${
          isOpen ? "scale-0 opacity-0" : "scale-100 opacity-100"
        }`}
        style={{
          bottom: "24px",
          right: "24px",
          backgroundColor: settings?.widget_color || "#0B4D3C",
        }}
        aria-label="فتح المساعد الذكي"
      >
        <div className="relative">
          <div className="w-14 h-14 rounded-full flex items-center justify-center text-white shadow-lg hover:shadow-xl transition-shadow">
            <MessageCircle className="w-6 h-6" />
          </div>
          {/* Pulse animation */}
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-secondary rounded-full animate-ping" />
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-secondary rounded-full" />
        </div>
      </button>

      {/* Chat Window */}
      <div
        className={`fixed z-50 transition-all duration-300 ${
          isOpen ? "scale-100 opacity-100" : "scale-95 opacity-0 pointer-events-none"
        } ${
          isExpanded
            ? "inset-4 md:inset-8"
            : "bottom-4 right-4 w-[380px] h-[600px] max-h-[80vh]"
        }`}
      >
        <div className="bg-background rounded-2xl shadow-2xl border flex flex-col h-full overflow-hidden">
          {/* Header */}
          <div
            className="p-4 text-white flex items-center justify-between"
            style={{ backgroundColor: settings?.widget_color || "#0B4D3C" }}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                <Bot className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold">مساعد ترافليون</h3>
                <p className="text-xs text-white/70">متاح الآن للمساعدة</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={handleReset}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                title="بدء محادثة جديدة"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors hidden md:block"
                title={isExpanded ? "تصغير" : "تكبير"}
              >
                {isExpanded ? (
                  <Minimize2 className="w-4 h-4" />
                ) : (
                  <Maximize2 className="w-4 h-4" />
                )}
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                title="إغلاق"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <ScrollArea className="flex-1 p-4" ref={scrollRef}>
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-3 ${
                    message.role === "user" ? "flex-row-reverse" : ""
                  }`}
                >
                  {/* Avatar */}
                  <div
                    className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center ${
                      message.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted"
                    }`}
                  >
                    {message.role === "user" ? (
                      <User className="w-4 h-4" />
                    ) : (
                      <Bot className="w-4 h-4" />
                    )}
                  </div>

                  {/* Message Bubble */}
                  <div
                    className={`max-w-[80%] rounded-2xl p-3 ${
                      message.role === "user"
                        ? "bg-primary text-primary-foreground rounded-tr-sm"
                        : "bg-muted rounded-tl-sm"
                    }`}
                  >
                    {message.isLoading ? (
                      <div className="flex items-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span className="text-sm">جاري الكتابة...</span>
                      </div>
                    ) : (
                      <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                    )}
                  </div>
                </div>
              ))}

              {/* Quick Replies (show only at start) */}
              {messages.length <= 1 && (
                <div className="flex flex-wrap gap-2 mt-4">
                  {quickReplies.map((reply, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setInputValue(reply);
                        setTimeout(() => handleSend(), 100);
                      }}
                      className="text-xs bg-muted hover:bg-muted/80 px-3 py-2 rounded-full transition-colors"
                    >
                      {reply}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </ScrollArea>

          {/* Input */}
          <div className="p-4 border-t">
            <div className="flex items-center gap-2">
              <Input
                ref={inputRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="اكتب رسالتك..."
                className="flex-1 rounded-full"
                disabled={isLoading}
              />
              <Button
                onClick={handleSend}
                disabled={!inputValue.trim() || isLoading}
                size="icon"
                className="rounded-full"
                style={{ backgroundColor: settings?.widget_color || "#0B4D3C" }}
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </Button>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between mt-3 text-xs text-muted-foreground">
              <span>مدعوم بالذكاء الاصطناعي</span>
              <a
                href="https://api.whatsapp.com/send?phone=966569222111"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 hover:text-primary transition-colors"
              >
                <Phone className="w-3 h-3" />
                تحدث مع شخص حقيقي
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AIChat;
