/**
 * خدمة الذكاء الاصطناعي - DeepSeek API
 */

import { supabase } from "@/integrations/supabase/client";

// AI chat is now handled by Edge Function for security

export interface Message {
  role: "user" | "assistant" | "system";
  content: string;
}

export interface AISettings {
  id: string;
  is_enabled: boolean;
  welcome_message: string;
  system_prompt: string;
  model: string;
  temperature: number;
  max_tokens: number;
  widget_position: string;
  widget_color: string;
  avatar_url?: string;
}

export interface AIKnowledge {
  id: string;
  title: string;
  category: string;
  content: string;
  keywords: string[];
  priority: number;
}

export interface Conversation {
  id: string;
  session_id: string;
  messages: Message[];
  status: string;
  created_at: string;
}

// =====================================================
// Settings
// =====================================================

export async function getAISettings(): Promise<AISettings | null> {
  const { data, error } = await supabase
    .from("ai_settings")
    .select("*")
    .limit(1)
    .single();

  if (error) {
    console.error("Error fetching AI settings:", error);
    return null;
  }
  return data;
}

export async function updateAISettings(updates: Partial<AISettings>): Promise<AISettings | null> {
  const settings = await getAISettings();
  if (!settings) return null;

  const { data, error } = await supabase
    .from("ai_settings")
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq("id", settings.id)
    .select()
    .single();

  if (error) {
    console.error("Error updating AI settings:", error);
    return null;
  }
  return data;
}

// =====================================================
// Knowledge Base
// =====================================================

export async function getKnowledge(category?: string): Promise<AIKnowledge[]> {
  let query = supabase
    .from("ai_knowledge")
    .select("*")
    .eq("is_active", true)
    .order("priority", { ascending: false });

  if (category) {
    query = query.eq("category", category);
  }

  const { data, error } = await query;
  if (error) {
    console.error("Error fetching knowledge:", error);
    return [];
  }
  return data || [];
}

export async function searchKnowledge(query: string): Promise<AIKnowledge[]> {
  const keywords = query.toLowerCase().split(" ");
  
  const { data, error } = await supabase
    .from("ai_knowledge")
    .select("*")
    .eq("is_active", true)
    .order("priority", { ascending: false });

  if (error || !data) return [];

  // Filter by keywords match
  return data.filter((item) => {
    const contentLower = item.content.toLowerCase();
    const titleLower = item.title.toLowerCase();
    const itemKeywords = item.keywords?.map((k: string) => k.toLowerCase()) || [];
    
    return keywords.some(
      (kw) =>
        contentLower.includes(kw) ||
        titleLower.includes(kw) ||
        itemKeywords.some((ik: string) => ik.includes(kw))
    );
  });
}

export async function addKnowledge(knowledge: Omit<AIKnowledge, 'id'> & { id?: string }): Promise<AIKnowledge | null> {
  const insertData = {
    title: knowledge.title,
    category: knowledge.category,
    content: knowledge.content,
    keywords: knowledge.keywords,
    priority: knowledge.priority,
  };
  
  const { data, error } = await supabase
    .from("ai_knowledge")
    .insert([insertData])
    .select()
    .single();

  if (error) {
    console.error("Error adding knowledge:", error);
    return null;
  }
  return data as AIKnowledge;
}

export async function updateKnowledge(id: string, updates: Partial<AIKnowledge>): Promise<AIKnowledge | null> {
  const { data, error } = await supabase
    .from("ai_knowledge")
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Error updating knowledge:", error);
    return null;
  }
  return data;
}

export async function deleteKnowledge(id: string): Promise<boolean> {
  const { error } = await supabase
    .from("ai_knowledge")
    .update({ is_active: false })
    .eq("id", id);

  return !error;
}

// =====================================================
// Conversations
// =====================================================

export async function createConversation(sessionId: string): Promise<Conversation | null> {
  const { data, error } = await supabase
    .from("ai_conversations")
    .insert({
      session_id: sessionId,
      messages: JSON.stringify([]),
      status: "active",
    })
    .select()
    .single();

  if (error) {
    console.error("Error creating conversation:", error);
    return null;
  }
  
  return {
    ...data,
    messages: JSON.parse(data.messages as string || '[]') as Message[],
  } as Conversation;
}

export async function getConversation(sessionId: string): Promise<Conversation | null> {
  const { data, error } = await supabase
    .from("ai_conversations")
    .select("*")
    .eq("session_id", sessionId)
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  if (error) return null;
  
  return {
    ...data,
    messages: (typeof data.messages === 'string' ? JSON.parse(data.messages) : data.messages || []) as Message[],
  } as Conversation;
}

export async function updateConversation(
  id: string,
  messages: Message[]
): Promise<Conversation | null> {
  const { data, error } = await supabase
    .from("ai_conversations")
    .update({
      messages: JSON.stringify(messages),
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Error updating conversation:", error);
    return null;
  }
  
  return {
    ...data,
    messages: (typeof data.messages === 'string' ? JSON.parse(data.messages) : data.messages || []) as Message[],
  } as Conversation;
}

// DeepSeek API calls are now handled by the secure Edge Function
// This prevents API key exposure in client-side code

// =====================================================
// Main Chat Function (Uses Edge Function)
// =====================================================

export async function chat(
  userMessage: string,
  sessionId: string
): Promise<{ reply: string; conversationId: string }> {
  try {
    // Get or create conversation for messages
    let conversation = await getConversation(sessionId);
    if (!conversation) {
      conversation = await createConversation(sessionId);
    }

    // Build messages array
    const messages: Message[] = conversation 
      ? [...(conversation.messages || []), { role: "user", content: userMessage }]
      : [{ role: "user", content: userMessage }];

    // Call secure Edge Function
    const { data, error } = await supabase.functions.invoke('ai-chat', {
      body: { 
        messages,
        sessionId,
        userMessage 
      }
    });

    if (error) {
      console.error("Edge function error:", error);
      return {
        reply: "عذراً، حدث خطأ في الاتصال. يمكنك التواصل معنا مباشرة عبر واتساب: +966 56 922 2111",
        conversationId: conversation?.id || "",
      };
    }

    return {
      reply: data?.reply || "عذراً، لم أتمكن من الرد.",
      conversationId: data?.conversationId || conversation?.id || "",
    };
  } catch (error) {
    console.error("Chat error:", error);
    return {
      reply: "عذراً، حدث خطأ. يرجى المحاولة مرة أخرى.",
      conversationId: "",
    };
  }
}

// =====================================================
// Admin Functions
// =====================================================

export async function getAllConversations(limit = 50): Promise<Conversation[]> {
  const { data, error } = await supabase
    .from("ai_conversations")
    .select("*")
    .order("updated_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("Error fetching conversations:", error);
    return [];
  }
  
  return (data || []).map(item => ({
    ...item,
    messages: (typeof item.messages === 'string' ? JSON.parse(item.messages) : item.messages || []) as Message[],
  })) as Conversation[];
}

export async function getConversationStats() {
  const { data: total } = await supabase
    .from("ai_conversations")
    .select("id", { count: "exact" });

  const { data: today } = await supabase
    .from("ai_conversations")
    .select("id", { count: "exact" })
    .gte("created_at", new Date().toISOString().split("T")[0]);

  return {
    total: total?.length || 0,
    today: today?.length || 0,
  };
}
