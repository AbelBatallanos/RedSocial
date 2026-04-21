import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Heart, Star, MoreHorizontal } from 'lucide-react-native';
import { COLORS, SIZES, globalStyles } from '../../src/styles/theme';
import { Avatar } from '../../src/components/ui/Avatar';

const ACTIVITIES = [
  { 
    id: '1', 
    type: 'recommendation', 
    user: { name: 'carlos_dev', avatar: 'https://api.dicebear.com/7.x/avataaars/png?seed=carlos' }, 
    text: 'te envió una recomendación directamente: "El Rey del Sushi".',
    time: 'Hace 10 m',
    action: 'Calificar',
    icon: <Star size={14} stroke={COLORS.surface} fill={COLORS.surface} />
  },
  { 
    id: '2', 
    type: 'like', 
    user: { name: 'ana_garcia', avatar: 'https://api.dicebear.com/7.x/avataaars/png?seed=ana' }, 
    text: 'le dio 5 estrellas a tu recomendación de \"MacBook Air M2\".',
    time: 'Hace 2 h',
    icon: <Heart size={14} stroke={COLORS.surface} fill={COLORS.surface} />
  },
];

export default function ActivityScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.title}>Actividad</Text>
        <View style={styles.tabs}>
          <TouchableOpacity style={[styles.tab, styles.activeTab]}>
            <Text style={[styles.tabText, styles.activeTabText]}>Todo</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.tab}>
            <Text style={styles.tabText}>Menciones</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        {ACTIVITIES.map(item => (
          <View key={item.id} style={styles.activityItem}>
            <View style={styles.avatarContainer}>
              <Avatar source={item.user.avatar} name={item.user.name} size={52} />
              <View style={[styles.typeBadge, { backgroundColor: item.type === 'like' ? COLORS.secondary : COLORS.primary }]}>
                {item.icon}
              </View>
            </View>
            
            <View style={styles.activityInfo}>
              <Text style={styles.activityText}>
                <Text style={styles.bold}>{item.user.name}</Text> {item.text}
              </Text>
              <Text style={styles.time}>{item.time}</Text>
              
              {item.action && (
                <View style={styles.actionCard}>
                  <Text style={styles.actionPrompt}>Ya probaste El Rey del Sushi?</Text>
                  <TouchableOpacity style={styles.actionBtn}>
                    <Text style={styles.actionBtnText}>{item.action} Ahora</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
            <TouchableOpacity style={styles.moreBtn}>
              <MoreHorizontal size={18} stroke={COLORS.textTertiary} />
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    padding: SIZES.md,
  },
  title: {
    ...globalStyles.title,
    marginBottom: SIZES.md,
    fontSize: 24,
  },
  tabs: {
    flexDirection: 'row',
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
    color: COLORS.textSecondary,
  },
  activeTabText: {
    color: COLORS.surface,
  },
  content: {
    padding: SIZES.md,
    paddingBottom: 100,
  },
  activityItem: {
    flexDirection: 'row',
    marginBottom: SIZES.lg,
    padding: SIZES.sm,
    backgroundColor: COLORS.surface,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  avatarContainer: {
    position: 'relative',
  },
  typeBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: COLORS.surface,
  },
  activityInfo: {
    flex: 1,
    marginLeft: SIZES.md,
    marginRight: SIZES.sm,
  },
  activityText: {
    fontSize: 15,
    color: COLORS.textPrimary,
    lineHeight: 22,
    fontWeight: '600',
  },
  bold: {
    fontWeight: '900',
    color: COLORS.primary,
  },
  time: {
    fontSize: 12,
    color: COLORS.textTertiary,
    marginTop: 4,
    fontWeight: '700',
  },
  moreBtn: {
    padding: 4,
    alignSelf: 'flex-start',
  },
  actionCard: {
    marginTop: SIZES.md,
    padding: SIZES.md,
    backgroundColor: COLORS.background,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
  },
  actionPrompt: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.textPrimary,
    marginBottom: SIZES.md,
    textAlign: 'center',
  },
  actionBtn: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 14,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  actionBtnText: {
    color: COLORS.surface,
    fontSize: 13,
    fontWeight: '900',
  },
});
