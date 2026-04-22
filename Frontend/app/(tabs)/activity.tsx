import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, RefreshControl } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Heart, Star, MoreHorizontal, UserPlus, MessageCircle } from 'lucide-react-native';
import { COLORS, SIZES, globalStyles } from '../../src/styles/theme';
import { Avatar } from '../../src/components/ui/Avatar';
import { useAuthContext } from '../../src/context/AuthContext';
import { obtenerSolicitudesPendientes, responderSolicitud } from '../../src/services/api';

export default function ActivityScreen() {
  const insets = useSafeAreaInsets();
  const { token } = useAuthContext();

  // ESTADOS
  const [activeTab, setActiveTab] = useState('Todo'); // Todo, Menciones, Solicitudes
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [requests, setRequests] = useState([]); // Solicitudes de amistad reales

  const cargarDatos = async () => {
    if (!token) return;
    setLoading(true);
    const data = await obtenerSolicitudesPendientes(token);
    setRequests(data || []);
    setLoading(false);
  };

  useEffect(() => {
    cargarDatos();
  }, [token]);

  const onRefresh = async () => {
    setRefreshing(true);
    await cargarDatos();
    setRefreshing(false);
  };

  const handleAction = async (id: string, action: 'aceptar' | 'rechazar') => {
    await responderSolicitud(token!, id, action);
    cargarDatos(); // Recargar después de aceptar/rechazar
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.title}>Actividad</Text>
        <View style={styles.tabs}>
          {['Todo', 'Menciones', 'Solicitudes'].map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[styles.tab, activeTab === tab && styles.activeTab]}
              onPress={() => setActiveTab(tab)}
            >
              <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>{tab}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.primary} />
        }
      >
        {loading && !refreshing ? (
          <ActivityIndicator color={COLORS.primary} style={{ marginTop: 20 }} />
        ) : (
          <>
            {/* RENDER DE SOLICITUDES REALES (Si la pestaña es 'Todo' o 'Solicitudes') */}
            {(activeTab === 'Todo' || activeTab === 'Solicitudes') && requests.map((req: any) => (
              <View key={req.id} style={styles.activityItem}>
                <View style={styles.avatarContainer}>
                  <Avatar source={req.usuario_detalle?.avatar} name={req.usuario_detalle?.nombre_usuario} size={52} />
                  <View style={[styles.typeBadge, { backgroundColor: COLORS.primary }]}>
                    <UserPlus size={14} stroke={COLORS.surface} />
                  </View>
                </View>

                <View style={styles.activityInfo}>
                  <Text style={styles.activityText}>
                    <Text style={styles.bold}>{req.usuario_detalle?.nombre_usuario}</Text> te envió una solicitud de amistad.
                  </Text>
                  <Text style={styles.time}>Reciente</Text>

                  <View style={styles.actionCard}>
                    <Text style={styles.actionPrompt}>¿Quieres ser su amigo?</Text>
                    <View style={{ flexDirection: 'row', gap: 10 }}>
                      <TouchableOpacity style={styles.actionBtn} onPress={() => handleAction(req.id, 'aceptar')}>
                        <Text style={styles.actionBtnText}>Aceptar</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[styles.actionBtn, { backgroundColor: COLORS.background, borderWidth: 1, borderColor: COLORS.border }]}
                        onPress={() => handleAction(req.id, 'rechazar')}
                      >
                        <Text style={[styles.actionBtnText, { color: COLORS.textSecondary }]}>Ignorar</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </View>
            ))}

            {/* MENCIONES (Mantenemos tu diseño de ejemplo por ahora) */}
            {(activeTab === 'Todo' || activeTab === 'Menciones') && (
              <View style={{ opacity: 0.6 }}>
                <Text style={styles.emptyText}>No tienes menciones nuevas</Text>
              </View>
            )}
          </>
        )}
      </ScrollView>
    </View>
  );
}

// MANTENEMOS TUS ESTILOS ORIGINALES SIN CAMBIAR NADA
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { padding: SIZES.md },
  title: { ...globalStyles.title, marginBottom: SIZES.md, fontSize: 24 },
  tabs: { flexDirection: 'row', gap: SIZES.md },
  tab: { paddingVertical: 10, paddingHorizontal: 20, borderRadius: 14, backgroundColor: COLORS.surface },
  activeTab: { backgroundColor: COLORS.primary },
  tabText: { fontSize: 14, fontWeight: '800', color: COLORS.textSecondary },
  activeTabText: { color: COLORS.surface },
  content: { padding: SIZES.md, paddingBottom: 100 },
  activityItem: { flexDirection: 'row', marginBottom: SIZES.lg, padding: SIZES.sm, backgroundColor: COLORS.surface, borderRadius: 24, borderWidth: 1, borderColor: COLORS.border },
  avatarContainer: { position: 'relative' },
  typeBadge: { position: 'absolute', bottom: -2, right: -2, width: 24, height: 24, borderRadius: 12, justifyContent: 'center', alignItems: 'center', borderWidth: 3, borderColor: COLORS.surface },
  activityInfo: { flex: 1, marginLeft: SIZES.md, marginRight: SIZES.sm },
  activityText: { fontSize: 15, color: COLORS.textPrimary, lineHeight: 22, fontWeight: '600' },
  bold: { fontWeight: '900', color: COLORS.primary },
  time: { fontSize: 12, color: COLORS.textTertiary, marginTop: 4, fontWeight: '700' },
  moreBtn: { padding: 4, alignSelf: 'flex-start' },
  actionCard: { marginTop: SIZES.md, padding: SIZES.md, backgroundColor: COLORS.background, borderRadius: 20, borderWidth: 1, borderColor: COLORS.border, alignItems: 'center' },
  actionPrompt: { fontSize: 14, fontWeight: '800', color: COLORS.textPrimary, marginBottom: SIZES.md, textAlign: 'center' },
  actionBtn: { backgroundColor: COLORS.primary, paddingHorizontal: 24, paddingVertical: 12, borderRadius: 14, shadowColor: COLORS.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8, elevation: 4 },
  actionBtnText: { color: COLORS.surface, fontSize: 13, fontWeight: '900' },
  emptyText: { textAlign: 'center', color: COLORS.textTertiary, marginTop: 20, fontWeight: '700' }
});