
import { useProfile } from "@/hooks/useProfile";
import { ReactNode } from "react";

interface AdminAccessWrapperProps {
  children: ReactNode;
  fallback?: ReactNode;
}

export const AdminAccessWrapper = ({ children, fallback }: AdminAccessWrapperProps) => {
  const { profile } = useProfile();
  
  // Admin users get full access to everything
  if (profile?.role === 'admin') {
    return <>{children}</>;
  }
  
  // Non-admin users see the fallback (usually premium content blocked)
  return <>{fallback}</>;
};
