import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Linking, ActivityIndicator } from 'react-native';
import { Heart, MessageCircle, Send, MoreHorizontal, ExternalLink, Star } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { COLORS, SIZES } from '../../styles/theme';
import { Avatar } from '../ui/Avatar';
import { enviarCalificacion, getAuthToken, obtenerCalificacion } from '../../services/api';

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

  const [rating, setRating] = useState(0); 
  const [isLoadingRating, setIsLoadingRating] = useState(false); // Para mostrar que está cargando

  // NUEVO: Efecto para cargar la calificación inicial cuando la tarjeta aparece
  useEffect(() => {
    const fetchCalificacion = async () => {
      if (id && isRecommendation) {
        const token = await getAuthToken();
        if (token) {
           const result = await obtenerCalificacion(token, id);
           // Suponiendo que el backend devuelve { stars: X } cuando ya calificó
           if (result.success && result.data && result.data.stars) {
             setRating(result.data.stars);
           }
        }
      }
    };
    fetchCalificacion();
  }, [id, isRecommendation])

  const handlePostPress = () => {
    router.push({ pathname: '/post/[id]', params: { id } });
  };

  const handleOpenLink = () => {
    if (enlace_externo) {
      Linking.openURL(enlace_externo).catch(() => {});
    }
  };

  const handleRating = async (selectedRating: number) => {
    if (!id || isLoadingRating) return;   
    
    setIsLoadingRating(true);
    
    const token = await getAuthToken();
    if (token) {
      const result = await enviarCalificacion(token, id, selectedRating);
      if (result.success) {
        setRating(selectedRating);
      } else {
        console.log("Error al calificar", result.error);
      }
    }
    
    // Congelamos la UI artificialmente por 1 segundo (1000 milisegundos)
    // para evitar que hagan spam de clicks.
    setTimeout(() => {
      setIsLoadingRating(false); // Liberamos el bloqueo
    }, 1000); 
  };

  return (
    <View style={styles.container}>
      {/* Header (Sin cambios) */}
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
        
        {image && (
          <Image source={{ uri: image }} style={styles.postImage} resizeMode="cover" />
        )}

        {isRecommendation && enlace_externo && (
          <TouchableOpacity style={styles.linkButton} onPress={handleOpenLink}>
            <ExternalLink size={18} stroke={COLORS.primary} />
            <Text style={styles.linkButtonText}>Ver recomendación</Text>
          </TouchableOpacity>
        )}

        {/* NUEVO: Contenedor de Calificación */}
        {isRecommendation && (
          <View style={styles.actionContainer}>
            <View style={styles.recommendationBadge}>
              <Text style={styles.badgeText}>¿Qué te pareció?</Text>
              
              <View style={styles.starsContainer}>
                {isLoadingRating ? (
                  <ActivityIndicator size="small" color={COLORS.primary} />
                ) : (
                  [1, 2, 3, 4, 5].map((starIndex) => (
                    <TouchableOpacity 
                      key={starIndex} 
                      onPress={() => handleRating(starIndex)}
                      style={styles.starButton}
                      disabled={isLoadingRating} // <--- NUEVO: Bloquea el botón
                    >
                      <Star 
                        size={24} 
                        fill={starIndex <= rating ? COLORS.primary : 'transparent'} 
                        stroke={starIndex <= rating ? COLORS.primary : COLORS.textTertiary} 
                      />
                    </TouchableOpacity>
                  ))
                )}
              </View>

            </View>
          </View>
        )}
      </View>

      {/* Footer (Sin cambios) */}
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
  container: { backgroundColor: COLORS.surface, marginBottom: SIZES.md, marginHorizontal: SIZES.md, borderRadius: 24, padding: SIZES.md, borderWidth: 1, borderColor: COLORS.border },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: SIZES.md },
  headerInfo: { flex: 1, marginLeft: SIZES.sm },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  name: { fontSize: 16, fontWeight: '700', color: COLORS.textPrimary },
  typeBadge: { backgroundColor: COLORS.background, paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6, borderWidth: 1, borderColor: COLORS.border },
  typeText: { fontSize: 10, fontWeight: '900', color: COLORS.primary },
  username: { fontSize: 13, color: COLORS.textTertiary, fontWeight: '600' },
  moreBtn: { padding: 4 },
  body: { marginTop: SIZES.xs },
  postTitle: { fontSize: 19, fontWeight: '900', color: COLORS.textPrimary, marginBottom: 6 },
  contentText: { fontSize: 15, color: COLORS.textSecondary, lineHeight: 22, marginBottom: SIZES.md, fontWeight: '500' },
  postImage: { width: '100%', height: 240, borderRadius: 20, marginBottom: SIZES.md },
  linkButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: COLORS.surface, borderWidth: 1.5, borderColor: COLORS.primary, padding: 12, borderRadius: 16, marginBottom: SIZES.md, gap: 8 },
  linkButtonText: { color: COLORS.primary, fontWeight: '900', fontSize: 14 },
  
  // Estilos de la sección de calificación
  actionContainer: { backgroundColor: COLORS.background, borderRadius: 20, padding: SIZES.md, marginBottom: SIZES.sm },
  recommendationBadge: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  badgeText: { fontSize: 14, color: COLORS.textPrimary, fontWeight: '800' }, // Cambié un poco el tamaño
  
  // NUEVOS ESTILOS PARA LAS ESTRELLAS
  starsContainer: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  starButton: { padding: 2 },
  
  footer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: SIZES.sm, paddingTop: SIZES.md, borderTopWidth: 1, borderTopColor: COLORS.border },
  leftFooter: { flexDirection: 'row', alignItems: 'center' },
  statItem: { flexDirection: 'row', alignItems: 'center', marginRight: SIZES.xl },
  statText: { marginLeft: 6, fontSize: 14, fontWeight: '700', color: COLORS.textSecondary },
});