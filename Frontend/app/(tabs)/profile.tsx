import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Settings, Share, Link as LinkIcon, Sparkles, Grid, Bookmark, ChevronRight } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { COLORS, SIZES, globalStyles } from '../../src/styles/theme';
import { Avatar } from '../../src/components/ui/Avatar';
import { PremiumModal } from '../../src/components/ui/PremiumModal';

const { width } = Dimensions.get('window');

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [isPremiumVisible, setPremiumVisible] = useState(false);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.iconCircle}>
          <Settings size={22} stroke={COLORS.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Mi Perfil</Text>
        <TouchableOpacity style={styles.iconCircle}>
          <Share size={22} stroke={COLORS.textPrimary} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        {/* Profile Card */}
        <View style={styles.profileSection}>
          <View style={styles.avatarWrapper}>
            <Avatar size={100} name="Diego UX" />
            <View style={styles.onlineBadge} />
          </View>
          
          <Text style={styles.name}>Diego UX</Text>
          <Text style={styles.username}>@diego.ui</Text>
          
          <Text style={styles.bio}>
            Curador de cafeterías escondidas y tech lover. ☕💻 
            Comparto mis mejores hallazgos en Santa Cruz.
          </Text>

          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <Text style={styles.statNumber}>124</Text>
              <Text style={styles.statLabel}>Posts</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.statBox}>
              <Text style={styles.statNumber}>1.2k</Text>
              <Text style={styles.statLabel}>Fans</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.statBox}>
              <Text style={styles.statNumber}>850</Text>
              <Text style={styles.statLabel}>Siguiendo</Text>
            </View>
          </View>

          <View style={styles.actionRow}>
            <TouchableOpacity style={styles.primaryBtn}>
              <Text style={styles.primaryBtnText}>Editar Perfil</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.secondaryBtn}>
              <LinkIcon size={20} stroke={COLORS.textPrimary} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Premium Banner */}
        <TouchableOpacity 
          style={styles.premiumBanner} 
          onPress={() => setPremiumVisible(true)}
        >
          <View style={styles.premiumIcon}>
            <Sparkles size={20} stroke={COLORS.surface} fill={COLORS.surface} />
          </View>
          <View style={styles.premiumTextContainer}>
            <Text style={styles.premiumTitle}>Mejora a Vibes+</Text>
            <Text style={styles.premiumSubtitle}>Obtén el check azul y funciones PRO.</Text>
          </View>
          <ChevronRight size={20} stroke={COLORS.textTertiary} />
        </TouchableOpacity>

        {/* Tabs */}
        <View style={styles.tabs}>
          <TouchableOpacity style={[styles.tab, styles.activeTab]}>
            <Grid size={20} stroke={COLORS.textPrimary} />
            <Text style={styles.activeTabText}>Posts</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.tab} onPress={() => router.push('/saved')}>
            <Bookmark size={20} stroke={COLORS.textTertiary} />
            <Text style={styles.tabText}>Guardados</Text>
          </TouchableOpacity>
        </View>

        {/* Grid Placeholder */}
        <View style={styles.grid}>
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIconCircle}>
              <Grid size={40} stroke={COLORS.textTertiary} />
            </View>
            <Text style={styles.emptyText}>Aún no has recomendado nada.</Text>
            <TouchableOpacity style={styles.startBtn}>
              <Text style={styles.startBtnText}>Empezar ahora</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* PREMIUM MODAL */}
      <PremiumModal 
        isVisible={isPremiumVisible} 
        onClose={() => setPremiumVisible(false)} 
      />
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
    height: 60,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: COLORS.textPrimary,
    letterSpacing: -0.5,
  },
  iconCircle: {
    width: 40,
    height: 40,
    backgroundColor: COLORS.surface,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileSection: {
    alignItems: 'center',
    padding: SIZES.xl,
    marginTop: SIZES.md,
  },
  avatarWrapper: {
    position: 'relative',
    marginBottom: SIZES.md,
  },
  onlineBadge: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    width: 20,
    height: 20,
    backgroundColor: COLORS.accent,
    borderRadius: 10,
    borderWidth: 3,
    borderColor: COLORS.background,
  },
  name: {
    fontSize: 26,
    fontWeight: '900',
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  username: {
    fontSize: 16,
    color: COLORS.primary,
    fontWeight: '700',
    marginBottom: SIZES.md,
  },
  bio: {
    fontSize: 15,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: SIZES.md,
    marginBottom: SIZES.xl,
  },
  statsRow: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    borderRadius: 24,
    paddingVertical: 20,
    width: '100%',
    justifyContent: 'space-around',
    marginBottom: SIZES.xl,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  statBox: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: '900',
    color: COLORS.textPrimary,
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textTertiary,
    marginTop: 2,
  },
  divider: {
    width: 1,
    height: '60%',
    backgroundColor: COLORS.border,
    alignSelf: 'center',
  },
  actionRow: {
    flexDirection: 'row',
    gap: SIZES.md,
    width: '100%',
  },
  primaryBtn: {
    flex: 1,
    height: 54,
    backgroundColor: COLORS.primary,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  primaryBtnText: {
    color: COLORS.surface,
    fontSize: 16,
    fontWeight: '800',
  },
  secondaryBtn: {
    width: 54,
    height: 54,
    backgroundColor: COLORS.surface,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  premiumBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    marginHorizontal: SIZES.md,
    padding: SIZES.lg,
    borderRadius: 24,
    marginBottom: SIZES.xl,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  premiumIcon: {
    width: 44,
    height: 44,
    backgroundColor: COLORS.primary,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  premiumTextContainer: {
    flex: 1,
    marginLeft: SIZES.md,
  },
  premiumTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: COLORS.textPrimary,
  },
  premiumSubtitle: {
    fontSize: 12,
    color: COLORS.textTertiary,
    fontWeight: '600',
  },
  tabs: {
    flexDirection: 'row',
    paddingHorizontal: SIZES.md,
    gap: SIZES.md,
    marginBottom: SIZES.lg,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
    borderRadius: 15,
    backgroundColor: 'transparent',
    gap: 8,
  },
  activeTab: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.textTertiary,
  },
  activeTabText: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  grid: {
    paddingHorizontal: SIZES.md,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: SIZES.xxl,
    backgroundColor: COLORS.surface,
    borderRadius: 32,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  emptyIconCircle: {
    width: 80,
    height: 80,
    backgroundColor: COLORS.background,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SIZES.md,
  },
  emptyText: {
    fontSize: 15,
    color: COLORS.textTertiary,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: SIZES.lg,
  },
  startBtn: {
    backgroundColor: COLORS.primaryLight,
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  startBtnText: {
    color: COLORS.primary,
    fontWeight: '900',
    fontSize: 15,
  }
});
