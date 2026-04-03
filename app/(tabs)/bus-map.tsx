import { THEME } from '@/constants/theme';
import { useAuth } from '@/src/contexts';
import { MOCK_BUSES, MOCK_ROUTES } from '@/src/data/mockData';
import type { Bus, Route } from '@/src/types';
import React, { useState, useRef } from 'react';
import { StyleSheet, Text, View, Platform } from 'react-native';

let MapView: any = null;
let Marker: any = null;
let Polyline: any = null;

if (Platform.OS !== 'web') {
  try {
    const maps = require('react-native-maps');
    MapView = maps.default;
    Marker = maps.Marker;
    Polyline = maps.Polyline;
  } catch (e) {
    console.warn('react-native-maps not available');
  }
}

const INITIAL_REGION = {
  latitude: 40.7128,
  longitude: -74.006,
  latitudeDelta: 0.02,
  longitudeDelta: 0.02,
};

export default function BusMapScreen() {
  const { appUser } = useAuth();
  const mapRef = useRef<any>(null);
  const [bus] = useState<Bus>(MOCK_BUSES[0]);
  const [route] = useState<Route | undefined>(MOCK_ROUTES[0]);

  const stops = route?.stops || [];
  const routeCoordinates = stops.map(s => s.location);

  if (!MapView) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Good Morning!</Text>
            <Text style={styles.subtitle}>{appUser?.firstName || 'Parent'}</Text>
          </View>
        </View>
        <View style={styles.fallbackContainer}>
          <Text style={styles.fallbackIcon}>🗺️</Text>
          <Text style={styles.fallbackText}>Map not available</Text>
          <Text style={styles.fallbackSubtext}>Bus #{bus.busNumber} - On Time</Text>
          <Text style={styles.fallbackEta}>8 min away</Text>
        </View>
        <View style={styles.statusCard}>
          <View style={styles.statusHeader}>
            <View>
              <Text style={styles.busStatusTitle}>Bus #{bus.busNumber}</Text>
              <View style={styles.statusRow}>
                <View style={[styles.statusDot, { backgroundColor: THEME.colors.success }]} />
                <Text style={styles.statusText}>On Time</Text>
              </View>
            </View>
            <View style={styles.etaContainer}>
              <Text style={styles.etaValue}>8</Text>
              <Text style={styles.etaUnit}>min</Text>
            </View>
          </View>
          <Text style={styles.routeName}>{route?.name || 'Route 1 - North Morning'}</Text>
          <View style={styles.stopInfo}>
            <Text style={styles.stopLabel}>Next Stop:</Text>
            <Text style={styles.stopName}>{stops[1]?.name || 'Oak Avenue Park'}</Text>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={INITIAL_REGION}
        showsUserLocation
        showsMyLocationButton
      >
        {bus.currentLocation && (
          <Marker
            coordinate={bus.currentLocation}
            title={`Bus #${bus.busNumber}`}
            description={bus.isSubstitute ? 'Substitute Bus' : 'Active'}
          >
            <View style={styles.busMarker}>
              <Text style={styles.busMarkerIcon}>🚌</Text>
            </View>
          </Marker>
        )}
        {stops.map((stop) => (
          <Marker
            key={stop.id}
            coordinate={stop.location}
            title={stop.name}
            description={`Stop #${stop.order}`}
          >
            <View style={styles.stopMarker}>
              <Text style={styles.stopMarkerText}>{stop.order}</Text>
            </View>
          </Marker>
        ))}
        {routeCoordinates.length > 1 && (
          <Polyline
            coordinates={routeCoordinates}
            strokeColor={THEME.colors.primary}
            strokeWidth={3}
            lineDashPattern={[0]}
          />
        )}
      </MapView>

      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Good Morning!</Text>
          <Text style={styles.subtitle}>{appUser?.firstName || 'Parent'}</Text>
        </View>
      </View>

      <View style={styles.statusCard}>
        <View style={styles.statusHeader}>
          <View>
            <Text style={styles.busStatusTitle}>Bus #{bus.busNumber}</Text>
            <View style={styles.statusRow}>
              <View style={[styles.statusDot, { backgroundColor: THEME.colors.success }]} />
              <Text style={styles.statusText}>On Time</Text>
            </View>
          </View>
          <View style={styles.etaContainer}>
            <Text style={styles.etaValue}>8</Text>
            <Text style={styles.etaUnit}>min</Text>
          </View>
        </View>
        <Text style={styles.routeName}>{route?.name || 'Route 1 - North Morning'}</Text>
        <View style={styles.stopInfo}>
          <Text style={styles.stopLabel}>Next Stop:</Text>
          <Text style={styles.stopName}>{stops[1]?.name || 'Oak Avenue Park'}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
  header: { position: 'absolute', top: 0, left: 0, right: 0, padding: THEME.spacing.lg, paddingTop: 60, backgroundColor: 'transparent', zIndex: 1 },
  greeting: { fontSize: THEME.fontSize.lg, color: 'rgba(0,0,0,0.6)' },
  subtitle: { fontSize: THEME.fontSize.xxl, fontWeight: THEME.fontWeight.bold, color: '#000' },
  fallbackContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: THEME.colors.background },
  fallbackIcon: { fontSize: 64, marginBottom: THEME.spacing.md },
  fallbackText: { fontSize: THEME.fontSize.xl, color: THEME.colors.text, marginBottom: THEME.spacing.xs },
  fallbackSubtext: { fontSize: THEME.fontSize.md, color: THEME.colors.textSecondary },
  fallbackEta: { fontSize: THEME.fontSize.xxxl, fontWeight: THEME.fontWeight.bold, color: THEME.colors.primary, marginTop: THEME.spacing.md },
  statusCard: { position: 'absolute', bottom: THEME.spacing.lg, left: THEME.spacing.lg, right: THEME.spacing.lg, backgroundColor: '#fff', borderRadius: THEME.borderRadius.lg, padding: THEME.spacing.lg, ...THEME.shadow.lg },
  statusHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: THEME.spacing.sm },
  busStatusTitle: { fontSize: THEME.fontSize.xl, fontWeight: THEME.fontWeight.bold, color: THEME.colors.text },
  statusRow: { flexDirection: 'row', alignItems: 'center', marginTop: THEME.spacing.xs },
  statusDot: { width: 8, height: 8, borderRadius: 4, marginRight: THEME.spacing.xs },
  statusText: { fontSize: THEME.fontSize.sm, color: THEME.colors.success },
  etaContainer: { alignItems: 'center' },
  etaValue: { fontSize: 36, fontWeight: THEME.fontWeight.bold, color: THEME.colors.primary },
  etaUnit: { fontSize: THEME.fontSize.sm, color: THEME.colors.textSecondary },
  routeName: { fontSize: THEME.fontSize.sm, color: THEME.colors.textSecondary, marginBottom: THEME.spacing.sm },
  stopInfo: { flexDirection: 'row', alignItems: 'center' },
  stopLabel: { fontSize: THEME.fontSize.sm, color: THEME.colors.textSecondary, marginRight: THEME.spacing.xs },
  stopName: { fontSize: THEME.fontSize.sm, fontWeight: THEME.fontWeight.medium, color: THEME.colors.text },
  busMarker: { backgroundColor: THEME.colors.driver, padding: 8, borderRadius: 20 },
  busMarkerIcon: { fontSize: 20 },
  stopMarker: { backgroundColor: THEME.colors.primary, width: 28, height: 28, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  stopMarkerText: { color: '#fff', fontWeight: THEME.fontWeight.bold, fontSize: 12 },
});
