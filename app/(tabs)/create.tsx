import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { X, ChevronDown, MapPin, Star, Image as ImageIcon, Tag } from 'lucide-react-native';
import { COLORS, SIZES, globalStyles } from '../../src/styles/theme';
import { Avatar } from '../../src/components/ui/Avatar';

export default function CreateScreen() {
  const insets = useSafeAreaInsets();
  const [recommendation, setRecommendation] = useState('');

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.closeBtn}>
          <X size={24} stroke={COLORS.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Nueva Recomendaci�n</Text>
        <TouchableOpacity style={styles.publishBtn}>
          <Text style={styles.publishBtnText}>Publicar</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.userRow}>
          <Avatar name="Diego UX" size={56} />
          <View style={styles.userText}>
            <Text style={styles.userName}>Tú</Text>
            <TouchableOpacity style={styles.categoryPicker}>
              <Text style={styles.categoryText}># Restaurantes</Text>
              <ChevronDown size={14} stroke={COLORS.primary} style={{ marginLeft: 4 }} />
            </TouchableOpacity>
          </View>
        </View>

        <TextInput
          style={styles.textInput}
          placeholder="Ej. La Esquina del Sabor\n�Por qu� lo recomiendas a tus amigos?..."
          placeholderTextColor={COLORS.textTertiary}
          multiline
          value={recommendation}
          onChangeText={setRecommendation}
          autoFocus
        />

        <View style={styles.attachmentContainer}>
          <TouchableOpacity style={styles.locationTag}>
            <MapPin size={16} stroke={COLORS.primary} />
            <Text style={styles.locationText}>Santa Cruz</Text>
            <TouchableOpacity>
              <X size={14} stroke={COLORS.textTertiary} style={{ marginLeft: 6 }} />
            </TouchableOpacity>
          </TouchableOpacity>
          
          <View style={styles.ratingRow}>
            <View style={styles.stars}>
              {[1, 2, 3, 4].map(s => (
                <Star key={s} size={24} stroke="#FFD700" fill="#FFD700" style={{ marginRight: 6 }} />
              ))}
              <Star size={24} stroke={COLORS.textTertiary} style={{ marginRight: 6 }} />
            </View>
            <Text style={styles.ratingText}>4.0</Text>
          </View>
        </View>

        <View style={styles.footerIcons}>
          <TouchableOpacity style={styles.iconBtn}>
            <ImageIcon size={28} stroke={COLORS.primary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconBtn}>
            <MapPin size={28} stroke={COLORS.textSecondary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconBtn}>
            <Star size={28} stroke={COLORS.textSecondary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconBtn}>
            <Tag size={28} stroke={COLORS.textSecondary} />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SIZES.md,
    height: 64,
  },
  closeBtn: {
    width: 40,
    height: 40,
    backgroundColor: COLORS.surface,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '900',
    color: COLORS.textPrimary,
  },
  publishBtn: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 14,
  },
  publishBtnText: {
    color: COLORS.surface,
    fontSize: 14,
    fontWeight: '900',
  },
  content: {
    padding: SIZES.md,
  },
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SIZES.xl,
  },
  userText: {
    marginLeft: SIZES.md,
  },
  userName: {
    fontSize: 18,
    fontWeight: '900',
    color: COLORS.textPrimary,
  },
  categoryPicker: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    marginTop: 6,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  categoryText: {
    fontSize: 13,
    color: COLORS.primary,
    fontWeight: '800',
  },
  textInput: {
    fontSize: 19,
    color: COLORS.textPrimary,
    minHeight: 180,
    textAlignVertical: 'top',
    lineHeight: 28,
    marginBottom: SIZES.xl,
    fontWeight: '600',
  },
  attachmentContainer: {
    backgroundColor: COLORS.surface,
    borderRadius: 24,
    padding: SIZES.lg,
    marginBottom: SIZES.xl,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  locationTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    alignSelf: 'flex-start',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 14,
    marginBottom: SIZES.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  locationText: {
    fontSize: 14,
    color: COLORS.textPrimary,
    fontWeight: '700',
    marginHorizontal: 8,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stars: {
    flexDirection: 'row',
    marginRight: SIZES.md,
  },
  ratingText: {
    fontSize: 18,
    fontWeight: '900',
    color: COLORS.textPrimary,
  },
  footerIcons: {
    flexDirection: 'row',
    paddingTop: SIZES.xl,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    justifyContent: 'space-around',
  },
  iconBtn: {
    padding: 10,
  },
});
