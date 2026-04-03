import { useEffect, type ReactNode } from 'react';
import { useRouter, usePathname } from 'expo-router';
import { useAuth } from '@/src/contexts';
import type { UserRole } from '@/src/types';

interface UseRouteGuardOptions {
  allowedRoles: UserRole[];
  redirectPath?: string;
  requireMFA?: boolean;
}

const IS_DEV = process.env.EXPO_PUBLIC_DEV_MODE === 'true';

export const useRouteGuard = (options: UseRouteGuardOptions) => {
  const { allowedRoles, redirectPath = '/(tabs)/index', requireMFA = false } = options;
  const { user, appUser, role, isRouteAllowed, requiresMFA } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!user || !appUser) {
      router.replace('/(auth)/login' as any);
      return;
    }

    if (!isRouteAllowed(allowedRoles)) {
      router.replace((redirectPath || '/(tabs)/index') as any);
      return;
    }

    if (!IS_DEV && requireMFA && requiresMFA() && !appUser.mfaVerified) {
      router.replace('/(auth)/mfa-setup' as any);
      return;
    }
  }, [user, appUser, role, pathname]);

  const isAuthorized = user && appUser && isRouteAllowed(allowedRoles);
  const isMFARequired = !IS_DEV && requireMFA && requiresMFA() && appUser?.mfaVerified === false;

  return { isAuthorized, isMFARequired, isLoading: !user || !appUser };
};

export const ProtectedRoute = ({
  children,
  allowedRoles,
  redirectPath,
  requireMFA,
}: {
  children: ReactNode;
  allowedRoles: UserRole[];
  redirectPath?: string;
  requireMFA?: boolean;
}) => {
  const { isAuthorized, isMFARequired, isLoading } = useRouteGuard({
    allowedRoles,
    redirectPath,
    requireMFA,
  });

  if (isLoading) {
    return null;
  }

  if (!isAuthorized || isMFARequired) {
    return null;
  }

  return <>{children}</>;
};
