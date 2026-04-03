import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { THEME } from '@/constants/theme';
import { useAuth } from '@/src/contexts';

export default function BusMapScreen() {
  const { isParent: isGuardian } = useAuth();

  useEffect(() => {
    if (!isGuardian) {
      router.replace('/(tabs)/index' as any);
    }
  }, [isGuardian]);

  if (!isGuardian) return null;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Live Bus Location</Text>
        <View style={styles.busInfo}>
          <Text style={styles.busNumber}>Bus #45</Text>
          <View style={styles.statusBadge}>
            <View style={styles.statusDot} />
            <Text style={styles.statusText}>8 min away</Text>
          </View>
        </View>
      </View>

      <View style={styles.mapContainer}>
        <View style={styles.mapPlaceholder}>
          <Text style={styles.mapText}>🗺️</Text>
          <Text style={styles.mapSubtext}>Live Map View</Text>
          <Text style={styles.mapDescription}>Bus is currently on Oak Avenue</Text>
          <View style={styles.routePreview}>
            <View style={styles.routePoint}>
              <View style={[styles.routeDot, styles.routeDotStart]} />
              <Text style={styles.routeLabel}>Home</Text>
            </View>
            <View style={styles.routeLine} />
            <View style={styles.routePoint}>
              <View style={[styles.routeDot, styles.routeDotCurrent]} />
              <Text style={styles.routeLabel}>Current Location</Text>
            </View>
            <View style={styles.routeLine} />
            <View style={styles.routePoint}>
              <View style={[styles.routeDot, styles.routeDotEnd]} />
              <Text style={styles.routeLabel}>School</Text>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.infoCard}>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Driver</Text>
          <Text style={styles.infoValue}>John Smith</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>ETA</Text>
          <Text style={styles.infoValueEta}>8 minutes</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Students Aboard</Text>
          <Text style={styles.infoValue}>12</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: THEME.colors.background },
  header: { padding: THEME.spacing.lg, paddingTop: 60, backgroundColor: THEME.colors.guardian },
  title: { fontSize: THEME.fontSize.xxl, fontWeight: THEME.fontWeight.bold, color: '#fff' },
  busInfo: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: THEME.spacing.md },
  busNumber: { fontSize: THEME.fontSize.lg, color: '#fff' },
  statusBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: THEME.spacing.md, paddingVertical: THEME.spacing.xs, borderRadius: THEME.borderRadius.full },
  statusDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: THEME.colors.success, marginRight: THEME.spacing.xs },
  statusText: { fontSize: THEME.fontSize.sm, color: '#fff', fontWeight: THEME.fontWeight.medium },
  mapContainer: { flex: 1, margin: THEME.spacing.lg },
  mapPlaceholder: { flex: 1, backgroundColor: THEME.colors.surface, borderRadius: THEME.borderRadius.lg, alignItems: 'center', justifyContent: 'center', padding: THEME.spacing.xl, ...THEME.shadow.md },
  mapText: { fontSize: 80 },
  mapSubtext: { fontSize: THEME.fontSize.xl, fontWeight: THEME.fontWeight.semibold, color: THEME.colors.text, marginTop: THEME.spacing.md },
  mapDescription: { fontSize: THEME.fontSize.md, color: THEME.colors.textSecondary, marginTop: THEME.spacing.sm },
  routePreview: { marginTop: THEME.spacing.xl, width: '100%', flexWrap: 'wrap', flexDirection: 'row' },
  routePoint: { flexDirection: 'row', alignItems: 'center', paddingVertical: THEME.spacing.sm, minWidth: '100%' },
  routeDot: { width: 16, height: 16, borderRadius: 8, marginRight: THEME.spacing.md },
  routeDotStart: { backgroundColor: THEME.colors.success },
  routeDotCurrent: { backgroundColor: THEME.colors.primary },
  routeDotEnd: { backgroundColor: THEME.colors.secondary },
  routeLabel: { fontSize: THEME.fontSize.md, color: THEME.colors.text, flex: 1 },
  routeLine: { width: 2, height: 30, backgroundColor: THEME.colors.border, marginLeft: 7 },
  infoCard: { margin: THEME.spacing.lg, backgroundColor: THEME.colors.surface, borderRadius: THEME.borderRadius.lg, padding: THEME.spacing.lg, ...THEME.shadow.md },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: THEME.spacing.sm },
  infoLabel: { fontSize: THEME.fontSize.md, color: THEME.colors.textSecondary },
  infoValue: { fontSize: THEME.fontSize.md, fontWeight: THEME.fontWeight.medium, color: THEME.colors.text },
  infoValueEta: { fontSize: THEME.fontSize.lg, fontWeight: THEME.fontWeight.bold, color: THEME.colors.primary },
});
