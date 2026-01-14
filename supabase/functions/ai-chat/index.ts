import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const DEEPSEEK_API_URL = "https://api.deepseek.com/chat/completions";

interface Message {
  role: "user" | "assistant" | "system";
  content: string;
}

interface AISettings {
  system_prompt: string;
  model: string;
  temperature: number;
  max_tokens: number;
  is_enabled: boolean;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, sessionId, userMessage } = await req.json();

    // Validate input
    if (!messages || !Array.isArray(messages)) {
      return new Response(
        JSON.stringify({ error: "Invalid messages format" }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!sessionId || typeof sessionId !== 'string') {
      return new Response(
        JSON.stringify({ error: "Session ID required" }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get the API key from secure environment
    const apiKey = Deno.env.get('DEEPSEEK_API_KEY');
    if (!apiKey) {
      console.error("DEEPSEEK_API_KEY not configured");
      return new Response(
        JSON.stringify({ 
          reply: "عذراً، خدمة الدردشة غير متاحة حالياً. يرجى التواصل معنا مباشرة.",
          conversationId: ""
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get AI settings
    const { data: settingsData } = await supabase
      .from("ai_settings")
      .select("*")
      .limit(1)
      .single();

    const settings: AISettings = settingsData || {
      system_prompt: "أنت مساعد سفر ذكي لشركة ترافليون للسياحة والسفر.",
      model: "deepseek-chat",
      temperature: 0.7,
      max_tokens: 1000,
      is_enabled: true,
    };

    if (!settings.is_enabled) {
      return new Response(
        JSON.stringify({ 
          reply: "عذراً، خدمة الدردشة غير متاحة حالياً. يرجى التواصل معنا عبر واتساب.",
          conversationId: ""
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get or create conversation
    let { data: conversation } = await supabase
      .from("ai_conversations")
      .select("*")
      .eq("session_id", sessionId)
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    if (!conversation) {
      const { data: newConv, error: createError } = await supabase
        .from("ai_conversations")
        .insert({
          session_id: sessionId,
          messages: JSON.stringify([]),
          status: "active",
        })
        .select()
        .single();

      if (createError) {
        console.error("Error creating conversation:", createError);
        return new Response(
          JSON.stringify({ 
            reply: "عذراً، حدث خطأ. يرجى تحديث الصفحة والمحاولة مرة أخرى.",
            conversationId: ""
          }),
          { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      conversation = newConv;
    }

    // Search knowledge base for context
    const { data: knowledge } = await supabase
      .from("ai_knowledge")
      .select("*")
      .eq("is_active", true)
      .order("priority", { ascending: false });

    let context = "";
    if (knowledge && userMessage) {
      const keywords = userMessage.toLowerCase().split(" ");
      const relevant = knowledge.filter((item: any) => {
        const contentLower = item.content?.toLowerCase() || "";
        const titleLower = item.title?.toLowerCase() || "";
        const itemKeywords = item.keywords?.map((k: string) => k.toLowerCase()) || [];
        
        return keywords.some(
          (kw: string) =>
            contentLower.includes(kw) ||
            titleLower.includes(kw) ||
            itemKeywords.some((ik: string) => ik.includes(kw))
        );
      });

      context = relevant
        .slice(0, 3)
        .map((k: any) => `### ${k.title}\n${k.content}`)
        .join("\n\n");
    }

    // Build system message with context
    let systemMessage = settings.system_prompt;
    if (context) {
      systemMessage += `\n\n## معلومات إضافية من قاعدة المعرفة:\n${context}`;
    }

    const allMessages = [
      { role: "system", content: systemMessage },
      ...messages,
    ];

    // Call DeepSeek API
    console.log(`Calling DeepSeek API with ${messages.length} messages`);
    
    const response = await fetch(DEEPSEEK_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: settings.model || "deepseek-chat",
        messages: allMessages,
        temperature: settings.temperature || 0.7,
        max_tokens: settings.max_tokens || 1000,
        stream: false,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`DeepSeek API error: ${response.status}`, errorText);
      return new Response(
        JSON.stringify({ 
          reply: "عذراً، حدث خطأ في الاتصال. يمكنك التواصل معنا مباشرة عبر واتساب: +966 56 922 2111",
          conversationId: conversation.id
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const data = await response.json();
    const reply = data.choices[0]?.message?.content || "عذراً، لم أتمكن من الرد. يرجى المحاولة مرة أخرى.";

    // Save conversation
    const updatedMessages = [...messages, { role: "assistant", content: reply }];
    await supabase
      .from("ai_conversations")
      .update({
        messages: JSON.stringify(updatedMessages),
        updated_at: new Date().toISOString(),
      })
      .eq("id", conversation.id);

    console.log(`Successfully processed chat for session ${sessionId}`);

    return new Response(
      JSON.stringify({ 
        reply,
        conversationId: conversation.id
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error("AI Chat error:", error);
    return new Response(
      JSON.stringify({ 
        reply: "عذراً، حدث خطأ. يمكنك التواصل معنا مباشرة عبر واتساب: +966 56 922 2111",
        conversationId: ""
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
