import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, KeyboardAvoidingView, Platform, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter, Link } from 'expo-router';
import { Button } from '../../src/components/ui/Button';
import { Input } from '../../src/components/ui/Input';
import { COLORS, SIZES, globalStyles } from '../../src/styles/theme';

export default function RegisterScreen() {
  const router = useRouter();
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = () => {
    // Aquí irá la lógica de registro
    router.push('/(auth)/interests');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView 
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
              <Text style={styles.backIcon}>←</Text>
            </TouchableOpacity>
            
            <Text style={styles.title}>Crea tu{'\n'}cuenta.</Text>
            <Text style={styles.subtitle}>Únete a la comunidad de curadores.</Text>
          </View>

          {/* Form */}
          <View style={styles.formContainer}>
            <Input
              placeholder="Nombre completo"
              autoCapitalize="words"
              value={fullName}
              onChangeText={setFullName}
            />
            <Input
              placeholder="Nombre de usuario"
              autoCapitalize="none"
              value={username}
              onChangeText={setUsername}
            />
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
              title="Crear cuenta" 
              onPress={handleRegister}
              style={styles.registerButton}
            />
          </View>

          {/* Terms */}
          <Text style={styles.termsText}>
            Al registrarte, aceptas nuestros <Text style={styles.termsLink}>Términos</Text> y <Text style={styles.termsLink}>Política de Privacidad</Text>.
          </Text>

        </ScrollView>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>¿Ya tienes una cuenta? </Text>
          <Link href="/" asChild>
            <Text style={styles.footerLink}>Inicia sesión</Text>
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
    paddingTop: SIZES.lg,
    paddingBottom: SIZES.xl,
  },
  header: {
    marginBottom: SIZES.xl,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SIZES.lg,
  },
  backIcon: {
    fontSize: 20,
    color: COLORS.textPrimary,
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
  formContainer: {
    marginBottom: SIZES.xl,
  },
  registerButton: {
    marginTop: SIZES.md,
  },
  termsText: {
    textAlign: 'center',
    fontSize: 12,
    color: COLORS.textSecondary,
    paddingHorizontal: SIZES.lg,
    lineHeight: 18,
  },
  termsLink: {
    textDecorationLine: 'underline',
    fontWeight: '600',
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