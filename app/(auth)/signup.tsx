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
  ScrollView,
} from 'react-native';
import { router } from 'expo-router';
import { signUp } from '@/src/firebase';
import { THEME } from '@/constants/theme';
import type { UserRole } from '@/src/types';

const ADMIN_ROLES: { value: UserRole; label: string }[] = [
  { value: 'admin', label: 'District Admin' },
  { value: 'driver', label: 'Bus Driver' },
];

export default function SignUpScreen() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<UserRole>('admin');
  const [loading, setLoading] = useState(false);

  const handleSignUp = async () => {
    if (!firstName || !lastName || !email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      await signUp({
        email,
        password,
        firstName,
        lastName,
        role,
        districtId: 'demo-district',
      });
      Alert.alert('Success', 'Account created! Please check your email to verify.', [
        { text: 'OK', onPress: () => router.replace('/(auth)/login' as any) },
      ]);
    } catch (error: any) {
      Alert.alert('Sign Up Failed', error.message || 'Please try again');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.logo}>Bus Bound</Text>
            <Text style={styles.subtitle}>Create Admin Account</Text>
          </View>

          <View style={styles.form}>
            <View style={styles.row}>
              <View style={[styles.inputContainer, styles.halfInput]}>
                <Text style={styles.label}>First Name</Text>
                <TextInput
                  style={styles.input}
                  placeholder="First name"
                  placeholderTextColor={THEME.colors.textLight}
                  value={firstName}
                  onChangeText={setFirstName}
                  autoCapitalize="words"
                />
              </View>
              <View style={[styles.inputContainer, styles.halfInput]}>
                <Text style={styles.label}>Last Name</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Last name"
                  placeholderTextColor={THEME.colors.textLight}
                  value={lastName}
                  onChangeText={setLastName}
                  autoCapitalize="words"
                />
              </View>
            </View>

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
                placeholder="Create a password"
                placeholderTextColor={THEME.colors.textLight}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Confirm Password</Text>
              <TextInput
                style={styles.input}
                placeholder="Confirm your password"
                placeholderTextColor={THEME.colors.textLight}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Role</Text>
              <View style={styles.roleContainer}>
                {ADMIN_ROLES.map((r) => (
                  <TouchableOpacity
                    key={r.value}
                    style={[
                      styles.roleButton,
                      role === r.value && styles.roleButtonSelected,
                    ]}
                    onPress={() => setRole(r.value)}
                  >
                    <Text
                      style={[
                        styles.roleText,
                        role === r.value && styles.roleTextSelected,
                      ]}
                    >
                      {r.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <TouchableOpacity
              style={[styles.button, loading && styles.buttonDisabled]}
              onPress={handleSignUp}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Create Account</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.linkButton}
              onPress={() => router.back()}
            >
              <Text style={styles.linkText}>Already have an account? Sign In</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.colors.background,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    padding: THEME.spacing.lg,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: THEME.spacing.xl,
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
  row: {
    flexDirection: 'row',
    gap: THEME.spacing.md,
  },
  inputContainer: {
    marginBottom: THEME.spacing.md,
  },
  halfInput: {
    flex: 1,
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
  roleContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: THEME.spacing.sm,
  },
  roleButton: {
    paddingHorizontal: THEME.spacing.md,
    paddingVertical: THEME.spacing.sm,
    borderRadius: THEME.borderRadius.md,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    backgroundColor: THEME.colors.background,
  },
  roleButtonSelected: {
    backgroundColor: THEME.colors.primary,
    borderColor: THEME.colors.primary,
  },
  roleText: {
    fontSize: THEME.fontSize.sm,
    color: THEME.colors.text,
  },
  roleTextSelected: {
    color: '#fff',
    fontWeight: THEME.fontWeight.medium,
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
});
