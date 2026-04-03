import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/src/contexts';
import { THEME } from '@/constants/theme';
import { MOCK_STUDENTS, MOCK_GUARDIANS } from '@/src/data/mockData';
import type { Student, Guardian } from '@/src/types';

export default function GuardiansScreen() {
  const { isAdmin } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAdmin) {
      router.replace('/(tabs)/index' as any);
    }
  }, [isAdmin]);

  if (!isAdmin) return null;

  const [showInviteModal, setShowInviteModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [guardianEmail, setGuardianEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const pendingInvites = MOCK_GUARDIANS.filter(g => g.inviteStatus === 'pending');
  const linkedGuardians = MOCK_GUARDIANS.filter(g => g.inviteStatus === 'accepted');

  const handleInvite = () => {
    if (!selectedStudent) {
      const student = MOCK_STUDENTS.find(s => !s.guardianIds.length);
      if (student) {
        setSelectedStudent(student);
        setShowInviteModal(true);
      } else {
        Alert.alert('Info', 'All students already have guardians linked');
      }
    } else {
      setShowInviteModal(true);
    }
  };

  const handleSendInvite = async () => {
    if (!guardianEmail.includes('@')) {
      Alert.alert('Error', 'Please enter a valid email');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setShowInviteModal(false);
      setGuardianEmail('');
      setSelectedStudent(null);
      Alert.alert('Success', `Invite sent to ${guardianEmail}`);
    }, 1000);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Guardians</Text>
        <Text style={styles.subtitle}>Manage parent/guardian accounts</Text>
      </View>

      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{linkedGuardians.length}</Text>
          <Text style={styles.statLabel}>Linked</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: THEME.colors.warning + '15' }]}>
          <Text style={[styles.statNumber, { color: THEME.colors.warning }]}>{pendingInvites.length}</Text>
          <Text style={[styles.statLabel, { color: THEME.colors.warning }]}>Pending</Text>
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
        </View>
        <TouchableOpacity style={styles.actionCard} onPress={handleInvite}>
          <Text style={styles.actionIcon}>✉️</Text>
          <View style={styles.actionContent}>
            <Text style={styles.actionTitle}>Invite Guardian</Text>
            <Text style={styles.actionDesc}>Send invite to parent email</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionCard}>
          <Text style={styles.actionIcon}>🔗</Text>
          <View style={styles.actionContent}>
            <Text style={styles.actionTitle}>Link Existing</Text>
            <Text style={styles.actionDesc}>Link guardian to student</Text>
          </View>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Pending Invites</Text>
        {pendingInvites.length === 0 ? (
          <Text style={styles.emptyText}>No pending invites</Text>
        ) : (
          pendingInvites.map((guardian) => (
            <View key={guardian.id} style={styles.guardianCard}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{guardian.firstName[0]}</Text>
              </View>
              <View style={styles.guardianInfo}>
                <Text style={styles.guardianName}>{guardian.firstName} {guardian.lastName}</Text>
                <Text style={styles.guardianEmail}>{guardian.email}</Text>
              </View>
              <View style={[styles.statusBadge, { backgroundColor: THEME.colors.warning + '20' }]}>
                <Text style={[styles.statusText, { color: THEME.colors.warning }]}>Pending</Text>
              </View>
            </View>
          ))
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Linked Guardians</Text>
        {linkedGuardians.map((guardian) => {
          const guardianStudents = MOCK_STUDENTS.filter(s => guardian.studentIds.includes(s.id));
          return (
            <View key={guardian.id} style={styles.guardianCard}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{guardian.firstName[0]}</Text>
              </View>
              <View style={styles.guardianInfo}>
                <Text style={styles.guardianName}>{guardian.firstName} {guardian.lastName}</Text>
                <Text style={styles.guardianEmail}>{guardian.email}</Text>
                <Text style={styles.studentCount}>{guardianStudents.length} student(s)</Text>
              </View>
              <TouchableOpacity style={styles.viewButton}>
                <Text style={styles.viewButtonText}>View</Text>
              </TouchableOpacity>
            </View>
          );
        })}
      </View>

      <Modal visible={showInviteModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Invite Guardian</Text>
              <TouchableOpacity onPress={() => { setShowInviteModal(false); setSelectedStudent(null); }}>
                <Text style={styles.closeButton}>✕</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Select Student</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.studentPicker}>
                {MOCK_STUDENTS.filter(s => !s.guardianIds.length).map((student) => (
                  <TouchableOpacity
                    key={student.id}
                    style={[styles.studentChip, selectedStudent?.id === student.id && styles.studentChipSelected]}
                    onPress={() => setSelectedStudent(student)}
                  >
                    <Text style={[styles.studentChipText, selectedStudent?.id === student.id && styles.studentChipTextSelected]}>
                      {student.firstName} {student.lastName[0]}.
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Guardian Email</Text>
              <TextInput
                style={styles.input}
                placeholder="parent@example.com"
                placeholderTextColor={THEME.colors.textLight}
                value={guardianEmail}
                onChangeText={setGuardianEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <TouchableOpacity
              style={[styles.sendButton, (!selectedStudent || !guardianEmail) && styles.sendButtonDisabled]}
              onPress={handleSendInvite}
              disabled={!selectedStudent || !guardianEmail || loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.sendButtonText}>Send Invite</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: THEME.colors.background },
  header: { padding: THEME.spacing.lg, paddingTop: 60, backgroundColor: THEME.colors.admin },
  title: { fontSize: THEME.fontSize.xxl, fontWeight: THEME.fontWeight.bold, color: '#fff' },
  subtitle: { fontSize: THEME.fontSize.md, color: 'rgba(255,255,255,0.8)', marginTop: THEME.spacing.xs },
  statsRow: { flexDirection: 'row', padding: THEME.spacing.lg, gap: THEME.spacing.md },
  statCard: { flex: 1, backgroundColor: THEME.colors.surface, padding: THEME.spacing.lg, borderRadius: THEME.borderRadius.lg, alignItems: 'center', ...THEME.shadow.sm },
  statNumber: { fontSize: THEME.fontSize.xxxl, fontWeight: THEME.fontWeight.bold, color: THEME.colors.text },
  statLabel: { fontSize: THEME.fontSize.sm, color: THEME.colors.textSecondary, marginTop: THEME.spacing.xs },
  section: { padding: THEME.spacing.lg, paddingTop: 0 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: THEME.spacing.md },
  sectionTitle: { fontSize: THEME.fontSize.lg, fontWeight: THEME.fontWeight.semibold, color: THEME.colors.text, marginBottom: THEME.spacing.md },
  actionCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: THEME.colors.surface, padding: THEME.spacing.md, borderRadius: THEME.borderRadius.md, marginBottom: THEME.spacing.sm, ...THEME.shadow.sm },
  actionIcon: { fontSize: 24, marginRight: THEME.spacing.md },
  actionContent: { flex: 1 },
  actionTitle: { fontSize: THEME.fontSize.md, fontWeight: THEME.fontWeight.semibold, color: THEME.colors.text },
  actionDesc: { fontSize: THEME.fontSize.sm, color: THEME.colors.textSecondary },
  emptyText: { fontSize: THEME.fontSize.sm, color: THEME.colors.textSecondary, textAlign: 'center', padding: THEME.spacing.lg },
  guardianCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: THEME.colors.surface, padding: THEME.spacing.md, borderRadius: THEME.borderRadius.md, marginBottom: THEME.spacing.sm, ...THEME.shadow.sm },
  avatar: { width: 44, height: 44, borderRadius: 22, backgroundColor: THEME.colors.guardian, alignItems: 'center', justifyContent: 'center', marginRight: THEME.spacing.md },
  avatarText: { fontSize: THEME.fontSize.lg, fontWeight: THEME.fontWeight.bold, color: '#fff' },
  guardianInfo: { flex: 1 },
  guardianName: { fontSize: THEME.fontSize.md, fontWeight: THEME.fontWeight.semibold, color: THEME.colors.text },
  guardianEmail: { fontSize: THEME.fontSize.sm, color: THEME.colors.textSecondary },
  studentCount: { fontSize: THEME.fontSize.xs, color: THEME.colors.textSecondary, marginTop: THEME.spacing.xs },
  statusBadge: { paddingHorizontal: THEME.spacing.md, paddingVertical: THEME.spacing.xs, borderRadius: THEME.borderRadius.full },
  statusText: { fontSize: THEME.fontSize.xs, fontWeight: THEME.fontWeight.medium },
  viewButton: { backgroundColor: THEME.colors.primary + '15', paddingHorizontal: THEME.spacing.md, paddingVertical: THEME.spacing.sm, borderRadius: THEME.borderRadius.md },
  viewButtonText: { fontSize: THEME.fontSize.sm, color: THEME.colors.primary, fontWeight: THEME.fontWeight.medium },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: THEME.colors.surface, borderTopLeftRadius: THEME.borderRadius.xl, borderTopRightRadius: THEME.borderRadius.xl, padding: THEME.spacing.lg },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: THEME.spacing.lg },
  modalTitle: { fontSize: THEME.fontSize.xl, fontWeight: THEME.fontWeight.bold, color: THEME.colors.text },
  closeButton: { fontSize: THEME.fontSize.xxl, color: THEME.colors.textSecondary },
  inputGroup: { marginBottom: THEME.spacing.md },
  inputLabel: { fontSize: THEME.fontSize.sm, fontWeight: THEME.fontWeight.medium, color: THEME.colors.text, marginBottom: THEME.spacing.xs },
  input: { backgroundColor: THEME.colors.background, borderRadius: THEME.borderRadius.md, padding: THEME.spacing.md, fontSize: THEME.fontSize.md, color: THEME.colors.text, borderWidth: 1, borderColor: THEME.colors.border },
  studentPicker: { flexDirection: 'row', marginTop: THEME.spacing.xs },
  studentChip: { backgroundColor: THEME.colors.background, paddingHorizontal: THEME.spacing.md, paddingVertical: THEME.spacing.sm, borderRadius: THEME.borderRadius.full, marginRight: THEME.spacing.sm, borderWidth: 1, borderColor: THEME.colors.border },
  studentChipSelected: { backgroundColor: THEME.colors.primary, borderColor: THEME.colors.primary },
  studentChipText: { fontSize: THEME.fontSize.sm, color: THEME.colors.text },
  studentChipTextSelected: { color: '#fff' },
  sendButton: { backgroundColor: THEME.colors.primary, borderRadius: THEME.borderRadius.md, padding: THEME.spacing.md, alignItems: 'center', marginTop: THEME.spacing.md },
  sendButtonDisabled: { opacity: 0.5 },
  sendButtonText: { color: '#fff', fontSize: THEME.fontSize.md, fontWeight: THEME.fontWeight.semibold },
});