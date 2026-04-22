import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { X, CheckCircle, Sparkles, Zap, ShieldCheck, Star } from 'lucide-react-native';
import { COLORS, SIZES } from '../../styles/theme';

const { height } = Dimensions.get('window');

interface PremiumModalProps {
  isVisible: boolean;
  onClose: () => void;
}

export const PremiumModal = ({ isVisible, onClose }: PremiumModalProps) => {
  const benefits = [
    { id: '1', title: 'Check Azul de Verificación', desc: 'Gana confianza y destaca en las recomendaciones.', icon: <CheckCircle size={20} stroke={COLORS.primary} /> },
    { id: '2', title: 'Monetiza tus Links', desc: 'Recibe comisiones reales por las reservas que generes.', icon: <Zap size={20} stroke={COLORS.primary} /> },
    { id: '3', title: 'Sin Publicidad', desc: 'Disfruta de una experiencia limpia y enfocada.', icon: <ShieldCheck size={20} stroke={COLORS.primary} /> },
    { id: '4', title: 'Soporte Prioritario', desc: 'Atención 24/7 para tus dudas y gestiones.', icon: <Star size={20} stroke={COLORS.primary} /> },
  ];

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContent}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.iconCircle}>
              <Sparkles size={28} stroke={COLORS.surface} fill={COLORS.surface} />
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <X size={24} stroke={COLORS.textSecondary} />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
            <Text style={styles.title}>Vibes+</Text>
            <Text style={styles.subtitle}>Lleva tus recomendaciones al siguiente nivel</Text>

            {/* Benefits List */}
            <View style={styles.benefitsContainer}>
              {benefits.map(benefit => (
                <View key={benefit.id} style={styles.benefitItem}>
                  <View style={styles.benefitIcon}>{benefit.icon}</View>
                  <View style={styles.benefitText}>
                    <Text style={styles.benefitTitle}>{benefit.title}</Text>
                    <Text style={styles.benefitDesc}>{benefit.desc}</Text>
                  </View>
                </View>
              ))}
            </View>

            {/* Pricing Card */}
            <View style={styles.pricingCard}>
              <Text style={styles.planName}>Plan Anual</Text>
              <View style={styles.priceRow}>
                <Text style={styles.price}>$4.99</Text>
                <Text style={styles.period}>/mes</Text>
              </View>
              <Text style={styles.saveBadge}>Ahorra un 20%</Text>
              
              <TouchableOpacity style={styles.subscribeBtn}>
                <Text style={styles.subscribeText}>Suscribirme Ahora</Text>
              </TouchableOpacity>
              <Text style={styles.footerNote}>Cancela en cualquier momento.</Text>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.85)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: COLORS.background,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    height: height * 0.85,
    padding: SIZES.lg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SIZES.xl,
  },
  iconCircle: {
    width: 56,
    height: 56,
    backgroundColor: COLORS.primary,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeBtn: {
    padding: 8,
    backgroundColor: COLORS.surface,
    borderRadius: 20,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: '900',
    color: COLORS.textPrimary,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: 8,
    marginBottom: SIZES.xxl,
    fontWeight: '600',
  },
  benefitsContainer: {
    gap: SIZES.lg,
    marginBottom: SIZES.xxl,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  benefitIcon: {
    width: 44,
    height: 44,
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SIZES.md,
  },
  benefitText: {
    flex: 1,
  },
  benefitTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  benefitDesc: {
    fontSize: 14,
    color: COLORS.textTertiary,
    marginTop: 2,
    fontWeight: '500',
  },
  pricingCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 24,
    padding: SIZES.xl,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.primary + '30',
  },
  planName: {
    fontSize: 14,
    fontWeight: '900',
    color: COLORS.primary,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginTop: 8,
  },
  price: {
    fontSize: 48,
    fontWeight: '900',
    color: COLORS.textPrimary,
  },
  period: {
    fontSize: 18,
    color: COLORS.textTertiary,
    marginLeft: 4,
    fontWeight: '700',
  },
  saveBadge: {
    backgroundColor: COLORS.accent + '20',
    color: COLORS.accent,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 8,
    fontSize: 12,
    fontWeight: '800',
    marginTop: 8,
  },
  subscribeBtn: {
    backgroundColor: COLORS.primary,
    width: '100%',
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: SIZES.xl,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  subscribeText: {
    color: COLORS.surface,
    fontSize: 16,
    fontWeight: '900',
  },
  footerNote: {
    fontSize: 12,
    color: COLORS.textTertiary,
    marginTop: SIZES.md,
    fontWeight: '600',
  },
});
