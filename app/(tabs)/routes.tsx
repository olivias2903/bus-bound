import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Modal, FlatList } from 'react-native';
import { router } from 'expo-router';
import { THEME } from '@/constants/theme';
import type { Student } from '@/src/types';
import { MOCK_STUDENTS } from '@/src/data/mockData';
import { useAuth } from '@/src/contexts';

export default function StudentsScreen() {
  const { isAdmin } = useAuth();

  useEffect(() => {
    if (!isAdmin) {
      router.replace('/(tabs)/index' as any);
    }
  }, [isAdmin]);

  if (!isAdmin) return null;

  const [searchQuery, setSearchQuery] = useState('');
  const [students, setStudents] = useState<Student[]>(MOCK_STUDENTS);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  const filteredStudents = students.filter(
    (s) =>
      s.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.studentId.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleGenerateBarcodes = () => {
    alert('Barcode generation started for all students...');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Students</Text>
        <Text style={styles.subtitle}>{students.length} total students</Text>
      </View>

      <View style={styles.searchBar}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Search by name or ID..."
          placeholderTextColor={THEME.colors.textLight}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <View style={styles.actions}>
        <TouchableOpacity style={styles.actionButton} onPress={handleGenerateBarcodes}>
          <Text style={styles.actionButtonText}>📷 Generate All Barcodes</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.actionButton, styles.primaryAction]} onPress={() => setShowAddModal(true)}>
          <Text style={[styles.actionButtonText, { color: '#fff' }]}>+ Add Student</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={filteredStudents}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.studentCard}
            onPress={() => setSelectedStudent(item)}
          >
            <View style={styles.studentAvatar}>
              <Text style={styles.avatarText}>{item.firstName.charAt(0)}</Text>
            </View>
            <View style={styles.studentInfo}>
              <Text style={styles.studentName}>{item.firstName} {item.lastName}</Text>
              <Text style={styles.studentId}>ID: {item.studentId} • Grade {item.grade}</Text>
            </View>
            <View style={styles.barcodePreview}>
              <Text style={styles.barcodeText}>|||||</Text>
              <Text style={styles.barcodeLabel}>Barcode</Text>
            </View>
          </TouchableOpacity>
        )}
      />

      <Modal visible={!!selectedStudent} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.detailModal}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Student Details</Text>
              <TouchableOpacity onPress={() => setSelectedStudent(null)}>
                <Text style={styles.closeButton}>✕</Text>
              </TouchableOpacity>
            </View>
            {selectedStudent && (
              <ScrollView>
                <View style={styles.detailSection}>
                  <View style={styles.detailAvatar}>
                    <Text style={styles.detailAvatarText}>{selectedStudent.firstName.charAt(0)}</Text>
                  </View>
                  <Text style={styles.detailName}>{selectedStudent.firstName} {selectedStudent.lastName}</Text>
                  <Text style={styles.detailSubtitle}>Grade {selectedStudent.grade}</Text>
                </View>

                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Student ID</Text>
                  <Text style={styles.detailValue}>{selectedStudent.studentId}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Barcode</Text>
                  <Text style={styles.detailValue}>{selectedStudent.barcode}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Assigned Route</Text>
                  <Text style={styles.detailValue}>Route 1 - North</Text>
                </View>

                <View style={styles.modalActions}>
                  <TouchableOpacity style={styles.modalButton}>
                    <Text style={styles.modalButtonText}>Edit Student</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.modalButton, styles.printButton]}>
                    <Text style={styles.modalButtonText}>Print Barcode</Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: THEME.colors.background },
  header: { padding: THEME.spacing.lg, paddingTop: 60, backgroundColor: THEME.colors.admin },
  title: { fontSize: THEME.fontSize.xxl, fontWeight: THEME.fontWeight.bold, color: '#fff' },
  subtitle: { fontSize: THEME.fontSize.sm, color: 'rgba(255,255,255,0.8)', marginTop: THEME.spacing.xs },
  searchBar: { flexDirection: 'row', alignItems: 'center', margin: THEME.spacing.lg, backgroundColor: THEME.colors.surface, padding: THEME.spacing.md, borderRadius: THEME.borderRadius.md, ...THEME.shadow.sm },
  searchIcon: { fontSize: 18, marginRight: THEME.spacing.sm },
  searchInput: { flex: 1, fontSize: THEME.fontSize.md, color: THEME.colors.text },
  actions: { flexDirection: 'row', paddingHorizontal: THEME.spacing.lg, gap: THEME.spacing.sm },
  actionButton: { flex: 1, backgroundColor: THEME.colors.surface, padding: THEME.spacing.md, borderRadius: THEME.borderRadius.md, alignItems: 'center', borderWidth: 1, borderColor: THEME.colors.border },
  actionButtonText: { fontSize: THEME.fontSize.sm, fontWeight: THEME.fontWeight.medium, color: THEME.colors.text },
  primaryAction: { backgroundColor: THEME.colors.primary, borderColor: THEME.colors.primary },
  list: { padding: THEME.spacing.lg },
  studentCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: THEME.colors.surface, padding: THEME.spacing.md, borderRadius: THEME.borderRadius.md, marginBottom: THEME.spacing.sm, ...THEME.shadow.sm },
  studentAvatar: { width: 48, height: 48, borderRadius: THEME.borderRadius.full, backgroundColor: THEME.colors.admin, alignItems: 'center', justifyContent: 'center', marginRight: THEME.spacing.md },
  avatarText: { fontSize: THEME.fontSize.xl, fontWeight: THEME.fontWeight.bold, color: '#fff' },
  studentInfo: { flex: 1 },
  studentName: { fontSize: THEME.fontSize.md, fontWeight: THEME.fontWeight.semibold, color: THEME.colors.text },
  studentId: { fontSize: THEME.fontSize.sm, color: THEME.colors.textSecondary },
  barcodePreview: { alignItems: 'center', padding: THEME.spacing.sm, backgroundColor: THEME.colors.background, borderRadius: THEME.borderRadius.sm },
  barcodeText: { fontSize: THEME.fontSize.lg, color: THEME.colors.text, letterSpacing: 2 },
  barcodeLabel: { fontSize: THEME.fontSize.xs, color: THEME.colors.textLight },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  detailModal: { backgroundColor: THEME.colors.surface, borderTopLeftRadius: THEME.borderRadius.xl, borderTopRightRadius: THEME.borderRadius.xl, maxHeight: '80%' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: THEME.spacing.lg, borderBottomWidth: 1, borderBottomColor: THEME.colors.border },
  modalTitle: { fontSize: THEME.fontSize.xl, fontWeight: THEME.fontWeight.bold, color: THEME.colors.text },
  closeButton: { fontSize: THEME.fontSize.xxl, color: THEME.colors.textSecondary },
  detailSection: { alignItems: 'center', padding: THEME.spacing.xl },
  detailAvatar: { width: 80, height: 80, borderRadius: THEME.borderRadius.full, backgroundColor: THEME.colors.admin, alignItems: 'center', justifyContent: 'center', marginBottom: THEME.spacing.md },
  detailAvatarText: { fontSize: THEME.fontSize.xxxl, fontWeight: THEME.fontWeight.bold, color: '#fff' },
  detailName: { fontSize: THEME.fontSize.xxl, fontWeight: THEME.fontWeight.bold, color: THEME.colors.text },
  detailSubtitle: { fontSize: THEME.fontSize.md, color: THEME.colors.textSecondary },
  detailRow: { flexDirection: 'row', justifyContent: 'space-between', padding: THEME.spacing.md, borderBottomWidth: 1, borderBottomColor: THEME.colors.border },
  detailLabel: { fontSize: THEME.fontSize.md, color: THEME.colors.textSecondary },
  detailValue: { fontSize: THEME.fontSize.md, fontWeight: THEME.fontWeight.medium, color: THEME.colors.text },
  modalActions: { flexDirection: 'row', padding: THEME.spacing.lg, gap: THEME.spacing.md },
  modalButton: { flex: 1, backgroundColor: THEME.colors.background, padding: THEME.spacing.md, borderRadius: THEME.borderRadius.md, alignItems: 'center' },
  printButton: { backgroundColor: THEME.colors.primary },
  modalButtonText: { fontSize: THEME.fontSize.sm, fontWeight: THEME.fontWeight.medium, color: THEME.colors.text },
});
