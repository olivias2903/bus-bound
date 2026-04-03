import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { THEME } from '@/constants/theme';
import type { ScanLog } from '@/src/types';
import { MOCK_SCAN_LOGS, STUDENTS_BY_ID } from '@/src/data/mockData';
import { useAuth } from '@/src/contexts';

const formatTime = (date: Date) => {
  const now = new Date();
  const diff = Math.floor((now.getTime() - date.getTime()) / 60000);
  if (diff < 1) return 'Just now';
  if (diff < 60) return `${diff} min ago`;
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

const enrichedScanLogs = MOCK_SCAN_LOGS.map((log) => ({
  ...log,
  studentName: `${STUDENTS_BY_ID[log.studentId]?.firstName || 'Unknown'} ${STUDENTS_BY_ID[log.studentId]?.lastName || ''}`,
}));

export default function ReportsScreen() {
  const { isAdmin } = useAuth();

  useEffect(() => {
    if (!isAdmin) {
      router.replace('/(tabs)/index' as any);
    }
  }, [isAdmin]);

  if (!isAdmin) return null;
  const [filter, setFilter] = useState<'all' | 'boarding' | 'exit'>('all');
  const filteredLogs = filter === 'all' ? enrichedScanLogs : enrichedScanLogs.filter((log) => log.scanType === filter);

  const getActionColor = (action: string) => {
    switch (action) {
      case 'accepted': return THEME.colors.success;
      case 'denied': return THEME.colors.error;
      case 'manual_override': return THEME.colors.warning;
      default: return THEME.colors.textSecondary;
    }
  };

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'accepted': return '✓';
      case 'denied': return '✕';
      case 'manual_override': return '⚡';
      default: return '•';
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Reports</Text>
        <Text style={styles.subtitle}>Scan logs & accountability</Text>
      </View>

      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{MOCK_SCAN_LOGS.length}</Text>
          <Text style={styles.statLabel}>Total Scans Today</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: THEME.colors.success + '15' }]}>
          <Text style={[styles.statNumber, { color: THEME.colors.success }]}>{MOCK_SCAN_LOGS.filter((l) => l.action === 'accepted').length}</Text>
          <Text style={[styles.statLabel, { color: THEME.colors.success }]}>Successful</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: THEME.colors.error + '15' }]}>
          <Text style={[styles.statNumber, { color: THEME.colors.error }]}>{MOCK_SCAN_LOGS.filter((l) => l.action === 'denied').length}</Text>
          <Text style={[styles.statLabel, { color: THEME.colors.error }]}>Denied</Text>
        </View>
      </View>

      <View style={styles.filterRow}>
        {(['all', 'boarding', 'exit'] as const).map((f) => (
          <TouchableOpacity
            key={f}
            style={[styles.filterButton, filter === f && styles.filterButtonActive]}
            onPress={() => setFilter(f)}
          >
            <Text style={[styles.filterText, filter === f && styles.filterTextActive]}>
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView style={styles.logsContainer}>
        <Text style={styles.sectionTitle}>Recent Activity</Text>
        {filteredLogs.map((log) => (
          <View key={log.id} style={styles.logCard}>
            <View style={[styles.actionIcon, { backgroundColor: getActionColor(log.action) + '20' }]}>
              <Text style={[styles.actionIconText, { color: getActionColor(log.action) }]}>{getActionIcon(log.action)}</Text>
            </View>
            <View style={styles.logInfo}>
              <Text style={styles.logStudent}>{log.studentName}</Text>
              <Text style={styles.logDetails}>
                {log.scanType === 'boarding' ? 'Boarded' : 'Exited'} Bus #{log.busId.slice(1)} • {log.action.replace('_', ' ')}
              </Text>
            </View>
            <Text style={styles.logTime}>{formatTime(log.timestamp)}</Text>
          </View>
        ))}
      </ScrollView>

      <TouchableOpacity style={styles.exportButton}>
        <Text style={styles.exportButtonText}>📊 Export Report</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: THEME.colors.background },
  header: { padding: THEME.spacing.lg, paddingTop: 60, backgroundColor: THEME.colors.admin },
  title: { fontSize: THEME.fontSize.xxl, fontWeight: THEME.fontWeight.bold, color: '#fff' },
  subtitle: { fontSize: THEME.fontSize.sm, color: 'rgba(255,255,255,0.8)', marginTop: THEME.spacing.xs },
  statsRow: { flexDirection: 'row', padding: THEME.spacing.lg, gap: THEME.spacing.sm },
  statCard: { flex: 1, backgroundColor: THEME.colors.surface, padding: THEME.spacing.md, borderRadius: THEME.borderRadius.md, alignItems: 'center', ...THEME.shadow.sm },
  statNumber: { fontSize: THEME.fontSize.xxl, fontWeight: THEME.fontWeight.bold, color: THEME.colors.text },
  statLabel: { fontSize: THEME.fontSize.xs, color: THEME.colors.textSecondary, marginTop: THEME.spacing.xs },
  filterRow: { flexDirection: 'row', paddingHorizontal: THEME.spacing.lg, gap: THEME.spacing.sm },
  filterButton: { flex: 1, padding: THEME.spacing.md, borderRadius: THEME.borderRadius.md, backgroundColor: THEME.colors.surface, alignItems: 'center', borderWidth: 1, borderColor: THEME.colors.border },
  filterButtonActive: { backgroundColor: THEME.colors.admin, borderColor: THEME.colors.admin },
  filterText: { fontSize: THEME.fontSize.sm, fontWeight: THEME.fontWeight.medium, color: THEME.colors.text },
  filterTextActive: { color: '#fff' },
  logsContainer: { flex: 1, padding: THEME.spacing.lg },
  sectionTitle: { fontSize: THEME.fontSize.lg, fontWeight: THEME.fontWeight.semibold, color: THEME.colors.text, marginBottom: THEME.spacing.md },
  logCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: THEME.colors.surface, padding: THEME.spacing.md, borderRadius: THEME.borderRadius.md, marginBottom: THEME.spacing.sm, ...THEME.shadow.sm },
  actionIcon: { width: 40, height: 40, borderRadius: THEME.borderRadius.full, alignItems: 'center', justifyContent: 'center', marginRight: THEME.spacing.md },
  actionIconText: { fontSize: THEME.fontSize.lg, fontWeight: THEME.fontWeight.bold },
  logInfo: { flex: 1 },
  logStudent: { fontSize: THEME.fontSize.md, fontWeight: THEME.fontWeight.semibold, color: THEME.colors.text },
  logDetails: { fontSize: THEME.fontSize.sm, color: THEME.colors.textSecondary, textTransform: 'capitalize' },
  logTime: { fontSize: THEME.fontSize.xs, color: THEME.colors.textLight },
  exportButton: { margin: THEME.spacing.lg, backgroundColor: THEME.colors.surface, padding: THEME.spacing.md, borderRadius: THEME.borderRadius.md, alignItems: 'center', borderWidth: 1, borderColor: THEME.colors.border },
  exportButtonText: { fontSize: THEME.fontSize.md, fontWeight: THEME.fontWeight.medium, color: THEME.colors.text },
});
