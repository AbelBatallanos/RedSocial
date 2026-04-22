import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft, Heart, Send, Bookmark, MoreHorizontal, MapPin } from 'lucide-react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { COLORS, SIZES } from '../../src/styles/theme';
import { Avatar } from '../../src/components/ui/Avatar';

// Importamos el AuthContext y el API
import { useAuthContext } from '../../src/context/AuthContext';
import { eliminarRecomendacion } from '../../src/services/api';

export default function PostDetailScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  
  // 1. OBTENER USUARIO ACTUAL
  const { user, token } = useAuthContext();

  // 2. RECIBIR LOS DATOS DEL HOME
  const { 
    id, 
    title, 
    content, 
    image, 
    username, 
    avatar, 
    time, 
    enlace, 
    tipo 
  } = useLocalSearchParams();

  // 3. VALIDACIÓN ESTRICTA: ¿Es mi post?
  // Compara el username logueado con el username del autor del post
  const isMyPost = user?.nombre_usuario === username;

  // 4. LÓGICA DE OPCIONES (EDITAR / ELIMINAR)
  const handleOpciones = () => {
    Alert.alert(
      "Opciones",
      "¿Qué deseas hacer con tu recomendación?",
      [
        { text: "Cancelar", style: "cancel" },
        { 
          text: "Editar", 
          onPress: () => {
            // Te lleva a la pantalla de crear, pero le pasa los datos para llenarlos
            router.push({
              pathname: '/(tabs)/create',
              params: { isEditing: 'true', id, title, content, tipo, image, enlace }
            });
          }
        },
        { 
          text: "Eliminar", 
          style: "destructive",
          onPress: confirmarEliminacion 
        }
      ]
    );
  };

  const confirmarEliminacion = () => {
    Alert.alert("Eliminar", "¿Seguro que quieres borrar esta recomendación?", [
      { text: "No", style: "cancel" },
      { 
        text: "Sí, eliminar", 
        style: "destructive",
        onPress: async () => {
          const result = await eliminarRecomendacion(token as string, id as string);
          if (result.success) {
            Alert.alert("Éxito", "Post eliminado correctamente");
            router.back(); // Regresa al feed
          } else {
            Alert.alert("Error", "No se pudo eliminar");
          }
        } 
      }
    ]);
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <ArrowLeft size={24} stroke={COLORS.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Detalle</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.userRow}>
          <Avatar source={avatar as string} name={username as string} size={44} />
          <View style={styles.userInfo}>
            <Text style={styles.name}>@{username || 'Usuario'}</Text>
            <Text style={styles.time}>{time}</Text>
          </View>
          
          {/* AQUÍ SE APLICA LA MAGIA: Solo muestra los 3 puntos si ES TU POST */}
          {isMyPost && (
            <TouchableOpacity onPress={handleOpciones} style={{ padding: 8 }}>
              <MoreHorizontal size={24} stroke={COLORS.textPrimary} />
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.contentSection}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.content}>{content}</Text>
          
          {/* Asegurarse de que la imagen sea un string válido */}
          {image && image !== 'null' && image !== 'undefined' && (
            <Image source={{ uri: image as string }} style={styles.postImage} resizeMode="cover" />
          )}

          <View style={styles.locationContainer}>
            <View style={styles.locationBadge}>
              <MapPin size={16} stroke={COLORS.primary} />
              <Text style={styles.locationText}>{tipo || 'General'}</Text>
            </View>
            {enlace && enlace !== 'null' && (
              <TouchableOpacity style={styles.shareIconBtn}>
                <Send size={18} stroke={COLORS.textPrimary} />
              </TouchableOpacity>
            )}
          </View>
        </View>

        <View style={styles.statsBar}>
          <Text style={styles.statsText}>
            <Text style={styles.bold}>0</Text> Me gusta  •  <Text style={styles.bold}>0</Text> Respuestas
          </Text>
        </View>

        <View style={styles.actionsBar}>
          <TouchableOpacity style={styles.actionItem}><Heart size={26} stroke={COLORS.textPrimary} /></TouchableOpacity>
          <TouchableOpacity style={styles.actionItem}><Send size={26} stroke={COLORS.textPrimary} /></TouchableOpacity>
          <TouchableOpacity style={styles.actionItem}><Bookmark size={26} stroke={COLORS.textPrimary} /></TouchableOpacity>
          
          {/* El botón Seguir solo aparece si el post NO es tuyo */}
          {!isMyPost && (
            <TouchableOpacity style={styles.followBtn}>
              <Text style={styles.followBtnText}>Seguir</Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

// ... Tus estilos originales se mantienen exactamente igual ...
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: SIZES.md, height: 64 },
  backBtn: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.surface, borderRadius: 20, marginRight: SIZES.md },
  headerTitle: { fontSize: 20, fontWeight: '900', color: COLORS.textPrimary },
  scrollContent: { padding: SIZES.md },
  userRow: { flexDirection: 'row', alignItems: 'center', marginBottom: SIZES.lg },
  userInfo: { flex: 1, marginLeft: SIZES.sm },
  name: { fontSize: 16, fontWeight: '800', color: COLORS.textPrimary },
  time: { fontSize: 13, color: COLORS.textTertiary, fontWeight: '600' },
  contentSection: { marginBottom: SIZES.xl },
  title: { fontSize: 22, fontWeight: '900', color: COLORS.textPrimary, marginBottom: 12 },
  content: { fontSize: 16, color: COLORS.textSecondary, lineHeight: 24, fontWeight: '500', marginBottom: SIZES.lg },
  postImage: { width: '100%', height: 240, borderRadius: 24, marginBottom: SIZES.lg },
  locationContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: COLORS.surface, padding: SIZES.md, borderRadius: 20, borderWidth: 1, borderColor: COLORS.border },
  locationBadge: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  locationText: { fontSize: 14, color: COLORS.textPrimary, fontWeight: '700' },
  shareIconBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: COLORS.background, justifyContent: 'center', alignItems: 'center' },
  statsBar: { paddingVertical: SIZES.md, borderTopWidth: 1, borderTopColor: COLORS.border, borderBottomWidth: 1, borderBottomColor: COLORS.border, marginBottom: SIZES.lg },
  statsText: { fontSize: 14, color: COLORS.textSecondary, fontWeight: '500' },
  bold: { fontWeight: '900', color: COLORS.textPrimary },
  actionsBar: { flexDirection: 'row', alignItems: 'center', gap: SIZES.xl },
  actionItem: { padding: 4 },
  followBtn: { flex: 1, backgroundColor: COLORS.textPrimary, height: 48, borderRadius: 14, justifyContent: 'center', alignItems: 'center', marginLeft: SIZES.sm },
  followBtnText: { color: COLORS.background, fontSize: 15, fontWeight: '900' },
});