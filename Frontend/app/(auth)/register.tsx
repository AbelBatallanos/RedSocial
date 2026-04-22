import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, KeyboardAvoidingView, Platform, ScrollView, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useRouter, Link } from 'expo-router';
import { Button } from '../../src/components/ui/Button';
import { Input } from '../../src/components/ui/Input';
import { COLORS, SIZES, globalStyles } from '../../src/styles/theme';

// LOGICA: Importamos servicios
import { useAuthContext } from '../../src/context/AuthContext';
import { API_URL } from '../../src/services/api';

export default function RegisterScreen() {
  const router = useRouter();
  const { login } = useAuthContext();
  
  const [form, setForm] = useState({
    // fullName: '',
    username: '',
    email: '',
    password: '',
    // birthDate: '',
  });

  const [loading, setLoading] = useState(false);

  // LOGICA: Convierte DD/MM/AAAA a AAAA-MM-DD para el Backend
  const formatBackendDate = (dateStr: string) => {
    const parts = dateStr.split('/');
    if (parts.length !== 3) return null;
    const [day, month, year] = parts;
    if (day.length !== 2 || month.length !== 2 || year.length !== 4) return null;
    return `${year}-${month}-${day}`;
  };

  const handleRegister = async () => {
    // const backendDate = formatBackendDate(form.birthDate);

    // // 1. Validaciones
    // if (!form.username || !form.email || !form.password || !backendDate) {
    //   Alert.alert('Atención', 'Por favor ingresa usuario, email, contraseña y fecha válida (DD/MM/AAAA)');
    //   return;
    // }

    console.log("📝 Intentando registrar:");
    console.log("Usuario:", form.username);
    console.log("Password:", form.password);
    console.log("Email:", form.email);

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('correo', form.email);
      formData.append('nombre_usuario', form.username);
      formData.append('password', form.password);
      // formData.append('fecha_nacimiento', backendDate);
      // formData.append('biografia', form.fullName ? `Hola, soy ${form.fullName}` : "");

      const response = await fetch(`${API_URL}/usuarios/register/`, {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json',
        },
      });

      const data = await response.json();

      if (response.ok) {
        login(data.tokens.access, data.user);
        Alert.alert('¡Éxito!', 'Cuenta creada correctamente.');
        router.replace('/(auth)/interests');
      } else {
        // Mostramos el error específico del backend (ej: correo ya registrado)
        Alert.alert('Error al registrar', data.error || 'Verifica los datos ingresados.');
      }
    } catch (error) {
      Alert.alert('Error', 'No se pudo conectar con el servidor.');
    } finally {
      setLoading(false);
    }
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
          keyboardShouldPersistTaps="always"
        >
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
              <Text style={styles.backIcon}>←</Text>
            </TouchableOpacity>
            
            <Text style={styles.title}>Crea tu{'\n'}cuenta.</Text>
            <Text style={styles.subtitle}>Únete a la comunidad de curadores.</Text>
          </View>

          <View style={styles.formContainer}>
            {/* <Input
              placeholder="Nombre completo"
              value={form.fullName}
              onChangeText={(val) => setForm({...form, fullName: val})}
            /> */}
            <Input
              placeholder="Nombre de usuario"
              autoCapitalize="none"
              value={form.username}
              onChangeText={(val) => setForm({...form, username: val})}
            />
            {/* <Input
              placeholder="Fecha de Nacimiento (DD/MM/AAAA)"
              keyboardType="numeric"
              value={form.birthDate}
              onChangeText={(val) => {
                // Lógica de auto-formateo de barras /
                let cleaned = val.replace(/\D/g, '');
                if (cleaned.length > 8) cleaned = cleaned.substring(0, 8);
                let formatted = cleaned;
                if (cleaned.length > 2) formatted = cleaned.substring(0, 2) + '/' + cleaned.substring(2);
                if (cleaned.length > 4) formatted = formatted.substring(0, 5) + '/' + formatted.substring(5);
                setForm({...form, birthDate: formatted});
              }}
            /> */}
            <Input
              placeholder="Correo electrónico"
              keyboardType="email-address"
              autoCapitalize="none"
              value={form.email}
              onChangeText={(val) => setForm({...form, email: val})}
            />
            <Input
              placeholder="Contraseña"
              secureTextEntry
              value={form.password}
              onChangeText={(val) => setForm({...form, password: val})}
            />
            
            <Button 
              title={loading ? "" : "Crear cuenta"} 
              onPress={handleRegister}
              style={styles.registerButton}
              disabled={loading}
              icon={loading ? <ActivityIndicator color={COLORS.surface} /> : null}
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

// ESTILOS: Mantenemos tus estilos originales intactos
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