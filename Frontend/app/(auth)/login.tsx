import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, KeyboardAvoidingView, Platform, ScrollView, TouchableOpacity, Alert, ActivityIndicator} from 'react-native';
import { useRouter, Link } from 'expo-router';
import { Button } from '../../src/components/ui/Button';
import { Input } from '../../src/components/ui/Input';
import { COLORS, SIZES, globalStyles } from '../../src/styles/theme';

import { useAuthContext } from '../../src/context/AuthContext';
import { loginUsuario } from '../../src/services/api';

export default function LoginScreen() {
  const router = useRouter();
  const { login } = useAuthContext();

  // Agrupamos el estado para evitar re-renders innecesarios que cierran el teclado
  const [form, setForm] = useState({
    correo: '',
    password: ''
  });

  const [loading, setLoading] = useState(false); 

 const handleLogin = async () => {
  if (!form.correo || !form.password) {
    Alert.alert('Atención', 'Ingresa correo y contraseña.');
    return;
  }

  console.log("🚀 Enviando al Backend -> User:", form.correo, "| Pass:", form.password);
  setLoading(true);

  const result = await loginUsuario(form.correo, form.password);
  setLoading(false);

  if (result.success) {
    console.log("✅ Login OK. User Data:", result.data.user);
    // Cambiamos 'correo' por 'nombre_usuario' para ser consistentes con el backend
    login(result.data.access, result.data.user || { nombre_usuario: form.correo });
    router.replace('/(auth)/interests');
  } else {
    console.log("❌ Error en Login:", result.error);
    Alert.alert('Error de Login', result.error);
  }
};

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView 
        style={styles.keyboardView}
        // Usamos 'padding' solo en iOS para que el input no "baile" en Android
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent} 
          showsVerticalScrollIndicator={false}
          // CLAVE: Esto permite que los toques en botones funcionen sin cerrar el teclado antes
          keyboardShouldPersistTaps="always"
        >
          
          {/* Header & Logo - SE MANTIENE TU DISEÑO */}
          <View style={styles.header}>
            <View style={styles.logoContainer}>
              <View style={styles.logoBox}>
                <Text style={styles.logoIcon}>📍</Text>
              </View>
            </View>
            <Text style={styles.title}>Bienvenido a{'\n'}RecTrack.</Text>
            <Text style={styles.subtitle}>Tus amigos confían en tus gustos.</Text>
          </View>         

          {/* Form - TUS INPUTS CON FIX */}
          <View style={styles.formContainer}>
            <Input
              placeholder="Correo electrónico"
              autoCapitalize="none"
              value={form.correo}
              // Actualizamos el estado del objeto de forma limpia
              onChangeText={(val) => setForm({ ...form, correo: val })}
            />
            <Input
              placeholder="Contraseña"
              secureTextEntry
              value={form.password}
              onChangeText={(val) => setForm({ ...form, password: val })}
            />
            
            <Button 
              title={loading ? "" : "Iniciar sesión"} 
              onPress={handleLogin}
              style={styles.loginButton}
              disabled={loading}
              icon={loading ? <ActivityIndicator color={COLORS.surface} /> : null}
            />
          </View>
          
          {/* Divider - TU SEPARADOR */}
          <View style={styles.dividerContainer}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>O CONTINUA CON GOOGLE</Text>
            <View style={styles.dividerLine} />
          </View>

          <View style={styles.socialAuth}>
            <Button 
              title="Continuar con Google" 
              variant="outline"
              onPress={() => {}}
              style={styles.googleButton}
              icon={<Text style={{ fontSize: 18, marginRight: 8, fontWeight: 'bold' }}>G</Text>}
            />
          </View>

        </ScrollView>

        {/* Footer - TU LINK DE REGISTRO */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>¿No tienes cuenta? </Text>
          <Link href="/(auth)/register" asChild>
            <TouchableOpacity>
              <Text style={styles.footerLink}>Regístrate</Text>
            </TouchableOpacity>
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
    paddingTop: SIZES.xl * 1.5, // Ajustado ligeramente para mejor vista
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