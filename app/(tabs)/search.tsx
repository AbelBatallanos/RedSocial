import React from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Search as SearchIcon, Users, TrendingUp } from 'lucide-react-native';
import { COLORS, SIZES, globalStyles } from '../../src/styles/theme';
import { Avatar } from '../../src/components/ui/Avatar';

const SUGGESTIONS = [
  { id: '1', name: 'Carlos Ruiz', username: 'carlos_dev', avatar: 'https://api.dicebear.com/7.x/avataaars/png?seed=carlos' },
  { id: '2', name: 'Laura Gómez', username: 'laura.ux', avatar: 'https://api.dicebear.com/7.x/avataaars/png?seed=laura' },
];

const POPULAR_SEARCHES = ['?? Comida', '?? Series', '?? Tech', '?? Viajes', '? Café'];

export default function SearchScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.title}>Buscar</Text>
        <View style={styles.searchBar}>
          <SearchIcon size={20} stroke={COLORS.textTertiary} style={{ marginRight: 10 }} />
          <TextInput 
            placeholder="Buscar palabras clave o @usuarios..." 
            placeholderTextColor={COLORS.textTertiary}
            style={styles.searchInput}
          />
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <View style={styles.sectionHeader}>
          <Users size={18} stroke={COLORS.primary} style={{ marginRight: 8 }} />
          <Text style={styles.sectionTitle}>Sugerencias para ti</Text>
        </View>
        
        {SUGGESTIONS.map(user => (
          <View key={user.id} style={styles.userItem}>
            <Avatar source={user.avatar} name={user.name} size={52} />
            <View style={styles.userInfo}>
              <Text style={styles.userName}>{user.username}</Text>
              <Text style={styles.fullName}>{user.name}</Text>
            </View>
            <TouchableOpacity style={[styles.followBtn, user.id === '1' && styles.followingBtn]}>
              <Text style={[styles.followBtnText, user.id === '1' && styles.followingBtnText]}>
                {user.id === '1' ? 'Siguiendo' : 'Seguir'}
              </Text>
            </TouchableOpacity>
          </View>
        ))}

        <View style={styles.trendingSection}>
          <View style={styles.sectionHeader}>
            <TrendingUp size={18} stroke={COLORS.primary} style={{ marginRight: 8 }} />
            <Text style={styles.sectionTitle}>Tendencias</Text>
          </View>
          <View style={styles.chipsContainer}>
            {POPULAR_SEARCHES.map(item => (
              <TouchableOpacity key={item} style={styles.chip}>
                <Text style={styles.chipText}>{item}</Text>
              </TouchableOpacity>
            ))}
          </View>
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
    padding: SIZES.md,
  },
  title: {
    ...globalStyles.title,
    marginBottom: SIZES.md,
    fontSize: 24,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: 18,
    paddingHorizontal: SIZES.md,
    height: 54,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  content: {
    padding: SIZES.md,
    paddingBottom: 100,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SIZES.md,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: COLORS.textPrimary,
  },
  userItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SIZES.md,
    backgroundColor: COLORS.surface,
    padding: SIZES.sm,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  userInfo: {
    flex: 1,
    marginLeft: SIZES.sm,
  },
  userName: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  fullName: {
    fontSize: 13,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  followBtn: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
  },
  followingBtn: {
    backgroundColor: COLORS.surfaceAlt,
  },
  followBtnText: {
    color: COLORS.textPrimary,
    fontSize: 13,
    fontWeight: '900',
  },
  followingBtnText: {
    color: COLORS.textSecondary,
  },
  trendingSection: {
    marginTop: SIZES.xl,
    padding: SIZES.lg,
    backgroundColor: COLORS.surface,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SIZES.sm,
  },
  chip: {
    backgroundColor: COLORS.background,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  chipText: {
    fontSize: 14,
    color: COLORS.textPrimary,
    fontWeight: '700',
  },
});
