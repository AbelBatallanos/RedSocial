import { StyleSheet } from 'react-native';

// Tema Oscuro Moderno Unificado (Slate Dark)
export const COLORS = {
  primary: '#6366F1', // Indigo Elctrico
  primaryLight: 'rgba(99, 102, 241, 0.15)',
  secondary: '#F43F5E', // Rosa Vibrante
  accent: '#10B981', // Esmeralda
  error: '#F43F5E',
  
  background: '#0F172A', // Slate 900 (Fondo Principal)
  surface: '#1E293B',    // Slate 800 (Tarjetas y Headers)
  surfaceAlt: '#334155', // Slate 700 (Botones secundarios)
  
  textPrimary: '#F8FAFC',   // Slate 50
  textSecondary: '#CBD5E1', // Slate 300
  textTertiary: '#64748B',  // Slate 500
  
  border: 'rgba(255, 255, 255, 0.05)',
  borderLight: 'rgba(255, 255, 255, 0.1)',
};

export const SIZES = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 40,
  
  radiusSm: 8,
  radiusMd: 12,
  radiusLg: 20,
  radiusXl: 28,
  radiusRound: 9999,
};

export const globalStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radiusLg,
    padding: SIZES.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  title: {
    fontSize: 28,
    fontWeight: '900',
    color: COLORS.textPrimary,
    letterSpacing: -1,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.textSecondary,
    lineHeight: 22,
  },
});
