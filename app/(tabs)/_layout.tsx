import React from 'react';
import { Tabs, useRouter } from 'expo-router';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useAuth } from '@/src/contexts';
import { THEME } from '@/constants/theme';
import type { UserRole } from '@/src/types';

const TabIcon = ({ name, focused }: { name: string; focused: boolean }) => {
  const icons: Record<string, string> = {
    index: '🏠',
    scan: '📷',
    bus: '🚌',
    users: '👥',
    students: '👤',
    routes: '🛤️',
    reports: '📊',
    'bus-map': '🗺️',
    children: '👶',
    route: '📍',
  };
  return (
    <Text style={[styles.icon, focused && styles.iconFocused]}>{icons[name] || '•'}</Text>
  );
};

const ROLE_TABS: Record<UserRole, Array<{ name: string; title: string }>> = {
  driver: [
    { name: 'index', title: 'Dashboard' },
    { name: 'scan', title: 'Scan' },
    { name: 'route', title: 'Route' },
  ],
  guardian: [
    { name: 'index', title: 'Dashboard' },
    { name: 'bus-map', title: 'Bus Map' },
    { name: 'children', title: 'Children' },
  ],
  admin: [
    { name: 'index', title: 'Dashboard' },
    { name: 'students', title: 'Students' },
    { name: 'routes', title: 'Routes' },
    { name: 'guardians', title: 'Guardians' },
    { name: 'reports', title: 'Reports' },
  ],
  student: [
    { name: 'index', title: 'Home' },
    { name: 'bus-map', title: 'Bus' },
  ],
};

const ALL_TAB_NAMES = ['index', 'scan', 'route', 'bus-map', 'children', 'students', 'routes', 'guardians', 'reports', 'settings', 'explore'];

function SettingsHeaderButton() {
  const router = useRouter();
  return (
    <TouchableOpacity
      style={styles.settingsButton}
      onPress={() => router.push('/(tabs)/settings' as any)}
    >
      <Text style={styles.settingsIcon}>⚙️</Text>
    </TouchableOpacity>
  );
}

export default function TabLayout() {
  const { role } = useAuth();
  const userRole = role || 'guardian';
  const tabs = ROLE_TABS[userRole] || ROLE_TABS.guardian;
  const allowedNames = new Set(tabs.map((t) => t.name));

  return (
    <Tabs
      screenOptions={{
        headerShown: true,
        headerRight: () => <SettingsHeaderButton />,
        headerStyle: {
          backgroundColor: THEME.colors.surface,
        },
        headerTitleStyle: {
          fontSize: THEME.fontSize.lg,
          fontWeight: THEME.fontWeight.bold,
          color: THEME.colors.text,
        },
        tabBarActiveTintColor: THEME.colors.primary,
        tabBarInactiveTintColor: THEME.colors.textSecondary,
        tabBarStyle: {
          backgroundColor: THEME.colors.surface,
          borderTopColor: THEME.colors.border,
          paddingBottom: 8,
          paddingTop: 8,
          height: 60,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '500',
        },
      }}
    >
      {tabs.map((tab) => (
        <Tabs.Screen
          key={tab.name}
          name={tab.name}
          options={{
            title: tab.title,
            tabBarIcon: ({ focused }) => <TabIcon name={tab.name} focused={focused} />,
          }}
        />
      ))}
      {ALL_TAB_NAMES.filter((name) => !allowedNames.has(name)).map((name) => (
        <Tabs.Screen
          key={`hidden-${name}`}
          name={name}
          options={{
            href: null,
          }}
        />
      ))}
    </Tabs>
  );
}

const styles = StyleSheet.create({
  icon: {
    fontSize: 20,
    opacity: 0.6,
  },
  iconFocused: {
    opacity: 1,
  },
  settingsButton: {
    padding: 8,
    marginRight: 4,
  },
  settingsIcon: {
    fontSize: 22,
  },
});
