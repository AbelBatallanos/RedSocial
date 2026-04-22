import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, ViewStyle, TextStyle } from 'react-native';
import { COLORS, SIZES } from '../../styles/theme';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  isLoading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  icon?: React.ReactNode;
}

export const Button = ({
  title,
  onPress,
  variant = 'primary',
  isLoading = false,
  disabled = false,
  style,
  textStyle,
  icon,
}: ButtonProps) => {
  const getBackgroundColor = () => {
    if (disabled) return COLORS.textTertiary;
    switch (variant) {
      case 'primary': return COLORS.primary;
      case 'secondary': return COLORS.secondary;
      case 'outline': return 'transparent';
      case 'ghost': return 'transparent';
      default: return COLORS.primary;
    }
  };

  const getTextColor = () => {
    if (disabled) return COLORS.surface;
    switch (variant) {
      case 'primary': return COLORS.surface;
      case 'secondary': return COLORS.surface;
      case 'outline': return COLORS.textPrimary;
      case 'ghost': return COLORS.primary;
      default: return COLORS.surface;
    }
  };

  const getBorderColor = () => {
    if (variant === 'outline') return COLORS.border;
    return 'transparent';
  };

  return (
    <TouchableOpacity
      style={[
        styles.button,
        {
          backgroundColor: getBackgroundColor(),
          borderColor: getBorderColor(),
          borderWidth: variant === 'outline' ? 1 : 0,
        },
        style,
      ]}
      onPress={onPress}
      disabled={disabled || isLoading}
      activeOpacity={0.8}
    >
      {isLoading ? (
        <ActivityIndicator color={getTextColor()} />
      ) : (
        <>
          {icon && <React.Fragment>{icon}</React.Fragment>}
          <Text
            style={[
              styles.text,
              {
                color: getTextColor(),
                marginLeft: icon ? SIZES.sm : 0,
              },
              textStyle,
            ]}
          >
            {title}
          </Text>
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    height: 56,
    borderRadius: SIZES.radiusLg,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SIZES.lg,
    width: '100%',
  },
  text: {
    fontSize: 16,
    fontWeight: '600',
  },
});
