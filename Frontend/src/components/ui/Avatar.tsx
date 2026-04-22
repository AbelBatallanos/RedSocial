import React from 'react';
import { View, Image, StyleSheet, Text } from 'react-native';
import { COLORS, SIZES } from '../../styles/theme';

interface AvatarProps {
  size?: number;
  source?: string;
  name?: string;
}

export const Avatar = ({ size = 40, source, name }: AvatarProps) => {
  // Aseguramos que el nombre no tenga caracteres especiales para la URL
  const safeName = name ? name.replace(/[^\w\s]/gi, '') : 'default';
  const diceBearUrl = `https://api.dicebear.com/7.x/avataaars/png?seed=${safeName}&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf`;

  return (
    <View style={[styles.container, { width: size, height: size, borderRadius: size / 2 }]}>
      <Image 
        source={{ uri: source || diceBearUrl }} 
        style={{ width: size, height: size, borderRadius: size / 2 }} 
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    backgroundColor: COLORS.background,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.2)',
  },
});
