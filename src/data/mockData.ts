import type {
  Bus,
  Guardian,
  GuardianInvite,
  Route,
  RouteStop,
  ScanLog,
  Student,
  User,
} from '@/src/types';

// ============================================================
// ADMIN
// ============================================================

export const MOCK_ADMIN: User = {
  id: 'admin-1',
  email: 'admin@busbound.demo',
  firstName: 'Sarah',
  lastName: 'Mitchell',
  role: 'admin',
  districtId: 'demo-district',
  mfaEnabled: true,
  mfaVerified: true,
  mfaPhoneNumber: '+15551234567',
  isActive: true,
  createdAt: new Date('2025-01-01'),
  updatedAt: new Date('2025-01-01'),
};

// ============================================================
// DRIVERS (one per route)
// ============================================================

export const MOCK_DRIVERS: User[] = [
  {
    id: 'driver-1',
    email: 'driver1@busbound.demo',
    firstName: 'Marcus',
    lastName: 'Thompson',
    role: 'driver',
    districtId: 'demo-district',
    phone: '+15559876543',
    mfaEnabled: false,
    mfaVerified: false,
    isActive: true,
    assignedRouteId: 'route-1',
    createdAt: new Date('2025-01-15'),
    updatedAt: new Date('2025-01-15'),
  },
  {
    id: 'driver-2',
    email: 'driver2@busbound.demo',
    firstName: 'Diana',
    lastName: 'Reyes',
    role: 'driver',
    districtId: 'demo-district',
    phone: '+15559876544',
    mfaEnabled: false,
    mfaVerified: false,
    isActive: true,
    assignedRouteId: 'route-2',
    createdAt: new Date('2025-01-15'),
    updatedAt: new Date('2025-01-15'),
  },
];

// ============================================================
// STUDENTS
// ============================================================

export const MOCK_STUDENTS: Student[] = [
  {
    id: 'student-1',
    districtId: 'demo-district',
    firstName: 'James',
    lastName: 'Johnson',
    grade: '3rd',
    studentId: 'STU001',
    schoolEmail: 'James.johnson@demo-school.edu',
    barcode: 'BUS-STU001-ABCD1234',
    routeIds: ['route-1'],
    busId: 'bus-1',
    guardianIds: ['guardian-1'],
    photoUrl: undefined,
    isActive: true,
    createdAt: new Date('2025-02-01'),
    updatedAt: new Date('2025-02-01'),
  },
  {
    id: 'student-2',
    districtId: 'demo-district',
    firstName: 'Liam',
    lastName: 'Williams',
    grade: '1st',
    studentId: 'STU002',
    schoolEmail: 'liam.williams@demo-school.edu',
    barcode: 'BUS-STU002-EFGH5678',
    routeIds: ['route-1'],
    busId: 'bus-1',
    guardianIds: ['guardian-1'],
    photoUrl: undefined,
    isActive: true,
    createdAt: new Date('2025-02-01'),
    updatedAt: new Date('2025-02-01'),
  },
  {
    id: 'student-3',
    districtId: 'demo-district',
    firstName: 'Olivia',
    lastName: 'Brown',
    grade: '5th',
    studentId: 'STU003',
    schoolEmail: 'olivia.brown@demo-school.edu',
    barcode: 'BUS-STU003-IJKL9012',
    routeIds: ['route-2'],
    busId: 'bus-2',
    guardianIds: ['guardian-2'],
    photoUrl: undefined,
    isActive: true,
    createdAt: new Date('2025-02-01'),
    updatedAt: new Date('2025-02-01'),
  },
  {
    id: 'student-4',
    districtId: 'demo-district',
    firstName: 'Noah',
    lastName: 'Davis',
    grade: '4th',
    studentId: 'STU004',
    schoolEmail: 'noah.davis@demo-school.edu',
    barcode: 'BUS-STU004-MNOP3456',
    routeIds: ['route-1'],
    busId: 'bus-1',
    guardianIds: ['guardian-3'],
    photoUrl: undefined,
    isActive: true,
    createdAt: new Date('2025-02-01'),
    updatedAt: new Date('2025-02-01'),
  },
  {
    id: 'student-5',
    districtId: 'demo-district',
    firstName: 'Ava',
    lastName: 'Martinez',
    grade: '2nd',
    studentId: 'STU005',
    schoolEmail: 'ava.martinez@demo-school.edu',
    barcode: 'BUS-STU005-QRST7890',
    routeIds: ['route-2'],
    busId: 'bus-2',
    guardianIds: [],
    photoUrl: undefined,
    isActive: true,
    createdAt: new Date('2025-02-01'),
    updatedAt: new Date('2025-02-01'),
  },
];

// ============================================================
// GUARDIANS
// ============================================================

export const MOCK_GUARDIANS: Guardian[] = [
  {
    id: 'guardian-1',
    districtId: 'demo-district',
    userId: 'guardian-user-1',
    firstName: 'Jennifer',
    lastName: 'Johnson',
    email: 'jennifer.johnson@email.com',
    phone: '+15551112222',
    studentIds: ['student-1', 'student-2'],
    inviteStatus: 'accepted',
    createdAt: new Date('2025-02-01'),
    updatedAt: new Date('2025-02-01'),
  },
  {
    id: 'guardian-2',
    districtId: 'demo-district',
    userId: 'guardian-user-2',
    firstName: 'Carlos',
    lastName: 'Brown',
    email: 'carlos.brown@email.com',
    phone: '+15553334444',
    studentIds: ['student-3'],
    inviteStatus: 'accepted',
    createdAt: new Date('2025-02-01'),
    updatedAt: new Date('2025-02-01'),
  },
  {
    id: 'guardian-3',
    districtId: 'demo-district',
    userId: 'guardian-user-3',
    firstName: 'Robert',
    lastName: 'Davis',
    email: 'robert.davis@email.com',
    phone: '+15555556666',
    studentIds: ['student-4'],
    inviteStatus: 'accepted',
    createdAt: new Date('2025-02-01'),
    updatedAt: new Date('2025-02-01'),
  },
  {
    id: 'guardian-4',
    districtId: 'demo-district',
    userId: '',
    firstName: 'Maria',
    lastName: 'Martinez',
    email: 'maria.martinez@email.com',
    phone: '+15557778888',
    studentIds: [],
    inviteStatus: 'pending',
    inviteToken: 'invite-token-martinez-001',
    createdAt: new Date('2025-03-01'),
    updatedAt: new Date('2025-03-01'),
  },
  {
    id: 'guardian-5',
    districtId: 'demo-district',
    userId: '',
    firstName: 'James',
    lastName: 'Wilson',
    email: 'james.wilson@email.com',
    phone: '+15559990000',
    studentIds: [],
    inviteStatus: 'pending',
    inviteToken: 'invite-token-wilson-001',
    createdAt: new Date('2025-03-01'),
    updatedAt: new Date('2025-03-01'),
  },
];

// ============================================================
// BUSES
// ============================================================

export const MOCK_BUSES: Bus[] = [
  {
    id: 'bus-1',
    districtId: 'demo-district',
    busNumber: '45',
    plateNumber: 'ABC-1234',
    capacity: 40,
    status: 'active',
    currentRouteId: 'route-1',
    driverId: 'driver-1',
    currentLocation: { latitude: 40.7128, longitude: -74.006 },
    lastLocationUpdate: new Date('2025-03-01T08:00:00Z'),
    isSubstitute: false,
    createdAt: new Date('2025-01-01'),
    updatedAt: new Date('2025-01-01'),
  },
  {
    id: 'bus-2',
    districtId: 'demo-district',
    busNumber: '32',
    plateNumber: 'XYZ-5678',
    capacity: 35,
    status: 'active',
    currentRouteId: 'route-2',
    driverId: 'driver-2',
    currentLocation: { latitude: 40.72, longitude: -74.01 },
    lastLocationUpdate: new Date('2025-03-01T08:05:00Z'),
    isSubstitute: false,
    createdAt: new Date('2025-01-01'),
    updatedAt: new Date('2025-01-01'),
  },
  {
    id: 'bus-3',
    districtId: 'demo-district',
    busNumber: '18',
    plateNumber: 'DEF-9012',
    capacity: 40,
    status: 'maintenance',
    isSubstitute: false,
    createdAt: new Date('2025-01-01'),
    updatedAt: new Date('2025-01-01'),
  },
];

// ============================================================
// ROUTES
// ============================================================

export const MOCK_ROUTE_STOPS_1: RouteStop[] = [
  {
    id: 'stop-1',
    name: 'Maple Street & 5th Ave',
    location: { latitude: 40.713, longitude: -74.005 },
    order: 1,
    studentIds: ['student-1', 'student-2'],
  },
  {
    id: 'stop-2',
    name: 'Oak Avenue Park',
    location: { latitude: 40.714, longitude: -74.007 },
    order: 2,
    studentIds: ['student-4'],
  },
  {
    id: 'stop-3',
    name: 'Pine Road Community Center',
    location: { latitude: 40.716, longitude: -74.009 },
    order: 3,
    studentIds: [],
  },
  {
    id: 'stop-4',
    name: 'Cedar Lane Library',
    location: { latitude: 40.718, longitude: -74.011 },
    order: 4,
    studentIds: [],
  },
  {
    id: 'stop-5',
    name: 'Lincoln Elementary School',
    location: { latitude: 40.72, longitude: -74.013 },
    order: 5,
    studentIds: ['student-1', 'student-2', 'student-4'],
  },
];

export const MOCK_ROUTE_STOPS_2: RouteStop[] = [
  {
    id: 'stop-6',
    name: 'Elm Street Plaza',
    location: { latitude: 40.71, longitude: -74.002 },
    order: 1,
    studentIds: ['student-3'],
  },
  {
    id: 'stop-7',
    name: 'Birch Court',
    location: { latitude: 40.711, longitude: -74.004 },
    order: 2,
    studentIds: ['student-5'],
  },
  {
    id: 'stop-8',
    name: 'Willow Drive',
    location: { latitude: 40.713, longitude: -74.006 },
    order: 3,
    studentIds: [],
  },
  {
    id: 'stop-9',
    name: 'Lincoln Elementary School',
    location: { latitude: 40.72, longitude: -74.013 },
    order: 4,
    studentIds: ['student-3', 'student-5'],
  },
];

export const MOCK_ROUTES: Route[] = [
  {
    id: 'route-1',
    districtId: 'demo-district',
    name: 'Route 1 - North Morning',
    routeType: 'morning',
    busId: 'bus-1',
    driverId: 'driver-1',
    stops: MOCK_ROUTE_STOPS_1,
    studentIds: ['student-1', 'student-2', 'student-4'],
    estimatedDuration: 45,
    isActive: true,
    createdAt: new Date('2025-01-01'),
    updatedAt: new Date('2025-01-01'),
  },
  {
    id: 'route-2',
    districtId: 'demo-district',
    name: 'Route 2 - South Afternoon',
    routeType: 'afternoon',
    busId: 'bus-2',
    driverId: 'driver-2',
    stops: MOCK_ROUTE_STOPS_2,
    studentIds: ['student-3', 'student-5'],
    estimatedDuration: 35,
    isActive: true,
    createdAt: new Date('2025-01-01'),
    updatedAt: new Date('2025-01-01'),
  },
];

// ============================================================
// SCAN LOGS
// ============================================================

export const MOCK_SCAN_LOGS: ScanLog[] = [
  {
    id: 'scan-1',
    districtId: 'demo-district',
    studentId: 'student-1',
    busId: 'bus-1',
    routeId: 'route-1',
    driverId: 'driver-1',
    scanType: 'boarding',
    action: 'accepted',
    timestamp: new Date(Date.now() - 3600000),
    location: { latitude: 40.713, longitude: -74.005 },
    synced: true,
  },
  {
    id: 'scan-2',
    districtId: 'demo-district',
    studentId: 'student-2',
    busId: 'bus-1',
    routeId: 'route-1',
    driverId: 'driver-1',
    scanType: 'boarding',
    action: 'accepted',
    timestamp: new Date(Date.now() - 3500000),
    location: { latitude: 40.713, longitude: -74.005 },
    synced: true,
  },
  {
    id: 'scan-3',
    districtId: 'demo-district',
    studentId: 'student-4',
    busId: 'bus-1',
    routeId: 'route-1',
    driverId: 'driver-1',
    scanType: 'boarding',
    action: 'manual_override',
    timestamp: new Date(Date.now() - 3400000),
    location: { latitude: 40.714, longitude: -74.007 },
    synced: true,
  },
  {
    id: 'scan-4',
    districtId: 'demo-district',
    studentId: 'student-3',
    busId: 'bus-2',
    routeId: 'route-2',
    driverId: 'driver-2',
    scanType: 'boarding',
    action: 'accepted',
    timestamp: new Date(Date.now() - 1800000),
    location: { latitude: 40.71, longitude: -74.002 },
    synced: true,
  },
  {
    id: 'scan-5',
    districtId: 'demo-district',
    studentId: 'student-5',
    busId: 'bus-2',
    routeId: 'route-2',
    driverId: 'driver-2',
    scanType: 'exit',
    action: 'accepted',
    timestamp: new Date(Date.now() - 600000),
    location: { latitude: 40.72, longitude: -74.013 },
    synced: true,
  },
];

// ============================================================
// GUARDIAN INVITES
// ============================================================

export const MOCK_GUARDIAN_INVITES: GuardianInvite[] = [
  {
    id: 'invite-1',
    districtId: 'demo-district',
    studentId: 'student-5',
    guardianEmail: 'maria.martinez@email.com',
    token: 'invite-token-martinez-001',
    status: 'pending',
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    createdBy: 'admin-1',
    createdAt: new Date('2025-03-01'),
  },
  {
    id: 'invite-2',
    districtId: 'demo-district',
    studentId: 'student-5',
    guardianEmail: 'james.wilson@email.com',
    token: 'invite-token-wilson-001',
    status: 'pending',
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    createdBy: 'admin-1',
    createdAt: new Date('2025-03-01'),
  },
];

// ============================================================
// HELPER MAPS
// ============================================================

export const STUDENTS_BY_ID = MOCK_STUDENTS.reduce(
  (acc, s) => ({ ...acc, [s.id]: s }),
  {} as Record<string, Student>
);

export const STUDENTS_BY_BARCODE = MOCK_STUDENTS.reduce(
  (acc, s) => ({ ...acc, [s.barcode]: s }),
  {} as Record<string, Student>
);

export const USERS_BY_ID: Record<string, User> = {
  [MOCK_ADMIN.id]: MOCK_ADMIN,
  ...MOCK_DRIVERS.reduce((acc, d) => ({ ...acc, [d.id]: d }), {} as Record<string, User>),
};

export const BUSES_BY_ID = MOCK_BUSES.reduce(
  (acc, b) => ({ ...acc, [b.id]: b }),
  {} as Record<string, Bus>
);

export const ROUTES_BY_ID = MOCK_ROUTES.reduce(
  (acc, r) => ({ ...acc, [r.id]: r }),
  {} as Record<string, Route>
);

export const GUARDIANS_BY_ID = MOCK_GUARDIANS.reduce(
  (acc, g) => ({ ...acc, [g.id]: g }),
  {} as Record<string, Guardian>
);

export const GUARDIAN_INVITES_BY_TOKEN = MOCK_GUARDIAN_INVITES.reduce(
  (acc, i) => ({ ...acc, [i.token]: i }),
  {} as Record<string, GuardianInvite>
);

export const SCAN_LOGS_BY_STUDENT = MOCK_SCAN_LOGS.reduce(
  (acc, log) => {
    if (!acc[log.studentId]) acc[log.studentId] = [];
    acc[log.studentId].push(log);
    return acc;
  },
  {} as Record<string, ScanLog[]>
);
