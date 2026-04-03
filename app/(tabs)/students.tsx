import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/src/contexts';
import { THEME } from '@/constants/theme';
import { MOCK_STUDENTS, MOCK_ROUTES, MOCK_BUSES } from '@/src/data/mockData';
import type { Student, Bus, Route } from '@/src/types';

export default function AdminDashboard() {
  const { isAdmin } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAdmin) {
      router.replace('/(tabs)/index' as any);
    }
  }, [isAdmin]);

  if (!isAdmin) return null;

  const [stats, setStats] = useState({
    totalStudents: MOCK_STUDENTS.length,
    activeRoutes: MOCK_ROUTES.filter((r) => r.isActive).length,
    activeBuses: MOCK_BUSES.filter((b) => b.status === 'active').length,
    totalScans: 156,
  });

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Admin Dashboard</Text>
          <Text style={styles.subtitle}>Lincoln School District</Text>
        </View>
      </View>

      <View style={styles.statsGrid}>
        <View style={[styles.statCard, { backgroundColor: THEME.colors.primary + '15' }]}>
          <Text style={styles.statIcon}>👥</Text>
          <Text style={[styles.statNumber, { color: THEME.colors.primary }]}>{stats.totalStudents}</Text>
          <Text style={styles.statLabel}>Students</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: THEME.colors.secondary + '15' }]}>
          <Text style={styles.statIcon}>🚌</Text>
          <Text style={[styles.statNumber, { color: THEME.colors.secondary }]}>{stats.activeBuses}</Text>
          <Text style={styles.statLabel}>Active Buses</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: THEME.colors.accent + '15' }]}>
          <Text style={styles.statIcon}>🛤️</Text>
          <Text style={[styles.statNumber, { color: THEME.colors.accent }]}>{stats.activeRoutes}</Text>
          <Text style={styles.statLabel}>Routes</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: THEME.colors.success + '15' }]}>
          <Text style={styles.statIcon}>✓</Text>
          <Text style={[styles.statNumber, { color: THEME.colors.success }]}>{stats.totalScans}</Text>
          <Text style={styles.statLabel}>Today's Scans</Text>
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
        </View>
        <View style={styles.actionsGrid}>
          <TouchableOpacity style={styles.actionCard} onPress={() => router.push('/students')}>
            <Text style={styles.actionIcon}>👤</Text>
            <Text style={styles.actionTitle}>Add Student</Text>
            <Text style={styles.actionDesc}>Register new student</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionCard}>
            <Text style={styles.actionIcon}>📷</Text>
            <Text style={styles.actionTitle}>Print Barcodes</Text>
            <Text style={styles.actionDesc}>Generate ID cards</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionCard}>
            <Text style={styles.actionIcon}>🚌</Text>
            <Text style={styles.actionTitle}>Manage Buses</Text>
            <Text style={styles.actionDesc}>Update fleet info</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionCard}>
            <Text style={styles.actionIcon}>📊</Text>
            <Text style={styles.actionTitle}>Reports</Text>
            <Text style={styles.actionDesc}>View analytics</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Active Buses</Text>
        {MOCK_BUSES.map((bus) => (
          <View key={bus.id} style={styles.busCard}>
            <View style={styles.busInfo}>
              <Text style={styles.busNumber}>Bus #{bus.busNumber}</Text>
              <Text style={styles.busPlate}>{bus.plateNumber}</Text>
            </View>
            <View style={[styles.busStatus, { backgroundColor: bus.status === 'active' ? THEME.colors.success + '20' : THEME.colors.error + '20' }]}>
              <Text style={[styles.busStatusText, { color: bus.status === 'active' ? THEME.colors.success : THEME.colors.error }]}>
                {bus.status.charAt(0).toUpperCase() + bus.status.slice(1)}
              </Text>
            </View>
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Active Routes</Text>
        {MOCK_ROUTES.map((route) => (
          <View key={route.id} style={styles.routeCard}>
            <View style={styles.routeInfo}>
              <Text style={styles.routeName}>{route.name}</Text>
              <Text style={styles.routeDetails}>{route.studentIds.length} students • {route.estimatedDuration} min</Text>
            </View>
            <View style={styles.routeType}>
              <Text style={styles.routeTypeText}>{route.routeType}</Text>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: THEME.colors.background },
  header: { padding: THEME.spacing.lg, paddingTop: 60, backgroundColor: THEME.colors.admin },
  greeting: { fontSize: THEME.fontSize.xxl, fontWeight: THEME.fontWeight.bold, color: '#fff' },
  subtitle: { fontSize: THEME.fontSize.md, color: 'rgba(255,255,255,0.8)', marginTop: THEME.spacing.xs },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', padding: THEME.spacing.lg, gap: THEME.spacing.sm },
  statCard: { width: '48%', padding: THEME.spacing.lg, borderRadius: THEME.borderRadius.lg, alignItems: 'center', ...THEME.shadow.sm },
  statIcon: { fontSize: 28, marginBottom: THEME.spacing.xs },
  statNumber: { fontSize: THEME.fontSize.xxxl, fontWeight: THEME.fontWeight.bold },
  statLabel: { fontSize: THEME.fontSize.sm, color: THEME.colors.textSecondary, marginTop: THEME.spacing.xs },
  section: { padding: THEME.spacing.lg, paddingTop: 0 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: THEME.spacing.md },
  sectionTitle: { fontSize: THEME.fontSize.lg, fontWeight: THEME.fontWeight.semibold, color: THEME.colors.text, marginBottom: THEME.spacing.md },
  actionsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: THEME.spacing.sm },
  actionCard: { width: '48%', backgroundColor: THEME.colors.surface, padding: THEME.spacing.md, borderRadius: THEME.borderRadius.md, ...THEME.shadow.sm },
  actionIcon: { fontSize: 24, marginBottom: THEME.spacing.xs },
  actionTitle: { fontSize: THEME.fontSize.md, fontWeight: THEME.fontWeight.semibold, color: THEME.colors.text },
  actionDesc: { fontSize: THEME.fontSize.xs, color: THEME.colors.textSecondary },
  busCard: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: THEME.colors.surface, padding: THEME.spacing.md, borderRadius: THEME.borderRadius.md, marginBottom: THEME.spacing.sm, ...THEME.shadow.sm },
  busInfo: {},
  busNumber: { fontSize: THEME.fontSize.md, fontWeight: THEME.fontWeight.semibold, color: THEME.colors.text },
  busPlate: { fontSize: THEME.fontSize.sm, color: THEME.colors.textSecondary },
  busStatus: { paddingHorizontal: THEME.spacing.md, paddingVertical: THEME.spacing.xs, borderRadius: THEME.borderRadius.full },
  busStatusText: { fontSize: THEME.fontSize.sm, fontWeight: THEME.fontWeight.medium },
  routeCard: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: THEME.colors.surface, padding: THEME.spacing.md, borderRadius: THEME.borderRadius.md, marginBottom: THEME.spacing.sm, ...THEME.shadow.sm },
  routeInfo: {},
  routeName: { fontSize: THEME.fontSize.md, fontWeight: THEME.fontWeight.semibold, color: THEME.colors.text },
  routeDetails: { fontSize: THEME.fontSize.sm, color: THEME.colors.textSecondary },
  routeType: { backgroundColor: THEME.colors.primary + '15', paddingHorizontal: THEME.spacing.md, paddingVertical: THEME.spacing.xs, borderRadius: THEME.borderRadius.full },
  routeTypeText: { fontSize: THEME.fontSize.xs, color: THEME.colors.primary, fontWeight: THEME.fontWeight.medium, textTransform: 'capitalize' },
});
