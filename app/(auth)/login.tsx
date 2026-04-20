import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useRouter, Link } from 'expo-router';
import { Button } from '../../src/components/ui/Button';
import { Input } from '../../src/components/ui/Input';
import { COLORS, SIZES, globalStyles } from '../../src/styles/theme';

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    // Aquí irá la lógica de autenticación real
    router.push('/(auth)/interests');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView 
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          {/* Header & Logo */}
          <View style={styles.header}>
            <View style={styles.logoContainer}>
              <View style={styles.logoBox}>
                <Text style={styles.logoIcon}>📍</Text>
              </View>
            </View>
            <Text style={styles.title}>Bienvenido a{'\n'}RecTrack.</Text>
            <Text style={styles.subtitle}>Tus amigos confían en tus gustos.</Text>
          </View>

          {/* Social Auth */}
          <View style={styles.socialAuth}>
            <Button 
              title="Continuar con Google" 
              variant="outline"
              onPress={() => {}}
              style={styles.googleButton}
              icon={<Text style={{ fontSize: 18, marginRight: 8 }}>G</Text>}
            />
          </View>

          {/* Divider */}
          <View style={styles.dividerContainer}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>O USA TU EMAIL</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Form */}
          <View style={styles.formContainer}>
            <Input
              placeholder="Correo electrónico"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
            />
            <Input
              placeholder="Contraseña"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
            
            <Button 
              title="Iniciar sesión" 
              onPress={handleLogin}
              style={styles.loginButton}
            />
          </View>

        </ScrollView>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>¿No tienes cuenta? </Text>
          <Link href="/(auth)/register" asChild>
            <Text style={styles.footerLink}>Regístrate</Text>
          </Link>
        </View>

      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.surface,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: SIZES.lg,
    paddingTop: SIZES.xl * 2,
    paddingBottom: SIZES.xl,
  },
  header: {
    marginBottom: SIZES.xl,
  },
  logoContainer: {
    marginBottom: SIZES.lg,
  },
  logoBox: {
    width: 56,
    height: 56,
    backgroundColor: COLORS.primary,
    borderRadius: SIZES.radiusLg,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  logoIcon: {
    fontSize: 24,
    color: COLORS.surface,
  },
  title: {
    ...globalStyles.title,
    fontSize: 36,
    lineHeight: 42,
    marginBottom: SIZES.sm,
  },
  subtitle: {
    ...globalStyles.subtitle,
    fontSize: 16,
  },
  socialAuth: {
    marginBottom: SIZES.lg,
  },
  googleButton: {
    borderColor: COLORS.border,
    backgroundColor: COLORS.surface,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SIZES.lg,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.border,
  },
  dividerText: {
    marginHorizontal: SIZES.md,
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textTertiary,
    letterSpacing: 1,
  },
  formContainer: {
    marginBottom: SIZES.xl,
  },
  loginButton: {
    marginTop: SIZES.sm,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: SIZES.lg,
    paddingBottom: Platform.OS === 'ios' ? SIZES.xl : SIZES.lg,
    backgroundColor: COLORS.surface,
    borderTopWidth: 1,
    borderTopColor: COLORS.background,
  },
  footerText: {
    color: COLORS.textSecondary,
    fontSize: 15,
  },
  footerLink: {
    color: COLORS.primary,
    fontSize: 15,
    fontWeight: 'bold',
  },
});
