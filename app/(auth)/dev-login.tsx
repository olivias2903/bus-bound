import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import { useAuth } from '@/src/contexts';
import { THEME } from '@/constants/theme';
import type { User as AppUser } from '@/src/types';
import {
  MOCK_ADMIN,
  MOCK_DRIVERS,
  MOCK_GUARDIANS,
  MOCK_STUDENTS,
} from '@/src/data/mockData';

const ROLE_COLORS: Record<string, string> = {
  admin: THEME.colors.admin,
  driver: THEME.colors.driver,
  guardian: THEME.colors.guardian,
  student: THEME.colors.student,
};

const ROLE_ICONS: Record<string, string> = {
  admin: '🛡️',
  driver: '🚌',
  guardian: '👨‍👩‍👧',
  student: '🎒',
};

function UserCard({ mockUser }: { mockUser: AppUser }) {
  const { devLogin } = useAuth();
  const color = ROLE_COLORS[mockUser.role] || THEME.colors.primary;
  const icon = ROLE_ICONS[mockUser.role] || '👤';

  const handleLogin = () => {
    devLogin(mockUser);
    router.replace('/(tabs)' as any);
  };

  const mfaStatus = mockUser.mfaEnabled
    ? mockUser.mfaVerified
      ? 'MFA ✓'
      : 'MFA pending'
    : 'No MFA';

  return (
    <TouchableOpacity style={styles.card} onPress={handleLogin}>
      <View style={[styles.iconCircle, { backgroundColor: color }]}>
        <Text style={styles.icon}>{icon}</Text>
      </View>
      <View style={styles.info}>
        <Text style={styles.name}>
          {mockUser.firstName} {mockUser.lastName}
        </Text>
        <Text style={styles.email}>{mockUser.email}</Text>
        <View style={styles.badges}>
          <View style={[styles.badge, { backgroundColor: color + '20' }]}>
            <Text style={[styles.badgeText, { color }]}>{mockUser.role}</Text>
          </View>
          <View style={[styles.badge, { backgroundColor: THEME.colors.background }]}>
            <Text style={[styles.badgeText, { color: THEME.colors.textSecondary }]}>
              {mfaStatus}
            </Text>
          </View>
        </View>
      </View>
      <Text style={styles.arrow}>→</Text>
    </TouchableOpacity>
  );
}

function RoleSection({ title, users }: { title: string; users: AppUser[] }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {users.map((u) => (
        <UserCard key={u.id} mockUser={u} />
      ))}
    </View>
  );
}

export default function DevLoginScreen() {
  const guardianUsers: AppUser[] = MOCK_GUARDIANS.filter((g) => g.userId).map((g) => ({
    id: g.userId,
    email: g.email,
    firstName: g.firstName,
    lastName: g.lastName,
    role: 'guardian' as const,
    districtId: g.districtId,
    mfaEnabled: true,
    mfaVerified: false,
    isActive: true,
    createdAt: g.createdAt,
    updatedAt: g.updatedAt,
  }));

  const studentUsers: AppUser[] = MOCK_STUDENTS.map((s) => ({
    id: s.id,
    email: s.schoolEmail || `${s.firstName.toLowerCase()}.${s.lastName.toLowerCase()}@demo-school.edu`,
    firstName: s.firstName,
    lastName: s.lastName,
    role: 'student' as const,
    districtId: s.districtId,
    mfaEnabled: false,
    mfaVerified: false,
    isActive: true,
    createdAt: s.createdAt,
    updatedAt: s.updatedAt,
  }));

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.logo}>Bus Bound</Text>
        <View style={styles.devBadge}>
          <Text style={styles.devBadgeText}>DEV MODE</Text>
        </View>
        <Text style={styles.subtitle}>Tap any user to log in instantly</Text>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        <RoleSection title="Admin" users={[MOCK_ADMIN]} />
        <RoleSection title="Drivers" users={MOCK_DRIVERS} />
        <RoleSection title="Guardians" users={guardianUsers} />
        <RoleSection title="Students" users={studentUsers} />

        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.push('/(auth)/login' as any)}
          >
            <Text style={styles.backButtonText}>Use email/password login</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.colors.background,
  },
  header: {
    padding: THEME.spacing.lg,
    paddingTop: 60,
    alignItems: 'center',
    backgroundColor: THEME.colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: THEME.colors.border,
  },
  logo: {
    fontSize: THEME.fontSize.xxxl,
    fontWeight: THEME.fontWeight.bold,
    color: THEME.colors.primary,
  },
  devBadge: {
    backgroundColor: THEME.colors.error,
    paddingHorizontal: THEME.spacing.md,
    paddingVertical: THEME.spacing.xs,
    borderRadius: THEME.borderRadius.full,
    marginTop: THEME.spacing.sm,
  },
  devBadgeText: {
    color: '#fff',
    fontSize: THEME.fontSize.xs,
    fontWeight: THEME.fontWeight.bold,
  },
  subtitle: {
    fontSize: THEME.fontSize.md,
    color: THEME.colors.textSecondary,
    marginTop: THEME.spacing.sm,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: THEME.spacing.lg,
  },
  section: {
    marginBottom: THEME.spacing.lg,
  },
  sectionTitle: {
    fontSize: THEME.fontSize.lg,
    fontWeight: THEME.fontWeight.bold,
    color: THEME.colors.text,
    marginBottom: THEME.spacing.md,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: THEME.colors.surface,
    padding: THEME.spacing.md,
    borderRadius: THEME.borderRadius.lg,
    marginBottom: THEME.spacing.sm,
    ...THEME.shadow.sm,
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: THEME.borderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: THEME.spacing.md,
  },
  icon: {
    fontSize: 24,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: THEME.fontSize.md,
    fontWeight: THEME.fontWeight.semibold,
    color: THEME.colors.text,
  },
  email: {
    fontSize: THEME.fontSize.sm,
    color: THEME.colors.textSecondary,
    marginTop: 2,
  },
  badges: {
    flexDirection: 'row',
    gap: THEME.spacing.xs,
    marginTop: THEME.spacing.xs,
  },
  badge: {
    paddingHorizontal: THEME.spacing.sm,
    paddingVertical: 2,
    borderRadius: THEME.borderRadius.full,
  },
  badgeText: {
    fontSize: THEME.fontSize.xs,
    fontWeight: THEME.fontWeight.medium,
    textTransform: 'capitalize',
  },
  arrow: {
    fontSize: THEME.fontSize.xl,
    color: THEME.colors.textLight,
    marginLeft: THEME.spacing.sm,
  },
  footer: {
    marginTop: THEME.spacing.lg,
    alignItems: 'center',
  },
  backButton: {
    padding: THEME.spacing.md,
  },
  backButtonText: {
    color: THEME.colors.primary,
    fontSize: THEME.fontSize.sm,
    fontWeight: THEME.fontWeight.medium,
  },
});
