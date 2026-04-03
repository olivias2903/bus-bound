import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { router } from 'expo-router';
import { signIn, getUserProfile } from '@/src/firebase';
import { useAuth } from '@/src/contexts';
import { THEME } from '@/constants/theme';
import { requiresMFA } from '@/src/utils/rbac';

export default function LoginScreen() {
  const { refreshUser } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      const user = await signIn({ email, password });
      const profile = await getUserProfile('demo-district', user.uid);
      await refreshUser();

      if (profile && requiresMFA(profile.role) && !profile.mfaVerified) {
        router.replace('/(auth)/mfa-setup' as any);
      } else {
        router.replace('/(tabs)' as any);
      }
    } catch (error: any) {
      Alert.alert('Login Failed', error.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.logo}>Bus Bound</Text>
          <Text style={styles.subtitle}>Student Transportation Safety</Text>
        </View>

        <View style={styles.form}>
          <Text style={styles.title}>Welcome Back</Text>
          
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your email"
              placeholderTextColor={THEME.colors.textLight}
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              autoComplete="email"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Password</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your password"
              placeholderTextColor={THEME.colors.textLight}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoComplete="password"
            />
          </View>

          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Sign In</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.linkButton}
            onPress={() => Alert.alert('Coming Soon', 'Password reset will be available soon')}
          >
            <Text style={styles.linkText}>Forgot Password?</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Don't have an account?</Text>
          <TouchableOpacity onPress={() => router.push('/(auth)/signup' as any)}>
            <Text style={styles.linkText}>Sign Up</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.colors.background,
  },
  content: {
    flex: 1,
    padding: THEME.spacing.lg,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: THEME.spacing.xxl,
  },
  logo: {
    fontSize: THEME.fontSize.xxxl,
    fontWeight: THEME.fontWeight.bold,
    color: THEME.colors.primary,
  },
  subtitle: {
    fontSize: THEME.fontSize.md,
    color: THEME.colors.textSecondary,
    marginTop: THEME.spacing.xs,
  },
  form: {
    backgroundColor: THEME.colors.surface,
    borderRadius: THEME.borderRadius.lg,
    padding: THEME.spacing.lg,
    ...THEME.shadow.md,
  },
  title: {
    fontSize: THEME.fontSize.xxl,
    fontWeight: THEME.fontWeight.bold,
    color: THEME.colors.text,
    marginBottom: THEME.spacing.lg,
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: THEME.spacing.md,
  },
  label: {
    fontSize: THEME.fontSize.sm,
    fontWeight: THEME.fontWeight.medium,
    color: THEME.colors.text,
    marginBottom: THEME.spacing.xs,
  },
  input: {
    backgroundColor: THEME.colors.background,
    borderRadius: THEME.borderRadius.md,
    padding: THEME.spacing.md,
    fontSize: THEME.fontSize.md,
    color: THEME.colors.text,
    borderWidth: 1,
    borderColor: THEME.colors.border,
  },
  button: {
    backgroundColor: THEME.colors.primary,
    borderRadius: THEME.borderRadius.md,
    padding: THEME.spacing.md,
    alignItems: 'center',
    marginTop: THEME.spacing.md,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: '#fff',
    fontSize: THEME.fontSize.md,
    fontWeight: THEME.fontWeight.semibold,
  },
  linkButton: {
    marginTop: THEME.spacing.md,
    alignItems: 'center',
  },
  linkText: {
    color: THEME.colors.primary,
    fontSize: THEME.fontSize.sm,
    fontWeight: THEME.fontWeight.medium,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: THEME.spacing.xl,
    gap: THEME.spacing.xs,
  },
  footerText: {
    color: THEME.colors.textSecondary,
    fontSize: THEME.fontSize.sm,
  },
});
