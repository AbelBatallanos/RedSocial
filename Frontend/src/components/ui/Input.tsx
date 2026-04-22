import React from 'react';
import { View, TextInput, Text, StyleSheet, TextInputProps } from 'react-native';
import { COLORS, SIZES } from '../../styles/theme';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  isPassword?: boolean;
}

export const Input = ({ label, error, isPassword, style, ...props }: InputProps) => {
  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={[
        styles.inputWrapper,
        error ? styles.inputError : null,
      ]}>
        <TextInput
          style={[styles.input, style]}
          placeholderTextColor={COLORS.textTertiary}
          secureTextEntry={isPassword}
          autoCorrect={false} // Evita sugerencias que a veces cierran el teclado
          spellCheck={false}
          {...props}
        />
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: SIZES.md,
    width: '100%',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: SIZES.xs,
  },
  inputWrapper: {
    height: 56,
    backgroundColor: COLORS.background, // Mantenemos tu color de fondo
    borderRadius: SIZES.md,
    borderWidth: 1.5,
    borderColor: COLORS.background, // Borde sutil por defecto
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SIZES.md,
    // Eliminamos sombras dinámicas aquí para evitar el error del teclado
  },
  input: {
    flex: 1,
    color: COLORS.textPrimary,
    fontSize: 16,
  },
  inputError: {
    borderColor: COLORS.error,
  },
  errorText: {
    color: COLORS.error,
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
});