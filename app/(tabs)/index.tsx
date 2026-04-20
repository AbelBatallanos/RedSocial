import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, Dimensions, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Menu, Bell, Send, Heart, Bookmark, LayoutGrid, Users, Ghost, LogOut, Sparkles, X, ChevronRight } from 'lucide-react-native';
import { COLORS, SIZES, globalStyles } from '../../src/styles/theme';
import { Avatar } from '../../src/components/ui/Avatar';
import { PostCard } from '../../src/components/feed/PostCard';
import { PremiumModal } from '../../src/components/ui/PremiumModal';

const { width } = Dimensions.get('window');

const MOCK_POSTS = [
  {
    id: '1',
    user: { name: 'ana_garcia', username: 'ana_g', avatar: 'https://api.dicebear.com/7.x/avataaars/png?seed=ana' },
    time: '2 h',
    title: 'La Esquina del Sabor',
    content: 'Fui ayer con mi familia. Comida mediterránea increíble. Tienen que probar la paella de mariscos, sé que les va a encantar. 🥘✨',
    stats: { likes: 45, comments: 12 },
  },
  {
    id: '2',
    user: { name: 'miguel.torres', username: 'mike_t', avatar: 'https://api.dicebear.com/7.x/avataaars/png?seed=miguel' },
    time: '4 d',
    title: 'Serie: The Bear',
    content: 'El nivel de estrés que maneja esta serie en la cocina es brutal, pero es una obra maestra. Totalmente recomendada.',
    image: 'https://picsum.photos/400/200',
    stats: { likes: 120, comments: 34 },
  }
];

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState('amigos');
  const [isSidebarVisible, setSidebarVisible] = useState(false);
  const [isPremiumVisible, setPremiumVisible] = useState(false);

  const toggleSidebar = () => setSidebarVisible(!isSidebarVisible);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header Unificado */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.iconCircle} onPress={toggleSidebar}>
          <Menu size={22} stroke={COLORS.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.logoText}>RecTrack</Text>
        <TouchableOpacity style={styles.iconCircle}>
          <Bell size={22} stroke={COLORS.textPrimary} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        {/* Quick Post Area */}
        <View style={styles.statusArea}>
          <Avatar size={48} name="Diego UX" />
          <TouchableOpacity style={styles.inputPlaceholder}>
            <Text style={styles.placeholderText}>¿Qué vas a recomendar hoy?</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.sendBtn}>
            <Send size={18} stroke={COLORS.surface} />
          </TouchableOpacity>
        </View>

        {/* Tabs Modernas */}
        <View style={styles.tabsContainer}>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'amigos' && styles.activeTab]} 
            onPress={() => setActiveTab('amigos')}
          >
            <Text style={[styles.tabText, activeTab === 'amigos' && styles.activeTabText]}>Amigos</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'para_ti' && styles.activeTab]} 
            onPress={() => setActiveTab('para_ti')}
          >
            <Text style={[styles.tabText, activeTab === 'para_ti' && styles.activeTabText]}>Para ti</Text>
          </TouchableOpacity>
        </View>

        {/* Feed */}
        <View style={styles.feed}>
          {MOCK_POSTS.map(post => (
            <PostCard key={post.id} {...post} />
          ))}
        </View>
      </ScrollView>

      {/* SIDEBAR (Drawer Izquierdo Estilo Imagen) */}
      <Modal
        visible={isSidebarVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={toggleSidebar}
      >
        <View style={styles.sidebarOverlay}>
          <View style={[styles.sidebarContent, { paddingTop: insets.top + SIZES.md }]}>
            {/* Sidebar Header */}
            <View style={styles.sidebarHeader}>
              <Text style={styles.sidebarTitle}>Feeds</Text>
              <View style={styles.sidebarHeaderActions}>
                <TouchableOpacity style={styles.headerSmallBtn}>
                  <X size={18} stroke={COLORS.textTertiary} />
                </TouchableOpacity>
              </View>
            </View>

            {/* Los Dos Cuadrados (Favoritos y Guardados) */}
            <View style={styles.squareActions}>
              <TouchableOpacity style={styles.squareBtn}>
                <Heart size={24} stroke={COLORS.textPrimary} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.squareBtn} onPress={() => { toggleSidebar(); router.push('/saved'); }}>
                <Bookmark size={24} stroke={COLORS.textPrimary} />
              </TouchableOpacity>
            </View>

            {/* Sidebar Menu List */}
            <ScrollView style={styles.menuList} showsVerticalScrollIndicator={false}>
              <View style={styles.menuCard}>
                <TouchableOpacity style={styles.menuListItem}>
                  <Text style={styles.menuListText}>For you</Text>
                </TouchableOpacity>
                <View style={styles.listDivider} />
                <TouchableOpacity style={styles.menuListItem}>
                  <Text style={styles.menuListText}>Following</Text>
                </TouchableOpacity>
                <View style={styles.listDivider} />
                <TouchableOpacity style={styles.menuListItem} onPress={() => { toggleSidebar(); router.push('/saved'); }}>
                  <Text style={styles.menuListText}>Ghost posts</Text>
                  <Ghost size={18} stroke={COLORS.textTertiary} />
                </TouchableOpacity>
                <View style={styles.listDivider} />
                <TouchableOpacity style={styles.menuListItem}>
                  <Text style={styles.menuListText}>bolivia</Text>
                </TouchableOpacity>
              </View>

              {/* Botones de acción inferior */}
              <View style={styles.bottomActions}>
                <TouchableOpacity 
                  style={styles.premiumAction}
                  onPress={() => {
                    setSidebarVisible(false);
                    setPremiumVisible(true);
                  }}
                >
                  <Sparkles size={18} stroke={COLORS.surface} fill={COLORS.surface} />
                  <Text style={styles.premiumActionText}>Suscríbete a Vibes+</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.logoutAction}>
                  <LogOut size={20} stroke={COLORS.secondary} />
                  <Text style={styles.logoutActionText}>Cerrar sesión</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>

          {/* Backdrop para cerrar (Lado Derecho) */}
          <TouchableOpacity 
            style={styles.sidebarBackdrop} 
            onPress={toggleSidebar} 
            activeOpacity={1} 
          />
        </View>
      </Modal>

      {/* PREMIUM MODAL */}
      <PremiumModal 
        isVisible={isPremiumVisible} 
        onClose={() => setPremiumVisible(false)} 
      />
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
  logoText: {
    fontSize: 22,
    fontWeight: '900',
    color: COLORS.primary,
    letterSpacing: -1,
  },
  iconCircle: {
    width: 40,
    height: 40,
    backgroundColor: COLORS.surface,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusArea: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SIZES.md,
    backgroundColor: COLORS.surface,
    marginHorizontal: SIZES.md,
    borderRadius: 24,
    marginTop: SIZES.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  inputPlaceholder: {
    flex: 1,
    marginHorizontal: SIZES.sm,
    height: 44,
    justifyContent: 'center',
  },
  placeholderText: {
    color: COLORS.textTertiary,
    fontSize: 15,
    fontWeight: '600',
  },
  sendBtn: {
    backgroundColor: COLORS.primary,
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabsContainer: {
    flexDirection: 'row',
    paddingHorizontal: SIZES.md,
    marginTop: SIZES.lg,
    marginBottom: SIZES.sm,
    gap: SIZES.md,
  },
  tab: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 14,
    backgroundColor: COLORS.surface,
  },
  activeTab: {
    backgroundColor: COLORS.primary,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.textTertiary,
  },
  activeTabText: {
    color: COLORS.textPrimary,
  },
  feed: {
    paddingTop: SIZES.sm,
  },

  // SIDEBAR ESTILO IMAGEN
  sidebarOverlay: {
    flex: 1,
    flexDirection: 'row',
  },
  sidebarBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  sidebarContent: {
    width: width * 0.75,
    height: '100%',
    backgroundColor: COLORS.background,
    padding: SIZES.lg,
  },
  sidebarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SIZES.xl,
  },
  sidebarTitle: {
    fontSize: 28,
    fontWeight: '900',
    color: COLORS.textPrimary,
  },
  sidebarHeaderActions: {
    flexDirection: 'row',
    gap: SIZES.md,
  },
  headerSmallBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  squareActions: {
    flexDirection: 'row',
    gap: SIZES.md,
    marginBottom: SIZES.xl,
  },
  squareBtn: {
    flex: 1,
    height: 64,
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  menuList: {
    flex: 1,
  },
  menuCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 24,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  menuListItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 18,
    paddingHorizontal: 20,
  },
  menuListText: {
    fontSize: 17,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  listDivider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginHorizontal: 20,
  },
  bottomActions: {
    marginTop: SIZES.xl,
    gap: SIZES.lg,
    paddingBottom: 40,
  },
  premiumAction: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    padding: SIZES.md,
    borderRadius: 16,
    gap: SIZES.sm,
    justifyContent: 'center',
  },
  premiumActionText: {
    color: COLORS.surface,
    fontSize: 14,
    fontWeight: '900',
  },
  logoutAction: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SIZES.sm,
    paddingLeft: SIZES.xs,
  },
  logoutActionText: {
    color: COLORS.secondary,
    fontSize: 15,
    fontWeight: '800',
  },
});
