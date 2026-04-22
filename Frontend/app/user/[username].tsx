import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Image, Platform } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { COLORS, SIZES, globalStyles } from '../../src/styles/theme';
import { Button } from '../../src/components/ui/Button';

export default function UserProfileScreen() {
  const { username } = useLocalSearchParams();
  const router = useRouter();
  
  // Estado para el botón de seguir
  const [isFollowing, setIsFollowing] = useState(false);
  
  // Datos simulados (esto vendrá del backend después)
  const baseFollowers = 1240;
  const followersCount = isFollowing ? baseFollowers + 1 : baseFollowers;

  const toggleFollow = () => {
    setIsFollowing(!isFollowing);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.headerNav}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>@{username}</Text>
        <View style={{ width: 40 }} /> 
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Perfil Header */}
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatarGradient}>
              <View style={styles.avatar}>
                <Text style={styles.avatarInitial}>{(username as string)?.[0]?.toUpperCase() || 'U'}</Text>
              </View>
            </View>
          </View>
          
          <Text style={styles.fullName}>Diego Fernández</Text>
          <Text style={styles.bio}>Amante del café y las buenas recomendaciones. Explorando el mundo un lugar a la vez. ☕️📍</Text>

          {/* Stats */}
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{followersCount}</Text>
              <Text style={styles.statLabel}>Seguidores</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>842</Text>
              <Text style={styles.statLabel}>Siguiendo</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>124</Text>
              <Text style={styles.statLabel}>Recoms</Text>
            </View>
          </View>

          {/* Botón de Seguir Interactivo */}
          <View style={styles.actionsContainer}>
            <TouchableOpacity 
              style={[
                styles.followButton, 
                isFollowing && styles.followingButtonActive
              ]} 
              onPress={toggleFollow}
              activeOpacity={0.8}
            >
              <Text style={[
                styles.followButtonText,
                isFollowing && styles.followingButtonTextActive
              ]}>
                {isFollowing ? 'Siguiendo' : 'Seguir'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.messageButton}>
              <Text style={styles.messageButtonText}>Mensaje</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Sección de Recomendaciones (Placeholder) */}
        <View style={styles.contentSection}>
          <Text style={styles.sectionTitle}>Recomendaciones de {username}</Text>
          <View style={styles.emptyState}>
            <Text style={styles.emptyEmoji}>📜</Text>
            <Text style={styles.emptyText}>Aún no hay recomendaciones públicas.</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  headerNav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SIZES.md,
    paddingVertical: SIZES.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backIcon: {
    fontSize: 20,
    color: COLORS.textPrimary,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  profileHeader: {
    alignItems: 'center',
    paddingVertical: SIZES.xl,
    paddingHorizontal: SIZES.lg,
  },
  avatarContainer: {
    marginBottom: SIZES.md,
  },
  avatarGradient: {
    padding: 3,
    borderRadius: 60,
    backgroundColor: COLORS.primary,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: COLORS.surface,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: COLORS.background,
  },
  avatarInitial: {
    fontSize: 40,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
  },
  fullName: {
    fontSize: 24,
    fontWeight: '800',
    color: COLORS.textPrimary,
    marginBottom: SIZES.xs,
  },
  bio: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: SIZES.lg,
  },
  statsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    paddingVertical: SIZES.md,
    paddingHorizontal: SIZES.xl,
    borderRadius: SIZES.radiusLg,
    marginBottom: SIZES.xl,
    width: '100%',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  statLabel: {
    fontSize: 12,
    color: COLORS.textTertiary,
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: COLORS.border,
    marginHorizontal: SIZES.sm,
  },
  actionsContainer: {
    flexDirection: 'row',
    gap: SIZES.md,
    width: '100%',
  },
  followButton: {
    flex: 1,
    height: 48,
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  followingButtonActive: {
    backgroundColor: COLORS.surfaceAlt,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  followButtonText: {
    color: COLORS.surface,
    fontWeight: '700',
    fontSize: 15,
  },
  followingButtonTextActive: {
    color: COLORS.textPrimary,
  },
  messageButton: {
    flex: 1,
    height: 48,
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  messageButtonText: {
    color: COLORS.textPrimary,
    fontWeight: '700',
    fontSize: 15,
  },
  contentSection: {
    paddingHorizontal: SIZES.lg,
    paddingBottom: 100,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: SIZES.lg,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: SIZES.xl,
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radiusLg,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderStyle: 'dashed',
  },
  emptyEmoji: {
    fontSize: 32,
    marginBottom: SIZES.sm,
  },
  emptyText: {
    color: COLORS.textTertiary,
    fontSize: 14,
  },
});
