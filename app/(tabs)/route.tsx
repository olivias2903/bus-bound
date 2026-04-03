import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { THEME } from '@/constants/theme';
import type { Route, Student } from '@/src/types';
import { MOCK_ROUTES, STUDENTS_BY_ID } from '@/src/data/mockData';
import { useAuth } from '@/src/contexts';

export default function RouteScreen() {
  const { isDriver } = useAuth();

  useEffect(() => {
    if (!isDriver) {
      router.replace('/(tabs)/index' as any);
    }
  }, [isDriver]);

  if (!isDriver) return null;

  const [selectedStop, setSelectedStop] = useState<string | null>(null);
  const route = MOCK_ROUTES[0];

  const getStudentsForStop = (studentIds: string[]) => {
    return studentIds.map((id) => STUDENTS_BY_ID[id]).filter(Boolean);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{route.name}</Text>
        <Text style={styles.subtitle}>{route.routeType} Route</Text>
      </View>

      <View style={styles.statsRow}>
        <View style={styles.stat}>
          <Text style={styles.statValue}>{route.stops.length}</Text>
          <Text style={styles.statLabel}>Stops</Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.statValue}>{route.studentIds.length}</Text>
          <Text style={styles.statLabel}>Students</Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.statValue}>{route.estimatedDuration}m</Text>
          <Text style={styles.statLabel}>Duration</Text>
        </View>
      </View>

      <View style={styles.mapPlaceholder}>
        <Text style={styles.mapText}>🗺️ Route Map View</Text>
        <Text style={styles.mapSubtext}>GPS tracking enabled</Text>
      </View>

      <View style={styles.stopsList}>
        <Text style={styles.sectionTitle}>Route Stops</Text>
        {route.stops.map((stop, index) => {
          const students = getStudentsForStop(stop.studentIds);
          const isSelected = selectedStop === stop.id;
          const isLastStop = index === route.stops.length - 1;

          return (
            <TouchableOpacity
              key={stop.id}
              style={[styles.stopCard, isSelected && styles.stopCardSelected]}
              onPress={() => setSelectedStop(isSelected ? null : stop.id)}
            >
              <View style={styles.stopHeader}>
                <View style={[styles.stopMarker, isLastStop && styles.schoolMarker]}>
                  <Text style={styles.stopNumber}>{stop.order}</Text>
                </View>
                <View style={styles.stopInfo}>
                  <Text style={styles.stopName}>{stop.name}</Text>
                  <Text style={styles.stopCount}>{students.length} student{students.length !== 1 ? 's' : ''}</Text>
                </View>
                <Text style={styles.expandIcon}>{isSelected ? '▲' : '▼'}</Text>
              </View>

              {isSelected && (
                <View style={styles.stopDetails}>
                  <View style={styles.studentList}>
                    {students.map((student) => (
                      <View key={student.id} style={styles.studentRow}>
                        <View style={styles.studentAvatar}>
                          <Text style={styles.studentInitial}>{student.firstName.charAt(0)}</Text>
                        </View>
                        <View style={styles.studentInfo}>
                          <Text style={styles.studentName}>{student.firstName} {student.lastName}</Text>
                          <Text style={styles.studentGrade}>Grade {student.grade}</Text>
                        </View>
                        <View style={styles.checkStatus}>
                          <Text style={styles.checkIcon}>✓</Text>
                        </View>
                      </View>
                    ))}
                  </View>
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: THEME.colors.background },
  header: { padding: THEME.spacing.lg, paddingTop: 60, backgroundColor: THEME.colors.driver },
  title: { fontSize: THEME.fontSize.xxl, fontWeight: THEME.fontWeight.bold, color: '#fff' },
  subtitle: { fontSize: THEME.fontSize.md, color: 'rgba(255,255,255,0.8)', marginTop: THEME.spacing.xs },
  statsRow: { flexDirection: 'row', padding: THEME.spacing.lg, gap: THEME.spacing.md },
  stat: { flex: 1, backgroundColor: THEME.colors.surface, padding: THEME.spacing.md, borderRadius: THEME.borderRadius.md, alignItems: 'center', ...THEME.shadow.sm },
  statValue: { fontSize: THEME.fontSize.xl, fontWeight: THEME.fontWeight.bold, color: THEME.colors.text },
  statLabel: { fontSize: THEME.fontSize.xs, color: THEME.colors.textSecondary, marginTop: THEME.spacing.xs },
  mapPlaceholder: { marginHorizontal: THEME.spacing.lg, backgroundColor: THEME.colors.surface, padding: THEME.spacing.xxl, borderRadius: THEME.borderRadius.lg, alignItems: 'center', ...THEME.shadow.sm },
  mapText: { fontSize: THEME.fontSize.lg, color: THEME.colors.textSecondary },
  mapSubtext: { fontSize: THEME.fontSize.sm, color: THEME.colors.textLight, marginTop: THEME.spacing.xs },
  stopsList: { padding: THEME.spacing.lg },
  sectionTitle: { fontSize: THEME.fontSize.lg, fontWeight: THEME.fontWeight.semibold, color: THEME.colors.text, marginBottom: THEME.spacing.md },
  stopCard: { backgroundColor: THEME.colors.surface, borderRadius: THEME.borderRadius.md, marginBottom: THEME.spacing.sm, overflow: 'hidden', ...THEME.shadow.sm },
  stopCardSelected: { borderWidth: 2, borderColor: THEME.colors.driver },
  stopHeader: { flexDirection: 'row', alignItems: 'center', padding: THEME.spacing.md },
  stopMarker: { width: 36, height: 36, borderRadius: THEME.borderRadius.full, backgroundColor: THEME.colors.primary, alignItems: 'center', justifyContent: 'center', marginRight: THEME.spacing.md },
  schoolMarker: { backgroundColor: THEME.colors.secondary },
  stopNumber: { fontSize: THEME.fontSize.md, fontWeight: THEME.fontWeight.bold, color: '#fff' },
  stopInfo: { flex: 1 },
  stopName: { fontSize: THEME.fontSize.md, fontWeight: THEME.fontWeight.medium, color: THEME.colors.text },
  stopCount: { fontSize: THEME.fontSize.sm, color: THEME.colors.textSecondary },
  expandIcon: { fontSize: THEME.fontSize.sm, color: THEME.colors.textSecondary },
  stopDetails: { borderTopWidth: 1, borderTopColor: THEME.colors.border, padding: THEME.spacing.md },
  studentList: { gap: THEME.spacing.sm },
  studentRow: { flexDirection: 'row', alignItems: 'center', padding: THEME.spacing.sm, backgroundColor: THEME.colors.background, borderRadius: THEME.borderRadius.sm },
  studentAvatar: { width: 32, height: 32, borderRadius: THEME.borderRadius.full, backgroundColor: THEME.colors.driver, alignItems: 'center', justifyContent: 'center', marginRight: THEME.spacing.sm },
  studentInitial: { fontSize: THEME.fontSize.sm, fontWeight: THEME.fontWeight.bold, color: '#fff' },
  studentInfo: { flex: 1 },
  studentName: { fontSize: THEME.fontSize.sm, fontWeight: THEME.fontWeight.medium, color: THEME.colors.text },
  studentGrade: { fontSize: THEME.fontSize.xs, color: THEME.colors.textSecondary },
  checkStatus: { width: 24, height: 24, borderRadius: THEME.borderRadius.full, backgroundColor: THEME.colors.success + '20', alignItems: 'center', justifyContent: 'center' },
  checkIcon: { fontSize: 12, color: THEME.colors.success, fontWeight: THEME.fontWeight.bold },
});
