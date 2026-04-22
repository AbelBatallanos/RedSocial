import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { Stack } from 'expo-router';
import { obtenerTodosLosUsuarios } from '../src/services/api';
import { useAuthContext } from '../src/context/AuthContext';
import { Avatar } from '../src/components/ui/Avatar';
import { COLORS, SIZES } from '../src/styles/theme';

interface User {
  id: string;
  nombre_usuario: string;
  avatar?: string;
  biografia?: string;
}

export default function AllUsersScreen() {
  const { token } = useAuthContext();
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    obtenerTodosLosUsuarios(token!).then(setUsers);
  }, []);

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: 'Descubrir personas', headerTintColor: COLORS.textPrimary }} />
      <FlatList 
        data={users}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: SIZES.md }}
        renderItem={({ item }) => (
          <View style={styles.userItem}>
            <Avatar name={item.nombre_usuario} source={item.avatar} size={50} />
            <View style={{ flex: 1, marginLeft: 10 }}>
              <Text style={{ color: COLORS.textPrimary, fontWeight: '800' }}>@{item.nombre_usuario}</Text>
              <Text style={{ color: COLORS.textSecondary, fontSize: 12 }}>{item.biografia || 'Sin biografía'}</Text>
            </View>
            <TouchableOpacity style={styles.btn}>
              <Text style={{ color: COLORS.surface, fontWeight: '900' }}>Seguir</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  userItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 15, backgroundColor: COLORS.surface, padding: 12, borderRadius: 15 },
  btn: { backgroundColor: COLORS.primary, paddingVertical: 8, paddingHorizontal: 15, borderRadius: 10 }
});