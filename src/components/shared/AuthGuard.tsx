import { ReactNode, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/stores/auth';

interface AuthGuardProps {
  children: ReactNode;
  requireVerified?: boolean;
}

const AuthGuard = ({ children, requireVerified = false }: AuthGuardProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, isEmailVerified } = useAuthStore();

  useEffect(() => {
    if (!isAuthenticated) {
      // Redirect to login with return path
      navigate(`/login?redirect=${encodeURIComponent(location.pathname)}`, { replace: true });
      return;
    }

    if (requireVerified && !isEmailVerified) {
      // Redirect to verify OTP page
      navigate('/verify-otp', { replace: true });
      return;
    }
  }, [isAuthenticated, isEmailVerified, requireVerified, navigate, location.pathname]);

  // Don't render children until auth check is complete
  if (!isAuthenticated || (requireVerified && !isEmailVerified)) {
    return null;
  }

  return <>{children}</>;
};

export default AuthGuard;