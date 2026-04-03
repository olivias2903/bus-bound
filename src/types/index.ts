export type UserRole = 'admin' | 'driver' | 'guardian' | 'student';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  districtId: string;
  phone?: string;
  mfaEnabled: boolean;
  mfaVerified: boolean;
  mfaPhoneNumber?: string;
  isActive: boolean;
  assignedRouteId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Student {
  id: string;
  districtId: string;
  firstName: string;
  lastName: string;
  grade: string;
  studentId: string;
  schoolEmail?: string;
  barcode: string;
  routeIds: string[];
  busId?: string;
  guardianIds: string[];
  photoUrl?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Guardian {
  id: string;
  districtId: string;
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  studentIds: string[];
  inviteStatus: 'pending' | 'accepted';
  inviteToken?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Bus {
  id: string;
  districtId: string;
  busNumber: string;
  plateNumber: string;
  capacity: number;
  status: 'active' | 'maintenance';
  currentRouteId?: string;
  driverId?: string;
  currentLocation?: GeoPoint;
  lastLocationUpdate?: Date;
  isSubstitute: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Route {
  id: string;
  districtId: string;
  name: string;
  routeType: 'morning' | 'afternoon';
  busId?: string;
  driverId?: string;
  stops: RouteStop[];
  studentIds: string[];
  estimatedDuration: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface RouteStop {
  id: string;
  name: string;
  location: GeoPoint;
  order: number;
  studentIds: string[];
}

export interface ScanLog {
  id: string;
  districtId: string;
  studentId: string;
  busId: string;
  routeId: string;
  driverId: string;
  scanType: ScanType;
  action: ScanAction;
  timestamp: Date;
  location?: GeoPoint;
  synced: boolean;
}

export type ScanType = 'boarding' | 'exit';
export type ScanAction = 'accepted' | 'denied' | 'manual_override';

export interface GeoPoint {
  latitude: number;
  longitude: number;
}

export interface GuardianInvite {
  id: string;
  districtId: string;
  studentId: string;
  guardianEmail: string;
  token: string;
  status: 'pending' | 'accepted' | 'expired';
  expiresAt: Date;
  createdBy: string;
  createdAt: Date;
}
