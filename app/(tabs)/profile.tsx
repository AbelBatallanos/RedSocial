import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, Image, ActivityIndicator, Modal, TextInput, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Settings, Share, Link as LinkIcon, Sparkles, Grid, Bookmark, ChevronRight, X, Camera } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { COLORS, SIZES } from '../../src/styles/theme';
import { Avatar } from '../../src/components/ui/Avatar';
import { PremiumModal } from '../../src/components/ui/PremiumModal';
import { useAuthContext } from '../../src/context/AuthContext';
import { obtenerPosts, actualizarPerfil } from '../../src/services/api';

const { width } = Dimensions.get('window');

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { user, token } = useAuthContext();

  const [isPremiumVisible, setPremiumVisible] = useState(false);
  const [misPosts, setMisPosts] = useState<any[]>([]);
  const [amigosCount, setAmigosCount] = useState(0);
  const [loading, setLoading] = useState(true);

  // 🔥 FORMULARIO CON TODOS LOS CAMPOS DEL BACKEND
  const [isEditModalVisible, setEditModalVisible] = useState(false);
  const [editForm, setEditForm] = useState({
    nombre_usuario: '',
    biografia: '',
    fecha_nacimiento: '',
  });
  const [editImage, setEditImage] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const getFullImageUrl = (url: string | null) => {
    if (!url) return null;
    if (url.startsWith('http')) return url;
    return `http://192.168.1.12:8000${url}`;
  };

  const formatTime = (dateString: string) => {
    if (!dateString) return "Reciente";
    const postDate = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - postDate.getTime()) / 1000);
    if (diffInSeconds < 60) return 'Ahora';
    if (diffInSeconds < 3600) return `Hace ${Math.floor(diffInSeconds / 60)} min`;
    if (diffInSeconds < 86400) return `Hace ${Math.floor(diffInSeconds / 3600)} h`;
    return postDate.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
  };

  const irAlDetalle = (item: any) => {
    const autorPost = item.autor_detalle?.nombre_usuario || user?.nombre_usuario || "Usuario";
    const nombreLimpio = autorPost.includes('@') ? autorPost.split('@')[0] : autorPost;

    router.push({
      pathname: `/post/${item.id}`,
      params: {
        id: item.id,
        title: item.titulo,
        content: item.descripcion,
        image: getFullImageUrl(item.imagen),
        username: nombreLimpio,
        avatar: item.autor_detalle?.avatar || user?.avatar,
        time: formatTime(item.creado_en),
        enlace: item.enlace_externo,
        tipo: item.tipo
      }
    });
  };

  const cargarDatosPerfil = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const postsResult = await obtenerPosts(token);
      if (postsResult.success && postsResult.data) {
        const ordenados = [...postsResult.data].sort((a: any, b: any) => new Date(b.creado_en).getTime() - new Date(a.creado_en).getTime());
        setMisPosts(ordenados);
      }
      const amigosRes = await fetch(`http://192.168.1.12:8000/api/amistades/mis-amigos/`, {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' }
      });

      // Verificamos que Django haya respondido con un "200 OK" antes de intentar leer el JSON
      if (amigosRes.ok) {
        const amigosData = await amigosRes.json();
        if (amigosData.amistades) {
          setAmigosCount(amigosData.amistades.length);
        }
      } else {
        console.log("⚠️ Backend falló en mis-amigos. Status:", amigosRes.status);
        setAmigosCount(0); // Si falla, le ponemos 0 temporalmente
}
    } catch (error) {
      console.log("Error cargando perfil:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    cargarDatosPerfil();
  }, [token]);

  const rawName = user?.nombre_usuario || user?.username || user?.correo || "Usuario";
  const displayName = rawName.includes('@') ? rawName.split('@')[0] : rawName;

  // 🔥 LLENAMOS TODOS LOS CAMPOS AL ABRIR EL MODAL
  const handleOpenEdit = () => {
    setEditForm({
      nombre_usuario: displayName,
      biografia: user?.biografia || '',
      fecha_nacimiento: user?.fecha_nacimiento || '',
    });
    setEditImage(null);
    setEditModalVisible(true);
  };

  const pickEditImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });
    if (!result.canceled) setEditImage(result.assets[0].uri);
  };

  const handleSaveProfile = async () => {
    if (!token) return;
    setIsSaving(true);

    // Filtramos para no mandar fechas vacías si no las llenó bien
    const datosFinales: any = { ...editForm };
    if (!datosFinales.fecha_nacimiento) delete datosFinales.fecha_nacimiento;

    const res = await actualizarPerfil(token, datosFinales, editImage);
    setIsSaving(false);

    if (res.success) {
      setEditModalVisible(false);
      Alert.alert("Éxito", "Perfil actualizado. (Cierra y abre la app para ver los cambios completos).");
    } else {
      Alert.alert("Error", typeof res.error === 'string' ? res.error : "Verifica que la fecha sea AAAA-MM-DD");
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
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
        <View style={styles.profileSection}>
          <View style={styles.avatarWrapper}>
            <Avatar size={100} name={displayName} source={user?.avatar} />
            <View style={styles.onlineBadge} />
          </View>

          <Text style={styles.name}>{displayName}</Text>
          <Text style={styles.username}>@{displayName.toLowerCase()}</Text>

          <Text style={styles.bio}>{user?.biografia || "Aún no has agregado una biografía."}</Text>

          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <Text style={styles.statNumber}>{misPosts.length}</Text>
              <Text style={styles.statLabel}>Posts</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.statBox}>
              <Text style={styles.statNumber}>1.2k</Text>
              <Text style={styles.statLabel}>Fans</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.statBox}>
              <Text style={styles.statNumber}>{amigosCount}</Text>
              <Text style={styles.statLabel}>Siguiendo</Text>
            </View>
          </View>

          <View style={styles.actionRow}>
            <TouchableOpacity style={styles.primaryBtn} onPress={handleOpenEdit}>
              <Text style={styles.primaryBtnText}>Editar Perfil</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.secondaryBtn}>
              <LinkIcon size={20} stroke={COLORS.textPrimary} />
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity style={styles.premiumBanner} onPress={() => setPremiumVisible(true)}>
          <View style={styles.premiumIcon}><Sparkles size={20} stroke={COLORS.surface} fill={COLORS.surface} /></View>
          <View style={styles.premiumTextContainer}>
            <Text style={styles.premiumTitle}>Mejora a Vibes+</Text>
            <Text style={styles.premiumSubtitle}>Obtén el check azul y funciones PRO.</Text>
          </View>
          <ChevronRight size={20} stroke={COLORS.textTertiary} />
        </TouchableOpacity>

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

        {loading ? (
          <ActivityIndicator size="large" color={COLORS.primary} style={{ marginTop: 40 }} />
        ) : misPosts.length > 0 ? (
          <View style={styles.gridContainer}>
            {misPosts.map((post) => (
              <TouchableOpacity key={post.id} style={styles.gridItem} onPress={() => irAlDetalle(post)}>
                {post.imagen ? (
                  <Image 
                    source={{ uri: (editImage || getFullImageUrl(user?.avatar) || 'https://via.placeholder.com/100') as string }} 
                    style={styles.editAvatarImage} 
                  />
                ) : (
                  <View style={styles.gridTextOnly}>
                    <Text style={styles.gridTextTitle} numberOfLines={3}>{post.titulo}</Text>
                    <Text style={styles.gridTextBadge}>{post.tipo || "General"}</Text>
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>
        ) : (
          <View style={styles.grid}>
            <View style={styles.emptyContainer}>
              <View style={styles.emptyIconCircle}><Grid size={40} stroke={COLORS.textTertiary} /></View>
              <Text style={styles.emptyText}>Aún no has recomendado nada.</Text>
              <TouchableOpacity style={styles.startBtn} onPress={() => router.push('/(tabs)/create')}>
                <Text style={styles.startBtnText}>Empezar ahora</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </ScrollView>

      {/* 🔥 MODAL DE EDICIÓN AMPLIADO CON SCROLLVIEW 🔥 */}
      <Modal visible={isEditModalVisible} transparent animationType="slide">
        <KeyboardAvoidingView
          style={styles.modalOverlay}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <View style={[styles.modalContent, { paddingBottom: insets.bottom + 20, maxHeight: '90%' }]}>
            <View style={styles.modalHeader}>
              <TouchableOpacity onPress={() => setEditModalVisible(false)}><X size={24} color={COLORS.textPrimary} /></TouchableOpacity>
              <Text style={styles.modalTitle}>Editar Perfil</Text>
              <TouchableOpacity onPress={handleSaveProfile} disabled={isSaving}>
                {isSaving ? <ActivityIndicator size="small" color={COLORS.primary} /> : <Text style={styles.saveBtnText}>Guardar</Text>}
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 20 }}>
              <View style={styles.editAvatarContainer}>
                <TouchableOpacity style={styles.avatarButton} onPress={pickEditImage}>
                  <Image
                    source={{ uri: editImage || getFullImageUrl(user?.avatar) || 'https://via.placeholder.com/100' }}
                    style={styles.editAvatarImage}
                  />
                  <View style={styles.cameraIconContainer}><Camera size={20} color="white" /></View>
                </TouchableOpacity>
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Nombre de Usuario</Text>
                <TextInput
                  style={styles.textInput}
                  value={editForm.nombre_usuario}
                  onChangeText={(text) => setEditForm({ ...editForm, nombre_usuario: text })}
                  placeholderTextColor={COLORS.textTertiary}
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Biografía</Text>
                <TextInput
                  style={[styles.textInput, { height: 80, textAlignVertical: 'top' }]}
                  value={editForm.biografia}
                  onChangeText={(text) => setEditForm({ ...editForm, biografia: text })}
                  multiline
                  placeholder="Escribe algo sobre ti..."
                  placeholderTextColor={COLORS.textTertiary}
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Fecha de Nacimiento</Text>
                <TextInput
                  style={styles.textInput}
                  value={editForm.fecha_nacimiento}
                  onChangeText={(text) => setEditForm({ ...editForm, fecha_nacimiento: text })}
                  placeholder="YYYY-MM-DD (Ej: 2001-12-30)"
                  placeholderTextColor={COLORS.textTertiary}
                />
              </View>

            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      <PremiumModal isVisible={isPremiumVisible} onClose={() => setPremiumVisible(false)} />
    </View>
  );
}

// ESTILOS INTACTOS
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: SIZES.md, height: 60 },
  headerTitle: { fontSize: 18, fontWeight: '900', color: COLORS.textPrimary, letterSpacing: -0.5 },
  iconCircle: { width: 40, height: 40, backgroundColor: COLORS.surface, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
  profileSection: { alignItems: 'center', padding: SIZES.xl, marginTop: SIZES.md },
  avatarWrapper: { position: 'relative', marginBottom: SIZES.md },
  onlineBadge: { position: 'absolute', bottom: 5, right: 5, width: 20, height: 20, backgroundColor: COLORS.accent, borderRadius: 10, borderWidth: 3, borderColor: COLORS.background },
  name: { fontSize: 26, fontWeight: '900', color: COLORS.textPrimary, marginBottom: 4 },
  username: { fontSize: 16, color: COLORS.primary, fontWeight: '700', marginBottom: SIZES.md },
  bio: { fontSize: 15, color: COLORS.textSecondary, textAlign: 'center', lineHeight: 22, paddingHorizontal: SIZES.md, marginBottom: SIZES.xl },
  statsRow: { flexDirection: 'row', backgroundColor: COLORS.surface, borderRadius: 24, paddingVertical: 20, width: '100%', justifyContent: 'space-around', marginBottom: SIZES.xl, borderWidth: 1, borderColor: COLORS.border },
  statBox: { alignItems: 'center', flex: 1 },
  statNumber: { fontSize: 20, fontWeight: '900', color: COLORS.textPrimary },
  statLabel: { fontSize: 12, fontWeight: '600', color: COLORS.textTertiary, marginTop: 2 },
  divider: { width: 1, height: '60%', backgroundColor: COLORS.border, alignSelf: 'center' },
  actionRow: { flexDirection: 'row', gap: SIZES.md, width: '100%' },
  primaryBtn: { flex: 1, height: 54, backgroundColor: COLORS.primary, borderRadius: 18, justifyContent: 'center', alignItems: 'center' },
  primaryBtnText: { color: COLORS.surface, fontSize: 16, fontWeight: '800' },
  secondaryBtn: { width: 54, height: 54, backgroundColor: COLORS.surface, borderRadius: 18, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: COLORS.border },
  premiumBanner: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.surface, marginHorizontal: SIZES.md, padding: SIZES.lg, borderRadius: 24, marginBottom: SIZES.xl, borderWidth: 1, borderColor: COLORS.border },
  premiumIcon: { width: 44, height: 44, backgroundColor: COLORS.primary, borderRadius: 14, justifyContent: 'center', alignItems: 'center' },
  premiumTextContainer: { flex: 1, marginLeft: SIZES.md },
  premiumTitle: { fontSize: 16, fontWeight: '900', color: COLORS.textPrimary },
  premiumSubtitle: { fontSize: 12, color: COLORS.textTertiary, fontWeight: '600' },
  tabs: { flexDirection: 'row', paddingHorizontal: SIZES.md, gap: SIZES.md, marginBottom: SIZES.lg },
  tab: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', height: 50, borderRadius: 15, backgroundColor: 'transparent', gap: 8 },
  activeTab: { backgroundColor: COLORS.surface, borderWidth: 1, borderColor: COLORS.border },
  tabText: { fontSize: 14, fontWeight: '700', color: COLORS.textTertiary },
  activeTabText: { fontSize: 14, fontWeight: '800', color: COLORS.textPrimary },
  grid: { paddingHorizontal: SIZES.md },
  emptyContainer: { alignItems: 'center', paddingVertical: SIZES.xxl, backgroundColor: COLORS.surface, borderRadius: 32, borderWidth: 1, borderColor: COLORS.border },
  emptyIconCircle: { width: 80, height: 80, backgroundColor: COLORS.background, borderRadius: 40, justifyContent: 'center', alignItems: 'center', marginBottom: SIZES.md },
  emptyText: { fontSize: 15, color: COLORS.textTertiary, fontWeight: '600', textAlign: 'center', marginBottom: SIZES.lg },
  startBtn: { backgroundColor: COLORS.primaryLight, paddingHorizontal: 24, paddingVertical: 14, borderRadius: 20, borderWidth: 1, borderColor: COLORS.primary },
  startBtnText: { color: COLORS.primary, fontWeight: '900', fontSize: 15 },
  gridContainer: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: SIZES.md, justifyContent: 'space-between' },
  gridItem: { width: (width - SIZES.md * 2 - SIZES.sm) / 2, height: 180, marginBottom: SIZES.sm, borderRadius: 20, backgroundColor: COLORS.surface, borderWidth: 1, borderColor: COLORS.border, overflow: 'hidden' },
  gridImage: { width: '100%', height: '100%' },
  gridTextOnly: { flex: 1, padding: SIZES.md, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.surface },
  gridTextTitle: { fontSize: 15, fontWeight: '800', color: COLORS.textPrimary, textAlign: 'center', marginBottom: 8 },
  gridTextBadge: { fontSize: 10, fontWeight: '900', color: COLORS.primary, backgroundColor: COLORS.background, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, overflow: 'hidden' },

  // ESTILOS DEL MODAL DE EDICIÓN
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.8)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: COLORS.background, borderTopLeftRadius: 30, borderTopRightRadius: 30, paddingHorizontal: SIZES.lg, paddingTop: SIZES.lg },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SIZES.md },
  modalTitle: { fontSize: 18, fontWeight: '900', color: COLORS.textPrimary },
  saveBtnText: { color: COLORS.primary, fontSize: 16, fontWeight: '800' },
  editAvatarContainer: { alignItems: 'center', marginBottom: SIZES.xl, marginTop: SIZES.sm },
  avatarButton: { position: 'relative' },
  editAvatarImage: { width: 100, height: 100, borderRadius: 50, borderWidth: 2, borderColor: COLORS.border },
  cameraIconContainer: { position: 'absolute', bottom: 0, right: 0, backgroundColor: COLORS.primary, width: 32, height: 32, borderRadius: 16, justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: COLORS.background },
  inputContainer: { marginBottom: SIZES.lg },
  inputLabel: { color: COLORS.textSecondary, fontSize: 14, fontWeight: '700', marginBottom: 8 },
  textInput: { backgroundColor: COLORS.surface, color: COLORS.textPrimary, borderRadius: 16, paddingHorizontal: 16, height: 54, fontSize: 16, borderWidth: 1, borderColor: COLORS.border }
});