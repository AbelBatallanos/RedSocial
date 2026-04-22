import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Linking } from 'react-native';
import { Heart, MessageCircle, Send, MoreHorizontal, ExternalLink, Hash } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { COLORS, SIZES } from '../../styles/theme';
import { Avatar } from '../ui/Avatar';

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
  image?: string | null; 
  enlace_externo?: string | null; 
  tipo?: string; 
  stats: {
    likes: number;
    comments: number;
  };
  isRecommendation?: boolean;
  // NUEVAS PROPS PARA EDITAR/ELIMINAR
  isMyPost?: boolean;
  onOptionsPress?: () => void;
}

export const PostCard = ({ 
  id = '1', user, time, title, content, image, stats, 
  isRecommendation = true, enlace_externo, tipo,
  isMyPost, onOptionsPress // <-- Recibimos las props aquí
}: PostCardProps) => {
  const router = useRouter();

  const handlePostPress = () => {
    router.push({ pathname: '/post/[id]', params: { id } });
  };

  const handleOpenLink = () => {
    if (enlace_externo) {
      Linking.openURL(enlace_externo).catch(() => {});
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Avatar source={user.avatar} name={user.name} size={48} />
        <View style={styles.headerInfo}>
          <View style={styles.nameRow}>
             <Text style={styles.name}>{user.name}</Text>
             {tipo && (
               <View style={styles.typeBadge}>
                 <Text style={styles.typeText}>{tipo.toUpperCase()}</Text>
               </View>
             )}
          </View>
          <Text style={styles.username}>@{user.username} • {time}</Text>
        </View>
        
        {/* MAGIA AQUÍ: Solo muestra los 3 puntitos si es tu post */}
        {/* AGREGA ESTE BLOQUE: Solo si es mi post, muestra los puntos */}
        {isMyPost && (
          <TouchableOpacity style={styles.moreBtn} onPress={onOptionsPress}>
            <MoreHorizontal size={20} stroke={COLORS.textTertiary} />
          </TouchableOpacity>
        )}
      </View>

      {/* Body */}
      <View style={styles.body}>
        <TouchableOpacity onPress={handlePostPress}>
          <Text style={styles.postTitle}>{title}</Text>
          <Text style={styles.contentText}>{content}</Text>
        </TouchableOpacity>
        
        {/* IMAGEN CONDICIONAL: Solo si existe */}
        {image && (
          <Image source={{ uri: image }} style={styles.postImage} resizeMode="cover" />
        )}

        {isRecommendation && enlace_externo && (
          <TouchableOpacity style={styles.linkButton} onPress={handleOpenLink}>
            <ExternalLink size={18} stroke={COLORS.primary} />
            <Text style={styles.linkButtonText}>Ver recomendación</Text>
          </TouchableOpacity>
        )}

        {isRecommendation && (
          <View style={styles.actionContainer}>
            <View style={styles.recommendationBadge}>
              <Text style={styles.badgeText}>¿Hiciste caso a tu amigo?</Text>
              <TouchableOpacity style={styles.triedButton}>
                <Text style={styles.triedText}>Lo probé</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>

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

// ESTILOS INTACTOS
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
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: SIZES.md },
  headerInfo: { flex: 1, marginLeft: SIZES.sm },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  name: { fontSize: 16, fontWeight: '700', color: COLORS.textPrimary },
  typeBadge: {
    backgroundColor: COLORS.background,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  typeText: { fontSize: 10, fontWeight: '900', color: COLORS.primary },
  username: { fontSize: 13, color: COLORS.textTertiary, fontWeight: '600' },
  moreBtn: { padding: 4 },
  body: { marginTop: SIZES.xs },
  postTitle: { fontSize: 19, fontWeight: '900', color: COLORS.textPrimary, marginBottom: 6 },
  contentText: { fontSize: 15, color: COLORS.textSecondary, lineHeight: 22, marginBottom: SIZES.md, fontWeight: '500' },
  postImage: { width: '100%', height: 240, borderRadius: 20, marginBottom: SIZES.md },
  linkButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.surface,
    borderWidth: 1.5,
    borderColor: COLORS.primary,
    padding: 12,
    borderRadius: 16,
    marginBottom: SIZES.md,
    gap: 8,
  },
  linkButtonText: { color: COLORS.primary, fontWeight: '900', fontSize: 14 },
  actionContainer: {
    backgroundColor: COLORS.background,
    borderRadius: 20,
    padding: SIZES.md,
    marginBottom: SIZES.sm,
  },
  recommendationBadge: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  badgeText: { fontSize: 13, color: COLORS.textPrimary, fontWeight: '800' },
  triedButton: { backgroundColor: COLORS.textPrimary, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 12 },
  triedText: { color: COLORS.background, fontSize: 12, fontWeight: '900' },
  footer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: SIZES.sm, paddingTop: SIZES.md, borderTopWidth: 1, borderTopColor: COLORS.border },
  leftFooter: { flexDirection: 'row', alignItems: 'center' },
  statItem: { flexDirection: 'row', alignItems: 'center', marginRight: SIZES.xl },
  statText: { marginLeft: 6, fontSize: 14, fontWeight: '700', color: COLORS.textSecondary },
});