import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Button } from '../../src/components/ui/Button';
import { COLORS, SIZES, globalStyles } from '../../src/styles/theme';

const INTERESTS = [
  { id: '1', name: '☕ Cafeterías' },
  { id: '2', name: '📺 Series' },
  { id: '3', name: '🍽️ Restaurantes' },
  { id: '4', name: '📱 Tecnología' },
  { id: '5', name: '📚 Libros' },
  { id: '6', name: '✈️ Viajes' },
  { id: '7', name: '🎵 Música' },
  { id: '8', name: '🏋️‍♂️ Fitness' },
];

export default function InterestsScreen() {
  const router = useRouter();
  const [selectedInterests, setSelectedInterests] = useState<string[]>(['1', '2']); // Simula algunos seleccionados

  const toggleInterest = (id: string) => {
    setSelectedInterests(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleContinue = () => {
    // Aquí iría la navegación hacia el home o main tabs
    // Por ahora, como es diseño, lo dejamos listo para cuando hagamos los tabs
    router.replace('/(tabs)');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Tus intereses</Text>
          <Text style={styles.subtitle}>
            Selecciona los temas que más te gustan para personalizar tus recomendaciones.
          </Text>
        </View>

        {/* Chips Container */}
        <View style={styles.chipsContainer}>
          {INTERESTS.map((interest) => {
            const isSelected = selectedInterests.includes(interest.id);
            return (
              <TouchableOpacity
                key={interest.id}
                style={[
                  styles.chip,
                  isSelected ? styles.chipSelected : styles.chipUnselected
                ]}
                onPress={() => toggleInterest(interest.id)}
                activeOpacity={0.7}
              >
                <Text 
                  style={[
                    styles.chipText,
                    isSelected ? styles.chipTextSelected : styles.chipTextUnselected
                  ]}
                >
                  {interest.name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

      </ScrollView>

      {/* Footer Buttons */}
      <View style={styles.footer}>
        <Button 
          title="Continuar" 
          onPress={handleContinue}
        />
        <Button 
          title="Omitir por ahora" 
          variant="ghost"
          onPress={handleContinue}
          style={styles.skipButton}
          textStyle={styles.skipText}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.surface,
  },
  scrollContent: {
    paddingHorizontal: SIZES.lg,
    paddingTop: SIZES.xl * 1.5,
    paddingBottom: SIZES.xl,
  },
  header: {
    marginBottom: SIZES.xl,
  },
  title: {
    ...globalStyles.title,
    marginBottom: SIZES.sm,
  },
  subtitle: {
    ...globalStyles.subtitle,
    lineHeight: 22,
  },
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SIZES.sm,
  },
  chip: {
    paddingVertical: SIZES.sm,
    paddingHorizontal: SIZES.md,
    borderRadius: SIZES.radiusRound,
    borderWidth: 1,
    marginBottom: SIZES.xs,
  },
  chipSelected: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  chipUnselected: {
    backgroundColor: COLORS.surface,
    borderColor: COLORS.border,
  },
  chipText: {
    fontSize: 15,
    fontWeight: '500',
  },
  chipTextSelected: {
    color: COLORS.surface,
  },
  chipTextUnselected: {
    color: COLORS.textPrimary,
  },
  footer: {
    padding: SIZES.lg,
    paddingBottom: SIZES.xl,
    backgroundColor: COLORS.surface,
  },
  skipButton: {
    marginTop: SIZES.xs,
  },
  skipText: {
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
});