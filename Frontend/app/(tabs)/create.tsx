import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, Alert, ActivityIndicator, Image, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { X, ChevronDown, MapPin, Star, Image as ImageIcon, Tag, Eye, EyeOff, Link as LinkIcon, Film, Book, Tv, MoreHorizontal } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import { useRouter, useLocalSearchParams } from 'expo-router';

import { COLORS, SIZES } from '../../src/styles/theme';
import { Avatar } from '../../src/components/ui/Avatar';
import { useAuthContext } from '../../src/context/AuthContext';
// AÑADIMOS actualizarRecomendacion
import { crearRecomendacion, actualizarRecomendacion } from '../../src/services/api';

const CATEGORIES = [
  { id: 'pelicula', label: 'Película', icon: Film },
  { id: 'libro', label: 'Libro', icon: Book },
  { id: 'lugar', label: 'Lugar', icon: MapPin },
  { id: 'serie', label: 'Serie', icon: Tv },
  { id: 'otro', label: 'Otro', icon: MoreHorizontal },
];

export default function CreateScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { token, user } = useAuthContext();

  // RECIBIMOS LOS PARÁMETROS SI VENIMOS DE "EDITAR"
  const { isEditing, id, title, content, tipo, enlace, image } = useLocalSearchParams();

  const [loading, setLoading] = useState(false);
  const [showCatMenu, setShowCatMenu] = useState(false);
  const [showLinkInput, setShowLinkInput] = useState(false);
  
  const [form, setForm] = useState({
    titulo: '',
    descripcion: '',
    tipo: 'lugar', 
    visibilidad: 'public',
    enlace_externo: '',
  });
  
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // SI ESTAMOS EDITANDO, RELLENAMOS EL FORMULARIO AUTOMÁTICAMENTE
  useEffect(() => {
    if (isEditing === 'true') {
      setForm({
        titulo: (title as string) || '',
        descripcion: (content as string) || '',
        tipo: (tipo as string) || 'lugar',
        visibilidad: 'public',
        enlace_externo: (enlace as string) || '',
      });
      if (enlace && enlace !== 'null') setShowLinkInput(true);
      if (image && image !== 'null') setSelectedImage(image as string);
    }
  }, [isEditing]);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  const handlePublish = async () => {
    if (!form.titulo || !form.descripcion) {
      Alert.alert('Atención', 'Por favor agrega un título y una descripción.');
      return;
    }

    setLoading(true);
    let result;

    // MAGIA AQUÍ: Decidimos si Creamos o Actualizamos
    if (isEditing === 'true' && id) {
      result = await actualizarRecomendacion(token!, id as string, form, selectedImage);
    } else {
      result = await crearRecomendacion(token!, form, selectedImage);
    }
    
    setLoading(false);

    if (result.success) {
      Alert.alert('¡Éxito!', isEditing === 'true' ? 'Recomendación actualizada.' : 'Recomendación publicada.');
      router.replace('/(tabs)'); 
    } else {
      const errorMsg = typeof result.error === 'string' ? result.error : JSON.stringify(result.error);
      Alert.alert('Error', errorMsg);
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.closeBtn} onPress={() => router.back()}>
          <X size={24} stroke={COLORS.textPrimary} />
        </TouchableOpacity>
        {/* Cambia el título si estás editando */}
        <Text style={styles.headerTitle}>{isEditing === 'true' ? 'Editar Post' : 'Nueva Recomendación'}</Text>
        <TouchableOpacity 
          style={[styles.publishBtn, loading && { opacity: 0.7 }]} 
          onPress={handlePublish}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator size="small" color={COLORS.surface} />
          ) : (
            <Text style={styles.publishBtnText}>{isEditing === 'true' ? 'Guardar' : 'Publicar'}</Text>
          )}
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.userRow}>
          <Avatar name={user?.nombre_usuario || "Usuario"} size={56} />
          <View style={styles.userText}>
            <Text style={styles.userName}>{user?.nombre_usuario || "Tú"}</Text>
            <View style={styles.settingsRow}>
              <TouchableOpacity style={styles.miniPicker} onPress={() => setShowCatMenu(!showCatMenu)}>
                <Text style={styles.miniPickerText}># {form.tipo.toUpperCase()}</Text>
                <ChevronDown size={12} stroke={COLORS.primary} />
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.miniPicker} 
                onPress={() => setForm({...form, visibilidad: form.visibilidad === 'public' ? 'private' : 'public'})}
              >
                {form.visibilidad === 'public' ? <Eye size={12} stroke={COLORS.primary} /> : <EyeOff size={12} stroke={COLORS.textSecondary} />}
                <Text style={[styles.miniPickerText, form.visibilidad !== 'public' && {color: COLORS.textSecondary}]}>
                  {form.visibilidad === 'public' ? 'Público' : 'Privado'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {showCatMenu && (
          <View style={styles.catGrid}>
            {CATEGORIES.map((cat) => (
              <TouchableOpacity 
                key={cat.id}
                style={[styles.catOption, form.tipo === cat.id && styles.catOptionActive]}
                onPress={() => {
                  setForm({...form, tipo: cat.id});
                  setShowCatMenu(false);
                }}
              >
                <cat.icon size={16} stroke={form.tipo === cat.id ? COLORS.surface : COLORS.primary} />
                <Text style={[styles.catOptionText, form.tipo === cat.id && {color: COLORS.surface}]}>{cat.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        <TextInput
          style={styles.titleInput}
          placeholder="¿Qué recomiendas?"
          placeholderTextColor={COLORS.textTertiary}
          value={form.titulo}
          onChangeText={(val) => setForm({...form, titulo: val})}
        />

        <TextInput
          style={styles.textInput}
          placeholder="Cuéntale a tus amigos por qué te gusta..."
          placeholderTextColor={COLORS.textTertiary}
          multiline
          value={form.descripcion}
          onChangeText={(val) => setForm({...form, descripcion: val})}
        />

        {showLinkInput && (
          <View style={styles.linkContainer}>
            <LinkIcon size={18} stroke={COLORS.primary} />
            <TextInput
              style={styles.linkInput}
              placeholder="Pega un enlace (Maps, Spotify, etc.)"
              placeholderTextColor={COLORS.textTertiary}
              value={form.enlace_externo}
              onChangeText={(val) => setForm({...form, enlace_externo: val})}
              autoCapitalize="none"
            />
          </View>
        )}

        {selectedImage && (
          <View style={styles.imagePreviewContainer}>
            <Image source={{ uri: selectedImage }} style={styles.imagePreview} />
            <TouchableOpacity style={styles.removeImage} onPress={() => setSelectedImage(null)}>
              <X size={16} color="white" />
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.footerIcons}>
          <TouchableOpacity style={styles.iconBtn} onPress={pickImage}>
            <ImageIcon size={28} stroke={selectedImage ? COLORS.primary : COLORS.textSecondary} />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.iconBtn} onPress={() => setShowLinkInput(!showLinkInput)}>
            <LinkIcon size={28} stroke={showLinkInput || form.enlace_externo ? COLORS.primary : COLORS.textSecondary} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.iconBtn}>
            <MapPin size={28} stroke={COLORS.textSecondary} />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.iconBtn}>
            <Star size={28} stroke={COLORS.textSecondary} />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: SIZES.md, height: 64 },
  closeBtn: { width: 40, height: 40, backgroundColor: COLORS.surface, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
  headerTitle: { fontSize: 17, fontWeight: '900', color: COLORS.textPrimary },
  publishBtn: { backgroundColor: COLORS.primary, paddingHorizontal: 20, paddingVertical: 10, borderRadius: 14, minWidth: 100, alignItems: 'center' },
  publishBtnText: { color: COLORS.surface, fontSize: 14, fontWeight: '900' },
  content: { padding: SIZES.md },
  userRow: { flexDirection: 'row', alignItems: 'center', marginBottom: SIZES.lg },
  userText: { marginLeft: SIZES.md },
  userName: { fontSize: 18, fontWeight: '900', color: COLORS.textPrimary },
  settingsRow: { flexDirection: 'row', gap: 8, marginTop: 4 },
  miniPicker: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.surface, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8, borderWidth: 1, borderColor: COLORS.border, gap: 4 },
  miniPickerText: { fontSize: 12, color: COLORS.primary, fontWeight: '800' },
  catGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 20, backgroundColor: COLORS.surface, padding: 12, borderRadius: 16, borderWidth: 1, borderColor: COLORS.border },
  catOption: { flexDirection: 'row', alignItems: 'center', paddingVertical: 6, paddingHorizontal: 10, borderRadius: 8, backgroundColor: COLORS.background, gap: 6 },
  catOptionActive: { backgroundColor: COLORS.primary },
  catOptionText: { fontSize: 12, fontWeight: '700', color: COLORS.textPrimary },
  titleInput: { fontSize: 24, fontWeight: '900', color: COLORS.textPrimary, marginBottom: 8 },
  textInput: { fontSize: 18, color: COLORS.textPrimary, minHeight: 100, textAlignVertical: 'top', lineHeight: 26, marginBottom: SIZES.lg, fontWeight: '500' },
  linkContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.surface, padding: 12, borderRadius: 16, marginBottom: 20, borderWidth: 1, borderColor: COLORS.border, gap: 10 },
  linkInput: { flex: 1, fontSize: 15, color: COLORS.primary, fontWeight: '600' },
  imagePreviewContainer: { position: 'relative', marginBottom: SIZES.xl },
  imagePreview: { width: '100%', height: 240, borderRadius: 20 },
  removeImage: { position: 'absolute', top: 12, right: 12, backgroundColor: 'rgba(0,0,0,0.6)', borderRadius: 12, padding: 6 },
  footerIcons: { flexDirection: 'row', paddingTop: SIZES.xl, borderTopWidth: 1, borderTopColor: COLORS.border, justifyContent: 'space-around' },
  iconBtn: { padding: 10 }
});