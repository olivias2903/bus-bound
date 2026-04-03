import { THEME } from '@/constants/theme';
import { useAuth } from '@/src/contexts';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

export default function Dashboard() {
  const { appUser } = useAuth();

  switch (appUser?.role) {
    case 'driver':
      return <DriverDashboard />;
    case 'admin':
      return <AdminDashboard />;
    case 'student':
      return <StudentDashboard />;
    case 'guardian':
    default:
      return <GuardianDashboard />;
  }
}

function DriverDashboard() {
  const { appUser } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState({ total: 12, checkedIn: 8, remaining: 4 });

  return (
    <ScrollView style={styles.container}>
      <View style={[styles.header, { backgroundColor: THEME.colors.driver }]}>
        <Text style={styles.greeting}>Hello, {appUser?.firstName || 'Driver'}</Text>
        <Text style={styles.date}>
          {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
        </Text>
      </View>

      <View style={styles.busCard}>
        <View style={styles.busHeader}>
          <View>
            <Text style={styles.busNumber}>Bus #45</Text>
            <Text style={styles.busPlate}>ABC-1234</Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: THEME.colors.success + '20' }]}>
            <Text style={[styles.statusText, { color: THEME.colors.success }]}>Active</Text>
          </View>
        </View>
        <Text style={styles.routeName}>Route 1 - North Morning</Text>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{stats.total}</Text>
          <Text style={styles.statLabel}>Students</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: THEME.colors.success + '15' }]}>
          <Text style={[styles.statNumber, { color: THEME.colors.success }]}>{stats.checkedIn}</Text>
          <Text style={[styles.statLabel, { color: THEME.colors.success }]}>Checked In</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: THEME.colors.warning + '15' }]}>
          <Text style={[styles.statNumber, { color: THEME.colors.warning }]}>{stats.remaining}</Text>
          <Text style={[styles.statLabel, { color: THEME.colors.warning }]}>Remaining</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.scanButton} onPress={() => router.push('/scan')}>
        <Text style={styles.scanButtonIcon}>📷</Text>
        <Text style={styles.scanButtonText}>Scan Student ID</Text>
      </TouchableOpacity>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Upcoming Stops</Text>
        {['Maple Street', 'Oak Avenue', 'Pine Road'].map((stop, index) => (
          <View key={stop} style={styles.stopCard}>
            <View style={styles.stopOrder}>
              <Text style={styles.stopOrderText}>{index + 1}</Text>
            </View>
            <View style={styles.stopInfo}>
              <Text style={styles.stopName}>{stop}</Text>
              <Text style={styles.stopStudents}>2-3 students</Text>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

function AdminDashboard() {
  const { appUser } = useAuth();

  return (
    <ScrollView style={styles.container}>
      <View style={[styles.header, { backgroundColor: THEME.colors.admin }]}>
        <Text style={styles.greeting}>Hello, {appUser?.firstName || 'Admin'}</Text>
        <Text style={styles.date}>
          {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
        </Text>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>156</Text>
          <Text style={styles.statLabel}>Students</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: THEME.colors.success + '15' }]}>
          <Text style={[styles.statNumber, { color: THEME.colors.success }]}>8</Text>
          <Text style={[styles.statLabel, { color: THEME.colors.success }]}>Buses</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: THEME.colors.primary + '15' }]}>
          <Text style={[styles.statNumber, { color: THEME.colors.primary }]}>12</Text>
          <Text style={[styles.statLabel, { color: THEME.colors.primary }]}>Routes</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.quickActions}>
          <TouchableOpacity style={styles.actionCard}>
            <Text style={styles.actionIcon}>👥</Text>
            <Text style={styles.actionText}>Manage Students</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionCard}>
            <Text style={styles.actionIcon}>🚌</Text>
            <Text style={styles.actionText}>Manage Routes</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionCard}>
            <Text style={styles.actionIcon}>📊</Text>
            <Text style={styles.actionText}>View Reports</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionCard}>
            <Text style={styles.actionIcon}>⚙️</Text>
            <Text style={styles.actionText}>Settings</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recent Activity</Text>
        <View style={styles.activityItem}>
          <Text style={styles.activityText}>Bus #3 started morning route</Text>
          <Text style={styles.activityTime}>5 min ago</Text>
        </View>
        <View style={styles.activityItem}>
          <Text style={styles.activityText}>Student John D. checked in</Text>
          <Text style={styles.activityTime}>12 min ago</Text>
        </View>
        <View style={styles.activityItem}>
          <Text style={styles.activityText}>New student added: Sarah M.</Text>
          <Text style={styles.activityTime}>1 hour ago</Text>
        </View>
      </View>
    </ScrollView>
  );
}

function StudentDashboard() {
  const { appUser } = useAuth();

  return (
    <ScrollView style={styles.container}>
      <View style={[styles.header, { backgroundColor: THEME.colors.student }]}>
        <Text style={styles.greeting}>Hello, {appUser?.firstName || 'Student'}</Text>
        <Text style={styles.date}>
          {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
        </Text>
      </View>

      <View style={styles.section}>
        <View style={styles.infoCard}>
          <Text style={styles.infoLabel}>Your Bus</Text>
          <Text style={styles.infoValue}>Bus #45 - North Morning</Text>
        </View>
        <View style={styles.infoCard}>
          <Text style={styles.infoLabel}>Pickup Time</Text>
          <Text style={styles.infoValue}>7:30 AM</Text>
        </View>
        <View style={styles.infoCard}>
          <Text style={styles.infoLabel}>Drop-off Time</Text>
          <Text style={styles.infoValue}>3:45 PM</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Bus Location</Text>
        <TouchableOpacity style={styles.mapPreview} onPress={() => {}}>
          <Text style={styles.mapText}>🗺️ Tap to view bus on map</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Today's Stops</Text>
        <View style={styles.stopCard}>
          <View style={[styles.stopOrder, { backgroundColor: THEME.colors.success + '20' }]}>
            <Text style={[styles.stopOrderText, { color: THEME.colors.success }]}>✓</Text>
          </View>
          <View style={styles.stopInfo}>
            <Text style={styles.stopName}>Your Home</Text>
            <Text style={styles.stopStudents}>Picked up</Text>
          </View>
        </View>
        <View style={styles.stopCard}>
          <View style={[styles.stopOrder, { backgroundColor: THEME.colors.primary + '20' }]}>
            <Text style={[styles.stopOrderText, { color: THEME.colors.primary }]}>2</Text>
          </View>
          <View style={styles.stopInfo}>
            <Text style={styles.stopName}>Oak Elementary</Text>
            <Text style={styles.stopStudents}>Next stop</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

function GuardianDashboard() {
  const { appUser } = useAuth();

  return (
    <ScrollView style={styles.container}>
      <View style={[styles.header, { backgroundColor: THEME.colors.guardian }]}>
        <Text style={styles.greeting}>Hello, {appUser?.firstName || 'Guardian'}</Text>
        <Text style={styles.date}>
          {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Your Children</Text>
        {['James', 'Liam'].map((name) => (
          <View key={name} style={styles.childCard}>
            <View style={styles.childAvatar}>
              <Text style={styles.childInitial}>{name[0]}</Text>
            </View>
            <View style={styles.childInfo}>
              <Text style={styles.childName}>{name}</Text>
              <Text style={styles.childStatus}>✓ On the bus</Text>
            </View>
            <TouchableOpacity style={styles.trackButton}>
              <Text style={styles.trackButtonText}>Track</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Bus Location</Text>
        <TouchableOpacity style={styles.mapPreview} onPress={() => {}}>
          <Text style={styles.mapText}>🗺️ View bus on map</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recent Activity</Text>
        <View style={styles.activityItem}>
          <Text style={styles.activityText}>James boarded Bus #45</Text>
          <Text style={styles.activityTime}>Today, 7:35 AM</Text>
        </View>
        <View style={styles.activityItem}>
          <Text style={styles.activityText}>Liam picked up from school</Text>
          <Text style={styles.activityTime}>Yesterday, 3:50 PM</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: THEME.colors.background },
  header: { padding: THEME.spacing.lg, paddingTop: 60 },
  greeting: { fontSize: THEME.fontSize.xxl, fontWeight: THEME.fontWeight.bold, color: '#fff' },
  date: { fontSize: THEME.fontSize.sm, color: 'rgba(255,255,255,0.8)', marginTop: THEME.spacing.xs },
  busCard: {
    margin: THEME.spacing.lg, marginTop: -THEME.spacing.lg, padding: THEME.spacing.lg,
    backgroundColor: THEME.colors.surface, borderRadius: THEME.borderRadius.lg, ...THEME.shadow.md,
  },
  busHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  busNumber: { fontSize: THEME.fontSize.xxl, fontWeight: THEME.fontWeight.bold, color: THEME.colors.text },
  busPlate: { fontSize: THEME.fontSize.sm, color: THEME.colors.textSecondary },
  statusBadge: { paddingHorizontal: THEME.spacing.md, paddingVertical: THEME.spacing.xs, borderRadius: THEME.borderRadius.full },
  statusText: { fontSize: THEME.fontSize.sm, fontWeight: THEME.fontWeight.medium },
  routeName: { fontSize: THEME.fontSize.md, color: THEME.colors.textSecondary, marginTop: THEME.spacing.sm },
  statsContainer: { flexDirection: 'row', paddingHorizontal: THEME.spacing.lg, gap: THEME.spacing.sm },
  statCard: {
    flex: 1, backgroundColor: THEME.colors.surface, padding: THEME.spacing.md,
    borderRadius: THEME.borderRadius.md, alignItems: 'center', ...THEME.shadow.sm,
  },
  statNumber: { fontSize: THEME.fontSize.xxl, fontWeight: THEME.fontWeight.bold, color: THEME.colors.text },
  statLabel: { fontSize: THEME.fontSize.xs, color: THEME.colors.textSecondary, marginTop: THEME.spacing.xs },
  scanButton: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    backgroundColor: THEME.colors.driver, margin: THEME.spacing.lg, padding: THEME.spacing.lg,
    borderRadius: THEME.borderRadius.lg, gap: THEME.spacing.md, ...THEME.shadow.md,
  },
  scanButtonIcon: { fontSize: 28 },
  scanButtonText: { fontSize: THEME.fontSize.lg, fontWeight: THEME.fontWeight.semibold, color: '#fff' },
  section: { padding: THEME.spacing.lg, paddingTop: THEME.spacing.md },
  sectionTitle: { fontSize: THEME.fontSize.lg, fontWeight: THEME.fontWeight.semibold, color: THEME.colors.text, marginBottom: THEME.spacing.md },
  stopCard: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: THEME.colors.surface,
    padding: THEME.spacing.md, borderRadius: THEME.borderRadius.md, marginBottom: THEME.spacing.sm, ...THEME.shadow.sm,
  },
  stopOrder: {
    width: 32, height: 32, borderRadius: THEME.borderRadius.full,
    backgroundColor: THEME.colors.primary + '20', alignItems: 'center', justifyContent: 'center', marginRight: THEME.spacing.md,
  },
  stopOrderText: { fontSize: THEME.fontSize.sm, fontWeight: THEME.fontWeight.bold, color: THEME.colors.primary },
  stopInfo: { flex: 1 },
  stopName: { fontSize: THEME.fontSize.md, fontWeight: THEME.fontWeight.medium, color: THEME.colors.text },
  stopStudents: { fontSize: THEME.fontSize.sm, color: THEME.colors.textSecondary },
  quickActions: { flexDirection: 'row', flexWrap: 'wrap', gap: THEME.spacing.sm },
  actionCard: {
    width: '48%', backgroundColor: THEME.colors.surface, padding: THEME.spacing.md,
    borderRadius: THEME.borderRadius.md, alignItems: 'center', ...THEME.shadow.sm,
  },
  actionIcon: { fontSize: 28, marginBottom: THEME.spacing.xs },
  actionText: { fontSize: THEME.fontSize.sm, color: THEME.colors.text, textAlign: 'center' },
  activityItem: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    backgroundColor: THEME.colors.surface, padding: THEME.spacing.md, borderRadius: THEME.borderRadius.md, marginBottom: THEME.spacing.sm,
  },
  activityText: { fontSize: THEME.fontSize.sm, color: THEME.colors.text, flex: 1 },
  activityTime: { fontSize: THEME.fontSize.xs, color: THEME.colors.textSecondary },
  infoCard: {
    backgroundColor: THEME.colors.surface, padding: THEME.spacing.md,
    borderRadius: THEME.borderRadius.md, marginBottom: THEME.spacing.sm, ...THEME.shadow.sm,
  },
  infoLabel: { fontSize: THEME.fontSize.xs, color: THEME.colors.textSecondary, marginBottom: THEME.spacing.xs },
  infoValue: { fontSize: THEME.fontSize.md, fontWeight: THEME.fontWeight.medium, color: THEME.colors.text },
  mapPreview: {
    backgroundColor: THEME.colors.surface, padding: THEME.spacing.xl,
    borderRadius: THEME.borderRadius.md, alignItems: 'center', ...THEME.shadow.sm,
  },
  mapText: { fontSize: THEME.fontSize.md, color: THEME.colors.primary },
  childCard: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: THEME.colors.surface,
    padding: THEME.spacing.md, borderRadius: THEME.borderRadius.md, marginBottom: THEME.spacing.sm, ...THEME.shadow.sm,
  },
  childAvatar: {
    width: 44, height: 44, borderRadius: THEME.borderRadius.full, backgroundColor: THEME.colors.guardian,
    alignItems: 'center', justifyContent: 'center', marginRight: THEME.spacing.md,
  },
  childInitial: { fontSize: THEME.fontSize.lg, fontWeight: THEME.fontWeight.bold, color: '#fff' },
  childInfo: { flex: 1 },
  childName: { fontSize: THEME.fontSize.md, fontWeight: THEME.fontWeight.medium, color: THEME.colors.text },
  childStatus: { fontSize: THEME.fontSize.sm, color: THEME.colors.success },
  trackButton: {
    backgroundColor: THEME.colors.primary, paddingHorizontal: THEME.spacing.md, paddingVertical: THEME.spacing.sm,
    borderRadius: THEME.borderRadius.md,
  },
  trackButtonText: { fontSize: THEME.fontSize.sm, fontWeight: THEME.fontWeight.medium, color: '#fff' },
});
