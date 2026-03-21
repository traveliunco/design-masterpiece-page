import { useState, useEffect, useRef, useContext, createContext, ReactNode } from "react";
import { User, Session, AuthError } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

export type UserRole = "admin" | "moderator" | "user" | "customer" | null;

// قائمة إيميلات الأدمن - fallback إذا فشل استعلام قاعدة البيانات
const ADMIN_EMAILS = [
  "klidmorre@gmail.com",
  "admin@traveliun.com",
  "admin@traveliun.com.sa",
];

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  userRole: UserRole;
  isAdmin: () => boolean;
  isEmployee: () => boolean;
  isStaff: () => boolean;
  signIn: (email: string, password: string) => Promise<{ error: AuthError | null }>;
  signUp: (email: string, password: string, metadata?: { firstName?: string; lastName?: string; phone?: string }) => Promise<{ error: AuthError | null }>;
  signOut: () => Promise<void>;
  signInWithGoogle: () => Promise<{ error: AuthError | null }>;
  resetPassword: (email: string) => Promise<{ error: AuthError | null }>;
  updatePassword: (newPassword: string) => Promise<{ error: AuthError | null }>;
  refreshRole: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState<UserRole>(null);
  const roleFetchedForRef = useRef<string | null>(null);

  // Fetch user role من مصادر بالأولوية:
  // 1. جدول users في Supabase
  // 2. user_metadata من Supabase Auth
  // 3. قائمة ADMIN_EMAILS كـ fallback نهائي
  const fetchUserRole = async (userId: string, email?: string, userMeta?: Record<string, unknown>): Promise<UserRole> => {
    const getFallbackRole = (): UserRole => {
      // فحص user_metadata من Supabase Auth
      if (userMeta?.role && typeof userMeta.role === "string") {
        return userMeta.role as UserRole;
      }
      // فحص ADMIN_EMAILS
      if (email && ADMIN_EMAILS.includes(email.toLowerCase())) return "admin";
      return "customer";
    };

    try {
      const { data, error } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", userId)
        .maybeSingle();

      if (error || !data) return getFallbackRole();
      return (data.role as UserRole) || getFallbackRole();
    } catch {
      return getFallbackRole();
    }
  };

  const refreshRole = async () => {
    if (user) {
      const role = await fetchUserRole(user.id, user.email || undefined);
      setUserRole(role);
    }
  };

  useEffect(() => {
    // Timeout احتياطي (3 ثوانٍ فقط)
    const timeoutId = setTimeout(() => {
      setLoading(false);
    }, 3000);

    // Get initial session — نوقف loading فور معرفة الـ session (قبل fetchUserRole)
    supabase.auth.getSession().then(({ data: { session } }) => {
      clearTimeout(timeoutId);
      setSession(session);
      setUser(session?.user ?? null);
      // ✅ أوقف loading هنا فوراً — لا ننتظر جلب الـ Role
      setLoading(false);

      // جلب الـ Role في الخلفية - مرة واحدة فقط
      if (session?.user && roleFetchedForRef.current !== session.user.id) {
        roleFetchedForRef.current = session.user.id;
        fetchUserRole(session.user.id, session.user.email || undefined).then(setUserRole);
      }
    }).catch(() => {
      clearTimeout(timeoutId);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        // ✅ أوقف loading فوراً
        setLoading(false);

        if (event === "SIGNED_IN" && session?.user) {
          // جلب الـ Role في الخلفية
          fetchUserRole(session.user.id, session.user.email || undefined).then(setUserRole);
        } else if (event === "SIGNED_OUT") {
          setUserRole(null);
        }
      }
    );

    return () => {
      clearTimeout(timeoutId);
      subscription.unsubscribe();
    };
  }, []);

  const isAdmin = () => userRole === "admin";
  const isEmployee = () => userRole === "moderator";
  const isStaff = () => userRole === "admin" || userRole === "moderator";

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error };
  };

  const signUp = async (
    email: string,
    password: string,
    metadata?: { firstName?: string; lastName?: string; phone?: string }
  ) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name: metadata?.firstName,
          last_name: metadata?.lastName,
          phone: metadata?.phone,
        },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    return { error };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUserRole(null);
  };

  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    return { error };
  };

  const resetPassword = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    return { error };
  };

  const updatePassword = async (newPassword: string) => {
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });
    return { error };
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading,
        userRole,
        isAdmin,
        isEmployee,
        isStaff,
        signIn,
        signUp,
        signOut,
        signInWithGoogle,
        resetPassword,
        updatePassword,
        refreshRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
