import React, { useLayoutEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { router, useNavigation } from 'expo-router';
import { signOut } from '@/src/firebase';
import { useAuth } from '@/src/contexts';
import { THEME } from '@/constants/theme';

const IS_DEV = process.env.EXPO_PUBLIC_DEV_MODE === 'true';

export default function SettingsScreen() {
  const { appUser } = useAuth();
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          style={styles.headerSignOut}
          onPress={handleSignOut}
        >
          <Text style={styles.headerSignOutText}>Sign Out</Text>
        </TouchableOpacity>
      ),
    });
  }, []);

  const handleSignOut = async () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign Out',
        style: 'destructive',
        onPress: async () => {
          await signOut();
          if (IS_DEV) {
            router.replace('/(auth)/dev-login' as any);
          } else {
            router.replace('/(auth)/login' as any);
          }
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      {IS_DEV && (
        <View style={styles.devBanner}>
          <Text style={styles.devBannerText}>⚡ DEV MODE — Tap any user on the login screen to switch roles</Text>
        </View>
      )}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account</Text>
        <View style={styles.card}>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Name</Text>
            <Text style={styles.value}>{appUser?.firstName} {appUser?.lastName}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.infoRow}>
            <Text style={styles.label}>Email</Text>
            <Text style={styles.value}>{appUser?.email}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.infoRow}>
            <Text style={styles.label}>Role</Text>
            <View style={[styles.roleBadge, { backgroundColor: THEME.colors[appUser?.role || 'guardian'] + '20' }]}>
              <Text style={[styles.roleText, { color: THEME.colors[appUser?.role || 'guardian'] }]}>
                {appUser?.role?.charAt(0).toUpperCase()}{appUser?.role?.slice(1)}
              </Text>
            </View>
          </View>
          {IS_DEV && (
            <>
              <View style={styles.divider} />
              <View style={styles.infoRow}>
                <Text style={styles.label}>Auth</Text>
                <Text style={[styles.value, { color: THEME.colors.success }]}>Dev (mock)</Text>
              </View>
            </>
          )}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Preferences</Text>
        <View style={styles.card}>
          <TouchableOpacity style={styles.menuRow}>
            <Text style={styles.menuText}>Notifications</Text>
            <Text style={styles.menuArrow}>→</Text>
          </TouchableOpacity>
          <View style={styles.divider} />
          <TouchableOpacity style={styles.menuRow}>
            <Text style={styles.menuText}>Privacy & Security</Text>
            <Text style={styles.menuArrow}>→</Text>
          </TouchableOpacity>
          <View style={styles.divider} />
          <TouchableOpacity style={styles.menuRow}>
            <Text style={styles.menuText}>Help & Support</Text>
            <Text style={styles.menuArrow}>→</Text>
          </TouchableOpacity>
        </View>
      </View>

      <Text style={styles.version}>Bus Bound v1.0.0</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: THEME.colors.background },
  headerSignOut: { marginRight: 12, paddingHorizontal: 12, paddingVertical: 6, backgroundColor: THEME.colors.error, borderRadius: 6 },
  headerSignOutText: { color: '#fff', fontSize: 13, fontWeight: '600' },
  section: { padding: THEME.spacing.lg },
  sectionTitle: { fontSize: THEME.fontSize.sm, fontWeight: THEME.fontWeight.semibold, color: THEME.colors.textSecondary, marginBottom: THEME.spacing.sm, textTransform: 'uppercase' },
  card: { backgroundColor: THEME.colors.surface, borderRadius: THEME.borderRadius.md, ...THEME.shadow.sm },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: THEME.spacing.md },
  label: { fontSize: THEME.fontSize.md, color: THEME.colors.text },
  value: { fontSize: THEME.fontSize.md, color: THEME.colors.textSecondary },
  roleBadge: { paddingHorizontal: THEME.spacing.md, paddingVertical: THEME.spacing.xs, borderRadius: THEME.borderRadius.full },
  roleText: { fontSize: THEME.fontSize.sm, fontWeight: THEME.fontWeight.medium },
  divider: { height: 1, backgroundColor: THEME.colors.border, marginHorizontal: THEME.spacing.md },
  menuRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: THEME.spacing.md },
  menuText: { fontSize: THEME.fontSize.md, color: THEME.colors.text },
  menuArrow: { fontSize: THEME.fontSize.md, color: THEME.colors.textSecondary },
  version: { textAlign: 'center', fontSize: THEME.fontSize.sm, color: THEME.colors.textLight, marginTop: THEME.spacing.lg },
  devBanner: { margin: THEME.spacing.lg, marginBottom: 0, backgroundColor: THEME.colors.accent + '20', padding: THEME.spacing.md, borderRadius: THEME.borderRadius.md, borderLeftWidth: 4, borderLeftColor: THEME.colors.accent },
  devBannerText: { fontSize: THEME.fontSize.sm, color: THEME.colors.text, fontWeight: THEME.fontWeight.medium },
});
