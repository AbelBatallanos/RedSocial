import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, KeyboardAvoidingView, Platform, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter, Link } from 'expo-router';
import { Button } from '../../src/components/ui/Button';
import { Input } from '../../src/components/ui/Input';
import { COLORS, SIZES, globalStyles } from '../../src/styles/theme';

export default function RegisterScreen() {
  const router = useRouter();
  const [form, setForm] = useState({
    fullName: '',
    username: '',
    email: '',
    password: ''
  });

  const handleRegister = () => {
    router.push('/(auth)/interests');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView 
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent} 
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="always" // Importante para que los inputs no pierdan foco
        >
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
              <Text style={styles.backIcon}>←</Text>
            </TouchableOpacity>
            
            <Text style={styles.title}>Crea tu{'\n'}cuenta.</Text>
            <Text style={styles.subtitle}>Únete a la comunidad de curadores.</Text>
          </View>

          <View style={styles.formContainer}>
            <Input
              placeholder="Nombre completo"
              value={form.fullName}
              onChangeText={(val) => setForm({...form, fullName: val})}
            />
            <Input
              placeholder="Nombre de usuario"
              autoCapitalize="none"
              value={form.username}
              onChangeText={(val) => setForm({...form, username: val})}
            />
            <Input
              placeholder="Correo electrónico"
              keyboardType="email-address"
              autoCapitalize="none"
              value={form.email}
              onChangeText={(val) => setForm({...form, email: val})}
            />
            <Input
              placeholder="Contraseña"
              isPassword
              value={form.password}
              onChangeText={(val) => setForm({...form, password: val})}
            />
            
            <Button 
              title="Crear cuenta" 
              onPress={handleRegister}
              style={styles.registerButton}
            />
          </View>

          <Text style={styles.termsText}>
            Al registrarte, aceptas nuestros <Text style={styles.termsLink}>Términos</Text> y <Text style={styles.termsLink}>Política de Privacidad</Text>.
          </Text>
        </ScrollView>

        <View style={styles.footer}>
          <Text style={styles.footerText}>¿Ya tienes una cuenta? </Text>
          <Link href="/(auth)/login" asChild>
            <TouchableOpacity>
              <Text style={styles.footerLink}>Inicia sesión</Text>
            </TouchableOpacity>
          </Link>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.surface },
  keyboardView: { flex: 1 },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: SIZES.lg,
    paddingTop: SIZES.lg,
    paddingBottom: 40,
  },
  header: { marginBottom: SIZES.xl },
  backButton: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: COLORS.background,
    justifyContent: 'center', alignItems: 'center',
    marginBottom: SIZES.lg,
  },
  backIcon: { fontSize: 20, color: COLORS.textPrimary },
  title: { ...globalStyles.title, fontSize: 36, marginBottom: SIZES.sm },
  subtitle: { ...globalStyles.subtitle, fontSize: 16 },
  formContainer: { marginBottom: SIZES.xl },
  registerButton: { marginTop: SIZES.md },
  termsText: {
    textAlign: 'center', fontSize: 12,
    color: COLORS.textSecondary, paddingHorizontal: SIZES.lg,
  },
  termsLink: { textDecorationLine: 'underline', fontWeight: '600' },
  footer: {
    flexDirection: 'row', justifyContent: 'center',
    paddingVertical: SIZES.lg, borderTopWidth: 1,
    borderTopColor: COLORS.background, backgroundColor: COLORS.surface,
  },
  footerText: { color: COLORS.textSecondary, fontSize: 15 },
  footerLink: { color: COLORS.primary, fontSize: 15, fontWeight: 'bold' },
});