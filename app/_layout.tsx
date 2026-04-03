import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import 'react-native-reanimated';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { AuthProvider, useAuth } from '@/src/contexts';
import { THEME } from '@/constants/theme';

export const unstable_settings = {
  initialRouteName: '(auth)/login',
};

const IS_DEV = process.env.EXPO_PUBLIC_DEV_MODE === 'true';

function RootLayoutNav() {
  const { loading, user, appUser, requiresMFA } = useAuth();
  const colorScheme = useColorScheme();

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={THEME.colors.primary} />
      </View>
    );
  }

  const needsMFA = !IS_DEV && user && appUser && requiresMFA() && !appUser.mfaVerified;
  const showDevLogin = IS_DEV && !user;

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      >
        {showDevLogin ? (
          <Stack.Screen name="(auth)/dev-login" options={{ headerShown: false }} />
        ) : !user ? (
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        ) : needsMFA ? (
          <Stack.Screen name="(auth)/mfa-setup" options={{ headerShown: false }} />
        ) : (
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        )}
        <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <RootLayoutNav />
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: THEME.colors.background,
  },
});
