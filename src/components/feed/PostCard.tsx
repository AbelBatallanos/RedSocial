import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Heart, MessageCircle, Send, MoreHorizontal, Calendar } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { COLORS, SIZES } from '../../styles/theme';
import { Avatar } from '../ui/Avatar';
import { Button } from '../ui/Button';

interface PostCardProps {
  id?: string;
  user: {
    name: string;
    username: string;
    avatar?: string;
  };
  time: string;
  title: string;
  content: string;
  image?: string;
  stats: {
    likes: number;
    comments: number;
  };
  isRecommendation?: boolean;
}

export const PostCard = ({ id = '1', user, time, title, content, image, stats, isRecommendation = true }: PostCardProps) => {
  const router = useRouter();

  const handlePostPress = () => {
    router.push({ pathname: '/post/[id]', params: { id } });
  };

  const handleUserPress = () => {
    router.push({ pathname: '/user/[username]', params: { username: user.username } });
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleUserPress}>
          <Avatar source={user.avatar} name={user.name} size={48} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.headerInfo} onPress={handleUserPress}>
          <Text style={styles.name}>{user.name}</Text>
          <Text style={styles.username}>@{user.username} • {time}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.moreBtn}>
          <MoreHorizontal size={20} stroke={COLORS.textTertiary} />
        </TouchableOpacity>
      </View>

      {/* Body */}
      <TouchableOpacity style={styles.body} onPress={handlePostPress}>
        <Text style={styles.postTitle}>{title}</Text>
        <Text style={styles.content}>{content}</Text>
        
        {image && (
          <Image source={{ uri: image }} style={styles.postImage} resizeMode="cover" />
        )}

        {isRecommendation && (
          <View style={styles.actionContainer}>
            <View style={styles.recommendationBadge}>
              <Text style={styles.badgeText}>¿Hiciste caso a tu amigo?</Text>
              <TouchableOpacity style={styles.triedButton}>
                <Text style={styles.triedText}>Lo probé</Text>
              </TouchableOpacity>
            </View>
            
            <Button 
              title="Reservar Mesa (-10%)" 
              variant="outline" 
              onPress={() => {}}
              style={styles.reserveButton}
              textStyle={styles.reserveText}
              icon={<Calendar size={18} stroke={COLORS.primary} style={{ marginRight: 8 }} />}
            />
          </View>
        )}
      </TouchableOpacity>

      {/* Footer */}
      <View style={styles.footer}>
        <View style={styles.leftFooter}>
          <TouchableOpacity style={styles.statItem}>
            <Heart size={22} stroke={COLORS.textTertiary} />
            <Text style={styles.statText}>{stats.likes}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.statItem} onPress={handlePostPress}>
            <MessageCircle size={22} stroke={COLORS.textTertiary} />
            <Text style={styles.statText}>{stats.comments}</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity>
          <Send size={22} stroke={COLORS.textTertiary} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.surface,
    marginBottom: SIZES.md,
    marginHorizontal: SIZES.md,
    borderRadius: 24,
    padding: SIZES.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SIZES.md,
  },
  headerInfo: {
    flex: 1,
    marginLeft: SIZES.sm,
  },
  name: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  username: {
    fontSize: 13,
    color: COLORS.textTertiary,
    fontWeight: '600',
  },
  moreBtn: {
    padding: 4,
  },
  body: {
    marginTop: SIZES.xs,
  },
  postTitle: {
    fontSize: 19,
    fontWeight: '900',
    color: COLORS.textPrimary,
    marginBottom: 6,
    letterSpacing: -0.5,
  },
  content: {
    fontSize: 15,
    color: COLORS.textSecondary,
    lineHeight: 22,
    marginBottom: SIZES.md,
    fontWeight: '500',
  },
  postImage: {
    width: '100%',
    height: 240,
    borderRadius: 20,
    marginBottom: SIZES.md,
  },
  actionContainer: {
    backgroundColor: COLORS.background,
    borderRadius: 20,
    padding: SIZES.md,
    marginBottom: SIZES.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  recommendationBadge: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SIZES.md,
  },
  badgeText: {
    fontSize: 13,
    color: COLORS.textPrimary,
    fontWeight: '800',
  },
  triedButton: {
    backgroundColor: COLORS.textPrimary,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
  },
  triedText: {
    color: COLORS.background,
    fontSize: 12,
    fontWeight: '900',
  },
  reserveButton: {
    height: 50,
    borderColor: COLORS.primary,
    backgroundColor: 'transparent',
    borderRadius: 14,
    borderWidth: 1.5,
  },
  reserveText: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: '800',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: SIZES.sm,
    paddingTop: SIZES.md,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  leftFooter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: SIZES.xl,
  },
  statText: {
    marginLeft: 6,
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.textSecondary,
  },
});
