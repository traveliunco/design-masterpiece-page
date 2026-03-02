import { useState, useEffect, useContext, createContext, ReactNode } from "react";
import { User, Session, AuthError } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

export type UserRole = "admin" | "moderator" | "user" | null;

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

  // Fetch user role from user_roles table (secure)
  const fetchUserRole = async (userId: string): Promise<UserRole> => {
    try {
      const { data, error } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", userId)
        .single();

      if (error || !data) return "user";
      return (data.role as UserRole) || "user";
    } catch {
      return "user";
    }
  };

  const refreshRole = async () => {
    if (user) {
      const role = await fetchUserRole(user.id);
      setUserRole(role);
    }
  };

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        const role = await fetchUserRole(session.user.id);
        setUserRole(role);
      }
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);

        if (event === "SIGNED_IN" && session?.user) {
          const role = await fetchUserRole(session.user.id);
          setUserRole(role);
        } else if (event === "SIGNED_OUT") {
          setUserRole(null);
        }

        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
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
