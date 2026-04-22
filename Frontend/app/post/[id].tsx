import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft, Heart, Send, Bookmark, MoreHorizontal, MapPin } from 'lucide-react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { COLORS, SIZES, globalStyles } from '../../src/styles/theme';
import { Avatar } from '../../src/components/ui/Avatar';

export default function PostDetailScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { id } = useLocalSearchParams();

  // Mock de datos (esto vendría del backend luego)
  const post = {
    user: { name: 'ana_garcia', username: 'ana_g', avatar: 'https://api.dicebear.com/7.x/avataaars/png?seed=ana' },
    time: '2 h',
    title: 'Restaurante La Esquina',
    content: 'Fui ayer con mi familia. Comida mediterránea increíble. Tienen que probar la paella de mariscos, sé que les va a encantar. 🥘✨ El servicio fue de 10.',
    image: 'https://picsum.photos/800/600',
    location: 'Av. San Martín, Centro',
    stats: { likes: 45, replies: 12 }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <ArrowLeft size={24} stroke={COLORS.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Detalle</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* User Info */}
        <View style={styles.userRow}>
          <Avatar source={post.user.avatar} name={post.user.name} size={44} />
          <View style={styles.userInfo}>
            <Text style={styles.name}>{post.user.username}</Text>
            <Text style={styles.time}>{post.time}</Text>
          </View>
          <TouchableOpacity>
            <MoreHorizontal size={20} stroke={COLORS.textTertiary} />
          </TouchableOpacity>
        </View>

        {/* Content */}
        <View style={styles.contentSection}>
          <Text style={styles.title}>{post.title}</Text>
          <Text style={styles.content}>{post.content}</Text>
          
          {post.image && (
            <Image source={{ uri: post.image }} style={styles.postImage} resizeMode="cover" />
          )}

          <View style={styles.locationContainer}>
            <View style={styles.locationBadge}>
              <MapPin size={16} stroke={COLORS.primary} />
              <Text style={styles.locationText}>{post.location}</Text>
            </View>
            <TouchableOpacity style={styles.shareIconBtn}>
              <Send size={18} stroke={COLORS.textPrimary} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Stats */}
        <View style={styles.statsBar}>
          <Text style={styles.statsText}>
            <Text style={styles.bold}>{post.stats.likes}</Text> Me gusta  •  <Text style={styles.bold}>{post.stats.replies}</Text> Respuestas
          </Text>
        </View>

        {/* Actions */}
        <View style={styles.actionsBar}>
          <TouchableOpacity style={styles.actionItem}>
            <Heart size={26} stroke={COLORS.textPrimary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionItem}>
            <Send size={26} stroke={COLORS.textPrimary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionItem}>
            <Bookmark size={26} stroke={COLORS.textPrimary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.followBtn}>
            <Text style={styles.followBtnText}>Seguir</Text>
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
    fontSize: 20,
    fontWeight: '900',
    color: COLORS.textPrimary,
  },
  scrollContent: {
    padding: SIZES.md,
  },
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SIZES.lg,
  },
  userInfo: {
    flex: 1,
    marginLeft: SIZES.sm,
  },
  name: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  time: {
    fontSize: 13,
    color: COLORS.textTertiary,
    fontWeight: '600',
  },
  contentSection: {
    marginBottom: SIZES.xl,
  },
  title: {
    fontSize: 22,
    fontWeight: '900',
    color: COLORS.textPrimary,
    marginBottom: 12,
  },
  content: {
    fontSize: 16,
    color: COLORS.textSecondary,
    lineHeight: 24,
    fontWeight: '500',
    marginBottom: SIZES.lg,
  },
  postImage: {
    width: '100%',
    height: 240,
    borderRadius: 24,
    marginBottom: SIZES.lg,
  },
  locationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    padding: SIZES.md,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  locationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  locationText: {
    fontSize: 14,
    color: COLORS.textPrimary,
    fontWeight: '700',
  },
  shareIconBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statsBar: {
    paddingVertical: SIZES.md,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    marginBottom: SIZES.lg,
  },
  statsText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  bold: {
    fontWeight: '900',
    color: COLORS.textPrimary,
  },
  actionsBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SIZES.xl,
  },
  actionItem: {
    padding: 4,
  },
  followBtn: {
    flex: 1,
    backgroundColor: COLORS.textPrimary,
    height: 48,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: SIZES.sm,
  },
  followBtnText: {
    color: COLORS.background,
    fontSize: 15,
    fontWeight: '900',
  },
});
