import type { UserRole } from '@/src/types';

const ROLE_HIERARCHY: Record<UserRole, number> = {
  student: 1,
  guardian: 2,
  driver: 3,
  admin: 4,
};

const ROLE_PERMISSIONS: Record<UserRole, string[]> = {
  admin: [
    'students:read',
    'students:write',
    'students:delete',
    'routes:read',
    'routes:write',
    'routes:delete',
    'reports:read',
    'reports:export',
    'bus:read',
    'bus:write',
    'scan:read',
    'users:manage',
    'guardians:invite',
    'guardians:manage',
  ],
  driver: [
    'students:read',
    'routes:read',
    'reports:read',
    'bus:read',
    'bus:write:location',
    'scan:perform',
    'scan:override',
  ],
  guardian: [
    'students:read:own',
    'routes:read:own',
    'bus:track:own',
    'scan:read:own',
  ],
  student: [
    'students:read:self',
    'routes:read:own',
    'bus:track:own',
  ],
};

export const getRoleLevel = (role: UserRole): number => {
  return ROLE_HIERARCHY[role];
};

export const hasRole = (userRole: UserRole, requiredRole: UserRole): boolean => {
  return getRoleLevel(userRole) >= getRoleLevel(requiredRole);
};

export const isRole = (userRole: UserRole, role: UserRole): boolean => {
  return userRole === role;
};

export const hasPermission = (userRole: UserRole, permission: string): boolean => {
  const userPermissions = ROLE_PERMISSIONS[userRole];
  return userPermissions.includes(permission);
};

export const getPermissions = (role: UserRole): string[] => {
  return [...ROLE_PERMISSIONS[role]];
};

export const requiresMFA = (role: UserRole): boolean => {
  return role === 'admin' || role === 'guardian';
};

export const isRouteAllowed = (
  userRole: UserRole,
  allowedRoles: UserRole[]
): boolean => {
  return allowedRoles.includes(userRole);
};
