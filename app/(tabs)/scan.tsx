import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Modal,
  FlatList,
  Vibration,
} from 'react-native';
import { CameraView, useCameraPermissions, BarcodeScanningResult } from 'expo-camera';
import { router } from 'expo-router';
import { THEME } from '@/constants/theme';
import type { Student, ScanLog, ScanType } from '@/src/types';
import { STUDENTS_BY_BARCODE, MOCK_BUSES, MOCK_ROUTES } from '@/src/data/mockData';
import { useAuth } from '@/src/contexts';
import { saveScanLog } from '@/src/utils/storage';

const CURRENT_ROUTE_ID = 'route-1';

export default function ScanScreen() {
  const { appUser, isDriver } = useAuth();
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [scanResult, setScanResult] = useState<{
    student: Student;
    isWrongBus: boolean;
    scanType: ScanType;
    action?: 'manual_override';
  } | null>(null);
  const [showWrongBusModal, setShowWrongBusModal] = useState(false);
  const [manualSearchVisible, setManualSearchVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [recentScans, setRecentScans] = useState<{ student: Student; time: Date }[]>([]);

  useEffect(() => {
    if (!isDriver) {
      router.replace('/(tabs)/index' as any);
    }
  }, [isDriver]);

  const handleBarCodeScanned = async ({ data }: BarcodeScanningResult) => {
    if (scanned) return;
    setScanned(true);

    const student = STUDENTS_BY_BARCODE[data];
    if (student) {
      const isWrongBus = !student.routeIds.includes(CURRENT_ROUTE_ID);
      const scanType: ScanType = 'boarding';

      if (isWrongBus) {
        Vibration.vibrate(500);
        setScanResult({ student, isWrongBus, scanType });
        setShowWrongBusModal(true);
      } else {
        const newScan = { student, time: new Date() };
        setScanResult({ student, isWrongBus, scanType });
        setRecentScans((prev) => [newScan, ...prev.slice(0, 4)]);
        
        const log: ScanLog = {
          id: `scan-${Date.now()}`,
          districtId: 'demo-district',
          studentId: student.id,
          busId: MOCK_BUSES[0].id,
          routeId: CURRENT_ROUTE_ID,
          driverId: appUser?.id || 'driver-1',
          scanType,
          action: 'accepted',
          timestamp: new Date(),
          location: MOCK_BUSES[0].currentLocation,
          synced: false,
        };
        await saveScanLog(log);
      }
    } else {
      Alert.alert('Unknown ID', 'This student ID is not recognized. Please try again.', [
        { text: 'OK', onPress: () => setScanned(false) },
      ]);
    }
  };

  const handleAcceptWrongBus = async () => {
    if (scanResult) {
      const log: ScanLog = {
        id: `scan-${Date.now()}`,
        districtId: 'demo-district',
        studentId: scanResult.student.id,
        busId: MOCK_BUSES[0].id,
        routeId: CURRENT_ROUTE_ID,
        driverId: appUser?.id || 'driver-1',
        scanType: scanResult.scanType,
        action: 'accepted',
        timestamp: new Date(),
        location: MOCK_BUSES[0].currentLocation,
        synced: false,
      };
      await saveScanLog(log);
      const newScan = { student: scanResult.student, time: new Date() };
      setRecentScans((prev) => [newScan, ...prev.slice(0, 4)]);
    }
    setShowWrongBusModal(false);
    setScanned(false);
    setScanResult(null);
    Alert.alert('Accepted', 'Student has been accepted with override.');
  };

  const handleDenyBoarding = async () => {
    if (scanResult) {
      const log: ScanLog = {
        id: `scan-${Date.now()}`,
        districtId: 'demo-district',
        studentId: scanResult.student.id,
        busId: MOCK_BUSES[0].id,
        routeId: CURRENT_ROUTE_ID,
        driverId: appUser?.id || 'driver-1',
        scanType: scanResult.scanType,
        action: 'denied',
        timestamp: new Date(),
        location: MOCK_BUSES[0].currentLocation,
        synced: false,
      };
      await saveScanLog(log);
    }
    setShowWrongBusModal(false);
    setScanned(false);
    setScanResult(null);
    Alert.alert('Denied', 'Student has been denied boarding.');
  };

  const handleManualCheckIn = () => {
    setManualSearchVisible(true);
  };

  const filteredStudents = Object.values(STUDENTS_BY_BARCODE).filter(
    (s: Student) =>
      s.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.studentId.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleManualSelect = async (student: Student) => {
    setManualSearchVisible(false);
    setScanned(true);
    setScanResult({ student, isWrongBus: false, scanType: 'boarding', action: 'manual_override' });
    
    const log: ScanLog = {
      id: `scan-${Date.now()}`,
      districtId: 'demo-district',
      studentId: student.id,
      busId: MOCK_BUSES[0].id,
      routeId: CURRENT_ROUTE_ID,
      driverId: appUser?.id || 'driver-1',
      scanType: 'boarding',
      action: 'manual_override',
      timestamp: new Date(),
      location: MOCK_BUSES[0].currentLocation,
      synced: false,
    };
    await saveScanLog(log);
    setRecentScans((prev) => [{ student, time: new Date() }, ...prev.slice(0, 4)]);
    Alert.alert('Manual Check-in', `${student.firstName} ${student.lastName} has been manually checked in.`);
  };

  if (!permission) {
    return <View style={styles.container}><Text>Requesting camera permission...</Text></View>;
  }

  if (!permission.granted) {
    return (
      <View style={styles.permissionContainer}>
        <Text style={styles.permissionText}>Camera access is required to scan student IDs</Text>
        <TouchableOpacity style={styles.permissionButton} onPress={requestPermission}>
          <Text style={styles.permissionButtonText}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backButton}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Scan Student ID</Text>
        <TouchableOpacity onPress={handleManualCheckIn}>
          <Text style={styles.manualButton}>Manual</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.cameraContainer}>
        <CameraView
          style={styles.camera}
          barcodeScannerSettings={{
            barcodeTypes: ['code128', 'qr', 'ean13', 'ean8'],
          }}
          onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
        >
          <View style={styles.overlay}>
            <View style={styles.scanArea}>
              <View style={[styles.corner, styles.topLeft]} />
              <View style={[styles.corner, styles.topRight]} />
              <View style={[styles.corner, styles.bottomLeft]} />
              <View style={[styles.corner, styles.bottomRight]} />
            </View>
            <Text style={styles.scanText}>Position barcode within frame</Text>
          </View>
        </CameraView>
      </View>

      {recentScans.length > 0 && (
        <View style={styles.recentSection}>
          <Text style={styles.recentTitle}>Recent Scans</Text>
          <FlatList
            horizontal
            data={recentScans}
            keyExtractor={(item, index) => `${item.student.id}-${index}`}
            showsHorizontalScrollIndicator={false}
            renderItem={({ item }) => (
              <View style={styles.recentCard}>
                <View style={styles.recentAvatar}>
                  <Text style={styles.recentInitial}>{item.student.firstName.charAt(0)}</Text>
                </View>
                <Text style={styles.recentName}>{item.student.firstName}</Text>
              </View>
            )}
          />
        </View>
      )}

      <Modal visible={showWrongBusModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.wrongBusModal}>
            <View style={styles.warningIcon}>
              <Text style={styles.warningEmoji}>⚠️</Text>
            </View>
            <Text style={styles.wrongBusTitle}>WRONG BUS ALERT</Text>
            <Text style={styles.wrongBusText}>
              {scanResult?.student.firstName} {scanResult?.student.lastName} is not assigned to this route!
            </Text>
            <View style={styles.studentPreview}>
              <View style={styles.previewAvatar}>
                <Text style={styles.previewInitial}>
                  {scanResult?.student.firstName.charAt(0)}
                </Text>
              </View>
              <View>
                <Text style={styles.previewName}>
                  {scanResult?.student.firstName} {scanResult?.student.lastName}
                </Text>
                <Text style={styles.previewGrade}>Grade {scanResult?.student.grade}</Text>
              </View>
            </View>
            <Text style={styles.alertNote}>
              This alert will remain until an action is taken.
            </Text>
            <View style={styles.actionButtons}>
              <TouchableOpacity
                style={[styles.actionButton, styles.acceptButton]}
                onPress={handleAcceptWrongBus}
              >
                <Text style={styles.actionButtonText}>Accept Student</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.actionButton, styles.denyButton]}
                onPress={handleDenyBoarding}
              >
                <Text style={[styles.actionButtonText, { color: THEME.colors.error }]}>
                  Deny Boarding
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal visible={manualSearchVisible} animationType="slide">
        <View style={styles.manualModal}>
          <View style={styles.manualHeader}>
            <Text style={styles.manualTitle}>Manual Check-in</Text>
            <TouchableOpacity onPress={() => setManualSearchVisible(false)}>
              <Text style={styles.closeButton}>✕</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.searchContainer}>
            <Text style={styles.searchLabel}>Search by name or ID</Text>
            <TouchableOpacity style={styles.searchInput}>
              <Text
                style={[
                  styles.searchText,
                  searchQuery && styles.searchTextActive,
                ]}
              >
                {searchQuery || 'Type to search...'}
              </Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={filteredStudents}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.studentItem}
                onPress={() => handleManualSelect(item)}
              >
                <View style={styles.studentItemAvatar}>
                  <Text style={styles.studentItemInitial}>{item.firstName.charAt(0)}</Text>
                </View>
                <View style={styles.studentItemInfo}>
                  <Text style={styles.studentItemName}>
                    {item.firstName} {item.lastName}
                  </Text>
                  <Text style={styles.studentItemId}>{item.studentId}</Text>
                </View>
              </TouchableOpacity>
            )}
          />
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: THEME.spacing.lg,
    paddingTop: 50,
    backgroundColor: THEME.colors.driver,
  },
  backButton: {
    fontSize: THEME.fontSize.md,
    color: '#fff',
    fontWeight: THEME.fontWeight.medium,
  },
  title: {
    fontSize: THEME.fontSize.lg,
    fontWeight: THEME.fontWeight.bold,
    color: '#fff',
  },
  manualButton: {
    fontSize: THEME.fontSize.md,
    color: '#fff',
    fontWeight: THEME.fontWeight.medium,
  },
  cameraContainer: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanArea: {
    width: 280,
    height: 180,
    borderWidth: 0,
    position: 'relative',
  },
  corner: {
    position: 'absolute',
    width: 30,
    height: 30,
    borderColor: '#fff',
  },
  topLeft: {
    top: 0,
    left: 0,
    borderTopWidth: 3,
    borderLeftWidth: 3,
  },
  topRight: {
    top: 0,
    right: 0,
    borderTopWidth: 3,
    borderRightWidth: 3,
  },
  bottomLeft: {
    bottom: 0,
    left: 0,
    borderBottomWidth: 3,
    borderLeftWidth: 3,
  },
  bottomRight: {
    bottom: 0,
    right: 0,
    borderBottomWidth: 3,
    borderRightWidth: 3,
  },
  scanText: {
    color: '#fff',
    fontSize: THEME.fontSize.md,
    marginTop: THEME.spacing.lg,
    textAlign: 'center',
  },
  recentSection: {
    padding: THEME.spacing.lg,
    backgroundColor: THEME.colors.surface,
  },
  recentTitle: {
    fontSize: THEME.fontSize.md,
    fontWeight: THEME.fontWeight.semibold,
    color: THEME.colors.text,
    marginBottom: THEME.spacing.md,
  },
  recentCard: {
    alignItems: 'center',
    marginRight: THEME.spacing.md,
    backgroundColor: THEME.colors.success + '15',
    padding: THEME.spacing.md,
    borderRadius: THEME.borderRadius.md,
  },
  recentAvatar: {
    width: 40,
    height: 40,
    borderRadius: THEME.borderRadius.full,
    backgroundColor: THEME.colors.success,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: THEME.spacing.xs,
  },
  recentInitial: {
    fontSize: THEME.fontSize.lg,
    fontWeight: THEME.fontWeight.bold,
    color: '#fff',
  },
  recentName: {
    fontSize: THEME.fontSize.sm,
    color: THEME.colors.success,
    fontWeight: THEME.fontWeight.medium,
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: THEME.spacing.xl,
    backgroundColor: THEME.colors.background,
  },
  permissionText: {
    fontSize: THEME.fontSize.lg,
    color: THEME.colors.text,
    textAlign: 'center',
    marginBottom: THEME.spacing.lg,
  },
  permissionButton: {
    backgroundColor: THEME.colors.primary,
    paddingHorizontal: THEME.spacing.xl,
    paddingVertical: THEME.spacing.md,
    borderRadius: THEME.borderRadius.md,
  },
  permissionButtonText: {
    color: '#fff',
    fontSize: THEME.fontSize.md,
    fontWeight: THEME.fontWeight.semibold,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: THEME.spacing.lg,
  },
  wrongBusModal: {
    backgroundColor: THEME.colors.surface,
    borderRadius: THEME.borderRadius.lg,
    padding: THEME.spacing.xl,
    width: '100%',
    alignItems: 'center',
  },
  warningIcon: {
    width: 80,
    height: 80,
    borderRadius: THEME.borderRadius.full,
    backgroundColor: THEME.colors.error + '20',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: THEME.spacing.md,
  },
  warningEmoji: {
    fontSize: 40,
  },
  wrongBusTitle: {
    fontSize: THEME.fontSize.xxl,
    fontWeight: THEME.fontWeight.bold,
    color: THEME.colors.error,
    marginBottom: THEME.spacing.sm,
  },
  wrongBusText: {
    fontSize: THEME.fontSize.md,
    color: THEME.colors.text,
    textAlign: 'center',
    marginBottom: THEME.spacing.lg,
  },
  studentPreview: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: THEME.colors.background,
    padding: THEME.spacing.md,
    borderRadius: THEME.borderRadius.md,
    marginBottom: THEME.spacing.md,
    gap: THEME.spacing.md,
  },
  previewAvatar: {
    width: 50,
    height: 50,
    borderRadius: THEME.borderRadius.full,
    backgroundColor: THEME.colors.error,
    alignItems: 'center',
    justifyContent: 'center',
  },
  previewInitial: {
    fontSize: THEME.fontSize.xl,
    fontWeight: THEME.fontWeight.bold,
    color: '#fff',
  },
  previewName: {
    fontSize: THEME.fontSize.md,
    fontWeight: THEME.fontWeight.semibold,
    color: THEME.colors.text,
  },
  previewGrade: {
    fontSize: THEME.fontSize.sm,
    color: THEME.colors.textSecondary,
  },
  alertNote: {
    fontSize: THEME.fontSize.sm,
    color: THEME.colors.textSecondary,
    fontStyle: 'italic',
    marginBottom: THEME.spacing.lg,
    textAlign: 'center',
  },
  actionButtons: {
    width: '100%',
    gap: THEME.spacing.md,
  },
  actionButton: {
    padding: THEME.spacing.md,
    borderRadius: THEME.borderRadius.md,
    alignItems: 'center',
  },
  acceptButton: {
    backgroundColor: THEME.colors.success,
  },
  denyButton: {
    backgroundColor: THEME.colors.error + '15',
    borderWidth: 1,
    borderColor: THEME.colors.error,
  },
  actionButtonText: {
    fontSize: THEME.fontSize.md,
    fontWeight: THEME.fontWeight.semibold,
    color: '#fff',
  },
  manualModal: {
    flex: 1,
    backgroundColor: THEME.colors.background,
    paddingTop: 60,
  },
  manualHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: THEME.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: THEME.colors.border,
  },
  manualTitle: {
    fontSize: THEME.fontSize.xl,
    fontWeight: THEME.fontWeight.bold,
    color: THEME.colors.text,
  },
  closeButton: {
    fontSize: THEME.fontSize.xxl,
    color: THEME.colors.textSecondary,
    padding: THEME.spacing.sm,
  },
  searchContainer: {
    padding: THEME.spacing.lg,
  },
  searchLabel: {
    fontSize: THEME.fontSize.sm,
    color: THEME.colors.textSecondary,
    marginBottom: THEME.spacing.sm,
  },
  searchInput: {
    backgroundColor: THEME.colors.surface,
    padding: THEME.spacing.md,
    borderRadius: THEME.borderRadius.md,
    borderWidth: 1,
    borderColor: THEME.colors.border,
  },
  searchText: {
    fontSize: THEME.fontSize.md,
    color: THEME.colors.textLight,
  },
  searchTextActive: {
    color: THEME.colors.text,
  },
  studentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: THEME.spacing.md,
    backgroundColor: THEME.colors.surface,
    marginHorizontal: THEME.spacing.lg,
    marginBottom: THEME.spacing.sm,
    borderRadius: THEME.borderRadius.md,
  },
  studentItemAvatar: {
    width: 44,
    height: 44,
    borderRadius: THEME.borderRadius.full,
    backgroundColor: THEME.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: THEME.spacing.md,
  },
  studentItemInitial: {
    fontSize: THEME.fontSize.lg,
    fontWeight: THEME.fontWeight.bold,
    color: '#fff',
  },
  studentItemInfo: {
    flex: 1,
  },
  studentItemName: {
    fontSize: THEME.fontSize.md,
    fontWeight: THEME.fontWeight.medium,
    color: THEME.colors.text,
  },
  studentItemId: {
    fontSize: THEME.fontSize.sm,
    color: THEME.colors.textSecondary,
  },
});
