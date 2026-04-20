import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft, Bookmark, MoreVertical, Coffee, Clapperboard, Book } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { COLORS, SIZES, globalStyles } from '../src/styles/theme';

const FILTERS = ['Todos', 'Restaurantes', 'Películas', 'Libros'];

const SAVED_ITEMS = [
  { id: '1', title: 'Serie: The Bear', author: 'miguel.torres', category: 'Películas', icon: <Clapperboard size={20} stroke={COLORS.primary} /> },
  { id: '2', title: 'Café Typica', author: 'laura.ux', category: 'Restaurantes', icon: <Coffee size={20} stroke={COLORS.primary} /> },
  { id: '3', title: 'Hábitos Atómicos', author: 'carlos_dev', category: 'Libros', icon: <Book size={20} stroke={COLORS.primary} /> },
];

export default function SavedScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState('Todos');

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <ArrowLeft size={24} stroke={COLORS.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Guardados</Text>
      </View>

      {/* Filters */}
      <View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filtersScroll}>
          {FILTERS.map(filter => (
            <TouchableOpacity 
              key={filter} 
              style={[styles.filterChip, activeFilter === filter && styles.activeFilterChip]}
              onPress={() => setActiveFilter(filter)}
            >
              <Text style={[styles.filterText, activeFilter === filter && styles.activeFilterText]}>{filter}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* List */}
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.listContent}>
        {SAVED_ITEMS.map(item => (
          <TouchableOpacity key={item.id} style={styles.savedItem}>
            <View style={styles.itemIconContainer}>
              {item.icon}
            </View>
            <View style={styles.itemInfo}>
              <Text style={styles.itemTitle}>{item.title}</Text>
              <Text style={styles.itemAuthor}>Recomendado por {item.author}</Text>
            </View>
            <TouchableOpacity>
              <Bookmark size={22} stroke={COLORS.primary} fill={COLORS.primary} />
            </TouchableOpacity>
          </TouchableOpacity>
        ))}
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
    alignItems: 'center',
    paddingHorizontal: SIZES.md,
    height: 64,
  },
  backBtn: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: 20,
    marginRight: SIZES.md,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: COLORS.textPrimary,
  },
  filtersScroll: {
    paddingHorizontal: SIZES.md,
    paddingVertical: SIZES.md,
    gap: SIZES.sm,
  },
  filterChip: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 14,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  activeFilterChip: {
    backgroundColor: COLORS.textPrimary,
  },
  filterText: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.textSecondary,
  },
  activeFilterText: {
    color: COLORS.background,
  },
  listContent: {
    padding: SIZES.md,
  },
  savedItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    padding: SIZES.md,
    borderRadius: 24,
    marginBottom: SIZES.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  itemIconContainer: {
    width: 52,
    height: 52,
    backgroundColor: COLORS.background,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SIZES.md,
  },
  itemInfo: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  itemAuthor: {
    fontSize: 13,
    color: COLORS.textTertiary,
    marginTop: 2,
    fontWeight: '600',
  },
});
