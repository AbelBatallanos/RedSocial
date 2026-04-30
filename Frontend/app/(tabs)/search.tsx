// app/(tabs)/search.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Search as SearchIcon, Users, ChevronRight } from 'lucide-react-native';
import { COLORS, SIZES, globalStyles } from '../../src/styles/theme';
import { Avatar } from '../../src/components/ui/Avatar';
import { useAuthContext } from '../../src/context/AuthContext';
import { buscarUsuarios, enviarSolicitudAmistad, obtenerTodosLosUsuarios } from '../../src/services/api';
import { useRouter } from 'expo-router';

const getFullImageUrl = (url: string | null | undefined) => {
  if (!url) return undefined;
  if (url.startsWith('http')) return url;
  return `http://54.166.248.222:8000${url}`;
};

const POPULAR_SEARCHES = ['🍔 Comida', '📺 Series', '💻 Tech', '✈️ Viajes', '☕ Café'];

export default function SearchScreen() {
  const insets = useSafeAreaInsets();
  const { token, user: currentUser } = useAuthContext(); // Cambiamos el nombre para mayor claridad
  const router = useRouter();

  const [searchText, setSearchText] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [dbUsers, setDbUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [requestSent, setRequestSent] = useState<string[]>([]);

  // CARGAR USUARIOS DE LA DB
  useEffect(() => {
    const cargarUsuariosDB = async () => {
      try {
        const users = await obtenerTodosLosUsuarios(token!);
        if (users && users.length > 0) {
          // FILTRO CORRECTO: Excluimos al usuario actual basándonos en su ID o correo
          // Asegúrate de que currentUser tenga el 'id' disponible
          const filteredUsers = users.filter((u: any) => u.id !== currentUser?.id);

          // Tomamos hasta 3 usuarios aleatorios o recientes como sugerencias
          setDbUsers(filteredUsers.slice(0, 3));
        }
      } catch (error) {
        console.log("❌ Error cargando usuarios:", error);
      }
    };
    if (token) cargarUsuariosDB();
  }, [token, currentUser]);

  // BÚSQUEDA REAL
  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (searchText.length > 2) {
        setLoading(true);
        const users = await buscarUsuarios(token!, searchText);
        // FILTRO CORRECTO en los resultados de búsqueda
        const filteredResults = (users || []).filter((u: any) => u.id !== currentUser?.id);
        setResults(filteredResults);
        setLoading(false);
      } else {
        setResults([]);
      }
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [searchText]);

  const handleFollow = async (amigoId: string) => {
    const res = await enviarSolicitudAmistad(token!, amigoId);
    if (res.informacion || res.id) {
      setRequestSent([...requestSent, amigoId]);
      Alert.alert("Éxito", "Solicitud enviada.");
    } else {
      Alert.alert("Aviso", res.error || "No se pudo enviar");
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* ... (El resto de tu UI se mantiene igual, header, buscador, etc.) ... */}
      <View style={styles.header}>
        <Text style={styles.title}>Buscar</Text>
        <View style={styles.searchBar}>
          <SearchIcon size={20} stroke={COLORS.textTertiary} style={{ marginRight: 10 }} />
          <TextInput
            placeholder="Buscar @usuarios..."
            placeholderTextColor={COLORS.textTertiary}
            style={styles.searchInput}
            value={searchText}
            onChangeText={setSearchText}
            autoCapitalize="none"
          />
          {loading && <ActivityIndicator size="small" color={COLORS.primary} />}
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        {/* RESULTADOS DE BÚSQUEDA ACTIVA */}
        {results.length > 0 && (
          <View style={{ marginBottom: SIZES.xl }}>
            <Text style={styles.sectionTitle}>Resultados</Text>
            {results.map(user => (
              <UserItem key={user.id} user={user} onFollow={handleFollow} requestSent={requestSent} />
            ))}
          </View>
        )}

        {/* SECCIÓN SUGERENCIAS (SOLO DB) */}
        {!searchText && dbUsers.length > 0 && (
          <>
            <View style={styles.sectionHeader}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Users size={18} stroke={COLORS.primary} style={{ marginRight: 8 }} />
                <Text style={styles.sectionTitle}>Sugerencias para ti</Text>
              </View>
              <TouchableOpacity
                style={styles.viewAllBtn}
                onPress={() => router.push('/all-users')}
              >
                <Text style={styles.viewAllText}>Ver más</Text>
                <ChevronRight size={14} color={COLORS.primary} />
              </TouchableOpacity>
            </View>

            {dbUsers.map(user => (
              <UserItem key={user.id} user={user} onFollow={handleFollow} requestSent={requestSent} />
            ))}
          </>
        )}

        {/* TENDENCIAS */}
        <View style={styles.trendingSection}>
          <Text style={styles.sectionTitle}>Tendencias</Text>
          <View style={styles.chipsContainer}>
            {POPULAR_SEARCHES.map(item => (
              <TouchableOpacity key={item} style={styles.chip}><Text style={styles.chipText}>{item}</Text></TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

// ... (El componente UserItem y StyleSheet se mantienen igual) ...}

// Componente interno para no repetir código
const UserItem = ({ user, onFollow, requestSent }: any) => (
  <View style={styles.userItem}>
    <Avatar source={getFullImageUrl(user.avatar)} name={user.nombre_usuario} size={52} />
    <View style={styles.userInfo}>
      <Text style={styles.userName}>@{user.nombre_usuario}</Text>
      <Text style={styles.fullName}>{user.id.includes('mock') ? 'Sugerencia' : 'Usuario real'}</Text>
    </View>
    <TouchableOpacity
      style={[styles.followBtn, requestSent.includes(user.id) && styles.followingBtn]}
      onPress={() => onFollow(user.id)}
      disabled={user.id.includes('mock') || requestSent.includes(user.id)}
    >
      <Text style={[styles.followBtnText, requestSent.includes(user.id) && styles.followingBtnText]}>
        {requestSent.includes(user.id) ? 'Pendiente' : 'Seguir'}
      </Text>
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { padding: SIZES.md },
  title: { ...globalStyles.title, marginBottom: SIZES.md, fontSize: 24 },
  searchBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.surface, borderRadius: 18, paddingHorizontal: SIZES.md, height: 54, borderWidth: 1, borderColor: COLORS.border },
  searchInput: { flex: 1, fontSize: 16, fontWeight: '600', color: COLORS.textPrimary },
  content: { padding: SIZES.md, paddingBottom: 100 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: SIZES.md },
  sectionTitle: { fontSize: 18, fontWeight: '900', color: COLORS.textPrimary },
  viewAllBtn: { flexDirection: 'row', alignItems: 'center' },
  viewAllText: { fontSize: 13, color: COLORS.primary, fontWeight: '700', marginRight: 4 },
  userItem: { flexDirection: 'row', alignItems: 'center', marginBottom: SIZES.md, backgroundColor: COLORS.surface, padding: SIZES.sm, borderRadius: 20, borderWidth: 1, borderColor: COLORS.border },
  userInfo: { flex: 1, marginLeft: SIZES.sm },
  userName: { fontSize: 16, fontWeight: '800', color: COLORS.textPrimary },
  fullName: { fontSize: 13, color: COLORS.textSecondary, fontWeight: '600' },
  followBtn: { backgroundColor: COLORS.primary, paddingHorizontal: 16, paddingVertical: 10, borderRadius: 12 },
  followingBtn: { backgroundColor: COLORS.surfaceAlt },
  followBtnText: { color: COLORS.textPrimary, fontSize: 13, fontWeight: '900' },
  followingBtnText: { color: COLORS.textSecondary },
  trendingSection: { marginTop: SIZES.xl, padding: SIZES.lg, backgroundColor: COLORS.surface, borderRadius: 24, borderWidth: 1, borderColor: COLORS.border },
  chipsContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: SIZES.sm, marginTop: 10 },
  chip: { backgroundColor: COLORS.background, paddingVertical: 10, paddingHorizontal: 16, borderRadius: 14, borderWidth: 1, borderColor: COLORS.border },
  chipText: { fontSize: 14, color: COLORS.textPrimary, fontWeight: '700' },
});