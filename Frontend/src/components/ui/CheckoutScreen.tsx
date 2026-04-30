// src/screens/CheckoutScreen.tsx
import React, { useState } from 'react';
import { 
  View, Text, TextInput, TouchableOpacity, StyleSheet, 
  ActivityIndicator, Alert, SafeAreaView 
} from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronLeft, CreditCard, Calendar, Lock } from 'lucide-react-native';
import { COLORS, SIZES } from '../../styles/theme'; 
import { activarPremium, getAuthToken } from '../../services/api';
import { useAuthContext } from '../../context/AuthContext';

export const CheckoutScreen = () => {
  const router = useRouter();
  const { user, token, login } = useAuthContext();
  
  const [loading, setLoading] = useState(false);
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');

  // 1. Función para formatear tarjeta con espacios cada 4 dígitos
  const handleCardNumberChange = (text: string) => {
    // Quitamos cualquier cosa que no sea número
    const cleaned = text.replace(/\D/g, '');
    // Agregamos un espacio cada 4 dígitos y quitamos espacios extra al final
    const formatted = cleaned.replace(/(\d{4})/g, '$1 ').trim();
    setCardNumber(formatted);
  };

  // 2. Función para auto-completar la fecha de expiración con la barra "/"
  const handleExpiryChange = (text: string) => {
    const cleaned = text.replace(/\D/g, '');
    if (cleaned.length >= 3) {
      setExpiry(`${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}`);
    } else {
      setExpiry(cleaned);
    }
  };

  const handlePayment = async () => {
    // Validaciones visuales ajustadas por los espacios agregados
    if (cardNumber.length < 19 || expiry.length < 5 || cvv.length < 3) {
      Alert.alert('Datos incompletos', 'Por favor, llena los datos de tu tarjeta correctamente.');
      return;
    }

    setLoading(true);

    setTimeout(async () => {
      const token = await getAuthToken();
      if (token) {
        const result = await activarPremium(token);
        setLoading(false);

        if (result.success) {
            if (user) {
            await login(token, { ...user, has_premium: true });
          }
          Alert.alert(
            '¡Pago Exitoso!',
            'Felicidades, ya eres Vibes+ Premium. Disfruta tus beneficios.',
            [
              { 
                text: 'OK', 
                onPress: () => {
                  router.replace('/'); 
                }
              }
            ]
          );
        } else if (JSON.stringify(result.data).includes('Premium')) {
          
          // 🔥 EL TRUCO: Si el backend dice que YA eras premium, 
          // igual le forzamos el check azul al frontend
          if (user) {
            await login(token, { ...user, has_premium: true });
          }

          Alert.alert(
            'Suscripción Activa',
            'Tu cuenta ya contaba con Vibes+ Premium. ¡Disfruta tus beneficios!',
            [ { text: 'OK', onPress: () => router.replace('/') } ]
          );

        } else {
          // Si es cualquier otro error real
          console.log("DETALLE DEL ERROR:", result);
          Alert.alert('Error', 'Hubo un problema procesando tu suscripción.');
        }
      } else {
        setLoading(false);
        Alert.alert('Error', 'No se encontró tu sesión.');
      }
    }, 1500);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <ChevronLeft size={24} stroke={COLORS.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Checkout</Text>
        <View style={{ width: 40 }} /> 
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>Plan Vibes+ Mensual</Text>
        <Text style={styles.price}>$2.99 <Text style={styles.period}>/mes</Text></Text>

        <View style={styles.formContainer}>
          <Text style={styles.label}>Número de Tarjeta</Text>
          <View style={styles.inputWrapper}>
            <CreditCard size={20} stroke={COLORS.textTertiary} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="0000 0000 0000 0000"
              placeholderTextColor={COLORS.textTertiary}
              keyboardType="numeric"
              maxLength={19} // 16 números + 3 espacios
              value={cardNumber}
              onChangeText={handleCardNumberChange} // Usamos la nueva función
            />
          </View>

          <View style={styles.row}>
            {/* Expiración con el nuevo diseño */}
            <View style={styles.halfInput}>
              <Text style={styles.label}>Expiración</Text>
              <View style={styles.inputWrapper}>
                <Calendar size={18} stroke={COLORS.textTertiary} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="MM/YY"
                  placeholderTextColor={COLORS.textTertiary}
                  keyboardType="numeric"
                  maxLength={5}
                  value={expiry}
                  onChangeText={handleExpiryChange} // Usamos la nueva función
                />
              </View>
            </View>

            {/* CVV con el nuevo diseño */}
            <View style={styles.halfInput}>
              <Text style={styles.label}>CVV</Text>
              <View style={styles.inputWrapper}>
                <Lock size={18} stroke={COLORS.textTertiary} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="123"
                  placeholderTextColor={COLORS.textTertiary}
                  keyboardType="numeric"
                  maxLength={4}
                  secureTextEntry
                  value={cvv}
                  onChangeText={setCvv}
                />
              </View>
            </View>
          </View>
        </View>

        <TouchableOpacity 
          style={[styles.payBtn, loading && styles.payBtnDisabled]} 
          onPress={handlePayment}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color={COLORS.surface} />
          ) : (
            <Text style={styles.payBtnText}>Pagar $2.99</Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SIZES.lg,
    paddingVertical: SIZES.md,
  },
  backBtn: {
    padding: 8,
    backgroundColor: COLORS.surface, 
    borderRadius: 12,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  content: {
    padding: SIZES.xl,
  },
  title: {
    fontSize: 24,
    fontWeight: '900',
    color: COLORS.textPrimary,
    marginBottom: 8,
  },
  price: {
    fontSize: 32,
    fontWeight: '900',
    color: COLORS.primary,
    marginBottom: SIZES.xxl,
  },
  period: {
    fontSize: 16,
    color: COLORS.textTertiary,
  },
  formContainer: {
    gap: SIZES.lg,
    marginBottom: SIZES.xxl,
  },
  label: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.textSecondary,
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.surface,
    paddingHorizontal: SIZES.md,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 56,
    color: COLORS.textPrimary,
    fontSize: 16,
    fontWeight: '600',
  },
  row: {
    flexDirection: 'row',
    gap: SIZES.md,
  },
  halfInput: {
    flex: 1,
  },
  payBtn: {
    backgroundColor: COLORS.primary,
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  payBtnDisabled: {
    opacity: 0.7,
  },
  payBtnText: {
    color: COLORS.surface,
    fontSize: 18,
    fontWeight: '900',
  },
});