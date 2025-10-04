import { Redirect } from "wouter";
import { useAuth } from "@/context/AuthContext";
import { useRequireRole } from "@/hooks/useRole";
import type { UserRole } from "@shared/schema";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: UserRole | UserRole[];
  redirectTo?: string;
}

export function ProtectedRoute({ 
  children, 
  requiredRole, 
  redirectTo 
}: ProtectedRouteProps) {
  const { user, profile, loading } = useAuth();
  const hasRequiredRole = useRequireRole(requiredRole || ["student", "vendor", "admin"]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return <Redirect to="/signin" />;
  }

  if (requiredRole && !hasRequiredRole) {
    const defaultRedirect = profile?.role === "student" 
      ? "/dashboard" 
      : profile?.role === "vendor" 
      ? "/vendors/dashboard" 
      : "/admin";
    
    return <Redirect to={redirectTo || defaultRedirect} />;
  }

  return <>{children}</>;
}
