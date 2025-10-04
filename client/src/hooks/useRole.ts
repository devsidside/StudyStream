import { useAuth } from "@/context/AuthContext";
import type { UserRole } from "@shared/schema";

export function useRole() {
  const { profile } = useAuth();
  const role = profile?.role as UserRole | undefined;

  return {
    role: role || null,
    isStudent: role === "student",
    isVendor: role === "vendor",
    isAdmin: role === "admin",
    hasRole: !!role,
  };
}

export function useIsStudent() {
  const { isStudent } = useRole();
  return isStudent;
}

export function useIsVendor() {
  const { isVendor } = useRole();
  return isVendor;
}

export function useIsAdmin() {
  const { isAdmin } = useRole();
  return isAdmin;
}

export function useRequireRole(requiredRole: UserRole | UserRole[]) {
  const { role, hasRole } = useRole();
  if (!hasRole || !role) return false;
  const roles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
  return roles.includes(role);
}
