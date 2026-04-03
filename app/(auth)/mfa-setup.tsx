import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { router } from 'expo-router';
import { useAuth } from '@/src/contexts';
import { setupMFA, sendMFACode, verifyMFACode, verifyMFA } from '@/src/firebase';
import { THEME } from '@/constants/theme';
import { RecaptchaVerifier } from 'firebase/auth';
import { auth } from '@/src/firebase/config';

export default function MFASetupScreen() {
  const { user, appUser, refreshUser } = useAuth();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [verificationId, setVerificationId] = useState('');
  const [step, setStep] = useState<'phone' | 'code'>('phone');
  const [loading, setLoading] = useState(false);

  const handleSendCode = async () => {
    if (!phoneNumber || phoneNumber.length < 10) {
      Alert.alert('Error', 'Please enter a valid phone number');
      return;
    }

    setLoading(true);
    try {
      if (!user || !appUser) return;

      const formattedPhone = phoneNumber.startsWith('+') ? phoneNumber : `+1${phoneNumber}`;

      const recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        size: 'invisible',
      });

      const { sendMFACode: sendCode } = await import('@/src/firebase');
      const vId = await sendCode(formattedPhone, recaptchaVerifier);
      setVerificationId(vId);
      setStep('code');
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to send verification code');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async () => {
    if (!verificationCode || verificationCode.length !== 6) {
      Alert.alert('Error', 'Please enter the 6-digit code');
      return;
    }

    setLoading(true);
    try {
      if (!user || !appUser) return;

      await verifyMFACode(verificationId, verificationCode);
      await setupMFA(appUser.districtId, user.uid, phoneNumber);
      await verifyMFA(appUser.districtId, user.uid);
      await refreshUser();

      Alert.alert('Success', 'Phone verification complete!', [
        { text: 'OK', onPress: () => router.replace('/(tabs)' as any) },
      ]);
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Invalid verification code');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View id="recaptcha-container" />
      <View style={styles.header}>
        <Text style={styles.title}>Set Up Two-Factor Authentication</Text>
        <Text style={styles.subtitle}>
          {step === 'phone'
            ? 'Enter your phone number to receive a verification code'
            : 'Enter the 6-digit code sent to your phone'}
        </Text>
      </View>

      <View style={styles.form}>
        {step === 'phone' ? (
          <>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Phone Number</Text>
              <TextInput
                style={styles.input}
                placeholder="+1 (555) 123-4567"
                placeholderTextColor={THEME.colors.textLight}
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                keyboardType="phone-pad"
                autoComplete="tel"
              />
            </View>
            <TouchableOpacity
              style={[styles.button, loading && styles.buttonDisabled]}
              onPress={handleSendCode}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Send Code</Text>
              )}
            </TouchableOpacity>
          </>
        ) : (
          <>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Verification Code</Text>
              <TextInput
                style={styles.input}
                placeholder="123456"
                placeholderTextColor={THEME.colors.textLight}
                value={verificationCode}
                onChangeText={setVerificationCode}
                keyboardType="number-pad"
                maxLength={6}
              />
            </View>
            <TouchableOpacity
              style={[styles.button, loading && styles.buttonDisabled]}
              onPress={handleVerifyCode}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Verify</Text>
              )}
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.linkButton}
              onPress={() => setStep('phone')}
            >
              <Text style={styles.linkText}>Change Phone Number</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.colors.background,
    padding: THEME.spacing.lg,
    justifyContent: 'center',
  },
  header: {
    marginBottom: THEME.spacing.xxl,
  },
  title: {
    fontSize: THEME.fontSize.xxl,
    fontWeight: THEME.fontWeight.bold,
    color: THEME.colors.text,
    marginBottom: THEME.spacing.sm,
  },
  subtitle: {
    fontSize: THEME.fontSize.md,
    color: THEME.colors.textSecondary,
  },
  form: {
    backgroundColor: THEME.colors.surface,
    borderRadius: THEME.borderRadius.lg,
    padding: THEME.spacing.lg,
    ...THEME.shadow.md,
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
});
