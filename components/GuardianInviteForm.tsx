import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useAuth } from '@/src/contexts';
import { createGuardianInvite } from '@/src/firebase';
import { THEME } from '@/constants/theme';

interface GuardianInviteFormProps {
  studentId: string;
  studentName: string;
  onSuccess?: () => void;
}

export default function GuardianInviteForm({
  studentId,
  studentName,
  onSuccess,
}: GuardianInviteFormProps) {
  const { user, appUser } = useAuth();
  const [guardianEmail, setGuardianEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleInvite = async () => {
    if (!guardianEmail || !guardianEmail.includes('@')) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    if (!user || !appUser) return;

    setLoading(true);
    try {
      await createGuardianInvite({
        studentId,
        guardianEmail,
        districtId: appUser.districtId,
        createdBy: user.uid,
      });

      Alert.alert('Success', `Invite sent to ${guardianEmail}`, [
        { text: 'OK', onPress: () => { setGuardianEmail(''); onSuccess?.(); } },
      ]);
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to send invite');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Invite Guardian</Text>
      <Text style={styles.subtitle}>
        Send an invite to the parent/guardian of {studentName}
      </Text>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Guardian Email</Text>
        <TextInput
          style={styles.input}
          placeholder="parent@example.com"
          placeholderTextColor={THEME.colors.textLight}
          value={guardianEmail}
          onChangeText={setGuardianEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          autoComplete="email"
        />
      </View>

      <TouchableOpacity
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={handleInvite}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Send Invite</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: THEME.colors.surface,
    borderRadius: THEME.borderRadius.lg,
    padding: THEME.spacing.lg,
    ...THEME.shadow.md,
  },
  title: {
    fontSize: THEME.fontSize.lg,
    fontWeight: THEME.fontWeight.bold,
    color: THEME.colors.text,
    marginBottom: THEME.spacing.xs,
  },
  subtitle: {
    fontSize: THEME.fontSize.sm,
    color: THEME.colors.textSecondary,
    marginBottom: THEME.spacing.md,
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
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: '#fff',
    fontSize: THEME.fontSize.md,
    fontWeight: THEME.fontWeight.semibold,
  },
});
