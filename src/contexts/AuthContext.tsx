import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { onAuthChange, getUserProfile } from '@/src/firebase';
import type { User as FirebaseUser } from 'firebase/auth';
import type { User as AppUser, UserRole } from '@/src/types';
import {
  hasRole as rbacHasRole,
  isRole as rbacIsRole,
  hasPermission as rbacHasPermission,
  getPermissions,
  requiresMFA,
  isRouteAllowed,
} from '@/src/utils/rbac';

const IS_DEV = process.env.EXPO_PUBLIC_DEV_MODE === 'true';

interface AuthContextType {
  user: FirebaseUser | null;
  appUser: AppUser | null;
  loading: boolean;
  role: UserRole | null;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<void>;
  hasRole: (requiredRole: UserRole) => boolean;
  isRole: (role: UserRole) => boolean;
  hasPermission: (permission: string) => boolean;
  requiresMFA: () => boolean;
  isRouteAllowed: (allowedRoles: UserRole[]) => boolean;
  isAdmin: boolean;
  isDriver: boolean;
  isParent: boolean;
  isStudent: boolean;
  devLogin: (mockUser: AppUser) => void;
  isDevMode: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [appUser, setAppUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = async () => {
    if (user && user.uid) {
      const districtId = 'demo-district';
      const profile = await getUserProfile(districtId, user.uid);
      setAppUser(profile);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthChange(async (firebaseUser) => {
      setUser(firebaseUser);
      
      if (firebaseUser && firebaseUser.uid) {
        const districtId = 'demo-district';
        const profile = await getUserProfile(districtId, firebaseUser.uid);
        setAppUser(profile);
      } else {
        setAppUser(null);
      }
      
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signOut = async () => {
    if (IS_DEV && user?.uid?.startsWith('dev-')) {
      setUser(null);
      setAppUser(null);
      return;
    }
    const { signOut: firebaseSignOut } = await import('@/src/firebase');
    await firebaseSignOut();
    setUser(null);
    setAppUser(null);
  };

  const devLogin = (mockUser: AppUser) => {
    const devFirebaseUser = {
      uid: mockUser.id,
      email: mockUser.email,
      displayName: `${mockUser.firstName} ${mockUser.lastName}`,
      emailVerified: true,
    } as FirebaseUser;
    setUser(devFirebaseUser);
    setAppUser(mockUser);
    setLoading(false);
  };

  const currentRole = appUser?.role || null;

  return (
    <AuthContext.Provider
      value={{
        user,
        appUser,
        loading,
        role: currentRole,
        signOut,
        refreshUser,
        hasRole: (requiredRole: UserRole) =>
          currentRole ? rbacHasRole(currentRole, requiredRole) : false,
        isRole: (role: UserRole) =>
          currentRole ? rbacIsRole(currentRole, role) : false,
        hasPermission: (permission: string) =>
          currentRole ? rbacHasPermission(currentRole, permission) : false,
        requiresMFA: () =>
          currentRole ? requiresMFA(currentRole) : false,
        isRouteAllowed: (allowedRoles: UserRole[]) =>
          currentRole ? isRouteAllowed(currentRole, allowedRoles) : false,
        isAdmin: currentRole === 'admin',
        isDriver: currentRole === 'driver',
        isParent: currentRole === 'guardian',
        isStudent: currentRole === 'student',
        devLogin,
        isDevMode: IS_DEV,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
