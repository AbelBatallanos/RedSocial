import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, Dimensions, ActivityIndicator, RefreshControl } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Menu, Bell, Send, Heart, Bookmark, Ghost, LogOut, Sparkles, X } from 'lucide-react-native';
import { useRouter } from 'expo-router';

import { COLORS, SIZES, globalStyles } from '../../src/styles/theme';
import { Avatar } from '../../src/components/ui/Avatar';
import { PostCard } from '../../src/components/feed/PostCard';
import { PremiumModal } from '../../src/components/ui/PremiumModal';
import { useAuthContext } from '../../src/context/AuthContext';
import { obtenerFeedGlobal, obtenerPosts, obtenerSolicitudesPendientes } from '../../src/services/api';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { logout, token, user } = useAuthContext();

  const [activeTab, setActiveTab] = useState('amigos');
  const [isSidebarVisible, setSidebarVisible] = useState(false);
  const [isPremiumVisible, setPremiumVisible] = useState(false);

  const [recomendaciones, setRecomendaciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const toggleSidebar = () => setSidebarVisible(!isSidebarVisible);

  const [hasNotifications, setHasNotifications] = useState(false);

  const revisarNotificaciones = async () => {
    if (!token) return;
    const solicitudes = await obtenerSolicitudesPendientes(token);
    if (solicitudes && solicitudes.length > 0) {
      setHasNotifications(true);
    } else {
      setHasNotifications(false);
    }
  };

  useEffect(() => {
    revisarNotificaciones();
  }, [token]);

  const cargarFeed = async () => {
    if (!token) return;
    setLoading(true);
    const result = await obtenerFeedGlobal(token);
    if (result.success) {
      setRecomendaciones(result.data);
    }
    setLoading(false);
  };

  

  const onRefresh = async () => {
    setRefreshing(true);
    await cargarFeed();
    setRefreshing(false);
  };

  const getFullImageUrl = (url: string | null) => {
    if (!url) return null;
    if (url.startsWith('http')) return url;
    return `http://192.168.1.12:8000${url}`;
  };

  useEffect(() => {
    cargarFeed();
  }, [token]);

  const formatTime = (dateString: string) => {
    if (!dateString) {
      return "Reciente";
    }

    const postDate = new Date(dateString);


    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - postDate.getTime()) / 1000);

    if (diffInSeconds < 60) return 'Ahora';
    if (diffInSeconds < 3600) return `Hace ${Math.floor(diffInSeconds / 60)} min`;
    if (diffInSeconds < 86400) return `Hace ${Math.floor(diffInSeconds / 3600)} h`;

    return postDate.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'short'
    });

  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header Unificado */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.iconCircle} onPress={toggleSidebar}>
          <Menu size={22} stroke={COLORS.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.logoText}>RecTrack</Text>
        <TouchableOpacity
          style={styles.iconCircle}
          onPress={() => router.push('/activity')}
        >
          <Bell size={22} stroke={COLORS.textPrimary} />

          {hasNotifications && <View style={styles.redDot} />}
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.primary} />
        }
      >
        {/* Quick Post Area - USA TU AVATAR REAL */}
        <View style={styles.statusArea}>
          <Avatar size={48} name={user?.nombre_usuario || "Diego"} />
          <TouchableOpacity
            style={styles.inputPlaceholder}
            onPress={() => router.push('/(tabs)/create')}
          >
            <Text style={styles.placeholderText}>¿Qué vas a recomendar hoy?</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.sendBtn} onPress={() => router.push('/(tabs)/create')}>
            <Send size={18} stroke={COLORS.surface} />
          </TouchableOpacity>
        </View>

        {/* Tabs Modernas */}
        <View style={styles.tabsContainer}>
          {['amigos', 'para_ti'].map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[styles.tab, activeTab === tab && styles.activeTab]}
              onPress={() => setActiveTab(tab)}
            >
              <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>
                {tab === 'amigos' ? 'Amigos' : 'Para ti'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Feed Real */}
        <View style={styles.feed}>
          {loading && !refreshing ? (
            <ActivityIndicator size="large" color={COLORS.primary} style={{ marginTop: 40 }} />
          ) : recomendaciones.length > 0 ? (
            recomendaciones.map((item: any) => (
              <PostCard
                key={item.id}
                id={item.id}
                user={{
                  name: item.autor_detalle?.nombre_usuario || "Usuario",
                  username: item.autor_detalle?.nombre_usuario || "invitado",
                  avatar: item.autor_detalle?.avatar
                }}
                time={formatTime(item.creado_en)}
                title={item.titulo}
                content={item.descripcion}
                image={getFullImageUrl(item.imagen)}
                enlace_externo={item.enlace_externo}
                tipo={item.tipo}
                stats={{ likes: 0, comments: 0 }}
                isRecommendation={true}
              />
            ))
          ) : (
            <View style={{ alignItems: 'center', marginTop: 60 }}>
              <Ghost size={48} stroke={COLORS.textTertiary} />
              <Text style={{ color: COLORS.textTertiary, marginTop: 10, fontWeight: '600' }}>
                No hay recomendaciones aún.
              </Text>
            </View>
          )}
        </View>
      </ScrollView>

      <Modal visible={isSidebarVisible} transparent animationType="fade" onRequestClose={toggleSidebar}>
        <View style={styles.sidebarOverlay}>
          <View style={[styles.sidebarContent, { paddingTop: insets.top + SIZES.md }]}>
            <View style={styles.sidebarHeader}>
              <Text style={styles.sidebarTitle}>Feeds</Text>
              <TouchableOpacity style={styles.headerSmallBtn} onPress={toggleSidebar}>
                <X size={18} stroke={COLORS.textTertiary} />
              </TouchableOpacity>
            </View>

            <View style={styles.squareActions}>
              <TouchableOpacity style={styles.squareBtn}><Heart size={24} stroke={COLORS.textPrimary} /></TouchableOpacity>
              <TouchableOpacity style={styles.squareBtn}><Bookmark size={24} stroke={COLORS.textPrimary} /></TouchableOpacity>
            </View>

            <ScrollView style={styles.menuList}>
              <View style={styles.menuCard}>
                {['For you', 'Following', 'Ghost posts', 'Bolivia'].map((text, index) => (
                  <View key={text}>
                    <TouchableOpacity style={styles.menuListItem}>
                      <Text style={styles.menuListText}>{text}</Text>
                      {text === 'Ghost posts' && <Ghost size={18} stroke={COLORS.textTertiary} />}
                    </TouchableOpacity>
                    {index < 3 && <View style={styles.listDivider} />}
                  </View>
                ))}
              </View>

              <View style={styles.bottomActions}>
                <TouchableOpacity style={styles.premiumAction} onPress={() => { setSidebarVisible(false); setPremiumVisible(true); }}>
                  <Sparkles size={18} stroke={COLORS.surface} fill={COLORS.surface} />
                  <Text style={styles.premiumActionText}>Suscríbete a Vibes+</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.logoutAction} onPress={logout}>
                  <LogOut size={20} stroke={COLORS.secondary} />
                  <Text style={styles.logoutActionText}>Cerrar sesión</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
          <TouchableOpacity style={styles.sidebarBackdrop} onPress={toggleSidebar} activeOpacity={1} />
        </View>
      </Modal>

      <PremiumModal isVisible={isPremiumVisible} onClose={() => setPremiumVisible(false)} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: SIZES.md, height: 64 },
  logoText: { fontSize: 22, fontWeight: '900', color: COLORS.primary, letterSpacing: -1 },
  iconCircle: { width: 40, height: 40, backgroundColor: COLORS.surface, borderRadius: 20, justifyContent: 'center', alignItems: 'center', position: 'relative' },
  statusArea: { flexDirection: 'row', alignItems: 'center', padding: SIZES.md, backgroundColor: COLORS.surface, marginHorizontal: SIZES.md, borderRadius: 24, marginTop: SIZES.sm, borderWidth: 1, borderColor: COLORS.border },
  inputPlaceholder: { flex: 1, marginHorizontal: SIZES.sm, height: 44, justifyContent: 'center' },
  placeholderText: { color: COLORS.textTertiary, fontSize: 15, fontWeight: '600' },
  sendBtn: { backgroundColor: COLORS.primary, width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center' },
  tabsContainer: { flexDirection: 'row', paddingHorizontal: SIZES.md, marginTop: SIZES.lg, marginBottom: SIZES.sm, gap: SIZES.md },
  tab: { paddingVertical: 10, paddingHorizontal: 20, borderRadius: 14, backgroundColor: COLORS.surface },
  activeTab: { backgroundColor: COLORS.primary },
  tabText: { fontSize: 14, fontWeight: '800', color: COLORS.textTertiary },
  activeTabText: { color: COLORS.textPrimary },
  feed: { paddingTop: SIZES.sm },
  sidebarOverlay: { flex: 1, flexDirection: 'row' },
  sidebarBackdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)' },
  sidebarContent: { width: width * 0.75, height: '100%', backgroundColor: COLORS.background, padding: SIZES.lg },
  sidebarHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SIZES.xl },
  sidebarTitle: { fontSize: 28, fontWeight: '900', color: COLORS.textPrimary },
  headerSmallBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: COLORS.surface, justifyContent: 'center', alignItems: 'center' },
  squareActions: { flexDirection: 'row', gap: SIZES.md, marginBottom: SIZES.xl },
  squareBtn: { flex: 1, height: 64, backgroundColor: COLORS.surface, borderRadius: 16, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: COLORS.border },
  menuList: { flex: 1 },
  menuCard: { backgroundColor: COLORS.surface, borderRadius: 24, paddingVertical: 8, borderWidth: 1, borderColor: COLORS.border },
  menuListItem: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 18, paddingHorizontal: 20 },
  menuListText: { fontSize: 17, fontWeight: '700', color: COLORS.textPrimary },
  listDivider: { height: 1, backgroundColor: COLORS.border, marginHorizontal: 20 },
  bottomActions: { marginTop: SIZES.xl, gap: SIZES.lg, paddingBottom: 40 },
  premiumAction: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.primary, padding: SIZES.md, borderRadius: 16, gap: SIZES.sm, justifyContent: 'center' },
  premiumActionText: { color: COLORS.surface, fontSize: 14, fontWeight: '900' },
  logoutAction: { flexDirection: 'row', alignItems: 'center', gap: SIZES.sm, paddingLeft: SIZES.xs },
  logoutActionText: { color: COLORS.secondary, fontSize: 15, fontWeight: '800' },
  redDot: {
    position: 'absolute',
    top: 8, 
    right: 8,
    width: 12,
    height: 12,
    backgroundColor: COLORS.secondary,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: COLORS.surface,
  },
});