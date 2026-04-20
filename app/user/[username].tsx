import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft, Bell, MoreHorizontal, MapPin } from 'lucide-react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { COLORS, SIZES, globalStyles } from '../../src/styles/theme';
import { Avatar } from '../../src/components/ui/Avatar';
import { PostCard } from '../../src/components/feed/PostCard';

export default function UserProfileScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { username } = useLocalSearchParams();

  // Mock de datos del usuario
  const user = {
    name: 'Ana García',
    username: username || 'anagarcia_99',
    bio: 'Amante del buen café y las películas independientes. Recomiendo lo que me gusta. 📍 Santa Cruz.',
    stats: { followers: '1,245', following: '850', posts: '124' },
    avatar: 'https://api.dicebear.com/7.x/avataaars/png?seed=ana'
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <ArrowLeft size={24} stroke={COLORS.textPrimary} />
        </TouchableOpacity>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.iconCircle}>
            <Bell size={20} stroke={COLORS.textPrimary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconCircle}>
            <MoreHorizontal size={20} stroke={COLORS.textPrimary} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        {/* Profile Info */}
        <View style={styles.profileInfo}>
          <View style={styles.topRow}>
            <View style={styles.textInfo}>
              <Text style={styles.name}>{user.name}</Text>
              <Text style={styles.username}>@{user.username}</Text>
            </View>
            <Avatar source={user.avatar} name={user.name} size={90} />
          </View>

          <Text style={styles.bio}>{user.bio}</Text>
          
          <TouchableOpacity style={styles.statsRow}>
            <Text style={styles.statsText}>
              <Text style={styles.bold}>{user.stats.followers}</Text> seguidores
            </Text>
          </TouchableOpacity>

          <View style={styles.actionRow}>
            <TouchableOpacity style={styles.followBtn}>
              <Text style={styles.followBtnText}>Seguir</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.mentionBtn}>
              <Text style={styles.mentionBtnText}>Mencionar</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Tabs */}
        <View style={styles.tabs}>
          <TouchableOpacity style={[styles.tab, styles.activeTab]}>
            <Text style={[styles.tabText, styles.activeTabText]}>Recomendaciones</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.tab}>
            <Text style={styles.tabText}>Listas</Text>
          </TouchableOpacity>
        </View>

        {/* User Posts */}
        <View style={styles.feed}>
          <PostCard 
            user={{ name: user.name, username: user.username, avatar: user.avatar }}
            time="2 h"
            title="La Esquina del Sabor"
            content="Comida mediterránea increíble. Tienen que probar la paella."
            stats={{ likes: 45, comments: 12 }}
          />
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
  backBtn: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: 20,
  },
  headerRight: {
    flexDirection: 'row',
    gap: SIZES.sm,
  },
  iconCircle: {
    width: 40,
    height: 40,
    backgroundColor: COLORS.surface,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileInfo: {
    padding: SIZES.lg,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SIZES.md,
  },
  textInfo: {
    flex: 1,
  },
  name: {
    fontSize: 28,
    fontWeight: '900',
    color: COLORS.textPrimary,
  },
  username: {
    fontSize: 16,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  bio: {
    fontSize: 15,
    color: COLORS.textPrimary,
    lineHeight: 22,
    fontWeight: '500',
    marginTop: SIZES.sm,
  },
  statsRow: {
    marginTop: SIZES.md,
  },
  statsText: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  bold: {
    fontWeight: '900',
    color: COLORS.textPrimary,
  },
  actionRow: {
    flexDirection: 'row',
    marginTop: SIZES.xl,
    gap: SIZES.md,
  },
  followBtn: {
    flex: 1,
    height: 48,
    backgroundColor: COLORS.textPrimary,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  followBtnText: {
    color: COLORS.background,
    fontSize: 15,
    fontWeight: '900',
  },
  mentionBtn: {
    flex: 1,
    height: 48,
    backgroundColor: COLORS.surface,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  mentionBtnText: {
    color: COLORS.textPrimary,
    fontSize: 15,
    fontWeight: '900',
  },
  tabs: {
    flexDirection: 'row',
    paddingHorizontal: SIZES.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  tab: {
    paddingVertical: 16,
    marginRight: SIZES.xl,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: COLORS.textPrimary,
  },
  tabText: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.textTertiary,
  },
  activeTabText: {
    color: COLORS.textPrimary,
  },
  feed: {
    paddingTop: SIZES.lg,
  }
});
