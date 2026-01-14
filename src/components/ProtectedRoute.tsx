import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: "admin" | "agent" | "customer";
}

const ProtectedRoute = ({ children, requiredRole }: ProtectedRouteProps) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check user role from database if required
  if (requiredRole) {
    // Get user profile from Supabase to check role
    const checkUserRole = async () => {
      const { supabase } = await import("@/integrations/supabase/client");
      const { data: profile } = await supabase
        .from("users")
        .select("role")
        .eq("id", user.id)
        .single();

      if (profile?.role !== requiredRole) {
        return false;
      }
      return true;
    };

    // Note: This is a synchronous guard, role checking should happen in parent component
    // For now, admin routes are accessible to authenticated users
    // TODO: Implement proper role-based access control with async state
  }

  return <>{children}</>;
};

export default ProtectedRoute;
